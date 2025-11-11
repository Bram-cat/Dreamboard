import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(request: NextRequest) {
  try {
    const { keywords, categorizedUploads, selectedTemplate } = await request.json();

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

    console.log("🎨 Starting vision board generation...");
    console.log("📝 User keywords:", keywords);
    console.log("🎭 Selected template:", selectedTemplate);

    // Check what user uploaded
    const hasSelfie = !!categorizedUploads?.selfie;
    const hasDreamHouse = !!categorizedUploads?.dreamHouse;
    const hasDreamCar = !!categorizedUploads?.dreamCar;
    const hasDestination = !!categorizedUploads?.destination;

    console.log("📸 User uploads:", { hasSelfie, hasDreamHouse, hasDreamCar, hasDestination });

    const genai = new GoogleGenAI({ apiKey: geminiApiKey });
    const allQuotes: string[] = [];

    // ============================================
    // STEP 1: SKIP DALL-E (cannot personalize with user's face)
    // Use Gemini for ALL 8 images to maintain consistency
    // ============================================
    console.log("\n⏭️  STEP 1/3: Skipping DALL-E (using Gemini for all images to maintain personalization)");

    // ============================================
    // STEP 2: Generate 8 images with Gemini (all personalized with user's selfie)
    // SKIP for AI template - AI template uses Gemini one-shot only
    // ============================================
    const geminiImages: string[] = [];

    if (selectedTemplate !== "ai") {
      console.log("\n🎨 STEP 2/3: Generating 8 personalized images with Gemini...");

    // Strategy: Create 4 scenario combinations from user's uploaded images
    const combinations = [];

    // PRIORITY COMBINATIONS: User with their uploads (selfie+car, selfie+house, car+house+destination)

    // 1. If has selfie + car: person WITH their car
    if (hasSelfie && hasDreamCar) {
      combinations.push({
        images: [categorizedUploads.selfie, categorizedUploads.dreamCar],
        prompt: "CRITICAL IDENTITY PRESERVATION: This person's face, skin tone, hair, eyes, nose, mouth, and ALL facial features MUST remain 100% identical to the first image. DO NOT change their ethnicity, age, or any facial characteristic. Show this EXACT person standing proudly next to this EXACT car. Keep the car brand and model clearly visible. Make the scene aspirational with beautiful lighting and setting, but the person and car must be recognizable."
      });
    }

    // 2. If has selfie + house: person AT their dream house
    if (hasSelfie && hasDreamHouse) {
      combinations.push({
        images: [categorizedUploads.selfie, categorizedUploads.dreamHouse],
        prompt: "CRITICAL IDENTITY PRESERVATION: This person's face, skin tone, hair, eyes, nose, mouth, and ALL facial features MUST remain 100% identical to the first image. DO NOT change their ethnicity, age, or any facial characteristic. Show this EXACT person in front of this EXACT house, looking proud and successful. Keep the house architecture recognizable. Only enhance the lighting and atmosphere."
      });
    }

    // 3. If has selfie + destination: person AT destination
    if (hasSelfie && hasDestination) {
      combinations.push({
        images: [categorizedUploads.selfie, categorizedUploads.destination],
        prompt: "CRITICAL IDENTITY PRESERVATION: This person's face, skin tone, hair, eyes, nose, mouth, and ALL facial features MUST remain 100% identical to the first image. DO NOT change their ethnicity, age, or any facial characteristic. Show this EXACT person at this EXACT destination, traveling and enjoying life. Keep destination landmarks recognizable. Make it aspirational but preserve their identity 100%."
      });
    }

    // 4. If has car + house + destination: triple combination wealth scene
    if (hasDreamCar && hasDreamHouse && hasDestination) {
      combinations.push({
        images: [categorizedUploads.dreamCar, categorizedUploads.dreamHouse, categorizedUploads.destination],
        prompt: "Create a beautiful composite scene blending these three elements: this car, this house, and this destination. Make it look like a luxury lifestyle collage - car parked at a beautiful property with destination vibes in the background. Keep all elements recognizable and aspirational."
      });
    }

    // 5. If has car + house: combined property wealth scene
    if (hasDreamCar && hasDreamHouse) {
      combinations.push({
        images: [categorizedUploads.dreamCar, categorizedUploads.dreamHouse],
        prompt: "Create a beautiful scene showing this EXACT car parked in front of this EXACT house. Keep both the car brand/model and house architecture clearly recognizable. Add beautiful lighting, landscaping, and atmosphere to make it look aspirational and wealthy."
      });
    }

    // 5. Add keyword-based scenario generation to reach 4 Gemini images
    // ALWAYS prefer using user's selfie for scenarios
    // User explicitly requested: exercise, rich, happiness, wellness scenarios

    if (combinations.length < 4 && hasSelfie) {
      // PRIORITY 1: User with TRAVEL/ADVENTURE
      combinations.push({
        images: [categorizedUploads.selfie],
        prompt: "CRITICAL IDENTITY PRESERVATION: This person's face, skin tone, hair, eyes, nose, mouth, and ALL facial features MUST remain 100% identical. DO NOT change their ethnicity, age, or any facial characteristic. DO NOT generate a different person. Show this EXACT person at a beautiful exotic travel destination - beach, mountains, or tropical location, looking happy and adventurous. Their face must be clearly visible and match the input image exactly. Only change the background to a travel destination."
      });
    }

    if (combinations.length < 4 && hasSelfie) {
      // PRIORITY 2: User with GOOD FOOD/HEALTHY LIFESTYLE
      combinations.push({
        images: [categorizedUploads.selfie],
        prompt: "CRITICAL IDENTITY PRESERVATION: This person's face, skin tone, hair, eyes, nose, mouth, and ALL facial features MUST remain 100% identical. DO NOT change their ethnicity, age, or any facial characteristic. DO NOT generate a different person. Show this EXACT person enjoying healthy food - smoothie bowl, fresh salad, or preparing nutritious meal, looking healthy and wellness-focused. Their face must be clearly visible and match the input image exactly. Only change the background to a healthy food setting."
      });
    }

    if (combinations.length < 4 && hasSelfie) {
      // PRIORITY 3: User in PROFESSIONAL/OFFICE SUCCESS setting
      combinations.push({
        images: [categorizedUploads.selfie],
        prompt: "CRITICAL IDENTITY PRESERVATION: This person's face, skin tone, hair, eyes, nose, mouth, and ALL facial features MUST remain 100% identical. DO NOT change their ethnicity, age, or any facial characteristic. DO NOT generate a different person. Show this EXACT person in a professional office setting, working on laptop, modern workspace, looking successful and confident. Their face must be clearly visible and match the input image exactly. Only change the clothing to business attire and background to modern office."
      });
    }

    if (combinations.length < 8 && hasSelfie) {
      // PRIORITY 4: User AT LUXURY ROOFTOP
      combinations.push({
        images: [categorizedUploads.selfie],
        prompt: "CRITICAL IDENTITY PRESERVATION: This person's face, skin tone, hair, eyes, nose, mouth, and ALL facial features MUST remain 100% identical. DO NOT change their ethnicity, age, or any facial characteristic. DO NOT generate a different person. Show this EXACT person at a stylish rooftop or penthouse with city skyline view, looking successful and confident. Their face must be clearly visible and match the input image exactly. Only change the background to luxury rooftop setting."
      });
    }

    if (combinations.length < 8 && hasSelfie) {
      // PRIORITY 5: User doing FITNESS/GYM workout
      combinations.push({
        images: [categorizedUploads.selfie],
        prompt: "CRITICAL IDENTITY PRESERVATION: This person's face, skin tone, hair, eyes, nose, mouth, and ALL facial features MUST remain 100% identical. DO NOT change their ethnicity, age, or any facial characteristic. DO NOT generate a different person. Show this EXACT person working out at a modern luxury gym with floor-to-ceiling windows and city views, doing strength training with dumbbells, wearing athletic wear, confident focused expression. Their face must be clearly visible and match the input image exactly. Only change the clothing to gym attire and background to fitness center."
      });
    }

    if (combinations.length < 8 && hasSelfie) {
      // PRIORITY 6: User at UPSCALE CELEBRATION
      combinations.push({
        images: [categorizedUploads.selfie],
        prompt: "CRITICAL IDENTITY PRESERVATION: This person's face, skin tone, hair, eyes, nose, mouth, and ALL facial features MUST remain 100% identical. DO NOT change their ethnicity, age, or any facial characteristic. DO NOT generate a different person. Show this EXACT person at an upscale champagne bar or rooftop lounge, wearing an elegant blazer, raising a glass of champagne in a celebratory toast with a genuine smile, warm golden ambient lighting. Their face must be clearly visible and match the input image exactly. Only change the clothing to formal attire and background to luxury bar setting."
      });
    }

    if (combinations.length < 8 && hasSelfie) {
      // PRIORITY 7: User doing OUTDOOR MEDITATION/YOGA
      combinations.push({
        images: [categorizedUploads.selfie],
        prompt: "CRITICAL IDENTITY PRESERVATION: This person's face, skin tone, hair, eyes, nose, mouth, and ALL facial features MUST remain 100% identical. DO NOT change their ethnicity, age, or any facial characteristic. DO NOT generate a different person. Show this EXACT person meditating peacefully outdoors at golden hour sunrise, sitting cross-legged in lotus position on a deck overlooking mountains or ocean, wearing comfortable neutral clothing, eyes closed, serene expression. Their face must be clearly visible and match the input image exactly. Only change the background to peaceful outdoor wellness setting."
      });
    }

    if (combinations.length < 8 && hasSelfie) {
      // PRIORITY 8: User in MODERN OFFICE/WORKING
      combinations.push({
        images: [categorizedUploads.selfie],
        prompt: "CRITICAL IDENTITY PRESERVATION: This person's face, skin tone, hair, eyes, nose, mouth, and ALL facial features MUST remain 100% identical. DO NOT change their ethnicity, age, or any facial characteristic. DO NOT generate a different person. Show this EXACT person working in a modern corner office with panoramic city skyline views through floor-to-ceiling windows, sitting at a desk with laptop, wearing business attire, professional confident expression. Their face must be clearly visible and match the input image exactly. Only change the clothing to business attire and background to modern office."
      });
    }

    // Generate Gemini images from combinations (generate ALL combinations up to 8)
    for (let i = 0; i < Math.min(8, combinations.length); i++) {
      console.log(`  [${i + 1}/${Math.min(8, combinations.length)}] Generating Gemini combination ${i + 1}`);
      try {
        const combo = combinations[i];
        const imageParts = combo.images.map((dataUrl: string) => ({
          inlineData: {
            data: dataUrl.split(",")[1],
            mimeType: "image/jpeg"
          }
        }));

        const response = await genai.models.generateContent({
          model: "gemini-2.5-flash-image",
          contents: [{
            role: "user",
            parts: [
              ...imageParts,
              { text: combo.prompt }
            ]
          }],
          config: { temperature: 0.3, topP: 0.8, topK: 20, maxOutputTokens: 8192 },
        });

        const candidate = response.candidates?.[0];
        if (candidate?.content?.parts) {
          const imagePart = candidate.content.parts.find((part: { inlineData?: { mimeType?: string; data?: string } }) =>
            part.inlineData?.mimeType?.startsWith("image/")
          );
          if (imagePart?.inlineData?.data) {
            geminiImages.push(imagePart.inlineData.data);
            console.log(`  ✓ Generated Gemini image ${i + 1}`);
          }
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`  ✗ Error generating Gemini image ${i + 1}:`, error);
      }
    }

      console.log(`✅ Generated ${geminiImages.length} Gemini images`);
    } else {
      console.log("\n⏭️  STEP 2/3: Skipping Gemini multi-step generation for AI template (using one-shot instead)");
    }

    // ============================================
    // STEP 3: Generate inspirational quotes with AI
    // ============================================
    console.log("\n💬 STEP 3/3: Generating inspirational quotes with AI...");

    try {
      // Use Gemini to generate real inspirational quotes based on keywords
      const quotePrompt = `Generate 5 short, powerful, inspirational quotes for a 2025 vision board based on these themes: ${keywords.join(", ")}

Requirements:
- Each quote must be 3-7 words maximum
- Must be motivational and aspirational
- Focus on success, achievement, and dreams
- Use present tense or future tense
- Make them emotionally powerful

Examples of good quotes:
- "Dreams become reality"
- "Success is my destiny"
- "Living my best life"
- "Unstoppable and fearless"

Return ONLY the 5 quotes, one per line, without quotes or numbering.`;

      const quoteResponse = await genai.models.generateContent({
        model: "gemini-2.0-flash-lite",
        contents: [{
          role: "user",
          parts: [{ text: quotePrompt }]
        }],
        config: { temperature: 0.9, topP: 0.95, topK: 40, maxOutputTokens: 200 },
      });

      const quoteText = quoteResponse.text?.trim() || "";
      const generatedQuotes = quoteText
        .split("\n")
        .filter((q: string) => q.trim().length > 0)
        .map((q: string) => q.trim().replace(/^["']|["']$/g, "")) // Remove quotes if present
        .slice(0, 5);

      allQuotes.push(...generatedQuotes);
      console.log(`✅ Generated ${allQuotes.length} inspirational quotes:`, allQuotes);
    } catch (error) {
      console.error("Error generating quotes:", error);
      // Fallback to keyword-based quotes if AI fails
      const quoteKeywords = keywords.slice(0, 3);
      for (const keyword of quoteKeywords) {
        allQuotes.push(keyword.toUpperCase());
      }
      allQuotes.push("2025 VISION");
      allQuotes.push("DREAM BIG");
    }

    // ============================================
    // STEP 4: Combine all images (Gemini only)
    // ============================================
    const allGeneratedImages = [...geminiImages];
    console.log(`\n📊 Total images generated: ${allGeneratedImages.length} (all Gemini for personalization)`);

    // Return based on template type
    if (selectedTemplate === "ai") {
      // AI-generated collage using Gemini ONE-SHOT (no DALL-E, no multi-step)
      console.log("\n🎨 Creating AI-generated collage with Gemini ONE-SHOT...");
      console.log(`📸 User uploads: selfie=${hasSelfie}, house=${hasDreamHouse}, car=${hasDreamCar}, destination=${hasDestination}`);

      // Collect user uploaded images only
      const userImageParts = [];
      if (hasSelfie) {
        userImageParts.push({
          inlineData: {
            data: categorizedUploads.selfie.split(",")[1],
            mimeType: "image/jpeg"
          }
        });
      }
      if (hasDreamHouse) {
        userImageParts.push({
          inlineData: {
            data: categorizedUploads.dreamHouse.split(",")[1],
            mimeType: "image/jpeg"
          }
        });
      }
      if (hasDreamCar) {
        userImageParts.push({
          inlineData: {
            data: categorizedUploads.dreamCar.split(",")[1],
            mimeType: "image/jpeg"
          }
        });
      }
      if (hasDestination) {
        userImageParts.push({
          inlineData: {
            data: categorizedUploads.destination.split(",")[1],
            mimeType: "image/jpeg"
          }
        });
      }

      console.log(`📸 Using ${userImageParts.length} user images for one-shot generation`);

      // Build magazine-style collage prompt (reference: sample.png)
      const magazinePrompt = hasSelfie
        ? `CREATE A 2025 VISION BOARD COLLAGE - MAGAZINE STYLE

🎨 CANVAS SIZE: 1920x1080 pixels (16:9 landscape)

🚨 CRITICAL - PERSON IDENTITY PRESERVATION:
The FIRST provided image shows a REAL PERSON. This is the user of this vision board.
- Study their face carefully: facial features, skin tone, hair, eye color, nose shape, facial structure
- This EXACT person must appear in 4-6 different photo tiles across the board
- NEVER change their face, ethnicity, age, or core appearance
- ONLY change: clothing, pose, background setting to match different life goals

📸 PERSON SCENARIOS (showing the same person from image 1):
1. EXERCISE/FITNESS: Person working out at gym, doing yoga, or running - active and healthy
2. WEALTH/SUCCESS: Person in elegant business attire or luxury setting - confident and successful
3. TRAVEL/ADVENTURE: Person at beautiful destination (use destination image if provided) - exploring and happy
4. MEDITATION/WELLNESS: Person meditating peacefully or in spa setting - calm and centered
5. CELEBRATION/JOY: Person celebrating, smiling, arms raised - happy and fulfilled
6. PROFESSIONAL: Person in modern office or working on laptop - focused and accomplished

${hasDreamCar ? '🚗 CAR TILE: Include the provided dream car image as one of the photo tiles' : ''}
${hasDreamHouse ? '🏠 HOUSE TILE: Include the provided dream house image as one of the photo tiles' : ''}
${hasDestination ? '🌍 DESTINATION TILE: Include the provided destination image as one of the photo tiles' : ''}

📐 LAYOUT STRUCTURE (Magazine Grid - like sample reference):
- Total: 12-15 rectangular photo tiles in asymmetric grid
- Tile sizes: Mix of large (500x350px), medium (350x250px), small (250x200px)
- Background: Light beige/cream (#f5f1ed)
- Gaps: 10-20px between tiles
- NO borders, NO frames - clean magazine style

🎯 CENTER FOCAL CARD (beige card in center-left area):
- Size: 400-500px wide x 300-350px tall
- Background: Solid tan/beige (#d6c1b1)
- Text layout:
  * Top: Small decorative "+" symbol
  * "Dream Big" (cursive/script font, 36px)
  * "Vision Board" (serif font, 28px)
  * "2025" (bold sans-serif, 72px)
  * Bottom: Small decorative "+" symbol
- All text: White color (#ffffff)

📝 TEXT LABELS (on 3-4 photo tiles):
Add beige rectangular labels in bottom-right corner of select tiles:
- Keywords: ${keywords.slice(0, 4).join(", ").toUpperCase()}
- Style: Sans-serif, bold, uppercase, 14-16px
- Background: rgba(214, 193, 177, 0.85)
- Examples: "WEALTH", "TRAVELLING", "FITNESS", "MEDITATION"

🎨 VISUAL CONSISTENCY:
- All photos of the person must show the SAME face/person (consistent identity)
- Cohesive color palette: beige, tan, warm tones
- Professional lifestyle photography aesthetic
- Modern, clean, aspirational magazine layout
- Natural lighting and realistic scenes

✅ FINAL CHECKLIST:
- [ ] Same person appears in 4-6 tiles with identical facial features
- [ ] Person's ethnicity and appearance preserved across all scenarios
- [ ] Clean rectangular grid (no polaroid frames)
- [ ] Center beige card with "2025 Vision Board" text
- [ ] 3-4 keyword labels on tiles
- [ ] 1920x1080 canvas filled completely
- [ ] Professional magazine aesthetic`
        : `CREATE A 2025 VISION BOARD COLLAGE - MAGAZINE STYLE

🎨 CANVAS SIZE: 1920x1080 pixels (16:9 landscape)

📸 GENERATE LIFESTYLE IMAGERY:
Create 12-15 aspirational lifestyle photos representing these themes:
${keywords.join(", ")}

Include these categories:
- Success and wealth imagery
- Travel and adventure
- Fitness and wellness
- Meditation and mindfulness
- Celebration and joy
- Professional achievement
${hasDreamCar ? '- Include the provided dream car image' : '- Luxury dream car'}
${hasDreamHouse ? '- Include the provided dream house image' : '- Beautiful dream home'}
${hasDestination ? '- Include the provided travel destination' : '- Exotic travel destination'}

📐 LAYOUT STRUCTURE (Magazine Grid):
- Total: 12-15 rectangular photo tiles in asymmetric grid
- Tile sizes: Mix of large (500x350px), medium (350x250px), small (250x200px)
- Background: Light beige/cream (#f5f1ed)
- Gaps: 10-20px between tiles
- NO borders, NO frames - clean magazine style

🎯 CENTER FOCAL CARD (beige card in center-left area):
- Size: 400-500px wide x 300-350px tall
- Background: Solid tan/beige (#d6c1b1)
- Text layout:
  * Top: Small decorative "+" symbol
  * "Dream Big" (cursive/script font, 36px)
  * "Vision Board" (serif font, 28px)
  * "2025" (bold sans-serif, 72px)
  * Bottom: Small decorative "+" symbol
- All text: White color (#ffffff)

📝 TEXT LABELS (on 3-4 photo tiles):
Add beige rectangular labels in bottom-right corner of select tiles:
- Keywords: ${keywords.slice(0, 4).join(", ").toUpperCase()}
- Style: Sans-serif, bold, uppercase, 14-16px
- Background: rgba(214, 193, 177, 0.85)

🎨 VISUAL STYLE:
- Cohesive color palette: beige, tan, warm tones
- Professional lifestyle photography aesthetic
- Modern, clean, aspirational magazine layout
- Natural lighting and realistic scenes

✅ FINAL CHECKLIST:
- [ ] Clean rectangular grid (no polaroid frames)
- [ ] Center beige card with "2025 Vision Board" text
- [ ] 3-4 keyword labels on tiles
- [ ] 1920x1080 canvas filled completely
- [ ] Professional magazine aesthetic`;

      const finalResponse = await genai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: [{
          role: "user",
          parts: [
            ...userImageParts,
            { text: magazinePrompt }
          ]
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

      console.log("✅ AI-generated magazine-style collage created successfully!");

      return NextResponse.json({
        status: "success",
        template: "ai",
        final_vision_board: finalVisionBoard,
        metadata: {
          generation_method: "gemini_one_shot",
          user_images_provided: userImageParts.length,
          keywords: keywords,
        },
      });
    } else {
      // Return individual images for HTML templates (polaroid or grid)
      console.log(`\n🎨 Returning ${allGeneratedImages.length} individual images for template: ${selectedTemplate}`);

      const individualImages = allGeneratedImages.map(base64 => `data:image/png;base64,${base64}`);

      return NextResponse.json({
        status: "success",
        template: selectedTemplate,
        individual_images: individualImages,
        quotes: allQuotes,
        metadata: {
          total_images: allGeneratedImages.length,
          gemini_images: geminiImages.length,
          dalle_images: 0, // Skipped for personalization
        },
      });
    }

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
