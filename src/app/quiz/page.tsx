"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, ArrowLeft, RotateCcw } from "lucide-react"
import Link from "next/link"

const quizData = [
  {
    id: 1,
    scenario: "Kamu sedang di lantai 2 sekolah saat terjadi gempa besar. Apa yang harus kamu lakukan?",
    options: [
      {
        id: "A",
        text: "Langsung lari keluar gedung",
        correct: false,
        explanation: "Berbahaya! Saat gempa, jangan panik dan lari. Bisa terjatuh atau tertimpa reruntuhan.",
      },
      {
        id: "B",
        text: "Berlindung di bawah meja yang kuat",
        correct: true,
        explanation: "Benar! Drop, Cover, Hold On. Berlindung di bawah meja melindungi dari reruntuhan.",
      },
      {
        id: "C",
        text: "Berdiri di dekat jendela",
        correct: false,
        explanation: "Sangat berbahaya! Kaca jendela bisa pecah dan melukai kamu.",
      },
      {
        id: "D",
        text: "Berdiri di bawah kusen pintu",
        correct: false,
        explanation: "Mitos lama! Kusen pintu modern tidak lebih aman dari tempat lain.",
      },
    ],
  },
  {
    id: 2,
    scenario: "Setelah gempa berhenti, kamu berada di dalam gedung sekolah. Langkah selanjutnya?",
    options: [
      {
        id: "A",
        text: "Tetap di tempat dan menunggu bantuan",
        correct: false,
        explanation: "Tidak tepat. Setelah gempa utama, bisa ada gempa susulan yang berbahaya.",
      },
      {
        id: "B",
        text: "Keluar dengan tenang melalui tangga darurat",
        correct: true,
        explanation: "Benar! Keluar dengan tenang, jangan panik, gunakan tangga (bukan lift).",
      },
      {
        id: "C",
        text: "Menggunakan lift untuk keluar lebih cepat",
        correct: false,
        explanation: "Jangan gunakan lift! Listrik bisa mati dan kamu terjebak di dalam.",
      },
      {
        id: "D",
        text: "Berlari sekencang-kencangnya keluar",
        correct: false,
        explanation: "Jangan berlari! Bisa menyebabkan kepanikan dan kecelakaan.",
      },
    ],
  },
  {
    id: 3,
    scenario: "Kamu mendengar sirine tsunami di Palu. Kamu sedang berada di pantai Talise. Apa yang harus dilakukan?",
    options: [
      {
        id: "A",
        text: "Melihat ke laut untuk memastikan ada tsunami",
        correct: false,
        explanation: "Jangan buang waktu! Jika sirine berbunyi, langsung evakuasi ke tempat tinggi.",
      },
      {
        id: "B",
        text: "Langsung lari ke tempat yang lebih tinggi",
        correct: true,
        explanation: "Benar! Tsunami bisa datang dalam hitungan menit. Segera ke tempat tinggi minimal 20 meter.",
      },
      {
        id: "C",
        text: "Naik ke atap rumah terdekat",
        correct: false,
        explanation: "Tidak cukup tinggi! Tsunami Palu 2018 mencapai 10+ meter. Perlu tempat lebih tinggi.",
      },
      {
        id: "D",
        text: "Menelepon keluarga dulu",
        correct: false,
        explanation:
          "Tidak ada waktu! Prioritas utama adalah keselamatan diri. Komunikasi bisa dilakukan setelah aman.",
      },
    ],
  },
]

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [quizCompleted, setQuizCompleted] = useState(false)

  const handleAnswerSelect = (optionId: string) => {
    setSelectedAnswer(optionId)
  }

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return

    const currentQ = quizData[currentQuestion]
    const selectedOption = currentQ.options.find((opt) => opt.id === selectedAnswer)

    if (selectedOption?.correct) {
      setScore(score + 1)
    }

    setAnswers([...answers, selectedAnswer])
    setShowResult(true)
  }

  const handleNextQuestion = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      setQuizCompleted(true)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setAnswers([])
    setQuizCompleted(false)
  }

  const getScoreColor = () => {
    const percentage = (score / quizData.length) * 100
    if (percentage >= 80) return "text-green-600"
    if (percentage >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreMessage = () => {
    const percentage = (score / quizData.length) * 100
    if (percentage >= 80) return "Excellent! Kamu sudah siap menghadapi bencana!"
    if (percentage >= 60) return "Good! Masih perlu belajar lagi untuk lebih siap."
    return "Perlu belajar lebih banyak tentang mitigasi bencana."
  }

  if (quizCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8 px-4">
        <div className="container mx-auto max-w-2xl">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Beranda
          </Link>

          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-3xl">Quiz Selesai!</CardTitle>
              <CardDescription>Berikut adalah hasil kamu:</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className={`text-6xl font-bold ${getScoreColor()}`}>
                {score}/{quizData.length}
              </div>
              <div className={`text-xl ${getScoreColor()}`}>{getScoreMessage()}</div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Review Jawaban:</h3>
                {quizData.map((question, index) => {
                  const userAnswer = answers[index]
                  const correctOption = question.options.find((opt) => opt.correct)
                  const userOption = question.options.find((opt) => opt.id === userAnswer)
                  const isCorrect = userOption?.correct

                  return (
                    <div key={question.id} className="text-left p-4 border rounded-lg">
                      <p className="font-medium mb-2">Pertanyaan {index + 1}:</p>
                      <p className="text-sm text-gray-600 mb-2">{question.scenario}</p>
                      <div className="flex items-center space-x-2">
                        {isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                        <span className={isCorrect ? "text-green-600" : "text-red-600"}>
                          Kamu pilih: {userAnswer}. {userOption?.text}
                        </span>
                      </div>
                      {!isCorrect && (
                        <p className="text-sm text-green-600 mt-1">
                          Jawaban benar: {correctOption?.id}. {correctOption?.text}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={resetQuiz} className="flex items-center">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Ulangi Quiz
                </Button>
                <Link href="/emergency-bag">
                  <Button variant="outline">Lanjut ke Tas Siaga</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const currentQ = quizData[currentQuestion]
  const selectedOption = currentQ.options.find((opt) => opt.id === selectedAnswer)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali ke Beranda
        </Link>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center mb-4">
              <Badge variant="outline">
                Pertanyaan {currentQuestion + 1} dari {quizData.length}
              </Badge>
              <Badge variant="secondary">
                Skor: {score}/{currentQuestion}
              </Badge>
            </div>
            <Progress value={(currentQuestion / quizData.length) * 100} className="mb-4" />
            <CardTitle className="text-xl">Simulasi Skenario Bencana</CardTitle>
            <CardDescription className="text-lg">{currentQ.scenario}</CardDescription>
          </CardHeader>
          <CardContent>
            {!showResult ? (
              <div className="space-y-4">
                {currentQ.options.map((option) => (
                  <div
                    key={option.id}
                    onClick={() => handleAnswerSelect(option.id)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedAnswer === option.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedAnswer === option.id ? "border-blue-500 bg-blue-500" : "border-gray-300"
                        }`}
                      >
                        {selectedAnswer === option.id && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                      <div>
                        <span className="font-medium">{option.id}.</span> {option.text}
                      </div>
                    </div>
                  </div>
                ))}
                <Button onClick={handleSubmitAnswer} disabled={!selectedAnswer} className="w-full mt-6">
                  Submit Jawaban
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div
                  className={`p-4 rounded-lg ${
                    selectedOption?.correct ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    {selectedOption?.correct ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <span className={`font-semibold ${selectedOption?.correct ? "text-green-600" : "text-red-600"}`}>
                      {selectedOption?.correct ? "Benar!" : "Salah!"}
                    </span>
                  </div>
                  <p className="text-sm">{selectedOption?.explanation}</p>
                </div>
                <Button onClick={handleNextQuestion} className="w-full">
                  {currentQuestion < quizData.length - 1 ? "Pertanyaan Selanjutnya" : "Lihat Hasil"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
