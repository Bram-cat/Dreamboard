import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
  // Initialize DeepSeek client (lazy load to avoid build-time errors)
  const deepseek = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY || "",
    baseURL: "https://api.deepseek.com/v1",
  });
  try {
    const { goals, userImages } = await request.json();

    if (!goals || typeof goals !== "string") {
      return NextResponse.json(
        { error: "Goals text is required" },
        { status: 400 }
      );
    }

    console.log("Analyzing goals with DeepSeek:", goals);
    console.log("User images count:", Array.isArray(userImages) ? userImages.length : 0);

    const hasUserImages = Array.isArray(userImages) && userImages.length > 0;

    // Create a detailed prompt for DeepSeek to generate image prompts
    const systemPrompt = `You are a vision board creator AI. Your task is to analyze user goals and create detailed, inspiring image generation prompts for Runway AI.

Guidelines:
- Generate 10-15 unique, specific image prompts
- Each prompt should be photorealistic, inspirational, and visually appealing
- Include user's selfie/photo naturally in scenarios where they're living their dream life
- Create prompts for: lifestyle goals, success moments, dream possessions, motivational scenes
- Style: polaroid aesthetic, warm tones, professional photography, dreamy atmosphere
- Make prompts diverse: some with people achieving goals, some with dream items, some with inspirational quotes overlaid
- If user mentions specific goals (car, travel, fitness), include those prominently
- Keep each prompt under 200 characters for optimal generation`;

    const userPrompt = `User's Goals: ${goals}

Has user uploaded images: ${hasUserImages ? `Yes (${userImages.length} images)` : "No"}

${hasUserImages ? `The user has uploaded personal photos including:
- Selfie/personal photo
- Photos related to their goals (e.g., dream car, destinations)

IMPORTANT: Create prompts that will generate NEW images incorporating these user photos:
- For 6-8 prompts: Create scenarios showing the person achieving their dreams using their photos as reference
  Examples: "person from reference photo driving luxury sports car, golden hour, cinematic"
            "person from reference photo at tropical beach resort, vacation vibes, dreamy"
- For 4-7 prompts: Create inspirational images related to their goals without the person
  Examples: "luxury sports car on mountain road, sunset, aspirational aesthetic"
            "motivational quote about success, modern typography, aesthetic"` : ""}

Generate 10-15 detailed image prompts for Runway AI that will inspire and motivate the user. Each prompt should be:
1. Specific and detailed (under 200 characters)
2. Photorealistic, cinematic style
3. Related to their specific goals
4. Warm, dreamy, aspirational atmosphere
5. If user uploaded images, incorporate them as references

Return ONLY a JSON array of strings, each string being one complete image prompt. Example format:
["prompt 1 here", "prompt 2 here", ...]`;

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

      prompts = keywords.flatMap((keyword: string) => {
        const kw = keyword.toLowerCase();
        const basePrompts: string[] = [];

        // Add prompts with user photo references if available
        if (hasUserImages) {
          basePrompts.push(
            `person from reference photo achieving ${keyword}, cinematic style, golden hour lighting`,
            `person from reference photo with ${keyword}, success moment, professional photography`
          );
        }

        // Add specific scenarios based on keyword
        if (
          kw.includes("money") ||
          kw.includes("wealth") ||
          kw.includes("rich")
        ) {
          basePrompts.push(
            hasUserImages
              ? "person from reference photo celebrating financial success, luxury lifestyle, champagne, cinematic"
              : "luxury lifestyle success, expensive watch, champagne celebration, wealth aesthetic"
          );
          basePrompts.push(
            "stack of money and luxury items, financial freedom, abundance, prosperity aesthetic"
          );
        }
        if (kw.includes("car") || kw.includes("vehicle")) {
          basePrompts.push(
            hasUserImages
              ? "person from reference photo with luxury sports car, dream car achieved, golden hour"
              : "luxury sports car on scenic road, dream car goals, exotic automobile"
          );
          basePrompts.push(
            "exotic luxury car interior and exterior, high-end automotive, dream vehicle"
          );
        }
        if (
          kw.includes("travel") ||
          kw.includes("vacation") ||
          kw.includes("destination")
        ) {
          basePrompts.push(
            hasUserImages
              ? "person from reference photo at tropical beach paradise, vacation goals, dreamy"
              : "exotic beach paradise, turquoise water, travel goals, tropical destination"
          );
          basePrompts.push(
            "mountain adventure landscape, world traveler vibes, wanderlust aesthetic"
          );
        }

        // Add generic goal-related prompts if not enough yet
        if (basePrompts.length < 3) {
          basePrompts.push(
            `${keyword} achievement visualization, warm tones, professional photography`,
            `${keyword} success, dreamy aesthetic, aspirational, cinematic lighting`
          );
        }

        return basePrompts;
      });

      // Add general motivational prompts
      const generalPrompts = [
        "success and achievement, winning mindset, inspirational quote overlay",
        "dream life manifestation, vision board collage, multiple goals aesthetic",
        "happiness and fulfillment, positive mindset, gratitude practice",
        "luxury lifestyle montage, abundance, prosperity vision",
        "fitness and health goals, wellness journey, transformation",
      ];

      prompts = [...prompts, ...generalPrompts];
    }

    // Ensure we have 10-15 prompts
    if (prompts.length < 10) {
      const genericPrompts = [
        "success and achievement, polaroid aesthetic, inspirational",
        "dream life manifestation, warm tones, professional photography",
        "luxury lifestyle, dreamy atmosphere, golden hour",
        "fitness and health goals, motivational aesthetic",
        "happiness and fulfillment, polaroid style, soft lighting",
      ];
      prompts = [...prompts, ...genericPrompts].slice(0, 12);
    } else if (prompts.length > 15) {
      prompts = prompts.slice(0, 15);
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
