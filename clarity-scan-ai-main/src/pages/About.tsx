import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Brain, Target, Heart, Users, Award, Lightbulb, Sparkles, Clock4, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
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

const milestones = [
  { year: '2025', title: 'Project Discussion', description: 'Defined clinical goals, data governance, and MRI quality baselines with advisors.' },
  { year: '2026', title: 'Project Development', description: 'Built the MRI ingestion pipeline, interactive UX, and Supabase-backed workflows.' },
  { year: '2026', title: 'Product Deployment', description: 'Shipped the first NeuroScan AI release with monitoring, drift alerts, and user onboarding.' },
];

export default function About() {
  const [activeValue, setActiveValue] = useState(values[0]);
  const [activeMember, setActiveMember] = useState(team[0]);

  return (
    <>
      <Helmet>
        <title>About Us - NeuroScan AI</title>
        <meta name="description" content="Learn about NeuroScan AI's mission to revolutionize brain tumor detection using advanced AI technology. Meet our team and discover our values." />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />

        <main className="flex-1">
          {/* Hero Section */}
          <section className="py-16 md:py-24 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
                  About NeuroScan AI
                </h1>
                <p className="text-lg text-muted-foreground animate-fade-in">
                  We're on a mission to make advanced brain tumor detection accessible to 
                  healthcare providers and patients worldwide through cutting-edge AI technology.
                </p>
              </div>
            </div>
          </section>

          {/* Mission Section */}
          <section className="py-20">
            <div className="container mx-auto px-4">
              <div className="grid gap-12 md:grid-cols-2 items-center max-w-5xl mx-auto">
                <div className="space-y-6 animate-fade-in">
                  <div className="inline-flex p-3 rounded-xl gradient-primary">
                    <Brain className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold">Our Mission</h2>
                  <p className="text-muted-foreground text-lg">
                    Brain tumors affect millions of people worldwide, and early detection is crucial 
                    for successful treatment outcomes. Our mission is to leverage the power of artificial 
                    intelligence to provide fast, accurate, and accessible brain tumor detection.
                  </p>
                  <p className="text-muted-foreground">
                    We believe that advanced medical diagnostics should not be limited by geography 
                    or resources. By providing AI-powered analysis tools, we aim to support healthcare 
                    providers in making faster, more informed decisions.
                  </p>
                </div>
                <Card className="aspect-square flex items-center justify-center bg-muted/50 animate-fade-in">
                  <Brain className="w-32 h-32 text-primary/20" />
                </Card>
              </div>
            </div>
          </section>

          {/* Values Section */}
          <section className="py-20 bg-muted/30">
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
                        {activeValue.title === value.title && (
                          <p className="text-xs font-medium text-primary">Selected</p>
                        )}
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

          {/* Team Section */}
          <section className="py-20">
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

          {/* Timeline Section */}
          <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Journey</h2>
                <p className="text-muted-foreground">
                  Key milestones in our mission to revolutionize brain tumor detection.
                </p>
              </div>

              <div className="max-w-3xl mx-auto space-y-8">
                {milestones.map((milestone, i) => (
                  <div key={i} className="flex gap-6 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                    <div className="flex-shrink-0 w-20 text-right">
                      <span className="text-2xl font-bold text-primary">{milestone.year}</span>
                    </div>
                    <div className="flex-shrink-0 flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-primary" />
                      {i < milestones.length - 1 && <div className="w-0.5 h-full bg-border mt-2" />}
                    </div>
                    <div className="pb-8">
                      <h3 className="font-semibold text-lg">{milestone.title}</h3>
                      <p className="text-muted-foreground">{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-20">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold mb-4">Join Our Mission</h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Experience the future of brain tumor detection with NeuroScan AI.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button asChild size="lg" className="gap-2">
                  <Link to="/detector">
                    Try NeuroScan AI
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/contact">
                    Contact Us
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
