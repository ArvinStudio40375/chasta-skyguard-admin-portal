import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { CalendarDays, MapPin, Building, Zap } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface Project {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  location: string;
  completion_date: string;
}

const PortfolioSection = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('completion_date', { ascending: false });

        if (error) {
          console.error('Error fetching projects:', error);
        } else {
          setProjects(data || []);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <section id="portfolio" className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
              Loading...
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="shadow-card animate-pulse">
                <div className="aspect-video bg-muted"></div>
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
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
    <section id="portfolio" className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4">
            <Building className="h-4 w-4 mr-2" />
            Portfolio Proyek
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
            Proyek-Proyek Unggulan Kami
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Beberapa proyek penangkal petir yang telah kami selesaikan dengan standar kualitas tinggi di berbagai lokasi
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Card 
              key={project.id} 
              className="shadow-card hover:shadow-brand transition-all duration-300 hover:-translate-y-2 border-0 overflow-hidden group"
            >
              {/* Project Image Placeholder */}
              <div className="aspect-video bg-gradient-primary relative overflow-hidden">
                {project.image_url ? (
                  <img 
                    src={project.image_url} 
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white">
                    <div className="text-center">
                      <Zap className="h-12 w-12 mx-auto mb-2 opacity-80" />
                      <p className="text-sm opacity-60">Lightning Protection Project</p>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              <CardHeader>
                <CardTitle className="text-xl text-primary line-clamp-2 group-hover:text-primary-light transition-colors">
                  {project.title}
                </CardTitle>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {project.location}
                  </div>
                  <div className="flex items-center">
                    <CalendarDays className="h-4 w-4 mr-1" />
                    {format(new Date(project.completion_date), 'MMM yyyy', { locale: id })}
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                  {project.description}
                </p>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="bg-accent-yellow/10 text-accent-yellow-foreground hover:bg-accent-yellow/20">
                    Selesai
                  </Badge>
                  <div className="text-sm text-primary font-medium">
                    {format(new Date(project.completion_date), 'dd MMM yyyy', { locale: id })}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-secondary rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-primary mb-4">
              Ingin Proyek Anda Menjadi Yang Berikutnya?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Kami siap membantu mewujudkan sistem penangkal petir terbaik untuk bangunan Anda. 
              Konsultasi gratis dan survey lokasi tersedia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => {
                  const element = document.querySelector('#contact');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-3 bg-gradient-primary text-white rounded-lg font-semibold hover:shadow-brand transition-all duration-300 hover:scale-105"
              >
                Mulai Proyek Anda
              </button>
              <a 
                href="https://wa.me/628123456789?text=Halo%20Chasta%20SkyGuard%2C%20saya%20ingin%20bertanya%20tentang%20portfolio%20proyek%20penangkal%20petir"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors"
              >
                Tanya Detail Proyek
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;