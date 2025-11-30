import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// NO CROPPING - Preserve original image dimensions
// Let CSS handle the framing to avoid cutting off faces
// Images are generated in landscape format by Gemini, so no need to crop

export async function POST(request: NextRequest) {
  try {
    const { keywords, categorizedUploads, selectedTemplate } = await request.json();

    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return NextResponse.json(
        { error: "Keywords array is required" },
        { status: 400 }
      );
    }

    // Check API keys - support 5 Gemini keys for parallel processing
    const openaiApiKey = process.env.OPENAI_API_KEY;
    const geminiApiKey1 = process.env.GEMINI_API_KEY_1 || process.env.GEMINI_API_KEY;
    const geminiApiKey2 = process.env.GEMINI_API_KEY_2;
    const geminiApiKey3 = process.env.GEMINI_API_KEY_3;
    const geminiApiKey4 = process.env.GEMINI_API_KEY_4;
    const geminiApiKey5 = process.env.GEMINI_API_KEY_5;

    if (!openaiApiKey) {
      console.error("OPENAI_API_KEY not found");
      return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 });
    }

    if (!geminiApiKey1) {
      console.error("GEMINI_API_KEY_1 not found");
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
    }

    // Count available API keys
    const availableKeys = [geminiApiKey1, geminiApiKey2, geminiApiKey3, geminiApiKey4, geminiApiKey5].filter(Boolean);
    const useParallelProcessing = availableKeys.length > 1;

    if (useParallelProcessing) {
      console.log(`🚀 ${availableKeys.length} Gemini API keys detected - enabling parallel processing!`);
    }

    console.log("🎨 Starting vision board generation...");
    console.log("📝 User keywords:", keywords);
    console.log("🎭 Selected template:", selectedTemplate);

    // Check what user uploaded
    const hasSelfie = !!categorizedUploads?.selfie;
    const hasDreamHouse = !!categorizedUploads?.dreamHouse;
    const hasDreamCar = !!categorizedUploads?.dreamCar;
    const hasDestination = !!categorizedUploads?.destination;

    console.log("📸 User uploads:", { hasSelfie, hasDreamHouse, hasDreamCar, hasDestination });

    // Initialize Gemini clients (1 to 5 depending on available keys)
    const genaiClients = availableKeys.map(key => new GoogleGenAI({ apiKey: key }));
    const genai1 = genaiClients[0]; // Always have at least one
    const allQuotes: string[] = [];

    // ============================================
    // NEW STRATEGY: Generate ALL images with Gemini for personalization
    // Grid template: 6 images, Magazine: 11 images, Polaroid: 11 images
    // All images will include user's face/items for a cohesive personal vision board
    // NO generic OpenAI images - everything is personalized
    // NETLIFY OPTIMIZATION: Image count optimized for performance with dual API keys
    // ============================================
    const geminiImages: string[] = [];
    // Increased to 11 images for Magazine and Polaroid templates (using dual API keys for faster generation)
    const numGeminiImages = selectedTemplate === "grid" ? 6 : selectedTemplate === "magazine" ? 11 : 11;

    if (selectedTemplate !== "ai") {
      console.log(`\n🎨 STEP 1/2: Generating ${numGeminiImages} personalized images with Gemini (ALL images)...`);

    // Strategy: Create diverse image combinations from user uploads + lifestyle scenarios
    const combinations: Array<{ images: string[]; prompt: string }> = [];

    // CRITICAL FIX: If user provides NO images at all, generate random person lifestyle images
    const hasAnyUploads = hasSelfie || hasDreamHouse || hasDreamCar || hasDestination;

    if (!hasAnyUploads) {
      console.log("⚠️  No user uploads detected - generating random person lifestyle images");

      // Generate diverse lifestyle scenarios with random people
      const randomPersonScenarios = [
        "Professional lifestyle photography of a successful person at modern luxury gym, working out with determination. Show confident athletic person doing strength training. Modern gym with floor-to-ceiling windows, golden hour lighting. Aspirational fitness aesthetic, LANDSCAPE orientation 16:9.",
        "Professional lifestyle photography of a successful person traveling at exotic beach destination. Show happy person enjoying tropical paradise, crystal clear water and palm trees in background. Natural outdoor lighting, joyful vacation aesthetic, LANDSCAPE orientation 16:9.",
        "Professional lifestyle photography of a successful person in modern corner office with city skyline view. Show confident professional at desk with laptop, business attire. Large windows showing urban skyline, natural office lighting. Executive success aesthetic, LANDSCAPE orientation 16:9.",
        "Professional lifestyle photography of a successful person enjoying fine dining at elegant restaurant. Show sophisticated person at beautiful table setting with gourmet food. Warm ambient restaurant lighting, luxury dining aesthetic, LANDSCAPE orientation 16:9.",
        "Professional lifestyle photography of a successful person meditating peacefully outdoors at sunrise. Show person in lotus position on deck overlooking ocean or mountains. Soft golden morning light, tranquil wellness aesthetic, LANDSCAPE orientation 16:9.",
        "Professional lifestyle photography of a successful person at luxury rooftop lounge with city skyline. Show stylish person with champagne glass, celebrating success. Evening golden hour lighting, upscale celebration aesthetic, LANDSCAPE orientation 16:9.",
        "Professional lifestyle photography of a successful person working remotely at upscale coffee shop. Show focused person with laptop in modern cafe. Warm ambient coffee shop lighting, entrepreneurial aesthetic, LANDSCAPE orientation 16:9.",
        "Professional automotive photography of luxury sports car (Ferrari, Lamborghini, or Porsche) parked at scenic overlook. Golden hour lighting, beautiful landscape background. High-end aspirational automotive aesthetic, LANDSCAPE orientation 16:9.",
        "Professional real estate photography of stunning modern luxury mansion with pool. Show beautiful contemporary architecture, well-maintained landscaping. Golden hour lighting, upscale dream home aesthetic, LANDSCAPE orientation 16:9.",
        "Professional lifestyle photography of a successful person running outdoors in beautiful park at sunrise. Show energetic person jogging through scenic nature. Golden morning light, active healthy lifestyle aesthetic, LANDSCAPE orientation 16:9.",
        "Professional lifestyle photography of a successful person reading book in cozy modern library. Show thoughtful person surrounded by bookshelves in elegant setting. Warm natural lighting, knowledge growth aesthetic, LANDSCAPE orientation 16:9.",
        "Professional lifestyle photography of a successful person in creative modern art studio. Show inspired person working on creative project with art materials around. Bright natural studio lighting, creative inspiration aesthetic, LANDSCAPE orientation 16:9.",
        "Professional lifestyle photography of a successful person giving presentation on stage at business conference. Show confident speaker engaging audience, professional setting. Stage spotlighting, thought leadership aesthetic, LANDSCAPE orientation 16:9.",
        "Professional lifestyle photography of a successful person at modern tech startup office with multiple monitors. Show innovative person working on cutting-edge technology. Bright modern office lighting, tech innovation aesthetic, LANDSCAPE orientation 16:9.",
        "Professional lifestyle photography of a successful person preparing healthy smoothie bowl in modern kitchen. Show happy person with fresh fruits and nutritious food. Bright natural kitchen lighting, wellness vitality aesthetic, LANDSCAPE orientation 16:9."
      ];

      // Add scenarios based on how many images we need
      for (let i = 0; i < Math.min(numGeminiImages, randomPersonScenarios.length); i++) {
        combinations.push({
          images: [],
          prompt: randomPersonScenarios[i]
        });
      }
    }

    // PRIORITY 1: STANDALONE ASSETS (show the actual dream items)
    // These are important to include even without selfie

    // 1A. Dream Car (standalone or with generic person if no selfie)
    if (hasDreamCar) {
      combinations.push({
        images: [categorizedUploads.dreamCar],
        prompt: "Professional automotive photography of this EXACT luxury car. Show the complete vehicle in a beautiful outdoor setting with golden hour lighting. The car should be the main focus, parked in an upscale location (modern driveway, scenic overlook, or luxury showroom). Maintain the exact car model, brand, and color. High-end automotive photography style, aspirational luxury aesthetic, 4K quality."
      });
    }

    // 1B. Dream House (standalone)
    if (hasDreamHouse) {
      combinations.push({
        images: [categorizedUploads.dreamHouse],
        prompt: "Professional real estate photography of this EXACT dream house. Show the complete property with beautiful architecture clearly visible. Golden hour lighting, well-maintained landscaping, upscale neighborhood setting. Maintain the exact house design and features. High-end architectural photography style, aspirational homeownership aesthetic, 4K quality."
      });
    }

    // 1C. Dream Destination (standalone)
    if (hasDestination) {
      combinations.push({
        images: [categorizedUploads.destination],
        prompt: "Professional travel photography of this EXACT destination. Show the iconic landmarks and beautiful scenery of this location. Natural lighting, vibrant colors, stunning composition. Maintain recognizable features of the destination. High-end travel photography style, wanderlust aesthetic, 4K quality."
      });
    }

    // PRIORITY 2: COMBINED SCENARIOS (user with their dream items)

    // 2A. If has selfie + car: person WITH their car
    if (hasSelfie && hasDreamCar) {
      combinations.push({
        images: [categorizedUploads.selfie, categorizedUploads.dreamCar],
        prompt: "CRITICAL FACE PRESERVATION - EXACT REPLICA REQUIRED:\n\nINPUT IMAGE 1 = REFERENCE FACE (MUST COPY EXACTLY):\n- Copy this EXACT face, facial structure, skin tone, hair style, hair color, eye shape, eye color, nose shape, mouth shape, facial hair, and ALL features\n- DO NOT generate a different person or modify ANY facial features\n- This person's complete identity MUST be preserved 100%\n\nINPUT IMAGE 2 = CAR TO INCLUDE:\n- Include this exact car model and brand\n\nOUTPUT IMAGE REQUIREMENTS:\n- CRITICAL: LANDSCAPE/HORIZONTAL orientation (16:9 aspect ratio) - wider than tall\n- Show the EXACT person from image 1 standing confidently next to the car from image 2\n- Composition: Person and car positioned in frame with scenic background\n- Person's face must be clearly visible, front-facing or 3/4 angle, well-lit\n- Include full head with space above, 3/4 or full body shot\n- Maintain perfect facial accuracy - same person, same face\n- Beautiful outdoor setting, professional photography lighting\n- HORIZONTAL LANDSCAPE FORMAT - Aspirational, high-quality lifestyle aesthetic"
      });
    }

    // 2. If has selfie + house: person AT their dream house
    if (hasSelfie && hasDreamHouse) {
      combinations.push({
        images: [categorizedUploads.selfie, categorizedUploads.dreamHouse],
        prompt: "CRITICAL FACE PRESERVATION - EXACT REPLICA REQUIRED:\n\nINPUT IMAGE 1 = REFERENCE FACE (MUST COPY EXACTLY):\n- Copy this EXACT face, facial structure, skin tone, hair style, hair color, eye shape, eye color, nose shape, mouth shape, facial hair, and ALL features\n- DO NOT generate a different person or modify ANY facial features\n- This person's complete identity MUST be preserved 100%\n\nINPUT IMAGE 2 = HOUSE TO INCLUDE:\n- Include this exact house architecture and design\n\nOUTPUT IMAGE REQUIREMENTS:\n- CRITICAL: LANDSCAPE/HORIZONTAL orientation (16:9 aspect ratio) - wider than tall\n- Show the EXACT person from image 1 in front of the house from image 2, looking proud and successful\n- Composition: Person and house positioned in frame with landscaping\n- Person's face must be clearly visible, front-facing or 3/4 angle, well-lit\n- Include full head with space above, 3/4 or full body shot\n- Maintain perfect facial accuracy - same person, same face\n- Golden hour lighting, professional real estate photography style\n- HORIZONTAL LANDSCAPE FORMAT - Aspirational homeownership aesthetic"
      });
    }

    // 3. If has selfie + destination: person AT destination
    if (hasSelfie && hasDestination) {
      combinations.push({
        images: [categorizedUploads.selfie, categorizedUploads.destination],
        prompt: "CRITICAL FACE PRESERVATION - EXACT REPLICA REQUIRED:\n\nINPUT IMAGE 1 = REFERENCE FACE (MUST COPY EXACTLY):\n- Copy this EXACT face, facial structure, skin tone, hair style, hair color, eye shape, eye color, nose shape, mouth shape, facial hair, and ALL features\n- DO NOT generate a different person or modify ANY facial features\n- This person's complete identity MUST be preserved 100%\n\nINPUT IMAGE 2 = DESTINATION TO INCLUDE:\n- Include this exact destination location and landmarks\n\nOUTPUT IMAGE REQUIREMENTS:\n- CRITICAL: LANDSCAPE/HORIZONTAL orientation (16:9 aspect ratio) - wider than tall\n- Show the EXACT person from image 1 at the destination from image 2, traveling and enjoying the experience\n- Composition: Person positioned in LEFT or RIGHT third of frame, with destination landmarks on the other side\n- Person's face must be clearly visible, front-facing or 3/4 angle, well-lit\n- Include full head with space above, 3/4 or full body shot\n- Maintain perfect facial accuracy - same person, same face\n- Natural outdoor lighting, professional travel photography style\n- HORIZONTAL LANDSCAPE FORMAT - Joyful, adventurous aesthetic"
      });
    }

    // PRIORITY 3: LIFESTYLE SCENARIOS WITH SELFIE (only if user uploaded selfie)
    // These show the user living their best life

    // Add enough lifestyle scenarios to reach required image count
    const maxCombinations = numGeminiImages; // Use template-specific count

    if (combinations.length < maxCombinations && hasSelfie) {
      // PRIORITY 1: User with TRAVEL/ADVENTURE
      combinations.push({
        images: [categorizedUploads.selfie],
        prompt: "CRITICAL FACE PRESERVATION - EXACT REPLICA REQUIRED:\n\nINPUT IMAGE = REFERENCE FACE (MUST COPY EXACTLY):\n- Copy this EXACT face: same facial structure, skin tone, hair (style + color), eyes (shape + color), nose shape, mouth shape, facial hair, jawline, and ALL features\n- DO NOT generate a different person or modify ANY facial features\n- This person's complete identity MUST be preserved 100%\n\nOUTPUT REQUIREMENTS:\n- CRITICAL: LANDSCAPE/HORIZONTAL orientation (16:9 aspect ratio) - wider than tall\n- Show EXACT same person at a beautiful exotic travel destination (beach, mountains, or tropical paradise)\n- Composition: Person positioned in LEFT or RIGHT third of frame, with scenic background on the other side\n- Face clearly visible, front-facing or 3/4 angle, genuine happy smile\n- Include full head with space above, waist-up or full body shot\n- Perfect facial accuracy - same person, same face\n- Casual travel clothing, natural outdoor lighting\n- HORIZONTAL LANDSCAPE FORMAT - Professional travel photography style, joyful adventurous aesthetic"
      });
    }

    if (combinations.length < maxCombinations && hasSelfie) {
      // PRIORITY 2: User with GOOD FOOD/HEALTHY LIFESTYLE
      combinations.push({
        images: [categorizedUploads.selfie],
        prompt: "CRITICAL FACE PRESERVATION - EXACT REPLICA REQUIRED:\n\nINPUT IMAGE = REFERENCE FACE (MUST COPY EXACTLY):\n- Copy this EXACT face: same facial structure, skin tone, hair (style + color), eyes (shape + color), nose shape, mouth shape, facial hair, jawline, and ALL features\n- DO NOT generate a different person or modify ANY facial features\n- This person's complete identity MUST be preserved 100%\n\nOUTPUT REQUIREMENTS:\n- CRITICAL: LANDSCAPE/HORIZONTAL orientation (16:9 aspect ratio) - wider than tall\n- Show EXACT same person enjoying healthy food (smoothie bowl, fresh salad, or preparing nutritious meal)\n- Composition: Person positioned in LEFT or RIGHT third of frame, with food/kitchen on the other side\n- Face clearly visible, front-facing or 3/4 angle, happy healthy expression\n- Include full head with space above, waist-up or upper body shot\n- Perfect facial accuracy - same person, same face\n- Bright clean kitchen or cafe, natural lighting\n- HORIZONTAL LANDSCAPE FORMAT - Professional food photography style, wellness vitality aesthetic"
      });
    }

    if (combinations.length < maxCombinations && hasSelfie) {
      // PRIORITY 3: User in PROFESSIONAL/OFFICE SUCCESS setting
      combinations.push({
        images: [categorizedUploads.selfie],
        prompt: "CRITICAL FACE PRESERVATION - EXACT REPLICA REQUIRED:\n\nINPUT IMAGE = REFERENCE FACE (MUST COPY EXACTLY):\n- Copy this EXACT face: same facial structure, skin tone, hair (style + color), eyes (shape + color), nose shape, mouth shape, facial hair, jawline, and ALL features\n- DO NOT generate a different person or modify ANY facial features\n- This person's complete identity MUST be preserved 100%\n\nOUTPUT REQUIREMENTS:\n- CRITICAL: LANDSCAPE/HORIZONTAL orientation (16:9 aspect ratio) - wider than tall\n- Show EXACT same person working in professional office, laptop at modern workspace\n- Composition: Person positioned in LEFT or RIGHT third of frame, with office/windows on the other side\n- Face clearly visible, front-facing or 3/4 angle, confident professional expression\n- Include full head with space above, waist-up seated shot\n- Perfect facial accuracy - same person, same face\n- Business attire (suit/blazer), modern office with windows\n- HORIZONTAL LANDSCAPE FORMAT - Professional corporate photography style, success confidence aesthetic"
      });
    }

    if (combinations.length < maxCombinations && hasSelfie) {
      // PRIORITY 4: User AT LUXURY ROOFTOP
      combinations.push({
        images: [categorizedUploads.selfie],
        prompt: "CRITICAL FACE PRESERVATION - EXACT REPLICA REQUIRED:\n\nINPUT IMAGE = REFERENCE FACE (MUST COPY EXACTLY):\n- Copy this EXACT face: same facial structure, skin tone, hair (style + color), eyes (shape + color), nose shape, mouth shape, facial hair, jawline, and ALL features\n- DO NOT generate a different person or modify ANY facial features\n- This person's complete identity MUST be preserved 100%\n\nOUTPUT REQUIREMENTS:\n- CRITICAL: LANDSCAPE/HORIZONTAL orientation (16:9 aspect ratio) - wider than tall\n- Show EXACT same person at stylish rooftop or penthouse with city skyline view\n- Composition: Person positioned in LEFT or RIGHT third of frame, with city skyline on the other side\n- Face clearly visible, front-facing or 3/4 angle, successful confident smile\n- Include full head with space above, waist-up or 3/4 body shot\n- Perfect facial accuracy - same person, same face\n- Smart casual or semi-formal attire, evening golden hour lighting\n- HORIZONTAL LANDSCAPE FORMAT - Professional lifestyle photography style, luxury success aesthetic"
      });
    }

    if (combinations.length < maxCombinations && hasSelfie) {
      // PRIORITY 5: User doing FITNESS/GYM workout
      combinations.push({
        images: [categorizedUploads.selfie],
        prompt: "CRITICAL FACE PRESERVATION - EXACT REPLICA REQUIRED:\n\nINPUT IMAGE = REFERENCE FACE (MUST COPY EXACTLY):\n- Copy this EXACT face: same facial structure, skin tone, hair (style + color), eyes (shape + color), nose shape, mouth shape, facial hair, jawline, and ALL features\n- DO NOT generate a different person or modify ANY facial features\n- This person's complete identity MUST be preserved 100%\n\nOUTPUT REQUIREMENTS:\n- CRITICAL: LANDSCAPE/HORIZONTAL orientation (16:9 aspect ratio) - wider than tall\n- Show EXACT same person working out at modern luxury gym with floor-to-ceiling windows, doing strength training with dumbbells\n- Composition: Person positioned in LEFT or RIGHT third of frame, with gym equipment/windows on the other side\n- Face clearly visible, front-facing or 3/4 angle, focused determined expression\n- Include full head with space above, upper body or 3/4 body fitness shot\n- Perfect facial accuracy - same person, same face\n- Athletic wear, gym with natural lighting\n- HORIZONTAL LANDSCAPE FORMAT - Professional fitness photography style, strength confidence aesthetic"
      });
    }

    if (combinations.length < maxCombinations && hasSelfie) {
      // PRIORITY 6: User at UPSCALE CELEBRATION
      combinations.push({
        images: [categorizedUploads.selfie],
        prompt: "CRITICAL FACE PRESERVATION - EXACT REPLICA REQUIRED:\n\nINPUT IMAGE = REFERENCE FACE (MUST COPY EXACTLY):\n- Copy this EXACT face: same facial structure, skin tone, hair (style + color), eyes (shape + color), nose shape, mouth shape, facial hair, jawline, and ALL features\n- DO NOT generate a different person or modify ANY facial features\n- This person's complete identity MUST be preserved 100%\n\nOUTPUT REQUIREMENTS:\n- CRITICAL: LANDSCAPE/HORIZONTAL orientation (16:9 aspect ratio) - wider than tall\n- Show EXACT same person at upscale champagne bar/rooftop lounge, raising champagne glass in celebratory toast\n- Composition: Person positioned in LEFT or RIGHT third of frame, with bar/lounge ambiance on the other side\n- Face clearly visible, front-facing or 3/4 angle, genuine happy smile\n- Include full head with space above, waist-up shot with champagne glass\n- Perfect facial accuracy - same person, same face\n- Elegant blazer/formal attire, warm golden ambient lighting\n- HORIZONTAL LANDSCAPE FORMAT - Professional lifestyle photography style, luxury celebration aesthetic"
      });
    }

    if (combinations.length < maxCombinations && hasSelfie) {
      // PRIORITY 7: User doing OUTDOOR MEDITATION/YOGA
      combinations.push({
        images: [categorizedUploads.selfie],
        prompt: "CRITICAL FACE PRESERVATION - EXACT REPLICA REQUIRED:\n\nINPUT IMAGE = REFERENCE FACE (MUST COPY EXACTLY):\n- Copy this EXACT face: same facial structure, skin tone, hair (style + color), eyes (shape + color), nose shape, mouth shape, facial hair, jawline, and ALL features\n- DO NOT generate a different person or modify ANY facial features\n- This person's complete identity MUST be preserved 100%\n\nOUTPUT REQUIREMENTS:\n- CRITICAL: LANDSCAPE/HORIZONTAL orientation (16:9 aspect ratio) - wider than tall\n- Show EXACT same person meditating peacefully outdoors at golden hour sunrise, cross-legged lotus position on deck overlooking mountains/ocean\n- Composition: Person positioned in LEFT or RIGHT third of frame, with scenic mountains/ocean on the other side\n- Face visible (can have eyes closed), peaceful serene expression\n- Include full head with space above, seated meditation full body shot\n- Perfect facial accuracy - same person, same face\n- Comfortable neutral clothing, soft golden morning light\n- HORIZONTAL LANDSCAPE FORMAT - Professional wellness photography style, tranquility mindfulness aesthetic"
      });
    }

    if (combinations.length < maxCombinations && hasSelfie) {
      // PRIORITY 8: User in MODERN OFFICE/WORKING
      combinations.push({
        images: [categorizedUploads.selfie],
        prompt: "CRITICAL FACE PRESERVATION - EXACT REPLICA REQUIRED:\n\nINPUT IMAGE = REFERENCE FACE (MUST COPY EXACTLY):\n- Copy this EXACT face: same facial structure, skin tone, hair (style + color), eyes (shape + color), nose shape, mouth shape, facial hair, jawline, and ALL features\n- DO NOT generate a different person or modify ANY facial features\n- This person's complete identity MUST be preserved 100%\n\nOUTPUT REQUIREMENTS:\n- CRITICAL: LANDSCAPE/HORIZONTAL orientation (16:9 aspect ratio) - wider than tall\n- Show EXACT same person in modern corner office with panoramic city skyline views through floor-to-ceiling windows, at desk with laptop\n- Composition: Person positioned in LEFT or RIGHT third of frame, with city skyline/windows on the other side\n- Face clearly visible, front-facing or 3/4 angle, professional confident expression\n- Include full head with space above, waist-up seated at desk shot\n- Perfect facial accuracy - same person, same face\n- Business attire (suit/blazer), afternoon natural sunlight\n- HORIZONTAL LANDSCAPE FORMAT - Professional corporate photography style, executive success aesthetic"
      });
    }

    // Add more diverse scenarios to reach 15 images for non-grid templates
    if (combinations.length < maxCombinations && hasSelfie) {
      // Additional scenario 1: Reading/Learning
      combinations.push({
        images: [categorizedUploads.selfie],
        prompt: "CRITICAL FACE PRESERVATION - EXACT REPLICA REQUIRED:\n\nINPUT IMAGE = REFERENCE FACE (MUST COPY EXACTLY):\n- Copy this EXACT face: same facial structure, skin tone, hair (style + color), eyes (shape + color), nose shape, mouth shape, facial hair, jawline, and ALL features\n- DO NOT generate a different person or modify ANY facial features\n- This person's complete identity MUST be preserved 100%\n\nOUTPUT REQUIREMENTS:\n- CRITICAL: LANDSCAPE/HORIZONTAL orientation (16:9 aspect ratio) - wider than tall\n- Show EXACT same person reading a book in cozy modern library or bookshelf background\n- Composition: Person positioned in LEFT or RIGHT third of frame, with bookshelves on the other side\n- Face clearly visible, front-facing or 3/4 angle, thoughtful focused expression\n- Include full head with space above, waist-up seated shot\n- Perfect facial accuracy - same person, same face\n- Smart casual attire, warm natural lighting\n- HORIZONTAL LANDSCAPE FORMAT - Professional lifestyle photography style, knowledge growth aesthetic"
      });
    }

    if (combinations.length < maxCombinations && hasSelfie) {
      // Additional scenario 2: Outdoor Running/Jogging
      combinations.push({
        images: [categorizedUploads.selfie],
        prompt: "CRITICAL FACE PRESERVATION - EXACT REPLICA REQUIRED:\n\nINPUT IMAGE = REFERENCE FACE (MUST COPY EXACTLY):\n- Copy this EXACT face: same facial structure, skin tone, hair (style + color), eyes (shape + color), nose shape, mouth shape, facial hair, jawline, and ALL features\n- DO NOT generate a different person or modify ANY facial features\n- This person's complete identity MUST be preserved 100%\n\nOUTPUT REQUIREMENTS:\n- CRITICAL: LANDSCAPE/HORIZONTAL orientation (16:9 aspect ratio) - wider than tall\n- Show EXACT same person jogging outdoors in beautiful park at sunrise, energetic and active\n- Composition: Person positioned in LEFT or RIGHT third of frame, with park scenery on the other side\n- Face clearly visible, front-facing or 3/4 angle, energetic determined expression\n- Include full head with space above, full body or 3/4 body running shot\n- Perfect facial accuracy - same person, same face\n- Athletic running gear, golden morning light\n- HORIZONTAL LANDSCAPE FORMAT - Professional fitness photography style, active healthy aesthetic"
      });
    }

    if (combinations.length < maxCombinations && hasSelfie) {
      // Additional scenario 3: Creative/Art Studio
      combinations.push({
        images: [categorizedUploads.selfie],
        prompt: "CRITICAL FACE PRESERVATION - EXACT REPLICA REQUIRED:\n\nINPUT IMAGE = REFERENCE FACE (MUST COPY EXACTLY):\n- Copy this EXACT face: same facial structure, skin tone, hair (style + color), eyes (shape + color), nose shape, mouth shape, facial hair, jawline, and ALL features\n- DO NOT generate a different person or modify ANY facial features\n- This person's complete identity MUST be preserved 100%\n\nOUTPUT REQUIREMENTS:\n- CRITICAL: LANDSCAPE/HORIZONTAL orientation (16:9 aspect ratio) - wider than tall\n- Show EXACT same person in creative modern workspace/studio with art or design materials\n- Composition: Person positioned in LEFT or RIGHT third of frame, with creative workspace on the other side\n- Face clearly visible, front-facing or 3/4 angle, inspired creative expression\n- Include full head with space above, waist-up or upper body shot\n- Perfect facial accuracy - same person, same face\n- Casual creative attire, bright natural studio lighting\n- HORIZONTAL LANDSCAPE FORMAT - Professional lifestyle photography style, creative inspiration aesthetic"
      });
    }

    if (combinations.length < maxCombinations && hasSelfie) {
      // Additional scenario 4: Coffee Shop/Networking
      combinations.push({
        images: [categorizedUploads.selfie],
        prompt: "CRITICAL FACE PRESERVATION - EXACT REPLICA REQUIRED:\n\nINPUT IMAGE = REFERENCE FACE (MUST COPY EXACTLY):\n- Copy this EXACT face: same facial structure, skin tone, hair (style + color), eyes (shape + color), nose shape, mouth shape, facial hair, jawline, and ALL features\n- DO NOT generate a different person or modify ANY facial features\n- This person's complete identity MUST be preserved 100%\n\nOUTPUT REQUIREMENTS:\n- CRITICAL: LANDSCAPE/HORIZONTAL orientation (16:9 aspect ratio) - wider than tall\n- Show EXACT same person at upscale coffee shop with laptop, working remotely or networking\n- Composition: Person positioned in LEFT or RIGHT third of frame, with cafe ambiance on the other side\n- Face clearly visible, front-facing or 3/4 angle, friendly approachable smile\n- Include full head with space above, waist-up seated shot\n- Perfect facial accuracy - same person, same face\n- Smart casual attire, warm ambient coffee shop lighting\n- HORIZONTAL LANDSCAPE FORMAT - Professional lifestyle photography style, entrepreneurial networking aesthetic"
      });
    }

    if (combinations.length < maxCombinations && hasSelfie) {
      // Additional scenario 5: Evening Dinner/Fine Dining
      combinations.push({
        images: [categorizedUploads.selfie],
        prompt: "CRITICAL FACE PRESERVATION - EXACT REPLICA REQUIRED:\n\nINPUT IMAGE = REFERENCE FACE (MUST COPY EXACTLY):\n- Copy this EXACT face: same facial structure, skin tone, hair (style + color), eyes (shape + color), nose shape, mouth shape, facial hair, jawline, and ALL features\n- DO NOT generate a different person or modify ANY facial features\n- This person's complete identity MUST be preserved 100%\n\nOUTPUT REQUIREMENTS:\n- CRITICAL: LANDSCAPE/HORIZONTAL orientation (16:9 aspect ratio) - wider than tall\n- Show EXACT same person at elegant fine dining restaurant with beautiful table setting\n- Composition: Person positioned in LEFT or RIGHT third of frame, with restaurant ambiance on the other side\n- Face clearly visible, front-facing or 3/4 angle, sophisticated content smile\n- Include full head with space above, waist-up seated at table shot\n- Perfect facial accuracy - same person, same face\n- Formal elegant attire, warm ambient restaurant lighting\n- HORIZONTAL LANDSCAPE FORMAT - Professional lifestyle photography style, luxury dining aesthetic"
      });
    }

    if (combinations.length < maxCombinations && hasSelfie) {
      // Additional scenario 6: Tech/Innovation Lab
      combinations.push({
        images: [categorizedUploads.selfie],
        prompt: "CRITICAL FACE PRESERVATION - EXACT REPLICA REQUIRED:\n\nINPUT IMAGE = REFERENCE FACE (MUST COPY EXACTLY):\n- Copy this EXACT face: same facial structure, skin tone, hair (style + color), eyes (shape + color), nose shape, mouth shape, facial hair, jawline, and ALL features\n- DO NOT generate a different person or modify ANY facial features\n- This person's complete identity MUST be preserved 100%\n\nOUTPUT REQUIREMENTS:\n- CRITICAL: LANDSCAPE/HORIZONTAL orientation (16:9 aspect ratio) - wider than tall\n- Show EXACT same person in modern tech startup office or innovation lab with multiple monitors\n- Composition: Person positioned in LEFT or RIGHT third of frame, with tech workspace on the other side\n- Face clearly visible, front-facing or 3/4 angle, innovative focused expression\n- Include full head with space above, waist-up at workstation shot\n- Perfect facial accuracy - same person, same face\n- Tech startup casual attire, bright modern office lighting\n- HORIZONTAL LANDSCAPE FORMAT - Professional tech photography style, innovation leadership aesthetic"
      });
    }

    if (combinations.length < maxCombinations && hasSelfie) {
      // Additional scenario 7: Public Speaking/Presentation
      combinations.push({
        images: [categorizedUploads.selfie],
        prompt: "CRITICAL FACE PRESERVATION - EXACT REPLICA REQUIRED:\n\nINPUT IMAGE = REFERENCE FACE (MUST COPY EXACTLY):\n- Copy this EXACT face: same facial structure, skin tone, hair (style + color), eyes (shape + color), nose shape, mouth shape, facial hair, jawline, and ALL features\n- DO NOT generate a different person or modify ANY facial features\n- This person's complete identity MUST be preserved 100%\n\nOUTPUT REQUIREMENTS:\n- CRITICAL: LANDSCAPE/HORIZONTAL orientation (16:9 aspect ratio) - wider than tall\n- Show EXACT same person giving presentation on stage at conference or business event\n- Composition: Person positioned in LEFT or RIGHT third of frame, with presentation screen/stage on the other side\n- Face clearly visible, front-facing or 3/4 angle, confident engaging expression\n- Include full head with space above, waist-up or 3/4 body standing shot\n- Perfect facial accuracy - same person, same face\n- Professional business attire, stage spotlighting\n- HORIZONTAL LANDSCAPE FORMAT - Professional event photography style, thought leadership aesthetic"
      });
    }

    // Generate Gemini images from combinations
    console.log(`\n📋 Prepared ${combinations.length} image combinations, will generate ${numGeminiImages} for Gemini`);

    if (useParallelProcessing) {
      // PARALLEL PROCESSING: Split workload evenly across all available API keys
      const numKeys = genaiClients.length;
      const imagesPerKey = Math.ceil(numGeminiImages / numKeys);
      const batches = [];

      for (let i = 0; i < numKeys; i++) {
        const start = i * imagesPerKey;
        const end = Math.min(start + imagesPerKey, numGeminiImages);
        batches.push(combinations.slice(start, end));
      }

      console.log(`🚀 Parallel processing with ${numKeys} API keys:`);
      batches.forEach((batch, i) => {
        console.log(`   Batch ${i + 1}: ${batch.length} images with API key ${i + 1}`);
      });

      // Helper function to generate images with a specific client
      const generateBatch = async (batch: typeof combinations, genai: typeof genai1, batchName: string) => {
        const results: string[] = [];
        for (let i = 0; i < batch.length; i++) {
          console.log(`  [${batchName}] [${i + 1}/${batch.length}] Generating image...`);
          try {
            const combo = batch[i];
            const imageParts = combo.images.map((dataUrl: string) => ({
              inlineData: {
                data: dataUrl.split(",")[1],
                mimeType: "image/jpeg"
              }
            }));

            const aspectRatioPrompt = `${combo.prompt}\n\n🚨 CRITICAL DIMENSIONS REQUIREMENT 🚨:\n- OUTPUT FORMAT: WIDE LANDSCAPE ONLY - NOT PORTRAIT!\n- ASPECT RATIO: 16:9 or 1.78:1 (WIDER than tall)\n- MINIMUM WIDTH: 1600px\n- ORIENTATION: HORIZONTAL/LANDSCAPE (width MUST be 1.78x greater than height)\n- DO NOT generate portrait/vertical images\n- DO NOT generate square images\n- MUST be WIDE LANDSCAPE format like a movie screen or TV\n\nExample valid dimensions:\n- 1920x1080 (16:9)\n- 1600x900 (16:9)\n- 1440x810 (16:9)`;

            const contentParts = imageParts.length > 0
              ? [...imageParts, { text: aspectRatioPrompt }]
              : [{ text: aspectRatioPrompt }];

            const response = await genai.models.generateContent({
              model: "gemini-2.5-flash-image",
              contents: [{
                role: "user",
                parts: contentParts
              }],
              config: { temperature: 0.3, topP: 0.8, topK: 20, maxOutputTokens: 8192 },
            });

            const candidate = response.candidates?.[0];
            if (candidate?.content?.parts) {
              const imagePart = candidate.content.parts.find((part: { inlineData?: { mimeType?: string; data?: string } }) =>
                part.inlineData?.mimeType?.startsWith("image/")
              );
              if (imagePart?.inlineData?.data) {
                results.push(imagePart.inlineData.data);
                console.log(`  [${batchName}] ✓ Generated image ${i + 1} (original size preserved)`);
              }
            }

            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 300));
          } catch (error) {
            console.error(`  [${batchName}] ✗ Error generating image ${i + 1}:`, error);
          }
        }
        return results;
      };

      // Run all batches in parallel
      const allBatchPromises = batches.map((batch, i) =>
        generateBatch(batch, genaiClients[i], `Batch${i + 1}/API${i + 1}`)
      );

      const allResults = await Promise.all(allBatchPromises);

      // Combine results from all batches
      allResults.forEach((results, i) => {
        geminiImages.push(...results);
        console.log(`✅ Batch ${i + 1} complete: ${results.length} images from API key ${i + 1}`);
      });

      console.log(`✅ Parallel processing complete: ${geminiImages.length} total images generated`);
    } else {
      // SEQUENTIAL PROCESSING: Use single API key
      console.log(`📝 Sequential processing with single API key`);
      for (let i = 0; i < Math.min(numGeminiImages, combinations.length); i++) {
        console.log(`  [${i + 1}/${numGeminiImages}] Generating Gemini image ${i + 1}`);
        try {
          const combo = combinations[i];
          const imageParts = combo.images.map((dataUrl: string) => ({
            inlineData: {
              data: dataUrl.split(",")[1],
              mimeType: "image/jpeg"
            }
          }));

          const aspectRatioPrompt = `${combo.prompt}\n\n🚨 CRITICAL DIMENSIONS REQUIREMENT 🚨:\n- OUTPUT FORMAT: WIDE LANDSCAPE ONLY - NOT PORTRAIT!\n- ASPECT RATIO: 16:9 or 1.78:1 (WIDER than tall)\n- MINIMUM WIDTH: 1600px\n- ORIENTATION: HORIZONTAL/LANDSCAPE (width MUST be 1.78x greater than height)\n- DO NOT generate portrait/vertical images\n- DO NOT generate square images\n- MUST be WIDE LANDSCAPE format like a movie screen or TV\n\nExample valid dimensions:\n- 1920x1080 (16:9)\n- 1600x900 (16:9)\n- 1440x810 (16:9)`;

          const contentParts = imageParts.length > 0
            ? [...imageParts, { text: aspectRatioPrompt }]
            : [{ text: aspectRatioPrompt }];

          const response = await genai1.models.generateContent({
            model: "gemini-2.5-flash-image",
            contents: [{
              role: "user",
              parts: contentParts
            }],
            config: { temperature: 0.3, topP: 0.8, topK: 20, maxOutputTokens: 8192 },
          });

          const candidate = response.candidates?.[0];
          if (candidate?.content?.parts) {
            const imagePart = candidate.content.parts.find((part: { inlineData?: { mimeType?: string; data?: string } }) =>
              part.inlineData?.mimeType?.startsWith("image/")
            );
            if (imagePart?.inlineData?.data) {
              geminiImages.push(imagePart.inlineData.data);
              console.log(`  ✓ Generated Gemini image ${i + 1} (original size preserved)`);
            }
          }

          // Reduced delay for Netlify timeout constraints (500ms instead of 1000ms)
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          console.error(`  ✗ Error generating Gemini image ${i + 1}:`, error);
        }
      }
    }

      console.log(`✅ Generated ${geminiImages.length} personalized Gemini images total`);
    } else {
      console.log("\n⏭️  STEP 1/2: Skipping Gemini multi-step generation for AI template (using one-shot instead)");
    }

    // ============================================
    // Use ONLY Gemini images (all personalized)
    // Grid: 8 total, Others: 15 total
    // ============================================
    const allGeneratedImages = [...geminiImages];
    console.log(`\n🎉 Total images generated: ${allGeneratedImages.length} (all personalized with Gemini)`);

    // ============================================
    // STEP 2: Generate inspirational quotes with AI
    // ============================================
    console.log("\n💬 STEP 2/2: Generating inspirational quotes with AI...");

    try {
      // Use Gemini to generate real inspirational quotes based on keywords
      const quotePrompt = `Generate 5 short, powerful, inspirational quotes for a 2025 vision board based on these themes: ${keywords.join(", ")}

Requirements:
- Each quote must be 3-7 words maximum
- Must be motivational and aspirational
- Focus on success, achievement, and dreams
- Use present tense or future tense
- Make them emotionally powerful

Examples of good quotes:
- "Dreams become reality"
- "Success is my destiny"
- "Living my best life"
- "Unstoppable and fearless"

Return ONLY the 5 quotes, one per line, without quotes or numbering.`;

      const quoteResponse = await genai1.models.generateContent({
        model: "gemini-2.0-flash-lite",
        contents: [{
          role: "user",
          parts: [{ text: quotePrompt }]
        }],
        config: { temperature: 0.9, topP: 0.95, topK: 40, maxOutputTokens: 200 },
      });

      const quoteText = quoteResponse.text?.trim() || "";
      const generatedQuotes = quoteText
        .split("\n")
        .filter((q: string) => q.trim().length > 0)
        .map((q: string) => q.trim().replace(/^["']|["']$/g, "")) // Remove quotes if present
        .slice(0, 5);

      allQuotes.push(...generatedQuotes);
      console.log(`✅ Generated ${allQuotes.length} inspirational quotes:`, allQuotes);
    } catch (error) {
      console.error("Error generating quotes:", error);
      // Fallback to keyword-based quotes if AI fails
      const quoteKeywords = keywords.slice(0, 3);
      for (const keyword of quoteKeywords) {
        allQuotes.push(keyword.toUpperCase());
      }
      allQuotes.push("2025 VISION");
      allQuotes.push("DREAM BIG");
    }

    // Return based on template type
    if (selectedTemplate === "ai") {
      // AI-generated collage using Gemini ONE-SHOT (no DALL-E, no multi-step)
      console.log("\n🎨 Creating AI-generated collage with Gemini ONE-SHOT...");
      console.log(`📸 User uploads: selfie=${hasSelfie}, house=${hasDreamHouse}, car=${hasDreamCar}, destination=${hasDestination}`);

      // Collect user uploaded images only
      const userImageParts = [];
      if (hasSelfie) {
        userImageParts.push({
          inlineData: {
            data: categorizedUploads.selfie.split(",")[1],
            mimeType: "image/jpeg"
          }
        });
      }
      if (hasDreamHouse) {
        userImageParts.push({
          inlineData: {
            data: categorizedUploads.dreamHouse.split(",")[1],
            mimeType: "image/jpeg"
          }
        });
      }
      if (hasDreamCar) {
        userImageParts.push({
          inlineData: {
            data: categorizedUploads.dreamCar.split(",")[1],
            mimeType: "image/jpeg"
          }
        });
      }
      if (hasDestination) {
        userImageParts.push({
          inlineData: {
            data: categorizedUploads.destination.split(",")[1],
            mimeType: "image/jpeg"
          }
        });
      }

      console.log(`📸 Using ${userImageParts.length} user images for one-shot generation`);

      // Build magazine-style collage prompt (reference: sample.png)
      const magazinePrompt = hasSelfie
        ? `CREATE A 2025 VISION BOARD COLLAGE - MAGAZINE STYLE

🎨 CANVAS SIZE: 1920x1080 pixels (16:9 landscape)

🚨 CRITICAL - PERSON IDENTITY PRESERVATION:
The FIRST provided image shows a REAL PERSON. This is the user of this vision board.
- Study their face carefully: facial features, skin tone, hair, eye color, nose shape, facial structure
- This EXACT person must appear in 4-6 different photo tiles across the board
- NEVER change their face, ethnicity, age, or core appearance
- ONLY change: clothing, pose, background setting to match different life goals

📸 PERSON SCENARIOS (showing the same person from image 1):
1. EXERCISE/FITNESS: Person working out at gym, doing yoga, or running - active and healthy
2. WEALTH/SUCCESS: Person in elegant business attire or luxury setting - confident and successful
3. TRAVEL/ADVENTURE: Person at beautiful destination (use destination image if provided) - exploring and happy
4. MEDITATION/WELLNESS: Person meditating peacefully or in spa setting - calm and centered
5. CELEBRATION/JOY: Person celebrating, smiling, arms raised - happy and fulfilled
6. PROFESSIONAL: Person in modern office or working on laptop - focused and accomplished

${hasDreamCar ? '🚗 CAR TILE: Include the provided dream car image as one of the photo tiles' : ''}
${hasDreamHouse ? '🏠 HOUSE TILE: Include the provided dream house image as one of the photo tiles' : ''}
${hasDestination ? '🌍 DESTINATION TILE: Include the provided destination image as one of the photo tiles' : ''}

📐 LAYOUT STRUCTURE (Magazine Grid - like sample reference):
- Total: 12-15 rectangular photo tiles in asymmetric grid
- Tile sizes: Mix of large (500x350px), medium (350x250px), small (250x200px)
- Background: Light beige/cream (#f5f1ed)
- Gaps: 10-20px between tiles
- NO borders, NO frames - clean magazine style

🎯 CENTER FOCAL CARD (beige card in center-left area):
- Size: 400-500px wide x 300-350px tall
- Background: Solid tan/beige (#d6c1b1)
- Text layout:
  * Top: Small decorative "+" symbol
  * "Dream Big" (cursive/script font, 36px)
  * "Vision Board" (serif font, 28px)
  * "2025" (bold sans-serif, 72px)
  * Bottom: Small decorative "+" symbol
- All text: White color (#ffffff)

📝 TEXT LABELS (on 3-4 photo tiles):
Add beige rectangular labels in bottom-right corner of select tiles:
- Keywords: ${keywords.slice(0, 4).join(", ").toUpperCase()}
- Style: Sans-serif, bold, uppercase, 14-16px
- Background: rgba(214, 193, 177, 0.85)
- Examples: "WEALTH", "TRAVELLING", "FITNESS", "MEDITATION"

🎨 VISUAL CONSISTENCY:
- All photos of the person must show the SAME face/person (consistent identity)
- Cohesive color palette: beige, tan, warm tones
- Professional lifestyle photography aesthetic
- Modern, clean, aspirational magazine layout
- Natural lighting and realistic scenes

✅ FINAL CHECKLIST:
- [ ] Same person appears in 4-6 tiles with identical facial features
- [ ] Person's ethnicity and appearance preserved across all scenarios
- [ ] Clean rectangular grid (no polaroid frames)
- [ ] Center beige card with "2025 Vision Board" text
- [ ] 3-4 keyword labels on tiles
- [ ] 1920x1080 canvas filled completely
- [ ] Professional magazine aesthetic`
        : `CREATE A 2025 VISION BOARD COLLAGE - MAGAZINE STYLE

🎨 CANVAS SIZE: 1920x1080 pixels (16:9 landscape)

📸 GENERATE LIFESTYLE IMAGERY:
Create 12-15 aspirational lifestyle photos representing these themes:
${keywords.join(", ")}

Include these categories:
- Success and wealth imagery
- Travel and adventure
- Fitness and wellness
- Meditation and mindfulness
- Celebration and joy
- Professional achievement
${hasDreamCar ? '- Include the provided dream car image' : '- Luxury dream car'}
${hasDreamHouse ? '- Include the provided dream house image' : '- Beautiful dream home'}
${hasDestination ? '- Include the provided travel destination' : '- Exotic travel destination'}

📐 LAYOUT STRUCTURE (Magazine Grid):
- Total: 12-15 rectangular photo tiles in asymmetric grid
- Tile sizes: Mix of large (500x350px), medium (350x250px), small (250x200px)
- Background: Light beige/cream (#f5f1ed)
- Gaps: 10-20px between tiles
- NO borders, NO frames - clean magazine style

🎯 CENTER FOCAL CARD (beige card in center-left area):
- Size: 400-500px wide x 300-350px tall
- Background: Solid tan/beige (#d6c1b1)
- Text layout:
  * Top: Small decorative "+" symbol
  * "Dream Big" (cursive/script font, 36px)
  * "Vision Board" (serif font, 28px)
  * "2025" (bold sans-serif, 72px)
  * Bottom: Small decorative "+" symbol
- All text: White color (#ffffff)

📝 TEXT LABELS (on 3-4 photo tiles):
Add beige rectangular labels in bottom-right corner of select tiles:
- Keywords: ${keywords.slice(0, 4).join(", ").toUpperCase()}
- Style: Sans-serif, bold, uppercase, 14-16px
- Background: rgba(214, 193, 177, 0.85)

🎨 VISUAL STYLE:
- Cohesive color palette: beige, tan, warm tones
- Professional lifestyle photography aesthetic
- Modern, clean, aspirational magazine layout
- Natural lighting and realistic scenes

✅ FINAL CHECKLIST:
- [ ] Clean rectangular grid (no polaroid frames)
- [ ] Center beige card with "2025 Vision Board" text
- [ ] 3-4 keyword labels on tiles
- [ ] 1920x1080 canvas filled completely
- [ ] Professional magazine aesthetic`;

      const finalResponse = await genai1.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: [{
          role: "user",
          parts: [
            ...userImageParts,
            { text: magazinePrompt }
          ]
        }],
        config: { temperature: 0.8, topP: 0.9, topK: 40, maxOutputTokens: 8192 },
      });

      const finalCandidate = finalResponse.candidates?.[0];
      if (!finalCandidate?.content?.parts) {
        throw new Error("No final collage generated");
      }

      const finalImagePart = finalCandidate.content.parts.find((part: { inlineData?: { mimeType?: string; data?: string } }) =>
        part.inlineData?.mimeType?.startsWith("image/")
      );

      if (!finalImagePart?.inlineData?.data) {
        throw new Error("No final image data");
      }

      const finalVisionBoard = `data:${finalImagePart.inlineData.mimeType};base64,${finalImagePart.inlineData.data}`;

      console.log("✅ AI-generated magazine-style collage created successfully!");

      return NextResponse.json({
        status: "success",
        template: "ai",
        final_vision_board: finalVisionBoard,
        metadata: {
          generation_method: "gemini_one_shot",
          user_images_provided: userImageParts.length,
          keywords: keywords,
        },
      });
    } else {
      // Return individual images for HTML templates (polaroid, magazine, or grid)
      console.log(`\n🎨 Returning ${allGeneratedImages.length} individual images for template: ${selectedTemplate}`);

      // Images are in original format from Gemini (no cropping)
      const individualImages = allGeneratedImages.map(base64 => `data:image/jpeg;base64,${base64}`);

      return NextResponse.json({
        status: "success",
        template: selectedTemplate,
        individual_images: individualImages,
        quotes: allQuotes,
        metadata: {
          total_images: allGeneratedImages.length,
          gemini_images: geminiImages.length,
          generation_method: "gemini_personalized_only",
        },
      });
    }

  } catch (error: unknown) {
    console.error("❌ Error:", error);

    // Enhanced error logging for debugging
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

    // Check for specific error types
    let errorMessage = "Failed to generate vision board";
    let errorType = "unknown_error";

    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        errorMessage = "Invalid or missing API key. Please check your environment variables.";
        errorType = "api_key_error";
      } else if (error.message.includes("quota") || error.message.includes("rate limit")) {
        errorMessage = "API quota exceeded or rate limit reached. Please try again later.";
        errorType = "quota_error";
      } else if (error.message.includes("network") || error.message.includes("fetch")) {
        errorMessage = "Network error connecting to AI service. Please check your internet connection.";
        errorType = "network_error";
      } else {
        errorMessage = error.message;
        errorType = "api_error";
      }
    }

    return NextResponse.json(
      {
        status: "error",
        error: errorMessage,
        errorType: errorType,
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
