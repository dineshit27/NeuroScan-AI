import { supabase } from "@/integrations/supabase/client";

export interface ClassificationResult {
  tumorDetected: boolean;
  tumorType: string;
  confidence: number;
  severity: number;
  description?: string;
  recommendations?: string[];
  affectedRegions?: string[];
  allPredictions: Array<{ label: string; score: number }>;
  foodRecommendations?: { foods: string[]; avoid: string[] };
  analysisSource?: string;
}

// Food recommendations based on tumor type (fallback)
export const FOOD_RECOMMENDATIONS: Record<string, { foods: string[]; avoid: string[] }> = {
  'Glioma': {
    foods: [
      'Leafy greens (spinach, kale)',
      'Berries (blueberries, strawberries)',
      'Fatty fish (salmon, mackerel)',
      'Turmeric and ginger',
      'Green tea',
      'Cruciferous vegetables',
      'Nuts and seeds',
      'Whole grains'
    ],
    avoid: [
      'Processed meats',
      'Refined sugars',
      'Excessive alcohol',
      'Trans fats',
      'Artificial sweeteners'
    ]
  },
  'Meningioma': {
    foods: [
      'Omega-3 rich foods',
      'Colorful vegetables',
      'Lean proteins',
      'Avocados',
      'Olive oil',
      'Legumes',
      'Citrus fruits',
      'Garlic and onions'
    ],
    avoid: [
      'High sodium foods',
      'Saturated fats',
      'Processed foods',
      'Excessive caffeine',
      'Red meat'
    ]
  },
  'Pituitary': {
    foods: [
      'Calcium-rich foods',
      'Vitamin D sources',
      'Protein-rich foods',
      'Iron-rich vegetables',
      'Iodine sources (seaweed)',
      'B-vitamin foods',
      'Probiotic foods',
      'Magnesium-rich foods'
    ],
    avoid: [
      'Soy products (in excess)',
      'Goitrogenic foods',
      'High sugar foods',
      'Alcohol',
      'Processed snacks'
    ]
  },
  'No Tumor': {
    foods: [
      'Balanced Mediterranean diet',
      'Fresh fruits and vegetables',
      'Whole grains',
      'Lean proteins',
      'Healthy fats',
      'Adequate hydration',
      'Probiotic foods',
      'Antioxidant-rich foods'
    ],
    avoid: [
      'Excessive processed foods',
      'High sugar intake',
      'Excessive alcohol',
      'Trans fats'
    ]
  }
};

export const classifyImageWithAPI = async (
  imageBase64: string
): Promise<ClassificationResult> => {
  console.log("Calling brain tumor analysis API...");
  
  const { data, error } = await supabase.functions.invoke('analyze-brain-mri', {
    body: { imageBase64 }
  });

  if (error) {
    console.error("API Error:", error);
    throw new Error(error.message || 'Analysis failed');
  }

  if (data.error) {
    console.error("Analysis Error:", data.error);
    if (data.code === 'RATE_LIMITED') {
      throw new Error('Rate limit exceeded. Please wait a moment and try again.');
    }
    if (data.code === 'PAYMENT_REQUIRED') {
      throw new Error('AI credits depleted. Please add credits to continue.');
    }
    throw new Error(data.error);
  }

  // Ensure food recommendations are present
  if (!data.foodRecommendations) {
    const tumorKey = data.tumorType === 'No Tumor' ? 'No Tumor' : 
                     data.tumorType || 'No Tumor';
    data.foodRecommendations = FOOD_RECOMMENDATIONS[tumorKey] || FOOD_RECOMMENDATIONS['No Tumor'];
  }

  return data as ClassificationResult;
};

export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const loadImage = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};
