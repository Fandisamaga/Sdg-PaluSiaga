// src/components/map-component.tsx
"use client";

import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet"; // Import Leaflet for custom icon

// Fix for default marker icon not showing
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "leaflet/images/marker-icon-2x.png",
  iconUrl: "leaflet/images/marker-icon.png",
  shadowUrl: "leaflet/images/marker-shadow.png",
});

interface MapComponentProps {
  center: [number, number];
  schools: any[];
  evacuationPoints: any[];
  selectedSchool: number | null;
  selectedEvacuation: number | null;
  nearestEvacuations: any[];
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
    iconUrl: "/icons/school-icon.png", // Path to your custom school icon
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const tsunamiIcon = new L.Icon({
    iconUrl: "/icons/tsunami-icon.png", // Path to your custom tsunami icon
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const earthquakeIcon = new L.Icon({
    iconUrl: "/icons/earthquake-icon.png", // Path to your custom earthquake icon
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const getEvacuationIcon = (type: string) => {
    return type === "tsunami" ? tsunamiIcon : earthquakeIcon;
  };

  const schoolCoordinates = selectedSchool
    ? schools.find((s) => s.id === selectedSchool)?.coordinates
    : null;
  const evacuationCoordinates = selectedEvacuation
    ? evacuationPoints.find((e) => e.id === selectedEvacuation)?.coordinates
    : null;

  return (
    <MapContainer
      center={center}
      zoom={13}
      scrollWheelZoom={false}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Render Schools */}
      {schools.map((school) => (
        <Marker
          key={school.id}
          position={
            [school.coordinates[0], school.coordinates[1]] as [number, number]
          }
          icon={schoolIcon}
        >
          <Popup>
            <strong>{school.name}</strong>
            <br />
            {school.address}
            <br />
            Siswa: {school.students}
          </Popup>
        </Marker>
      ))}

      {/* Render Evacuation Points */}
      {evacuationPoints.map((point) => (
        <Marker
          key={point.id}
          position={[point.coordinates[0], point.coordinates[1]] as [number, number]}
          icon={getEvacuationIcon(point.type)}
        >
          <Popup>
            <strong>{point.name}</strong>
            <br />
            Tipe: {point.type === "tsunami" ? "Tsunami" : "Gempa"}
            <br />
            Kapasitas: {point.capacity.toLocaleString()} orang
            <br />
            Elevasi: {point.elevation}
          </Popup>
        </Marker>
      ))}

      {/* Render Polyline (Route) if both school and evacuation are selected */}
      {schoolCoordinates && evacuationCoordinates && (
        <Polyline
          positions={[
            [schoolCoordinates[0], schoolCoordinates[1]],
            [evacuationCoordinates[0], evacuationCoordinates[1]],
          ]}
          color="green"
          weight={4}
          dashArray="5, 10" // For a dashed line
        />
      )}
    </MapContainer>
  );
};

export default MapComponent;