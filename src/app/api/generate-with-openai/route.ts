import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(request: NextRequest) {
  try {
    const { keywords, categorizedUploads, numberOfImages = 15 } = await request.json();

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
    const generatedImages: string[] = [];

    // If user provided few keywords, expand with vision board themes
    const expandedKeywords = [...keywords];
    const visionBoardThemes = [
      "financial freedom and wealth",
      "luxury lifestyle and success",
      "dream vacation and travel",
      "health and fitness goals",
      "peaceful meditation and wellness",
      "career achievement and growth",
      "beautiful home and comfort",
      "adventure and excitement",
      "love and relationships",
      "personal growth and confidence"
    ];

    // Add themed keywords if we don't have enough
    while (expandedKeywords.length < numberOfImages) {
      expandedKeywords.push(visionBoardThemes[expandedKeywords.length % visionBoardThemes.length]);
    }

    console.log(`Expanded keywords (${expandedKeywords.length}):`, expandedKeywords.slice(0, numberOfImages));

    // Generate exactly numberOfImages with improved prompts
    for (let i = 0; i < numberOfImages; i++) {
      const keyword = expandedKeywords[i];

      // Create more detailed, specific prompts based on keyword type
      let imagePrompt = "";

      // Detect keyword category and create targeted prompts
      if (keyword.toLowerCase().includes("wealth") || keyword.toLowerCase().includes("money") || keyword.toLowerCase().includes("financial")) {
        imagePrompt = `Aspirational ${keyword} concept for vision board: stack of crisp dollar bills, luxury gold watch, modern minimalist office with skyline view, or elegant wallet with credit cards. Professional product photography, soft golden lighting, clean composition, high-end magazine quality. NO text or logos.`;
      } else if (keyword.toLowerCase().includes("travel") || keyword.toLowerCase().includes("vacation") || keyword.toLowerCase().includes("adventure")) {
        imagePrompt = `Stunning ${keyword} destination for vision board: exotic beach with turquoise water, European cobblestone street, tropical island paradise, or mountain vista. Travel magazine photography style, vibrant colors, dreamy atmosphere, wanderlust-inspiring. NO text or people.`;
      } else if (keyword.toLowerCase().includes("fitness") || keyword.toLowerCase().includes("health") || keyword.toLowerCase().includes("wellness")) {
        imagePrompt = `Inspiring ${keyword} scene for vision board: colorful acai bowl with fresh berries, yoga mat in serene nature setting, modern gym equipment, or green smoothie with tropical fruits. Health magazine aesthetic, bright natural lighting, fresh and vibrant. NO text.`;
      } else if (keyword.toLowerCase().includes("luxury") || keyword.toLowerCase().includes("lifestyle") || keyword.toLowerCase().includes("success")) {
        imagePrompt = `Luxurious ${keyword} imagery for vision board: designer shopping bags (Chanel, Gucci), champagne glasses clinking, modern architecture mansion, private jet interior, or walk-in closet. High-end lifestyle magazine photography, sophisticated composition, aspirational. NO text.`;
      } else if (keyword.toLowerCase().includes("love") || keyword.toLowerCase().includes("relationship") || keyword.toLowerCase().includes("romance")) {
        imagePrompt = `Beautiful ${keyword} scene for vision board: elegant bouquet of roses and peonies, romantic sunset, cozy candlelit setting, or heart-shaped arrangement. Romantic editorial photography, soft warm lighting, dreamy aesthetic. NO text or people's faces.`;
      } else if (keyword.toLowerCase().includes("career") || keyword.toLowerCase().includes("business") || keyword.toLowerCase().includes("professional")) {
        imagePrompt = `Professional ${keyword} scene for vision board: modern office workspace, city skyline at golden hour, sleek laptop setup, or executive desk. Business magazine photography, confident aesthetic, sharp professional quality, inspiring. NO text.`;
      } else if (keyword.toLowerCase().includes("home") || keyword.toLowerCase().includes("house") || keyword.toLowerCase().includes("interior")) {
        imagePrompt = `Dream ${keyword} for vision board: modern architectural exterior with landscaping, cozy luxurious living room, minimalist bedroom with natural light, or beautiful kitchen. Architectural Digest style photography, inviting atmosphere, high-end real estate quality. NO text.`;
      } else {
        // Generic vision board image for any other keyword
        imagePrompt = `Create a beautiful, inspiring image representing "${keyword}" for a vision board. Style: High-quality magazine editorial photography, bright and aspirational, modern aesthetic, professional composition. Mood: Motivational, dreamy, goal-oriented, visually stunning. Technical: Sharp focus, warm cinematic lighting, vibrant colors, clean background, photorealistic quality. AVOID: Any text, logos, clutter, or busy scenes. FOCUS: Single clear subject that embodies the essence of "${keyword}".`;
      }

      console.log(`  Generating image ${i + 1}/${numberOfImages} for: ${keyword}`);

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
            console.log(`  ✓ Generated image ${i + 1}/${numberOfImages} successfully`);
            console.log(`  Current total: ${generatedImages.length} images`);
          } else {
            console.error(`  ✗ OpenAI returned success but no image URL for image ${i + 1}`);
            console.error(`  Response data:`, JSON.stringify(data));
          }
        } else {
          const errorText = await response.text();
          console.error(`  ✗ Failed to generate image ${i + 1}/${numberOfImages}`);
          console.error(`  HTTP Status: ${response.status}`);
          console.error(`  Error details:`, errorText);

          // Try to parse error for more details
          try {
            const errorJson = JSON.parse(errorText);
            if (errorJson.error) {
              console.error(`  OpenAI Error Message:`, errorJson.error.message);
              console.error(`  OpenAI Error Type:`, errorJson.error.type);
            }
          } catch (e) {
            // Error text wasn't JSON, already logged above
          }
        }

        // Add a small delay to avoid rate limiting (1.5 seconds for safety)
        if (i < numberOfImages - 1) {
          console.log(`  ⏳ Waiting 1.5 seconds before next request...`);
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      } catch (error) {
        console.error(`  ✗ Exception while generating image ${i + 1}/${numberOfImages}:`, error);
        if (error instanceof Error) {
          console.error(`  Exception message:`, error.message);
          console.error(`  Exception stack:`, error.stack);
        }
      }
    }

    console.log(`\n📊 GENERATION SUMMARY:`);
    console.log(`   Target: ${numberOfImages} images`);
    console.log(`   Successfully generated: ${generatedImages.length} images`);
    console.log(`   Success rate: ${((generatedImages.length / numberOfImages) * 100).toFixed(1)}%`);

    if (generatedImages.length === 0) {
      console.error("❌ NO IMAGES GENERATED BY OPENAI!");
      console.error("Possible causes:");
      console.error("  1. Invalid or expired API key");
      console.error("  2. Billing limit reached");
      console.error("  3. Content policy violations in prompts");
      console.error("  4. Network/connectivity issues");
      throw new Error("OpenAI failed to generate any images. Check API key and billing.");
    }

    if (generatedImages.length < numberOfImages) {
      console.warn(`⚠️ WARNING: Only ${generatedImages.length}/${numberOfImages} images were generated successfully`);
      console.warn("Check error logs above for details on failed generations");
    }

    console.log("✅ OpenAI Image URLs:", generatedImages);

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
