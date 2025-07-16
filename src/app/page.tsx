import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Map, Backpack, Brain, Users, Target } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">PALU SIAGA</h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              <Link href="#fitur" className="text-gray-600 hover:text-blue-600">
                Fitur
              </Link>
              <Link href="#tentang" className="text-gray-600 hover:text-blue-600">
                Tentang
              </Link>
              <Link href="#sdgs" className="text-gray-600 hover:text-blue-600">
                SDGs
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Platform Edukasi Interaktif
            <br />
            <span className="text-blue-600">Mitigasi Bencana</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Belajar mitigasi bencana dengan cara yang menyenangkan dan interaktif. Khusus dirancang untuk siswa di Palu
            dengan konteks lokal yang kuat.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quiz">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Mulai Belajar Sekarang
              </Button>
            </Link>
            <Link href="/map">
              <Button size="lg" variant="outline">
                Lihat Peta Evakuasi
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="fitur" className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">Fitur Interaktif</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Map className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Peta Evakuasi Interaktif</CardTitle>
                <CardDescription>
                  Temukan jalur evakuasi terdekat dari lokasi sekolah atau rumah Anda di Palu
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/map">
                  <Button className="w-full">Buka Peta</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Brain className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>Simulasi Skenario</CardTitle>
                <CardDescription>
                  Kuis interaktif "Apa yang Kamu Lakukan?" dengan berbagai skenario bencana
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/quiz">
                  <Button className="w-full bg-green-600 hover:bg-green-700">Mulai Kuis</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Backpack className="h-12 w-12 text-orange-600 mb-4" />
                <CardTitle>Tas Siaga Virtual</CardTitle>
                <CardDescription>Rakit tas siaga bencana dengan drag-and-drop barang-barang penting</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/emergency-bag">
                  <Button className="w-full bg-orange-600 hover:bg-orange-700">Rakit Tas</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* SDGs Section */}
      <section id="sdgs" className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">Mendukung SDGs</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-red-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">SDG 4</h4>
              <p className="text-gray-600">
                Pendidikan Berkualitas - Memberikan edukasi mitigasi bencana yang tidak ada di kurikulum formal
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">SDG 11</h4>
              <p className="text-gray-600">
                Kota Berkelanjutan - Membuat generasi muda lebih tangguh menghadapi bencana
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">SDG 13</h4>
              <p className="text-gray-600">Penanganan Perubahan Iklim - Mitigasi bencana terkait perubahan iklim</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-6 w-6" />
            <span className="text-xl font-bold">PALU SIAGA</span>
          </div>
          <p className="text-gray-400">Platform Edukasi Mitigasi Bencana untuk Generasi Muda Kota Palu</p>
          <p className="text-gray-500 text-sm mt-2">© 2025  Suparman F55123006  - Mendukung SDGs 4, 11, dan 13</p>
        </div>
      </footer>
    </div>
  )
}
