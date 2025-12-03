"use client"

import { useParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { ArrowLeft, MapPin, Truck } from "lucide-react"
import Link from "next/link"

const mockConductorData = {
  nombre: "Juan Pérez",
  email: "juan@example.com",
  sindicato: "Sindicato Central",
  score_promedio: 88,
  total_viajes: 142,
  viajes_verdes: 125,
  viajes_amarillos: 12,
  viajes_rojos: 5,
  posicion_ranking: 2,
  viajes_timeline: [
    { fecha: "2025-01-19", score: 85 },
    { fecha: "2025-01-20", score: 91 },
    { fecha: "2025-01-21", score: 87 },
    { fecha: "2025-01-22", score: 89 },
    { fecha: "2025-01-23", score: 92 },
  ],
  clasificaciones: [
    { name: "Verde", value: 125, color: "#10b981" },
    { name: "Amarillo", value: 12, color: "#f59e0b" },
    { name: "Rojo", value: 5, color: "#ef4444" },
  ],
  rutas_frecuentes: [
    { ruta: "L-101", viajes: 45, exactitud: 92 },
    { ruta: "L-205", viajes: 38, exactitud: 86 },
    { ruta: "L-302", viajes: 35, exactitud: 82 },
    { ruta: "L-450", viajes: 24, exactitud: 88 },
  ],
  vehiculos: [
    { placa: "LP-4521", marca: "Toyota", modelo: "Hiace", viajes: 90 },
    { placa: "LP-3891", marca: "Ford", modelo: "Transit", viajes: 52 },
  ],
}

export default function ConductorDashboardPage() {
  const params = useParams()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/conductores" className="text-muted-foreground hover:text-foreground transition">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{mockConductorData.nombre}</h1>
          <p className="text-muted-foreground">{mockConductorData.sindicato}</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Score Promedio</p>
          <p className="text-2xl font-bold text-foreground mt-1">{mockConductorData.score_promedio}%</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Total Viajes</p>
          <p className="text-2xl font-bold text-foreground mt-1">{mockConductorData.total_viajes}</p>
        </Card>
        <Card className="p-4 border-green-500/20 bg-green-500/5">
          <p className="text-xs text-green-400">Viajes Verdes</p>
          <p className="text-2xl font-bold text-green-400 mt-1">{mockConductorData.viajes_verdes}</p>
        </Card>
        <Card className="p-4 border-yellow-500/20 bg-yellow-500/5">
          <p className="text-xs text-yellow-400">Viajes Amarillos</p>
          <p className="text-2xl font-bold text-yellow-400 mt-1">{mockConductorData.viajes_amarillos}</p>
        </Card>
        <Card className="p-4 border-red-500/20 bg-red-500/5">
          <p className="text-xs text-red-400">Viajes Rojos</p>
          <p className="text-2xl font-bold text-red-400 mt-1">{mockConductorData.viajes_rojos}</p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timeline */}
        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Score por Día</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockConductorData.viajes_timeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="fecha" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b" }} />
              <Line type="monotone" dataKey="score" stroke="#fbbf24" strokeWidth={2} dot={{ fill: "#fbbf24" }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Clasificaciones */}
        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Distribución de Viajes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={mockConductorData.clasificaciones}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {mockConductorData.clasificaciones.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b" }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Rutas y Vehículos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Rutas Frecuentes
          </h3>
          <div className="space-y-3">
            {mockConductorData.rutas_frecuentes.map((ruta, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition"
              >
                <div>
                  <p className="font-medium text-foreground">{ruta.ruta}</p>
                  <p className="text-xs text-muted-foreground">{ruta.viajes} viajes</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">{ruta.exactitud}%</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Vehículos Asignados
          </h3>
          <div className="space-y-3">
            {mockConductorData.vehiculos.map((vehiculo, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <div>
                  <p className="font-medium text-foreground">{vehiculo.placa}</p>
                  <p className="text-xs text-muted-foreground">
                    {vehiculo.marca} {vehiculo.modelo}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">{vehiculo.viajes} viajes</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
