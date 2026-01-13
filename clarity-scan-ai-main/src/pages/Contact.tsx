import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Mail, MapPin, Phone, Send, Loader2, Navigation2, Clock, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().trim().email('Invalid email address').max(255, 'Email must be less than 255 characters'),
  phone: z.string().trim().optional(),
  category: z.string().default('General'),
  subject: z.string().trim().min(1, 'Subject is required').max(200, 'Subject must be less than 200 characters'),
  address: z.string().trim().optional(),
  message: z.string().trim().min(1, 'Message is required').max(2000, 'Message must be less than 2000 characters'),
});

const contactInfo = [
  {
    icon: Mail,
    title: 'Email Us',
    value: 'm.dinesh.it27@gmail.com',
    value2: 'jeyasakthipandiyaraj@gmail.com',
    description: 'Send us an email anytime',
  },
  {
    icon: Phone,
    title: 'Call Us',
    value: '+91 8122129450',
    value2: '+91 9383493906',
    description: 'Mon-Fri 8:30AM-7:30PM EST',
  },
  {
    icon: MapPin,
    title: 'Visit Us',
    value: 'Guduvanchery, Chennai',
    description: 'Tamil nadu, India.',
  },
];

const categories = ['General', 'Support', 'Sales', 'Partnership'];

const faqItems = [
  {
    question: 'How quickly will I receive a response?',
    answer: 'We typically respond to all inquiries within 24-48 business hours. For urgent matters, please indicate so in your message subject.',
  },
  {
    question: 'What information should I include in my message?',
    answer: 'Please include as much detail as possible about your inquiry, including any relevant file names, error messages, or specific features you have questions about.',
  },
  {
    question: 'Do you offer phone support?',
    answer: 'Yes! You can reach us at +91 8122129450 during our business hours: Monday-Friday 9AM-6PM EST, Saturday 10AM-4PM EST.',
  },
  {
    question: 'Can I schedule a demo of NeuroScan AI?',
    answer: 'Absolutely! Please select "Sales" or "Partnership" as your category and mention that you\'d like to schedule a demo in your message.',
  },
  {
    question: 'How do I report a technical issue?',
    answer: 'Select "Support" as your category and provide details about the issue, including when it occurred and any error messages you received.',
  },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'General',
    subject: '',
    address: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate form data
    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit to Formspree
      const response = await fetch('https://formspree.io/f/mbddjyrk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: result.data.name,
          email: result.data.email,
          phone: result.data.phone,
          category: result.data.category,
          subject: result.data.subject,
          address: result.data.address,
          message: result.data.message,
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      toast.success('Message sent successfully!', {
        description: "We'll get back to you as soon as possible.",
      });

      setFormData({ name: '', email: '', phone: '', category: 'General', subject: '', address: '', message: '' });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast.error('Failed to send message', {
        description: 'Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us - NeuroScan AI</title>
        <meta name="description" content="Get in touch with the NeuroScan AI team. We're here to answer your questions about our AI-powered brain tumor detection system." />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />

        <main className="flex-1">
          {/* Header Section with Gradient */}
          <section className="gradient-primary py-8 md:py-12">
            <div className="container mx-auto px-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <Send className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground">Send us a Message</h1>
                  <p className="text-primary-foreground/80 mt-1">We'd love to hear from you. Tell us how we can help!</p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="grid gap-12 lg:grid-cols-3 max-w-6xl mx-auto">
                {/* Contact Form - Takes 2 columns */}
                <div className="lg:col-span-2">
                  <Card className="animate-fade-in">
                    <CardContent className="p-8">
                      <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Category Selection */}
                        <div className="space-y-3">
                          <Label className="text-base font-semibold">What can we help you with?</Label>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {categories.map((cat) => (
                              <button
                                key={cat}
                                type="button"
                                onClick={() => setFormData({ ...formData, category: cat })}
                                className={`py-3 px-4 rounded-lg border-2 font-medium transition-all ${
                                  formData.category === cat
                                    ? 'border-primary bg-primary/10 text-primary'
                                    : 'border-border text-foreground hover:border-primary/50'
                                }`}
                              >
                                {cat}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Name and Email */}
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name *</Label>
                            <Input
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              placeholder="Your full name"
                              className={errors.name ? 'border-destructive' : ''}
                            />
                            {errors.name && (
                              <p className="text-sm text-destructive">{errors.name}</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address *</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="your@email.com"
                              className={errors.email ? 'border-destructive' : ''}
                            />
                            {errors.email && (
                              <p className="text-sm text-destructive">{errors.email}</p>
                            )}
                          </div>
                        </div>

                        {/* Phone and Subject */}
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                              id="phone"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              placeholder="+91 8122129450"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="subject">Subject *</Label>
                            <Input
                              id="subject"
                              name="subject"
                              value={formData.subject}
                              onChange={handleChange}
                              placeholder="How can we help?"
                              className={errors.subject ? 'border-destructive' : ''}
                            />
                            {errors.subject && (
                              <p className="text-sm text-destructive">{errors.subject}</p>
                            )}
                          </div>
                        </div>

                        {/* Address */}
                        <div className="space-y-2">
                          <Label htmlFor="address">Address</Label>
                          <Input
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Your address"
                            className={errors.address ? 'border-destructive' : ''}
                          />
                          {errors.address && (
                            <p className="text-sm text-destructive">{errors.address}</p>
                          )}
                        </div>

                        {/* Message */}
                        <div className="space-y-2">
                          <Label htmlFor="message">Message *</Label>
                          <Textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Tell us more about your inquiry..."
                            rows={5}
                            className={errors.message ? 'border-destructive' : ''}
                          />
                          {errors.message && (
                            <p className="text-sm text-destructive">{errors.message}</p>
                          )}
                        </div>

                        {/* Submit Button */}
                        <Button type="submit" className="w-full gap-2 gradient-primary text-primary-foreground" disabled={isSubmitting}>
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              Send Message
                            </>
                          )}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>

                {/* Contact Information Cards */}
                <div className="space-y-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
                  {/* Email Card */}
                  <Card>
                    <CardContent className="p-6 flex gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                        <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Email Us</h3>
                        <p className="text-foreground font-medium">{contactInfo[0].value}</p>
                        <p className="text-foreground font-medium">{contactInfo[0].value2}</p>
                        <p className="text-sm text-muted-foreground">{contactInfo[0].description}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Phone Card */}
                  <Card>
                    <CardContent className="p-6 flex gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                        <Phone className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Call Us</h3>
                        <p className="text-foreground font-medium">{contactInfo[1].value}</p>
                        <p className="text-foreground font-medium">{contactInfo[1].value2}</p>
                        <p className="text-sm text-muted-foreground">{contactInfo[1].description}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Location Card */}
                  <Card>
                    <CardContent className="p-6 flex gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Visit Us</h3>
                        <p className="text-foreground font-medium">{contactInfo[2].value}</p>
                        <p className="text-sm text-muted-foreground">{contactInfo[2].description}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Business Hours Card */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex gap-3 mb-4">
                        <Clock className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                        <h3 className="font-semibold">Business Hours</h3>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Monday - Friday</span>
                          <span className="font-medium">9:00 AM - 6:00 PM EST</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Saturday</span>
                          <span className="font-medium">10:00 AM - 5:00 PM EST</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Sunday</span>
                          <span className="font-medium">Closed</span>
                        </div>
                      </div>
                      <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-950">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-xs font-medium text-green-700 dark:text-green-400">Currently Open</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-12 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
                  <p className="text-muted-foreground">
                    Find quick answers to common questions about contacting us.
                  </p>
                </div>

                <Accordion type="single" collapsible className="space-y-4">
                  {faqItems.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="bg-card border rounded-lg px-6">
                      <AccordionTrigger className="text-left hover:no-underline">
                        <span className="font-semibold">{item.question}</span>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </section>

          {/* Map and Social Section */}
          <section className="py-0">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    {/* Google Map */}
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62663.77877777778!2d79.85!3d12.85!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52f4d5555c3d85%3A0x6e98caa7c34d1e3e!2sGuduvancheri%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1234567890"
                      title="Guduvancheri Location"
                      className="w-full h-96 border-0"
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                    
                    {/* Spacing with background */}
                    <div className="bg-background py-8"></div>
                    
                    {/* Social Section */}
                    <div className="gradient-primary py-12">
                      <div className="container mx-auto px-6">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                          <div>
                            <h2 className="text-3xl font-bold text-primary-foreground mb-2">
                              Let's stay connected
                            </h2>
                            <p className="text-primary-foreground/80">
                              Follow us for product updates, tips, and community stories.
                            </p>
                          </div>
                          
                          <div className="flex gap-4">
                            <a
                              href="https://facebook.com"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-12 h-12 rounded-lg bg-primary-foreground/20 hover:bg-primary-foreground/30 flex items-center justify-center transition-colors"
                            >
                              <Facebook className="w-5 h-5 text-primary-foreground" />
                            </a>
                            <a
                              href="https://twitter.com"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-12 h-12 rounded-lg bg-primary-foreground/20 hover:bg-primary-foreground/30 flex items-center justify-center transition-colors"
                            >
                              <Twitter className="w-5 h-5 text-primary-foreground" />
                            </a>
                            <a
                              href="https://instagram.com"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-12 h-12 rounded-lg bg-primary-foreground/20 hover:bg-primary-foreground/30 flex items-center justify-center transition-colors"
                            >
                              <Instagram className="w-5 h-5 text-primary-foreground" />
                            </a>
                            <a
                              href="https://linkedin.com"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-12 h-12 rounded-lg bg-primary-foreground/20 hover:bg-primary-foreground/30 flex items-center justify-center transition-colors"
                            >
                              <Linkedin className="w-5 h-5 text-primary-foreground" />
                            </a>
                            <a
                              href="https://youtube.com"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-12 h-12 rounded-lg bg-primary-foreground/20 hover:bg-primary-foreground/30 flex items-center justify-center transition-colors"
                            >
                              <Youtube className="w-5 h-5 text-primary-foreground" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Spacing before footer */}
          <div className="py-12"></div>
        </main>

        <Footer />
      </div>
    </>
  );
}
