import { NextRequest, NextResponse } from "next/server";
import RunwayML from "@runwayml/sdk";

export async function POST(request: NextRequest) {
  const runway = new RunwayML({
    apiKey: process.env.RUNWAYML_API_SECRET || "",
  });

  try {
    const { generatedImages, goals } = await request.json();

    if (!generatedImages || !Array.isArray(generatedImages) || generatedImages.length === 0) {
      return NextResponse.json(
        { error: "Generated images array is required" },
        { status: 400 }
      );
    }

    console.log(`Creating final collage from ${generatedImages.length} images...`);

    // Create a prompt for the final collage composition
    const collagePrompt = `Vision board collage in magazine cutout style: overlapping photos arranged densely on dark background. Include motivational text labels like "VISION BOARD", "2025", "FINANCIAL FREEDOM", "DREAM BIG", scattered throughout. Magazine aesthetic, inspirational, powerful, feminine energy. Goals: ${goals}`;

    // Runway API allows max 3 reference images - use best variety
    const referenceImages = generatedImages.slice(0, 3).map((url: string, idx: number) => ({
      uri: url,
      tag: `img${idx}`
    }));

    const requestData = {
      model: "gen4_image_turbo" as const,
      promptText: collagePrompt,
      ratio: "1080:1920" as const, // Vertical phone wallpaper format
      referenceImages: referenceImages
    };

    console.log("Creating final collage with reference to generated images...");

    const imageResponse = await runway.textToImage.create(requestData);

    // Poll for completion
    let taskResult = await runway.tasks.retrieve(imageResponse.id);
    let attempts = 0;

    while (taskResult.status !== "SUCCEEDED" && attempts < 60) {
      if (taskResult.status === "FAILED") {
        throw new Error(`Collage generation failed: ${taskResult.failure}`);
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
      taskResult = await runway.tasks.retrieve(imageResponse.id);
      attempts++;
    }

    if (taskResult.status === "SUCCEEDED" && taskResult.output) {
      const finalCollageUrl = Array.isArray(taskResult.output)
        ? taskResult.output[0]
        : taskResult.output;

      console.log("✓ Final collage created successfully!");

      return NextResponse.json({
        collageUrl: finalCollageUrl,
        success: true
      });
    } else {
      throw new Error("Collage generation timeout");
    }

  } catch (error: unknown) {
    console.error("Error creating final collage:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to create collage",
        details: error instanceof Error ? error.stack : String(error),
      },
      { status: 500 }
    );
  }
}
