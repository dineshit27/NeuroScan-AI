import { useCallback, useState } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface MRIUploaderProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
  selectedFile: File | null;
  previewUrl: string | null;
}

const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
const MAX_SIZE_MB = 20;

export function MRIUploader({ 
  onFileSelect, 
  isProcessing, 
  selectedFile, 
  previewUrl 
}: MRIUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    setError(null);

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Please upload a PNG, JPG, or WebP image file.');
      return false;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File size must be less than ${MAX_SIZE_MB}MB.`);
      return false;
    }

    return true;
  };

  const handleFileChange = (file: File) => {
    if (validateFile(file)) {
      onFileSelect(file);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFileChange(file);
      }
    },
    [onFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const clearFile = () => {
    setError(null);
  };

  return (
    <div className="w-full">
      {!previewUrl ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            'relative flex flex-col items-center justify-center w-full min-h-[300px] border-2 border-dashed rounded-xl transition-all duration-300 cursor-pointer group',
            isDragging
              ? 'border-primary bg-primary/5 scale-[1.02]'
              : 'border-border hover:border-primary/50 hover:bg-muted/50',
            isProcessing && 'pointer-events-none opacity-70'
          )}
        >
          <input
            type="file"
            accept={ACCEPTED_TYPES.join(',')}
            onChange={handleInputChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isProcessing}
          />

          <div className="flex flex-col items-center gap-4 p-8 text-center">
            <div className={cn(
              'p-4 rounded-full transition-all duration-300',
              isDragging ? 'bg-primary/20' : 'bg-muted group-hover:bg-primary/10'
            )}>
              <Upload className={cn(
                'w-10 h-10 transition-colors',
                isDragging ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'
              )} />
            </div>

            <div className="space-y-2">
              <p className="text-lg font-medium text-foreground">
                {isDragging ? 'Drop your MRI scan here' : 'Upload MRI Scan'}
              </p>
              <p className="text-sm text-muted-foreground">
                Drag and drop or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Supports: PNG, JPG, WebP (Max {MAX_SIZE_MB}MB)
              </p>
            </div>
          </div>

          {/* Animated border effect */}
          {isDragging && (
            <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 animate-pulse" />
            </div>
          )}
        </div>
      ) : (
        <div className="relative w-full rounded-xl overflow-hidden border border-border bg-card">
          <div className="aspect-square max-h-[400px] w-full flex items-center justify-center bg-muted/30 relative">
            <img
              src={previewUrl}
              alt="MRI Preview"
              className="max-w-full max-h-full object-contain"
            />
            
            {isProcessing && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-3">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-primary/20 rounded-full" />
                    <div className="absolute inset-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                  <p className="text-sm font-medium text-foreground">Analyzing MRI...</p>
                </div>
              </div>
            )}
          </div>

          {!isProcessing && (
            <div className="absolute top-3 right-3">
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 rounded-full shadow-lg"
                onClick={clearFile}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}

          <div className="p-4 border-t border-border bg-card">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <ImageIcon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {selectedFile?.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {selectedFile && (selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 mt-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
          <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}
    </div>
  );
}
