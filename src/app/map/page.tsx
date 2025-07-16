"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MapPin, Navigation, Clock, AlertTriangle, Users, Waves } from "lucide-react"
import Link from "next/link"

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

// Data sekolah dengan koordinat yang benar di Palu
const schools = [
  {
    id: 1,
    name: "SMA Negeri 1 Palu",
    area: "Palu Barat",
    coordinates: [-0.8917, 119.8456], // Palu Barat
    address: "Jl. Diponegoro, Palu Barat",
    students: 1200,
  },
  {
    id: 2,
    name: "SMA Negeri 2 Palu",
    area: "Palu Timur",
    coordinates: [-0.8842, 119.8789], // Palu Timur
    address: "Jl. R.A. Kartini, Palu Timur",
    students: 1100,
  },
  {
    id: 3,
    name: "SMA Negeri 3 Palu",
    area: "Palu Selatan",
    coordinates: [-0.9042, 119.8567], // Palu Selatan
    address: "Jl. Hasanuddin, Palu Selatan",
    students: 950,
  },
  {
    id: 4,
    name: "SMA Negeri 4 Palu",
    area: "Palu Utara",
    coordinates: [-0.8756, 119.8678], // Palu Utara
    address: "Jl. Ahmad Yani, Palu Utara",
    students: 800,
  },
  {
    id: 5,
    name: "SMK Negeri 1 Palu",
    area: "Palu Barat",
    coordinates: [-0.8889, 119.8423], // Palu Barat
    address: "Jl. Veteran, Palu Barat",
    students: 1350,
  },
]

// Data titik evakuasi dengan koordinat yang diperbaiki
const evacuationPoints = [
  {
    id: 1,
    name: "Bukit Poboya",
    type: "tsunami",
    coordinates: [-0.8756, 119.8707], // Bukit di sebelah timur Palu
    elevation: "45m",
    capacity: 5000,
    facilities: ["Air bersih", "Toilet", "Pos kesehatan", "Shelter"],
    description: "Titik evakuasi tsunami utama dengan akses jalan yang baik",
  },
  {
    id: 2,
    name: "Kampus UNTAD Tondo",
    type: "tsunami",
    coordinates: [-0.8623, 119.8356], // Koordinat yang benar untuk UNTAD Tondo
    elevation: "35m",
    capacity: 8000,
    facilities: ["Air bersih", "Toilet", "Pos kesehatan", "Dapur umum", "Aula"],
    description: "Kampus dengan fasilitas lengkap untuk evakuasi jangka panjang",
  },
  {
    id: 3,
    name: "Lapangan Gawalise",
    type: "earthquake",
    coordinates: [-0.8956, 119.8456], // Lapangan di tengah kota
    elevation: "5m",
    capacity: 2000,
    facilities: ["Area terbuka", "Akses ambulans", "Parkir"],
    description: "Lapangan terbuka untuk berkumpul sementara saat gempa",
  },
  {
    id: 4,
    name: "Stadion Kapal Jukung",
    type: "earthquake",
    coordinates: [-0.9042, 119.8789], // Stadion di selatan Palu
    elevation: "8m",
    capacity: 10000,
    facilities: ["Area terbuka", "Toilet", "Parkir luas", "Tribun"],
    description: "Stadion dengan kapasitas besar untuk evakuasi massal",
  },
  {
    id: 5,
    name: "Bukit Talise",
    type: "tsunami",
    coordinates: [-0.8834, 119.8923], // Bukit di area Talise
    elevation: "50m",
    capacity: 3000,
    facilities: ["Area terbuka", "Akses kendaraan"],
    description: "Bukit dengan elevasi tinggi, cocok untuk evakuasi tsunami",
  },
  {
    id: 6,
    name: "Lapangan Vatulemo",
    type: "earthquake",
    coordinates: [-0.8678, 119.8634], // Lapangan di utara Palu
    elevation: "10m",
    capacity: 1500,
    facilities: ["Area terbuka", "Akses jalan"],
    description: "Lapangan di area perumahan untuk evakuasi lokal",
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
  const [mapCenter, setMapCenter] = useState<[number, number]>([-0.8917, 119.8567]) // Center of Palu yang benar

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
                      <div className="font-medium text-sm">{school.name}</div>
                      <div className="text-xs text-gray-600 mt-1">{school.area}</div>
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <Users className="h-3 w-3 mr-1" />
                        {school.students} siswa
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
                        <div className="flex items-start justify-between mb-2">
                          <div className="font-medium text-sm">{point.name}</div>
                          <div className="flex items-center space-x-1">
                            <Badge variant={index === 0 ? "default" : "secondary"} className="text-xs">
                              #{index + 1}
                            </Badge>
                            <Badge variant={point.type === "tsunami" ? "destructive" : "secondary"} className="text-xs">
                              {point.type === "tsunami" ? (
                                <Waves className="h-3 w-3 mr-1" />
                              ) : (
                                <AlertTriangle className="h-3 w-3 mr-1" />
                              )}
                              {point.type === "tsunami" ? "Tsunami" : "Gempa"}
                            </Badge>
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

                {/* Selected Evacuation Details */}
                {selectedEvacuation && selectedEvacuationData && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-200">
                    <h4 className="font-semibold mb-3 flex items-center text-red-800">
                      <Navigation className="h-4 w-4 mr-2" />
                      Detail: {selectedEvacuationData.name}
                    </h4>
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
                    <div className="mb-3">
                      <strong className="text-gray-700">Deskripsi:</strong>
                      <p className="text-gray-600 text-sm mt-1">{selectedEvacuationData.description}</p>
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
