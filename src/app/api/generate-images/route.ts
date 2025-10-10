import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(request: NextRequest) {
  try {
    const { prompts, categorizedUploads } = await request.json();

    if (!prompts || !Array.isArray(prompts) || prompts.length === 0) {
      return NextResponse.json(
        { error: "Prompts array is required" },
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

    console.log(`Generating ${prompts.length} individual images with Gemini...`);

    // Initialize Gemini client
    const genai = new GoogleGenAI({ apiKey });

    // Prepare user's selfie as reference (if provided)
    let selfiePart = null;
    if (categorizedUploads?.selfie && categorizedUploads.selfie.startsWith('data:')) {
      const base64Data = categorizedUploads.selfie.split(',')[1];
      const mimeType = categorizedUploads.selfie.split(';')[0].split(':')[1];
      selfiePart = {
        inlineData: {
          data: base64Data,
          mimeType: mimeType
        }
      };
      console.log("Using selfie as reference for consistency");
    }

    // Prepare car reference if provided
    let carPart = null;
    if (categorizedUploads?.dreamCar && categorizedUploads.dreamCar.startsWith('data:')) {
      const base64Data = categorizedUploads.dreamCar.split(',')[1];
      const mimeType = categorizedUploads.dreamCar.split(';')[0].split(':')[1];
      carPart = {
        inlineData: {
          data: base64Data,
          mimeType: mimeType
        }
      };
    }

    // Prepare house reference if provided
    let housePart = null;
    if (categorizedUploads?.dreamHouse && categorizedUploads.dreamHouse.startsWith('data:')) {
      const base64Data = categorizedUploads.dreamHouse.split(',')[1];
      const mimeType = categorizedUploads.dreamHouse.split(';')[0].split(':')[1];
      housePart = {
        inlineData: {
          data: base64Data,
          mimeType: mimeType
        }
      };
    }

    const generatedImages: string[] = [];
    const errors: string[] = [];

    // Generate each image individually for better consistency
    for (let i = 0; i < prompts.length; i++) {
      const prompt = prompts[i];
      console.log(`[${i + 1}/${prompts.length}] Generating: ${prompt.substring(0, 60)}...`);

      try {
        // Build contents array based on what references are needed
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const contents: any[] = [];

        // Add selfie if the prompt mentions the user
        const needsSelfie = prompt.includes('@userPhoto') ||
                          prompt.toLowerCase().includes('main subject') ||
                          prompt.toLowerCase().includes('you');

        if (needsSelfie && selfiePart) {
          contents.push(selfiePart);
        }

        // Add car if prompt mentions it
        if (prompt.includes('@dreamCar') && carPart) {
          contents.push(carPart);
        }

        // Add house if prompt mentions it
        if (prompt.includes('@dreamHouse') && housePart) {
          contents.push(housePart);
        }

        // Enhanced prompt for better quality and consistency
        const enhancedPrompt = needsSelfie && selfiePart
          ? `Using the person from the reference image, create: ${prompt}.
             CRITICAL: Use the EXACT same person from the reference photo. Match their facial features, skin tone, and appearance precisely.
             Style: Professional photography, natural lighting, warm tones, high quality, realistic.`
          : `Create: ${prompt}. Style: Professional photography, natural lighting, warm tones, high quality, aesthetic.`;

        contents.push({ text: enhancedPrompt });

        // Generate the image
        const response = await genai.models.generateContent({
          model: "gemini-2.5-flash-image",
          contents: contents
        });

        // Extract image from response
        if (response?.candidates && response.candidates.length > 0) {
          const candidate = response.candidates[0];
          if (candidate.content && candidate.content.parts) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const imagePart = candidate.content.parts.find((part: any) =>
              part.inlineData && part.inlineData.mimeType && part.inlineData.mimeType.startsWith('image/')
            );

            if (imagePart && imagePart.inlineData) {
              const imageDataUri = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
              generatedImages.push(imageDataUri);
              console.log(`✓ [${i + 1}/${prompts.length}] Generated successfully`);
            } else {
              throw new Error("No image data in response");
            }
          } else {
            throw new Error("No content parts in response");
          }
        } else {
          throw new Error("No candidates in response");
        }

        // Small delay to avoid rate limiting
        if (i < prompts.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

      } catch (error: unknown) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        console.error(`✗ [${i + 1}/${prompts.length}] Error:`, errorMsg);
        errors.push(`Image ${i + 1}: ${errorMsg}`);

        // Continue with next image even if one fails
        continue;
      }
    }

    console.log(`Generated ${generatedImages.length}/${prompts.length} images successfully`);

    if (generatedImages.length === 0) {
      return NextResponse.json(
        {
          error: "Failed to generate any images",
          details: errors
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      images: generatedImages,
      success: true,
      totalGenerated: generatedImages.length,
      totalRequested: prompts.length,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error: unknown) {
    console.error("Error generating images:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to generate images",
        details: error instanceof Error ? error.stack : String(error),
      },
      { status: 500 }
    );
  }
}
