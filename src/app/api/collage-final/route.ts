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

    // Randomly select a style (or use goals to determine)
    const styles = [
      {
        // Sample 1 style: Beige elegant
        prompt: `Vision board photo collage using EXACTLY these reference images @img0 @img1 @img2: Arrange 12-15 polaroid photos scattered on warm beige background. Title "Make it Happen Vision Board 2023!". Include: Paris Eiffel Tower, modern luxury house, garden path, woman at sunset beach, meditation pose, gold coins money, minimalist interior, text labels "Traveling", "Meditation", "I Love What I Do". NO new faces - use reference images only. Warm aesthetic, aspirational. Goals: ${goals}`,
        bg: "beige"
      },
      {
        // Sample 2 style: Dark magazine
        prompt: `Magazine cutout collage using ONLY reference images @img0 @img1 @img2: Dense overlapping layout on BLACK background. Bold text "VISION BOARD", "2025", "FINANCIAL FREEDOM", "PASSIVE INCOME", "Soul Sisters". Mix of: person celebrating (from references), luxury items, travel scenes, money/coins, motivational quotes. Urban powerful vibe. DO NOT generate new people - use references. Goals: ${goals}`,
        bg: "black"
      },
      {
        // Sample 3 style: White polaroids scattered
        prompt: `Scattered polaroid collage with reference photos @img0 @img1 @img2: 15+ white-framed polaroids at diagonal angles on neutral background. Center text "2025 Guided Vision Board affirmations included ♡". Include: cozy lifestyle scenes, travel destinations, pets, healthy food, nature, beach. Use ONLY the reference images provided - no new people. Warm cozy aesthetic. Goals: ${goals}`,
        bg: "neutral"
      },
      {
        // Sample 4 style: Torn paper affirmations
        prompt: `Torn paper collage using reference images @img0 @img1 @img2: Overlapping photos with torn edges, handwritten affirmations. Text: "Money flows to me effortlessly", "I nourish my body mind and soul", "2025", "Grateful glowing & growing", "Growth over perfection", "I am capable", "Confidence courage and clarity". Mix travel, food, wellness, nature scenes. Use reference images - do not create new faces. Personal growth aesthetic. Goals: ${goals}`,
        bg: "warm"
      }
    ];

    // Select style based on goals or random
    const selectedStyle = styles[Math.floor(Math.random() * styles.length)];
    const collagePrompt = selectedStyle.prompt;

    console.log(`Selected collage style: ${selectedStyle.bg} background`);

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
