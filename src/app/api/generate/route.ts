import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { goals } = await request.json();
    console.log("Received goals:", goals);

    if (!goals || typeof goals !== "string") {
      console.error("Invalid goals input");
      return NextResponse.json(
        { error: "Goals text is required" },
        { status: 400 }
      );
    }

    // Parse goals into keywords (split by commas, limit to 6)
    const keywords = goals
      .split(",")
      .map((g: string) => g.trim())
      .filter((g: string) => g.length > 0)
      .slice(0, 6);

    console.log("Parsed keywords:", keywords);

    if (keywords.length === 0) {
      return NextResponse.json(
        { error: "No valid goals found" },
        { status: 400 }
      );
    }

    console.log("Generating images for keywords:", keywords);

    // Generate multiple variations for each keyword (2-3 images per goal)
    const images: string[] = [];
    const imageKeywords: string[] = [];

    keywords.forEach((keyword: string) => {
      // Generate 2-3 variations of each keyword for variety
      const variations = [
        `${keyword}, vision board aesthetic, inspirational`,
        `${keyword}, motivational poster style, beautiful`,
        `${keyword}, dreamy aesthetic, high quality`,
      ];

      variations.forEach((variation, index) => {
        const prompt = encodeURIComponent(variation);
        // Add seed for variety but consistency
        const seed = Math.floor(Math.random() * 10000);
        const imageUrl = `https://image.pollinations.ai/prompt/${prompt}?width=512&height=512&seed=${seed}&nologo=true`;
        console.log(`Generated image ${index + 1} for "${keyword}":`, imageUrl);
        images.push(imageUrl);
        imageKeywords.push(keyword);
      });
    });

    console.log("All images generated successfully:", images.length);

    return NextResponse.json({ images, keywords: imageKeywords });
  } catch (error: unknown) {
    console.error("Error generating images:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;

    console.error("Error details:", errorMessage, errorStack);

    return NextResponse.json(
      {
        error: errorMessage,
        details: errorStack || "No stack trace available",
      },
      { status: 500 }
    );
  }
}
