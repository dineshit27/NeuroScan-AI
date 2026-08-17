import { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Brain, Sparkles, Zap, ArrowRight, Loader2 } from 'lucide-react';
import { MRIUploader } from '@/components/MRIUploader';
import { AnalysisResults } from '@/components/AnalysisResults';
import { ScanHistory } from '@/components/ScanHistory';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { SegmentationOverlay } from '@/components/SegmentationOverlay';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { classifyImageWithAPI, convertFileToBase64, ClassificationResult } from '@/utils/brainTumorClassifier';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

export default function Detector() {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [overlayPngDataUrl, setOverlayPngDataUrl] = useState<string | null>(null);

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
    setImageBase64(null);
    setOverlayPngDataUrl(null);
  }, []);

  const saveScanToHistory = async (classificationResult: ClassificationResult, imageUrl: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('scan_history')
        .insert([{
          user_id: user.id,
          image_url: imageUrl,
          result: JSON.parse(JSON.stringify(classificationResult)) as Json
        }]);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving scan:', error);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      toast.error('Please upload an MRI scan first');
      return;
    }

    setIsProcessing(true);
    setResult(null);
    setOverlayPngDataUrl(null);

    try {
      const base64 = await convertFileToBase64(selectedFile);
      setImageBase64(base64);
      
      const classificationResult = await classifyImageWithAPI(base64);
      setResult(classificationResult);
      
      if (user && previewUrl) {
        await saveScanToHistory(classificationResult, previewUrl);
      }
      
      toast.success('Analysis complete!', {
        description: classificationResult.tumorDetected 
          ? `Detected: ${classificationResult.tumorType}`
          : 'No abnormalities detected'
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Analysis failed', {
        description: error instanceof Error ? error.message : 'Please try again'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNewScan = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setImageBase64(null);
    setOverlayPngDataUrl(null);
  };

  const handleSelectHistoryScan = (scan: { image_url: string | null; result: ClassificationResult }) => {
    if (scan.image_url) {
      setPreviewUrl(scan.image_url);
      setImageBase64(null);
    }
    setResult(scan.result);
    setOverlayPngDataUrl(null);
  };

  return (
    <>
      <Helmet>
        <title>Brain Tumor Detector - NeuroScan AI</title>
        <meta name="description" content="Upload your brain MRI scan for instant AI-powered tumor detection and analysis using Google Gemini Pro Vision." />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />

        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Hero Section when no result */}
            {!result && (
              <div className="text-center space-y-4 mb-8 animate-fade-in">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <Zap className="w-4 h-4" />
                  Powered by Gemini Pro Vision
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  Upload Your MRI Scan
                </h1>
                <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                  Our advanced AI model analyzes brain MRI scans using Google Gemini Pro Vision 
                  for production-grade accuracy and detailed insights.
                </p>
              </div>
            )}

            {/* New Scan Button when result is shown */}
            {result && (
              <div className="flex justify-end animate-fade-in">
                <Button variant="outline" onClick={handleNewScan}>
                  New Scan
                </Button>
              </div>
            )}

            {/* Scan History for logged-in users */}
            {user && !result && (
              <ScanHistory onSelectScan={handleSelectHistoryScan} />
            )}

            {/* Upload Section */}
            {!result && (
              <Card className="animate-fade-in">
                <CardContent className="p-6">
                  <MRIUploader
                    onFileSelect={handleFileSelect}
                    isProcessing={isProcessing}
                    selectedFile={selectedFile}
                    previewUrl={previewUrl}
                  />

                  {selectedFile && !isProcessing && (
                    <div className="mt-6 flex justify-center">
                      <Button 
                        onClick={handleAnalyze} 
                        size="lg" 
                        className="gap-2 px-8"
                      >
                        Analyze with AI
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  )}

                  {isProcessing && (
                    <div className="mt-6 flex flex-col items-center gap-3">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      <p className="text-sm text-muted-foreground">
                        Analyzing with Gemini Pro Vision...
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Results Section */}
            {result && previewUrl && (
              <div className="space-y-6 animate-fade-in">
                {/* Overlay Export */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">Segmentation Overlay</h3>
                        <p className="text-sm text-muted-foreground">
                          {imageBase64
                            ? 'Overlay is generated automatically when a tumor is detected.'
                            : 'Overlay export requires a freshly uploaded scan (history items may not include image data).'}
                        </p>
                      </div>

                      {overlayPngDataUrl && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            const a = document.createElement('a');
                            a.href = overlayPngDataUrl;
                            a.download = 'mri-overlay.png';
                            a.click();
                          }}
                        >
                          Download Overlay PNG
                        </Button>
                      )}
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 items-start">
                      <SegmentationOverlay
                        originalImageUrl={previewUrl}
                        imageBase64={imageBase64}
                        tumorDetected={result.tumorDetected}
                        tumorType={result.tumorType}
                        onOverlayImageGenerated={setOverlayPngDataUrl}
                      />

                      {overlayPngDataUrl && (
                        <div className="w-full md:w-64">
                          <div className="text-xs text-muted-foreground mb-2">Export Preview</div>
                          <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-border bg-muted/30">
                            <img
                              src={overlayPngDataUrl}
                              alt="Overlay export preview"
                              className="absolute inset-0 w-full h-full object-contain"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Analysis Summary Only */}
                <Card>
                  <CardContent className="p-6">
                    <div className="w-full">
                      <div className="flex items-center gap-2 mb-4">
                        <h3 className="text-lg font-semibold">Analysis Summary</h3>
                        <Badge className="text-xs bg-primary/10 text-primary border-0">
                          💙 (Gemini Pro Vision)
                        </Badge>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="p-3 rounded-lg bg-muted/50">
                          <p className="text-xs text-muted-foreground">Status</p>
                          <p className="font-semibold">
                            {result.tumorDetected ? 'Abnormality Detected' : 'Normal'}
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/50">
                          <p className="text-xs text-muted-foreground">Classification</p>
                          <p className="font-semibold">{result.tumorType}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/50">
                          <p className="text-xs text-muted-foreground">Confidence</p>
                          <p className="font-semibold">{Math.round(result.confidence * 100)}%</p>
                        </div>
                        {result.tumorDetected && (
                          <div className="p-3 rounded-lg bg-muted/50">
                            <p className="text-xs text-muted-foreground">Severity</p>
                            <p className="font-semibold">{result.severity}/100</p>
                          </div>
                        )}
                      </div>

                      {result.description && (
                        <div className="mt-4 p-3 rounded-lg bg-muted/50">
                          <p className="text-xs text-muted-foreground mb-1">AI Analysis</p>
                          <p className="text-sm">{result.description}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Detailed Results */}
                <AnalysisResults result={result} imageUrl={previewUrl} />
              </div>
            )}

            {/* Features - only show when no result */}
            {!result && (
              <div className="grid gap-4 md:grid-cols-3 mt-12 animate-fade-in">
                {[
                  {
                    icon: Brain,
                    title: 'Gemini Pro Vision',
                    description: "Powered by Google's most advanced vision AI model"
                  },
                  {
                    icon: Zap,
                    title: 'Real-Time Analysis',
                    description: 'Get detailed results in seconds via cloud API'
                  },
                  {
                    icon: Sparkles,
                    title: 'Detailed Reports',
                    description: 'Comprehensive analysis with dietary recommendations'
                  }
                ].map((feature, i) => (
                  <Card key={i} className="bg-muted/30 backdrop-blur-md border-2 border-primary/30 hover:border-primary transition-all duration-300 hover:scale-105 hover:shadow-lg group cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <div className="inline-flex p-3 rounded-xl bg-primary/10 mb-4 transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
                        <feature.icon className="w-6 h-6 text-primary transition-transform duration-300 group-hover:rotate-12" />
                      </div>
                      <h3 className="font-semibold mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
