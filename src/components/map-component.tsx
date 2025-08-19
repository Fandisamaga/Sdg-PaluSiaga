"use client"

import type React from "react"

import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import Image from "next/image"

// Fix for default marker icon not showing
delete (L.Icon.Default.prototype as any)._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "leaflet/images/marker-icon-2x.png",
  iconUrl: "leaflet/images/marker-icon.png",
  shadowUrl: "leaflet/images/marker-shadow.png",
})

interface MapComponentProps {
  center: [number, number]
  schools: any[]
  evacuationPoints: any[]
  selectedSchool: number | null
  selectedEvacuation: number | null
  nearestEvacuations: any[]
}

const MapComponent: React.FC<MapComponentProps> = ({
  center,
  schools,
  evacuationPoints,
  selectedSchool,
  selectedEvacuation,
  nearestEvacuations,
}) => {
  const schoolIcon = new L.Icon({
    iconUrl: "/icons/school-marker.png",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
    className: "school-marker",
  })

  const tsunamiIcon = new L.Icon({
    iconUrl: "/icons/tsunami-marker.png",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
    className: "tsunami-marker",
  })

  const earthquakeIcon = new L.Icon({
    iconUrl: "/icons/earthquake-marker.png",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
    className: "earthquake-marker",
  })

  const selectedSchoolIcon = new L.Icon({
    iconUrl: "/icons/school-marker-selected.png",
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    popupAnchor: [0, -50],
    className: "school-marker-selected",
  })

  const selectedEvacuationIcon = new L.Icon({
    iconUrl: "/icons/evacuation-marker-selected.png",
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    popupAnchor: [0, -50],
    className: "evacuation-marker-selected",
  })

  const getEvacuationIcon = (point: any) => {
    if (selectedEvacuation === point.id) {
      return selectedEvacuationIcon
    }
    return point.type.includes("tsunami") ? tsunamiIcon : earthquakeIcon
  }

  const getSchoolIcon = (school: any) => {
    return selectedSchool === school.id ? selectedSchoolIcon : schoolIcon
  }

  const schoolCoordinates = selectedSchool ? schools.find((s) => s.id === selectedSchool)?.coordinates : null
  const evacuationCoordinates = selectedEvacuation
    ? evacuationPoints.find((e) => e.id === selectedEvacuation)?.coordinates
    : null

  return (
    <MapContainer center={center} zoom={13} scrollWheelZoom={false} className="h-full w-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {schools.map((school) => (
        <Marker
          key={school.id}
          position={[school.coordinates[0], school.coordinates[1]] as [number, number]}
          icon={getSchoolIcon(school)}
        >
          <Popup maxWidth={300} className="custom-popup">
            <div className="p-2">
              <div className="relative w-full h-32 mb-3 rounded-lg overflow-hidden">
                <Image
                  src={school.image || "/placeholder.svg"}
                  alt={school.name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=128&width=300"
                  }}
                />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-blue-800">{school.name}</h3>
                <p className="text-sm text-gray-600">{school.description}</p>
                <div className="text-sm">
                  <strong>Alamat:</strong> {school.address}
                </div>
                <div className="text-sm">
                  <strong>Jumlah Siswa:</strong> {school.students.toLocaleString()} siswa
                </div>
                <div className="text-sm">
                  <strong>Area:</strong> {school.area}
                </div>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}

      {evacuationPoints.map((point) => (
        <Marker
          key={point.id}
          position={[point.coordinates[0], point.coordinates[1]] as [number, number]}
          icon={getEvacuationIcon(point)}
        >
          <Popup maxWidth={350} className="custom-popup">
            <div className="p-2">
              <div className="relative w-full h-32 mb-3 rounded-lg overflow-hidden">
                <Image
                  src={point.image || "/placeholder.svg"}
                  alt={point.name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=128&width=350"
                  }}
                />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-red-800">{point.name}</h3>
                <p className="text-sm text-gray-600">{point.description}</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <strong>Tipe:</strong> {point.type}
                  </div>
                  <div>
                    <strong>Elevasi:</strong> {point.elevation}
                  </div>
                  <div>
                    <strong>Kapasitas:</strong> {point.capacity.toLocaleString()} orang
                  </div>
                  <div>
                    <strong>Jam Operasional:</strong> {point.operationalHours}
                  </div>
                </div>
                <div className="text-sm">
                  <strong>Akses Jalan:</strong> {point.accessRoad}
                </div>
                <div className="text-sm">
                  <strong>Kontak Darurat:</strong> {point.emergencyContact}
                </div>
                <div className="text-sm">
                  <strong>Fasilitas:</strong>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {point.facilities.map((facility: string, index: number) => (
                      <span key={index} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {facility}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}

      {schoolCoordinates && evacuationCoordinates && (
        <>
          {/* Main route line */}
          <Polyline
            positions={[
              [schoolCoordinates[0], schoolCoordinates[1]],
              [evacuationCoordinates[0], evacuationCoordinates[1]],
            ]}
            color="#22c55e"
            weight={6}
            opacity={0.8}
          />
          {/* Dashed overlay for better visibility */}
          <Polyline
            positions={[
              [schoolCoordinates[0], schoolCoordinates[1]],
              [evacuationCoordinates[0], evacuationCoordinates[1]],
            ]}
            color="#ffffff"
            weight={2}
            dashArray="10, 10"
            opacity={0.9}
          />
        </>
      )}

      {selectedSchool && nearestEvacuations.length > 0 && !selectedEvacuation && (
        <>
          {nearestEvacuations.map((evacuation, index) => (
            <Polyline
              key={`route-${evacuation.id}`}
              positions={[
                [schoolCoordinates![0], schoolCoordinates![1]],
                [evacuation.coordinates[0], evacuation.coordinates[1]],
              ]}
              color={index === 0 ? "#ef4444" : "#f97316"}
              weight={index === 0 ? 4 : 3}
              opacity={index === 0 ? 0.8 : 0.6}
              dashArray={index === 0 ? undefined : "5, 10"}
            />
          ))}
        </>
      )}
    </MapContainer>
  )
}

export default MapComponent
