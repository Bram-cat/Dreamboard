import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(request: NextRequest) {
  try {
    const { categorizedUploads, elementType, elementDescription } =
      await request.json();

    if (!elementDescription || typeof elementDescription !== "string") {
      return NextResponse.json(
        { error: "Element description is required" },
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

    console.log(`Generating ${elementType} element:`, elementDescription);

    // Initialize Gemini client
    const genai = new GoogleGenAI({ apiKey });

    // Prepare reference images for person elements
    const imageParts = [];
    const hasSelfie = elementType === "person" && categorizedUploads?.selfie;

    if (hasSelfie && categorizedUploads.selfie.startsWith("data:")) {
      const base64Data = categorizedUploads.selfie.split(",")[1];
      const mimeType = categorizedUploads.selfie.split(";")[0].split(":")[1];
      imageParts.push({
        inlineData: {
          data: base64Data,
          mimeType: mimeType,
        },
      });
    }

    // Build prompt based on element type
    let prompt = "";

    if (elementType === "person") {
      // Person-focused scene
      prompt = `Create a single high-quality photo element for a vision board.

⚠️⚠️⚠️ CRITICAL FACIAL CONSISTENCY (TOP PRIORITY) ⚠️⚠️⚠️
${
  hasSelfie
    ? `
The FIRST reference image shows the EXACT person who this vision board belongs to.

STEP-BY-STEP REQUIREMENTS:

1️⃣ STUDY THE REFERENCE PHOTO:
   - Memorize this person's EXACT facial features before generating

2️⃣ COPY THESE EXACT FEATURES:
   ✓ EXACT same face shape and bone structure
   ✓ EXACT same skin tone (shade, undertone, complexion)
   ✓ EXACT same eyes (shape, color, eyebrow shape)
   ✓ EXACT same nose (shape, size, nostril shape)
   ✓ EXACT same mouth (lip shape, smile, teeth)
   ✓ EXACT same hair (color, texture, style)
   ✓ EXACT same jawline, cheekbones, forehead
   ✓ Person must be IMMEDIATELY recognizable

3️⃣ FORBIDDEN:
   ✗ NO inventing new facial features
   ✗ NO generic/stock photo faces
   ✗ NO "similar looking" people

4️⃣ QUALITY CHECK:
   Ask: "Does this person's face EXACTLY match the reference photo?"
   - If NO → Don't generate
   - If MAYBE → Not good enough
   - If YES, PERFECT MATCH → Proceed
`
    : ""
}

🚨 LOGICAL SCENE VALIDATION 🚨
Ensure the scene makes logical sense:
✓ Gym workout → GYM SETTING (weights, equipment, fitness area)
✓ Travel → TRAVEL LOCATION (airport terminal, beach, tourist spot)
✓ Private jet → LUXURY TRAVEL (sitting, champagne, NO exercise equipment)
✓ Business → OFFICE OR CITY (desk, skyline, professional setting)

SCENE TO CREATE:
${elementDescription}

REQUIREMENTS:
- Professional magazine editorial quality
- Square aspect ratio (1:1) at 512x512 pixels
- Sharp focus on the person, beautiful lighting
- Photorealistic, high-quality composition
- Single cohesive scene, no collage effect
- Clean background that complements the subject`;
    } else if (elementType === "lifestyle") {
      // Lifestyle/object element (no person)
      prompt = `Create a single high-quality photo element for a vision board.

SCENE TO CREATE:
${elementDescription}

REQUIREMENTS:
- Professional magazine editorial quality
- Square aspect ratio (1:1) at 512x512 pixels
- NO people in the image - just objects/scenes
- Sharp focus, beautiful composition
- Photorealistic, aesthetic photography
- Clean professional look
- Single item or cohesive scene`;
    } else if (elementType === "quote") {
      // Text quote element
      prompt = `Create a text quote image for a vision board.

QUOTE TEXT:
${elementDescription}

🚨 TEXT QUALITY RULES (ZERO TOLERANCE FOR ERRORS) 🚨

✓ SPELL CHECK:
   - Every word must be spelled PERFECTLY
   - Use the EXACT text provided above
   - NO modifications, NO typos, NO gibberish

✓ REQUIREMENTS:
   - Clean minimalist design
   - Square aspect ratio (1:1) at 512x512 pixels
   - High contrast: black text on white OR white text on colored background
   - Elegant font (serif or modern sans-serif)
   - Text centered and perfectly readable
   - Professional typography
   - NO decorative elements that obscure text
   - Text size large enough to read clearly

✓ VERIFICATION:
   - Check spelling letter-by-letter before finalizing
   - If text is unclear or misspelled, DO NOT GENERATE`;
    }

    // Generate image with Gemini
    const response = await genai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: [
        {
          role: "user",
          parts: [
            ...imageParts,
            {
              text: prompt,
            },
          ],
        },
      ],
      config: {
        temperature: 0.7,
        topP: 0.9,
        topK: 32,
        maxOutputTokens: 8192,
        responseMimeType: "image/png",
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
    if (!candidate || !candidate.content || !candidate.content.parts) {
      throw new Error("No content in Gemini response");
    }

    const imagePart = candidate.content.parts.find((part: Part) =>
      part.inlineData?.mimeType?.startsWith("image/")
    );

    if (!imagePart || !imagePart.inlineData || !imagePart.inlineData.data) {
      throw new Error("No image data in Gemini response");
    }

    // Return base64 image data
    const imageDataUri = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;

    console.log(`✓ ${elementType} element generated successfully!`);

    return NextResponse.json({
      imageUrl: imageDataUri,
      elementType,
      description: elementDescription,
      success: true,
    });
  } catch (error: unknown) {
    console.error("Error generating element:", error);
    return NextResponse.json(
      {
        error: "Failed to generate element",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
