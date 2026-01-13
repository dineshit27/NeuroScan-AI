// @ts-nocheck
// Supabase Edge Function - Runs on Deno runtime
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const FOOD_RECOMMENDATIONS: Record<string, { foods: string[]; avoid: string[] }> = {
  'Glioma': {
    foods: ['Leafy greens (spinach, kale)', 'Berries (blueberries, strawberries)', 'Fatty fish (salmon, mackerel)', 'Turmeric and ginger', 'Green tea', 'Cruciferous vegetables', 'Nuts and seeds', 'Whole grains'],
    avoid: ['Processed meats', 'Refined sugars', 'Excessive alcohol', 'Trans fats', 'Artificial sweeteners']
  },
  'Meningioma': {
    foods: ['Omega-3 rich foods', 'Colorful vegetables', 'Lean proteins', 'Avocados', 'Olive oil', 'Legumes', 'Citrus fruits', 'Garlic and onions'],
    avoid: ['High sodium foods', 'Saturated fats', 'Processed foods', 'Excessive caffeine', 'Red meat']
  },
  'Pituitary': {
    foods: ['Calcium-rich foods', 'Vitamin D sources', 'Protein-rich foods', 'Iron-rich vegetables', 'Iodine sources (seaweed)', 'B-vitamin foods', 'Probiotic foods', 'Magnesium-rich foods'],
    avoid: ['Soy products (in excess)', 'Goitrogenic foods', 'High sugar foods', 'Alcohol', 'Processed snacks']
  },
  'No Tumor': {
    foods: ['Balanced Mediterranean diet', 'Fresh fruits and vegetables', 'Whole grains', 'Lean proteins', 'Healthy fats', 'Adequate hydration', 'Probiotic foods', 'Antioxidant-rich foods'],
    avoid: ['Excessive processed foods', 'High sugar intake', 'Excessive alcohol', 'Trans fats']
  }
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64 } = await req.json();
    
    if (!imageBase64) {
      throw new Error('No image data provided');
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Analyzing brain MRI image with Gemini Vision...");

    const systemPrompt = `You are an expert medical AI assistant specializing in brain MRI analysis. Analyze the provided brain MRI image and provide a detailed assessment.

IMPORTANT: This is for educational/demonstration purposes only. Always recommend consulting healthcare professionals.

Analyze the image and respond with a JSON object containing:
1. "tumorDetected": boolean - whether any abnormality/tumor is detected
2. "tumorType": string - one of: "Glioma", "Meningioma", "Pituitary", "No Tumor", or "Unknown" if uncertain
3. "confidence": number between 0 and 1 - how confident you are in the assessment
4. "severity": number 0-100 - severity score if tumor detected (0 if no tumor)
5. "description": string - detailed description of findings
6. "recommendations": array of strings - medical recommendations
7. "affectedRegions": array of strings - brain regions affected if any

Respond ONLY with valid JSON, no additional text.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Please analyze this brain MRI scan image and provide your detailed assessment."
              },
              {
                type: "image_url",
                image_url: {
                  url: imageBase64.startsWith('data:') ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ]
          }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: "Rate limit exceeded. Please try again in a moment.",
          code: "RATE_LIMITED"
        }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          error: "AI usage credits depleted. Please add credits to continue.",
          code: "PAYMENT_REQUIRED"
        }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error(`AI analysis failed: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error("No response from AI model");
    }

    console.log("AI Response received, parsing...");

    // Parse the JSON response from the AI
    let analysisResult;
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      // Provide a fallback response
      analysisResult = {
        tumorDetected: false,
        tumorType: "Unknown",
        confidence: 0.5,
        severity: 0,
        description: "Unable to parse analysis. Please ensure you've uploaded a valid brain MRI scan.",
        recommendations: ["Consult a healthcare professional for proper diagnosis"],
        affectedRegions: []
      };
    }

    // Add food recommendations based on tumor type
    const tumorKey = analysisResult.tumorType === "No Tumor" ? "No Tumor" : 
                     analysisResult.tumorType === "Pituitary" ? "Pituitary" :
                     analysisResult.tumorType || "No Tumor";
    
    const foodRecs = FOOD_RECOMMENDATIONS[tumorKey] || FOOD_RECOMMENDATIONS["No Tumor"];

    const result = {
      tumorDetected: analysisResult.tumorDetected ?? false,
      tumorType: analysisResult.tumorType || "Unknown",
      confidence: Math.min(1, Math.max(0, analysisResult.confidence ?? 0.5)),
      severity: Math.min(100, Math.max(0, analysisResult.severity ?? 0)),
      description: analysisResult.description || "Analysis complete.",
      recommendations: analysisResult.recommendations || [],
      affectedRegions: analysisResult.affectedRegions || [],
      foodRecommendations: foodRecs,
      allPredictions: [
        { label: analysisResult.tumorType || "Unknown", score: analysisResult.confidence ?? 0.5 },
        { label: "Other", score: 1 - (analysisResult.confidence ?? 0.5) }
      ],
      analysisSource: "💙 (Gemini Pro Vision)"
    };

    console.log("Analysis complete:", result.tumorType, "Confidence:", result.confidence);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in analyze-brain-mri:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Analysis failed",
      code: "ANALYSIS_ERROR"
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
