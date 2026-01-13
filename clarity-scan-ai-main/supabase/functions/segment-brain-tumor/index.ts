import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64, tumorType, tumorDetected } = await req.json();

    if (!imageBase64) {
      throw new Error('No image provided');
    }

    if (!tumorDetected) {
      return new Response(
        JSON.stringify({ segmentationUrl: null, message: 'No tumor detected to segment' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    console.log('Generating tumor segmentation overlay...');

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `This is a brain MRI scan with a detected ${tumorType}. Create a segmentation overlay that highlights the tumor region. 
                
Instructions:
- Keep the original MRI image visible
- Add a semi-transparent colored overlay (use red/orange with ~40% opacity) on the suspected tumor region
- Add a subtle glowing outline around the tumor boundary
- The overlay should be medically accurate based on where tumors of this type typically appear
- Make sure the overlay is clearly visible but doesn't obscure important details`
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
        modalities: ["image", "text"]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Segmentation API error:', errorText);
      throw new Error(`Segmentation failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('Segmentation response received');

    const segmentationUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!segmentationUrl) {
      console.log('No segmentation image generated');
      return new Response(
        JSON.stringify({ segmentationUrl: null, message: 'Could not generate segmentation' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ segmentationUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Segmentation error:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage, segmentationUrl: null }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
