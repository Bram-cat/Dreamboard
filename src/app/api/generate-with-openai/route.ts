import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import fs from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const { keywords, categorizedUploads, useHtmlTemplate } = await request.json();

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
      console.error("OPENAI_API_KEY not found");
      return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 });
    }

    if (!geminiApiKey) {
      console.error("GEMINI_API_KEY not found");
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
    }

    console.log("🎨 Starting image generation with user uploads integration...");
    console.log("📝 User keywords:", keywords);

    // Check what user uploaded
    const hasSelfie = !!categorizedUploads?.selfie;
    const hasDreamHouse = !!categorizedUploads?.dreamHouse;
    const hasDreamCar = !!categorizedUploads?.dreamCar;
    const hasDestination = !!categorizedUploads?.destination;

    console.log("📸 User uploads:", { hasSelfie, hasDreamHouse, hasDreamCar, hasDestination });

    // STEP 1: Expand keywords to 10 total
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
    ];

    const expandedKeywords = [...keywords];
    while (expandedKeywords.length < 10) {
      expandedKeywords.push(visionBoardThemes[expandedKeywords.length % visionBoardThemes.length]);
    }

    // STEP 2: Generate 4-5 variations of EACH user upload
    console.log("\n🎨 STEP 1/3: Creating 4-5 variations of each user upload...");
    const genai = new GoogleGenAI({ apiKey: geminiApiKey });
    const allGeneratedImages: string[] = [];
    let scenarioCount = 0;

    // Helper function to generate variations of an image
    const generateVariations = async (imageBase64: string, imageName: string, variations: string[]) => {
      for (let i = 0; i < variations.length; i++) {
        const prompt = variations[i];
        console.log(`  [${scenarioCount + 1}] Generating: ${imageName} - ${prompt.substring(0, 50)}...`);

        try {
          const response = await genai.models.generateContent({
            model: "gemini-2.5-flash-image",
            contents: [{
              role: "user",
              parts: [
                { inlineData: { data: imageBase64, mimeType: "image/jpeg" } },
                { text: prompt }
              ]
            }],
            config: { temperature: 0.8, topP: 0.9, topK: 40, maxOutputTokens: 8192 },
          });

          const candidate = response.candidates?.[0];
          if (candidate?.content?.parts) {
            const imagePart = candidate.content.parts.find((part: { inlineData?: { mimeType?: string; data?: string } }) =>
              part.inlineData?.mimeType?.startsWith("image/")
            );
            if (imagePart?.inlineData?.data) {
              allGeneratedImages.push(imagePart.inlineData.data);
              scenarioCount++;
              console.log(`  ✓ Created variation ${scenarioCount}`);
            }
          }
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`  ✗ Error generating variation:`, error);
        }
      }
    };

    // Generate 4-5 variations for each upload
    if (hasSelfie) {
      const selfieBase64 = categorizedUploads.selfie.split(",")[1];
      const selfieVariations = [
        "Transform this person into a confident CEO at a modern office, sitting at a desk with a laptop, looking successful and empowered. Soft natural lighting, professional corporate aesthetic. The person should look polished and powerful.",
        "Show this person meditating peacefully in a beautiful zen garden or yoga studio, wearing comfortable activewear. Serene atmosphere, natural lighting, wellness aesthetic. The person should look calm and centered.",
        "Create a glamorous photo of this person at a luxury event, wearing elegant clothing, holding a champagne glass. Sophisticated party atmosphere, warm lighting, aspirational lifestyle. The person should look confident and radiant.",
        "Show this person traveling in style - at an airport lounge, wearing chic travel outfit with designer luggage. Bright natural lighting, jet-setter aesthetic. The person should look excited and adventurous.",
      ];
      await generateVariations(selfieBase64, "Selfie", selfieVariations);
    }

    if (hasDreamHouse) {
      const houseBase64 = categorizedUploads.dreamHouse.split(",")[1];
      const houseVariations = [
        "Transform this house with beautiful landscaping, blooming flowers in the garden, golden hour lighting. Make it look like a dream home from a luxury magazine. Add subtle enhancements like warm interior lights visible through windows.",
        "Show this house at sunset with dramatic sky, perfectly manicured lawn, luxury car in the driveway. Aspirational real estate photography style. Make it look inviting and successful.",
        "Create a cozy morning scene of this house with soft sunrise lighting, dewdrops on grass, birds flying nearby. Peaceful residential aesthetic. Make it feel like home.",
      ];
      await generateVariations(houseBase64, "Dream House", houseVariations);
    }

    if (hasDreamCar) {
      const carBase64 = categorizedUploads.dreamCar.split(",")[1];
      const carVariations = [
        "Show this car on a scenic coastal highway during golden hour, with ocean views in the background. Professional automotive photography, dramatic lighting. Make it look luxurious and aspirational.",
        "Place this car in front of a modern luxury home or upscale shopping district. Clean urban aesthetic, bright daylight. Make it look successful and sophisticated.",
        "Show this car in motion on an open road with beautiful mountain or desert landscape. Dynamic automotive photography. Make it look powerful and free.",
      ];
      await generateVariations(carBase64, "Dream Car", carVariations);
    }

    if (hasDestination) {
      const destinationBase64 = categorizedUploads.destination.split(",")[1];
      const destinationVariations = [
        "Enhance this destination with perfect golden hour lighting, add subtle elements like birds flying or gentle waves. Make it look like paradise - a travel magazine cover photo.",
        "Transform this location into the ultimate vacation spot - add luxury elements like elegant lounge chairs, champagne, tropical flowers. Aspirational travel aesthetic.",
        "Show this destination at sunrise or sunset with dramatic colorful sky. Add peaceful atmosphere, make it look serene and breathtaking.",
      ];
      await generateVariations(destinationBase64, "Destination", destinationVariations);
    }

    console.log(`✅ Generated ${scenarioCount} variations from user uploads`);

    // STEP 2B: Generate remaining lifestyle images with DALL-E 3 (feminine aesthetic, NO people)
    const remainingCount = 10 - scenarioCount;
    console.log(`\n🎨 STEP 2/3: Generating ${remainingCount} feminine aesthetic lifestyle images...`);
    const dalleImages: string[] = [];

    // Feminine aesthetic prompts
    const feminineAestheticPrompts = [
      "Elegant coffee setup with pink macarons, fresh roses in a vase, marble countertop, natural morning light. Soft feminine aesthetic, Pinterest-worthy flatlay. NO people.",
      "Luxurious spa setting with candles, rose petals, essential oil bottles, fluffy white towels. Serene wellness aesthetic, soft lighting. NO people.",
      "Cozy reading nook with fluffy blankets, fairy lights, stack of books, warm tea in pretty mug. Hygge aesthetic, golden hour lighting. NO people.",
      "Chic walk-in closet with designer handbags, high heels, jewelry displayed elegantly. Luxury fashion aesthetic, bright organized space. NO people.",
      "Beautiful desk workspace with fresh flowers, rose gold accessories, MacBook, inspirational journal. Girl boss aesthetic, natural light. NO people.",
      "Dreamy bedroom with white linens, soft pillows, fairy lights, plants, pastel decor. Peaceful aesthetic, morning sunshine. NO people.",
      "Champagne glasses clinking at sunset, elegant table setting with flowers and candles. Celebration aesthetic, golden hour. NO people.",
      "Yoga mat with crystals, sage, meditation cushion in bright airy space. Spiritual wellness aesthetic, natural lighting. NO people.",
      "Glamorous vanity table with makeup brushes, perfume bottles, mirror with lights, fresh flowers. Beauty aesthetic, soft romantic lighting. NO people.",
      "Tropical poolside with palm trees, elegant lounge chair, refreshing drinks, designer sunglasses. Vacation aesthetic, sunny paradise. NO people.",
    ];

    for (let i = 0; i < remainingCount && i < feminineAestheticPrompts.length; i++) {
      const imagePrompt = feminineAestheticPrompts[i];

      console.log(`  [${i + 1}/${remainingCount}] Generating feminine aesthetic image ${i + 1}`);

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
          if (data.data?.[0]?.url) {
            const imageUrl = data.data[0].url;
            const imageResponse = await fetch(imageUrl);
            if (imageResponse.ok) {
              const arrayBuffer = await imageResponse.arrayBuffer();
              const base64 = Buffer.from(arrayBuffer).toString("base64");
              dalleImages.push(base64);
              console.log(`  ✓ Generated ${i + 1}/${remainingCount}`);
            }
          }
        }

        if (i < remainingCount - 1) await new Promise(resolve => setTimeout(resolve, 1500));
      } catch (error) {
        console.error(`  ✗ Error ${i + 1}:`, error);
      }
    }

    console.log(`✅ DALL-E: ${dalleImages.length}/${remainingCount} images`);

    // STEP 3: Prepare all images for final collage
    console.log("\n🎨 STEP 3/3: Creating final collage with Gemini (referencing sample1.png)...");

    const imageDataParts: Array<{ inlineData: { data: string; mimeType: string } }> = [];

    // Add scenario images (user integrated into their dreams)
    allGeneratedImages.forEach((base64) => {
      imageDataParts.push({ inlineData: { data: base64, mimeType: "image/png" } });
    });
    console.log(`  + ${allGeneratedImages.length} scenario images (user in their dream life)`);

    // Add DALL-E lifestyle images (NO people)
    dalleImages.forEach((base64) => {
      imageDataParts.push({ inlineData: { data: base64, mimeType: "image/png" } });
    });
    console.log(`  + ${dalleImages.length} lifestyle images`);

    console.log(`  Total images for collage: ${imageDataParts.length}`);

    // Load reference sample1.png
    const samplePath = path.join(process.cwd(), "public", "sample1.png");
    const sampleBuffer = await fs.readFile(samplePath);
    const sampleBase64 = sampleBuffer.toString("base64");

    // Add reference image
    imageDataParts.unshift({
      inlineData: { data: sampleBase64, mimeType: "image/png" }
    });

    // Create final collage prompt
    const finalPrompt = `You are an expert vision board designer. Create a PHYSICAL MAGAZINE-STYLE COLLAGE matching the EXACT style of the FIRST reference image.

REFERENCE STYLE (First Image):
- Physical magazine cutout aesthetic
- Bold text labels in various fonts (handwritten, magazine clippings, stickers)
- Overlapping photos at angles
- Text overlays: "2025", "VISION BOARD", user keywords in BOLD
- Energetic, inspiring, magazine collage vibe
- Mix of photo sizes
- Some photos tilted/rotated
- Background visible between images

USER'S VISION BOARD:
Keywords: ${keywords.join(", ")}

INSTRUCTIONS:
1. Use ALL ${imageDataParts.length - 1} provided images (skip the first reference image)
2. Arrange in magazine collage style like reference
3. Add BOLD TEXT LABELS for each keyword: ${keywords.map(k => `"${k.toUpperCase()}"`).join(", ")}
4. Add "2025" prominently
5. Add "VISION BOARD" title
6. Add affirmations: "FINANCIAL FREEDOM", "PASSIVE INCOME", "SUCCESS", "positive mindset"
7. Magazine cutout aesthetic - photos at angles, overlapping
8. Vibrant, energetic, inspiring
9. 1344x768 landscape format

CREATE THE COLLAGE NOW.`;

    const finalResponse = await genai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: [{
        role: "user",
        parts: [
          ...imageDataParts,
          { text: finalPrompt },
        ],
      }],
      config: { temperature: 0.8, topP: 0.9, topK: 40, maxOutputTokens: 8192 },
    });

    const finalCandidate = finalResponse.candidates?.[0];
    if (!finalCandidate?.content?.parts) {
      throw new Error("No final collage generated");
    }

    const finalImagePart = finalCandidate.content.parts.find((part: { inlineData?: { mimeType?: string; data?: string } }) =>
      part.inlineData?.mimeType?.startsWith("image/")
    );

    if (!finalImagePart?.inlineData?.data) {
      throw new Error("No final image data");
    }

    const finalVisionBoard = `data:${finalImagePart.inlineData.mimeType};base64,${finalImagePart.inlineData.data}`;

    console.log("✅ Final collage created successfully!");

    // Prepare individual images for HTML templates if needed
    const individualImages = useHtmlTemplate
      ? [...allGeneratedImages, ...dalleImages].map(
          (base64) => `data:image/png;base64,${base64}`
        )
      : [];

    return NextResponse.json({
      status: "success",
      final_vision_board: finalVisionBoard,
      individual_images: useHtmlTemplate ? individualImages : undefined,
      metadata: {
        scenario_images: scenarioCount,
        dalle_count: dalleImages.length,
        total_images_used: imageDataParts.length - 1, // Minus reference
        has_user_scenarios: scenarioCount > 0,
      },
    });

  } catch (error: unknown) {
    console.error("❌ Error:", error);
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
