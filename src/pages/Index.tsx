import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ServicesSection from '@/components/ServicesSection';
import PortfolioSection from '@/components/PortfolioSection';
import TestimonialsSection from '@/components/TestimonialsSection';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <PortfolioSection />
        <TestimonialsSection />
        
        {/* Contact Section Placeholder */}
        <section id="contact" className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-primary mb-4">Hubungi Kami</h2>
            <p className="text-muted-foreground mb-8">Form konsultasi akan segera hadir</p>
            <a 
              href="https://wa.me/6281221556554" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex px-8 py-3 bg-accent-yellow text-accent-yellow-foreground rounded-lg font-semibold hover:bg-accent-yellow/90 transition-colors"
            >
              WhatsApp: +62 812-2155-6554
            </a>
          </div>
        </section>
      </main>
      
      {/* Footer Placeholder */}
      <footer className="bg-primary text-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2025 Chasta SkyGuard. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;