"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, CheckCircle, XCircle, RotateCcw } from "lucide-react"
import Link from "next/link"

const availableItems = [
  { id: 1, name: "Senter", essential: true, category: "tools", points: 10 },
  { id: 2, name: "Baterai Cadangan", essential: true, category: "tools", points: 8 },
  { id: 3, name: "Radio Portable", essential: true, category: "tools", points: 9 },
  { id: 4, name: "Air Minum (2L)", essential: true, category: "food", points: 10 },
  { id: 5, name: "Makanan Kaleng", essential: true, category: "food", points: 8 },
  { id: 6, name: "Kotak P3K", essential: true, category: "medical", points: 10 },
  { id: 7, name: "Obat-obatan Pribadi", essential: true, category: "medical", points: 9 },
  { id: 8, name: "Peluit", essential: true, category: "tools", points: 7 },
  { id: 9, name: "Uang Tunai", essential: true, category: "documents", points: 8 },
  { id: 10, name: "Fotokopi Dokumen Penting", essential: true, category: "documents", points: 9 },
  { id: 11, name: "Pakaian Ganti", essential: true, category: "clothing", points: 6 },
  { id: 12, name: "Selimut", essential: true, category: "clothing", points: 7 },
  { id: 13, name: "Masker", essential: true, category: "medical", points: 6 },
  { id: 14, name: "Hand Sanitizer", essential: true, category: "medical", points: 5 },
  { id: 15, name: "Tali/Rope", essential: true, category: "tools", points: 6 },

  // Non-essential items (will reduce score)
  { id: 16, name: "Laptop", essential: false, category: "electronics", points: -5 },
  { id: 17, name: "Buku Novel", essential: false, category: "entertainment", points: -3 },
  { id: 18, name: "Makeup", essential: false, category: "personal", points: -4 },
  { id: 19, name: "Mainan", essential: false, category: "entertainment", points: -3 },
  { id: 20, name: "Perhiasan", essential: false, category: "personal", points: -4 },
]

const categoryColors = {
  tools: "bg-blue-100 text-blue-800",
  food: "bg-green-100 text-green-800",
  medical: "bg-red-100 text-red-800",
  documents: "bg-yellow-100 text-yellow-800",
  clothing: "bg-purple-100 text-purple-800",
  electronics: "bg-gray-100 text-gray-800",
  entertainment: "bg-orange-100 text-orange-800",
  personal: "bg-pink-100 text-pink-800",
}

