import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(request: NextRequest) {
  try {
    const { scenarios, categorizedUploads, goals } = await request.json();

    if (!scenarios || !Array.isArray(scenarios) || scenarios.length === 0) {
      return NextResponse.json(
        { error: "Scenarios array is required" },
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

    console.log(`Generating ${scenarios.length} individual images with Gemini for better facial consistency...`);

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

    // Generate each image individually for better facial consistency
    for (let i = 0; i < scenarios.length; i++) {
      const scenario = scenarios[i];
      console.log(`[${i + 1}/${scenarios.length}] Generating: ${scenario.description.substring(0, 60)}...`);

      try {
        // Build contents array based on what references are needed
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const contents: any[] = [];

        // Add references based on scenario needs
        if (scenario.needsSelfie && selfiePart) {
          contents.push(selfiePart);
        }

        if (scenario.needsCar && carPart) {
          contents.push(carPart);
        }

        if (scenario.needsHouse && housePart) {
          contents.push(housePart);
        }

        // Enhanced prompt for better quality and facial consistency
        const enhancedPrompt = scenario.needsSelfie && selfiePart
          ? `CRITICAL FACIAL CONSISTENCY REQUIREMENT: You MUST use the EXACT person from the reference image provided.

Reference person's features to maintain:
- Exact facial structure and bone structure
- Same skin tone and complexion
- Same eye shape, color, and expression style
- Same hair color, texture, and style
- Same nose, mouth, and facial proportions

Create this specific scene: ${scenario.description}

The person in the scene MUST be the same individual from the reference photo. Match their appearance precisely.
If you cannot maintain perfect facial consistency, DO NOT create the image.

VISUAL QUALITY REQUIREMENTS:
- Ultra high definition, photorealistic detail
- Professional cinematic lighting with depth
- Rich colors with high saturation and contrast
- Sharp focus on subject, subtle bokeh background
- Magazine editorial quality composition
- Golden hour warm lighting or dramatic studio lighting
- 8K quality, professional photographer aesthetic
- Perfect exposure, no blown highlights or crushed shadows`
          : `Create this specific scene: ${scenario.description}

VISUAL QUALITY REQUIREMENTS:
- Ultra high definition, photorealistic detail
- Professional cinematic lighting with depth and dimension
- Rich, vibrant colors with high saturation and contrast
- Sharp focus with professional depth of field
- Magazine editorial quality composition
- Golden hour warm lighting or dramatic professional lighting
- 8K quality output, luxury photography aesthetic
- Perfect exposure balance, dynamic range optimization
- Premium lifestyle photography style
- Award-winning photography composition and lighting`;

        contents.push({ text: enhancedPrompt });

        // Generate the image - use 4:5 aspect ratio for smallest payload size
        // 4:5 = 896x1152 which is smaller than 1:1 (1024x1024) or 16:9 (1344x768)
        const response = await genai.models.generateContent({
          model: "gemini-2.5-flash-image",
          contents: contents,
          config: {
            imageConfig: {
              aspectRatio: '4:5'  // 896x1152 - smallest payload for stitching
            }
          }
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

              console.log(`✓ [${i + 1}/${scenarios.length}] Generated successfully`);
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
        if (i < scenarios.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay between images
        }

      } catch (error: unknown) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        console.error(`✗ [${i + 1}/${scenarios.length}] Error:`, errorMsg);
        errors.push(`Image ${i + 1}: ${errorMsg}`);

        // Continue with next image even if one fails
        continue;
      }
    }

    console.log(`Generated ${generatedImages.length}/${scenarios.length} images successfully`);

    if (generatedImages.length === 0) {
      return NextResponse.json(
        {
          error: "Failed to generate any images",
          details: errors
        },
        { status: 500 }
      );
    }

    // NOW STITCH THE IMAGES INTO FINAL COLLAGE (no client round-trip = no 413 error!)
    console.log("Stitching images into final collage on server...");

    // Prepare all generated images as input parts for stitching
    const imageParts = generatedImages.map((imageDataUri: string) => {
      const base64Data = imageDataUri.split(',')[1];
      const mimeType = imageDataUri.split(';')[0].split(':')[1];
      return {
        inlineData: {
          data: base64Data,
          mimeType: mimeType
        }
      };
    });

    // Create stitching prompt
    const stitchPrompt = `Create a DENSE vision board collage by arranging ALL ${generatedImages.length} provided images into a magazine-style layout.

CRITICAL LAYOUT REQUIREMENTS:
- Use EVERY single image provided (all ${generatedImages.length} images)
- Arrange them as overlapping polaroid-style photos with torn white borders
- Cover 90% of the surface - minimal background visible
- Tilt photos at various angles (5-25 degrees)
- Layer them with depth - some in front, some behind
- NO empty corners or large gaps

ARRANGEMENT STYLE:
- ${generatedImages.length === 3 ? '1 large center image, 2 medium flanking images' : 'Arrange dynamically'}
- Heavy overlap creating visual interest
- Diagonal layering from all directions
- Magazine mood board aesthetic

TEXT ELEMENTS (add as handwritten style):
- "2025" prominently
- "Grateful" / "I am growing"
- "Dreams manifest" / "Choose happiness"
- "${goals?.split(',')[0]?.trim() || 'Goals'}"

BACKGROUND & STYLE:
- Warm beige/cream background (barely visible)
- Torn paper edges on all photos
- Film photography aesthetic
- Natural warm tones throughout
- Professional magazine quality

IMPORTANT: This is a collage assembly task - arrange the ${generatedImages.length} images into a beautiful, dense vision board. DO NOT generate new content.`;

    const stitchContents = [...imageParts, { text: stitchPrompt }];

    const stitchResponse = await genai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: stitchContents,
      config: {
        imageConfig: {
          aspectRatio: '16:9'  // 1344x768 for final collage
        }
      }
    });

    // Extract the final collage
    if (!stitchResponse || !stitchResponse.candidates || stitchResponse.candidates.length === 0) {
      throw new Error("No collage generated");
    }

    const stitchCandidate = stitchResponse.candidates[0];
    if (!stitchCandidate.content || !stitchCandidate.content.parts) {
      throw new Error("No content in stitch response");
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const stitchImagePart = stitchCandidate.content.parts.find((part: any) =>
      part.inlineData && part.inlineData.mimeType && part.inlineData.mimeType.startsWith('image/')
    );

    if (!stitchImagePart || !stitchImagePart.inlineData) {
      throw new Error("No image data in stitch response");
    }

    const collageDataUri = `data:${stitchImagePart.inlineData.mimeType};base64,${stitchImagePart.inlineData.data}`;

    console.log("✓ Collage stitched successfully!");

    // Return ONLY the final collage (not individual images)
    return NextResponse.json({
      collageUrl: collageDataUri,
      success: true,
      totalGenerated: generatedImages.length,
      totalRequested: scenarios.length,
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
