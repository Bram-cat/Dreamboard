import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import sharp from "sharp";

export async function POST(request: NextRequest) {
  try {
    const { goals, categorizedUploads, uploadContext, style } =
      await request.json();

    if (!goals || typeof goals !== "string") {
      return NextResponse.json(
        { error: "Goals text is required" },
        { status: 400 }
      );
    }

    // Check API key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY not found in environment variables");
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    console.log("Creating vision board with Gemini 2.5 Flash Image...");
    console.log("User goals:", goals);
    console.log("Uploaded:", uploadContext);
    console.log("API Key present:", !!apiKey);

    // Initialize Gemini client
    const genai = new GoogleGenAI({ apiKey });

    // Prepare reference images for Gemini (convert data URIs to parts)
    const imageParts = [];

    if (
      categorizedUploads?.selfie &&
      categorizedUploads.selfie.startsWith("data:")
    ) {
      // Extract base64 data
      const base64Data = categorizedUploads.selfie.split(",")[1];
      const mimeType = categorizedUploads.selfie.split(";")[0].split(":")[1];
      imageParts.push({
        inlineData: {
          data: base64Data,
          mimeType: mimeType,
        },
      });
      console.log("Added selfie as reference image");
    }

    if (
      categorizedUploads?.dreamCar &&
      categorizedUploads.dreamCar.startsWith("data:")
    ) {
      const base64Data = categorizedUploads.dreamCar.split(",")[1];
      const mimeType = categorizedUploads.dreamCar.split(";")[0].split(":")[1];
      imageParts.push({
        inlineData: {
          data: base64Data,
          mimeType: mimeType,
        },
      });
      console.log("Added dream car as reference image");
    }

    if (
      categorizedUploads?.dreamHouse &&
      categorizedUploads.dreamHouse.startsWith("data:")
    ) {
      const base64Data = categorizedUploads.dreamHouse.split(",")[1];
      const mimeType = categorizedUploads.dreamHouse
        .split(";")[0]
        .split(":")[1];
      imageParts.push({
        inlineData: {
          data: base64Data,
          mimeType: mimeType,
        },
      });
      console.log("Added dream house as reference image");
    }

    console.log(`Total reference images: ${imageParts.length}`);

    // Build context about what images are available
    const hasSelfie = uploadContext?.hasSelfie || false;
    const hasCar = uploadContext?.hasDreamCar || false;
    const hasHouse = uploadContext?.hasDreamHouse || false;

    // Style variations based on sample images
    const selectedStyle =
      style || ["bold", "polaroid", "torn"][Math.floor(Math.random() * 3)];
    console.log("Selected style:", selectedStyle);

    // Define style-specific prompts
    const stylePrompts = {
      bold: `Create a BOLD, GRAPHIC vision board collage with high contrast and impactful typography.

STYLE INSPIRATION: Magazine editorial with bold text overlays, high contrast, modern aesthetic
- Large bold typography as key design elements
- Strong geometric shapes and clean lines
- High contrast color palette with pops of vibrant colors
- Mix of photos and graphic text elements
- Bold sans-serif fonts for main statements
- Clean white and black text overlays
- Professional magazine cover aesthetic
- Text elements like "FINANCIAL FREEDOM", "2025", "VISION BOARD" in bold blocks
- 80% coverage with strategic white space for text`,

      polaroid: `Create an ORGANIC, OVERLAPPING vision board collage with polaroid-style photos at varied angles.

STYLE INSPIRATION: Scattered polaroid photos with natural overlap, dynamic angles
- Multiple polaroid frames with white borders
- Photos tilted at various angles (15-45 degrees)
- Heavy overlapping creating depth
- Mix of square and rectangular frames
- Handwritten-style captions and labels
- Casual, authentic feel like a real cork board
- 90% coverage with photos layered on top of each other
- Organic placement, not grid-based
- Some photos partially covering others`,

      torn: `Create a SOFT, LAYERED vision board collage with torn paper edges and handwritten elements.

STYLE INSPIRATION: Torn magazine pages with soft aesthetic, handwritten quotes
- Torn paper edges on all photo elements (irregular, organic edges)
- Soft, warm color palette (beige, cream, pastels)
- Handwritten-style script fonts for quotes
- Delicate aesthetic with feminine touches
- Scattered confetti or small decorative elements
- Washi tape effect on some edges
- Watercolor or soft textures in background
- 85% coverage with gentle overlaps
- Dreamy, aspirational mood`,
    };

    // Get the base prompt for selected style
    const styleBasePrompt =
      stylePrompts[selectedStyle as keyof typeof stylePrompts] ||
      stylePrompts.torn;

    // Create detailed prompt for vision board collage
    const collagePrompt = `${styleBasePrompt}

⚠️⚠️⚠️ CRITICAL FACIAL CONSISTENCY REQUIREMENTS (TOP PRIORITY) ⚠️⚠️⚠️
${
  hasSelfie
    ? `
FACIAL CONSISTENCY IS THE #1 PRIORITY - MORE IMPORTANT THAN ANYTHING ELSE!

The FIRST reference image shows the EXACT person who this vision board belongs to.

STEP-BY-STEP REQUIREMENTS FOR EVERY PHOTO WITH A PERSON:

1️⃣ STUDY THE REFERENCE PHOTO CAREFULLY:
   - Memorize the person's EXACT facial features before generating any photos
   - This is the TEMPLATE - every person photo must match this EXACTLY

2️⃣ COPY THESE EXACT FEATURES TO EVERY PHOTO WITH A PERSON:
   ✓ EXACT same face shape and bone structure
   ✓ EXACT same skin tone (shade, undertone, complexion)
   ✓ EXACT same eyes (shape, color, eyebrow shape)
   ✓ EXACT same nose (shape, size, nostril shape)
   ✓ EXACT same mouth (lip shape, smile, teeth)
   ✓ EXACT same hair (color, texture, style)
   ✓ EXACT same jawline, cheekbones, forehead
   ✓ Person must be IMMEDIATELY recognizable as the same individual

3️⃣ FORBIDDEN - NEVER DO THIS:
   ✗ NO inventing new facial features
   ✗ NO generic/stock photo faces
   ✗ NO "similar looking" people
   ✗ NO different faces in different photos
   ✗ NO AI-generated random faces
   ✗ NO approximations - must be EXACT match

4️⃣ QUALITY CHECK BEFORE EACH PHOTO:
   Ask: "Does this person's face EXACTLY match the reference photo?"
   - If NO → Remove person, show only the scene/objects
   - If MAYBE → Remove person, not good enough
   - If YES, PERFECT MATCH → Keep the photo

5️⃣ PRIORITY:
   - Better to have 4 photos with PERFECT facial match
   - Than 10 photos with slightly different faces
   - The user WILL immediately notice any facial variation

REMEMBER: This person is creating a vision board of THEMSELVES. They know their own face PERFECTLY. Any slight variation will be instantly noticed and the board will be unusable.`
    : ""
}
${
  imageParts.length > 0
    ? `\n📸 ${imageParts.length} reference image(s) provided - USE THEM AS YOUR GUIDE FOR EVERY PHOTO!`
    : ""
}
${
  hasCar
    ? `\n🚗 Dream car from reference must appear EXACTLY as shown`
    : ""
}
${
  hasHouse
    ? `\n🏠 Dream house from reference must appear EXACTLY as shown`
    : ""
}

CONTENT ELEMENTS - CREATE 18-24 DISTINCT PHOTO ELEMENTS:

🚨 LOGICAL SCENE VALIDATION (CRITICAL - NO NONSENSICAL COMBINATIONS!) 🚨

EACH SCENE MUST MAKE LOGICAL SENSE:
✓ Gym workout → GYM SETTING (weights, equipment, fitness area)
✓ Travel → TRAVEL LOCATION (airport terminal, beach, tourist spot)
✓ Private jet → LUXURY TRAVEL (sitting, champagne, no exercise equipment)
✓ Business → OFFICE OR CITY (desk, skyline, professional setting)
✓ Wellness → SPA OR NATURE (yoga mat, meditation outdoors, peaceful)

✗ FORBIDDEN COMBINATIONS (THESE MAKE NO SENSE):
   ✗ Working out with dumbbells INSIDE a private jet
   ✗ Gym equipment ON an airplane
   ✗ Lifting weights while flying
   ✗ Yoga in a car
   ✗ Business suit at the gym
   ✗ Exercise equipment in luxury settings (unless home gym)

⚠️ BEFORE CREATING EACH SCENE, ASK:
1. Does this activity belong in this location?
2. Would a real person actually do this here?
3. If NO → CHANGE THE SCENE to be logical

PRIMARY SCENES WITH MAIN SUBJECT (6-8 larger photos showing diverse activities):
${
  hasSelfie
    ? `1. Main subject in sharp business attire, confident power pose, modern office or city skyline background
2. Main subject at outdoor cafe or restaurant, stylish casual outfit, enjoying coffee/meal, social setting
3. Main subject celebrating success with arms raised, big smile, golden hour lighting, achievement moment
4. Main subject in GYM SETTING wearing workout clothes, active pose (lifting weights or running) - MUST BE IN ACTUAL GYM with fitness equipment visible
${
  hasCar
    ? "5. Main subject with their dream car, proud expression, hand on hood, scenic mountain or coastal road"
    : "5. Main subject traveling - INSIDE airport terminal OR standing at beach OR at tourist landmark, adventure mode, appropriate travel outfit"
}
${
  hasHouse
    ? "6. Main subject in front of their dream house, holding keys, accomplished smile, beautiful exterior"
    : "6. Main subject in luxurious interior, reading or relaxing, cozy sophisticated space"
}
7. Main subject in wellness scene: EITHER gentle yoga pose on mat in nature OR peaceful meditation outdoors (choose ONE, not both, must be in appropriate peaceful setting)
8. Main subject INSIDE private jet sitting comfortably with champagne (NO exercise equipment, NO gym activities, ONLY luxury relaxation)`
    : "Aspirational lifestyle and achievement scenes"
}

LIFESTYLE & WELLNESS ELEMENTS (12-15 medium/small photos with diverse themes):

WEALTH & SUCCESS:
${
  hasHouse
    ? "- Dream house: modern architecture, landscaped yard, golden hour glow"
    : "- Luxury penthouse: floor-to-ceiling windows, city skyline, modern interior"
}
${
  hasCar
    ? "- Dream car: sleek on coastal highway, mountains backdrop, freedom vibe"
    : "- High-end sports car: luxury showroom or scenic mountain road"
}
- Stacks of cash/money bills aesthetically arranged, wealth manifestation
- Designer shopping bags (Chanel, Gucci, Louis Vuitton), luxury lifestyle
- Gold jewelry, watches, elegant accessories, success symbols
- Private jet interior or first-class flight window view, elite travel

TRAVEL & ADVENTURE:
- Eiffel Tower Paris: autumn leaves, romantic cobblestone streets, cafe culture
- Santorini Greece: white buildings, blue domes, Mediterranean sunset
- Maldives overwater bungalow: crystal clear turquoise water, paradise
- Dubai skyline: Burj Khalifa, luxury hotels, modern architecture
- Japanese temple: cherry blossoms, zen garden, peaceful cultural scene
- New York City: Times Square lights, yellow taxis, urban energy
- Tropical beach: palm trees, hammock, cocktail, relaxation mode

HEALTH & FITNESS:
- Acai bowl: fresh berries, granola, coconut, aesthetic food photography
- Green smoothie bowl: chia seeds, tropical fruits, mint, healthy vibrant
- Sushi platter: beautifully arranged rolls, wasabi, ginger, Asian cuisine
- Avocado toast: poached egg, microgreens, artisan bread, brunch goals
- Fitness equipment: dumbbells, yoga mat, water bottle, active lifestyle
- Running shoes on trail: nature path, motivation, morning jog energy
- Spa setting: face masks, candles, essential oils, self-care ritual

LIFESTYLE & PERSONAL:
- Designer walk-in closet: organized clothes, shoes, bags, fashion goals
- Modern workspace: MacBook, journal, coffee, minimalist desk, productivity
- Cozy reading nook: books, blanket, window light, peaceful corner
- Luxury hotel room: white linens, city view, elegant modern design
- Champagne glasses clinking: celebration, success, cheers moment
- Beautiful bouquet: roses, peonies, elegant flowers, romantic aesthetic

CUTE & FUN ELEMENTS (add 2-3 if space allows):
- Cute fluffy cat lounging: adorable kitten or cat, cozy aesthetic
- Fashion magazines: Vogue, Elle covers, stylish editorial spreads
- Designer handbag: Chanel, Louis Vuitton, luxury fashion accessory
- High heel shoes: elegant stilettos, fashion-forward footwear
- Makeup/beauty products: aesthetic flatlay, skincare, cosmetics
- Coffee and pastry: aesthetic cafe flat lay, croissant, latte art

INSPIRATIONAL QUOTES & TEXT (scatter 8-12 quotes naturally):
${
  selectedStyle === "bold"
    ? '- Large bold text: "2025", "VISION BOARD", "MANIFEST", "SUCCESS"'
    : '- "2025" prominently displayed in elegant script'
}

MANIFESTATION & SUCCESS:
- "I am a money magnet" / "Abundance flows to me"
- "CEO mindset" / "Boss babe" / "Empire builder"
- "Dream big, hustle harder"
- "She believed she could, so she did"
- "Making moves in silence" / "Success in progress"

GRATITUDE & MINDSET:
- "Grateful" / "Blessed beyond measure" / "Thankful"
- "I am growing" / "Leveling up" / "Evolving daily"
- "Choose happiness" / "Good vibes only" / "Positive energy"
- "Living my dream life" / "This is my year"

WELLNESS & SELF-LOVE:
- "Self-care isn't selfish" / "Peace of mind"
- "Healthy mind, body, soul" / "Wellness warrior"
- "Glow from within" / "Radiate confidence"
- "Inhale confidence, exhale doubt"

PERSONAL GOALS:
- "${goals.split(",")[0]?.trim() || "My Goals"}" featured prominently
- Add 2-3 words from user's goals as scattered text elements

${
  selectedStyle === "bold"
    ? "Use BOLD UPPERCASE sans-serif fonts, high contrast black/white"
    : selectedStyle === "polaroid"
    ? "Use casual handwritten-style script, black ink on white"
    : "Use elegant cursive/script fonts, soft gold or black text"
}

CRITICAL QUALITY REQUIREMENTS:
- Professional magazine editorial quality at 1344x768 resolution

🚨🚨🚨 TEXT QUALITY RULES (ABSOLUTELY CRITICAL - ZERO TOLERANCE FOR ERRORS) 🚨🚨🚨

BEFORE INCLUDING ANY TEXT, YOU MUST VERIFY EVERY SINGLE WORD:

✓ SPELL CHECK EVERY WORD INDIVIDUALLY:
   - "FINANCIAL" ✓ (NOT "FINACIAL" ✗)
   - "FREEDOM" ✓ (NOT "FREDOM" ✗)
   - "ABUNDANT" ✓ (NOT "ABUNNY", "ABUND", "ABUNDNT" ✗)
   - "UNSTOPPABLE" ✓ (NOT "UNSTOPPY", "UNSTOPABLE" ✗)
   - "GRATEFUL" ✓ (NOT "GRATEFIL", "GRATEFULL" ✗)
   - "MANIFEST" ✓ (NOT "MANIFST" ✗)
   - "SUCCESS" ✓ (NOT "SUCESS", "SUCESSS" ✗)
   - "WELLNESS" ✓ (NOT "WELNESS" ✗)
   - "WARRIOR" ✓ (NOT "WARDER", "WARROIR" ✗)
   - "FLOWS" ✓ (NOT "FLAWS" ✗)
   - "FOR US" ✓ (NOT "FO RUS", "FORUS" ✗ - MUST HAVE SPACE!)

✓ NO BROKEN WORDS:
   - Words must be COMPLETE and UNBROKEN
   - "FOR US" must have a space between words
   - "ISN'T" must have apostrophe in correct place
   - Never split words across lines incorrectly
   - Example WRONG: "FO RUS", "SELF- CARE"
   - Example CORRECT: "FOR US", "SELF-CARE"

✓ NO GIBBERISH TEXT:
   - Every word must be a REAL ENGLISH WORD
   - NO random letter combinations like "WANEY", "FOREM", "WARDER"
   - If you can't spell it correctly, DO NOT INCLUDE IT
   - Better to have NO text than WRONG text

✓ LEGIBILITY CHECK:
   - Text must be CRYSTAL CLEAR and IN FOCUS
   - High contrast: white text on dark OR black text on white
   - Text size minimum 18px for quotes, 36px for headers
   - NO blurry, distorted, or unclear text
   - If clarity is compromised, REMOVE THE TEXT

✓ LOGICAL PHRASES ONLY:
   - Use ONLY the exact quotes provided in this prompt
   - Do NOT invent new phrases or modify existing ones
   - If a phrase doesn't fit, skip it - don't modify it
   - Example: "SELF-CARE ISN'T SELFISH" is provided phrase
   - NEVER change it to "SELF-CARE ISN'T FOREM WARDER" or nonsense

⚠️ QUALITY GATE: Before finalizing image, verify EVERY text element:
1. Is every word spelled correctly? (Check letter by letter)
2. Are words properly spaced?
3. Is text clearly readable?
4. Is it a logical, real phrase?
5. If ANY answer is NO → REMOVE THAT TEXT

🛑 BETTER TO HAVE 5 PERFECT QUOTES THAN 12 BROKEN/MISSPELLED ONES

FACIAL CONSISTENCY:
${
  hasSelfie
    ? `- ABSOLUTE FACIAL CONSISTENCY: Every person must be the EXACT SAME individual from reference photo
- Same face, skin tone, features, hair style across ALL photos showing the person
- If you cannot maintain perfect facial consistency, show the scene without a person
- Better to show object/scene only than to show wrong person
- NO random stock photos, NO generic people - ONLY use reference photo person`
    : "- NO random people if no selfie provided"
}

VISUAL QUALITY:
- Consistent car/house identity throughout (match reference images exactly)
- Visual variety: different poses, settings, outfits, but SAME person
- Sharp focus, professional photography quality
- Appropriate spacing and overlap for ${selectedStyle} style
- Natural lighting, warm tones, magazine-quality composition

PRIMARY GOALS TO VISUALIZE: ${goals}

REMEMBER: This is a PERSONAL vision board for ONE specific person. Every human face must be recognizably the same individual from the first reference image. Facial consistency is MORE IMPORTANT than quantity - show fewer photos of the person if needed to maintain perfect consistency.`;

    console.log(`Prompt length: ${collagePrompt.length} characters`);

    // Prepare content array for Gemini
    const contents = [...imageParts, { text: collagePrompt }];

    try {
      console.log("Sending request to Gemini API...");
      console.log("Contents array length:", contents.length);

      const response = await genai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: contents,
        config: {
          imageConfig: {
            aspectRatio: "16:9", // 1344x768 - highest quality landscape format
          },
        },
      });

      console.log("Gemini response received");
      console.log(
        "Response structure:",
        JSON.stringify({
          hasCandidates: !!response.candidates,
          numCandidates: response.candidates?.length || 0,
        })
      );

      // Extract generated image from response
      if (
        !response ||
        !response.candidates ||
        response.candidates.length === 0
      ) {
        throw new Error("No image generated by Gemini");
      }

      const candidate = response.candidates[0];
      if (
        !candidate.content ||
        !candidate.content.parts ||
        candidate.content.parts.length === 0
      ) {
        throw new Error("No content parts in Gemini response");
      }

      // Find the image part
      interface Part {
        inlineData?: {
          mimeType?: string;
          data?: string;
        };
      }

      const imagePart = candidate.content.parts.find((part: Part) =>
        part.inlineData?.mimeType?.startsWith("image/")
      );

      if (!imagePart || !imagePart.inlineData || !imagePart.inlineData.data) {
        throw new Error("No image data in Gemini response");
      }

      // Convert base64 to data URI
      const originalImageData = imagePart.inlineData.data;
      let imageDataUri = `data:${imagePart.inlineData.mimeType};base64,${originalImageData}`;

      console.log("✓ Vision board created successfully with Gemini!");

      // Add watermark to free version
      try {
        console.log("Adding watermark to vision board...");

        // Convert base64 to buffer
        const imageBuffer = Buffer.from(originalImageData, 'base64');

        // Create watermark text SVG
        const watermarkSvg = Buffer.from(`
          <svg width="300" height="80">
            <style>
              .title {
                fill: #ffffff;
                font-size: 24px;
                font-weight: bold;
                font-family: Arial, sans-serif;
                opacity: 0.7;
              }
              .subtitle {
                fill: #ffffff;
                font-size: 14px;
                font-family: Arial, sans-serif;
                opacity: 0.6;
              }
            </style>
            <text x="150" y="30" text-anchor="middle" class="title">DreamBoard</text>
            <text x="150" y="55" text-anchor="middle" class="subtitle">Free Version - Upgrade for HD</text>
          </svg>
        `);

        // Add watermark to bottom-right corner
        const watermarkedBuffer = await sharp(imageBuffer)
          .composite([
            {
              input: watermarkSvg,
              gravity: 'southeast',
              blend: 'over'
            }
          ])
          .toBuffer();

        // Convert back to base64 data URI
        const watermarkedBase64 = watermarkedBuffer.toString('base64');
        imageDataUri = `data:${imagePart.inlineData.mimeType};base64,${watermarkedBase64}`;

        console.log("✓ Watermark added successfully!");
      } catch (watermarkError) {
        console.error("Failed to add watermark (continuing with unwatermarked image):", watermarkError);
        // Continue with original image if watermark fails
      }

      return NextResponse.json({
        collageUrl: imageDataUri,
        success: true,
        model: "gemini-2.5-flash-image",
      });
    } catch (apiError: unknown) {
      console.error("Gemini API error:", apiError);
      console.error("Error details:", JSON.stringify(apiError, null, 2));

      if (apiError && typeof apiError === "object") {
        if ("message" in apiError) {
          throw new Error(`Gemini API error: ${(apiError as Error).message}`);
        }
        if ("error" in apiError) {
          const errObj = apiError as {
            error: { message?: string; details?: unknown };
          };
          throw new Error(
            `Gemini API error: ${
              errObj.error.message || JSON.stringify(errObj.error)
            }`
          );
        }
      }
      throw new Error(`Gemini API error: ${String(apiError)}`);
    }
  } catch (error: unknown) {
    console.error("Error creating vision board:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create vision board",
        details: error instanceof Error ? error.stack : String(error),
      },
      { status: 500 }
    );
  }
}