export default function EmergencyBagPage() {
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [gameCompleted, setGameCompleted] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const handleItemClick = (itemId: number) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((id) => id !== itemId))
    } else if (selectedItems.length < 15) {
      // Limit to 15 items
      setSelectedItems([...selectedItems, itemId])
    }
  }

  const calculateScore = () => {
    return selectedItems.reduce((total, itemId) => {
      const item = availableItems.find((i) => i.id === itemId)
      return total + (item?.points || 0)
    }, 0)
  }

  const getEssentialItemsSelected = () => {
    return selectedItems.filter((itemId) => {
      const item = availableItems.find((i) => i.id === itemId)
      return item?.essential
    }).length
  }

  const getTotalEssentialItems = () => {
    return availableItems.filter((item) => item.essential).length
  }

  const handleSubmit = () => {
    setShowResults(true)
    setGameCompleted(true)
  }

  const resetGame = () => {
    setSelectedItems([])
    setGameCompleted(false)
    setShowResults(false)
  }

  const score = calculateScore()
  const essentialSelected = getEssentialItemsSelected()
  const totalEssential = getTotalEssentialItems()

  const getScoreMessage = () => {
    const percentage = (essentialSelected / totalEssential) * 100
    if (percentage >= 90) return "Excellent! Tas siaga kamu sangat lengkap!"
    if (percentage >= 70) return "Good! Tas siaga kamu cukup baik, tapi masih bisa ditingkatkan."
    if (percentage >= 50) return "Okay! Masih perlu belajar lebih banyak tentang persiapan bencana."
    return "Perlu belajar lagi! Banyak barang penting yang terlewat."
  }

  const getScoreColor = () => {
    const percentage = (essentialSelected / totalEssential) * 100
    if (percentage >= 90) return "text-green-600"
    if (percentage >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <Link href="/" className="inline-flex items-center text-orange-600 hover:text-orange-800 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Beranda
          </Link>

          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">Hasil Tas Siaga Kamu</CardTitle>
              <CardDescription>Berikut evaluasi tas siaga bencana yang kamu buat:</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className={`text-4xl font-bold ${getScoreColor()}`}>
                  {essentialSelected}/{totalEssential} Barang Penting
                </div>
                <div className={`text-lg mt-2 ${getScoreColor()}`}>Skor: {score} poin</div>
                <p className={`text-xl mt-4 ${getScoreColor()}`}>{getScoreMessage()}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    Barang yang Kamu Pilih ({selectedItems.length}/15)
                  </h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {selectedItems.map((itemId) => {
                      const item = availableItems.find((i) => i.id === itemId)
                      if (!item) return null
                      return (
                        <div key={itemId} className="flex items-center justify-between p-2 border rounded">
                          <span>{item.name}</span>
                          <div className="flex items-center space-x-2">
                            <Badge className={categoryColors[item.category as keyof typeof categoryColors]}>
                              {item.category}
                            </Badge>
                            {item.essential ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                            <span className={item.essential ? "text-green-600" : "text-red-600"}>
                              {item.points > 0 ? "+" : ""}
                              {item.points}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <XCircle className="h-5 w-5 text-red-600 mr-2" />
                    Barang Penting yang Terlewat
                  </h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {availableItems
                      .filter((item) => item.essential && !selectedItems.includes(item.id))
                      .map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-2 border rounded bg-red-50">
                          <span>{item.name}</span>
                          <div className="flex items-center space-x-2">
                            <Badge className={categoryColors[item.category as keyof typeof categoryColors]}>
                              {item.category}
                            </Badge>
                            <span className="text-red-600">+{item.points}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Tips Tas Siaga Bencana:</h4>
                <ul className="text-sm space-y-1">
                  <li>• Simpan tas siaga di tempat yang mudah dijangkau</li>
                  <li>• Periksa dan ganti barang yang expired setiap 6 bulan</li>
                  <li>• Sesuaikan isi tas dengan kebutuhan keluarga</li>
                  <li>• Pastikan semua anggota keluarga tahu lokasi tas siaga</li>
                  <li>• Buat tas siaga untuk rumah, kantor, dan kendaraan</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={resetGame} className="flex items-center">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Coba Lagi
                </Button>
                <Link href="/map">
                  <Button variant="outline">Lihat Peta Evakuasi</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <Link href="/" className="inline-flex items-center text-orange-600 hover:text-orange-800 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali ke Beranda
        </Link>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Instructions and Progress */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Rakit Tas Siaga Bencana</CardTitle>
                <CardDescription>
                  Pilih maksimal 15 barang yang paling penting untuk tas siaga bencana kamu
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Barang Dipilih</span>
                    <span>{selectedItems.length}/15</span>
                  </div>
                  <Progress value={(selectedItems.length / 15) * 100} />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Barang Penting</span>
                    <span>
                      {essentialSelected}/{totalEssential}
                    </span>
                  </div>
                  <Progress value={(essentialSelected / totalEssential) * 100} className="bg-green-100" />
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">Skor: {score}</div>
                </div>

                <Button onClick={handleSubmit} disabled={selectedItems.length === 0} className="w-full">
                  Lihat Hasil
                </Button>

                <div className="text-xs space-y-1">
                  <p>
                    <strong>Kategori Barang:</strong>
                  </p>
                  <div className="flex flex-wrap gap-1">
                    <Badge className="bg-blue-100 text-blue-800 text-xs">Tools</Badge>
                    <Badge className="bg-green-100 text-green-800 text-xs">Food</Badge>
                    <Badge className="bg-red-100 text-red-800 text-xs">Medical</Badge>
                    <Badge className="bg-yellow-100 text-yellow-800 text-xs">Documents</Badge>
                    <Badge className="bg-purple-100 text-purple-800 text-xs">Clothing</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Available Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Barang yang Tersedia</CardTitle>
                <CardDescription>Klik barang untuk menambah/menghapus dari tas siaga kamu</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {availableItems.map((item) => {
                    const isSelected = selectedItems.includes(item.id)
                    const isDisabled = !isSelected && selectedItems.length >= 15

                    return (
                      <div
                        key={item.id}
                        onClick={() => !isDisabled && handleItemClick(item.id)}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          isSelected
                            ? "border-orange-500 bg-orange-50 shadow-md"
                            : isDisabled
                              ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-50"
                              : "border-gray-200 hover:border-orange-300 hover:shadow-sm"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{item.name}</span>
                          {isSelected && <CheckCircle className="h-4 w-4 text-orange-600" />}
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge className={`text-xs ${categoryColors[item.category as keyof typeof categoryColors]}`}>
                            {item.category}
                          </Badge>
                          <div className="flex items-center space-x-1">
                            {item.essential ? (
                              <CheckCircle className="h-3 w-3 text-green-600" />
                            ) : (
                              <XCircle className="h-3 w-3 text-red-600" />
                            )}
                            <span className={`text-xs ${item.points > 0 ? "text-green-600" : "text-red-600"}`}>
                              {item.points > 0 ? "+" : ""}
                              {item.points}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
