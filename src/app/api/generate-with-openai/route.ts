import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(request: NextRequest) {
  try {
    const { keywords, categorizedUploads } = await request.json();

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
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
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

    console.log("🎨 Starting DALL-E 3 + Gemini Imagen vision board generation...");
    console.log("📝 User keywords:", keywords);

    // STEP 1: Expand keywords to ensure we have enough for 14 images
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
      "personal growth and confidence",
      "luxury sports car",
      "tropical beach paradise",
      "modern office workspace",
      "healthy lifestyle"
    ];

    const expandedKeywords = [...keywords];
    while (expandedKeywords.length < 14) {
      expandedKeywords.push(visionBoardThemes[expandedKeywords.length % visionBoardThemes.length]);
    }

    console.log(`📊 Expanded to ${expandedKeywords.length} keywords for image generation`);

    // STEP 2: Generate 4 images with OpenAI DALL-E 3 (reduced for cleaner layout)
    console.log("\n🎨 STEP 1/2: Generating 4 images with OpenAI DALL-E 3...");
    const dalleImages: Array<{url: string, keyword: string, source: string}> = [];

    for (let i = 0; i < 4; i++) {
      const keyword = expandedKeywords[i];

      // Create category-specific prompts - NO PEOPLE, only objects and scenes
      let imagePrompt = "";

      if (keyword.toLowerCase().includes("wealth") || keyword.toLowerCase().includes("money") || keyword.toLowerCase().includes("financial")) {
        imagePrompt = `Product photography for vision board: stack of hundred dollar bills fanned out, luxury gold watch on marble, or elegant leather wallet with credit cards. NO people, NO faces, just objects. Cinematic lighting, aspirational aesthetic, high-end magazine quality. NO text or logos.`;
      } else if (keyword.toLowerCase().includes("travel") || keyword.toLowerCase().includes("vacation") || keyword.toLowerCase().includes("beach")) {
        imagePrompt = `Travel destination landscape for vision board: pristine turquoise beach with palm trees, exotic tropical island view, or sunset over ocean. NO people, NO faces, just scenery. Travel magazine photography, vibrant colors, dreamy aesthetic. NO text.`;
      } else if (keyword.toLowerCase().includes("fitness") || keyword.toLowerCase().includes("health") || keyword.toLowerCase().includes("wellness")) {
        imagePrompt = `Wellness still life for vision board: colorful acai bowl with fresh berries and granola, green smoothie bowl with toppings, yoga mat rolled up in nature, or gym dumbbells arrangement. NO people, NO faces, just objects. Health magazine aesthetic, bright natural lighting. NO text.`;
      } else if (keyword.toLowerCase().includes("luxury") || keyword.toLowerCase().includes("car") || keyword.toLowerCase().includes("sports car")) {
        imagePrompt = `Luxury lifestyle item for vision board: sleek white sports car exterior shot, champagne glasses clinking (no hands visible), or penthouse city view through windows. NO people, NO faces, just objects and scenery. High-end magazine photography. NO text.`;
      } else if (keyword.toLowerCase().includes("home") || keyword.toLowerCase().includes("house")) {
        imagePrompt = `Dream home architecture for vision board: modern house exterior with landscaping, luxurious empty living room with designer furniture, minimalist bedroom interior, or beautiful kitchen design. NO people, NO faces, just spaces. Architectural Digest style. NO text.`;
      } else {
        imagePrompt = `Inspiring lifestyle image for vision board: "${keyword}". IMPORTANT: NO people, NO faces, NO humans - only objects, scenery, or empty spaces. Style: High-quality editorial photography, bright aspirational aesthetic, modern magazine quality. Cinematic lighting, vibrant colors, clean composition. NO text, logos, or clutter.`;
      }

      console.log(`  [${i + 1}/4] Generating DALL-E image for: "${keyword}"`);

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
            const imageUrl = data.data[0].url;

            // Download and convert to base64 to avoid CORS issues
            try {
              const imageResponse = await fetch(imageUrl);
              if (imageResponse.ok) {
                const arrayBuffer = await imageResponse.arrayBuffer();
                const base64 = Buffer.from(arrayBuffer).toString("base64");
                const dataUri = `data:image/png;base64,${base64}`;

                dalleImages.push({
                  url: dataUri,
                  keyword: keyword,
                  source: "dall-e-3"
                });
                console.log(`  ✓ Generated and converted DALL-E image ${i + 1}/4`);
              } else {
                console.error(`  ✗ Failed to download DALL-E image ${i + 1}`);
              }
            } catch (downloadError) {
              console.error(`  ✗ Error downloading DALL-E image ${i + 1}:`, downloadError);
            }
          }
        } else {
          const errorText = await response.text();
          console.error(`  ✗ DALL-E failed for image ${i + 1}:`, response.status, errorText);
        }

        // Rate limiting delay
        if (i < 3) {
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      } catch (error) {
        console.error(`  ✗ Error generating DALL-E image ${i + 1}:`, error);
      }
    }

    console.log(`✅ Generated ${dalleImages.length}/4 DALL-E images successfully`);

    // STEP 3: Generate 4 images with Gemini Imagen 3 (reduced for cleaner layout)
    console.log("\n🎨 STEP 2/2: Generating 4 images with Gemini Imagen 3...");
    const geminiImages: Array<{url: string, keyword: string, source: string}> = [];
    const genai = new GoogleGenAI({ apiKey: geminiApiKey });

    for (let i = 4; i < 8; i++) {
      const keyword = expandedKeywords[i];

      const geminiPrompt = `Create a high-quality photograph for a vision board: "${keyword}".

CRITICAL REQUIREMENTS:
- NO people, NO faces, NO humans whatsoever
- Only objects, scenery, empty spaces, or still life
- Professional magazine photography aesthetic
- Bright, aspirational, motivational mood
- Cinematic lighting with vibrant colors
- Clean composition, clear subject matter
- High resolution, photorealistic quality

IMPORTANT:
- NO text, words, letters, or logos
- NO people or human figures
- Objects and scenery only
- Vision board / mood board style`;

      console.log(`  [${i + 1}/8] Generating Gemini image for: "${keyword}"`);

      try {
        const response = await genai.models.generateContent({
          model: "gemini-2.5-flash-image",
          contents: [
            {
              role: "user",
              parts: [
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
          },
        });

        // Extract image from response
        interface Part {
          inlineData?: {
            data?: string;
            mimeType?: string;
          };
        }

        const candidate = response.candidates?.[0];
        if (candidate?.content?.parts) {
          const imagePart = candidate.content.parts.find((part: Part) =>
            part.inlineData?.mimeType?.startsWith("image/")
          );

          if (imagePart?.inlineData?.data) {
            const imageDataUri = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
            geminiImages.push({
              url: imageDataUri,
              keyword: keyword,
              source: "gemini-imagen-3"
            });
            console.log(`  ✓ Generated Gemini image ${i + 1}/8`);
          }
        }

        // Rate limiting delay
        if (i < 7) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error(`  ✗ Error generating Gemini image ${i + 1}:`, error);
      }
    }

    console.log(`✅ Generated ${geminiImages.length}/4 Gemini images successfully`);

    // STEP 4: Combine all images
    const allImages = [...dalleImages, ...geminiImages];

    console.log(`\n📊 FINAL SUMMARY:`);
    console.log(`   DALL-E 3 images: ${dalleImages.length}/4`);
    console.log(`   Gemini Imagen images: ${geminiImages.length}/4`);
    console.log(`   Total AI images: ${allImages.length}/8`);

    if (allImages.length === 0) {
      throw new Error("No images were generated. Please check API keys and billing.");
    }

    // STEP 5: Add user's selfie if provided
    if (categorizedUploads?.selfie) {
      allImages.unshift({
        url: categorizedUploads.selfie,
        keyword: "You",
        source: "user-upload"
      });
      console.log(`   + User selfie added`);
      console.log(`   Grand total: ${allImages.length} images`);
    }

    // Return all individual images to frontend for HTML/CSS collage
    return NextResponse.json({
      status: "success",
      images: allImages,
      metadata: {
        dalle_count: dalleImages.length,
        gemini_count: geminiImages.length,
        total_count: allImages.length,
        user_keywords: keywords,
      },
    });

  } catch (error: unknown) {
    console.error("❌ Error in image generation workflow:", error);
    return NextResponse.json(
      {
        status: "error",
        error: "Failed to generate images",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
