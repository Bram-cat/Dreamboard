import { NextRequest, NextResponse } from "next/server";
import RunwayML from "@runwayml/sdk";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
  // Initialize clients (lazy load to avoid build-time errors)
  const runway = new RunwayML({
    apiKey: process.env.RUNWAYML_API_KEY || "",
  });

  const deepseek = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY || "",
    baseURL: "https://api.deepseek.com/v1",
  });
  try {
    const { goals, generatedImages, userImages } = await request.json();

    console.log("Creating vision board collage...");
    console.log("Goals:", goals);
    console.log("Generated images:", generatedImages?.length || 0);
    console.log("User images:", userImages?.length || 0);

    // Step 1: Use DeepSeek to create a collage prompt based on the reference images
    let collagePrompt = "";

    try {
      const systemPrompt = `You are a vision board designer. Your task is to create a detailed prompt for generating a beautiful vision board collage using Runway AI's image generation.

The vision board should:
- Be in the style of the reference samples (polaroid frames, sticky notes, overlapping collage)
- Include 10-15 images arranged creatively
- Mix different types of content: photos, quotes, goals, aspirations
- Have a cohesive aesthetic (warm tones, dreamy, inspirational)
- Look like a physical vision board with frames and overlapping elements`;

      const userPrompt = `Create a detailed prompt for generating a vision board collage image. The board should represent these goals: ${goals}

Style reference: Look at sample vision boards with polaroid-style frames, sticky notes, and magazine cutout aesthetic. The images should be arranged in a creative, overlapping collage layout.

The vision board should include visual elements for:
${goals
  .split(",")
  .map((g: string, i: number) => `${i + 1}. ${g.trim()}`)
  .join("\n")}

Generate a single detailed prompt (max 300 characters) for creating this entire vision board collage in one image. Focus on the overall composition, style, and aesthetic.`;

      const completion = await deepseek.chat.completions.create({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      collagePrompt = completion.choices[0]?.message?.content || "";
      console.log("DeepSeek collage prompt:", collagePrompt);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      console.error("DeepSeek error:", errorMessage);
      console.log("Using fallback collage prompt...");

      // Fallback: Create a smart prompt based on goals
      collagePrompt = `Vision board collage with polaroid frames and sticky notes showing ${goals}, magazine cutout aesthetic, overlapping images, warm tones, inspirational quotes, dreamy atmosphere, professional photography, multiple goals displayed creatively`;
    }

    // Ensure the prompt emphasizes the collage style
    if (!collagePrompt.toLowerCase().includes("collage")) {
      collagePrompt = `Vision board collage style: ${collagePrompt}`;
    }
    if (!collagePrompt.toLowerCase().includes("polaroid")) {
      collagePrompt += ", polaroid frames, sticky note aesthetic";
    }

    console.log("Final collage prompt:", collagePrompt);

    // Step 2: Use Runway AI to generate the vision board collage
    console.log("Generating vision board collage with Runway AI...");

    const imageResponse = await runway.textToImage.create({
      model: "gen4_image_turbo",
      promptText: collagePrompt,
      ratio: "1080:1920", // Portrait orientation for vision board (9:16 aspect ratio)
    });

    // Wait for the task to complete
    const taskId = imageResponse.id;
    let taskResult = await runway.tasks.retrieve(taskId);

    // Poll until complete (max 60 seconds)
    let attempts = 0;
    while (taskResult.status !== "SUCCEEDED" && attempts < 30) {
      if (taskResult.status === "FAILED") {
        throw new Error(`Runway task failed: ${taskResult.failure}`);
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
      taskResult = await runway.tasks.retrieve(taskId);
      attempts++;
    }

    if (taskResult.status === "SUCCEEDED" && taskResult.output) {
      const collageUrl = Array.isArray(taskResult.output)
        ? taskResult.output[0]
        : taskResult.output;

      console.log(" Vision board collage generated successfully!");

      return NextResponse.json({
        collageUrl,
        prompt: collagePrompt,
        success: true,
      });
    } else {
      throw new Error("Task did not complete in time");
    }
  } catch (error: unknown) {
    console.error("Error generating collage:", error);
    
    // Type guard to check if error is an instance of Error
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'An unknown error occurred';
    
    const errorDetails = error instanceof Error 
      ? error.stack || error.toString() 
      : String(error);

    return NextResponse.json(
      {
        error: errorMessage,
        details: errorDetails,
      },
      { status: 500 }
    );
  }
}
