"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"
import { ViajeDetailModal } from "@/components/viajes/viaje-detail-modal"
import type { Viaje } from "@/lib/types"

const mockViajes: Viaje[] = [
  {
    id: 1,
    conductor_id: 1,
    ruta_id: 101,
    vehiculo_id: 1,
    sindicato_id: 1,
    estado: "FINALIZADO",
    pagado: "SI",
    fecha_inicio: "2025-01-23 08:00",
    fecha_fin: "2025-01-23 16:30",
    duracion_minutos: 510,
    distancia_km: 145,
  },
  {
    id: 2,
    conductor_id: 2,
    ruta_id: 205,
    vehiculo_id: 2,
    sindicato_id: 1,
    estado: "FINALIZADO",
    pagado: "NO",
    fecha_inicio: "2025-01-23 08:15",
    fecha_fin: "2025-01-23 16:45",
    duracion_minutos: 510,
    distancia_km: 142,
  },
  {
    id: 3,
    conductor_id: 3,
    ruta_id: 302,
    vehiculo_id: 3,
    sindicato_id: 1,
    estado: "FINALIZADO",
    pagado: "SI",
    fecha_inicio: "2025-01-22 08:00",
    fecha_fin: "2025-01-22 16:30",
    duracion_minutos: 510,
    distancia_km: 138,
  },
  {
    id: 4,
    conductor_id: 4,
    ruta_id: 101,
    vehiculo_id: 1,
    sindicato_id: 1,
    estado: "FINALIZADO",
    pagado: "NO",
    fecha_inicio: "2025-01-22 08:00",
    fecha_fin: "2025-01-22 16:30",
    duracion_minutos: 510,
    distancia_km: 145,
  },
]

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

export default function ViagesPage() {
  const [viajes, setViajes] = useState<Viaje[]>(mockViajes)
  const [selectedViaje, setSelectedViaje] = useState<Viaje | null>(null)
  const [filterPagado, setFilterPagado] = useState<"TODOS" | "SI" | "NO">("TODOS")
  const [filterEstado, setFilterEstado] = useState<"TODOS" | "FINALIZADO">("TODOS")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredViajes = viajes.filter((v) => {
    const matchesPagado = filterPagado === "TODOS" || v.pagado === filterPagado
    const matchesEstado = filterEstado === "TODOS" || v.estado === filterEstado
    const matchesSearch =
      conductoresMap[v.conductor_id]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rutasMap[v.ruta_id]?.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesPagado && matchesEstado && matchesSearch
  })

  const stats = {
    total: viajes.length,
    pagados: viajes.filter((v) => v.pagado === "SI").length,
    pendientes: viajes.filter((v) => v.pagado === "NO").length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <FileText className="h-8 w-8" />
            Gestión de Viajes
          </h1>
          <p className="text-muted-foreground mt-1">Control de viajes y pagos</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 border-blue-500/20 bg-blue-500/5">
          <p className="text-sm text-blue-400">Total Viajes</p>
          <p className="text-3xl font-bold text-blue-400 mt-2">{stats.total}</p>
        </Card>
        <Card className="p-6 border-green-500/20 bg-green-500/5">
          <p className="text-sm text-green-400">Viajes Pagados</p>
          <p className="text-3xl font-bold text-green-400 mt-2">{stats.pagados}</p>
        </Card>
        <Card className="p-6 border-yellow-500/20 bg-yellow-500/5">
          <p className="text-sm text-yellow-400">Pendientes Pago</p>
          <p className="text-3xl font-bold text-yellow-400 mt-2">{stats.pendientes}</p>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Buscar por conductor o ruta..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 rounded-lg border border-input bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />

        <select
          value={filterPagado}
          onChange={(e) => setFilterPagado(e.target.value as any)}
          className="rounded-lg border border-input bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="TODOS">Todos los estados</option>
          <option value="SI">Pagados</option>
          <option value="NO">Pendientes</option>
        </select>
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Fecha</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Conductor</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Ruta</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Duración</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Distancia</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Pagado</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Acción</th>
              </tr>
            </thead>
            <tbody>
              {filteredViajes.map((viaje) => (
                <tr key={viaje.id} className="border-b border-border hover:bg-secondary/30 transition">
                  <td className="px-6 py-3 text-sm text-muted-foreground">{viaje.fecha_inicio?.split(" ")[0]}</td>
                  <td className="px-6 py-3 font-medium text-foreground">{conductoresMap[viaje.conductor_id]}</td>
                  <td className="px-6 py-3 text-sm text-foreground">{rutasMap[viaje.ruta_id]}</td>
                  <td className="px-6 py-3 text-sm text-muted-foreground">
                    {viaje.duracion_minutos ? Math.round(viaje.duracion_minutos / 60) : "-"} h
                  </td>
                  <td className="px-6 py-3 text-sm text-muted-foreground">{viaje.distancia_km} km</td>
                  <td className="px-6 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                        viaje.pagado === "SI" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {viaje.pagado === "SI" ? "✓ Pagado" : "Pendiente"}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <Button onClick={() => setSelectedViaje(viaje)} variant="outline" size="sm">
                      Ver
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal */}
      {selectedViaje && (
        <ViajeDetailModal
          viaje={selectedViaje}
          onClose={() => setSelectedViaje(null)}
          onPagadoChange={(pagado) => {
            setViajes(viajes.map((v) => (v.id === selectedViaje.id ? { ...v, pagado } : v)))
          }}
        />
      )}
    </div>
  )
}
