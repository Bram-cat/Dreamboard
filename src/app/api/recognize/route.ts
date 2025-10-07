import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
  // Initialize DeepSeek client (supports vision)
  const deepseek = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY || "",
    baseURL: "https://api.deepseek.com/v1",
  });

  try {
    const { images } = await request.json();

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: "Images array is required" },
        { status: 400 }
      );
    }

    console.log(`Recognizing ${images.length} images with DeepSeek Vision...`);

    const recognitions: Array<{ type: string; description: string }> = [];

    // Analyze each image
    for (let i = 0; i < images.length; i++) {
      try {
        const imageData = images[i];

        const completion = await deepseek.chat.completions.create({
          model: "deepseek-chat", // DeepSeek vision model
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `Analyze this image and identify what it is. Respond with ONLY a JSON object in this exact format:
{"type": "selfie|car|destination|food|home|fitness|other", "description": "brief description"}

Categories:
- selfie: person's face/portrait
- car: any vehicle
- destination: travel location/landmark
- food: meals/drinks
- home: house/apartment/room
- fitness: gym/workout/sports
- other: anything else

Be concise and accurate.`,
                },
                {
                  type: "image_url",
                  image_url: {
                    url: imageData,
                  },
                },
              ],
            },
          ],
          temperature: 0.3,
          max_tokens: 150,
        });

        const responseText = completion.choices[0]?.message?.content || "{}";
        console.log(`Image ${i + 1} recognition:`, responseText);

        // Parse the JSON response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const recognition = JSON.parse(jsonMatch[0]);
          recognitions.push(recognition);
        } else {
          // Fallback
          recognitions.push({ type: "other", description: "Unknown" });
        }
      } catch (error) {
        console.error(`Error recognizing image ${i + 1}:`, error);
        recognitions.push({ type: "other", description: "Unable to analyze" });
      }
    }

    console.log("Image recognition complete:", recognitions);

    return NextResponse.json({
      recognitions,
      count: recognitions.length,
    });
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("Error in image recognition:", err);
    return NextResponse.json(
      {
        error: err.message || "Failed to recognize images",
      },
      { status: 500 }
    );
  }
}
