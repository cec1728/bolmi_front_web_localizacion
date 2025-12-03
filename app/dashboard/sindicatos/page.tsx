"use client"

import { Card } from "@/components/ui/card"
import { Building2 } from "lucide-react"

const mockSindicatos = [
  { id: 1, nombre: "Sindicato Central", conductores: 24, vehiculos: 18, rutas: 4, viajes_diarios: 156 },
  { id: 2, nombre: "Sindicato Sur", conductores: 18, vehiculos: 14, rutas: 3, viajes_diarios: 112 },
  { id: 3, nombre: "Sindicato Este", conductores: 15, vehiculos: 11, rutas: 2, viajes_diarios: 89 },
]

export default function SindicatosPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Building2 className="h-8 w-8" />
          Sindicatos
        </h1>
        <p className="text-muted-foreground mt-1">Gestión de sindicatos y uniones (Admin Global)</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mockSindicatos.map((sindicato) => (
          <Card key={sindicato.id} className="p-6 hover:shadow-lg transition cursor-pointer">
            <h3 className="text-lg font-semibold text-foreground mb-4">{sindicato.nombre}</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Conductores</span>
                <span className="font-semibold text-foreground">{sindicato.conductores}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Vehículos</span>
                <span className="font-semibold text-foreground">{sindicato.vehiculos}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Rutas</span>
                <span className="font-semibold text-foreground">{sindicato.rutas}</span>
              </div>
              <div className="pt-3 border-t border-border">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Viajes/Día</span>
                  <span className="font-bold text-primary">{sindicato.viajes_diarios}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
