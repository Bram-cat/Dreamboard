import { NextRequest, NextResponse } from "next/server";
import RunwayML from "@runwayml/sdk";

export async function POST(request: NextRequest) {
  // Initialize Runway client (lazy load to avoid build-time errors)
  const runway = new RunwayML({
    apiKey: process.env.RUNWAYML_API_SECRET || "",
  });
  try {
    const { prompts, userImages } = await request.json();

    if (!prompts || !Array.isArray(prompts) || prompts.length === 0) {
      return NextResponse.json(
        { error: "Prompts array is required" },
        { status: 400 }
      );
    }

    console.log(`Generating ${prompts.length} individual images for vision board...`);

    const generatedImages: string[] = [];
    const errors: string[] = [];

    // Generate images in batches to avoid rate limits
    const batchSize = 3;
    for (let i = 0; i < prompts.length; i += batchSize) {
      const batch = prompts.slice(i, i + batchSize);
      const batchPromises = batch.map(async (prompt: string, index: number) => {
        try {
          const imageNum = i + index + 1;
          console.log(`[${imageNum}/${prompts.length}] Generating: ${prompt.substring(0, 60)}...`);

          // Check if prompt needs user reference image (uses @userPhoto tag)
          const shouldUseReference = prompt.includes("@userPhoto");
          const hasReferenceImages = userImages && userImages.length > 0 && shouldUseReference;

          // Build request - start simple without reference images for debugging
          const requestData: {
            model: string;
            promptText: string;
            ratio: string;
            referenceImages?: Array<{ uri: string; tag: string }>;
          } = {
            model: "gen4_image_turbo",
            promptText: prompt,
            ratio: "1024:1024"
          };

          // Only add reference images if needed and available
          if (hasReferenceImages) {
            requestData.referenceImages = [{
              uri: userImages[0],
              tag: "userPhoto"
            }];
            console.log(`Using reference image for prompt with @userPhoto tag`);
          }

          let imageResponse;
          try {
            imageResponse = await runway.textToImage.create(requestData);
          } catch (createError: unknown) {
            console.error(`Runway API create error for image ${imageNum}:`, createError);
            if (createError && typeof createError === 'object') {
              console.error('Error details:', JSON.stringify(createError, null, 2));
            }
            throw createError;
          }

          // Poll for completion
          let taskResult = await runway.tasks.retrieve(imageResponse.id);
          let attempts = 0;
          while (taskResult.status !== "SUCCEEDED" && attempts < 30) {
            if (taskResult.status === "FAILED") {
              throw new Error(`Task failed: ${taskResult.failure}`);
            }
            await new Promise((resolve) => setTimeout(resolve, 2000));
            taskResult = await runway.tasks.retrieve(imageResponse.id);
            attempts++;
          }

          if (taskResult.status === "SUCCEEDED" && taskResult.output) {
            const imageUrl = Array.isArray(taskResult.output)
              ? taskResult.output[0]
              : taskResult.output;
            generatedImages.push(imageUrl);
            console.log(`✓ [${imageNum}/${prompts.length}] Generated successfully`);
          } else {
            throw new Error("Task timeout");
          }
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : "Unknown error";
          console.error(`✗ [${i + index + 1}/${prompts.length}] Error:`, errorMessage);
          errors.push(`Image ${i + index + 1}: ${errorMessage}`);
        }
      });

      await Promise.all(batchPromises);

      // Delay between batches
      if (i + batchSize < prompts.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    console.log(
      `Generation complete: ${generatedImages.length > 0 ? 'Success' : 'Failed'}`
    );

    if (generatedImages.length === 0) {
      return NextResponse.json(
        {
          error: "Failed to generate vision board",
          details: errors,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      images: generatedImages,
      count: generatedImages.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: unknown) {
    console.error("Error generating vision board with Runway:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to generate vision board",
        details: error instanceof Error ? error.stack : String(error),
      },
      { status: 500 }
    );
  }
}
