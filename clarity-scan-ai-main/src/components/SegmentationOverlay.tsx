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
  onOverlayImageGenerated?: (overlayPngDataUrl: string) => void;
}

export function SegmentationOverlay({
  originalImageUrl,
  imageBase64,
  tumorDetected,
  tumorType,
  onOverlayImageGenerated
}: SegmentationOverlayProps) {
  const [segmentationUrl, setSegmentationUrl] = useState<string | null>(null);
  const [overlayExportUrl, setOverlayExportUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const [hasAttempted, setHasAttempted] = useState(false);

  const generateSegmentation = async () => {
    if (!imageBase64 || !tumorDetected) return;
    
    setIsLoading(true);
    setHasAttempted(true);

    const formatInvokeError = async (invokeError: any) => {
      try {
        const ctx = invokeError?.context;
        const status = ctx?.status ?? ctx?.response?.status;

        let rawBody: string | null = null;
        if (typeof ctx?.body === 'string') {
          rawBody = ctx.body;
        } else if (ctx?.response?.clone) {
          rawBody = await ctx.response.clone().text();
        }

        if (rawBody) {
          try {
            const parsed = JSON.parse(rawBody);
            const message = parsed?.error || parsed?.message;
            if (message) return status ? `${message} (HTTP ${status})` : message;
          } catch {
            return status ? `${rawBody} (HTTP ${status})` : rawBody;
          }
        }

        if (invokeError?.message && status) return `${invokeError.message} (HTTP ${status})`;
        return invokeError?.message || 'Failed to generate segmentation';
      } catch {
        return invokeError?.message || 'Failed to generate segmentation';
      }
    };

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
      toast.error('Failed to generate segmentation', {
        description: await formatInvokeError(error)
      });
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

  // Create a downloadable PNG by compositing original + segmentation overlay.
  // If the segmentation image is cross-origin without CORS, canvas export can fail.
  useEffect(() => {
    let isCancelled = false;

    const createOverlayExport = async () => {
      if (!segmentationUrl) {
        setOverlayExportUrl(null);
        return;
      }

      try {
        const loadImage = (src: string) =>
          new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
            img.src = src;
          });

        const [baseImg, overlayImg] = await Promise.all([
          loadImage(originalImageUrl),
          loadImage(segmentationUrl)
        ]);

        const width = baseImg.naturalWidth || baseImg.width;
        const height = baseImg.naturalHeight || baseImg.height;

        if (!width || !height) return;

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(baseImg, 0, 0, width, height);
        ctx.globalAlpha = 0.55;
        ctx.drawImage(overlayImg, 0, 0, width, height);
        ctx.globalAlpha = 1;

        const dataUrl = canvas.toDataURL('image/png');
        if (isCancelled) return;

        setOverlayExportUrl(dataUrl);
        onOverlayImageGenerated?.(dataUrl);
      } catch (error) {
        // Don't toast here to avoid noisy UX; segmentation is still visible even if export fails.
        if (!isCancelled) {
          setOverlayExportUrl(null);
        }
        console.warn('Overlay export generation failed:', error);
      }
    };

    createOverlayExport();

    return () => {
      isCancelled = true;
    };
  }, [originalImageUrl, segmentationUrl, onOverlayImageGenerated]);

  return (
    <div className="space-y-3">
      <div className="relative w-full md:w-64 aspect-square rounded-lg overflow-hidden border border-border bg-muted/30">
        {/* Original Image */}
        <img
          src={originalImageUrl}
          alt="Original MRI"
          className="absolute inset-0 w-full h-full object-contain"
        />
        
        {/* Segmentation Overlay */}
        {segmentationUrl && (
          <img
            src={segmentationUrl}
            alt="Segmented MRI"
            className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${
              showOverlay ? 'opacity-70' : 'opacity-0'
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

        {overlayExportUrl && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={() => {
              const a = document.createElement('a');
              a.href = overlayExportUrl;
              a.download = 'mri-overlay.png';
              a.click();
            }}
          >
            Download PNG
          </Button>
        )}
      </div>
    </div>
  );
}
