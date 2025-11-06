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
    const allImages: string[] = [];
    const allQuotes: string[] = [];

    // ============================================
    // STEP 1: Generate 7 images with DALL-E (OpenAI)
    // 5 based on user keywords + 2 ALWAYS common lifestyle images
    // ============================================
    console.log("\n🎨 STEP 1/3: Generating 7 images with DALL-E (5 keywords + 2 common lifestyle)...");

    // Ensure we have 7 keywords: 5 user keywords + 2 ALWAYS common lifestyle
    const defaultThemes = ["success", "luxury", "wellness", "adventure", "celebration"];
    const expandedKeywords = [...keywords];
    while (expandedKeywords.length < 5) {
      expandedKeywords.push(defaultThemes[expandedKeywords.length % defaultThemes.length]);
    }

    // ALWAYS add common lifestyle themes + generate house/car/destination if user didn't upload
    expandedKeywords.push("fitness");
    expandedKeywords.push("wealth");

    // CRITICAL: If user didn't upload dream house/car/destination, add them to DALL-E generation
    if (!hasDreamHouse) {
      expandedKeywords.push("dream house");
    }
    if (!hasDreamCar) {
      expandedKeywords.push("dream car");
    }
    if (!hasDestination) {
      expandedKeywords.push("travel destination");
    }

    // CRITICAL: Generate MORE images to fill the board (at least 13-14 images needed)
    const dallePrompts = expandedKeywords.slice(0, 10).map((keyword: string) => {
      // Create contextual prompts based on keywords
      if (keyword.toLowerCase().includes("rich") || keyword.toLowerCase().includes("wealth") || keyword.toLowerCase().includes("money")) {
        return hasSelfie
          ? `Lifestyle image showing wealth and success: luxury dinner at 5-star restaurant, champagne, elegant table setting, gold accents, success aesthetic. CRITICAL: NO people, NO faces, NO humans - only objects and settings.`
          : `Person at elegant luxury dinner, expensive champagne, 5-star restaurant, wealthy lifestyle, success aesthetic, confident and happy expression`;
      }
      if (keyword.toLowerCase().includes("travel") || keyword.toLowerCase().includes("destination")) {
        return `Exotic travel destination: pristine tropical beach with turquoise water, palm trees, luxury resort, paradise aesthetic, travel photography`;
      }
      if (keyword.toLowerCase().includes("happy") || keyword.toLowerCase().includes("joy")) {
        return hasSelfie
          ? `Happiness aesthetic: sunny morning light streaming through window, fresh flowers, cozy reading nook, peaceful joy. CRITICAL: NO people, NO faces, NO humans.`
          : `Joyful person celebrating life, arms raised in happiness, sunrise or sunset, positive energy, smiling and content`;
      }
      if (keyword.toLowerCase().includes("fit") || keyword.toLowerCase().includes("health") || keyword.toLowerCase().includes("exercise") || keyword.toLowerCase().includes("gym") || keyword.toLowerCase().includes("wellness")) {
        return hasSelfie
          ? `Fitness lifestyle scene: yoga mat in sunlit room, healthy smoothie bowl, workout equipment, gym interior, wellness aesthetic. CRITICAL: NO people, NO faces, NO humans - only fitness equipment and wellness settings.`
          : `Person exercising at gym, doing yoga, or running, fit and healthy lifestyle, workout aesthetic, active and energetic`;
      }
      if (keyword.toLowerCase().includes("car") || keyword.toLowerCase().includes("dream car")) {
        return `Luxury sports car: high-end exotic supercar, sleek red Ferrari or Lamborghini, polished exterior, modern automotive photography, dream car aesthetic, wealthy lifestyle`;
      }
      if (keyword.toLowerCase().includes("house") || keyword.toLowerCase().includes("dream house")) {
        return `Luxury modern home: stunning contemporary mansion exterior, beautiful architectural design, pool, manicured landscaping, palm trees, dream house aesthetic, wealthy lifestyle`;
      }
      if (keyword.toLowerCase().includes("food") || keyword.toLowerCase().includes("nutrition") || keyword.toLowerCase().includes("healthy eating")) {
        return hasSelfie
          ? `Healthy food aesthetic: fresh smoothie bowl with berries, colorful salad, organic ingredients, nutritious meal prep, wellness food. CRITICAL: NO people, NO faces, NO humans - only food and table settings.`
          : `Person enjoying healthy meal, fresh smoothie bowl, nutritious food, wellness dining, happy and healthy lifestyle`;
      }
      // Default: lifestyle image based on keyword
      return hasSelfie
        ? `Aspirational lifestyle image representing "${keyword}": magazine aesthetic, vibrant, inspiring, high quality setting. CRITICAL: NO people, NO faces, NO humans - only objects and settings.`
        : `Aspirational person living their best life, representing "${keyword}": magazine aesthetic, vibrant, inspiring lifestyle, confident and successful expression`;
    });

    const dalleImages: string[] = [];
    // ALWAYS generate at least 10 DALL-E images with retry logic (to fill board properly)
    let dalleAttempts = 0;
    const maxDalleAttempts = 15; // 10 images + 5 retries

    while (dalleImages.length < 10 && dalleAttempts < maxDalleAttempts) {
      const currentIndex = dalleImages.length;
      console.log(`  [${currentIndex + 1}/10] Generating DALL-E image for: ${expandedKeywords[currentIndex]}`);

      try {
        const response = await fetch("https://api.openai.com/v1/images/generations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${openaiApiKey}`,
          },
          body: JSON.stringify({
            model: "dall-e-3",
            prompt: dallePrompts[currentIndex],
            n: 1,
            size: "1024x1024",
            quality: "standard",
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`DALL-E API error: ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        const imageUrl = data.data[0].url;

        // Download image and convert to base64
        const imageResponse = await fetch(imageUrl);
        const arrayBuffer = await imageResponse.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString("base64");
        dalleImages.push(base64);
        console.log(`  ✓ Generated DALL-E image ${currentIndex + 1}`);

        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`  ✗ Error generating DALL-E image ${currentIndex + 1}:`, error);
        console.log(`  🔄 Will retry if needed (attempt ${dalleAttempts + 1}/${maxDalleAttempts})`);
      }

      dalleAttempts++;
    }

    console.log(`✅ Generated ${dalleImages.length} DALL-E images`);

    // ============================================
    // STEP 2: Generate MORE images with Gemini (combining user uploads + common lifestyle)
    // CRITICAL: Generate AT LEAST 7-10 combinations to ensure board is filled
    // ============================================
    console.log("\n🎨 STEP 2/3: Generating images with Gemini from user uploads...");

    const geminiImages: string[] = [];

    // Strategy: Create combinations of user's uploaded images
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

    // 5. Add keyword-based scenario generation to reach AT LEAST 10 Gemini images
    // ALWAYS prefer using user's selfie for scenarios
    // User explicitly requested: exercise, rich, happiness, wellness scenarios

    if (combinations.length < 10 && hasSelfie) {
      // PRIORITY 1: User doing EXERCISE/FITNESS (user explicitly requested this)
      combinations.push({
        images: [categorizedUploads.selfie],
        prompt: "CRITICAL IDENTITY PRESERVATION: This person's face, skin tone, hair, eyes, nose, mouth, and ALL facial features MUST remain 100% identical. DO NOT change their ethnicity, age, or any facial characteristic. DO NOT generate a different person. Show this EXACT person exercising at a gym, doing yoga, running, or working out, looking fit and healthy. Their face must be clearly visible and match the input image exactly. Only change the clothing to workout attire and background to a fitness setting."
      });
    }

    if (combinations.length < 10 && hasSelfie) {
      // PRIORITY 2: User showing WEALTH/RICH (user explicitly requested this)
      combinations.push({
        images: [categorizedUploads.selfie],
        prompt: "CRITICAL IDENTITY PRESERVATION: This person's face, skin tone, hair, eyes, nose, mouth, and ALL facial features MUST remain 100% identical. DO NOT change their ethnicity, age, or any facial characteristic. DO NOT generate a different person. Show this EXACT person at an elegant luxury restaurant dining, champagne glass, fine dining, looking wealthy and successful. Their face must be clearly visible and match the input image exactly. Only change the clothing to elegant attire and background to luxury dining."
      });
    }

    if (combinations.length < 10 && hasSelfie) {
      // PRIORITY 3: User showing HAPPINESS (user explicitly requested this)
      combinations.push({
        images: [categorizedUploads.selfie],
        prompt: "CRITICAL IDENTITY PRESERVATION: This person's face, skin tone, hair, eyes, nose, mouth, and ALL facial features MUST remain 100% identical. DO NOT change their ethnicity, age, or any facial characteristic. DO NOT generate a different person. Show this EXACT person celebrating with joyful expression, smiling, positive energy, happy moment. Their face must be clearly visible and match the input image exactly. Only change the background to a celebratory/joyful setting."
      });
    }

    if (combinations.length < 10 && hasSelfie) {
      // PRIORITY 4: User with WELLNESS/MEDITATION (common lifestyle)
      combinations.push({
        images: [categorizedUploads.selfie],
        prompt: "CRITICAL IDENTITY PRESERVATION: This person's face, skin tone, hair, eyes, nose, mouth, and ALL facial features MUST remain 100% identical. DO NOT change their ethnicity, age, or any facial characteristic. DO NOT generate a different person. Show this EXACT person meditating peacefully, doing yoga, or in a spa/relaxation setting, looking calm and centered. Their face must be clearly visible and match the input image exactly. Only change the background to a wellness setting."
      });
    }

    if (combinations.length < 10 && hasSelfie) {
      // PRIORITY 5: User with TRAVEL/ADVENTURE
      combinations.push({
        images: [categorizedUploads.selfie],
        prompt: "CRITICAL IDENTITY PRESERVATION: This person's face, skin tone, hair, eyes, nose, mouth, and ALL facial features MUST remain 100% identical. DO NOT change their ethnicity, age, or any facial characteristic. DO NOT generate a different person. Show this EXACT person at a beautiful exotic travel destination - beach, mountains, or tropical location, looking happy and adventurous. Their face must be clearly visible and match the input image exactly. Only change the background to a travel destination."
      });
    }

    if (combinations.length < 10 && hasSelfie) {
      // PRIORITY 6: User with GOOD FOOD/HEALTHY LIFESTYLE
      combinations.push({
        images: [categorizedUploads.selfie],
        prompt: "CRITICAL IDENTITY PRESERVATION: This person's face, skin tone, hair, eyes, nose, mouth, and ALL facial features MUST remain 100% identical. DO NOT change their ethnicity, age, or any facial characteristic. DO NOT generate a different person. Show this EXACT person enjoying healthy food - smoothie bowl, fresh salad, or preparing nutritious meal, looking healthy and wellness-focused. Their face must be clearly visible and match the input image exactly. Only change the background to a healthy food setting."
      });
    }

    if (combinations.length < 10 && hasSelfie) {
      // PRIORITY 7: User in PROFESSIONAL/OFFICE SUCCESS setting
      combinations.push({
        images: [categorizedUploads.selfie],
        prompt: "CRITICAL IDENTITY PRESERVATION: This person's face, skin tone, hair, eyes, nose, mouth, and ALL facial features MUST remain 100% identical. DO NOT change their ethnicity, age, or any facial characteristic. DO NOT generate a different person. Show this EXACT person in a professional office setting, working on laptop, modern workspace, looking successful and confident. Their face must be clearly visible and match the input image exactly. Only change the clothing to business attire and background to modern office."
      });
    }

    // If still not enough, add original uploads enhanced
    if (combinations.length < 10 && hasDreamCar) {
      combinations.push({
        images: [categorizedUploads.dreamCar],
        prompt: "Enhance this car image to look more luxurious and aspirational. Keep the car brand and model exactly the same. Only improve the setting and lighting."
      });
    }

    if (combinations.length < 10 && hasDreamHouse) {
      combinations.push({
        images: [categorizedUploads.dreamHouse],
        prompt: "Enhance this house image to look more beautiful and aspirational. Keep the house architecture exactly the same. Only improve the landscaping and lighting."
      });
    }

    if (combinations.length < 10 && hasDestination) {
      combinations.push({
        images: [categorizedUploads.destination],
        prompt: "Enhance this destination image to look more vibrant and travel-worthy. Keep landmarks recognizable. Only improve colors and atmosphere."
      });
    }

    // If STILL not 10 images, add more diverse scenarios with user's face
    const additionalScenarios = [
      "CRITICAL IDENTITY PRESERVATION: This person's face, skin tone, hair, eyes, nose, mouth, and ALL facial features MUST remain 100% identical. DO NOT generate a different person. Show this EXACT person relaxing at home in cozy luxury setting, looking content and successful. Their face must match the input exactly.",
      "CRITICAL IDENTITY PRESERVATION: This person's face, skin tone, hair, eyes, nose, mouth, and ALL facial features MUST remain 100% identical. DO NOT generate a different person. Show this EXACT person at a stylish rooftop or penthouse with city view, looking successful. Their face must match the input exactly.",
      "CRITICAL IDENTITY PRESERVATION: This person's face, skin tone, hair, eyes, nose, mouth, and ALL facial features MUST remain 100% identical. DO NOT generate a different person. Show this EXACT person shopping in luxury boutique or enjoying high-end lifestyle, looking happy. Their face must match the input exactly."
    ];

    let scenarioIndex = 0;
    while (combinations.length < 10 && hasSelfie && scenarioIndex < additionalScenarios.length) {
      combinations.push({
        images: [categorizedUploads.selfie],
        prompt: additionalScenarios[scenarioIndex]
      });
      scenarioIndex++;
    }

    // Generate Gemini images from combinations (generate ALL combinations up to 10)
    for (let i = 0; i < Math.min(10, combinations.length); i++) {
      console.log(`  [${i + 1}/${Math.min(10, combinations.length)}] Generating Gemini combination ${i + 1}`);
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
    // STEP 4: Combine all images
    // ============================================
    const allGeneratedImages = [...geminiImages, ...dalleImages];
    console.log(`\n📊 Total images generated: ${allGeneratedImages.length} (${geminiImages.length} Gemini + ${dalleImages.length} DALL-E)`);

    // Return based on template type
    if (selectedTemplate === "ai") {
      // AI-generated collage using Gemini
      console.log("\n🎨 Creating AI-generated collage with Gemini...");
      console.log(`📸 User has selfie: ${hasSelfie}`);

      const imageDataParts = allGeneratedImages.map(base64 => ({
        inlineData: { data: base64, mimeType: "image/png" }
      }));

      // Build collage prompt based on whether user uploaded selfie
      let identityWarning = "";
      if (hasSelfie) {
        identityWarning = `
🚨 USER IDENTITY ALERT: The first ${geminiImages.length} images contain the SAME PERSON (the user). This person's face appears multiple times in different scenarios. When you arrange these images into polaroid frames, you MUST keep their face EXACTLY as shown. DO NOT generate a new person. DO NOT change their appearance. Just crop and arrange the existing images.`;
      }

      const collagePrompt = `CRITICAL COMPOSITING TASK: Arrange ALL ${allGeneratedImages.length} provided images into a 2025 vision board collage.${identityWarning}

🚨 ABSOLUTE RULES - NO EXCEPTIONS:
1. DO NOT GENERATE ANY NEW IMAGES OR PEOPLE - You are a compositor, NOT a generator
2. DO NOT CREATE NEW FACES - Use ONLY the exact images provided
3. DO NOT MODIFY THE PEOPLE in the images - Just crop, resize, rotate, and position them
4. COPY-PASTE each provided image into polaroid frames - DO NOT redraw or regenerate them
5. If you see a person's face in the provided images, that EXACT face must appear in the collage - DO NOT create a different person

YOUR ONLY JOB: Arrange the ${allGeneratedImages.length} images I'm giving you into polaroid frames on a canvas.

STYLE: Polaroid photo frames (white borders, 15-20px thickness) scattered at various angles on light beige background (#f5f1ed).

CANVAS: 1920x1080 pixels (16:9 landscape)

LAYOUT:
- First ${geminiImages.length} images: LARGE polaroid frames (350-500px) - these show the user
- Remaining ${dalleImages.length} images: Medium frames (250-350px) - lifestyle images
- Rotate frames -15° to +15° for scattered look
- Slight overlap (10-20%) for depth
- Fill entire canvas with the provided images

TEXT OVERLAYS (add as decorative labels):
${allQuotes.slice(0, 5).map(q => `- "${q}"`).join("\n")}

CENTER TEXT: Large "2025 VISION BOARD" in elegant font

⚠️ CRITICAL: You are compositing existing images, NOT generating new content. Just arrange the ${allGeneratedImages.length} images I provided into polaroid frames. DO NOT create new people or faces.`;

      const finalResponse = await genai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: [{
          role: "user",
          parts: [
            ...imageDataParts,
            { text: collagePrompt }
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

      console.log("✅ AI-generated collage created successfully!");

      return NextResponse.json({
        status: "success",
        template: "ai",
        final_vision_board: finalVisionBoard,
        metadata: {
          total_images: allGeneratedImages.length,
          gemini_images: geminiImages.length,
          dalle_images: dalleImages.length,
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
          dalle_images: dalleImages.length,
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
