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

    console.log(`Generating ${prompts.length} images with Runway AI...`);

    const generatedImages: string[] = [];
    const errors: string[] = [];

    // Generate images concurrently (but with rate limiting)
    const batchSize = 3; // Process 3 at a time to avoid rate limits
    for (let i = 0; i < prompts.length; i += batchSize) {
      const batch = prompts.slice(i, i + batchSize);
      const batchPromises = batch.map(async (prompt: string, index: number) => {
        try {
          console.log(
            `Generating image ${i + index + 1}/${
              prompts.length
            }: ${prompt.substring(0, 50)}...`
          );

          // Prepare request with reference images if available
          // Check if prompt needs user reference image
          const shouldUseReference = prompt.toLowerCase().includes("person from reference") ||
                                      prompt.toLowerCase().includes("from reference photo");

          const hasReferenceImages = userImages && userImages.length > 0 && shouldUseReference;

          // If using reference images, update the prompt to include the tag
          let finalPrompt = prompt;
          if (hasReferenceImages) {
            // Replace "person from reference photo" with "@userPhoto" tag reference
            finalPrompt = prompt
              .replace(/person from reference photo/gi, "@userPhoto")
              .replace(/person from reference/gi, "@userPhoto")
              .replace(/from reference photo/gi, "@userPhoto");
          }

          const requestData = {
            model: "gen4_image_turbo",
            promptText: finalPrompt,
            ratio: "1024:1024",
            ...(hasReferenceImages && {
              referenceImages: [{
                uri: userImages[0], // Data URI from user upload
                tag: "userPhoto" // Tag referenced as @userPhoto in prompt
              }]
            })
          } as const;

          if (hasReferenceImages) {
            console.log("Using reference image with tag @userPhoto");
          }

          const imageResponse = await runway.textToImage.create(requestData);

          // Wait for the task to complete
          const taskId = imageResponse.id;
          let taskResult = await runway.tasks.retrieve(taskId);

          // Poll until complete (max 60 seconds)
          let attempts = 0;
          while (taskResult.status !== "SUCCEEDED" && attempts < 30) {
            if (taskResult.status === "FAILED") {
              throw new Error(`Task failed: ${taskResult.failure}`);
            }
            await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds
            taskResult = await runway.tasks.retrieve(taskId);
            attempts++;
          }

          if (taskResult.status === "SUCCEEDED" && taskResult.output) {
            const imageUrl = Array.isArray(taskResult.output)
              ? taskResult.output[0]
              : taskResult.output;
            generatedImages.push(imageUrl);
            console.log(` Generated image ${i + index + 1}/${prompts.length}`);
          } else {
            throw new Error("Task did not complete in time");
          }
        } catch (error: unknown) {
          console.error(`Error generating image ${i + index + 1}:`, error);

          let errorMessage = "Unknown error";
          if (error instanceof Error) {
            errorMessage = error.message;
          } else if (error && typeof error === 'object' && 'response' in error) {
            const apiError = error as { response?: { data?: { error?: string } } };
            if (apiError.response?.data?.error) {
              errorMessage = apiError.response.data.error;
            }
          }

          errors.push(`Prompt ${i + index + 1}: ${errorMessage}`);
        }
      });

      await Promise.all(batchPromises);

      // Small delay between batches
      if (i + batchSize < prompts.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    console.log(
      `Successfully generated ${generatedImages.length}/${prompts.length} images`
    );

    if (generatedImages.length === 0) {
      return NextResponse.json(
        {
          error: "Failed to generate any images",
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
    console.error("Error generating images with Runway:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to generate images",
        details: error instanceof Error ? error.stack : String(error),
      },
      { status: 500 }
    );
  }
}
