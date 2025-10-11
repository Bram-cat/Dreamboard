import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { goals, uploadContext } = await request.json();

    if (!goals || typeof goals !== "string") {
      return NextResponse.json(
        { error: "Goals text is required" },
        { status: 400 }
      );
    }

    // Check DeepSeek API key
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      console.error("DEEPSEEK_API_KEY not found in environment variables");
      return NextResponse.json(
        { error: "DeepSeek API key not configured" },
        { status: 500 }
      );
    }

    console.log("Analyzing goals with DeepSeek to generate specific scenarios...");

    const hasSelfie = uploadContext?.hasSelfie || false;
    const hasCar = uploadContext?.hasDreamCar || false;
    const hasHouse = uploadContext?.hasDreamHouse || false;

    // Create prompt for DeepSeek to generate specific, diverse scenarios
    const analysisPrompt = `You are helping create a vision board. Based on these goals: "${goals}", generate exactly 5 specific, diverse photo scenarios for a vision board.

REQUIREMENTS:
- Create EXACTLY 5 distinct scenarios
- ${hasSelfie ? 'The user uploaded a selfie, so 4 scenarios should feature them in different activities' : 'No user photo provided, so focus on aspirational scenes'}
- Make scenarios diverse: business, social, wellness, achievement, lifestyle
- Each scenario should be specific and actionable for image generation
- ${hasCar ? 'One scenario MUST include the user with their dream car' : ''}
- ${hasHouse ? 'One scenario MUST include the user in front of their dream house' : ''}
- MAXIMUM 1 yoga/meditation scene (preferably 0)
- Include varied settings: office, cafe, gym, outdoors, luxury interior

Return ONLY a JSON array of 5 scenario objects, each with:
{
  "description": "specific scene description",
  "needsSelfie": boolean,
  "needsCar": boolean,
  "needsHouse": boolean
}

Example format:
[
  {"description": "Person in sharp business suit standing confidently in front of city skyline at sunset, power pose", "needsSelfie": true, "needsCar": false, "needsHouse": false},
  {"description": "Person at trendy outdoor cafe, casual stylish outfit, enjoying coffee and working on laptop", "needsSelfie": true, "needsCar": false, "needsHouse": false},
  ...
]

Generate 5 diverse scenarios now:`;

    // Call DeepSeek API
    const deepseekResponse = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "user",
            content: analysisPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!deepseekResponse.ok) {
      throw new Error(`DeepSeek API error: ${deepseekResponse.statusText}`);
    }

    const deepseekData = await deepseekResponse.json();
    const responseText = deepseekData.choices[0].message.content;

    console.log("DeepSeek response:", responseText);

    // Parse JSON from response
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("Failed to parse scenarios from DeepSeek response");
    }

    const scenarios = JSON.parse(jsonMatch[0]);

    if (!Array.isArray(scenarios) || scenarios.length === 0) {
      throw new Error("Invalid scenarios format from DeepSeek");
    }

    console.log(`Generated ${scenarios.length} scenarios successfully`);

    return NextResponse.json({
      scenarios: scenarios,
      success: true,
      totalScenarios: scenarios.length
    });

  } catch (error: unknown) {
    console.error("Error analyzing goals:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to analyze goals",
        details: error instanceof Error ? error.stack : String(error),
      },
      { status: 500 }
    );
  }
}
