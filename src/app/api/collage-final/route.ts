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

    // Create diverse collage prompts based on different sample styles
    const hasUserPhotos = userImages && userImages.length > 0;

    // Create ONE comprehensive dense collage prompt
    // CRITICAL: Must be DENSE with NO empty space, like samples
    const collagePrompt = `DENSE magazine vision board collage - CRITICAL: FILL ENTIRE IMAGE, NO EMPTY SPACE!

Style: Magazine cutout aesthetic exactly like reference samples. Overlapping torn paper edges, scattered photos, text overlays.

Layout: Warm beige/peach gradient background. CENTER: Large scene of person (from @img0 @img1 @img2) doing yoga/meditation at sunset beach with Eiffel Tower and modern luxury house visible in background.

Surrounding DENSELY PACKED elements (MUST overlap, NO gaps):
- Top left: Eiffel Tower Paris autumn scene
- Top right: "2025 challe" handwritten text, hot air balloons
- Left side: "Grateful glowfully growing" handwritten affirmation
- Right side: "I am growing", "I am gravity" text
- Bottom: Modern luxury house torn paper cutout
- Scattered throughout: Small cutouts of meditation pose, yoga, sunset scenes

Text overlays in handwriting style:
- "Grateful"
- "glowfully"
- "growing"
- "I am growing"
- "I am gravity"
- "2025 challe"

CRITICAL REQUIREMENTS:
- Use ONLY images from @img0 @img1 @img2 references
- DO NOT generate new random people
- FILL ENTIRE SPACE - dense overlapping magazine aesthetic
- Torn paper edges on cutouts
- Warm peach/beige tones
- Handwritten text style

Goals: ${goals}`;

    console.log('Creating DENSE collage with torn paper magazine aesthetic');

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
