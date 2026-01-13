import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Brain, Shield, Zap, BarChart3, Sparkles, ClipboardList, Gauge, Target, Heart, Lightbulb, Users, Award, Clock4, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Brain3D } from '@/components/Brain3D';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
const features = [
  {
    icon: Brain,
    title: 'AI-Powered Analysis',
    description: 'Advanced deep learning models trained on thousands of MRI scans for accurate tumor detection.',
  },
  {
    icon: Zap,
    title: 'Instant Results',
    description: 'Get comprehensive analysis results in seconds, not hours.',
  },
  {
    icon: Shield,
    title: 'HIPAA Compliant',
    description: 'Your data is encrypted and protected with industry-leading security standards.',
  },
  {
    icon: BarChart3,
    title: 'Detailed Reports',
    description: 'Comprehensive reports with confidence scores, severity assessment, and recommendations.',
  },
  {
    icon: Sparkles,
    title: 'Adaptive Insights',
    description: 'Model continuously learns from new anonymized cases to improve detection quality.',
  },
  {
    icon: ClipboardList,
    title: 'Clinician-Ready Outputs',
    description: 'Download structured summaries and PACS-friendly overlays for quick handoff to care teams.',
  },
  {
    icon: Gauge,
    title: 'Reliability Guardrails',
    description: 'Built-in quality checks flag low-confidence scans and suggest next best actions.',
  },
];

const stats = [
  { value: '98.5%', label: 'Accuracy Rate' },
  { value: '1K+', label: 'Scans Analyzed' },
  { value: '<5s', label: 'Analysis Time' },
  { value: '24/7', label: 'Availability' },
];

const steps = [
  { step: '01', title: 'Upload MRI Scan', description: 'Simply drag and drop or select your brain MRI scan image.' },
  { step: '02', title: 'AI Analysis', description: 'Our AI model analyzes the scan using advanced neural networks.' },
  { step: '03', title: 'Get Results', description: 'Receive detailed analysis with tumor detection and classification.' },
];

const values = [
  {
    icon: Target,
    title: 'Accuracy First',
    description: 'We prioritize precision in every analysis, understanding the critical nature of medical diagnostics.',
    proof: 'Monthly QA audits benchmark our model against gold-standard annotated datasets.',
  },
  {
    icon: Heart,
    title: 'Patient Care',
    description: 'Every feature we build is designed with patient outcomes and well-being in mind.',
    proof: 'Patient-friendly reports and guided next steps reduce anxiety after scan review.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'We continuously push the boundaries of AI technology to improve diagnostic capabilities.',
    proof: 'We ship model refreshes every sprint with clinician-reviewed edge cases.',
  },
  {
    icon: Users,
    title: 'Accessibility',
    description: 'We believe advanced medical AI should be accessible to healthcare providers worldwide.',
    proof: 'Lightweight deployment profiles run in low-bandwidth environments.',
  },
];

const team = [
  {
    name: 'Dinesh M',
    role: 'Web Designer & Developer',
    bio: 'B.Tech (IT) student at Sri Sairam Institute of Technology, specializing in Design & Development, AI Automation, UI/UX and IoT with hands-on experiences.',
    focus: 'Product Maintance | Development',
    timezone: 'UTC+5:30',
    availability: 'Wed, Thu, Fri',
    profileUrl: 'https://m-dinesh-30.web.app/',
  },
  {
    name: 'Jeya Sakthi P',
    role: 'AI Research & Development',
    bio: 'B.Tech (IT) student at Sri Sairam Institute of Technology, specializing in Web Development, AI Stack and UI/UX.',
    focus: 'Model deployment | Inference Performance',
    timezone: 'UTC+5:30',
    availability: 'Mon, Tue, Wed',
    profileUrl: '',
  },
  {
    name: 'Dr.Kirthika R',
    role: 'Chief Doctor at Stanley Hospital',
    bio: 'Completed MBBS at Stanley Medical College. Medical Service in various hospitals',
    focus: 'Consult | Guidance for NeuroScan',
    timezone: 'UTC+9',
    availability: 'Tue, Thu',
    profileUrl: 'https://www.instagram.com/krithi_sharaj/',
  },
];

