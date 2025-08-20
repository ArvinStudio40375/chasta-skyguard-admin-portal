import { Card, CardContent } from '@/components/ui/card';
import { 
  Shield, 
  Award, 
  Users, 
  CheckCircle, 
  Clock,
  Star
} from 'lucide-react';

const AboutSection = () => {
  const achievements = [
    {
      icon: <Users className="h-6 w-6 text-accent-yellow" />,
      number: "500+",
      label: "Proyek Selesai"
    },
    {
      icon: <Award className="h-6 w-6 text-accent-yellow" />,
      number: "10+",
      label: "Tahun Pengalaman"
    },
    {
      icon: <Shield className="h-6 w-6 text-accent-yellow" />,
      number: "100%",
      label: "Bergaransi"
    },
    {
      icon: <Star className="h-6 w-6 text-accent-yellow" />,
      number: "98%",
      label: "Kepuasan Klien"
    }
  ];

  const features = [
    "Teknisi bersertifikat dan berpengalaman 10+ tahun",
    "Material berkualitas tinggi dari supplier terpercaya",
    "Instalasi sesuai standar SNI 03-7015-2004 dan IEC 62305",
    "Garansi resmi untuk semua instalasi",
    "Layanan maintenance dan inspeksi berkala",
    "Konsultasi teknis gratis dan survey lokasi",
    "Harga kompetitif dengan kualitas terjamin",
    "Support 24/7 untuk emergency service"
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div>
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-primary/10 text-primary mb-6">
              <Shield className="h-4 w-4 mr-2" />
              Tentang Kami
            </span>
            
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-6">
              Profesional Penangkal Petir Terpercaya di Indonesia
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              <strong className="text-primary">Chasta SkyGuard</strong> adalah perusahaan spesialis jasa pemasangan penangkal petir 
              yang telah melayani berbagai klien di seluruh Indonesia selama lebih dari 10 tahun. Kami berkomitmen memberikan 
              perlindungan maksimal untuk aset berharga Anda dengan teknologi terdepan dan standar internasional.
            </p>

            <p className="text-muted-foreground mb-8 leading-relaxed">
              Tim teknisi kami terdiri dari profesional bersertifikat yang memiliki pengalaman luas dalam instalasi sistem 
              penangkal petir untuk berbagai jenis bangunan, mulai dari rumah tinggal hingga gedung bertingkat dan fasilitas industri.
            </p>

            {/* Features List */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-accent-yellow mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => {
                  const element = document.querySelector('#contact');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-3 bg-gradient-primary text-white rounded-lg font-semibold hover:shadow-brand transition-all duration-300 hover:scale-105"
              >
                Hubungi Kami Sekarang
              </button>
              <button 
                onClick={() => {
                  const element = document.querySelector('#portfolio');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors"
              >
                Lihat Portfolio
              </button>
            </div>
          </div>

          {/* Stats & Visual */}
          <div className="space-y-8">
            {/* Achievement Cards */}
            <div className="grid grid-cols-2 gap-6">
              {achievements.map((achievement, index) => (
                <Card key={index} className="bg-gradient-primary text-white border-0 shadow-brand">
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-3">
                      {achievement.icon}
                    </div>
                    <div className="text-2xl font-bold mb-1">{achievement.number}</div>
                    <div className="text-sm text-white/80">{achievement.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Company Values */}
            <Card className="bg-secondary border-0 shadow-card">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-primary mb-4 flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Komitmen Kami
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-accent-yellow rounded-full"></div>
                    <span className="text-muted-foreground">Kualitas terbaik dalam setiap instalasi</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-accent-yellow rounded-full"></div>
                    <span className="text-muted-foreground">Pelayanan profesional dan responsif</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-accent-yellow rounded-full"></div>
                    <span className="text-muted-foreground">Transparansi harga dan proses kerja</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-accent-yellow rounded-full"></div>
                    <span className="text-muted-foreground">After-sales service yang memuaskan</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="bg-gradient-accent border-0 text-accent-yellow-foreground">
              <CardContent className="p-6 text-center">
                <Clock className="h-8 w-8 mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Layanan 24/7</h4>
                <p className="text-sm opacity-90">
                  Siap melayani konsultasi dan emergency service kapan saja
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;