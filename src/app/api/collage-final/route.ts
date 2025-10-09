import { NextRequest, NextResponse } from "next/server";
import RunwayML from "@runwayml/sdk";

export async function POST(request: NextRequest) {
  const runway = new RunwayML({
    apiKey: process.env.RUNWAYML_API_SECRET || "",
  });

  try {
    const { generatedImages, goals, userImages } = await request.json();

    if (!generatedImages || !Array.isArray(generatedImages) || generatedImages.length === 0) {
      return NextResponse.json(
        { error: "Generated images array is required" },
        { status: 400 }
      );
    }

    console.log(`Creating final collage from ${generatedImages.length} generated images...`);
    console.log(`User uploaded ${userImages?.length || 0} personal images`);

    // Create a prompt for the final collage composition
    const collagePrompt = `Vision board collage in magazine cutout style: overlapping photos arranged densely on dark background. Include motivational text labels like "VISION BOARD", "2025", "FINANCIAL FREEDOM", "DREAM BIG", scattered throughout. Magazine aesthetic, inspirational, powerful, feminine energy. Incorporate user's personal photos naturally. Goals: ${goals}`;

    // Combine user images (if any) with generated images for references
    // Priority: user images first (they're most personal), then generated images
    // Max 3 references total
    const allReferenceImages = [];

    // Add user's uploaded images first (max 2)
    if (userImages && userImages.length > 0) {
      const userRefs = userImages.slice(0, 2).map((url: string, idx: number) => ({
        uri: url,
        tag: `userImg${idx}`
      }));
      allReferenceImages.push(...userRefs);
    }

    // Fill remaining slots with generated images
    const remainingSlots = 3 - allReferenceImages.length;
    if (remainingSlots > 0) {
      const genRefs = generatedImages.slice(0, remainingSlots).map((url: string, idx: number) => ({
        uri: url,
        tag: `genImg${idx}`
      }));
      allReferenceImages.push(...genRefs);
    }

    const referenceImages = allReferenceImages;

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
