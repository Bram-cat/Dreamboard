import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { goals, userImageCount } = await request.json();
    console.log("Enhancing vision board for goals:", goals);

    // Create smart, contextual prompts based on the user's goals
    const enhancementPrompts = generateSmartPrompts(goals, userImageCount);

    console.log("Generating enhanced images:", enhancementPrompts);

    // Generate images using Pollinations.ai
    const images = enhancementPrompts.map((prompt) => {
      const encodedPrompt = encodeURIComponent(prompt);
      const seed = Math.floor(Math.random() * 10000);
      return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&seed=${seed}&nologo=true`;
    });

    const keywords = enhancementPrompts.map((prompt) => {
      // Extract keyword from prompt
      return prompt.split(",")[0];
    });

    console.log("Enhanced images generated:", images.length);

    return NextResponse.json({ images, keywords });
  } catch (error: unknown) {
    console.error("Error enhancing vision board:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to enhance vision board";

    return NextResponse.json(
      {
        error: errorMessage,
        details: error instanceof Error ? error.toString() : String(error),
      },
      { status: 500 }
    );
  }
}

function generateSmartPrompts(goals: string, imageCount: number): string[] {
  const prompts: string[] = [];
  const goalKeywords = goals.toLowerCase();

  // Luxury/Success themed prompts
  if (
    goalKeywords.includes("car") ||
    goalKeywords.includes("luxury") ||
    goalKeywords.includes("rich") ||
    goalKeywords.includes("money")
  ) {
    prompts.push(
      "luxury lifestyle, success mindset, inspirational",
      "expensive watch, rolex, luxury accessories, motivation",
      "private jet interior, first class travel, luxury lifestyle",
      "penthouse view, city skyline, success",
      "champagne celebration, achievement, success",
      "luxury business office, entrepreneur workspace"
    );
  }

  // Travel themed prompts
  if (
    goalKeywords.includes("travel") ||
    goalKeywords.includes("explore") ||
    goalKeywords.includes("vacation")
  ) {
    prompts.push(
      "exotic beach paradise, turquoise water, travel goals",
      "mountain adventure, hiking success, outdoor lifestyle",
      "european city streets, travel inspiration, wanderlust",
      "passport stamps, world traveler, adventure",
      "luxury resort pool, vacation goals, relaxation",
      "sunset over ocean, peaceful travel moment"
    );
  }

  // Fitness/Health themed prompts
  if (
    goalKeywords.includes("fitness") ||
    goalKeywords.includes("health") ||
    goalKeywords.includes("gym") ||
    goalKeywords.includes("body")
  ) {
    prompts.push(
      "fit athletic body, gym motivation, fitness goals",
      "healthy meal prep, nutrition, wellness lifestyle",
      "yoga practice, mindfulness, health journey",
      "running at sunrise, fitness dedication, morning workout",
      "gym equipment, strength training, fitness motivation",
      "athletic achievement, fitness success, transformation"
    );
  }

  // Home/Property themed prompts
  if (
    goalKeywords.includes("home") ||
    goalKeywords.includes("house") ||
    goalKeywords.includes("property")
  ) {
    prompts.push(
      "modern luxury home exterior, dream house, architecture",
      "beautiful home interior, interior design, cozy living",
      "luxury kitchen, modern appliances, home goals",
      "backyard pool, outdoor living, dream property",
      "walk-in closet, luxury bedroom, home inspiration",
      "home office setup, productivity space, work from home"
    );
  }

  // Career/Business themed prompts
  if (
    goalKeywords.includes("career") ||
    goalKeywords.includes("business") ||
    goalKeywords.includes("entrepreneur") ||
    goalKeywords.includes("success")
  ) {
    prompts.push(
      "professional business meeting, leadership, success",
      "entrepreneur working, laptop lifestyle, hustle",
      "public speaking, conference, career growth",
      "team collaboration, business success, teamwork",
      "signing contract, business deal, achievement",
      "corner office, career goals, professional success"
    );
  }

  // Relationship/Love themed prompts
  if (
    goalKeywords.includes("love") ||
    goalKeywords.includes("family") ||
    goalKeywords.includes("relationship") ||
    goalKeywords.includes("wedding")
  ) {
    prompts.push(
      "romantic couple sunset, love goals, relationship",
      "family happiness, togetherness, love and joy",
      "wedding celebration, marriage, love commitment",
      "couple traveling together, adventure partners, love",
      "romantic dinner date, relationship goals, intimacy",
      "holding hands, connection, love and support"
    );
  }

  // Personal Growth/Mindset themed prompts
  if (
    goalKeywords.includes("growth") ||
    goalKeywords.includes("mindset") ||
    goalKeywords.includes("self")
  ) {
    prompts.push(
      "meditation and peace, mindfulness, personal growth",
      "reading books, learning, knowledge seeking",
      "journaling, self reflection, personal development",
      "sunrise motivation, new beginnings, positive mindset",
      "gratitude practice, positivity, mental wellness",
      "goal planning, vision setting, life planning"
    );
  }

  // If no specific themes detected or need more images, add general motivational prompts
  const generalPrompts = [
    "success celebration, achievement, winning mindset",
    "inspiring quote typography, motivation, positivity",
    "golden hour aesthetics, beauty, inspiration",
    "flowers and growth, blooming, natural beauty",
    "stars and universe, dreams, infinite possibilities",
    "sunrise over mountains, new day, fresh start",
    "champagne toast, celebration, life achievements",
    "luxury lifestyle aesthetics, abundance, prosperity",
    "peaceful nature scene, tranquility, balance",
    "motivational workspace, productivity, focus",
  ];

  // Add general prompts if needed
  while (prompts.length < imageCount * 4) {
    const randomPrompt =
      generalPrompts[Math.floor(Math.random() * generalPrompts.length)];
    if (!prompts.includes(randomPrompt)) {
      prompts.push(randomPrompt);
    }
  }

  // Return many more prompts to fill the board completely (at least 18-20 images)
  return prompts.slice(0, Math.max(imageCount * 4, 20));
}
