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
    const collagePrompt = `ULTRA DENSE vision board collage using ALL reference images @img0 @img1 @img2: Magazine cutout aesthetic, heavily overlapping torn paper edges, polaroid frames, 90% surface coverage, minimal background visible. Layer images diagonally: top-left to bottom-right, bottom-left to top-right. Include handwritten affirmations: "I am growing", "Grateful", "2025", "Dreams manifest". Mix orientations: some tilted 15°, some straight. Torn white borders on cutouts. Warm beige/cream background barely visible. NO empty corners. Pack tightly like ${hasUserPhotos ? 'sample vision boards' : 'magazine mood board'}. Goals: ${goals}`;

    console.log(`Prompt length: ${collagePrompt.length} characters`);

    // Helper function to validate image aspect ratio (must be 0.5 to 2.0)
    const validateImageAspectRatio = async (imageUri: string): Promise<boolean> => {
      try {
        // For data URIs, we can't easily validate without loading
        // For now, skip data URIs (user uploads) and only use generated images
        if (imageUri.startsWith('data:')) {
          console.log('Skipping data URI (cannot validate aspect ratio easily)');
          return false;
        }
        return true; // Generated images from Runway are always valid
      } catch {
        return false;
      }
    };

    // Use only generated images for now (they have valid aspect ratios)
    // User images (data URIs) might have invalid ratios
    const allReferenceImages = [];

    // Use generated images (always have valid 1:1 ratio)
    const genRefs = generatedImages.slice(0, 3).map((url: string, idx: number) => ({
      uri: url,
      tag: `img${idx}`
    }));
    allReferenceImages.push(...genRefs);

    const referenceImages = allReferenceImages;

    console.log(`Using ${referenceImages.length} reference images for collage`);

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
