import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, CheckCircle, Activity, Stethoscope, Cpu, Shield, BarChart3, TimerReset } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

const steps = [
  {
    image: '/images/upload-mri.svg',
    title: 'Upload Your MRI Scan',
    description: 'Simply drag and drop your brain MRI image or click to select. We support JPEG, PNG, and DICOM formats.',
    details: [
      'Supports multiple image formats',
      'Secure encrypted upload',
      'No size limits for medical images',
    ],
  },
  {
    image: '/images/ai-processing.svg',
    title: 'AI Processing',
    description: 'Our advanced neural network, powered by Google Gemini Pro Vision, analyzes your scan in real-time.',
    details: [
      'Multi-layer deep learning analysis',
      'Pattern recognition algorithms',
      'Trained on thousands of scans',
    ],
  },
  {
    image: '/images/tumor-detection.svg',
    title: 'Tumor Detection',
    description: 'The AI identifies potential tumor regions and classifies them based on characteristics.',
    details: [
      'Detects 4+ tumor types',
      'Confidence scoring',
      'Severity assessment',
    ],
  },
  {
    image: '/images/detailed-report.svg',
    title: 'Detailed Report',
    description: 'Receive a comprehensive analysis report with findings, recommendations, and next steps.',
    details: [
      'Downloadable PDF reports',
      'Visual segmentation overlay',
      'Dietary recommendations',
    ],
  },
];

const tumorTypes = [
  {
    name: 'Glioma',
    description: 'Tumors that occur in the brain and spinal cord, arising from glial cells.',
    severity: 'Variable',
    confidence: 94,
    markers: ['Edema tracking', 'Contrast enhancement', 'Midline shift risk'],
    action: 'Recommend neuro-oncology consult and follow-up MRI in 4-6 weeks.',
  },
  {
    name: 'Meningioma',
    description: 'Tumors that develop from the meninges, the membranes surrounding the brain and spinal cord.',
    severity: 'Benign',
    confidence: 91,
    markers: ['Dural tail sign', 'Calcification probability', 'Mass effect check'],
    action: 'Monitor growth rate; refer to neurosurgery if symptomatic.',
  },
  {
    name: 'Pituitary Tumor',
    description: 'Abnormal growths in the pituitary gland, affecting hormone production.',
    severity: 'Benign',
    confidence: 89,
    markers: ['Optic chiasm proximity', 'Hormonal axis risk', 'Cystic components'],
    action: 'Coordinate with endocrinology; evaluate visual field changes.',
  },
  {
    name: 'No Tumor',
    description: 'Normal brain scan with no detected abnormalities.',
    severity: 'Healthy',
    confidence: 97,
    markers: ['Symmetry preserved', 'No enhancement', 'Stable ventricles'],
    action: 'Continue routine checkups; log as baseline study.',
  },
];

const techPillars = [
  {
    key: 'pipeline',
    title: 'Inference Pipeline',
    description: 'GPU-accelerated preprocessing, segmentation, and classification tuned for sub-5s responses.',
    metrics: [
      { label: 'Avg latency', value: '3.8s' },
      { label: 'Batch throughput', value: '12 scans/min' },
    ],
    highlights: [
      'On-device optimizations reduce cold-start delays',
      'Ensemble voting smooths outlier predictions',
      'Self-checks rerun borderline slices automatically',
    ],
  },
  {
    key: 'safety',
    title: 'Safety & Privacy',
    description: 'Multi-layer safeguards to keep PHI secure while maintaining clinical reliability.',
    metrics: [
      { label: 'Zero-retention uploads', value: 'Enabled' },
      { label: 'Audit events', value: 'Real-time' },
    ],
    highlights: [
      'End-to-end encryption with signed URLs',
      'PHI redaction before model ingestion',
      'Confidence fallbacks route to manual review',
    ],
  },
  {
    key: 'insights',
    title: 'Adaptive Insights',
    description: 'Feedback loops tune the model with clinician-approved annotations and shift detection.',
    metrics: [
      { label: 'Drift alerts', value: 'Continuous' },
      { label: 'Model refresh', value: 'Weekly' },
    ],
    highlights: [
      'Active learning incorporates verified edge cases',
      'Temporal comparison highlights interval changes',
      'Segment overlays exported to PACS-friendly formats',
    ],
  },
];

