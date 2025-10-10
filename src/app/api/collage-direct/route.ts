import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(request: NextRequest) {
  try {
    const { goals, categorizedUploads, uploadContext } = await request.json();

    if (!goals || typeof goals !== "string") {
      return NextResponse.json(
        { error: "Goals text is required" },
        { status: 400 }
      );
    }

    // Check API key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY not found in environment variables");
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    console.log("Creating vision board with Gemini 2.5 Flash Image...");
    console.log("User goals:", goals);
    console.log("Uploaded:", uploadContext);
    console.log("API Key present:", !!apiKey);

    // Initialize Gemini client
    const genai = new GoogleGenAI({ apiKey });

    // Prepare reference images for Gemini (convert data URIs to parts)
    const imageParts = [];

    if (categorizedUploads?.selfie && categorizedUploads.selfie.startsWith('data:')) {
      // Extract base64 data
      const base64Data = categorizedUploads.selfie.split(',')[1];
      const mimeType = categorizedUploads.selfie.split(';')[0].split(':')[1];
      imageParts.push({
        inlineData: {
          data: base64Data,
          mimeType: mimeType
        }
      });
      console.log("Added selfie as reference image");
    }

    if (categorizedUploads?.dreamCar && categorizedUploads.dreamCar.startsWith('data:')) {
      const base64Data = categorizedUploads.dreamCar.split(',')[1];
      const mimeType = categorizedUploads.dreamCar.split(';')[0].split(':')[1];
      imageParts.push({
        inlineData: {
          data: base64Data,
          mimeType: mimeType
        }
      });
      console.log("Added dream car as reference image");
    }

    if (categorizedUploads?.dreamHouse && categorizedUploads.dreamHouse.startsWith('data:')) {
      const base64Data = categorizedUploads.dreamHouse.split(',')[1];
      const mimeType = categorizedUploads.dreamHouse.split(';')[0].split(':')[1];
      imageParts.push({
        inlineData: {
          data: base64Data,
          mimeType: mimeType
        }
      });
      console.log("Added dream house as reference image");
    }

    console.log(`Total reference images: ${imageParts.length}`);

    // Build context about what images are available
    const hasSelfie = uploadContext?.hasSelfie || false;
    const hasCar = uploadContext?.hasDreamCar || false;
    const hasHouse = uploadContext?.hasDreamHouse || false;

    // Create detailed prompt for vision board collage
    const collagePrompt = `Create a DENSE vision board collage in magazine cutout aesthetic with 90% surface coverage.

CRITICAL REQUIREMENTS:
${imageParts.length > 0 ? `- Use the ${imageParts.length} reference image(s) provided. The person/car/house in these photos MUST appear throughout the collage.` : ''}
${hasSelfie ? '- The person in the first image is the main subject - show them in MULTIPLE scenarios' : ''}
${hasCar ? `- Include the car from the reference image in multiple scenes` : ''}
${hasHouse ? `- Include the house from the reference image prominently` : ''}

LAYOUT & STYLE:
- Magazine cutout style with torn white borders on all photo elements
- Overlapping polaroid-style photos at various angles (tilted 5-20 degrees)
- Mix of sizes: 3 large focal polaroids, 5 medium photos, 7 small accent photos
- Warm beige/cream background (barely visible due to density)
- Film photography aesthetic with subtle grain
- NO empty corners - pack tightly like a real vision board

CENTER FOCUS SCENES:
${hasSelfie ? `- Main subject celebrating success with arms raised, golden hour lighting, confident pose
- Main subject doing yoga or meditation at sunrise, peaceful expression, ocean or mountain view
${hasCar ? '- Main subject driving their dream car, happy expression, scenic open road' : ''}
${hasHouse ? '- Main subject standing proudly in front of their dream house, accomplished mood' : ''}` : '- Aspirational lifestyle scenes showing achievement and wellness'}

SURROUNDING ELEMENTS (15+ smaller polaroids scattered throughout):
${hasHouse ? '- The dream house exterior in warm golden hour light' : '- Modern luxury house with clean architecture'}
${hasCar ? '- The dream car on a scenic mountain road or coastal highway' : '- Luxury sports car in aspirational setting'}
- Eiffel Tower Paris street view, autumn colors, romantic atmosphere
- Tropical beach with turquoise water, palm trees, paradise vibes
${hasSelfie ? '- Main subject at beach during sunset, peaceful moment' : '- Beach sunset silhouette'}
- Healthy acai bowl with fresh berries and granola, aesthetic overhead shot
- Green smoothie bowl with chia seeds and fruit toppings
- Fresh salad with avocado and colorful vegetables
- Morning coffee with beautiful latte art, cozy cafe setting
- Yoga mat with water bottle and towel, fitness motivation
- Running shoes on a trail, active lifestyle
- Meditation cushion in peaceful zen garden
- Journal and pen on wooden table, self-care routine
- Face mask and spa items, wellness self-care
- Minimalist luxury bedroom with white linens
- Modern walk-in closet with organized clothing
- Sunset view from airplane window, wanderlust
- Stacked books on personal development
- Candles and essential oils, peaceful ambiance

INSPIRATIONAL QUOTES & TEXT (scattered elegantly, handwritten style):
- "I am growing" in flowing cursive
- "Grateful" in elegant script
- "2025" in bold handwriting
- "Dreams manifest" in soft feminine font
- "She believed she could, so she did"
- "Choose happiness"
- "Good vibes only"
- "Self-love is the best love"
- "Bloom where you are planted"
- "Live, laugh, love"
- "Be your own kind of beautiful"
- "Inhale confidence, exhale doubt"
- "Create your own sunshine"
- "${goals.split(',')[0].trim()}" featured prominently

QUALITY REQUIREMENTS:
- Professional magazine editorial quality
- Consistent person/car/house identity throughout (use reference images)
- Heavy overlap creating visual depth and interest
- Warm color palette: beige, cream, soft gold, warm neutrals
- All text must be legible and meaningful
- NO random unrelated people - only use the reference images provided

PRIMARY GOALS TO VISUALIZE: ${goals}

Remember: This is a PERSONAL vision board - every person shown must be the same individual from the reference photo. Create a cohesive, inspiring, magazine-quality collage that tells their unique story of achievement and aspiration.`;

    console.log(`Prompt length: ${collagePrompt.length} characters`);

    // Prepare content array for Gemini
    const contents = [...imageParts, { text: collagePrompt }];

    try {
      console.log("Sending request to Gemini API...");
      console.log("Contents array length:", contents.length);

      const response = await genai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: contents
      });

      console.log("Gemini response received");
      console.log("Response structure:", JSON.stringify({
        hasCandidates: !!response.candidates,
        numCandidates: response.candidates?.length || 0
      }));

      // Extract generated image from response
      if (!response || !response.candidates || response.candidates.length === 0) {
        throw new Error("No image generated by Gemini");
      }

      const candidate = response.candidates[0];
      if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
        throw new Error("No content parts in Gemini response");
      }

      // Find the image part
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const imagePart = candidate.content.parts.find((part: any) =>
        part.inlineData && part.inlineData.mimeType && part.inlineData.mimeType.startsWith('image/')
      );

      if (!imagePart || !imagePart.inlineData) {
        throw new Error("No image data in Gemini response");
      }

      // Convert base64 to data URI
      const imageDataUri = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;

      console.log("✓ Vision board created successfully with Gemini!");

      return NextResponse.json({
        collageUrl: imageDataUri,
        success: true,
        model: "gemini-2.5-flash-image"
      });

    } catch (apiError: unknown) {
      console.error("Gemini API error:", apiError);
      console.error("Error details:", JSON.stringify(apiError, null, 2));

      if (apiError && typeof apiError === 'object') {
        if ('message' in apiError) {
          throw new Error(`Gemini API error: ${(apiError as Error).message}`);
        }
        if ('error' in apiError) {
          const errObj = apiError as { error: { message?: string; details?: unknown } };
          throw new Error(`Gemini API error: ${errObj.error.message || JSON.stringify(errObj.error)}`);
        }
      }
      throw new Error(`Gemini API error: ${String(apiError)}`);
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
