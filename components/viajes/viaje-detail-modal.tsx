"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, MapPin, Clock, Gauge, DollarSign } from "lucide-react"
import type { Viaje } from "@/lib/types"
import { useState } from "react"

interface ViajeDetailModalProps {
  viaje: Viaje
  onClose: () => void
  onPagadoChange: (pagado: "SI" | "NO") => void
}

const conductoresMap: Record<number, string> = {
  1: "Juan Pérez",
  2: "María García",
  3: "Carlos Morales",
  4: "Rosa López",
}

const rutasMap: Record<number, string> = {
  101: "L-101 (Centro)",
  205: "L-205 (Sur)",
  302: "L-302 (Este)",
}

export function ViajeDetailModal({ viaje, onClose, onPagadoChange }: ViajeDetailModalProps) {
  const [pagado, setPagado] = useState<"SI" | "NO">(viaje.pagado)
  const [updating, setUpdating] = useState(false)

  const handlePagadoToggle = async () => {
    const newPagado = pagado === "SI" ? "NO" : "SI"
    setUpdating(true)

    // Simulate API call
    setTimeout(() => {
      setPagado(newPagado)
      onPagadoChange(newPagado)
      setUpdating(false)
    }, 500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <Card className="w-full max-w-3xl my-8">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Detalles del Viaje #{viaje.id}</h2>
              <p className="text-muted-foreground mt-1">{viaje.fecha_inicio}</p>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition">
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Trip Info */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-lg bg-secondary/50">
              <p className="text-sm text-muted-foreground">Conductor</p>
              <p className="font-semibold text-foreground mt-1">{conductoresMap[viaje.conductor_id]}</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50">
              <p className="text-sm text-muted-foreground">Ruta</p>
              <p className="font-semibold text-foreground mt-1">{rutasMap[viaje.ruta_id]}</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50">
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Duración
              </p>
              <p className="font-semibold text-foreground mt-1">
                {viaje.duracion_minutos ? Math.round(viaje.duracion_minutos / 60) : "-"} horas
              </p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50">
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Gauge className="h-4 w-4" />
                Distancia
              </p>
              <p className="font-semibold text-foreground mt-1">{viaje.distancia_km} km</p>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="mb-6 rounded-lg bg-secondary/50 h-80 flex items-center justify-center border border-border">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Mapa: Ruta planificada vs ruta real</p>
              <p className="text-xs text-muted-foreground mt-1">(Integración con Leaflet + OpenStreetMap)</p>
            </div>
          </div>

          {/* Payment Section */}
          <div className="mb-6 p-6 rounded-lg border border-border bg-secondary/30">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Estado de Pago
                </h3>
                <p className="text-sm text-muted-foreground mt-1">Actualiza el estado de pago de este viaje</p>
              </div>
              <div className="text-right">
                <span
                  className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold ${
                    pagado === "SI" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {pagado === "SI" ? "✓ Pagado" : "⏳ Pendiente"}
                </span>
              </div>
            </div>

            {/* Payment Toggle */}
            <Button
              onClick={handlePagadoToggle}
              disabled={updating}
              className="mt-4 w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-2"
            >
              {updating ? "Actualizando..." : `Marcar como ${pagado === "SI" ? "Pendiente" : "Pagado"}`}
            </Button>
          </div>

          {/* Metrics Placeholder */}
          <div className="mb-6 p-6 rounded-lg border border-border bg-secondary/30">
            <h3 className="font-semibold text-foreground mb-3">Métricas de Desvío</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Distancia Promedio</p>
                <p className="font-semibold text-foreground">87m</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">% Puntos en Ruta</p>
                <p className="font-semibold text-foreground">92%</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Score Exactitud</p>
                <p className="font-semibold text-foreground">89/100</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t border-border">
            <Button onClick={onClose} variant="outline" className="flex-1 bg-transparent">
              Cerrar
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
