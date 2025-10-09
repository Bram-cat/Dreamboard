import { NextRequest, NextResponse } from "next/server";
import RunwayML from "@runwayml/sdk";

export async function POST(request: NextRequest) {
  const runway = new RunwayML({
    apiKey: process.env.RUNWAYML_API_SECRET || "",
  });

  try {
    const { generatedImages, goals, categorizedUploads } = await request.json();

    if (!generatedImages || !Array.isArray(generatedImages) || generatedImages.length === 0) {
      return NextResponse.json(
        { error: "Generated images array is required" },
        { status: 400 }
      );
    }

    console.log(`Creating final collage from ${generatedImages.length} generated images...`);

    const uploadCount = Object.values(categorizedUploads || {}).filter(Boolean).length;
    console.log(`User uploaded ${uploadCount} categorized images`);

    // Create diverse collage prompts based on different sample styles
    const hasUserPhotos = categorizedUploads?.selfie || false;

    // Create SHORT prompt (max 1000 chars for Runway API)
    // Focus on 90% coverage with dense overlapping elements
    const userRef = hasUserPhotos ? '@userPhoto' : 'woman';
    const collagePrompt = `ULTRA DENSE vision board collage: Magazine cutout aesthetic with heavily overlapping torn paper edges and polaroid frames. 90% surface coverage, minimal background visible. Center features ${userRef} achieving goals. Layer cutouts diagonally from all corners. Include multiple small polaroids of: luxury house, Paris Eiffel Tower, ${userRef} doing yoga, beach sunset, healthy food, meditation, fitness scenes. Handwritten affirmations scattered: "I am growing", "Grateful", "2025", "Dreams manifest". Mix orientations: some tilted 15°. Torn white borders on all cutouts. Warm beige/cream background barely visible. NO empty corners. Pack tightly like magazine mood board. Goals theme: ${goals}`;

    console.log(`Prompt length: ${collagePrompt.length} characters`);

    // Use user selfie as reference if available (must be data URI, not URL)
    const referenceImages = [];
    if (hasUserPhotos && typeof hasUserPhotos === 'string' && hasUserPhotos.startsWith('data:')) {
      referenceImages.push({
        uri: hasUserPhotos,
        tag: 'userPhoto'
      });
    }

    console.log(`Using ${referenceImages.length} reference images for collage`);

    // Use gen4_image if no references (it doesn't require reference images)
    const model = referenceImages.length > 0 ? "gen4_image_turbo" : "gen4_image";

    const requestData = {
      model: model as "gen4_image_turbo" | "gen4_image",
      promptText: collagePrompt,
      ratio: "1080:1920" as const, // Vertical phone wallpaper format
      ...(referenceImages.length > 0 && { referenceImages })
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
