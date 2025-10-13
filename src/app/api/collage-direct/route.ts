import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(request: NextRequest) {
  try {
    const { goals, categorizedUploads, uploadContext, style } = await request.json();

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

    if (categorizedUploads?.selfie && categorizedUploads.selfie.startsWith('data:')) {
      // Extract base64 data
      const base64Data = categorizedUploads.selfie.split(',')[1];
      const mimeType = categorizedUploads.selfie.split(';')[0].split(':')[1];
      imageParts.push({
        inlineData: {
          data: base64Data,
          mimeType: mimeType
        }
      });
      console.log("Added selfie as reference image");
    }

    if (categorizedUploads?.dreamCar && categorizedUploads.dreamCar.startsWith('data:')) {
      const base64Data = categorizedUploads.dreamCar.split(',')[1];
      const mimeType = categorizedUploads.dreamCar.split(';')[0].split(':')[1];
      imageParts.push({
        inlineData: {
          data: base64Data,
          mimeType: mimeType
        }
      });
      console.log("Added dream car as reference image");
    }

    if (categorizedUploads?.dreamHouse && categorizedUploads.dreamHouse.startsWith('data:')) {
      const base64Data = categorizedUploads.dreamHouse.split(',')[1];
      const mimeType = categorizedUploads.dreamHouse.split(';')[0].split(':')[1];
      imageParts.push({
        inlineData: {
          data: base64Data,
          mimeType: mimeType
        }
      });
      console.log("Added dream house as reference image");
    }

    console.log(`Total reference images: ${imageParts.length}`);

    // Build context about what images are available
    const hasSelfie = uploadContext?.hasSelfie || false;
    const hasCar = uploadContext?.hasDreamCar || false;
    const hasHouse = uploadContext?.hasDreamHouse || false;

    // Style variations based on sample images
    const selectedStyle = style || ['bold', 'polaroid', 'torn'][Math.floor(Math.random() * 3)];
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
- Dreamy, aspirational mood`
    };

    // Get the base prompt for selected style
    const styleBasePrompt = stylePrompts[selectedStyle as keyof typeof stylePrompts] || stylePrompts.torn;

    // Create detailed prompt for vision board collage
    const collagePrompt = `${styleBasePrompt}

CRITICAL FACIAL CONSISTENCY REQUIREMENTS:
${hasSelfie ? `- The FIRST reference image shows the person who this vision board belongs to
- This person's face MUST appear in EVERY photo that shows a person
- CRITICAL: Maintain EXACT facial features across all representations:
  * Same skin tone and complexion
  * Same facial structure and bone structure
  * Same eye shape, color, and expression style
  * Same hair color, texture, and style
  * Same nose shape and size
  * Same mouth and smile
  * Same overall facial proportions
- Generate this SAME PERSON in different scenarios, outfits, and settings
- NO random people, NO stock photos of other people
- If you cannot maintain facial consistency, show the scene without a person
- Every human figure must be recognizably the same individual from the reference photo` : ''}
${imageParts.length > 0 ? `- Use the ${imageParts.length} reference image(s) provided` : ''}
${hasCar ? `- The dream car from reference image must appear exactly as shown` : ''}
${hasHouse ? `- The dream house from reference image must appear exactly as shown` : ''}

CONTENT ELEMENTS - CREATE 18-24 DISTINCT PHOTO ELEMENTS:

PRIMARY SCENES WITH MAIN SUBJECT (6-8 larger photos showing diverse activities):
${hasSelfie ? `1. Main subject in sharp business attire, confident power pose, modern office or city skyline background
2. Main subject at outdoor cafe or restaurant, stylish casual outfit, enjoying coffee/meal, social setting
3. Main subject celebrating success with arms raised, big smile, golden hour lighting, achievement moment
4. Main subject in gym workout clothes, active pose (lifting weights or running), fitness motivation
${hasCar ? '5. Main subject with their dream car, proud expression, hand on hood, scenic mountain or coastal road' : '5. Main subject traveling - airport, beach, or mountain view, adventure mode, backpack or suitcase'}
${hasHouse ? '6. Main subject in front of their dream house, holding keys, accomplished smile, beautiful exterior' : '6. Main subject in luxurious interior, reading or relaxing, cozy sophisticated space'}
7. Main subject in ONE wellness scene ONLY: either gentle yoga pose OR peaceful meditation in nature (choose ONE, not both)
8. Main subject at social gathering or event, dressed up, happy interaction, celebrating life` : 'Aspirational lifestyle and achievement scenes'}

LIFESTYLE & WELLNESS ELEMENTS (12-15 medium/small photos with diverse themes):

WEALTH & SUCCESS:
${hasHouse ? '- Dream house: modern architecture, landscaped yard, golden hour glow' : '- Luxury penthouse: floor-to-ceiling windows, city skyline, modern interior'}
${hasCar ? '- Dream car: sleek on coastal highway, mountains backdrop, freedom vibe' : '- High-end sports car: luxury showroom or scenic mountain road'}
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
${selectedStyle === 'bold' ? '- Large bold text: "2025", "VISION BOARD", "MANIFEST", "SUCCESS"' : '- "2025" prominently displayed in elegant script'}

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
- "${goals.split(',')[0]?.trim() || 'My Goals'}" featured prominently
- Add 2-3 words from user's goals as scattered text elements

${selectedStyle === 'bold' ? 'Use BOLD UPPERCASE sans-serif fonts, high contrast black/white' : selectedStyle === 'polaroid' ? 'Use casual handwritten-style script, black ink on white' : 'Use elegant cursive/script fonts, soft gold or black text'}

CRITICAL QUALITY REQUIREMENTS:
- Professional magazine editorial quality at 1344x768 resolution

TEXT QUALITY (EXTREMELY IMPORTANT):
- ALL TEXT MUST BE PERFECTLY SPELLED - no typos, no gibberish, no random letters
- ALL TEXT MUST BE CRYSTAL CLEAR AND LEGIBLE - sharp, in-focus, readable
- Check spelling: "ABUNDANT" not "ABUNNY", "UNSTOPPABLE" not "UNSTOPPY"
- Check spelling: "GRATEFUL" not "GRATEFIL", "FINANCIAL" spelled correctly
- If text is blurry or unclear, DO NOT INCLUDE IT - blank space is better than bad text
- Use clean fonts: Bold sans-serif for headers, elegant script for quotes
- Ensure high contrast: dark text on light background or vice versa
- Text size must be large enough to read clearly

FACIAL CONSISTENCY:
${hasSelfie ? `- ABSOLUTE FACIAL CONSISTENCY: Every person must be the EXACT SAME individual from reference photo
- Same face, skin tone, features, hair style across ALL photos showing the person
- If you cannot maintain perfect facial consistency, show the scene without a person
- Better to show object/scene only than to show wrong person
- NO random stock photos, NO generic people - ONLY use reference photo person` : '- NO random people if no selfie provided'}

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
            aspectRatio: '16:9'  // 1344x768 - highest quality landscape format
          }
        }
      });

      console.log("Gemini response received");
      console.log("Response structure:", JSON.stringify({
        hasCandidates: !!response.candidates,
        numCandidates: response.candidates?.length || 0
      }));

      // Extract generated image from response
      if (!response || !response.candidates || response.candidates.length === 0) {
        throw new Error("No image generated by Gemini");
      }

      const candidate = response.candidates[0];
      if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
        throw new Error("No content parts in Gemini response");
      }

      // Find the image part
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const imagePart = candidate.content.parts.find((part: any) =>
        part.inlineData && part.inlineData.mimeType && part.inlineData.mimeType.startsWith('image/')
      );

      if (!imagePart || !imagePart.inlineData) {
        throw new Error("No image data in Gemini response");
      }

      // Convert base64 to data URI
      const imageDataUri = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;

      console.log("✓ Vision board created successfully with Gemini!");

      return NextResponse.json({
        collageUrl: imageDataUri,
        success: true,
        model: "gemini-2.5-flash-image"
      });

    } catch (apiError: unknown) {
      console.error("Gemini API error:", apiError);
      console.error("Error details:", JSON.stringify(apiError, null, 2));

      if (apiError && typeof apiError === 'object') {
        if ('message' in apiError) {
          throw new Error(`Gemini API error: ${(apiError as Error).message}`);
        }
        if ('error' in apiError) {
          const errObj = apiError as { error: { message?: string; details?: unknown } };
          throw new Error(`Gemini API error: ${errObj.error.message || JSON.stringify(errObj.error)}`);
        }
      }
      throw new Error(`Gemini API error: ${String(apiError)}`);
    }

  } catch (error: unknown) {
    console.error("Error creating vision board:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to create vision board",
        details: error instanceof Error ? error.stack : String(error),
      },
      { status: 500 }
    );
  }
}
