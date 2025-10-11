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

    // Generate 4 diverse, specific scenarios for the vision board
    // Reduced to 4 to keep payload under 4.5MB limit
    const scenarios = [];

    if (hasSelfie) {
      // Scenario 1: Business/Professional
      scenarios.push({
        description: "Person in sharp business suit standing confidently in modern office or in front of city skyline at golden hour, power pose with arms crossed or hand in pocket, successful entrepreneur vibe",
        needsSelfie: true,
        needsCar: false,
        needsHouse: false
      });

      // Scenario 2: Social/Lifestyle (cafe or restaurant)
      scenarios.push({
        description: "Person at trendy outdoor cafe or upscale restaurant, stylish casual outfit, enjoying artisan coffee or brunch, working on laptop or reading, sophisticated lifestyle",
        needsSelfie: true,
        needsCar: false,
        needsHouse: false
      });

      // Scenario 3: Fitness/Active OR Dream Car
      if (hasCar) {
        scenarios.push({
          description: "Person standing proudly next to their dream car, hand resting on hood, big accomplished smile, scenic mountain road or coastal highway background, achievement moment",
          needsSelfie: true,
          needsCar: true,
          needsHouse: false
        });
      } else {
        scenarios.push({
          description: "Person in athletic wear at modern gym lifting dumbbells or doing workout, fit and determined expression, active healthy lifestyle",
          needsSelfie: true,
          needsCar: false,
          needsHouse: false
        });
      }

      // Scenario 4: Dream House OR Luxury Interior (NO wellness to avoid repetition)
      if (hasHouse) {
        scenarios.push({
          description: "Person standing in front of their dream house exterior, holding house keys, proud accomplished expression, beautiful landscaped property, homeowner achievement",
          needsSelfie: true,
          needsCar: false,
          needsHouse: true
        });
      } else {
        scenarios.push({
          description: "Person relaxing in luxurious modern interior, reading book in elegant armchair with city view, or enjoying coffee by floor-to-ceiling windows, sophisticated wealthy lifestyle",
          needsSelfie: true,
          needsCar: false,
          needsHouse: false
        });
      }
    } else {
      // If no selfie, generate 4 aspirational scenes without people
      scenarios.push(
        {
          description: "Modern luxury house with clean architecture, floor-to-ceiling windows, beautiful landscaping, golden hour lighting",
          needsSelfie: false,
          needsCar: hasCar,
          needsHouse: hasHouse
        },
        {
          description: "High-end sports car on scenic coastal highway, ocean view, sunset lighting, aspirational lifestyle",
          needsSelfie: false,
          needsCar: hasCar,
          needsHouse: false
        },
        {
          description: "Tropical beach paradise with turquoise water, white sand, palm trees, travel destination",
          needsSelfie: false,
          needsCar: false,
          needsHouse: false
        },
        {
          description: "Minimalist luxury interior with modern furniture, city view through windows, sophisticated aesthetic",
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
