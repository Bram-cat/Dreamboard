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

    console.log("Generating specific scenarios for vision board...");

    const hasSelfie = uploadContext?.hasSelfie || false;
    const hasCar = uploadContext?.hasDreamCar || false;
    const hasHouse = uploadContext?.hasDreamHouse || false;

    // Generate 3 diverse, specific scenarios for the vision board
    // Reduced to 3 to stay under 4.5MB Vercel limit (3 x 1.3MB = 3.9MB)
    const scenarios = [];

    if (hasSelfie) {
      // Scenario 1: Business/Professional - Power & Success
      scenarios.push({
        description: "Person in sharp business suit standing confidently in modern office or in front of city skyline at golden hour, power pose with arms crossed, successful CEO entrepreneur vibe, professional photography",
        needsSelfie: true,
        needsCar: false,
        needsHouse: false
      });

      // Scenario 2: Lifestyle - Social Success (Dream Car OR Cafe)
      if (hasCar) {
        scenarios.push({
          description: "Person standing proudly next to their dream car, hand resting on hood, big accomplished smile, scenic mountain road or coastal highway background, achievement moment, luxury lifestyle",
          needsSelfie: true,
          needsCar: true,
          needsHouse: false
        });
      } else {
        scenarios.push({
          description: "Person at trendy outdoor cafe or upscale restaurant, stylish casual outfit, enjoying artisan coffee or brunch, working on laptop, sophisticated influencer lifestyle, natural lighting",
          needsSelfie: true,
          needsCar: false,
          needsHouse: false
        });
      }

      // Scenario 3: Achievement - Fitness/House/Luxury
      if (hasHouse) {
        scenarios.push({
          description: "Person standing in front of their dream house exterior, holding house keys, proud accomplished expression, beautiful landscaped property, homeowner achievement, golden hour",
          needsSelfie: true,
          needsCar: false,
          needsHouse: true
        });
      } else {
        scenarios.push({
          description: "Person in athletic wear at modern gym doing workout with dumbbells, fit determined expression showing strength and dedication, or relaxing in luxury penthouse with city view, wealthy lifestyle",
          needsSelfie: true,
          needsCar: false,
          needsHouse: false
        });
      }
    } else {
      // If no selfie, generate 3 aspirational scenes without people
      scenarios.push(
        {
          description: "Modern luxury house with clean architecture, floor-to-ceiling windows, beautiful landscaping, golden hour lighting, aspirational real estate",
          needsSelfie: false,
          needsCar: hasCar,
          needsHouse: hasHouse
        },
        {
          description: "High-end sports car on scenic coastal highway, ocean view, sunset lighting, aspirational luxury lifestyle",
          needsSelfie: false,
          needsCar: hasCar,
          needsHouse: false
        },
        {
          description: "Minimalist luxury penthouse interior with modern furniture and city skyline view through floor-to-ceiling windows, sophisticated aesthetic",
          needsSelfie: false,
          needsCar: false,
          needsHouse: false
        }
      );
    }

    console.log(`Generated ${scenarios.length} scenarios successfully`);

    return NextResponse.json({
      scenarios: scenarios,
      success: true,
      totalScenarios: scenarios.length
    });

  } catch (error: unknown) {
    console.error("Error generating scenarios:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to generate scenarios",
        details: error instanceof Error ? error.stack : String(error),
      },
      { status: 500 }
    );
  }
}
