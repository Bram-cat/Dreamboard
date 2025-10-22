import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(request: NextRequest) {
  try {
    const { keywords, categorizedUploads, numberOfImages = 10 } = await request.json();

    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return NextResponse.json(
        { error: "Keywords array is required" },
        { status: 400 }
      );
    }

    // Check API keys
    const openaiApiKey = process.env.OPENAI_API_KEY;
    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (!openaiApiKey) {
      console.error("OPENAI_API_KEY not found in environment variables");
      console.error("Please add OPENAI_API_KEY to your Vercel environment variables");
      return NextResponse.json(
        {
          error: "OpenAI API key not configured",
          details: "OPENAI_API_KEY environment variable is missing. Please add it in Vercel dashboard: Settings → Environment Variables → Add OPENAI_API_KEY"
        },
        { status: 500 }
      );
    }

    if (!geminiApiKey) {
      console.error("GEMINI_API_KEY not found in environment variables");
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    console.log("🎨 Starting OpenAI + Gemini vision board workflow...");
    console.log("Keywords:", keywords);
    console.log("Number of images:", numberOfImages);

    // STEP 1: Generate images using OpenAI API
    console.log("\n📸 Step 1: Generating images with OpenAI gpt-image-1...");

    // Create a cohesive prompt that includes all keywords
    const keywordList = keywords.join(", ");
    const openaiPrompt = `Generate ${numberOfImages} cohesive square images for a vision board representing the following concepts: ${keywordList}.

Requirements:
- Minimalist, modern aesthetic
- Bright, inspiring, cinematic quality
- Consistent color tones and lighting across all images
- No text, logos, or clutter
- Each image should symbolize one or more of the keywords
- Professional photography style
- Soft, warm lighting
- High resolution and sharp details`;

    const openaiResponse = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: "dall-e-3", // Note: gpt-image-1 may not exist; using dall-e-3 which is the latest
        prompt: openaiPrompt,
        n: 1, // DALL-E 3 only supports n=1, so we'll need to make multiple calls
        size: "1024x1024", // DALL-E 3 supports 1024x1024, 1792x1024, 1024x1792
        quality: "standard", // or "hd" for higher quality
      }),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      console.error("OpenAI API error:", errorData);
      throw new Error(`OpenAI API failed: ${errorData.error?.message || "Unknown error"}`);
    }

    const openaiData = await openaiResponse.json();
    console.log("✓ OpenAI returned data");

    // Since DALL-E 3 only supports n=1, we need to make multiple requests
    // For now, let's start with generating multiple images sequentially
    const generatedImages: string[] = [];

    // Generate images for each keyword (up to numberOfImages)
    const imagesToGenerate = Math.min(numberOfImages, keywords.length);

    for (let i = 0; i < imagesToGenerate; i++) {
      const keyword = keywords[i % keywords.length];
      const imagePrompt = `Generate a square, minimalist image symbolizing "${keyword}".
It should fit a cohesive digital vision board aesthetic — bright, inspiring, cinematic, and modern.
Avoid text, logos, or clutter. Use consistent color tones and lighting.
Professional photography style with soft, warm lighting.`;

      console.log(`  Generating image ${i + 1}/${imagesToGenerate} for: ${keyword}`);

      try {
        const response = await fetch("https://api.openai.com/v1/images/generations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${openaiApiKey}`,
          },
          body: JSON.stringify({
            model: "dall-e-3",
            prompt: imagePrompt,
            n: 1,
            size: "1024x1024",
            quality: "standard",
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.data && data.data[0] && data.data[0].url) {
            generatedImages.push(data.data[0].url);
            console.log(`  ✓ Generated image ${i + 1}`);
          }
        } else {
          const errorText = await response.text();
          console.error(`  ✗ Failed to generate image ${i + 1}:`, response.status, errorText);
        }

        // Add a small delay to avoid rate limiting
        if (i < imagesToGenerate - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error(`Error generating image ${i + 1}:`, error);
      }
    }

    console.log(`✓ Generated ${generatedImages.length} images with OpenAI`);

    if (generatedImages.length === 0) {
      console.error("❌ NO IMAGES GENERATED BY OPENAI!");
      throw new Error("OpenAI failed to generate any images. Check API key and billing.");
    }

    console.log("OpenAI Image URLs:", generatedImages);

    // STEP 2: Download and convert images to base64 for Gemini
    console.log("\n🔄 Step 2: Converting images to base64 for Gemini...");

    const imageDataParts = [];
    for (let i = 0; i < generatedImages.length; i++) {
      const imageUrl = generatedImages[i];
      console.log(`  Converting image ${i + 1}/${generatedImages.length}...`);

      try {
        const imageResponse = await fetch(imageUrl);
        if (!imageResponse.ok) {
          throw new Error(`Failed to fetch image ${i + 1}`);
        }

        const arrayBuffer = await imageResponse.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString("base64");

        imageDataParts.push({
          inlineData: {
            data: base64,
            mimeType: "image/png",
          },
        });

        console.log(`  ✓ Converted image ${i + 1}`);
      } catch (error) {
        console.error(`  ✗ Error converting image ${i + 1}:`, error);
      }
    }

    // Add user's selfie if provided
    if (categorizedUploads?.selfie && categorizedUploads.selfie.startsWith("data:")) {
      const base64Data = categorizedUploads.selfie.split(",")[1];
      const mimeType = categorizedUploads.selfie.split(";")[0].split(":")[1];
      imageDataParts.unshift({
        inlineData: {
          data: base64Data,
          mimeType: mimeType,
        },
      });
      console.log("  ✓ Added user's selfie as reference");
    }

    // STEP 3: Send to Gemini to create final cohesive layout
    console.log("\n🎨 Step 3: Creating final vision board with Gemini...");
    console.log(`Total images to send to Gemini: ${imageDataParts.length}`);

    if (imageDataParts.length === 0) {
      throw new Error("No images to send to Gemini! Image conversion failed.");
    }

    const genai = new GoogleGenAI({ apiKey: geminiApiKey });

    const geminiPrompt = `You are a professional vision board designer. You have been given ${imageDataParts.length} images to arrange into a COLLAGE-STYLE vision board.

${categorizedUploads?.selfie ? "The FIRST image is the user's selfie. Include this person in the collage." : ""}

🎨 CRITICAL LAYOUT REQUIREMENTS:

1. CREATE A POLAROID/PHOTO COLLAGE LAYOUT:
   - Arrange the images as SEPARATE, DISTINCT PHOTO TILES
   - Each image should be clearly visible as its own element
   - Use white borders around each photo (like polaroid frames)
   - Overlap the photos at various angles (rotate some by -5° to +5°)
   - Create a scattered, organic magazine collage look

2. LAYOUT COMPOSITION:
   - Place larger images (400-500px) in center and key positions
   - Scatter smaller images (200-300px) around the edges
   - Create depth by layering images on top of each other
   - Leave the background visible between images (beige/cream color)
   - Don't blend or merge the images - keep them as distinct photos

3. POLAROID FRAME STYLE:
   - Each photo should have a thick white border (20-30px)
   - Add subtle drop shadows beneath each photo for depth
   - Rotate photos at different angles for dynamic look
   - Some photos slightly overlapping others

4. BACKGROUND:
   - Soft beige/cream/off-white background color
   - Clean and minimal, letting photos stand out
   - Professional vision board aesthetic

5. FINAL OUTPUT:
   - 1344x768 (16:9) landscape format
   - High-quality, magazine-style collage
   - Should look like physical photos scattered on a table
   - Similar to Pinterest vision boards or mood boards

REFERENCE STYLE: Think of physical vision boards where multiple printed photos are arranged and overlapped on a board - that's the aesthetic we want!

Return a single composite image with all photos arranged as a collage.`;

    const response = await genai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: [
        {
          role: "user",
          parts: [
            ...imageDataParts,
            {
              text: geminiPrompt,
            },
          ],
        },
      ],
      config: {
        temperature: 0.7,
        topP: 0.9,
        topK: 32,
        maxOutputTokens: 8192,
        // Note: responseMimeType is not needed for gemini-2.5-flash-image
        // The model automatically returns images
      },
    });

    // Extract final vision board image
    interface Part {
      inlineData?: {
        data?: string;
        mimeType?: string;
      };
    }

    const candidate = response.candidates?.[0];
    if (!candidate || !candidate.content || !candidate.content.parts) {
      throw new Error("No content in Gemini response");
    }

    const imagePart = candidate.content.parts.find((part: Part) =>
      part.inlineData?.mimeType?.startsWith("image/")
    );

    if (!imagePart || !imagePart.inlineData || !imagePart.inlineData.data) {
      throw new Error("No image data in Gemini response");
    }

    // Convert to data URI
    const finalVisionBoardDataUri = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;

    console.log("✓ Final vision board created successfully!");

    // Return response in the specified format
    return NextResponse.json({
      status: "success",
      generated_images: generatedImages,
      final_vision_board: finalVisionBoardDataUri,
      metadata: {
        keyword_count: keywords.length,
        images_generated: generatedImages.length,
        model_used: "dall-e-3 + gemini-2.5-flash-image",
      },
    });
  } catch (error: unknown) {
    console.error("Error in OpenAI + Gemini workflow:", error);
    return NextResponse.json(
      {
        status: "error",
        error: "Failed to generate vision board",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
