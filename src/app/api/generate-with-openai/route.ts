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

    // STEP 2: Generate 7 images with OpenAI DALL-E 3
    console.log("\n🎨 STEP 1/2: Generating 7 images with OpenAI DALL-E 3...");
    const dalleImages: Array<{url: string, keyword: string, source: string}> = [];

    for (let i = 0; i < 7; i++) {
      const keyword = expandedKeywords[i];

      // Create category-specific prompts for DALL-E
      let imagePrompt = "";

      if (keyword.toLowerCase().includes("wealth") || keyword.toLowerCase().includes("money") || keyword.toLowerCase().includes("financial")) {
        imagePrompt = `Professional product photography of ${keyword}: luxury gold watch on marble surface, stack of hundred dollar bills, elegant leather wallet, or modern skyline office. Cinematic lighting, aspirational vision board aesthetic, high-end magazine quality. NO text.`;
      } else if (keyword.toLowerCase().includes("travel") || keyword.toLowerCase().includes("vacation") || keyword.toLowerCase().includes("beach")) {
        imagePrompt = `Stunning travel destination for ${keyword}: turquoise tropical water, exotic island paradise, luxury resort, or dreamy sunset beach. Travel magazine photography, vibrant colors, wanderlust aesthetic. NO text.`;
      } else if (keyword.toLowerCase().includes("fitness") || keyword.toLowerCase().includes("health") || keyword.toLowerCase().includes("wellness")) {
        imagePrompt = `Inspiring wellness scene for ${keyword}: colorful acai bowl with berries, yoga mat in nature, green smoothie, or gym equipment. Health magazine aesthetic, bright natural lighting, fresh and motivational. NO text.`;
      } else if (keyword.toLowerCase().includes("luxury") || keyword.toLowerCase().includes("car") || keyword.toLowerCase().includes("sports car")) {
        imagePrompt = `Luxury lifestyle for ${keyword}: sleek sports car, designer shopping bags, champagne glasses, or penthouse view. High-end magazine photography, sophisticated and aspirational. NO text.`;
      } else if (keyword.toLowerCase().includes("home") || keyword.toLowerCase().includes("house")) {
        imagePrompt = `Dream home for ${keyword}: modern architecture exterior, luxurious living room, minimalist bedroom, or beautiful kitchen. Architectural Digest style, inviting and high-end. NO text.`;
      } else {
        imagePrompt = `Beautiful inspiring image for vision board representing "${keyword}". Style: High-quality editorial photography, bright aspirational aesthetic, modern magazine quality, professional composition. Cinematic lighting, vibrant colors, clean background, photorealistic. NO text, logos, or clutter.`;
      }

      console.log(`  [${i + 1}/7] Generating DALL-E image for: "${keyword}"`);

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
                console.log(`  ✓ Generated and converted DALL-E image ${i + 1}/7`);
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
        if (i < 6) {
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      } catch (error) {
        console.error(`  ✗ Error generating DALL-E image ${i + 1}:`, error);
      }
    }

    console.log(`✅ Generated ${dalleImages.length}/7 DALL-E images successfully`);

    // STEP 3: Generate 7 images with Gemini Imagen 3
    console.log("\n🎨 STEP 2/2: Generating 7 images with Gemini Imagen 3...");
    const geminiImages: Array<{url: string, keyword: string, source: string}> = [];
    const genai = new GoogleGenAI({ apiKey: geminiApiKey });

    for (let i = 7; i < 14; i++) {
      const keyword = expandedKeywords[i];

      const geminiPrompt = `Create a beautiful, high-quality photograph for a vision board representing: "${keyword}".

Style requirements:
- Professional magazine photography aesthetic
- Bright, aspirational, and motivational mood
- Cinematic lighting with vibrant colors
- Clean composition, clear subject matter
- High resolution, photorealistic quality
- Vision board / mood board style

IMPORTANT:
- NO text, words, letters, or logos in the image
- Single clear subject that embodies "${keyword}"
- Modern, inspiring, goal-oriented imagery`;

      console.log(`  [${i + 1}/14] Generating Gemini image for: "${keyword}"`);

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
            console.log(`  ✓ Generated Gemini image ${i + 1}/14`);
          }
        }

        // Rate limiting delay
        if (i < 13) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error(`  ✗ Error generating Gemini image ${i + 1}:`, error);
      }
    }

    console.log(`✅ Generated ${geminiImages.length}/7 Gemini images successfully`);

    // STEP 4: Combine all images
    const allImages = [...dalleImages, ...geminiImages];

    console.log(`\n📊 FINAL SUMMARY:`);
    console.log(`   DALL-E 3 images: ${dalleImages.length}/7`);
    console.log(`   Gemini Imagen images: ${geminiImages.length}/7`);
    console.log(`   Total images: ${allImages.length}/14`);

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
