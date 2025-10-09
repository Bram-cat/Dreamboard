import { NextRequest, NextResponse } from "next/server";
import RunwayML from "@runwayml/sdk";

export async function POST(request: NextRequest) {
  const runway = new RunwayML({
    apiKey: process.env.RUNWAYML_API_SECRET || "",
  });

  try {
    const { goals, categorizedUploads, uploadContext } = await request.json();

    if (!goals || typeof goals !== "string") {
      return NextResponse.json(
        { error: "Goals text is required" },
        { status: 400 }
      );
    }

    console.log("Creating vision board collage directly...");
    console.log("User goals:", goals);
    console.log("Uploaded:", uploadContext);

    // Build reference images array (only data URIs work)
    const referenceImages = [];

    if (categorizedUploads?.selfie && categorizedUploads.selfie.startsWith('data:')) {
      referenceImages.push({
        uri: categorizedUploads.selfie,
        tag: 'userPhoto'
      });
      console.log("Using selfie as @userPhoto reference");
    }

    if (categorizedUploads?.dreamCar && categorizedUploads.dreamCar.startsWith('data:')) {
      referenceImages.push({
        uri: categorizedUploads.dreamCar,
        tag: 'dreamCar'
      });
      console.log("Using dream car as @dreamCar reference");
    }

    if (categorizedUploads?.dreamHouse && categorizedUploads.dreamHouse.startsWith('data:')) {
      referenceImages.push({
        uri: categorizedUploads.dreamHouse,
        tag: 'dreamHouse'
      });
      console.log("Using dream house as @dreamHouse reference");
    }

    console.log(`Total reference images: ${referenceImages.length}`);

    // Create highly detailed prompt that uses ALL uploaded references
    const hasSelfie = uploadContext?.hasSelfie || false;
    const hasCar = uploadContext?.hasDreamCar || false;
    const hasHouse = uploadContext?.hasDreamHouse || false;
    const hasDestination = uploadContext?.hasDestination || false;

    // Build CONCISE but detailed prompt (under 1000 chars for Runway limit)
    const userRef = hasSelfie ? '@userPhoto' : 'woman';
    const carRef = hasCar ? '@dreamCar' : 'luxury car';
    const houseRef = hasHouse ? '@dreamHouse' : 'modern house';

    const collagePrompt = `Dense vision board collage, magazine cutout style, 90% coverage, warm beige background. Overlapping torn-edge polaroids at various angles.

CENTER: ${userRef} celebrating success golden hour. ${userRef} yoga meditation sunrise. ${hasSelfie && hasCar ? `${userRef} driving ${carRef} happy.` : ''} ${hasSelfie && hasHouse ? `${userRef} at ${houseRef} proud.` : ''}

AROUND: ${houseRef} exterior warm light. ${carRef} scenic road. Eiffel Tower Paris autumn. Tropical beach turquoise water. ${userRef} beach sunset. Acai bowl berries overhead. Coffee latte art cozy. Luxury interior natural light. Meditation sunset golden.

TEXT scattered: "I am growing", "Grateful", "2025", "Dreams manifest", "${goals.split(',')[0].trim()}".

STYLE: Torn white borders, 3 large 5 medium 7 small polaroids, tilted 5-20°, heavy overlap, warm beige/cream/gold palette, film grain, NO empty corners, magazine quality.

Goals: ${goals}`;

    console.log(`Prompt length: ${collagePrompt.length} characters`);

    // Use the better model with references
    const model = referenceImages.length > 0 ? "gen4_image_turbo" : "gen4_image";

    // Validate aspect ratio (must be between 0.5 and 2.0)
    // 1080:1920 = 0.5625 ✓
    const requestData = {
      model: model as "gen4_image_turbo" | "gen4_image",
      promptText: collagePrompt,
      ratio: "1080:1920" as const, // 9:16 vertical (0.5625 ratio - valid)
      ...(referenceImages.length > 0 && { referenceImages })
    };

    console.log(`Using model: ${model}`);
    console.log("Request data:", JSON.stringify({
      model: requestData.model,
      promptLength: requestData.promptText.length,
      ratio: requestData.ratio,
      hasReferences: !!requestData.referenceImages,
      numReferences: requestData.referenceImages?.length || 0
    }));

    let imageResponse;
    try {
      imageResponse = await runway.textToImage.create(requestData);
      console.log("Task created, ID:", imageResponse.id);
    } catch (createError: unknown) {
      console.error("Failed to create Runway task:", createError);
      if (createError && typeof createError === 'object' && 'message' in createError) {
        throw new Error(`Runway API error: ${(createError as Error).message}`);
      }
      throw new Error(`Runway API error: ${String(createError)}`);
    }

    // Poll for completion
    let taskResult = await runway.tasks.retrieve(imageResponse.id);
    let attempts = 0;

    while (taskResult.status !== "SUCCEEDED" && attempts < 90) {
      if (taskResult.status === "FAILED") {
        console.error("Task failed:", taskResult.failure);
        throw new Error(`Runway generation failed: ${taskResult.failure || 'Unknown error'}`);
      }
      await new Promise((resolve) => setTimeout(resolve, 3000)); // 3 second intervals
      taskResult = await runway.tasks.retrieve(imageResponse.id);
      attempts++;

      if (attempts % 10 === 0) {
        console.log(`Still processing... (${attempts * 3}s elapsed)`);
      }
    }

    if (taskResult.status === "SUCCEEDED" && taskResult.output) {
      const collageUrl = Array.isArray(taskResult.output)
        ? taskResult.output[0]
        : taskResult.output;

      console.log("✓ Vision board created successfully!");

      return NextResponse.json({
        collageUrl,
        success: true
      });
    } else {
      throw new Error("Vision board generation timeout after 4.5 minutes");
    }

  } catch (error: unknown) {
    console.error("Error creating vision board:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to create vision board",
        details: error instanceof Error ? error.stack : String(error),
      },
      { status: 500 }
    );
  }
}
