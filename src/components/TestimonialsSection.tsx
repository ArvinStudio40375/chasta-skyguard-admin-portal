import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Star, Quote, Building2 } from 'lucide-react';

interface Testimonial {
  id: string;
  client_name: string;
  company?: string;
  message: string;
  rating: number;
}

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching testimonials:', error);
        } else {
          setTestimonials(data || []);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'text-accent-yellow fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <section className="py-20 bg-secondary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
              Loading...
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(4)].map((_, index) => (
              <Card key={index} className="shadow-card animate-pulse">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, starIndex) => (
                      <div key={starIndex} className="w-4 h-4 bg-muted rounded mr-1"></div>
                    ))}
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-5/6"></div>
                    <div className="h-4 bg-muted rounded w-4/6"></div>
                  </div>
                  <div className="h-5 bg-muted rounded w-1/2 mb-1"></div>
                  <div className="h-4 bg-muted rounded w-1/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-secondary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4">
            <Star className="h-4 w-4 mr-2" />
            Testimoni Klien
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
            Apa Kata Klien Kami?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Kepuasan dan kepercayaan klien adalah prioritas utama kami. Berikut testimoni dari berbagai klien yang telah menggunakan jasa kami
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card 
              key={testimonial.id} 
              className="shadow-card hover:shadow-brand transition-all duration-300 hover:-translate-y-2 bg-white border-0 relative overflow-hidden group"
            >
              {/* Quote Icon */}
              <div className="absolute top-4 right-4 text-primary/10 group-hover:text-primary/20 transition-colors">
                <Quote className="h-8 w-8" />
              </div>

              <CardContent className="p-6">
                {/* Rating */}
                <div className="flex items-center mb-4">
                  {renderStars(testimonial.rating)}
                  <span className="ml-2 text-sm text-muted-foreground">
                    {testimonial.rating}/5
                  </span>
                </div>

                {/* Message */}
                <blockquote className="text-muted-foreground leading-relaxed mb-6 relative z-10">
                  "{testimonial.message}"
                </blockquote>

                {/* Client Info */}
                <div className="border-t pt-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                      {testimonial.company ? (
                        <Building2 className="h-5 w-5 text-primary" />
                      ) : (
                        <div className="w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {testimonial.client_name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-primary">
                        {testimonial.client_name}
                      </div>
                      {testimonial.company && (
                        <div className="text-sm text-muted-foreground">
                          {testimonial.company}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-card">
            <div className="flex justify-center mb-4">
              <div className="flex items-center space-x-1">
                {renderStars(5)}
                <span className="ml-2 text-lg font-semibold text-primary">4.9/5</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-primary mb-4">
              Bergabunglah dengan Klien Puas Kami
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Ratusan klien telah mempercayakan keamanan aset mereka kepada kami. 
              Saatnya giliran Anda merasakan pelayanan terbaik dari Chasta SkyGuard.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => {
                  const element = document.querySelector('#contact');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-3 bg-gradient-primary text-white rounded-lg font-semibold hover:shadow-brand transition-all duration-300 hover:scale-105"
              >
                Mulai Konsultasi
              </button>
              <a 
                href="tel:+628123456789"
                className="px-8 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors"
              >
                Hubungi Langsung
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;