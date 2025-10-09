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

    // Build detailed, descriptive prompt
    const collagePrompt = `ULTRA HIGH QUALITY vision board collage in magazine cutout aesthetic. 90% surface coverage with overlapping torn-edge polaroid photos on warm beige background.

CRITICAL - Use ONLY these reference images consistently throughout:
${hasSelfie ? '- @userPhoto (the main person) must appear in multiple scenarios' : ''}
${hasCar ? '- @dreamCar (their actual dream car)' : ''}
${hasHouse ? '- @dreamHouse (their actual dream house)' : ''}

REQUIRED ELEMENTS (arrange in scattered, overlapping layout):

CENTER FOCUS:
${hasSelfie ? '- Large polaroid: @userPhoto celebrating success, arms raised, confident, golden hour lighting' : ''}
${hasSelfie ? '- Medium polaroid: @userPhoto doing yoga/meditation at sunrise, peaceful, ocean view' : ''}
${hasSelfie && hasCar ? '- Medium polaroid: @userPhoto driving @dreamCar, happy, open road' : ''}
${hasSelfie && hasHouse ? '- Medium polaroid: @userPhoto standing proudly in front of @dreamHouse' : ''}

SURROUNDING ELEMENTS (smaller polaroids scattered around):
${hasHouse ? '- @dreamHouse exterior in golden hour light' : '- Modern luxury house exterior, warm tones'}
${hasCar ? '- @dreamCar on scenic mountain road' : '- Luxury sports car on coastal highway'}
- Eiffel Tower Paris street view, autumn, romantic
- Tropical beach with turquoise water and palm trees
${hasSelfie ? '- @userPhoto at beach sunset, peaceful' : '- Person at beach sunset'}
- Healthy acai bowl with fresh berries, aesthetic overhead shot
- Morning coffee latte art, cozy cafe vibes
- Luxury modern interior with natural light
- Sunset meditation scene, warm golden tones

HANDWRITTEN TEXT (scattered elegantly):
- "I am growing" (flowing script)
- "Grateful" (elegant cursive)
- "2025" (bold)
- "Dreams manifest" (soft script)
- "${goals.split(',')[0]}" (highlight main goal)

STYLE REQUIREMENTS:
- Torn white borders on all polaroid photos
- Various sizes: 3 large, 5 medium, 7 small polaroids
- Tilted at different angles (5-20 degrees)
- Heavy overlap creating depth
- Warm color palette: beige, cream, soft gold
- Film photography aesthetic with slight grain
- NO empty corners - fill entire space densely
- Professional magazine editorial quality

Goals theme: ${goals}`;

    console.log(`Prompt length: ${collagePrompt.length} characters`);

    // Use the better model with references
    const model = referenceImages.length > 0 ? "gen4_image_turbo" : "gen4_image";

    const requestData = {
      model: model as "gen4_image_turbo" | "gen4_image",
      promptText: collagePrompt,
      ratio: "1080:1920" as const, // Vertical format for phone wallpaper
      ...(referenceImages.length > 0 && { referenceImages })
    };

    console.log(`Using model: ${model}`);
    console.log("Sending request to Runway AI...");

    const imageResponse = await runway.textToImage.create(requestData);

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
