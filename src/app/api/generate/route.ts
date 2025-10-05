import Replicate from "replicate";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { goals } = await request.json();

    if (!goals || typeof goals !== "string") {
      return NextResponse.json(
        { error: "Goals text is required" },
        { status: 400 }
      );
    }

    // Check for API token
    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json(
        { error: "REPLICATE_API_TOKEN not configured" },
        { status: 500 }
      );
    }

    // Parse goals into keywords (split by commas, limit to 6)
    const keywords = goals
      .split(",")
      .map((g: string) => g.trim())
      .filter((g: string) => g.length > 0)
      .slice(0, 6);

    if (keywords.length === 0) {
      return NextResponse.json(
        { error: "No valid goals found" },
        { status: 400 }
      );
    }

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    // Generate images for each keyword using Stable Diffusion
    const imagePromises = keywords.map(async (keyword: string) => {
      const output = await replicate.run(
        "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
        {
          input: {
            prompt: `${keyword}, vision board style, inspirational, high quality, aesthetic`,
            negative_prompt: "text, watermark, low quality, blurry",
            width: 512,
            height: 512,
          },
        }
      );

      // Replicate returns an array of image URLs
      return Array.isArray(output) ? output[0] : output;
    });

    const images = await Promise.all(imagePromises);

    return NextResponse.json({ images, keywords });
  } catch (error) {
    console.error("Error generating images:", error);
    return NextResponse.json(
      { error: "Failed to generate images" },
      { status: 500 }
    );
  }
}
