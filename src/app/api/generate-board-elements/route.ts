import { NextRequest, NextResponse } from "next/server";

// Define element types
interface BoardElement {
  id: string;
  type: "person" | "lifestyle" | "quote";
  description: string;
  imageUrl?: string;
  position?: { row: number; col: number };
  size?: "small" | "medium" | "large";
}

export async function POST(request: NextRequest) {
  try {
    const { goals, categorizedUploads, uploadContext, style } =
      await request.json();

    if (!goals || typeof goals !== "string") {
      return NextResponse.json(
        { error: "Goals text is required" },
        { status: 400 }
      );
    }

    console.log("🎨 Generating component-based vision board...");
    console.log("User goals:", goals);

    const hasSelfie = categorizedUploads?.selfie;
    const hasCar = categorizedUploads?.car;
    const hasHouse = categorizedUploads?.house;

    // Define all elements to generate
    const elements: BoardElement[] = [];

    // PERSON SCENES (6-8 elements if selfie provided)
    if (hasSelfie) {
      elements.push(
        {
          id: "person-1",
          type: "person",
          description:
            "Person in sharp business attire, confident power pose, modern office or city skyline background",
          size: "large",
        },
        {
          id: "person-2",
          type: "person",
          description:
            "Person at outdoor cafe, stylish casual outfit, enjoying coffee, social setting, happy smile",
          size: "medium",
        },
        {
          id: "person-3",
          type: "person",
          description:
            "Person celebrating success with arms raised, big smile, golden hour lighting, achievement moment",
          size: "medium",
        },
        {
          id: "person-4",
          type: "person",
          description:
            "Person in GYM SETTING wearing workout clothes, lifting weights - MUST BE IN ACTUAL GYM with fitness equipment visible",
          size: "medium",
        }
      );

      if (hasCar) {
        elements.push({
          id: "person-5",
          type: "person",
          description:
            "Person with dream car, proud expression, hand on hood, scenic mountain or coastal road",
          size: "large",
        });
      } else {
        elements.push({
          id: "person-5",
          type: "person",
          description:
            "Person at airport terminal OR beach, adventure mode, backpack, excited expression",
          size: "large",
        });
      }

      if (hasHouse) {
        elements.push({
          id: "person-6",
          type: "person",
          description:
            "Person in front of dream house, holding keys, accomplished smile, beautiful modern exterior",
          size: "medium",
        });
      } else {
        elements.push({
          id: "person-6",
          type: "person",
          description:
            "Person in luxurious interior, reading or relaxing, cozy sophisticated space",
          size: "medium",
        });
      }

      elements.push(
        {
          id: "person-7",
          type: "person",
          description:
            "Person in gentle yoga pose on mat in nature OR peaceful meditation outdoors",
          size: "small",
        },
        {
          id: "person-8",
          type: "person",
          description:
            "Person INSIDE private jet sitting comfortably with champagne - NO exercise equipment, ONLY luxury relaxation",
          size: "medium",
        }
      );
    }

    // LIFESTYLE ELEMENTS (10-12 no-person images)
    elements.push(
      // Wealth & Success
      {
        id: "lifestyle-1",
        type: "lifestyle",
        description:
          "Dream house: modern architecture, landscaped yard, golden hour glow, luxurious exterior",
        size: "medium",
      },
      {
        id: "lifestyle-2",
        type: "lifestyle",
        description:
          "Stacks of cash money bills aesthetically arranged, wealth manifestation",
        size: "small",
      },
      {
        id: "lifestyle-3",
        type: "lifestyle",
        description:
          "Designer shopping bags (Chanel, Gucci, Louis Vuitton), luxury lifestyle aesthetic",
        size: "small",
      },
      {
        id: "lifestyle-4",
        type: "lifestyle",
        description:
          "Private jet interior or first-class flight window view, elite travel",
        size: "medium",
      },

      // Travel & Adventure
      {
        id: "lifestyle-5",
        type: "lifestyle",
        description:
          "Eiffel Tower Paris: autumn leaves, romantic cobblestone streets, cafe culture",
        size: "medium",
      },
      {
        id: "lifestyle-6",
        type: "lifestyle",
        description:
          "Santorini Greece: white buildings, blue domes, Mediterranean sunset",
        size: "small",
      },
      {
        id: "lifestyle-7",
        type: "lifestyle",
        description:
          "Maldives overwater bungalow: crystal clear turquoise water, paradise",
        size: "small",
      },

      // Health & Fitness
      {
        id: "lifestyle-8",
        type: "lifestyle",
        description:
          "Acai bowl: fresh berries, granola, coconut, aesthetic food photography",
        size: "small",
      },
      {
        id: "lifestyle-9",
        type: "lifestyle",
        description:
          "Green smoothie bowl: chia seeds, tropical fruits, mint, healthy vibrant",
        size: "small",
      },

      // Lifestyle & Personal
      {
        id: "lifestyle-10",
        type: "lifestyle",
        description:
          "Designer walk-in closet: organized clothes, shoes, bags, fashion goals",
        size: "small",
      },
      {
        id: "lifestyle-11",
        type: "lifestyle",
        description:
          "Champagne glasses clinking: celebration, success, cheers moment",
        size: "small",
      },
      {
        id: "lifestyle-12",
        type: "lifestyle",
        description:
          "Beautiful bouquet: roses, peonies, elegant flowers, romantic aesthetic",
        size: "small",
      }
    );

    // QUOTE ELEMENTS (8-10 text quotes)
    const quotes = [
      "2025",
      "VISION BOARD",
      "I am a money magnet",
      "Grateful",
      "CEO mindset",
      "Living my best life",
      "Good vibes only",
      "Glow from within",
      "Make it happen",
      "Trust the process",
    ];

    quotes.forEach((quote, index) => {
      elements.push({
        id: `quote-${index + 1}`,
        type: "quote",
        description: quote,
        size: "small",
      });
    });

    console.log(`📋 Total elements to generate: ${elements.length}`);
    console.log(`   - Person scenes: ${elements.filter((e) => e.type === "person").length}`);
    console.log(`   - Lifestyle images: ${elements.filter((e) => e.type === "lifestyle").length}`);
    console.log(`   - Quotes: ${elements.filter((e) => e.type === "quote").length}`);

    // Generate elements in batches to avoid overwhelming the API
    const BATCH_SIZE = 5;
    const generatedElements: BoardElement[] = [];

    for (let i = 0; i < elements.length; i += BATCH_SIZE) {
      const batch = elements.slice(i, i + BATCH_SIZE);
      console.log(`\n🔄 Generating batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(elements.length / BATCH_SIZE)}...`);

      const batchPromises = batch.map(async (element) => {
        try {
          console.log(`  - Generating: ${element.id} (${element.type})`);

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/generate-elements`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                goals,
                categorizedUploads,
                uploadContext,
                elementType: element.type,
                elementDescription: element.description,
              }),
            }
          );

          if (!response.ok) {
            throw new Error(`Failed to generate ${element.id}`);
          }

          const data = await response.json();

          return {
            ...element,
            imageUrl: data.imageUrl,
          };
        } catch (error) {
          console.error(`❌ Error generating ${element.id}:`, error);
          return null;
        }
      });

      const batchResults = await Promise.all(batchPromises);
      const successfulResults = batchResults.filter((r) => r !== null) as BoardElement[];
      generatedElements.push(...successfulResults);

      console.log(`✓ Batch complete: ${successfulResults.length}/${batch.length} successful`);
    }

    console.log(`\n✅ Generation complete: ${generatedElements.length}/${elements.length} elements created`);

    return NextResponse.json({
      elements: generatedElements,
      totalElements: generatedElements.length,
      success: true,
    });
  } catch (error: unknown) {
    console.error("Error generating board elements:", error);
    return NextResponse.json(
      {
        error: "Failed to generate board elements",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
