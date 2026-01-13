import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

const faqs = [
  {
    question: 'What is NeuroScan AI?',
    answer: 'NeuroScan AI is an AI-powered brain tumor detection platform that uses Google Gemini Pro Vision to analyze brain MRI scans. It provides rapid preliminary assessments to assist healthcare professionals and researchers.',
  },
  {
    question: 'How accurate is the AI analysis?',
    answer: 'Our AI model achieves high accuracy rates in controlled testing environments. However, results should always be verified by qualified medical professionals. The system is designed to assist, not replace, professional medical diagnosis.',
  },
  {
    question: 'What types of brain tumors can be detected?',
    answer: 'NeuroScan AI is trained to detect several types of brain tumors including Gliomas, Meningiomas, and Pituitary tumors. The system also identifies normal brain scans with no abnormalities.',
  },
  {
    question: 'Is my medical data secure?',
    answer: 'Yes, we take data security very seriously. All uploads are encrypted, and we follow industry-standard security practices. We do not share your medical images or analysis results with third parties.',
  },
  {
    question: 'What image formats are supported?',
    answer: 'We support common image formats including JPEG, PNG, and WebP. For best results, upload high-quality MRI scans. The clearer the image, the more accurate the analysis.',
  },
  {
    question: 'How long does the analysis take?',
    answer: 'Most analyses are completed within 3-5 seconds. The speed may vary depending on image size and server load, but you typically receive results almost instantly.',
  },
  {
    question: 'Can I save my scan history?',
    answer: 'Yes! By creating a free account, you can save all your scan analyses and access them anytime. Your scan history is stored securely and only accessible to you.',
  },
  {
    question: 'Is NeuroScan AI a replacement for medical diagnosis?',
    answer: 'No. NeuroScan AI is designed for educational and research purposes. It should be used as a supplementary tool only. Always consult with qualified healthcare professionals for medical diagnosis and treatment.',
  },
  {
    question: 'What are the dietary recommendations based on?',
    answer: 'Our dietary recommendations are general guidelines based on nutrition research related to brain health. They are not personalized medical advice. Consult a healthcare provider or nutritionist for specific dietary needs.',
  },
  {
    question: 'How can I get support?',
    answer: 'You can reach our support team through the Contact Us page. We typically respond to inquiries within 24-48 business hours.',
  },
];

export default function FAQ() {
  return (
    <>
      <Helmet>
        <title>FAQ - NeuroScan AI</title>
        <meta name="description" content="Frequently asked questions about NeuroScan AI's brain tumor detection system. Learn about accuracy, security, supported formats, and more." />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />

        <main className="flex-1">
          {/* Hero Section */}
          <section className="py-16 md:py-24 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
                  Frequently Asked Questions
                </h1>
                <p className="text-lg text-muted-foreground animate-fade-in">
                  Find answers to common questions about NeuroScan AI and our brain tumor detection technology.
                </p>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-20">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <Accordion type="single" collapsible className="space-y-4">
                  {faqs.map((faq, i) => (
                    <AccordionItem 
                      key={i} 
                      value={`item-${i}`} 
                      className="bg-card border border-border rounded-lg px-6 animate-fade-in"
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      <AccordionTrigger className="text-left hover:no-underline">
                        <span className="font-medium">{faq.question}</span>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Can't find the answer you're looking for? Our team is here to help.
              </p>
              <Button asChild size="lg" className="gap-2">
                <Link to="/contact">
                  Contact Us
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
