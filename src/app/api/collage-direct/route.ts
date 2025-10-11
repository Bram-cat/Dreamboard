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

PRIMARY SCENES WITH MAIN SUBJECT (5-7 larger photos):
${hasSelfie ? `1. Main subject in business attire looking confident, city skyline background, success pose
2. Main subject practicing yoga on beach at sunrise, serene expression, waves in background
3. Main subject laughing with arms raised in celebration, golden hour lighting
4. Main subject reading in a cozy corner with coffee, peaceful contemplative mood
${hasCar ? '5. Main subject with their dream car, hand on hood, proud smile, scenic location' : '5. Main subject at outdoor cafe, stylish outfit, enjoying the moment'}
${hasHouse ? '6. Main subject in front of their dream house, key in hand, achievement moment' : '6. Main subject hiking on mountain trail, backpack, adventurous spirit'}
7. Main subject meditating in nature, eyes closed, peaceful zen moment` : 'Aspirational lifestyle and wellness scenes'}

LIFESTYLE & WELLNESS ELEMENTS (10-12 medium/small photos):
${hasHouse ? '- The dream house: modern exterior, landscaped yard, warm inviting lighting' : '- Luxury modern home: glass walls, pool, contemporary architecture'}
${hasCar ? '- The dream car: on coastal highway, mountains in background, adventure mood' : '- High-end sports car: sleek design, urban setting or nature backdrop'}
- Travel destinations: Eiffel Tower with autumn leaves, Parisian cafe scene
- Tropical paradise: turquoise waters, white sand beach, palm trees swaying
- Mountain landscape: snow-capped peaks, hiking trail, adventure awaits
- Wellness food: acai bowl with berries, granola, coconut, beautiful presentation
- Green smoothie: chia seeds, fresh fruits, mint, aesthetic overhead shot
- Healthy meal prep: colorful salads, grilled salmon, quinoa, balanced nutrition
- Morning ritual: latte art coffee, croissant, sunlight streaming through window
- Fitness motivation: yoga mat rolled up, dumbbells, water bottle, active lifestyle
- Spa self-care: face masks, candles, essential oils, bath salts, relaxation
- Cozy reading nook: stack of self-help books, warm blanket, peaceful corner
- Luxury bedroom: white linens, plants, minimalist design, serene space
- Walk-in closet: organized clothes, shoes displayed, fashionable wardrobe
- Workspace: laptop, journal, pen, coffee, productive creative space
- Sunset/sunrise: golden hour sky, silhouette moment, new beginnings

INSPIRATIONAL QUOTES & TEXT (integrate naturally based on ${selectedStyle} style):
${selectedStyle === 'bold' ? '- Large bold text: "2025", "VISION BOARD", "MANIFEST"' : '- "2025" prominently displayed'}
- "I am growing" / "Grateful" / "Blessed"
- "She believed she could, so she did"
- "Choose joy" / "Good vibes only"
- "Self-love" / "Peace of mind"
- "Bloom where planted" / "Create sunshine"
- "Aligned, abundant, unstoppable"
- "Inhale confidence, exhale doubt"
- "Money flows to me effortlessly" (if financial goals mentioned)
- "Healthy mind, healthy body, healthy soul"
- "Living my best life"
- "${goals.split(',')[0].trim()}" featured prominently
${selectedStyle === 'bold' ? '- Use BOLD, MODERN fonts with high contrast' : selectedStyle === 'polaroid' ? '- Use casual, handwritten-style captions' : '- Use soft, elegant script fonts'}

CRITICAL QUALITY REQUIREMENTS:
- Professional magazine editorial quality
${hasSelfie ? `- ABSOLUTE FACIAL CONSISTENCY: Every person must be the EXACT SAME individual from reference photo
- If you cannot maintain perfect facial consistency, DO NOT include that person photo
- Better to show object/scene only than to show wrong person` : ''}
- Consistent car/house identity throughout (match reference images exactly)
- NO random stock photos, NO generic people
- Visual variety: different poses, settings, outfits, but SAME person
- All text must be legible and meaningful
- Appropriate spacing and overlap for ${selectedStyle} style

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
        contents: contents
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
