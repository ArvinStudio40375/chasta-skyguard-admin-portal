-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('admin', 'client');

-- Create profiles table for user management
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'client',
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create services table
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  location TEXT,
  completion_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create testimonials table
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  company TEXT,
  message TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create articles table
CREATE TABLE public.articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  image_url TEXT,
  slug TEXT UNIQUE,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create leads table
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  location TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for services (public read, admin write)
CREATE POLICY "Anyone can view services" 
ON public.services FOR SELECT 
USING (true);

CREATE POLICY "Only admins can manage services" 
ON public.services FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- RLS Policies for projects (public read, admin write)
CREATE POLICY "Anyone can view projects" 
ON public.projects FOR SELECT 
USING (true);

CREATE POLICY "Only admins can manage projects" 
ON public.projects FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- RLS Policies for testimonials (public read, admin write)
CREATE POLICY "Anyone can view testimonials" 
ON public.testimonials FOR SELECT 
USING (true);

CREATE POLICY "Only admins can manage testimonials" 
ON public.testimonials FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- RLS Policies for articles (public read, admin write)
CREATE POLICY "Anyone can view published articles" 
ON public.articles FOR SELECT 
USING (published_at IS NOT NULL AND published_at <= now());

CREATE POLICY "Only admins can manage articles" 
ON public.articles FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- RLS Policies for leads (anyone can insert, admin can view/manage)
CREATE POLICY "Anyone can create leads" 
ON public.leads FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Only admins can view and manage leads" 
ON public.leads FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    CASE 
      WHEN NEW.email = 'chastaskyguard@gmail.com' THEN 'admin'::user_role
      ELSE 'client'::user_role
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON public.articles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data for services
INSERT INTO public.services (title, description, icon) VALUES
('Instalasi Penangkal Petir Rumah', 'Pemasangan sistem penangkal petir untuk rumah tinggal dengan standar SNI dan bergaransi resmi', 'Home'),
('Penangkal Petir Gedung Bertingkat', 'Instalasi sistem penangkal petir untuk gedung perkantoran dan apartemen dengan teknologi terdepan', 'Building2'),
('Penangkal Petir Industri', 'Sistem proteksi petir untuk pabrik dan fasilitas industri dengan kapasitas besar', 'Factory'),
('Maintenance & Inspeksi', 'Layanan perawatan rutin dan inspeksi berkala sistem penangkal petir yang sudah terpasang', 'Wrench'),
('Konsultasi & Survey', 'Konsultasi teknis dan survey lokasi untuk menentukan sistem penangkal petir yang tepat', 'FileText'),
('Sertifikasi & Testing', 'Pengujian dan sertifikasi sistem penangkal petir sesuai standar nasional dan internasional', 'Award');

-- Insert sample data for projects
INSERT INTO public.projects (title, description, location, completion_date) VALUES
('Instalasi Penangkal Petir Perumahan Green Valley', 'Pemasangan sistem penangkal petir untuk 50 unit rumah di kompleks perumahan Green Valley', 'Bekasi, Jawa Barat', '2024-12-15'),
('Gedung Perkantoran Plaza Sentral', 'Instalasi sistem penangkal petir untuk gedung 25 lantai dengan teknologi ESE (Early Streamer Emission)', 'Jakarta Pusat', '2024-11-20'),
('Pabrik Tekstil PT. Indah Karya', 'Pemasangan sistem proteksi petir komprehensif untuk kompleks pabrik seluas 5 hektar', 'Bandung, Jawa Barat', '2024-10-08'),
('Villa Resort Puncak Indah', 'Instalasi penangkal petir untuk 20 unit villa dengan sistem grounding khusus untuk area pegunungan', 'Puncak, Jawa Barat', '2024-09-25');

-- Insert sample data for testimonials
INSERT INTO public.testimonials (client_name, company, message, rating) VALUES
('Budi Santoso', 'PT. Maju Bersama', 'Pelayanan sangat profesional dan hasil pemasangan penangkal petir sangat memuaskan. Tim teknisi berpengalaman dan memberikan garansi yang jelas.', 5),
('Sari Indrawati', 'Perumahan Griya Asri', 'Chasta SkyGuard memberikan solusi terbaik untuk sistem penangkal petir di kompleks perumahan kami. Proses cepat dan harga kompetitif.', 5),
('Ir. Ahmad Fauzi', 'CV. Karya Teknik', 'Kualitas material dan instalasi sangat baik. Sudah 2 tahun terpasang dan sistem bekerja dengan sempurna saat musim hujan.', 5),
('Dr. Maya Sari', 'Rumah Sakit Sehat Sentosa', 'Sangat puas dengan layanan maintenance rutin dari Chasta SkyGuard. Tim selalu responsif dan profesional dalam bekerja.', 5);

-- Insert sample data for articles
INSERT INTO public.articles (title, content, excerpt, slug) VALUES
('Pentingnya Penangkal Petir untuk Rumah Anda', 'Penangkal petir merupakan sistem proteksi yang sangat penting untuk melindungi rumah dan penghuninya dari bahaya sambaran petir. Indonesia sebagai negara tropis dengan curah hujan tinggi memiliki aktivitas petir yang cukup sering terjadi...', 'Pelajari mengapa setiap rumah membutuhkan sistem penangkal petir yang tepat untuk perlindungan maksimal.', 'pentingnya-penangkal-petir-rumah'),
('Standar SNI untuk Instalasi Penangkal Petir', 'Standar Nasional Indonesia (SNI) untuk sistem penangkal petir telah ditetapkan untuk memastikan keamanan dan efektivitas instalasi. SNI 03-7015-2004 mengatur tentang sistem proteksi petir pada bangunan gedung...', 'Memahami standar SNI yang harus dipenuhi dalam instalasi sistem penangkal petir di Indonesia.', 'standar-sni-penangkal-petir'),
('Tips Perawatan Sistem Penangkal Petir', 'Perawatan rutin sistem penangkal petir sangat penting untuk memastikan fungsinya tetap optimal. Inspeksi berkala, pembersihan, dan pengecekan konektivitas adalah beberapa hal yang harus dilakukan secara rutin...', 'Panduan lengkap merawat sistem penangkal petir agar tetap berfungsi dengan baik.', 'tips-perawatan-penangkal-petir'),
('Teknologi ESE vs Konvensional', 'Early Streamer Emission (ESE) merupakan teknologi terbaru dalam sistem penangkal petir yang menawarkan perlindungan lebih luas dibandingkan sistem konvensional. Artikel ini membahas perbedaan dan keunggulan masing-masing teknologi...', 'Perbandingan teknologi penangkal petir ESE dan konvensional untuk membantu Anda memilih yang terbaik.', 'teknologi-ese-vs-konvensional');