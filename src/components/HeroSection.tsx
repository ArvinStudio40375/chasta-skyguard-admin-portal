import { Button } from '@/components/ui/button';
import { Shield, Award, Clock, Users } from 'lucide-react';
import heroImage from '@/assets/hero-lightning-protection.jpg';

const HeroSection = () => {
  const handleContactClick = () => {
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/628123456789?text=Halo%20Chasta%20SkyGuard%2C%20saya%20ingin%20konsultasi%20tentang%20pemasangan%20penangkal%20petir', '_blank');
  };

  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-primary to-primary-dark overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Professional lightning protection installation" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary-dark/70"></div>
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-white">
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-accent-yellow text-accent-yellow-foreground mb-4">
                <Shield className="h-4 w-4 mr-2" />
                Bergaransi & Bersertifikat SNI
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Chasta SkyGuard
              <span className="block text-accent-yellow">Jasa Pemasangan</span>
              <span className="block">Penangkal Petir</span>
              <span className="block text-2xl sm:text-3xl lg:text-4xl font-normal text-white/90">
                Profesional & Bergaransi
              </span>
            </h1>

            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Lindungi rumah, gedung, dan aset Anda dari bahaya sambaran petir dengan sistem berstandar SNI & IEC. 
              Pengalaman 10+ tahun melayani seluruh Indonesia.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button 
                variant="accent" 
                size="xl" 
                onClick={handleContactClick}
                className="shadow-accent"
              >
                Konsultasi Gratis Sekarang
              </Button>
              <Button 
                variant="outline-light" 
                size="xl"
                onClick={handleWhatsAppClick}
              >
                Hubungi WhatsApp
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-white/10 rounded-lg mb-2 mx-auto">
                  <Award className="h-6 w-6 text-accent-yellow" />
                </div>
                <div className="text-2xl font-bold text-white">10+</div>
                <div className="text-sm text-white/80">Tahun Pengalaman</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-white/10 rounded-lg mb-2 mx-auto">
                  <Users className="h-6 w-6 text-accent-yellow" />
                </div>
                <div className="text-2xl font-bold text-white">500+</div>
                <div className="text-sm text-white/80">Proyek Selesai</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-white/10 rounded-lg mb-2 mx-auto">
                  <Shield className="h-6 w-6 text-accent-yellow" />
                </div>
                <div className="text-2xl font-bold text-white">100%</div>
                <div className="text-sm text-white/80">Bergaransi</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-white/10 rounded-lg mb-2 mx-auto">
                  <Clock className="h-6 w-6 text-accent-yellow" />
                </div>
                <div className="text-2xl font-bold text-white">24/7</div>
                <div className="text-sm text-white/80">Support</div>
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-2">Standar SNI & IEC</h3>
              <p className="text-white/80">Instalasi sesuai standar nasional dan internasional dengan sertifikat resmi</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-2">Teknisi Bersertifikat</h3>
              <p className="text-white/80">Tim teknisi profesional dengan sertifikasi dan pengalaman puluhan tahun</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-2">Material Original</h3>
              <p className="text-white/80">Menggunakan material berkualitas tinggi dari supplier terpercaya</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;