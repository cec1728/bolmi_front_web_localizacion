"use client"

import { MapContainer, TileLayer, Polyline } from "react-leaflet"
import { HeatmapLayer } from "react-leaflet-heatmap-layer-v3"
import "leaflet/dist/leaflet.css"

// ====================== RUTAS (waypoints que enviaste) ======================

// Ruta 1 (30 → 1)
const route1: [number, number][] = [
  [-16.51659, -68.11835], // WP30
  [-16.51561, -68.11964], // WP29
  [-16.51388, -68.12135], // WP28
  [-16.51240, -68.12256], // WP27
  [-16.51141, -68.12487], // WP26-Z
  [-16.51026, -68.12522], // WP25-Y
  [-16.50927, -68.12608], // WP24-X
  [-16.50779, -68.12728], // WP23-W
  [-16.50664, -68.12882], // WP22-V
  [-16.50524, -68.12994], // WP21-U
  [-16.50467, -68.13071], // WP20-T
  [-16.50327, -68.13166], // WP19-S
  [-16.49932, -68.13509], // WP18-R (versión final)
  [-16.50056, -68.13372], // WP17-Q
  [-16.49875, -68.13535], // WP16-P
  [-16.49825, -68.13586], // WP15-O
  [-16.49735, -68.13629], // WP14-N
  [-16.49702, -68.13672], // WP13-M
  [-16.49611, -68.13672], // WP12-L
  [-16.49537, -68.13689], // WP11-K
  [-16.49398, -68.13698], // WP10-J
  [-16.49348, -68.13750], // WP09-I
  [-16.49241, -68.13750], // WP08-H
  [-16.49192, -68.13827], // WP07-G
  [-16.49151, -68.13861], // WP06-F
  [-16.49101, -68.13930], // WP05-E
  [-16.49052, -68.13973], // WP04-D
  [-16.49044, -68.14119], // WP03-C
  [-16.48970, -68.14162], // WP02-B
  [-16.48929, -68.14316], // WP01-A
]

// Ruta 2 (10 → 1)
const route2: [number, number][] = [
  [-16.50379, -68.12091], // WP10-J
  [-16.50198, -68.12108], // WP09-I
  [-16.50091, -68.12108], // WP08-H
  [-16.49713, -68.12138], // WP07-G
  [-16.49626, -68.12134], // WP06-F
  [-16.49401, -68.12147], // WP05-E
  [-16.49141, -68.12156], // WP04-D
  [-16.48874, -68.12160], // WP03-C
  [-16.48718, -68.12186], // WP02-B
  [-16.48537, -68.12190], // WP01-A
]

// Ruta 3 (13 → 1)
const route3: [number, number][] = [
  [-16.48599, -68.16643], // WP13-M
  [-16.48895, -68.16961], // WP12-L
  [-16.49224, -68.16806], // WP11-K
  [-16.49463, -68.16557], // WP10-J
  [-16.49874, -68.16308], // WP09-I
  [-16.50434, -68.16342], // WP08-H
  [-16.50804, -68.16445], // WP07-G
  [-16.51355, -68.16583], // WP06-F
  [-16.51256, -68.16626], // WP05-E
  [-16.51980, -68.16789], // WP04-D
  [-16.52810, -68.17064], // WP03-C
  [-16.52490, -68.17012], // WP02-B
  [-16.53246, -68.17287], // WP01-A
]

// ====================== HEATMAP POINTS (focos sobre las rutas) ======================

const minisPoints = [
  // Ruta 1 – intensidad más alta
  ...route1.map(([lat, lng]) => ({ lat, lng, intensity: 1 })),
  // Ruta 2 – un poco menor
  ...route2.map(([lat, lng]) => ({ lat, lng, intensity: 0.9 })),
  // Ruta 3 – similar
  ...route3.map(([lat, lng]) => ({ lat, lng, intensity: 0.9 })),
]

//  Gradiente de colores vivos pero translúcidos
const HEATMAP_GRADIENT: { [key: number]: string } = {
  0.0: "rgba(0, 0, 255, 0.0)",   // invisible
  0.25: "rgba(0, 191, 255, 0.25)", // cian suave
  0.5: "rgba(34, 197, 94, 0.28)",  // verde suave
  0.75: "rgba(234, 179, 8, 0.30)", // amarillo translúcido
  0.9: "rgba(248, 113, 113, 0.32)",// naranja/rojo suave
  1.0: "rgba(239, 68, 68, 0.35)",  // rojo pero ya no tapa todo
}


// ====================== COMPONENTE ======================

export function MapHeatmap() {
  return (
    <MapContainer
      center={[-16.500, -68.140]} // centro aproximado entre las 3 rutas
      zoom={13}
      scrollWheelZoom
      className="h-full w-full rounded-xl"
    >
      {/* 🌍 Mapa de calles (muy legible y colorido) */}
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <HeatmapLayer
        points={minisPoints}
        latitudeExtractor={(p: any) => p.lat}
        longitudeExtractor={(p: any) => p.lng}
        intensityExtractor={(p: any) => p.intensity}
        radius={26}        // un poco más concentrado
        blur={20}          // menos “nube” encima del mapa
        max={1}
        maxZoom={18}
        //minOpacity={0.12}  // deja ver bien el mapa debajo
        gradient={HEATMAP_GRADIENT}
      />


      {/* 🚌 Polylines de las rutas (para ver claramente el trazado) */}
      <Polyline positions={route1} color="#22c55e" weight={4} opacity={0.9} />   {/* verde */}
      <Polyline positions={route2} color="#3b82f6" weight={4} opacity={0.9} />   {/* azul */}
      <Polyline positions={route3} color="#f97316" weight={4} opacity={0.9} />   {/* naranja */}
    </MapContainer>
  )
}
