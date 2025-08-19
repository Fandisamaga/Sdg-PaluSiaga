"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MapPin, Navigation, Clock, AlertTriangle, Users, Waves } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Dynamic import untuk Leaflet (hanya di client-side)
const MapComponent = dynamic(() => import("@/components/map-component"), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
        <p>Loading Map...</p>
      </div>
    </div>
  ),
})

const schools = [
  {
    id: 1,
    name: "SMA Negeri 1 Palu",
    area: "Besusu Tengah, Kec. Palu Timur",
    coordinates: [-0.8938627998666675, 119.87487545414025],
    address: "Jl. Jend Gatot Subroto No.70",
    students: 1516,
    image: "/images/schools/sman1-palu.jpg", // Path untuk gambar sekolah
    description: "Sekolah menengah atas negeri dengan fasilitas lengkap di Palu Timur",
  },
  {
    id: 2,
    name: "SMA Negeri 2 Palu",
    area: "Palu Timur",
    coordinates: [-0.9028172790778809, 119.87937515322129],
    address: "Jl. Tanjung Dako No.9",
    students: 1415,
    image: "/images/schools/sman2-palu.jpg",
    description: "Sekolah dengan program unggulan di kawasan Palu Timur",
  },
  {
    id: 3,
    name: "SMA Negeri 3 Palu",
    area: "Palu Selatan",
    coordinates: [-0.9318993356807477, 119.8972791314404],
    address: "Jl. Dewi Sartika No.104, Birobuli Selatan",
    students: 1487,
    image: "/images/schools/sman3-palu.jpg",
    description: "Sekolah di kawasan Birobuli dengan akses mudah ke pusat kota",
  },
  {
    id: 4,
    name: "SMA Negeri 4 Palu",
    area: "Palu Barat",
    coordinates: [-0.8756, 119.8678],
    address: "Jl. Mokolembake No.10, Lere, Kec. Palu Barat",
    students: 1125,
    image: "/images/schools/sman4-palu.jpg",
    description: "Sekolah di kawasan Lere dengan lingkungan yang kondusif",
  },
  {
    id: 5,
    name: "SMK Negeri 1 Palu",
    area: "Palu Timur",
    coordinates: [-0.9022815812560436, 119.87676896740822],
    address: "Jl. R.A. Kartini No.14, Lolu Selatan",
    students: 1920,
    image: "/images/schools/smkn1-palu.jpg",
    description: "Sekolah menengah kejuruan dengan berbagai program keahlian",
  },
]

const evacuationPoints = [
  {
    id: 1,
    name: "Sabhara Polda Sulteng Jl.Lagarutu",
    type: "Gempa, Tsunami",
    coordinates: [-0.8894860579770971, 119.90499653079969],
    elevation: "45m",
    capacity: 5000,
    facilities: ["Air bersih", "Toilet", "Pos kesehatan", "Shelter", "Komunikasi"],
    description: "Titik evakuasi tsunami utama dengan akses jalan yang baik dan fasilitas lengkap",
    image: "/images/evacuation/sabhara-polda.jpg",
    accessRoad: "Jalan utama beraspal, dapat dilalui kendaraan besar",
    emergencyContact: "0451-421234",
    operationalHours: "24 jam",
  },
  {
    id: 2,
    name: "Kampus UNTAD Tondo",
    type: "tsunami",
    coordinates: [-0.8364109611327426, 119.89369052562475],
    elevation: "35m",
    capacity: 8000,
    facilities: ["Air bersih", "Toilet", "Pos kesehatan", "Dapur umum", "Aula", "Parkir luas"],
    description: "Kampus dengan fasilitas lengkap untuk evakuasi jangka panjang dan penampungan sementara",
    image: "/images/evacuation/untad-tondo.jpg",
    accessRoad: "Jalan kampus lebar, akses mudah dari berbagai arah",
    emergencyContact: "0451-422611",
    operationalHours: "24 jam",
  },
  {
    id: 3,
    name: "Lapangan Gawalise",
    type: "Gempa, Tsunami",
    coordinates: [-0.9010712535174474, 119.84014312789539],
    elevation: "5m",
    capacity: 2000,
    facilities: ["Area terbuka", "Akses ambulans", "Parkir", "Penerangan"],
    description: "Lapangan terbuka untuk berkumpul sementara saat gempa, lokasi strategis di tengah kota",
    image: "/images/evacuation/lapangan-gawalise.jpg",
    accessRoad: "Jalan kota, mudah diakses dari segala arah",
    emergencyContact: "0451-421111",
    operationalHours: "24 jam",
  },
  {
    id: 4,
    name: "Stadion Kapal Jukung",
    type: "Gempa",
    coordinates: [-0.8686687805870213, 119.87784989521506],
    elevation: "8m",
    capacity: 10000,
    facilities: ["Area terbuka", "Toilet", "Parkir luas", "Tribun", "Kantin", "Ruang P3K"],
    description: "Stadion dengan kapasitas besar untuk evakuasi massal, dilengkapi fasilitas olahraga",
    image: "/images/evacuation/stadion-kapal-jukung.jpg",
    accessRoad: "Jalan stadion lebar, parkir memadai",
    emergencyContact: "0451-423456",
    operationalHours: "06:00 - 22:00",
  },
  {
    id: 5,
    name: "Bukit Talise",
    type: "tsunami",
    coordinates: [-0.8651336619378979, 119.89521786997327],
    elevation: "50m",
    capacity: 3000,
    facilities: ["Area terbuka", "Akses kendaraan", "Pos pengamatan", "Shelter darurat"],
    description: "Bukit dengan elevasi tinggi, cocok untuk evakuasi tsunami dengan pemandangan laut",
    image: "/images/evacuation/bukit-talise.jpg",
    accessRoad: "Jalan menanjak, dapat dilalui kendaraan roda 4",
    emergencyContact: "0451-424567",
    operationalHours: "24 jam",
  },
  {
    id: 6,
    name: "Lapangan Vatulemo",
    type: "Tsunami, Gempa",
    coordinates: [-0.9001436626322734, 119.88912133832811],
    elevation: "10m",
    capacity: 1500,
    facilities: ["Area terbuka", "Akses jalan", "Musholla", "Warung"],
    description: "Lapangan di area perumahan untuk evakuasi lokal dengan akses mudah dari pemukiman",
    image: "/images/evacuation/lapangan-vatulemo.jpg",
    accessRoad: "Jalan perumahan, akses dari berbagai gang",
    emergencyContact: "0451-425678",
    operationalHours: "24 jam",
  },
]

