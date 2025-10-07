import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
  // Initialize DeepSeek client (lazy load to avoid build-time errors)
  const deepseek = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY || "",
    baseURL: "https://api.deepseek.com/v1",
  });
  try {
    const { goals, userImages, imageContext } = await request.json();

    if (!goals || typeof goals !== "string") {
      return NextResponse.json(
        { error: "Goals text is required" },
        { status: 400 }
      );
    }

    console.log("Analyzing goals with DeepSeek:", goals);
    console.log("User images count:", Array.isArray(userImages) ? userImages.length : 0);
    console.log("Image context:", imageContext || "None");

    const hasUserImages = Array.isArray(userImages) && userImages.length > 0;

    // Create a detailed prompt for DeepSeek to generate image prompts
    const systemPrompt = `You are a vision board creator AI. Your task is to analyze user goals and create detailed, inspiring image generation prompts for Runway AI to create a collage-style vision board.

IMPORTANT STYLE REQUIREMENTS:
- Generate 5-10 unique, specific image prompts (NOT 15, quality over quantity)
- Each image should look like a polaroid/photo from a magazine - natural, candid, lifestyle photography
- Warm tones, natural lighting, soft focus, film photography aesthetic
- Mix of: person in scenarios (50%), lifestyle objects/places (30%), text overlays (20%)

PROMPT CATEGORIES TO INCLUDE:
1. Person-focused (use "@userPhoto" tag):
   - Yoga/meditation poses in beautiful settings
   - Working out / fitness activities
   - At dream travel destinations (beach, mountains, hot air balloons)
   - Celebrating success (arms raised, joyful moments)
   - Doing activities related to their goals

2. Lifestyle imagery (NO person):
   - Healthy foods (acai bowls, smoothies, coffee, pastries)
   - Luxury items (if mentioned: cars, homes, watches)
   - Nature scenes (mountains, beaches, forests, sunsets)
   - Wellness items (journals, books, candles, plants)

3. Motivational text overlays:
   - Affirmations related to their goals
   - Example: "I am capable", "Money flows to me effortlessly", "Grateful, glowing, & growing"

Keep each prompt under 150 characters for optimal generation.`;

    const userPrompt = `User's Goals: ${goals}

${hasUserImages && imageContext ? `User uploaded a selfie - Use "@userPhoto" in prompts where you want to show the person achieving their goals.` : ""}

Generate 5-10 prompts based on their goals. Mix these types:

TYPE 1 - Person in lifestyle scenarios (3-5 prompts):
${hasUserImages ? `- "@userPhoto doing yoga at sunrise, peaceful meditation, warm light, film photography"
- "@userPhoto celebrating at beach, arms raised in joy, sunset, candid moment"
- "@userPhoto working out, fitness journey, gym aesthetic, natural lighting"
- Add more based on their specific goals (travel, wealth, fitness, etc.)` : `- Skip person-focused prompts if no selfie uploaded`}

TYPE 2 - Lifestyle objects/scenes (2-3 prompts):
- "Healthy acai bowl with berries, aesthetic food photography, warm tones"
- "Luxury modern home exterior, dream house, architectural photography"
- "Stack of cash and gold coins, wealth abundance, overhead shot"
- "Tropical beach paradise, turquoise water, travel goals, aerial view"
- Choose based on their goals

TYPE 3 - Text overlays (1-2 prompts):
- "Affirmation text overlay: 'I am capable', handwritten font, cream background"
- "Motivational quote: '${goals.split(',')[0]}', elegant typography, minimalist"

RULES:
- Keep prompts under 150 characters
- Use "@userPhoto" ONLY if user uploaded a selfie
- Make it natural, candid, lifestyle photography style
- Warm tones, film aesthetic, soft lighting

Return ONLY a JSON array of strings: ["prompt 1", "prompt 2", ...]`;

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

      // Fallback: Create lifestyle prompts matching sample aesthetic
      const personPrompts: string[] = [];
      const lifestylePrompts: string[] = [];
      const textPrompts: string[] = [];

      // Person-focused prompts (if selfie uploaded)
      if (hasUserImages) {
        personPrompts.push(
          "@userPhoto doing yoga at sunrise, peaceful meditation, warm natural light, film photography",
          "@userPhoto at beach celebrating, arms raised in joy, sunset, candid lifestyle moment",
          "@userPhoto working out, fitness journey, gym aesthetic, natural lighting, healthy lifestyle"
        );

        keywords.forEach((keyword: string) => {
          const kw = keyword.toLowerCase();
          if (kw.includes("travel") || kw.includes("vacation")) {
            personPrompts.push("@userPhoto at tropical destination, travel goals, wanderlust, natural candid shot");
          }
          if (kw.includes("money") || kw.includes("wealth") || kw.includes("rich")) {
            personPrompts.push("@userPhoto celebrating success, luxury lifestyle, champagne toast, golden hour");
          }
          if (kw.includes("fitness") || kw.includes("health") || kw.includes("yoga")) {
            personPrompts.push("@userPhoto meditating in nature, wellness journey, peaceful zen moment, soft focus");
          }
        });
      }

      // Lifestyle object/scene prompts (NO person)
      keywords.forEach((keyword: string) => {
        const kw = keyword.toLowerCase();

        if (kw.includes("money") || kw.includes("wealth") || kw.includes("rich")) {
          lifestylePrompts.push(
            "stack of cash and gold coins, wealth abundance, overhead flat lay, warm tones",
            "luxury modern home exterior, dream house, architectural photography, natural daylight"
          );
        }
        if (kw.includes("travel") || kw.includes("vacation")) {
          lifestylePrompts.push(
            "tropical beach paradise, turquoise water, aerial view, travel goals aesthetic",
            "airplane window view, clouds and sky, wanderlust vibes, soft natural light"
          );
        }
        if (kw.includes("health") || kw.includes("fitness") || kw.includes("food")) {
          lifestylePrompts.push(
            "acai bowl with fresh berries, aesthetic food photography, bright natural light, overhead",
            "morning coffee latte art, cozy breakfast scene, warm tones, lifestyle flat lay"
          );
        }
        if (kw.includes("car") || kw.includes("vehicle")) {
          lifestylePrompts.push("luxury sports car on scenic road, dream car goals, golden hour, cinematic");
        }
      });

      // Always add some general lifestyle prompts
      lifestylePrompts.push(
        "journal and coffee on desk, morning routine, cozy aesthetic, natural window light",
        "mountain landscape sunset, nature goals, peaceful vibes, warm golden tones"
      );

      // Text overlay prompts
      textPrompts.push(
        `Affirmation text overlay: 'I am capable', handwritten elegant font, cream background, minimalist`,
        `Motivational quote: 'Money flows to me effortlessly', modern typography, aesthetic design`
      );

      // Combine prompts: 50% person, 30% lifestyle, 20% text
      prompts = [
        ...personPrompts.slice(0, 4),
        ...lifestylePrompts.slice(0, 3),
        ...textPrompts.slice(0, 1)
      ];
    }

    // Ensure we have 5-10 prompts (matching sample quality)
    if (prompts.length < 5) {
      const genericPrompts = [
        "healthy acai bowl with berries, aesthetic food photography, warm natural light, overhead",
        "tropical beach sunset, travel goals, wanderlust aesthetic, warm tones, paradise",
        "Affirmation text: 'Grateful, glowing, & growing', elegant handwritten font, minimalist",
        "mountain landscape at golden hour, nature peace, serene vibes, film photography",
        "cozy coffee and journal, morning routine, lifestyle flat lay, warm aesthetic",
      ];
      prompts = [...prompts, ...genericPrompts].slice(0, 8);
    } else if (prompts.length > 10) {
      prompts = prompts.slice(0, 10);
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
