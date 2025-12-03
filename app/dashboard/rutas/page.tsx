"use client"

import { Card } from "@/components/ui/card"
import { MapPin } from "lucide-react"

const mockRutas = [
  { id: 101, numero: "L-101", nombre: "Centro", paradas: 24, longitud_km: 45, conductores: 8 },
  { id: 205, numero: "L-205", nombre: "Sur", paradas: 28, longitud_km: 52, conductores: 6 },
  { id: 302, numero: "L-302", nombre: "Este", paradas: 22, longitud_km: 48, conductores: 7 },
  { id: 450, numero: "L-450", nombre: "Oeste", paradas: 26, longitud_km: 51, conductores: 5 },
]

export default function RutasPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <MapPin className="h-8 w-8" />
          Rutas
        </h1>
        <p className="text-muted-foreground mt-1">Listado de rutas disponibles</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Total Rutas</p>
          <p className="text-3xl font-bold text-foreground mt-2">{mockRutas.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">KM Totales</p>
          <p className="text-3xl font-bold text-foreground mt-2">
            {mockRutas.reduce((acc, r) => acc + r.longitud_km, 0)}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Paradas Totales</p>
          <p className="text-3xl font-bold text-foreground mt-2">{mockRutas.reduce((acc, r) => acc + r.paradas, 0)}</p>
        </Card>
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Número</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Nombre</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Paradas</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Longitud</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Conductores</th>
              </tr>
            </thead>
            <tbody>
              {mockRutas.map((ruta) => (
                <tr key={ruta.id} className="border-b border-border hover:bg-secondary/30 transition">
                  <td className="px-6 py-3 font-semibold text-foreground">{ruta.numero}</td>
                  <td className="px-6 py-3 text-foreground">{ruta.nombre}</td>
                  <td className="px-6 py-3 text-muted-foreground">{ruta.paradas}</td>
                  <td className="px-6 py-3 text-muted-foreground">{ruta.longitud_km} km</td>
                  <td className="px-6 py-3 text-muted-foreground">{ruta.conductores}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