// Fungsi untuk menghitung jarak (simplified)
const calculateDistance = (coord1: number[], coord2: number[]): number => {
  const R = 6371 // Radius bumi dalam km
  const dLat = ((coord2[0] - coord1[0]) * Math.PI) / 180
  const dLon = ((coord2[1] - coord1[1]) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1[0] * Math.PI) / 180) *
      Math.cos((coord2[0] * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Fungsi untuk estimasi waktu tempuh
const estimateTime = (distance: number): string => {
  const walkingSpeed = 5 // km/jam
  const timeInHours = distance / walkingSpeed
  const timeInMinutes = Math.round(timeInHours * 60)
  return `${timeInMinutes} menit`
}

export default function MapPage() {
  const [selectedSchool, setSelectedSchool] = useState<number | null>(null)
  const [nearestEvacuations, setNearestEvacuations] = useState<any[]>([])
  const [selectedEvacuation, setSelectedEvacuation] = useState<number | null>(null)
  const [mapCenter, setMapCenter] = useState<[number, number]>([-0.8917, 119.8567])

  // Hitung titik evakuasi terdekat ketika sekolah dipilih
  useEffect(() => {
    if (selectedSchool) {
      const school = schools.find((s) => s.id === selectedSchool)
      if (school) {
        // Hitung jarak ke semua titik evakuasi
        const evacuationsWithDistance = evacuationPoints.map((evacuation) => {
          const distance = calculateDistance(school.coordinates, evacuation.coordinates)
          return {
            ...evacuation,
            distance: distance,
            distanceText: `${distance.toFixed(1)} km`,
            timeText: estimateTime(distance),
          }
        })

        // Sort berdasarkan jarak dan ambil 3 terdekat
        const nearest = evacuationsWithDistance.sort((a, b) => a.distance - b.distance).slice(0, 3)
        setNearestEvacuations(nearest)

        // Set map center ke sekolah yang dipilih
        setMapCenter([school.coordinates[0], school.coordinates[1]])
      }
    } else {
      setNearestEvacuations([])
      setMapCenter([-0.8917, 119.8567]) // Reset ke center Palu
    }
  }, [selectedSchool])

  const handleSchoolSelect = (schoolId: number) => {
    setSelectedSchool(schoolId)
    setSelectedEvacuation(null)
  }

  const handleEvacuationSelect = (evacuationId: number) => {
    setSelectedEvacuation(evacuationId)
  }

  const selectedSchoolData = schools.find((school) => school.id === selectedSchool)
  const selectedEvacuationData = nearestEvacuations.find((evacuation) => evacuation.id === selectedEvacuation)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <Link href="/" className="inline-flex items-center text-green-600 hover:text-green-800 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali ke Beranda
        </Link>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* School Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                  Pilih Sekolah
                </CardTitle>
                <CardDescription>Klik sekolah untuk melihat jalur evakuasi</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {schools.map((school) => (
                    <div
                      key={school.id}
                      onClick={() => handleSchoolSelect(school.id)}
                      className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        selectedSchool === school.id
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <Image
                            src={school.image || "/placeholder.svg"}
                            alt={school.name}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              // Fallback jika gambar tidak ditemukan
                              ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=48&width=48"
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{school.name}</div>
                          <div className="text-xs text-gray-600 mt-1">{school.area}</div>
                          <div className="flex items-center mt-2 text-xs text-gray-500">
                            <Users className="h-3 w-3 mr-1" />
                            {school.students} siswa
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Nearest Evacuations */}
            {selectedSchool && nearestEvacuations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Navigation className="h-5 w-5 mr-2 text-red-600" />
                    Titik Evakuasi Terdekat
                  </CardTitle>
                  <CardDescription>Dari {selectedSchoolData?.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {nearestEvacuations.map((point, index) => (
                      <div
                        key={point.id}
                        onClick={() => handleEvacuationSelect(point.id)}
                        className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                          selectedEvacuation === point.id
                            ? "border-red-500 bg-red-50 shadow-md"
                            : "border-gray-200 hover:border-red-300"
                        }`}
                      >
                        <div className="flex items-start space-x-3 mb-2">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            <Image
                              src={point.image || "/placeholder.svg"}
                              alt={point.name}
                              fill
                              className="object-cover"
                              onError={(e) => {
                                ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=40&width=40"
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="font-medium text-sm">{point.name}</div>
                              <div className="flex items-center space-x-1">
                                <Badge variant={index === 0 ? "default" : "secondary"} className="text-xs">
                                  #{index + 1}
                                </Badge>
                                <Badge
                                  variant={point.type.includes("tsunami") ? "destructive" : "secondary"}
                                  className="text-xs"
                                >
                                  {point.type.includes("tsunami") ? (
                                    <Waves className="h-3 w-3 mr-1" />
                                  ) : (
                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                  )}
                                  {point.type}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-600 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {point.distanceText}
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {point.timeText}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">Elevasi: {point.elevation}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Legend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Legenda</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                  <span>Sekolah</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-4 h-4 bg-red-600 rounded-full"></div>
                  <span>Titik Evakuasi Tsunami</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-4 h-4 bg-orange-600 rounded-full"></div>
                  <span>Titik Berkumpul Gempa</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-4 h-1 bg-green-600"></div>
                  <span>Rute Evakuasi</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Map Area */}
          <div className="lg:col-span-3">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Peta Evakuasi Kota Palu</span>
                  {selectedSchool && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedSchool(null)
                        setSelectedEvacuation(null)
                      }}
                    >
                      Reset Peta
                    </Button>
                  )}
                </CardTitle>
                <CardDescription>
                  {selectedSchool
                    ? `Menampilkan jalur evakuasi dari ${selectedSchoolData?.name}`
                    : "Pilih sekolah untuk melihat jalur evakuasi terdekat"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Map Component */}
                <div className="h-96 rounded-lg overflow-hidden border">
                  <MapComponent
                    center={mapCenter}
                    schools={schools}
                    evacuationPoints={evacuationPoints}
                    selectedSchool={selectedSchool}
                    selectedEvacuation={selectedEvacuation}
                    nearestEvacuations={nearestEvacuations}
                  />
                </div>

                {selectedEvacuation && selectedEvacuationData && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-200">
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image
                          src={selectedEvacuationData.image || "/placeholder.svg"}
                          alt={selectedEvacuationData.name}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=80&width=80"
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-2 flex items-center text-red-800">
                          <Navigation className="h-4 w-4 mr-2" />
                          {selectedEvacuationData.name}
                        </h4>
                        <p className="text-sm text-gray-600 mb-3">{selectedEvacuationData.description}</p>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-4">
                      <div>
                        <strong className="text-gray-700">Jarak:</strong>
                        <div className="text-red-600 font-medium">{selectedEvacuationData.distanceText}</div>
                      </div>
                      <div>
                        <strong className="text-gray-700">Waktu:</strong>
                        <div className="text-red-600 font-medium">{selectedEvacuationData.timeText}</div>
                      </div>
                      <div>
                        <strong className="text-gray-700">Kapasitas:</strong>
                        <div className="text-red-600 font-medium">
                          {selectedEvacuationData.capacity.toLocaleString()} orang
                        </div>
                      </div>
                      <div>
                        <strong className="text-gray-700">Elevasi:</strong>
                        <div className="text-red-600 font-medium">{selectedEvacuationData.elevation}</div>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <strong className="text-gray-700">Akses Jalan:</strong>
                        <p className="text-gray-600 text-sm mt-1">{selectedEvacuationData.accessRoad}</p>
                      </div>
                      <div>
                        <strong className="text-gray-700">Kontak Darurat:</strong>
                        <p className="text-gray-600 text-sm mt-1">{selectedEvacuationData.emergencyContact}</p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <strong className="text-gray-700">Jam Operasional:</strong>
                      <p className="text-gray-600 text-sm mt-1">{selectedEvacuationData.operationalHours}</p>
                    </div>

                    <div>
                      <strong className="text-gray-700">Fasilitas:</strong>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedEvacuationData.facilities.map((facility: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {facility}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Safety Tips */}
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-yellow-800 mb-2">Tips Keselamatan Evakuasi</h4>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>
                          • <strong>Tsunami:</strong> Segera ke tempat tinggi minimal 20 meter atau 2 km dari pantai
                        </li>
                        <li>
                          • <strong>Gempa:</strong> Drop-Cover-Hold On, lalu keluar dengan tenang setelah guncangan
                          berhenti
                        </li>
                        <li>• Hafalkan minimal 2 jalur evakuasi dari lokasi yang sering dikunjungi</li>
                        <li>• Ikuti instruksi petugas dan jangan panik saat evakuasi</li>
                        <li>• Bawa tas siaga bencana jika memungkinkan</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
