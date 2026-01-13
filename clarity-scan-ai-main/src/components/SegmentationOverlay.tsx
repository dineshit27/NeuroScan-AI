import { useState, useEffect } from 'react';
import { Layers, Loader2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SegmentationOverlayProps {
  originalImageUrl: string;
  imageBase64: string | null;
  tumorDetected: boolean;
  tumorType: string;
}

export function SegmentationOverlay({
  originalImageUrl,
  imageBase64,
  tumorDetected,
  tumorType
}: SegmentationOverlayProps) {
  const [segmentationUrl, setSegmentationUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const [hasAttempted, setHasAttempted] = useState(false);

  const generateSegmentation = async () => {
    if (!imageBase64 || !tumorDetected) return;
    
    setIsLoading(true);
    setHasAttempted(true);

    try {
      const { data, error } = await supabase.functions.invoke('segment-brain-tumor', {
        body: {
          imageBase64,
          tumorType,
          tumorDetected
        }
      });

      if (error) throw error;

      if (data.segmentationUrl) {
        setSegmentationUrl(data.segmentationUrl);
        toast.success('Segmentation overlay generated');
      } else {
        toast.info('Could not generate segmentation overlay');
      }
    } catch (error) {
      console.error('Segmentation error:', error);
      toast.error('Failed to generate segmentation');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-generate segmentation when tumor is detected
  useEffect(() => {
    if (tumorDetected && imageBase64 && !hasAttempted) {
      generateSegmentation();
    }
  }, [tumorDetected, imageBase64, hasAttempted]);

  return (
    <div className="space-y-3">
      <div className="relative w-full md:w-64 aspect-square rounded-lg overflow-hidden border border-border bg-muted/30">
        {/* Original Image */}
        <img
          src={originalImageUrl}
          alt="Original MRI"
          className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${
            segmentationUrl && showOverlay ? 'opacity-0' : 'opacity-100'
          }`}
        />
        
        {/* Segmentation Overlay */}
        {segmentationUrl && (
          <img
            src={segmentationUrl}
            alt="Segmented MRI"
            className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${
              showOverlay ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="text-xs text-muted-foreground">Generating overlay...</span>
            </div>
          </div>
        )}

        {/* Tumor indicator border */}
        {tumorDetected && !segmentationUrl && !isLoading && (
          <div className="absolute inset-0 border-4 border-destructive/50 rounded-lg pointer-events-none" />
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          {segmentationUrl ? 'AI Segmentation' : 'Analyzed MRI'}
        </p>
        
        {segmentationUrl && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs gap-1"
            onClick={() => setShowOverlay(!showOverlay)}
          >
            {showOverlay ? (
              <>
                <EyeOff className="w-3 h-3" />
                Hide Overlay
              </>
            ) : (
              <>
                <Eye className="w-3 h-3" />
                Show Overlay
              </>
            )}
          </Button>
        )}

        {tumorDetected && !segmentationUrl && !isLoading && imageBase64 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs gap-1"
            onClick={generateSegmentation}
          >
            <Layers className="w-3 h-3" />
            Generate Overlay
          </Button>
        )}
      </div>
    </div>
  );
}