export default function HowItWorks() {
  const [activeTumor, setActiveTumor] = useState(tumorTypes[0]);
  const [activeTech, setActiveTech] = useState(techPillars[0]);

  const tumorConfidenceTone = useMemo(() => {
    if (activeTumor.confidence >= 95) return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300';
    if (activeTumor.confidence >= 90) return 'bg-amber-500/15 text-amber-700 dark:text-amber-300';
    return 'bg-destructive/10 text-destructive';
  }, [activeTumor.confidence]);

  return (
    <>
      <Helmet>
        <title>How It Works - NeuroScan AI Brain Tumor Detection</title>
        <meta name="description" content="Learn how NeuroScan AI uses advanced AI and deep learning to analyze brain MRI scans and detect tumors with high accuracy. Simple 4-step process explained." />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />

        <main className="flex-1">
          {/* Hero Section */}
          <section className="py-10 md:py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
                  How NeuroScan AI Works
                </h1>
                <p className="text-lg text-muted-foreground animate-fade-in">
                  Our advanced AI system uses state-of-the-art deep learning technology to analyze 
                  brain MRI scans and detect potential tumors with high accuracy.
                </p>
              </div>
            </div>
          </section>

          {/* Process Steps */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="space-y-12">
                {steps.map((step, i) => (
                  <div 
                    key={i} 
                    className={`flex flex-col ${i % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 items-center animate-fade-in`}
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className="flex-1 space-y-4">
                      <div className="inline-flex items-center gap-3">
                        <span className="text-sm font-medium text-primary">Step {i + 1}</span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold">{step.title}</h2>
                      <p className="text-muted-foreground text-lg">{step.description}</p>
                      <ul className="space-y-2">
                        {step.details.map((detail, j) => (
                          <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CheckCircle className="w-4 h-4 text-primary" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex-1">
                      <Card className="aspect-video flex items-center justify-center bg-muted/30 backdrop-blur-md border-2 border-white/20 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-primary/50 hover:bg-muted/40 cursor-pointer group">
                        <img src={step.image} alt={step.title} className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110" />
                      </Card>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Tumor Types */}
          <section className="py-12 md:py-20 gradient-primary">
            <div className="container mx-auto px-4">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary-foreground">
                  Tumor Types We Detect
                </h2>
                <p className="text-primary-foreground/80">
                  Our AI is trained to identify and classify multiple types of brain tumors.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
                {tumorTypes.map((tumor, i) => (
                  <Card
                    key={i}
                    role="button"
                    tabIndex={0}
                    onClick={() => setActiveTumor(tumor)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setActiveTumor(tumor);
                      }
                    }}
                    className={`animate-fade-in transition border-2 cursor-pointer hover:-translate-y-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm ${
                      activeTumor.name === tumor.name ? 'border-white dark:border-slate-700 shadow-lg' : 'border-white/30 dark:border-slate-700/50'
                    }`}
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-foreground dark:text-slate-100">{tumor.name}</CardTitle>
                        <div className="inline-flex px-2 py-1 rounded-full text-[11px] font-medium bg-primary/10 text-primary dark:bg-primary/20">
                          {tumor.severity}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-foreground/70 dark:text-slate-300">{tumor.description}</p>
                      <div className="flex items-center gap-2 text-xs text-foreground/70 dark:text-slate-300">
                        <Activity className="w-4 h-4 text-primary" />
                        Tap to view detection markers
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="max-w-4xl mx-auto mt-10 border-primary/40">
                <CardContent className="p-6 space-y-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Focused assessment</p>
                      <h3 className="text-2xl font-bold">{activeTumor.name}</h3>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${tumorConfidenceTone}`}>
                      Confidence {activeTumor.confidence}%
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Progress value={activeTumor.confidence} className="h-2" />
                    <p className="text-sm text-muted-foreground">Markers the model is weighting most for this scan type:</p>
                    <div className="flex flex-wrap gap-2">
                      {activeTumor.markers.map((marker) => (
                        <span key={marker} className="px-3 py-1 rounded-full bg-muted text-xs font-medium">
                          {marker}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Stethoscope className="w-5 h-5 text-primary" />
                      <span>{activeTumor.action}</span>
                    </div>
                    <Button asChild variant="outline" size="sm" className="gap-2">
                      <Link to="/detector">
                        Run a scan now
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Technology Section */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Our Technology
                  </h2>
                  <p className="text-muted-foreground">
                    Explore how each layer of our stack keeps results fast, accurate, and secure.
                  </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                  <div className="space-y-3">
                    {techPillars.map((pillar) => (
                      <Button
                        key={pillar.key}
                        variant={activeTech.key === pillar.key ? 'default' : 'outline'}
                        className="w-full justify-start gap-3"
                        onClick={() => setActiveTech(pillar)}
                      >
                        {pillar.key === 'pipeline' && <Cpu className="w-5 h-5" />}
                        {pillar.key === 'safety' && <Shield className="w-5 h-5" />}
                        {pillar.key === 'insights' && <BarChart3 className="w-5 h-5" />}
                        {pillar.title}
                      </Button>
                    ))}
                  </div>

                  <Card className="lg:col-span-2 border-primary/40">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center gap-3">
                        <TimerReset className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-xs uppercase tracking-wide text-muted-foreground">Interactive overview</p>
                          <h3 className="text-xl font-semibold">{activeTech.title}</h3>
                        </div>
                      </div>
                      <p className="text-muted-foreground">{activeTech.description}</p>

                      <div className="grid gap-3 sm:grid-cols-2">
                        {activeTech.metrics.map((metric) => (
                          <div key={metric.label} className="p-4 rounded-lg bg-muted">
                            <p className="text-xs text-muted-foreground">{metric.label}</p>
                            <p className="text-lg font-semibold">{metric.value}</p>
                          </div>
                        ))}
                      </div>

                      <ul className="grid gap-2 sm:grid-cols-2">
                        {activeTech.highlights.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle className="w-4 h-4 text-primary mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="flex flex-wrap gap-3">
                        <Button asChild size="sm" className="gap-2">
                          <Link to="/detector">
                            See it in action
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2" asChild>
                          <Link to="/contact">
                            Talk to us about deployment
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-12 md:py-20 gradient-primary">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary-foreground">Ready to Try It?</h2>
              <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
                Upload your MRI scan now and get instant AI-powered analysis results.
              </p>
              <Button asChild size="lg" variant="secondary" className="gap-2">
                <Link to="/detector">
                  Start Analysis
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
