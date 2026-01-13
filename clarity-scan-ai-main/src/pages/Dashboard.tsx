import { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Brain, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Scan,
  User,
  ArrowRight,
  Loader2,
  TrendingUp
} from 'lucide-react';
import { format, subDays, startOfDay } from 'date-fns';
import { ClassificationResult } from '@/utils/brainTumorClassifier';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ScanHistoryItem {
  id: string;
  image_url: string | null;
  result: ClassificationResult;
  created_at: string;
}

interface Stats {
  totalScans: number;
  tumorDetected: number;
  healthy: number;
  lastScanDate: string | null;
}

interface ChartDataPoint {
  date: string;
  healthy: number;
  tumor: number;
  total: number;
}

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({
    totalScans: 0,
    tumorDetected: 0,
    healthy: 0,
    lastScanDate: null
  });
  const [recentScans, setRecentScans] = useState<ScanHistoryItem[]>([]);
  const [allScans, setAllScans] = useState<ScanHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const { data, error } = await supabase
        .from('scan_history')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const scans = (data || []).map(item => ({
        ...item,
        result: item.result as unknown as ClassificationResult
      }));

      const tumorCount = scans.filter(s => s.result.tumorDetected).length;

      setStats({
        totalScans: scans.length,
        tumorDetected: tumorCount,
        healthy: scans.length - tumorCount,
        lastScanDate: scans[0]?.created_at || null
      });

      setRecentScans(scans.slice(0, 5));
      setAllScans(scans);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate chart data for the last 30 days
  const chartData = useMemo((): ChartDataPoint[] => {
    const days = 30;
    const data: ChartDataPoint[] = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = startOfDay(subDays(new Date(), i));
      const dateStr = format(date, 'yyyy-MM-dd');
      const displayDate = format(date, 'MMM d');
      
      const scansOnDay = allScans.filter(scan => {
        const scanDate = format(startOfDay(new Date(scan.created_at)), 'yyyy-MM-dd');
        return scanDate === dateStr;
      });
      
      const healthy = scansOnDay.filter(s => !s.result.tumorDetected).length;
      const tumor = scansOnDay.filter(s => s.result.tumorDetected).length;
      
      data.push({
        date: displayDate,
        healthy,
        tumor,
        total: healthy + tumor
      });
    }
    
    return data;
  }, [allScans]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Dashboard | NeuroScan AI</title>
        <meta name="description" content="View your scan statistics, recent activity, and quick actions." />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />

        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {user.user_metadata?.full_name || user.email}
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Scans
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalScans}</div>
                <p className="text-xs text-muted-foreground">All time analyses</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Healthy Results
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.healthy}</div>
                <p className="text-xs text-muted-foreground">No tumor detected</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Tumor Detected
                </CardTitle>
                <AlertCircle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">{stats.tumorDetected}</div>
                <p className="text-xs text-muted-foreground">Requires attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Last Scan
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.lastScanDate 
                    ? format(new Date(stats.lastScanDate), 'MMM d')
                    : 'N/A'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats.lastScanDate 
                    ? format(new Date(stats.lastScanDate), 'yyyy')
                    : 'No scans yet'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Scan Results Chart */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Scan Results Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              {allScans.length === 0 ? (
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground">No scan data yet</p>
                  <p className="text-sm text-muted-foreground">
                    Your scan history will appear here
                  </p>
                </div>
              ) : (
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorHealthy" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="colorTumor" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                        className="text-muted-foreground"
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                        className="text-muted-foreground"
                        allowDecimals={false}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                      />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="healthy" 
                        name="Healthy"
                        stroke="hsl(var(--chart-2))" 
                        fillOpacity={1} 
                        fill="url(#colorHealthy)" 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="tumor" 
                        name="Tumor Detected"
                        stroke="hsl(var(--destructive))" 
                        fillOpacity={1} 
                        fill="url(#colorTumor)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {recentScans.length === 0 ? (
                    <div className="text-center py-8">
                      <Brain className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                      <p className="text-muted-foreground">No scans yet</p>
                      <p className="text-sm text-muted-foreground">
                        Start by uploading an MRI scan
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentScans.map((scan) => (
                        <div
                          key={scan.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              {scan.result.tumorDetected ? (
                                <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                              ) : (
                                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                              )}
                              <span className="font-medium truncate">
                                {scan.result.tumorType}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(scan.created_at), 'MMM d, yyyy • h:mm a')}
                            </p>
                          </div>
                          <div className="text-sm font-medium">
                            {Math.round(scan.result.confidence * 100)}%
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full justify-between" 
                    onClick={() => navigate('/detector')}
                  >
                    <span className="flex items-center gap-2">
                      <Scan className="h-4 w-4" />
                      New Scan
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-between"
                    onClick={() => navigate('/profile')}
                  >
                    <span className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Edit Profile
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-between"
                    onClick={() => navigate('/how-it-works')}
                  >
                    <span className="flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      How It Works
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>

              {/* Accuracy Info */}
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-sm">Model Accuracy</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-bold text-primary">98%</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Classification Accuracy</p>
                      <p className="text-xs text-muted-foreground">
                        Based on validation dataset
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
