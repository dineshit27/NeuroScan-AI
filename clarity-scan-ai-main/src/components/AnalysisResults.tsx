import { useState } from 'react';
import { ClassificationResult, FOOD_RECOMMENDATIONS } from '@/utils/brainTumorClassifier';
import { generatePDFReport } from '@/utils/pdfReportGenerator';
import { 
  Brain, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Apple, 
  XCircle,
  Activity,
  Download,
  BarChart3,
  Loader2,
  Send,
  Mail,
  Phone
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';

interface AnalysisResultsProps {
  result: ClassificationResult;
  imageUrl: string;
}

const CHART_COLORS = [
  'hsl(199, 89%, 48%)',
  'hsl(172, 66%, 50%)',
  'hsl(142, 71%, 45%)',
  'hsl(38, 92%, 50%)'
];

export function AnalysisResults({ result, imageUrl }: AnalysisResultsProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { tumorDetected, tumorType, confidence, severity, allPredictions, foodRecommendations } = result;
  
  // Use food recommendations from API response or fallback to local ones
  const recommendations = foodRecommendations || FOOD_RECOMMENDATIONS[tumorType] || FOOD_RECOMMENDATIONS['No Tumor'];

  const getSeverityColor = (sev: number) => {
    if (sev < 30) return 'text-success';
    if (sev < 60) return 'text-warning';
    return 'text-destructive';
  };

  const getSeverityLabel = (sev: number) => {
    if (sev < 30) return 'Low';
    if (sev < 60) return 'Moderate';
    return 'High';
  };

  const pieData = allPredictions.map((p, i) => ({
    name: p.label,
    value: Math.round(p.score * 100),
    color: CHART_COLORS[i % CHART_COLORS.length]
  }));

  const barData = allPredictions.map(p => ({
    name: p.label.split(' ')[0],
    confidence: Math.round(p.score * 100)
  }));

  const handleDownloadReport = async () => {
    setIsGeneratingPDF(true);
    try {
      await generatePDFReport({ result, imageUrl });
      toast.success('PDF report downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF report');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleSendViaWhatsApp = async () => {
    if (!phoneNumber.trim()) {
      toast.error('Please enter a phone number');
      return;
    }

    setIsSending(true);
    try {
      const messageText = 
        `🧠 Brain MRI Analysis Report\n\n` +
        `Tumor Detected: ${tumorDetected ? 'Yes' : 'No'}\n` +
        `Type: ${tumorType}\n` +
        `Confidence: ${confidence.toFixed(1)}%\n` +
        `Severity: ${getSeverityLabel(severity)}\n\n` +
        `This is an AI-generated analysis. Please consult a healthcare professional for proper diagnosis.`;

      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Brain MRI Analysis Report',
            text: messageText
          });

          toast.success('Report shared successfully!');
          setIsSendDialogOpen(false);
          setPhoneNumber('');
          setIsSending(false);
          return;
        } catch (shareError: any) {
          if (shareError.name !== 'AbortError') {
            console.log('Web Share API failed, falling back to WhatsApp link');
          } else {
            setIsSending(false);
            return;
          }
        }
      }

      const message = encodeURIComponent(messageText);
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      const whatsappUrl = `https://wa.me/${cleanPhone}?text=${message}`;
      window.open(whatsappUrl, '_blank');
      
      toast.success('WhatsApp opened with text message.');
      setIsSendDialogOpen(false);
      setPhoneNumber('');
    } catch (error) {
      console.error('Error sending via WhatsApp:', error);
      toast.error('Failed to send report');
    } finally {
      setIsSending(false);
    }
  };

  const handleSendViaEmail = async () => {
    if (!email.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSending(true);
    try {
      const emailBody = 
        `Brain MRI Analysis Report\n\n` +
        `Tumor Detected: ${tumorDetected ? 'Yes' : 'No'}\n` +
        `Type: ${tumorType}\n` +
        `Confidence: ${confidence.toFixed(1)}%\n` +
        `Severity: ${getSeverityLabel(severity)} (${severity}/100)\n\n` +
        `All Predictions:\n` +
        allPredictions.map(p => `- ${p.label}: ${(p.score * 100).toFixed(1)}%`).join('\n') +
        `\n\nFood Recommendations:\n` +
        recommendations.map((food, i) => `${i + 1}. ${food}`).join('\n') +
        `\n\nMedical Disclaimer:\n` +
        `This AI-powered analysis is intended for educational and research purposes only. ` +
        `It should not be used as a substitute for professional medical diagnosis, treatment, or advice. ` +
        `Always consult with a qualified healthcare provider for any health concerns.\n\n` +
        `Generated by Clarity Scan AI`;

      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Brain MRI Analysis Report',
            text: emailBody
          });
          toast.success('Report shared successfully!');
          setIsSendDialogOpen(false);
          setEmail('');
          setIsSending(false);
          return;
        } catch (shareError: any) {
          if (shareError.name !== 'AbortError') {
            console.log('Web Share API failed, falling back to mailto');
          } else {
            setIsSending(false);
            return;
          }
        }
      }

      const subject = encodeURIComponent('Brain MRI Analysis Report');
      const body = encodeURIComponent(emailBody);
      
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
      
      toast.success('Email draft opened with text.');
      setIsSendDialogOpen(false);
      setEmail('');
    } catch (error) {
      console.error('Error sending via email:', error);
      toast.error('Failed to send email');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      {/* Main Result Card */}
      <Card className={cn(
        'overflow-hidden border-2',
        tumorDetected ? 'border-destructive/50' : 'border-success/50'
      )}>
        <div className={cn(
          'p-4',
          tumorDetected ? 'gradient-danger' : 'gradient-success'
        )}>
          <div className="flex items-center gap-3 text-primary-foreground">
            {tumorDetected ? (
              <AlertTriangle className="w-8 h-8" />
            ) : (
              <CheckCircle2 className="w-8 h-8" />
            )}
            <div>
              <h3 className="text-xl font-bold">
                {tumorDetected ? 'Abnormality Detected' : 'No Abnormalities Found'}
              </h3>
              <p className="text-sm opacity-90">Analysis complete</p>
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Classification */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                <span className="font-semibold">Classification</span>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold text-foreground">{tumorType}</p>
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Confidence</span>
                    <span className="font-medium">{Math.round(confidence * 100)}%</span>
                  </div>
                  <Progress value={confidence * 100} className="h-2" />
                </div>
              </div>
            </div>

            {/* Severity */}
            {tumorDetected && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  <span className="font-semibold">Severity Assessment</span>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-baseline gap-2">
                    <span className={cn('text-4xl font-bold', getSeverityColor(severity))}>
                      {severity}
                    </span>
                    <span className="text-muted-foreground">/100</span>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={cn('mt-2', getSeverityColor(severity))}
                  >
                    {getSeverityLabel(severity)} Risk
                  </Badge>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Severity = 0.6 × Area Ratio + 0.4 × Confidence
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="w-4 h-4" />
              Confidence Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} layout="vertical">
                  <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                  <YAxis type="category" dataKey="name" width={80} />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Confidence']}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="confidence" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="w-4 h-4" />
              Probability Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Probability']}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Food Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Apple className="w-5 h-5 text-success" />
            Dietary Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2 text-success">
                <CheckCircle2 className="w-4 h-4" />
                Recommended Foods
              </h4>
              <ul className="space-y-2">
                {recommendations.foods.map((food, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-success mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">{food}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2 text-destructive">
                <XCircle className="w-4 h-4" />
                Foods to Limit
              </h4>
              <ul className="space-y-2">
                {recommendations.avoid.map((food, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-destructive mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">{food}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Download Report */}
      <Card className="bg-muted/30">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4">
            <div className="text-center sm:text-left">
              <h4 className="font-semibold">Download Analysis Report</h4>
              <p className="text-sm text-muted-foreground">
                Get a detailed PDF report of your analysis results or share it
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={handleDownloadReport} 
                disabled={isGeneratingPDF} 
                className="gap-2 flex-1"
                variant="default"
              >
                {isGeneratingPDF ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                {isGeneratingPDF ? 'Generating...' : 'Download PDF Report'}
              </Button>

              <Dialog open={isSendDialogOpen} onOpenChange={setIsSendDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2 flex-1">
                    <Send className="w-4 h-4" />
                    Send Report
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Send Analysis Report</DialogTitle>
                    <DialogDescription>
                      Share the report summary via WhatsApp or Email
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Tabs defaultValue="whatsapp" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="whatsapp" className="gap-2">
                        <Phone className="w-4 h-4" />
                        WhatsApp
                      </TabsTrigger>
                      <TabsTrigger value="email" className="gap-2">
                        <Mail className="w-4 h-4" />
                        Email
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="whatsapp" className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="flex gap-2">
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+1234567890"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="flex-1"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Include country code (e.g., +1 for US, +91 for India)
                        </p>
                      </div>
                      <Button 
                        onClick={handleSendViaWhatsApp} 
                        disabled={isSending || !phoneNumber.trim()}
                        className="w-full gap-2"
                      >
                        {isSending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Phone className="w-4 h-4" />
                        )}
                        {isSending ? 'Opening...' : 'Send via WhatsApp'}
                      </Button>
                    </TabsContent>
                    
                    <TabsContent value="email" className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="doctor@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <Button 
                        onClick={handleSendViaEmail} 
                        disabled={isSending || !email.trim()}
                        className="w-full gap-2"
                      >
                        {isSending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Mail className="w-4 h-4" />
                        )}
                        {isSending ? 'Opening...' : 'Send via Email'}
                      </Button>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medical Disclaimer */}
      <Card className="border-warning/50 bg-warning/5">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-foreground">Medical Disclaimer</p>
              <p className="text-muted-foreground mt-1">
                This AI-powered analysis is intended for educational and research purposes only. 
                It should not be used as a substitute for professional medical diagnosis, treatment, 
                or advice. Always consult with a qualified healthcare provider for any health concerns 
                or before making any decisions related to your health or treatment.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
