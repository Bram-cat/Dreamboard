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

    // STEP 2: Generate scenario images using user uploads + Gemini image editing
    console.log("\n🎨 STEP 1/3: Generating dream scenario images with user uploads...");
    const genai = new GoogleGenAI({ apiKey: geminiApiKey });
    const allGeneratedImages: string[] = [];
    let scenarioCount = 0;

    // Generate scenarios for user uploads
    if (hasSelfie && hasDreamHouse) {
      console.log("  [Scenario 1] Generating: User at their dream house");
      try {
        const selfieBase64 = categorizedUploads.selfie.split(",")[1];
        const houseBase64 = categorizedUploads.dreamHouse.split(",")[1];

        const response = await genai.models.generateContent({
          model: "gemini-2.5-flash-image",
          contents: [{
            role: "user",
            parts: [
              { inlineData: { data: selfieBase64, mimeType: "image/jpeg" } },
              { inlineData: { data: houseBase64, mimeType: "image/jpeg" } },
              { text: "Create a realistic photo showing this person standing in front of or inside this house, looking happy and proud. Professional photography, natural lighting, aspirational real estate aesthetic. The person should be clearly visible and recognizable." }
            ]
          }],
          config: { temperature: 0.7, topP: 0.9, topK: 32, maxOutputTokens: 8192 },
        });

        const candidate = response.candidates?.[0];
        if (candidate?.content?.parts) {
          const imagePart = candidate.content.parts.find((part: { inlineData?: { mimeType?: string; data?: string } }) =>
            part.inlineData?.mimeType?.startsWith("image/")
          );
          if (imagePart?.inlineData?.data) {
            allGeneratedImages.push(imagePart.inlineData.data);
            scenarioCount++;
            console.log(`  ✓ Created scenario: User + Dream House`);
          }
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error("  ✗ Error generating house scenario:", error);
      }
    }

    if (hasSelfie && hasDreamCar) {
      console.log("  [Scenario 2] Generating: User with their dream car");
      try {
        const selfieBase64 = categorizedUploads.selfie.split(",")[1];
        const carBase64 = categorizedUploads.dreamCar.split(",")[1];

        const response = await genai.models.generateContent({
          model: "gemini-2.5-flash-image",
          contents: [{
            role: "user",
            parts: [
              { inlineData: { data: selfieBase64, mimeType: "image/jpeg" } },
              { inlineData: { data: carBase64, mimeType: "image/jpeg" } },
              { text: "Create a realistic photo showing this person standing next to or sitting in this car, looking excited and successful. Professional photography, natural lighting, luxury lifestyle aesthetic. The person should be clearly visible and recognizable." }
            ]
          }],
          config: { temperature: 0.7, topP: 0.9, topK: 32, maxOutputTokens: 8192 },
        });

        const candidate = response.candidates?.[0];
        if (candidate?.content?.parts) {
          const imagePart = candidate.content.parts.find((part: { inlineData?: { mimeType?: string; data?: string } }) =>
            part.inlineData?.mimeType?.startsWith("image/")
          );
          if (imagePart?.inlineData?.data) {
            allGeneratedImages.push(imagePart.inlineData.data);
            scenarioCount++;
            console.log(`  ✓ Created scenario: User + Dream Car`);
          }
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error("  ✗ Error generating car scenario:", error);
      }
    }

    if (hasSelfie && hasDestination) {
      console.log("  [Scenario 3] Generating: User at their dream destination");
      try {
        const selfieBase64 = categorizedUploads.selfie.split(",")[1];
        const destinationBase64 = categorizedUploads.destination.split(",")[1];

        const response = await genai.models.generateContent({
          model: "gemini-2.5-flash-image",
          contents: [{
            role: "user",
            parts: [
              { inlineData: { data: selfieBase64, mimeType: "image/jpeg" } },
              { inlineData: { data: destinationBase64, mimeType: "image/jpeg" } },
              { text: "Create a realistic photo showing this person at this beautiful destination, looking happy and relaxed. Professional travel photography, natural lighting, vacation aesthetic. The person should be clearly visible and recognizable in the scene." }
            ]
          }],
          config: { temperature: 0.7, topP: 0.9, topK: 32, maxOutputTokens: 8192 },
        });

        const candidate = response.candidates?.[0];
        if (candidate?.content?.parts) {
          const imagePart = candidate.content.parts.find((part: { inlineData?: { mimeType?: string; data?: string } }) =>
            part.inlineData?.mimeType?.startsWith("image/")
          );
          if (imagePart?.inlineData?.data) {
            allGeneratedImages.push(imagePart.inlineData.data);
            scenarioCount++;
            console.log(`  ✓ Created scenario: User + Destination`);
          }
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error("  ✗ Error generating destination scenario:", error);
      }
    }

    console.log(`✅ Generated ${scenarioCount} scenario images with user uploads`);

    // STEP 2B: Generate remaining lifestyle images with DALL-E 3 (NO people)
    const remainingCount = 10 - scenarioCount;
    console.log(`\n🎨 STEP 2/3: Generating ${remainingCount} lifestyle images with DALL-E 3...`);
    const dalleImages: string[] = [];

    for (let i = 0; i < remainingCount; i++) {
      const keyword = expandedKeywords[i];
      const imagePrompt = `Vision board lifestyle image: "${keyword}". CRITICAL: NO people, NO faces, NO humans - only objects, scenery, or empty spaces. High-quality editorial photography, aspirational aesthetic, vibrant colors. NO text or logos.`;

      console.log(`  [${i + 1}/${remainingCount}] Generating: "${keyword}"`);

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
