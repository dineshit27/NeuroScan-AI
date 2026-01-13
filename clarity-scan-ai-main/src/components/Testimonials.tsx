import { useRef } from 'react';
import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

const testimonials = [
  {
    name: 'Dr. Sarah Chen',
    role: 'Neurologist, Stanford Medical',
    content: 'NeuroScan AI has revolutionized our preliminary screening process. The accuracy and speed of tumor detection has significantly improved our workflow.',
    rating: 5,
    initials: 'SC',
  },
  {
    name: 'Dr. Michael Roberts',
    role: 'Radiologist, Mayo Clinic',
    content: 'An invaluable tool for quick assessments. The detailed reports and confidence scores help us prioritize cases effectively.',
    rating: 5,
    initials: 'MR',
  },
  {
    name: 'Dr. Emily Watson',
    role: 'Research Fellow, MIT',
    content: 'The AI model is remarkably accurate. We\'ve integrated it into our research pipeline for large-scale MRI analysis.',
    rating: 5,
    initials: 'EW',
  },
  {
    name: 'Dr. James Park',
    role: 'Oncologist, Johns Hopkins',
    content: 'Fast, reliable, and incredibly user-friendly. NeuroScan AI provides consistent results that support our diagnostic process.',
    rating: 5,
    initials: 'JP',
  },
];

export function Testimonials() {
  const autoplayPlugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trusted by Medical Professionals
          </h2>
          <p className="text-muted-foreground">
            See what healthcare experts are saying about NeuroScan AI.
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
              {testimonials.map((testimonial, i) => (
                <CarouselItem key={i} className="pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                  <Card 
                    className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/50 h-full relative overflow-hidden"
                  >
                    <CardContent className="p-6">
                      <Quote className="w-8 h-8 text-primary/20 absolute top-4 right-4" />
                      
                      <div className="flex gap-1 mb-4">
                        {Array.from({ length: testimonial.rating }).map((_, j) => (
                          <Star key={j} className="w-4 h-4 fill-warning text-warning" />
                        ))}
                      </div>

                      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                        "{testimonial.content}"
                      </p>

                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-primary/20">
                          <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                            {testimonial.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-sm">{testimonial.name}</p>
                          <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                        </div>
                      </div>
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
  );
}
