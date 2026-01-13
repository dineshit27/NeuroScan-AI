import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { History, Trash2, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { ClassificationResult } from '@/utils/brainTumorClassifier';
import { toast } from 'sonner';

interface ScanHistoryItem {
  id: string;
  image_url: string | null;
  result: ClassificationResult;
  created_at: string;
}

interface ScanHistoryProps {
  onSelectScan?: (scan: ScanHistoryItem) => void;
}

export function ScanHistory({ onSelectScan }: ScanHistoryProps) {
  const { user } = useAuth();
  const [scans, setScans] = useState<ScanHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchScans();
    }
  }, [user]);

  const fetchScans = async () => {
    try {
      const { data, error } = await supabase
        .from('scan_history')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setScans((data || []).map(item => ({
        ...item,
        result: item.result as unknown as ClassificationResult
      })));
    } catch (error) {
      console.error('Error fetching scans:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteScan = async (id: string) => {
    try {
      const { error } = await supabase
        .from('scan_history')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setScans(scans.filter(scan => scan.id !== id));
      toast.success('Scan deleted');
    } catch (error) {
      toast.error('Failed to delete scan');
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (scans.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <History className="w-5 h-5" />
            Scan History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            No scans yet. Your analysis history will appear here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <History className="w-5 h-5" />
          Scan History ({scans.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div style={{ maxHeight: `${Math.min(scans.length * 100, 500)}px` }} className="overflow-y-auto">
          <div className="divide-y divide-border">
            {scans.map((scan) => (
              <div
                key={scan.id}
                className="p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => onSelectScan?.(scan)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {scan.result.tumorDetected ? (
                        <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                      )}
                      <span className="font-medium text-sm truncate">
                        {scan.result.tumorType}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(scan.created_at), 'MMM d, yyyy • h:mm a')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Confidence: {Math.round(scan.result.confidence * 100)}%
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 flex-shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteScan(scan.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
