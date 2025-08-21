import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Calculator as CalculatorIcon, Zap, Building, Ruler, MapPin } from 'lucide-react';
import Header from '@/components/Header';

const calculatorSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  phone: z.string().min(10, 'Nomor HP minimal 10 digit'),
  building_type: z.string().min(1, 'Pilih jenis bangunan'),
  height: z.number().min(1, 'Tinggi bangunan minimal 1 meter'),
  area: z.number().min(1, 'Luas bangunan minimal 1 m²'),
  lightning_points: z.number().min(1, 'Minimal 1 titik penangkal petir'),
  system_type: z.string().min(1, 'Pilih jenis sistem'),
});

type CalculatorFormData = z.infer<typeof calculatorSchema>;

interface CalculationResult {
  estimated_cost: number;
  package: string;
}

const Calculator = () => {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<CalculatorFormData>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      building_type: '',
      height: 0,
      area: 0,
      lightning_points: 0,
      system_type: '',
    },
  });

  const calculateCost = (data: CalculatorFormData): CalculationResult => {
    // Base cost calculation logic
    let baseCost = 0;
    let packageName = '';

    // Base cost by building type
    const buildingCosts = {
      'Rumah': 2500000,
      'Ruko': 4000000,
      'Gedung': 8000000,
      'Pabrik': 15000000,
      'Tower': 25000000,
    };

    baseCost = buildingCosts[data.building_type as keyof typeof buildingCosts] || 2500000;

    // Height multiplier
    const heightMultiplier = data.height > 10 ? 1 + (data.height - 10) * 0.1 : 1;
    
    // Area multiplier
    const areaMultiplier = 1 + (data.area / 1000) * 0.5;
    
    // Lightning points cost
    const pointsCost = data.lightning_points * 1500000;
    
    // System type multiplier
    const systemMultiplier = data.system_type === 'Elektrostatis' ? 1.5 : 1;

    const totalCost = Math.round((baseCost * heightMultiplier * areaMultiplier + pointsCost) * systemMultiplier);

    // Determine package
    if (totalCost < 5000000) {
      packageName = 'Paket Rumah';
    } else if (totalCost < 15000000) {
      packageName = 'Paket Gedung';
    } else {
      packageName = 'Paket Industri';
    }

    return {
      estimated_cost: totalCost,
      package: packageName,
    };
  };

  const onSubmit = async (data: CalculatorFormData) => {
    setIsLoading(true);
    try {
      const calculation = calculateCost(data);
      setResult(calculation);

      // Save to Supabase
      const { error } = await supabase
        .from('calculations')
        .insert({
          name: data.name,
          email: data.email,
          phone: data.phone,
          building_type: data.building_type,
          height: data.height,
          area: data.area,
          lightning_points: data.lightning_points,
          system_type: data.system_type,
          estimated_cost: calculation.estimated_cost,
          package: calculation.package,
        });

      if (error) throw error;

      toast({
        title: "Perhitungan Berhasil!",
        description: "Estimasi biaya telah dihitung dan data tersimpan.",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Terjadi Kesalahan",
        description: "Gagal menyimpan data. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      <main className="pt-20 pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full">
                <CalculatorIcon className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-primary mb-4">
              Kalkulator Estimasi Biaya Pemasangan Penangkal Petir
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Hitung estimasi biaya pemasangan penangkal petir sesuai jenis bangunan, tinggi, dan kebutuhan Anda.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-accent-yellow" />
                  Data Bangunan & Kontak
                </CardTitle>
                <CardDescription>
                  Isi form di bawah untuk mendapatkan estimasi biaya yang akurat
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Contact Information */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-foreground flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Informasi Kontak
                      </h3>
                      
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nama Lengkap</FormLabel>
                            <FormControl>
                              <Input placeholder="Masukkan nama lengkap" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="contoh@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nomor HP</FormLabel>
                            <FormControl>
                              <Input placeholder="08xxxxxxxxxx" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Building Information */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-foreground flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        Spesifikasi Bangunan
                      </h3>

                      <FormField
                        control={form.control}
                        name="building_type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Jenis Bangunan</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih jenis bangunan" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Rumah">Rumah</SelectItem>
                                <SelectItem value="Ruko">Ruko</SelectItem>
                                <SelectItem value="Gedung">Gedung</SelectItem>
                                <SelectItem value="Pabrik">Pabrik</SelectItem>
                                <SelectItem value="Tower">Tower</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="height"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tinggi Bangunan (meter)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="Masukkan tinggi bangunan"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="area"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Luas Bangunan (m²)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="Masukkan luas bangunan"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="lightning_points"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Jumlah Titik Penangkal Petir</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="Jumlah titik yang dibutuhkan"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="system_type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Jenis Sistem</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih jenis sistem" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Konvensional">Konvensional</SelectItem>
                                <SelectItem value="Elektrostatis">Elektrostatis</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full" 
                      variant="hero" 
                      size="lg"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Menghitung...' : 'Hitung Estimasi'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Result Section */}
            <div className="space-y-6">
              {result && (
                <Card className="shadow-card border-accent-yellow/20">
                  <CardHeader>
                    <CardTitle className="text-accent-yellow flex items-center gap-2">
                      <Ruler className="h-5 w-5" />
                      Hasil Estimasi
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center p-6 bg-gradient-primary rounded-lg text-white">
                      <p className="text-sm opacity-90 mb-2">Estimasi Biaya Total</p>
                      <p className="text-3xl font-bold">
                        {formatCurrency(result.estimated_cost)}
                      </p>
                    </div>
                    
                    <div className="bg-accent-yellow/10 p-4 rounded-lg">
                      <p className="font-semibold text-accent-yellow-foreground mb-2">
                        Rekomendasi Paket: {result.package}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Estimasi ini sudah termasuk material, pemasangan, dan garansi sesuai standar SNI.
                      </p>
                    </div>

                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>• Estimasi berlaku untuk konsultasi awal</p>
                      <p>• Harga final dapat berubah setelah survei lokasi</p>
                      <p>• Sudah termasuk sertifikat dan garansi</p>
                    </div>

                    <Button 
                      variant="accent" 
                      size="lg" 
                      className="w-full"
                      onClick={() => window.open('https://wa.me/6281221556554?text=Halo, saya tertarik dengan estimasi biaya penangkal petir. Mohon informasi lebih lanjut.', '_blank')}
                    >
                      Konsultasi via WhatsApp
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Info Card */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-primary">Mengapa Memilih Chasta SkyGuard?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-accent-yellow rounded-full mt-2"></div>
                    <p className="text-sm text-muted-foreground">
                      <strong>Berpengalaman 10+ tahun</strong> dalam industri penangkal petir
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-accent-yellow rounded-full mt-2"></div>
                    <p className="text-sm text-muted-foreground">
                      <strong>Berstandar SNI & IEC</strong> dengan sertifikat resmi
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-accent-yellow rounded-full mt-2"></div>
                    <p className="text-sm text-muted-foreground">
                      <strong>Garansi terpercaya</strong> dan layanan purna jual
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-accent-yellow rounded-full mt-2"></div>
                    <p className="text-sm text-muted-foreground">
                      <strong>Tim teknisi bersertifikat</strong> dan profesional
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Calculator;