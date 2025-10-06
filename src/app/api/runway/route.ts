import { NextRequest, NextResponse } from "next/server";
import RunwayML from "@runwayml/sdk";

const runway = new RunwayML({
  apiKey: process.env.RUNWAYML_API_KEY,
});

export async function POST(request: NextRequest) {
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
          type RunwayModel =
            | "gen4_image_turbo"
            | "gen4_image"
            | "gemini_2.5_flash";

          interface RunwayRequestData {
            model: RunwayModel;
            promptText: string;
            ratio:
              | "1920:1080"
              | "1080:1920"
              | "1024:1024"
              | "1360:768"
              | "1080:1080"
              | "1168:880"
              | "1440:1080"
              | "1080:1440"
              | "1808:768"
              | "2112:912"
              | "1280:720"
              | "720:1280"
              | "720:720"
              | "1536:672";
            referenceImageUrl?: string;
            referenceImageStrength?: number;
          }

          const requestData: RunwayRequestData = {
            model: "gen4_image_turbo", // Faster and cheaper model
            promptText: prompt,
            ratio: "1024:1024", // Square format for polaroid style
          };

          // Add reference images if user provided them
          if (userImages && userImages.length > 0) {
            // Use user images as reference for some generations
            const useReference = (i + index) % 3 === 0; // Every 3rd image uses reference
            if (useReference && userImages.length > 0) {
              // Use the first image as reference
              requestData.referenceImageUrl = userImages[0];
            }
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
          const errorMessage =
            error instanceof Error
              ? error.message
              : "An unknown error occurred";
          console.error(
            `Error generating image ${i + index + 1}:`,
            errorMessage
          );
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
