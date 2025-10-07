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
${hasUserImages ? `\nUser uploaded a selfie - include @userPhoto in some scenarios` : ""}

Create ONE detailed prompt for generating a COMPLETE vision board collage image. The prompt should describe:

COLLAGE LAYOUT:
- 10-15 small images arranged in a scattered, overlapping Pinterest-style collage
- Some images in polaroid frames, some with torn edges, varied sizes
- Beige/cream/warm background color
- Title text "MY VISION BOARD" or "Make it Happen" or similar

INCLUDE THESE ELEMENTS IN THE COLLAGE:
1. Dream house - modern luxury home exterior with clean architecture
2. Travel - Paris/Eiffel Tower, tropical beach, or mountains based on goals
3. Wellness - yoga pose, meditation, spa/self-care scene
4. Food - healthy acai bowl, coffee latte art, aesthetic breakfast
5. Nature - garden path, sunset, peaceful landscape
6. Money/wealth - stack of cash, gold coins (if financial goals mentioned)
7. Luxury lifestyle - modern minimalist interior design
${hasUserImages ? `8. Person scenes - @userPhoto doing yoga, @userPhoto at beach celebrating, @userPhoto working out (2-3 images)` : "8. Inspirational woman achieving goals (2-3 images)"}
9. Motivational text - "Meditation", "Traveling", "I Love What I Do", "Dream big, work hard"
10. Additional elements based on specific goals: ${goals}

STYLE:
- Warm tones, film photography aesthetic, natural lighting
- Feminine, aspirational, peaceful vibes
- Magazine/Pinterest collage aesthetic
- Mix of close-ups and wide shots

Return ONE detailed prompt (under 500 characters) describing this complete collage as a single image.`;

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

      const responseText = completion.choices[0]?.message?.content || "";
      console.log("DeepSeek response:", responseText);

      // DeepSeek should return ONE prompt for the complete collage
      // Just use the response directly as a single prompt
      const cleanedPrompt = responseText.trim().replace(/^["']|["']$/g, '');
      prompts = [cleanedPrompt];
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

      // Fallback: Create ONE comprehensive collage prompt
      const elements: string[] = [];

      // Core elements for all vision boards (women-focused)
      elements.push("modern luxury dream house exterior");
      elements.push("Paris Eiffel Tower or tropical beach travel destination");
      elements.push("woman doing yoga meditation in peaceful setting");
      elements.push("healthy acai bowl and coffee latte art");
      elements.push("beautiful garden path or sunset landscape");
      elements.push("minimalist luxury interior design");

      // Add goal-specific elements
      keywords.forEach((keyword: string) => {
        const kw = keyword.toLowerCase();
        if (kw.includes("money") || kw.includes("wealth") || kw.includes("rich")) {
          elements.push("stack of cash and gold coins");
        }
        if (kw.includes("car") || kw.includes("vehicle")) {
          elements.push("luxury sports car");
        }
        if (kw.includes("fitness") || kw.includes("health")) {
          elements.push("fitness workout scene");
        }
      });

      // Add person if selfie uploaded
      if (hasUserImages) {
        elements.push("@userPhoto doing yoga");
        elements.push("@userPhoto celebrating at beach");
      }

      // Add motivational text
      elements.push("text labels: 'Meditation', 'Traveling', 'I Love What I Do', 'Dream big work hard'");

      const collagePrompt = `Vision board collage with 12-15 small photos in polaroid frames, scattered overlapping layout on beige background. Title "MY VISION BOARD" at top. Contains: ${elements.join(", ")}. Warm tones, film photography aesthetic, feminine Pinterest style, natural lighting.`;

      prompts = [collagePrompt];
    }

    // Should only have ONE prompt now (the complete collage)
    if (prompts.length === 0 || !prompts[0] || prompts[0].length < 50) {
      // Ultimate fallback: generic vision board collage
      prompts = [`Vision board collage with 12 small photos in polaroid frames on beige background. Title "MY VISION BOARD". Contains: luxury dream house, Paris Eiffel Tower, tropical beach, woman doing yoga, meditation scene, healthy acai bowl, coffee latte, garden path, sunset, gold coins money stack, minimalist interior, motivational text "Traveling", "I Love What I Do", "Dream big work hard". Warm tones, film photography, Pinterest aesthetic.`];
    }

    // Ensure only ONE prompt
    prompts = [prompts[0]];

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
