import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import sharp from "sharp";

// Helper function to resize/crop image to target aspect ratio (435x240 = 1.8125:1)
// IMPROVED STRATEGY: Use 'entropy' for better face/content preservation
async function resizeToAspectRatio(base64Data: string, targetAspectRatio: number): Promise<string> {
  try {
    console.log(`    📐 Processing image to aspect ratio ${targetAspectRatio}:1`);

    const imageBuffer = Buffer.from(base64Data, 'base64');
    const metadata = await sharp(imageBuffer).metadata();

    if (!metadata.width || !metadata.height) {
      throw new Error('Could not read image dimensions');
    }

    console.log(`    📏 Original dimensions: ${metadata.width}x${metadata.height} (${(metadata.width / metadata.height).toFixed(2)}:1)`);

    const targetWidth = 435;
    const targetHeight = 240;
    const currentAspectRatio = metadata.width / metadata.height;

    console.log(`    📊 Current aspect ratio: ${currentAspectRatio.toFixed(2)}:1, Target: ${targetAspectRatio}:1`);

    // SMART STRATEGY: Use 'entropy' which focuses on high-detail areas (faces, important content)
    // Entropy-based cropping is better than 'attention' for portrait images that need to be landscape
    const resizedBuffer = await sharp(imageBuffer)
      .resize(targetWidth, targetHeight, {
        fit: 'cover',                // Crop to fill the dimensions exactly
        position: 'entropy',         // Focus on high-information areas (faces, details)
        kernel: 'lanczos3',          // High quality resampling
        withoutEnlargement: false    // Allow enlargement if needed
      })
      .jpeg({ quality: 95, mozjpeg: true })
      .toBuffer();

    // Verify final dimensions
    const finalMetadata = await sharp(resizedBuffer).metadata();
    console.log(`    ✅ Final dimensions: ${finalMetadata.width}x${finalMetadata.height}`);

    if (finalMetadata.width !== targetWidth || finalMetadata.height !== targetHeight) {
      console.error(`    ❌ ERROR: Dimensions are ${finalMetadata.width}x${finalMetadata.height} but should be ${targetWidth}x${targetHeight}`);
    }

    return resizedBuffer.toString('base64');
  } catch (error) {
    console.error('    ❌ Error resizing image:', error);
    // Return original if resize fails
    return base64Data;
  }
}

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
    // NEW STRATEGY: Generate ALL images with Gemini for personalization
    // Grid template: 8 images, Other templates: 15 images
    // All images will include user's face/items for a cohesive personal vision board
    // NO generic OpenAI images - everything is personalized
    // ============================================
    const geminiImages: string[] = [];
    const numGeminiImages = selectedTemplate === "grid" ? 8 : 15;

    if (selectedTemplate !== "ai") {
      console.log(`\n🎨 STEP 1/2: Generating ${numGeminiImages} personalized images with Gemini (ALL images)...`);

    // Strategy: Create diverse image combinations from user uploads + lifestyle scenarios
    const combinations = [];

    // PRIORITY 1: STANDALONE ASSETS (show the actual dream items)
    // These are important to include even without selfie

    // 1A. Dream Car (standalone or with generic person if no selfie)
    if (hasDreamCar) {
      combinations.push({
        images: [categorizedUploads.dreamCar],
        prompt: "Professional automotive photography of this EXACT luxury car. Show the complete vehicle in a beautiful outdoor setting with golden hour lighting. The car should be the main focus, parked in an upscale location (modern driveway, scenic overlook, or luxury showroom). Maintain the exact car model, brand, and color. High-end automotive photography style, aspirational luxury aesthetic, 4K quality."
      });
    }

    // 1B. Dream House (standalone)
    if (hasDreamHouse) {
      combinations.push({
        images: [categorizedUploads.dreamHouse],
        prompt: "Professional real estate photography of this EXACT dream house. Show the complete property with beautiful architecture clearly visible. Golden hour lighting, well-maintained landscaping, upscale neighborhood setting. Maintain the exact house design and features. High-end architectural photography style, aspirational homeownership aesthetic, 4K quality."
      });
    }

    // 1C. Dream Destination (standalone)
    if (hasDestination) {
      combinations.push({
        images: [categorizedUploads.destination],
        prompt: "Professional travel photography of this EXACT destination. Show the iconic landmarks and beautiful scenery of this location. Natural lighting, vibrant colors, stunning composition. Maintain recognizable features of the destination. High-end travel photography style, wanderlust aesthetic, 4K quality."
      });
    }

    // PRIORITY 2: COMBINED SCENARIOS (user with their dream items)

    // 2A. If has selfie + car: person WITH their car
    if (hasSelfie && hasDreamCar) {
      combinations.push({
        images: [categorizedUploads.selfie, categorizedUploads.dreamCar],
        prompt: "CRITICAL FACE PRESERVATION - EXACT REPLICA REQUIRED:\n\nINPUT IMAGE 1 = REFERENCE FACE (MUST COPY EXACTLY):\n- Copy this EXACT face, facial structure, skin tone, hair style, hair color, eye shape, eye color, nose shape, mouth shape, facial hair, and ALL features\n- DO NOT generate a different person or modify ANY facial features\n- This person's complete identity MUST be preserved 100%\n\nINPUT IMAGE 2 = CAR TO INCLUDE:\n- Include this exact car model and brand\n\nOUTPUT IMAGE REQUIREMENTS:\n- CRITICAL: LANDSCAPE/HORIZONTAL orientation (16:9 aspect ratio) - wider than tall\n- Show the EXACT person from image 1 standing confidently next to the car from image 2\n- Composition: Person and car positioned in frame with scenic background\n- Person's face must be clearly visible, front-facing or 3/4 angle, well-lit\n- Include full head with space above, 3/4 or full body shot\n- Maintain perfect facial accuracy - same person, same face\n- Beautiful outdoor setting, professional photography lighting\n- HORIZONTAL LANDSCAPE FORMAT - Aspirational, high-quality lifestyle aesthetic"
      });
    }

    // 2. If has selfie + house: person AT their dream house
    if (hasSelfie && hasDreamHouse) {
      combinations.push({
        images: [categorizedUploads.selfie, categorizedUploads.dreamHouse],
        prompt: "CRITICAL FACE PRESERVATION - EXACT REPLICA REQUIRED:\n\nINPUT IMAGE 1 = REFERENCE FACE (MUST COPY EXACTLY):\n- Copy this EXACT face, facial structure, skin tone, hair style, hair color, eye shape, eye color, nose shape, mouth shape, facial hair, and ALL features\n- DO NOT generate a different person or modify ANY facial features\n- This person's complete identity MUST be preserved 100%\n\nINPUT IMAGE 2 = HOUSE TO INCLUDE:\n- Include this exact house architecture and design\n\nOUTPUT IMAGE REQUIREMENTS:\n- CRITICAL: LANDSCAPE/HORIZONTAL orientation (16:9 aspect ratio) - wider than tall\n- Show the EXACT person from image 1 in front of the house from image 2, looking proud and successful\n- Composition: Person and house positioned in frame with landscaping\n- Person's face must be clearly visible, front-facing or 3/4 angle, well-lit\n- Include full head with space above, 3/4 or full body shot\n- Maintain perfect facial accuracy - same person, same face\n- Golden hour lighting, professional real estate photography style\n- HORIZONTAL LANDSCAPE FORMAT - Aspirational homeownership aesthetic"
      });
    }

    // 3. If has selfie + destination: person AT destination
    if (hasSelfie && hasDestination) {
      combinations.push({
        images: [categorizedUploads.selfie, categorizedUploads.destination],
        prompt: "CRITICAL FACE PRESERVATION - EXACT REPLICA REQUIRED:\n\nINPUT IMAGE 1 = REFERENCE FACE (MUST COPY EXACTLY):\n- Copy this EXACT face, facial structure, skin tone, hair style, hair color, eye shape, eye color, nose shape, mouth shape, facial hair, and ALL features\n- DO NOT generate a different person or modify ANY facial features\n- This person's complete identity MUST be preserved 100%\n\nINPUT IMAGE 2 = DESTINATION TO INCLUDE:\n- Include this exact destination location and landmarks\n\nOUTPUT IMAGE REQUIREMENTS:\n- CRITICAL: LANDSCAPE/HORIZONTAL orientation (16:9 aspect ratio) - wider than tall\n- Show the EXACT person from image 1 at the destination from image 2, traveling and enjoying the experience\n- Composition: Person positioned in LEFT or RIGHT third of frame, with destination landmarks on the other side\n- Person's face must be clearly visible, front-facing or 3/4 angle, well-lit\n- Include full head with space above, 3/4 or full body shot\n- Maintain perfect facial accuracy - same person, same face\n- Natural outdoor lighting, professional travel photography style\n- HORIZONTAL LANDSCAPE FORMAT - Joyful, adventurous aesthetic"
      });
    }

    // PRIORITY 3: LIFESTYLE SCENARIOS WITH SELFIE (only if user uploaded selfie)
    // These show the user living their best life

    if (combinations.length < 11 && hasSelfie) {
      // PRIORITY 1: User with TRAVEL/ADVENTURE
      combinations.push({
        images: [categorizedUploads.selfie],
        prompt: "CRITICAL FACE PRESERVATION - EXACT REPLICA REQUIRED:\n\nINPUT IMAGE = REFERENCE FACE (MUST COPY EXACTLY):\n- Copy this EXACT face: same facial structure, skin tone, hair (style + color), eyes (shape + color), nose shape, mouth shape, facial hair, jawline, and ALL features\n- DO NOT generate a different person or modify ANY facial features\n- This person's complete identity MUST be preserved 100%\n\nOUTPUT REQUIREMENTS:\n- CRITICAL: LANDSCAPE/HORIZONTAL orientation (16:9 aspect ratio) - wider than tall\n- Show EXACT same person at a beautiful exotic travel destination (beach, mountains, or tropical paradise)\n- Composition: Person positioned in LEFT or RIGHT third of frame, with scenic background on the other side\n- Face clearly visible, front-facing or 3/4 angle, genuine happy smile\n- Include full head with space above, waist-up or full body shot\n- Perfect facial accuracy - same person, same face\n- Casual travel clothing, natural outdoor lighting\n- HORIZONTAL LANDSCAPE FORMAT - Professional travel photography style, joyful adventurous aesthetic"
      });
    }

    if (combinations.length < 11 && hasSelfie) {
      // PRIORITY 2: User with GOOD FOOD/HEALTHY LIFESTYLE
      combinations.push({
        images: [categorizedUploads.selfie],
        prompt: "CRITICAL FACE PRESERVATION - EXACT REPLICA REQUIRED:\n\nINPUT IMAGE = REFERENCE FACE (MUST COPY EXACTLY):\n- Copy this EXACT face: same facial structure, skin tone, hair (style + color), eyes (shape + color), nose shape, mouth shape, facial hair, jawline, and ALL features\n- DO NOT generate a different person or modify ANY facial features\n- This person's complete identity MUST be preserved 100%\n\nOUTPUT REQUIREMENTS:\n- CRITICAL: LANDSCAPE/HORIZONTAL orientation (16:9 aspect ratio) - wider than tall\n- Show EXACT same person enjoying healthy food (smoothie bowl, fresh salad, or preparing nutritious meal)\n- Composition: Person positioned in LEFT or RIGHT third of frame, with food/kitchen on the other side\n- Face clearly visible, front-facing or 3/4 angle, happy healthy expression\n- Include full head with space above, waist-up or upper body shot\n- Perfect facial accuracy - same person, same face\n- Bright clean kitchen or cafe, natural lighting\n- HORIZONTAL LANDSCAPE FORMAT - Professional food photography style, wellness vitality aesthetic"
      });
    }

    if (combinations.length < 11 && hasSelfie) {
      // PRIORITY 3: User in PROFESSIONAL/OFFICE SUCCESS setting
      combinations.push({
        images: [categorizedUploads.selfie],
        prompt: "CRITICAL FACE PRESERVATION - EXACT REPLICA REQUIRED:\n\nINPUT IMAGE = REFERENCE FACE (MUST COPY EXACTLY):\n- Copy this EXACT face: same facial structure, skin tone, hair (style + color), eyes (shape + color), nose shape, mouth shape, facial hair, jawline, and ALL features\n- DO NOT generate a different person or modify ANY facial features\n- This person's complete identity MUST be preserved 100%\n\nOUTPUT REQUIREMENTS:\n- CRITICAL: LANDSCAPE/HORIZONTAL orientation (16:9 aspect ratio) - wider than tall\n- Show EXACT same person working in professional office, laptop at modern workspace\n- Composition: Person positioned in LEFT or RIGHT third of frame, with office/windows on the other side\n- Face clearly visible, front-facing or 3/4 angle, confident professional expression\n- Include full head with space above, waist-up seated shot\n- Perfect facial accuracy - same person, same face\n- Business attire (suit/blazer), modern office with windows\n- HORIZONTAL LANDSCAPE FORMAT - Professional corporate photography style, success confidence aesthetic"
      });
    }

    if (combinations.length < 11 && hasSelfie) {
      // PRIORITY 4: User AT LUXURY ROOFTOP
      combinations.push({
        images: [categorizedUploads.selfie],
        prompt: "CRITICAL FACE PRESERVATION - EXACT REPLICA REQUIRED:\n\nINPUT IMAGE = REFERENCE FACE (MUST COPY EXACTLY):\n- Copy this EXACT face: same facial structure, skin tone, hair (style + color), eyes (shape + color), nose shape, mouth shape, facial hair, jawline, and ALL features\n- DO NOT generate a different person or modify ANY facial features\n- This person's complete identity MUST be preserved 100%\n\nOUTPUT REQUIREMENTS:\n- CRITICAL: LANDSCAPE/HORIZONTAL orientation (16:9 aspect ratio) - wider than tall\n- Show EXACT same person at stylish rooftop or penthouse with city skyline view\n- Composition: Person positioned in LEFT or RIGHT third of frame, with city skyline on the other side\n- Face clearly visible, front-facing or 3/4 angle, successful confident smile\n- Include full head with space above, waist-up or 3/4 body shot\n- Perfect facial accuracy - same person, same face\n- Smart casual or semi-formal attire, evening golden hour lighting\n- HORIZONTAL LANDSCAPE FORMAT - Professional lifestyle photography style, luxury success aesthetic"
      });
    }

    if (combinations.length < 11 && hasSelfie) {
      // PRIORITY 5: User doing FITNESS/GYM workout
      combinations.push({
        images: [categorizedUploads.selfie],
        prompt: "CRITICAL FACE PRESERVATION - EXACT REPLICA REQUIRED:\n\nINPUT IMAGE = REFERENCE FACE (MUST COPY EXACTLY):\n- Copy this EXACT face: same facial structure, skin tone, hair (style + color), eyes (shape + color), nose shape, mouth shape, facial hair, jawline, and ALL features\n- DO NOT generate a different person or modify ANY facial features\n- This person's complete identity MUST be preserved 100%\n\nOUTPUT REQUIREMENTS:\n- CRITICAL: LANDSCAPE/HORIZONTAL orientation (16:9 aspect ratio) - wider than tall\n- Show EXACT same person working out at modern luxury gym with floor-to-ceiling windows, doing strength training with dumbbells\n- Composition: Person positioned in LEFT or RIGHT third of frame, with gym equipment/windows on the other side\n- Face clearly visible, front-facing or 3/4 angle, focused determined expression\n- Include full head with space above, upper body or 3/4 body fitness shot\n- Perfect facial accuracy - same person, same face\n- Athletic wear, gym with natural lighting\n- HORIZONTAL LANDSCAPE FORMAT - Professional fitness photography style, strength confidence aesthetic"
      });
    }

    if (combinations.length < 11 && hasSelfie) {
      // PRIORITY 6: User at UPSCALE CELEBRATION
      combinations.push({
        images: [categorizedUploads.selfie],
        prompt: "CRITICAL FACE PRESERVATION - EXACT REPLICA REQUIRED:\n\nINPUT IMAGE = REFERENCE FACE (MUST COPY EXACTLY):\n- Copy this EXACT face: same facial structure, skin tone, hair (style + color), eyes (shape + color), nose shape, mouth shape, facial hair, jawline, and ALL features\n- DO NOT generate a different person or modify ANY facial features\n- This person's complete identity MUST be preserved 100%\n\nOUTPUT REQUIREMENTS:\n- CRITICAL: LANDSCAPE/HORIZONTAL orientation (16:9 aspect ratio) - wider than tall\n- Show EXACT same person at upscale champagne bar/rooftop lounge, raising champagne glass in celebratory toast\n- Composition: Person positioned in LEFT or RIGHT third of frame, with bar/lounge ambiance on the other side\n- Face clearly visible, front-facing or 3/4 angle, genuine happy smile\n- Include full head with space above, waist-up shot with champagne glass\n- Perfect facial accuracy - same person, same face\n- Elegant blazer/formal attire, warm golden ambient lighting\n- HORIZONTAL LANDSCAPE FORMAT - Professional lifestyle photography style, luxury celebration aesthetic"
      });
    }

    if (combinations.length < 11 && hasSelfie) {
      // PRIORITY 7: User doing OUTDOOR MEDITATION/YOGA
      combinations.push({
        images: [categorizedUploads.selfie],
        prompt: "CRITICAL FACE PRESERVATION - EXACT REPLICA REQUIRED:\n\nINPUT IMAGE = REFERENCE FACE (MUST COPY EXACTLY):\n- Copy this EXACT face: same facial structure, skin tone, hair (style + color), eyes (shape + color), nose shape, mouth shape, facial hair, jawline, and ALL features\n- DO NOT generate a different person or modify ANY facial features\n- This person's complete identity MUST be preserved 100%\n\nOUTPUT REQUIREMENTS:\n- CRITICAL: LANDSCAPE/HORIZONTAL orientation (16:9 aspect ratio) - wider than tall\n- Show EXACT same person meditating peacefully outdoors at golden hour sunrise, cross-legged lotus position on deck overlooking mountains/ocean\n- Composition: Person positioned in LEFT or RIGHT third of frame, with scenic mountains/ocean on the other side\n- Face visible (can have eyes closed), peaceful serene expression\n- Include full head with space above, seated meditation full body shot\n- Perfect facial accuracy - same person, same face\n- Comfortable neutral clothing, soft golden morning light\n- HORIZONTAL LANDSCAPE FORMAT - Professional wellness photography style, tranquility mindfulness aesthetic"
      });
    }

    if (combinations.length < 11 && hasSelfie) {
      // PRIORITY 8: User in MODERN OFFICE/WORKING
      combinations.push({
        images: [categorizedUploads.selfie],
        prompt: "CRITICAL FACE PRESERVATION - EXACT REPLICA REQUIRED:\n\nINPUT IMAGE = REFERENCE FACE (MUST COPY EXACTLY):\n- Copy this EXACT face: same facial structure, skin tone, hair (style + color), eyes (shape + color), nose shape, mouth shape, facial hair, jawline, and ALL features\n- DO NOT generate a different person or modify ANY facial features\n- This person's complete identity MUST be preserved 100%\n\nOUTPUT REQUIREMENTS:\n- CRITICAL: LANDSCAPE/HORIZONTAL orientation (16:9 aspect ratio) - wider than tall\n- Show EXACT same person in modern corner office with panoramic city skyline views through floor-to-ceiling windows, at desk with laptop\n- Composition: Person positioned in LEFT or RIGHT third of frame, with city skyline/windows on the other side\n- Face clearly visible, front-facing or 3/4 angle, professional confident expression\n- Include full head with space above, waist-up seated at desk shot\n- Perfect facial accuracy - same person, same face\n- Business attire (suit/blazer), afternoon natural sunlight\n- HORIZONTAL LANDSCAPE FORMAT - Professional corporate photography style, executive success aesthetic"
      });
    }

    // Generate Gemini images from combinations
    console.log(`\n📋 Prepared ${combinations.length} image combinations, will generate ${numGeminiImages} for Gemini`);

    for (let i = 0; i < Math.min(numGeminiImages, combinations.length); i++) {
      console.log(`  [${i + 1}/${numGeminiImages}] Generating Gemini image ${i + 1}`);
      try {
        const combo = combinations[i];
        const imageParts = combo.images.map((dataUrl: string) => ({
          inlineData: {
            data: dataUrl.split(",")[1],
            mimeType: "image/jpeg"
          }
        }));

        // Add VERY explicit aspect ratio instruction to prompt
        const aspectRatioPrompt = `${combo.prompt}\n\n🚨 CRITICAL DIMENSIONS REQUIREMENT 🚨:\n- OUTPUT FORMAT: WIDE LANDSCAPE ONLY - NOT PORTRAIT!\n- ASPECT RATIO: 16:9 or 1.78:1 (WIDER than tall)\n- MINIMUM WIDTH: 1600px\n- ORIENTATION: HORIZONTAL/LANDSCAPE (width MUST be 1.78x greater than height)\n- DO NOT generate portrait/vertical images\n- DO NOT generate square images\n- MUST be WIDE LANDSCAPE format like a movie screen or TV\n\nExample valid dimensions:\n- 1920x1080 (16:9)\n- 1600x900 (16:9)\n- 1440x810 (16:9)`;

        const response = await genai.models.generateContent({
          model: "gemini-2.5-flash-image",
          contents: [{
            role: "user",
            parts: [
              ...imageParts,
              { text: aspectRatioPrompt }
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
            // Process image to ensure correct aspect ratio
            const processedImage = await resizeToAspectRatio(imagePart.inlineData.data, 1.8125); // 435/240 = 1.8125
            geminiImages.push(processedImage);
            console.log(`  ✓ Generated and processed Gemini image ${i + 1}`);
          }
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`  ✗ Error generating Gemini image ${i + 1}:`, error);
      }
    }

      console.log(`✅ Generated ${geminiImages.length} personalized Gemini images total`);
    } else {
      console.log("\n⏭️  STEP 1/2: Skipping Gemini multi-step generation for AI template (using one-shot instead)");
    }

    // ============================================
    // Use ONLY Gemini images (all personalized)
    // Grid: 8 total, Others: 15 total
    // ============================================
    const allGeneratedImages = [...geminiImages];
    console.log(`\n🎉 Total images generated: ${allGeneratedImages.length} (all personalized with Gemini)`);

    // ============================================
    // STEP 2: Generate inspirational quotes with AI
    // ============================================
    console.log("\n💬 STEP 2/2: Generating inspirational quotes with AI...");

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

      // Images are now JPEG format after sharp processing
      const individualImages = allGeneratedImages.map(base64 => `data:image/jpeg;base64,${base64}`);

      return NextResponse.json({
        status: "success",
        template: selectedTemplate,
        individual_images: individualImages,
        quotes: allQuotes,
        metadata: {
          total_images: allGeneratedImages.length,
          gemini_images: geminiImages.length,
          generation_method: "gemini_personalized_only",
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
