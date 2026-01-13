import { Helmet } from 'react-helmet-async';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageCircle, Calendar, Tag, Users, ArrowRight, Bell, Megaphone } from 'lucide-react';

const announcements = [
  {
    title: 'New AI Model Update v2.5',
    description: 'Enhanced accuracy with our latest neural network improvements. Now detecting micro-tumors with 99% precision.',
    date: 'January 8, 2026',
    badge: 'New',
    badgeColor: 'bg-green-500',
  },
  {
    title: 'Scheduled Maintenance',
    description: 'System maintenance on January 15, 2026 from 2 AM - 4 AM EST. Plan your scans accordingly.',
    date: 'January 7, 2026',
    badge: 'Important',
    badgeColor: 'bg-red-500',
  },
  {
    title: 'Holiday Support Hours',
    description: 'Extended support hours during the holiday season. We\'re here to help 24/7.',
    date: 'January 5, 2026',
    badge: 'Info',
    badgeColor: 'bg-blue-500',
  },
];

const discussions = [
  {
    title: 'Best practices for MRI scan preparation',
    author: 'Dinesh M',
    replies: 45,
    views: 1203,
    category: 'Web Developer',
  },
  {
    title: 'Understanding confidence scores in AI analysis',
    author: 'Jeya Sakthi P',
    replies: 38,
    views: 892,
    category: 'AI Stack & Research',
  },
  {
    title: 'Dietary recommendations after tumor detection',
    author: 'Nutritionist Jane',
    replies: 67,
    views: 2156,
    category: 'Health & Wellness',
  },
  {
    title: 'Integration with PACS systems',
    author: 'Admin',
    replies: 23,
    views: 654,
    category: 'Integration',
  },
];

 

const events = [
  {
    title: 'Webinar: Advanced AI in Medical Imaging',
    date: 'January 18, 2026',
    time: '2:00 PM EST',
    type: 'Virtual',
    attendees: 245,
  },
  {
    title: 'Live Q&A with Lead Neurosurgeon',
    date: 'January 22, 2026',
    time: '10:00 AM EST',
    type: 'Virtual',
    attendees: 189,
  },
];

const promotions = [
  {
    title: 'Healthcare Package',
    description: 'Special pricing for medical institutions. Save up to 30% on bulk scan packages.',
    discount: '30% OFF',
    validUntil: 'January 31, 2026',
  },
  {
    title: 'Student Research Program',
    description: 'Free access for academic research. Apply with your institution credentials.',
    discount: 'FREE',
    validUntil: 'Ongoing',
  },
  {
    title: 'Refer & Earn',
    description: 'Refer a healthcare provider and get 3 months of premium features free.',
    discount: '3 Months',
    validUntil: 'February 28, 2026',
  },
];

export default function Community() {
  return (
    <>
      <Helmet>
        <title>Community - NeuroScan AI</title>
        <meta name="description" content="Join the NeuroScan AI community. Stay updated with announcements, join discussions, explore trending topics, and participate in upcoming events." />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />

        <main className="flex-1">
          {/* Hero Section */}
          <section className="gradient-primary py-10 md:py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary-foreground animate-fade-in">
                  Community Hub
                </h1>
                <p className="text-lg text-primary-foreground/80 animate-fade-in">
                  Connect with healthcare professionals, share insights, and stay updated with the latest developments.
                </p>
              </div>
            </div>
          </section>

          {/* Announcements Section */}
          <section className="py-12 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Megaphone className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-3xl font-bold">Announcements</h2>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {announcements.map((announcement, i) => (
                  <Card key={i} className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <CardTitle className="text-lg">{announcement.title}</CardTitle>
                        <Badge className={`${announcement.badgeColor} text-white`}>
                          {announcement.badge}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{announcement.date}</p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{announcement.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Most Discussed & Upcoming Events Section */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="grid gap-12 lg:grid-cols-2">
                {/* Most Discussed Section */}
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <MessageCircle className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold">Most Discussed</h2>
                  </div>
                  <div className="grid gap-4">
                    {discussions.map((discussion, i) => (
                      <Card key={i} className="transition-all duration-300 hover:shadow-lg hover:border-primary/50 cursor-pointer">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg mb-2">{discussion.title}</h3>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>by {discussion.author}</span>
                                <Badge variant="outline">{discussion.category}</Badge>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <MessageCircle className="w-4 h-4" />
                                <span>{discussion.replies} replies</span>
                              </div>
                              <div>{discussion.views.toLocaleString()} views</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Upcoming Events Section */}
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Calendar className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold">Upcoming Events</h2>
                  </div>
                  <div className="grid gap-6 md:grid-cols-1">
                    {events.map((event, i) => (
                      <Card key={i} className="transition-all duration-300 hover:shadow-lg hover:border-primary/50">
                        <CardContent className="p-6">
                          <Badge className="mb-4">{event.type}</Badge>
                          <h3 className="font-semibold text-lg mb-3">{event.title}</h3>
                          <div className="space-y-2 text-sm text-muted-foreground mb-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>{event.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Bell className="w-4 h-4" />
                              <span>{event.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              <span>{event.attendees} registered</span>
                            </div>
                          </div>
                          <Button className="w-full gap-2">
                            Register Now
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Promotions Section */}
          <section className="py-12 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Tag className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-3xl font-bold">Special Promotions</h2>
              </div>
              <div className="grid gap-6 md:grid-cols-3 max-w-5xl">
                {promotions.map((promo, i) => (
                  <Card key={i} className="gradient-primary overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg">
                    <CardContent className="p-6 text-primary-foreground">
                      <div className="text-4xl font-bold mb-3">{promo.discount}</div>
                      <h3 className="font-semibold text-xl mb-2">{promo.title}</h3>
                      <p className="text-primary-foreground/80 mb-4">{promo.description}</p>
                      <div className="text-sm text-primary-foreground/70">
                        Valid until: {promo.validUntil}
                      </div>
                      <Button variant="secondary" className="w-full mt-4 gap-2">
                        Learn More
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
