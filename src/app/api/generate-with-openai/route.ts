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

    const dallePrompts = expandedKeywords.slice(0, 7).map((keyword: string) => {
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
      return `Aspirational lifestyle image representing "${keyword}": magazine aesthetic, vibrant, inspiring, high quality. CRITICAL: NO people if possible.`;
    });

    const dalleImages: string[] = [];
    // ALWAYS generate exactly 7 DALL-E images with retry logic
    let dalleAttempts = 0;
    const maxDalleAttempts = 10; // 7 images + 3 retries

    while (dalleImages.length < 7 && dalleAttempts < maxDalleAttempts) {
      const currentIndex = dalleImages.length;
      console.log(`  [${currentIndex + 1}/7] Generating DALL-E image for: ${expandedKeywords[currentIndex]}`);

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
    // STEP 2: Generate 7 images with Gemini (combining user uploads + common lifestyle)
    // ============================================
    console.log("\n🎨 STEP 2/3: Generating 7 images with Gemini from user uploads...");

    const geminiImages: string[] = [];

    // Strategy: Create combinations of user's uploaded images
    const combinations = [];

    // 1. If has selfie + car: person WITH their car
    if (hasSelfie && hasDreamCar) {
      combinations.push({
        images: [categorizedUploads.selfie, categorizedUploads.dreamCar],
        prompt: "CRITICAL: Keep this EXACT person's face, skin tone, and identity unchanged. Show this person standing next to this car, looking successful and happy. Keep the car brand clearly visible. Preserve the person's race, gender, age, and facial features exactly. Only change the background setting to something aspirational."
      });
    }

    // 2. If has selfie + house: person AT their dream house
    if (hasSelfie && hasDreamHouse) {
      combinations.push({
        images: [categorizedUploads.selfie, categorizedUploads.dreamHouse],
        prompt: "CRITICAL: Keep this EXACT person's face, skin tone, and identity unchanged. Show this person in front of this house, looking proud and successful. Preserve the person's race, gender, age, and facial features exactly. Only change the background/setting to something beautiful."
      });
    }

    // 3. If has selfie + destination: person AT destination
    if (hasSelfie && hasDestination) {
      combinations.push({
        images: [categorizedUploads.selfie, categorizedUploads.destination],
        prompt: "CRITICAL: Keep this EXACT person's face, skin tone, and identity unchanged. Show this person at this destination, traveling and enjoying life. Keep destination landmarks recognizable. Preserve the person's race, gender, age, and facial features exactly."
      });
    }

    // 4. If has car + house: combined property wealth scene
    if (hasDreamCar && hasDreamHouse) {
      combinations.push({
        images: [categorizedUploads.dreamCar, categorizedUploads.dreamHouse],
        prompt: "Create a beautiful scene showing this car parked in front of this house. Keep both the car brand and house architecture clearly recognizable. Make it look aspirational and wealthy."
      });
    }

    // 5. Add keyword-based scenario generation to ALWAYS reach 7 Gemini images
    // ALWAYS prefer using user's selfie for scenarios
    // User explicitly requested: exercise, rich, happiness, wellness scenarios

    if (combinations.length < 7 && hasSelfie) {
      // PRIORITY 1: User doing EXERCISE/FITNESS (user explicitly requested this)
      combinations.push({
        images: [categorizedUploads.selfie],
        prompt: "CRITICAL: Keep this EXACT person's face, skin tone, and identity 100% unchanged. Show this person exercising - at gym, doing yoga, running, or working out, looking fit and healthy. Preserve their race, gender, age, and ALL facial features exactly. Only change the background to a fitness setting (gym, yoga studio, or outdoor exercise location)."
      });
    }

    if (combinations.length < 7 && hasSelfie) {
      // PRIORITY 2: User showing WEALTH/RICH (user explicitly requested this)
      combinations.push({
        images: [categorizedUploads.selfie],
        prompt: "CRITICAL: Keep this EXACT person's face, skin tone, and identity 100% unchanged. Show this person at an elegant luxury restaurant or expensive dinner setting, looking wealthy and successful. Add subtle luxury elements like champagne or fine dining. Preserve their race, gender, age, and ALL facial features exactly. Only change the background to a luxurious setting."
      });
    }

    if (combinations.length < 7 && hasSelfie) {
      // PRIORITY 3: User showing HAPPINESS (user explicitly requested this)
      combinations.push({
        images: [categorizedUploads.selfie],
        prompt: "CRITICAL: Keep this EXACT person's face, skin tone, and identity 100% unchanged. Show this person celebrating or in a joyful moment - smiling, happy expression, positive energy. Could be at a celebration, party, or happy life moment. Preserve their race, gender, age, and ALL facial features exactly. Only change the background to a joyful/celebratory setting."
      });
    }

    if (combinations.length < 7 && hasSelfie) {
      // PRIORITY 4: User with WELLNESS/MEDITATION (common lifestyle)
      combinations.push({
        images: [categorizedUploads.selfie],
        prompt: "CRITICAL: Keep this EXACT person's face, skin tone, and identity 100% unchanged. Show this person in a peaceful wellness moment - meditating, doing mindfulness, or in a spa/relaxation setting, looking calm and centered. Preserve their race, gender, age, and ALL facial features exactly. Only change the background to a wellness/meditation setting."
      });
    }

    if (combinations.length < 7 && hasSelfie) {
      // Scenario: User living their "travel" keyword - at exotic destination
      if (keywords.some((k: string) => k.toLowerCase().includes("travel") || k.toLowerCase().includes("destination") || k.toLowerCase().includes("adventure"))) {
        combinations.push({
          images: [categorizedUploads.selfie],
          prompt: "CRITICAL: Keep this EXACT person's face, skin tone, and identity 100% unchanged. Show this person at a beautiful travel destination - beach, mountains, or exotic location, looking happy and adventurous. Preserve their race, gender, age, and ALL facial features exactly. Only change the background to a travel destination."
        });
      }
    }

    if (combinations.length < 7 && hasSelfie) {
      // Scenario: User with GOOD FOOD/HEALTHY LIFESTYLE (user explicitly requested this)
      combinations.push({
        images: [categorizedUploads.selfie],
        prompt: "CRITICAL: Keep this EXACT person's face, skin tone, and identity 100% unchanged. Show this person enjoying healthy food - at a healthy restaurant, with fresh smoothie bowl, or preparing nutritious meal, looking healthy and wellness-focused. Preserve their race, gender, age, and ALL facial features exactly. Only change the background to a healthy food/wellness setting."
      });
    }

    // If still not enough, add original uploads enhanced
    if (combinations.length < 7 && hasDreamCar) {
      combinations.push({
        images: [categorizedUploads.dreamCar],
        prompt: "Enhance this car image to look more luxurious and aspirational. Keep the car brand and model exactly the same. Only improve the setting and lighting."
      });
    }

    if (combinations.length < 7 && hasDreamHouse) {
      combinations.push({
        images: [categorizedUploads.dreamHouse],
        prompt: "Enhance this house image to look more beautiful and aspirational. Keep the house architecture exactly the same. Only improve the landscaping and lighting."
      });
    }

    if (combinations.length < 7 && hasDestination) {
      combinations.push({
        images: [categorizedUploads.destination],
        prompt: "Enhance this destination image to look more vibrant and travel-worthy. Keep landmarks recognizable. Only improve colors and atmosphere."
      });
    }

    // If STILL not 7 images, generate generic aspirational scenes with user's face
    while (combinations.length < 7 && hasSelfie) {
      combinations.push({
        images: [categorizedUploads.selfie],
        prompt: "CRITICAL: Keep this EXACT person's face, skin tone, and identity unchanged. Show this person in a successful, aspirational lifestyle setting - could be office, home, vacation, or celebration. Preserve their race, gender, age, and facial features exactly. Only change the background and setting."
      });
    }

    // Generate Gemini images from combinations
    for (let i = 0; i < Math.min(7, combinations.length); i++) {
      console.log(`  [${i + 1}/7] Generating Gemini combination ${i + 1}`);
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
    // STEP 3: Generate inspirational quotes
    // ============================================
    console.log("\n💬 STEP 3/3: Generating inspirational quotes...");

    // Generate 3-5 quotes based on keywords
    const quoteKeywords = keywords.slice(0, 3);
    for (const keyword of quoteKeywords) {
      const quote = `"${keyword.toUpperCase()}"`;
      allQuotes.push(quote);
    }
    allQuotes.push('"2025"');
    allQuotes.push('"VISION BOARD"');

    console.log(`✅ Generated ${allQuotes.length} text elements`);

    // ============================================
    // STEP 4: Combine all images
    // ============================================
    const allGeneratedImages = [...geminiImages, ...dalleImages];
    console.log(`\n📊 Total images generated: ${allGeneratedImages.length} (${geminiImages.length} Gemini + ${dalleImages.length} DALL-E)`);

    // Return based on template type
    if (selectedTemplate === "ai") {
      // AI-generated collage using Gemini
      console.log("\n🎨 Creating AI-generated collage with Gemini...");

      const imageDataParts = allGeneratedImages.map(base64 => ({
        inlineData: { data: base64, mimeType: "image/png" }
      }));

      const collagePrompt = `Create a beautiful 2025 VISION BOARD collage in a scattered magazine style.

STYLE: Polaroid photo frames (white borders) scattered at angles, overlapping slightly, on a light cream/beige background.

IMAGES: You have ${allGeneratedImages.length} images to arrange.
- First ${geminiImages.length} images are personal/aspirational (FEATURE THESE PROMINENTLY - make them LARGER)
- Remaining ${dalleImages.length} images are lifestyle accents (these can be smaller)

LAYOUT:
- Arrange all ${allGeneratedImages.length} images across a 1344x768 landscape canvas
- Each image in a white polaroid frame (thick white borders)
- Rotate frames at different angles (5-20 degrees)
- Overlap slightly for collage depth
- Ensure 80%+ of each image is visible
- Personal images should be larger and more prominent

TEXT OVERLAYS (magazine cutout style):
${allQuotes.map(q => `- ${q}`).join("\n")}

Create a vibrant, inspiring vision board now.`;

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
