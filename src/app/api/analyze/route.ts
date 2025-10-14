import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
  // Initialize DeepSeek client (lazy load to avoid build-time errors)
  const deepseek = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY || "",
    baseURL: "https://api.deepseek.com/v1",
  });
  try {
    const { goals, uploadContext } = await request.json();

    if (!goals || typeof goals !== "string") {
      return NextResponse.json(
        { error: "Goals text is required" },
        { status: 400 }
      );
    }

    console.log("Analyzing goals with DeepSeek:", goals);
    console.log("Categorized uploads:", uploadContext);

    const hasSelfie = uploadContext?.hasSelfie || false;
    const hasCar = uploadContext?.hasDreamCar || false;
    const hasHouse = uploadContext?.hasDreamHouse || false;
    const hasDestination = uploadContext?.hasDestination || false;

    // Create a detailed prompt for DeepSeek to generate ONE COMPLETE vision board collage prompt
    const systemPrompt = `You are a vision board creator AI for women. Your task is to create ONE detailed prompt that Runway AI will use to generate a COMPLETE vision board collage in one image.

REFERENCE SAMPLES STYLE:
- Look like Pinterest/magazine collage with 10-15 mini images arranged together
- Polaroid frames, scattered aesthetic, overlapping photos
- Mix of: person achieving goals, dream destinations, luxury items, wellness, motivational text
- Warm tones, film photography, natural lighting, feminine aesthetic

COMMON THEMES FOR WOMEN:
- Dream house/modern luxury home exterior
- Travel destinations (Paris, tropical beaches, mountains, airplane windows)
- Wellness (yoga, meditation, spa, healthy food)
- Financial freedom (money, gold coins, luxury lifestyle)
- Personal growth (journaling, coffee moments, reading)
- Fitness (working out, running, beach body goals)
- Relationships (friendships, sisterhood, celebration)
- Affirmations and motivational quotes

YOUR TASK:
Create ONE comprehensive prompt describing a complete vision board collage that includes all relevant elements based on user's goals.`;

    const userPrompt = `User's Goals: ${goals}

User uploaded: ${hasSelfie ? "Selfie ✓" : ""} ${
      hasHouse ? "Dream House ✓" : ""
    } ${hasCar ? "Dream Car ✓" : ""} ${hasDestination ? "Destination ✓" : ""}

Generate 10-15 SHORT prompts (under 80 chars) for CONTEXTUAL COMPOSITE scenes:

CRITICAL - Create composite scenarios based on uploads:
${
  hasSelfie && hasCar
    ? '- "@userPhoto driving luxury sp orts car, happy, cinematic"'
    : ""
}
${
  hasSelfie && hasHouse
    ? '- "@userPhoto standing in front of modern dream house, proud"'
    : ""
}
${
  hasSelfie && hasDestination
    ? '- "@userPhoto celebrating at travel destination, arms raised"'
    : ""
}
${hasSelfie ? '- "@userPhoto doing yoga at sunset, peaceful, warm light"' : ""}
${hasSelfie ? '- "@userPhoto at beach celebrating success, golden hour"' : ""}

Additional prompts (under 80 chars each):

REQUIRED IMAGES (select based on goals):
1. Modern luxury dream house exterior
2. Travel destination (Paris/Eiffel Tower, tropical beach, or mountain based on: ${goals})
3. ${hasSelfie ? "@userPhoto" : "Woman"} doing yoga or meditation
4. Healthy lifestyle food (acai bowl, smoothie, or coffee)
5. Nature scene (sunset, garden, or ocean)
6. ${hasSelfie ? "@userPhoto" : "Woman"} at beach or celebrating
7. Minimalist luxury interior
8-12. Add more based on goals: ${goals}
   - If "money/wealth/financial": gold coins, luxury car, champagne
   - If "fitness/health": workout scene, running, gym
   - If "travel": airplane window, suitcase, wanderlust
   - If "career/business": office, laptop, success

STYLE: All prompts should specify "warm tones, film photography, natural lighting"

Return a JSON array of 8-12 short prompts: ["prompt 1", "prompt 2", ...]`;

    let prompts: string[] = [];

    try {
      const completion = await deepseek.chat.completions.create({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.8,
        max_tokens: 2000,
      });

      const responseText = completion.choices[0]?.message?.content || "[]";
      console.log("DeepSeek response:", responseText);

      // Extract JSON array from the response
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        prompts = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON array found in response");
      }
    } catch (error: unknown) {
      const apiError =
        error instanceof Error ? error : new Error(String(error));
      console.error("DeepSeek API error:", apiError.message);
      console.log("Using fallback prompt generation...");

      // Fallback: generate smart prompts based on keywords
      const keywords = goals
        .split(",")
        .map((g: string) => g.trim())
        .filter(Boolean);

      // Fallback: Create 8-10 individual image prompts
      prompts = [];

      // Core prompts for all vision boards
      prompts.push(
        "Modern luxury dream house exterior, warm tones, film photography"
      );
      prompts.push(
        "Paris Eiffel Tower street view, autumn, film aesthetic, warm light"
      );
      prompts.push(
        `${
          hasSelfie ? "@userPhoto" : "Woman"
        } doing yoga at sunrise, peaceful, warm natural light`
      );
      prompts.push(
        "Healthy acai bowl with berries, overhead shot, aesthetic food photography"
      );
      prompts.push(
        "Tropical beach sunset, turquoise water, paradise, warm tones"
      );
      prompts.push(
        `${
          hasSelfie ? "@userPhoto" : "Woman"
        } at beach celebrating, arms raised, golden hour`
      );
      prompts.push(
        "Minimalist luxury interior, modern design, natural daylight"
      );
      prompts.push("Morning coffee latte art, cozy aesthetic, warm tones");

      // Add goal-specific prompts
      keywords.forEach((keyword: string) => {
        const kw = keyword.toLowerCase();
        if (
          kw.includes("money") ||
          kw.includes("wealth") ||
          kw.includes("rich")
        ) {
          prompts.push(
            "Stack of gold coins and cash, abundance, overhead flat lay"
          );
        }
        if (kw.includes("car") || kw.includes("vehicle")) {
          prompts.push(
            "Luxury sports car on scenic road, dream car, golden hour"
          );
        }
        if (kw.includes("fitness") || kw.includes("health")) {
          prompts.push(
            `${
              hasSelfie ? "@userPhoto" : "Woman"
            } working out, fitness journey, gym, natural light`
          );
        }
        if (kw.includes("travel")) {
          prompts.push("Airplane window view clouds and sky, wanderlust vibes");
        }
      });
    }

    // Ensure we have 8-12 prompts
    if (prompts.length < 8) {
      const genericPrompts = [
        "Mountain landscape sunset, nature peace, warm golden tones",
        "Journal and coffee on desk, morning routine, cozy aesthetic",
        "Beautiful garden path with flowers, peaceful, natural daylight",
      ];
      prompts = [...prompts, ...genericPrompts].slice(0, 10);
    } else if (prompts.length > 12) {
      prompts = prompts.slice(0, 12);
    }

    console.log(`Generated ${prompts.length} prompts for Runway AI`);

    return NextResponse.json({
      prompts,
      count: prompts.length,
    });
  } catch (error: unknown) {
    console.error("Error analyzing with DeepSeek:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to analyze goals";
    const errorDetails =
      error instanceof Error ? error.toString() : String(error);

    return NextResponse.json(
      {
        error: errorMessage,
        details: errorDetails,
      },
      { status: 500 }
    );
  }
}