export default function Home() {
  const autoplayPlugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );
  const [activeValue, setActiveValue] = useState(values[0]);
  const [activeMember, setActiveMember] = useState(team[0]);

  return (
    <>
      <Helmet>
        <title>NeuroScan AI - Advanced Brain Tumor Detection System</title>
        <meta name="description" content="AI-powered brain tumor detection system using Google Gemini Pro Vision. Upload MRI scans for instant, accurate analysis with detailed reports and recommendations." />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />

        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative overflow-hidden py-8 md:py-12">
            {/* Background Effects */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
              <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse-slow" />
            </div>

            <div className="container mx-auto px-4">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                {/* Left Content */}
                <div className="space-y-8 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium animate-fade-in">
                    <Zap className="w-4 h-4" />
                    Powered by Google Gemini Pro Vision
                  </div>

                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight animate-fade-in">
                    <span className="text-foreground">Detect Brain Tumors</span>
                    <br />
                    <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      With AI Precision
                    </span>
                  </h1>

                  <p className="text-lg md:text-xl text-muted-foreground max-w-xl animate-fade-in">
                    Upload your MRI scan and get instant, accurate analysis powered by advanced 
                    deep learning technology. Supporting medical professionals with AI-driven insights.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-fade-in">
                    <Button asChild size="lg" className="gap-2 px-8">
                      <Link to="/detector">
                        Start Analysis
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                      <Link to="/how-it-works">
                        Learn More
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Right Content - 3D Brain */}
                <div className="hidden lg:block animate-fade-in">
                  <Brain3D />
                </div>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-10 gradient-primary">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, i) => (
                  <div key={i} className="text-center animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                    <div className="text-3xl md:text-4xl font-bold text-primary-foreground">{stat.value}</div>
                    <div className="text-sm text-primary-foreground/80 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-12 md:py-20">
            <div className="container mx-auto px-4">
              <div className="text-center max-w-2xl mx-auto mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Why Choose NeuroScan AI?
                </h2>
                <p className="text-muted-foreground">
                  Cutting-edge technology meets medical expertise for the most accurate brain tumor detection.
                </p>
              </div>

              <div className="px-12">
                <Carousel 
                  opts={{ 
                    align: 'start', 
                    loop: true,
                    dragFree: true,
                  }} 
                  plugins={[autoplayPlugin.current]} 
                  className="w-full"
                >
                  <CarouselContent className="-ml-4">
                    {features.map((feature, i) => (
                      <CarouselItem key={i} className="pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                        <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/50 h-full">
                          <CardContent className="p-6">
                            <div className="inline-flex p-3 rounded-xl bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                              <feature.icon className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>
            </div>
          </section>

          {/* How It Works Preview */}
          <section className="py-12 md:py-20 gradient-primary">
            <div className="container mx-auto px-4">
              <div className="text-center max-w-2xl mx-auto mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary-foreground">
                  How It Works
                </h2>
                <p className="text-primary-foreground/80">
                  Three simple steps to get your brain MRI analysis results.
                </p>
              </div>

              <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
                {steps.map((item, i) => (
                  <div key={i} className="relative animate-fade-in" style={{ animationDelay: `${i * 150}ms` }}>
                    <div className="text-6xl font-bold text-primary-foreground/20 absolute -top-4 left-0">
                      {item.step}
                    </div>
                    <div className="pt-8 pl-4">
                      <h3 className="text-xl font-semibold mb-2 text-primary-foreground">{item.title}</h3>
                      <p className="text-primary-foreground/80">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-12">
                <Button asChild size="lg" variant="secondary">
                  <Link to="/how-it-works" className="gap-2">
                    Learn More About Our Process
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Our Values Section */}
          <section className="py-12 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
                <p className="text-muted-foreground">
                  The principles that guide everything we do at NeuroScan AI.
                </p>
              </div>

              <div className="max-w-5xl mx-auto px-6 md:px-12 space-y-8">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {values.map((value) => (
                    <Card
                      key={value.title}
                      role="button"
                      tabIndex={0}
                      onClick={() => setActiveValue(value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setActiveValue(value);
                        }
                      }}
                      className={`transition border-2 cursor-pointer hover:-translate-y-1 ${
                        activeValue.title === value.title ? 'border-primary shadow-lg bg-primary/5' : 'border-border'
                      }`}
                    >
                      <CardContent className="p-6 text-center space-y-3">
                        <div className="inline-flex p-3 rounded-xl bg-primary/10">
                          <value.icon className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="font-semibold">{value.title}</h3>
                        <p className="text-sm text-muted-foreground">{value.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="border-primary/40">
                  <CardContent className="p-6 space-y-3">
                    <div className="flex items-center gap-3">
                      <Award className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">Value spotlight</p>
                        <h3 className="text-xl font-semibold">{activeValue.title}</h3>
                      </div>
                    </div>
                    <p className="text-muted-foreground">{activeValue.description}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span>{activeValue.proof}</span>
                    </div>
                    <Button asChild size="sm" variant="outline" className="gap-2">
                      <Link to="/contact">
                        Show me how this looks in product
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Our Team Section */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Team</h2>
                <p className="text-muted-foreground">
                  Meet the experts behind NeuroScan AI's groundbreaking technology.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto items-stretch">
                {team.map((member, i) => (
                  <Card
                    key={i}
                    className={`animate-fade-in transition cursor-pointer border-2 hover:-translate-y-1 h-full ${
                      activeMember.name === member.name ? 'border-primary shadow-lg bg-primary/5' : 'border-border'
                    }`}
                    style={{ animationDelay: `${i * 100}ms` }}
                    onClick={() => setActiveMember(member)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setActiveMember(member);
                      }
                    }}
                  >
                    <CardContent className="p-6 h-full flex flex-col">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                        <Users className="w-8 h-8 text-primary" />
                      </div>
                      <div className="text-center space-y-1 flex-1">
                        <h3 className="font-semibold">{member.name}</h3>
                        <p className="text-sm text-primary">{member.role}</p>
                        <p className="text-xs text-muted-foreground">{member.bio}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="max-w-4xl mx-auto mt-10 border-primary/40">
                <CardContent className="p-6 space-y-3">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">Team spotlight</p>
                      <h3 className="text-2xl font-semibold">{activeMember.name}</h3>
                      <p className="text-sm text-primary">{activeMember.role}</p>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Clock4 className="w-4 h-4 text-primary" />
                      <span>Office hours: {activeMember.availability}</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground">{activeMember.bio}</p>
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span>{activeMember.focus}</span>
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{activeMember.timezone}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button asChild size="sm" variant="outline" className="gap-2">
                      <Link to="/contact">
                        Request a consult with {activeMember.name.split(' ')[0]}
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                    {activeMember.profileUrl && (
                      <Button asChild size="sm" className="gap-2" variant="outline">
                        <Link to={activeMember.profileUrl} target="_blank" rel="noreferrer">
                          View profile
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-12 md:py-20 bg-muted/30">
            <div className="container mx-auto px-4">
              <Card className="gradient-primary overflow-hidden">
                <CardContent className="p-8 md:p-16 text-center">
                  <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                    Ready to Get Started?
                  </h2>
                  <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">
                    Upload your first MRI scan and experience the power of AI-driven brain tumor detection.
                  </p>
                  <Button asChild size="lg" variant="secondary" className="gap-2">
                    <Link to="/detector">
                      Start Free Analysis
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
