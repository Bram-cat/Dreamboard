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

    // STEP 2: Collect user's ORIGINAL images first, then generate minimal variations
    console.log("\n🎨 STEP 1/3: Using user's original images + creating minimal variations...");
    const genai = new GoogleGenAI({ apiKey: geminiApiKey });
    const allGeneratedImages: string[] = [];
    let scenarioCount = 0;

    // PRIORITY: Add user's ORIGINAL images FIRST (unedited)
    console.log("📸 Adding user's original uploaded images...");
    if (categorizedUploads?.selfie) {
      const selfieBase64 = categorizedUploads.selfie.split(",")[1];
      allGeneratedImages.push(selfieBase64);
      scenarioCount++;
      console.log(`  ✓ Added original selfie`);
    }
    if (categorizedUploads?.dreamHouse) {
      const houseBase64 = categorizedUploads.dreamHouse.split(",")[1];
      allGeneratedImages.push(houseBase64);
      scenarioCount++;
      console.log(`  ✓ Added original house`);
    }
    if (categorizedUploads?.dreamCar) {
      const carBase64 = categorizedUploads.dreamCar.split(",")[1];
      allGeneratedImages.push(carBase64);
      scenarioCount++;
      console.log(`  ✓ Added original car`);
    }
    if (categorizedUploads?.destination) {
      const destBase64 = categorizedUploads.destination.split(",")[1];
      allGeneratedImages.push(destBase64);
      scenarioCount++;
      console.log(`  ✓ Added original destination`);
    }

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
            config: { temperature: 0.4, topP: 0.8, topK: 20, maxOutputTokens: 8192 },
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

    // Generate MINIMAL user WITH their items (combo shots) - only 1 per combo
    if (hasSelfie && hasDreamHouse) {
      const selfieBase64 = categorizedUploads.selfie.split(",")[1];
      const houseBase64 = categorizedUploads.dreamHouse.split(",")[1];
      const comboPrompts = [
        "CRITICAL: Keep this EXACT person's face, skin tone, facial features, and identity completely unchanged. Show this person standing in front of this house. Only change the background/setting, NOT the person. Preserve their race, gender, age, and all facial characteristics exactly as shown."
      ];
      for (const prompt of comboPrompts) {
        console.log(`  [Combo ${scenarioCount + 1}] User WITH house`);
        try {
          const response = await genai.models.generateContent({
            model: "gemini-2.5-flash-image",
            contents: [{ role: "user", parts: [
              { inlineData: { data: selfieBase64, mimeType: "image/jpeg" } },
              { inlineData: { data: houseBase64, mimeType: "image/jpeg" } },
              { text: prompt }
            ]}],
            config: { temperature: 0.4, topP: 0.8, topK: 20, maxOutputTokens: 8192 },
          });
          const candidate = response.candidates?.[0];
          if (candidate?.content?.parts) {
            const imagePart = candidate.content.parts.find((part: { inlineData?: { mimeType?: string; data?: string } }) =>
              part.inlineData?.mimeType?.startsWith("image/")
            );
            if (imagePart?.inlineData?.data) {
              allGeneratedImages.push(imagePart.inlineData.data);
              scenarioCount++;
              console.log(`  ✓ Created combo ${scenarioCount}`);
            }
          }
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.error("  ✗ Error:", error);
        }
      }
    }

    if (hasSelfie && hasDreamCar) {
      const selfieBase64 = categorizedUploads.selfie.split(",")[1];
      const carBase64 = categorizedUploads.dreamCar.split(",")[1];
      const comboPrompts = [
        "CRITICAL: Keep this EXACT person's face, skin tone, facial features, and identity completely unchanged. Show this person with this car. Keep the car's brand and model clearly recognizable. Only change the setting, NOT the person's appearance. Preserve their race, gender, age, and all facial characteristics exactly as shown."
      ];
      for (const prompt of comboPrompts) {
        console.log(`  [Combo ${scenarioCount + 1}] User WITH car`);
        try {
          const response = await genai.models.generateContent({
            model: "gemini-2.5-flash-image",
            contents: [{ role: "user", parts: [
              { inlineData: { data: selfieBase64, mimeType: "image/jpeg" } },
              { inlineData: { data: carBase64, mimeType: "image/jpeg" } },
              { text: prompt }
            ]}],
            config: { temperature: 0.4, topP: 0.8, topK: 20, maxOutputTokens: 8192 },
          });
          const candidate = response.candidates?.[0];
          if (candidate?.content?.parts) {
            const imagePart = candidate.content.parts.find((part: { inlineData?: { mimeType?: string; data?: string } }) =>
              part.inlineData?.mimeType?.startsWith("image/")
            );
            if (imagePart?.inlineData?.data) {
              allGeneratedImages.push(imagePart.inlineData.data);
              scenarioCount++;
              console.log(`  ✓ Created combo ${scenarioCount}`);
            }
          }
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.error("  ✗ Error:", error);
        }
      }
    }

    if (hasSelfie && hasDestination) {
      const selfieBase64 = categorizedUploads.selfie.split(",")[1];
      const destinationBase64 = categorizedUploads.destination.split(",")[1];
      const comboPrompts = [
        "CRITICAL: Keep this EXACT person's face, skin tone, facial features, and identity completely unchanged. Show this person at this destination. Keep the destination's landmarks clearly recognizable. Only change the background/setting, NOT the person's appearance. Preserve their race, gender, age, and all facial characteristics exactly as shown."
      ];
      for (const prompt of comboPrompts) {
        console.log(`  [Combo ${scenarioCount + 1}] User AT destination`);
        try {
          const response = await genai.models.generateContent({
            model: "gemini-2.5-flash-image",
            contents: [{ role: "user", parts: [
              { inlineData: { data: selfieBase64, mimeType: "image/jpeg" } },
              { inlineData: { data: destinationBase64, mimeType: "image/jpeg" } },
              { text: prompt }
            ]}],
            config: { temperature: 0.4, topP: 0.8, topK: 20, maxOutputTokens: 8192 },
          });
          const candidate = response.candidates?.[0];
          if (candidate?.content?.parts) {
            const imagePart = candidate.content.parts.find((part: { inlineData?: { mimeType?: string; data?: string } }) =>
              part.inlineData?.mimeType?.startsWith("image/")
            );
            if (imagePart?.inlineData?.data) {
              allGeneratedImages.push(imagePart.inlineData.data);
              scenarioCount++;
              console.log(`  ✓ Created combo ${scenarioCount}`);
            }
          }
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.error("  ✗ Error:", error);
        }
      }
    }

    // Generate MINIMAL solo selfie variations - only if we don't have combo shots
    if (hasSelfie && !hasDreamHouse && !hasDreamCar && !hasDestination) {
      const selfieBase64 = categorizedUploads.selfie.split(",")[1];
      const selfieVariations = [
        "CRITICAL: Keep this EXACT person's face, skin tone, facial features, and identity completely unchanged. Show this person in a professional setting. Only change the background/clothes, NOT the person's face or identity. Preserve their race, gender, age, and all facial characteristics exactly as shown."
      ];
      await generateVariations(selfieBase64, "Selfie Solo", selfieVariations);
    }

    // Skip standalone item variations - we already have originals and combo shots

    console.log(`✅ Total images so far: ${scenarioCount} (user originals + scenarios)`);

    // STEP 2B: Generate FEWER lifestyle images - prioritize user content
    // Only generate 3-5 complementary lifestyle images MAX
    const maxLifestyleImages = Math.min(5, Math.max(0, 10 - scenarioCount));
    console.log(`\n🎨 STEP 2/3: Generating ${maxLifestyleImages} complementary lifestyle images...`);
    const dalleImages: string[] = [];

    // Enhanced feminine aesthetic prompts - more thoughtful and aspirational
    const feminineAestheticPrompts = [
      "Luxurious morning coffee ritual: artisan latte with heart design, delicate pink macarons on vintage china, single peony in crystal vase, soft morning sunlight streaming through gauze curtains onto white marble. Dreamy lifestyle magazine aesthetic. CRITICAL: NO people, NO faces, NO humans.",

      "Spa sanctuary moment: lit candles in amber glass, scattered rose petals, natural linen towels perfectly folded, eucalyptus branches, smooth stones, diffuser mist. Serene wellness retreat vibe, soft warm lighting. CRITICAL: NO people, NO faces, NO humans.",

      "Cozy reading corner: oversized knit blanket draped over velvet armchair, stack of beautiful books with gold lettering, steaming tea in elegant porcelain cup, vintage brass reading lamp, succulent on side table. Golden hour glow through lace curtains. CRITICAL: NO people, NO faces, NO humans.",

      "Dream closet organization: luxury handbags displayed on glass shelves, designer heels arranged by color, delicate jewelry in velvet-lined drawers, full-length ornate mirror, chandelier lighting. Fashion blogger aesthetic. CRITICAL: NO people, NO faces, NO humans.",

      "Girl boss workspace: MacBook on white desk, fresh white peonies in vase, rose gold pen set, inspirational quotes in gold frame, planner open with handwritten goals, coffee in chic mug, natural light. Productive elegance. CRITICAL: NO people, NO faces, NO humans.",

      "Dreamy bedroom sanctuary: white linen bedding with layers of plush pillows, fairy lights draped above headboard, potted fiddle leaf fig, soft blush throw blanket, bedside table with crystal lamp and journal. Peaceful morning light. CRITICAL: NO people, NO faces, NO humans.",

      "Celebration table setting: champagne flutes catching golden hour light, elegant white plates with gold rim, fresh flowers centerpiece, taper candles in brass holders, silk napkins. Sophisticated dinner party aesthetic. CRITICAL: NO people, NO faces, NO humans.",

      "Wellness meditation space: yoga mat in sunlit room, selenite crystals arranged intentionally, burning sage bundle in abalone shell, meditation cushion, plants, diffuser, prayer beads. Spiritual self-care sanctuary. CRITICAL: NO people, NO faces, NO humans.",

      "Glamorous vanity station: Hollywood-style mirror with warm bulbs, makeup brushes in rose gold holder, perfume bottles displayed artfully, fresh white flowers, vintage jewelry tray, plush velvet stool. Beauty influencer aesthetic. CRITICAL: NO people, NO faces, NO humans.",

      "Luxury vacation vibes: infinity pool overlooking ocean, designer sunglasses on marble table, tropical cocktail with orchid garnish, white cabana with flowing curtains, palm trees swaying. Paradise travel aesthetic, golden hour. CRITICAL: NO people, NO faces, NO humans.",

      "Fresh flowers in abundance: overflowing floral arrangement with roses, peonies, ranunculus in elegant vase, petals scattered on marble surface, soft window light. Romantic luxury flower shop aesthetic. CRITICAL: NO people, NO faces, NO humans.",

      "Chic Parisian balcony: wrought iron bistro set, croissant and espresso on vintage tray, fresh flowers in window box, Eiffel Tower view in soft focus, morning mist. European elegance. CRITICAL: NO people, NO faces, NO humans.",
    ];

    for (let i = 0; i < maxLifestyleImages && i < feminineAestheticPrompts.length; i++) {
      const imagePrompt = feminineAestheticPrompts[i];

      console.log(`  [${i + 1}/${maxLifestyleImages}] Generating lifestyle image ${i + 1}`);

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
              console.log(`  ✓ Generated ${i + 1}/${maxLifestyleImages}`);
            }
          }
        }

        if (i < maxLifestyleImages - 1) await new Promise(resolve => setTimeout(resolve, 1500));
      } catch (error) {
        console.error(`  ✗ Error ${i + 1}:`, error);
      }
    }

    console.log(`✅ DALL-E: ${dalleImages.length}/${maxLifestyleImages} lifestyle images`);

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

    // Create final collage prompt - PRIORITIZE USER'S ACTUAL IMAGES
    const finalPrompt = `You are an expert vision board designer. Create a PHYSICAL MAGAZINE-STYLE COLLAGE matching the style of the FIRST reference image.

REFERENCE STYLE (First Image):
- Physical magazine cutout aesthetic
- Bold text labels in various fonts (handwritten, magazine clippings, stickers)
- Photos at angles with MINIMAL overlap
- Text overlays: "2025", "VISION BOARD", user keywords in BOLD
- Energetic, inspiring, magazine collage vibe

USER'S VISION BOARD:
User's Goals/Keywords: ${keywords.join(", ")}
Total images to use: ${imageDataParts.length - 1} images

CRITICAL REQUIREMENTS:
1. Use ALL ${imageDataParts.length - 1} images (skip the first reference image)
2. THE FIRST ${scenarioCount} IMAGES ARE THE USER'S PERSONAL PHOTOS - FEATURE THESE MOST PROMINENTLY
3. Make user's personal images LARGER and more visible than lifestyle images
4. EVERY IMAGE MUST BE AT LEAST 80% VISIBLE - minimal overlap
5. Arrange photos at different angles for magazine aesthetic
6. Keep user's personal images recognizable and clear

TEXT ELEMENTS - USE USER'S EXACT KEYWORDS:
- "2025" prominently displayed
- "VISION BOARD" title at top
- ONLY use these user keywords as text overlays: ${keywords.map(k => `"${k.toUpperCase()}"`).join(", ")}
- DO NOT add random words like "MONEY", "SUCCESS", "MANIFEST" unless user specified them
- Keep text minimal and clean

STYLE: Magazine cutout aesthetic, vibrant, energetic, inspiring
FORMAT: 1344x768 landscape

CREATE A COLLAGE THAT PROMINENTLY FEATURES THE USER'S PERSONAL IMAGES WITH THEIR EXACT KEYWORDS.`;

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
    // PRIORITY ORDER: User variations first, then DALL-E lifestyle images
    const individualImages = useHtmlTemplate
      ? [...allGeneratedImages, ...dalleImages].map(
          (base64) => `data:image/png;base64,${base64}`
        )
      : [];

    // Also include original user uploads in the response for templates that want to use them
    const userUploads = {
      selfie: categorizedUploads?.selfie || null,
      dreamHouse: categorizedUploads?.dreamHouse || null,
      dreamCar: categorizedUploads?.dreamCar || null,
      destination: categorizedUploads?.destination || null,
    };

    return NextResponse.json({
      status: "success",
      final_vision_board: finalVisionBoard,
      individual_images: useHtmlTemplate ? individualImages : undefined,
      user_uploads: userUploads,
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
