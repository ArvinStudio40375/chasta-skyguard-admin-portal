import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { 
  Home, 
  Building2, 
  Factory, 
  Wrench, 
  FileText, 
  Award,
  Zap 
} from 'lucide-react';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

const iconMap = {
  Home,
  Building2,
  Factory,
  Wrench,
  FileText,
  Award,
  Zap
};

const ServicesSection = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error fetching services:', error);
        } else {
          setServices(data || []);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap] || Zap;
    return <IconComponent className="h-8 w-8 text-primary" />;
  };

  if (loading) {
    return (
      <section id="services" className="py-20 bg-secondary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
              Loading...
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="shadow-card bg-white/50 animate-pulse">
                <CardHeader>
                  <div className="w-8 h-8 bg-muted rounded"></div>
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-5/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="py-20 bg-secondary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4">
            <Zap className="h-4 w-4 mr-2" />
            Layanan Kami
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
            Solusi Lengkap Penangkal Petir
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Dari konsultasi hingga pemasangan dan maintenance, kami menyediakan layanan penangkal petir terlengkap dengan standar internasional
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <Card 
              key={service.id} 
              className="shadow-card hover:shadow-brand transition-all duration-300 hover:-translate-y-2 bg-white border-0"
            >
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
                    {getIcon(service.icon)}
                  </div>
                  <div>
                    <CardTitle className="text-xl text-primary">{service.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-primary rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Butuh Konsultasi Untuk Proyek Anda?</h3>
            <p className="text-white/90 mb-6">
              Tim ahli kami siap membantu menentukan solusi penangkal petir yang tepat untuk kebutuhan Anda
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => {
                  const element = document.querySelector('#contact');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-3 bg-accent-yellow text-accent-yellow-foreground rounded-lg font-semibold hover:bg-accent-yellow/90 transition-colors"
              >
                Konsultasi Gratis
              </button>
              <a 
                href="https://wa.me/628123456789"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors"
              >
                WhatsApp Kami
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;