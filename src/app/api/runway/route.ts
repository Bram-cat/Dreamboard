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

    console.log(`Generating complete vision board collage with Runway AI...`);
    console.log(`Prompt: ${prompts[0].substring(0, 200)}...`);

    const generatedImages: string[] = [];
    const errors: string[] = [];

    // Generate ONE complete vision board collage (not multiple individual images)
    const prompt = prompts[0]; // Should only be one prompt for the full collage

    try {
      console.log(`Creating vision board collage...`);

      // Check if prompt needs user reference image (uses @userPhoto tag)
      const shouldUseReference = prompt.includes("@userPhoto");
      const hasReferenceImages = userImages && userImages.length > 0 && shouldUseReference;

      const requestData = {
        model: "gen4_image_turbo",
        promptText: prompt,
        ratio: "16:9", // Wider ratio better for collage layout
        ...(hasReferenceImages && {
          referenceImages: [{
            uri: userImages[0], // Data URI from user upload
            tag: "userPhoto" // Tag referenced as @userPhoto in prompt
          }]
        })
      } as const;

      if (hasReferenceImages) {
        console.log("Using user selfie as reference with tag @userPhoto");
      }

      const imageResponse = await runway.textToImage.create(requestData);

      // Wait for the task to complete
      const taskId = imageResponse.id;
      let taskResult = await runway.tasks.retrieve(taskId);

      // Poll until complete (max 120 seconds for complex collage generation)
      let attempts = 0;
      while (taskResult.status !== "SUCCEEDED" && attempts < 60) {
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
        console.log(`✓ Generated complete vision board collage successfully`);
      } else {
        throw new Error("Task did not complete in time");
      }
    } catch (error: unknown) {
      console.error(`Error generating vision board:`, error);

      let errorMessage = "Unknown error";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as { response?: { data?: { error?: string } } };
        if (apiError.response?.data?.error) {
          errorMessage = apiError.response.data.error;
        }
      }

      errors.push(errorMessage);
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
