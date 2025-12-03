"use client"

import { Card } from "@/components/ui/card"
import { Users, TrendingUp } from "lucide-react"
import Link from "next/link"

const mockConductores = [
  { id: 1, nombre: "Juan Pérez", email: "juan@example.com", score: 92, viajes: 142, estado: "VERDE", ruta: "L-101" },
  { id: 2, nombre: "María García", email: "maria@example.com", score: 88, viajes: 135, estado: "VERDE", ruta: "L-205" },
  {
    id: 3,
    nombre: "Carlos Morales",
    email: "carlos@example.com",
    score: 85,
    viajes: 128,
    estado: "VERDE",
    ruta: "L-302",
  },
  { id: 4, nombre: "Rosa López", email: "rosa@example.com", score: 82, viajes: 120, estado: "AMARILLO", ruta: "L-101" },
  {
    id: 5,
    nombre: "Pedro Rodríguez",
    email: "pedro@example.com",
    score: 78,
    viajes: 115,
    estado: "AMARILLO",
    ruta: "L-450",
  },
]

export default function ConductoresPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Users className="h-8 w-8" />
          Conductores
        </h1>
        <p className="text-muted-foreground mt-1">Listado y análisis de desempeño</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Conductores Activos</p>
          <p className="text-3xl font-bold text-foreground mt-2">{mockConductores.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Score Promedio</p>
          <p className="text-3xl font-bold text-foreground mt-2">
            {Math.round(mockConductores.reduce((acc, c) => acc + c.score, 0) / mockConductores.length)}%
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Total Viajes</p>
          <p className="text-3xl font-bold text-foreground mt-2">
            {mockConductores.reduce((acc, c) => acc + c.viajes, 0)}
          </p>
        </Card>
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">#</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Conductor</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Score</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Viajes</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Estado</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Acción</th>
              </tr>
            </thead>
            <tbody>
              {mockConductores.map((conductor, idx) => (
                <tr key={conductor.id} className="border-b border-border hover:bg-secondary/30 transition">
                  <td className="px-6 py-3 font-medium text-muted-foreground">{idx + 1}</td>
                  <td className="px-6 py-3 font-medium text-foreground">{conductor.nombre}</td>
                  <td className="px-6 py-3 text-muted-foreground text-sm">{conductor.email}</td>
                  <td className="px-6 py-3">
                    <span className="inline-flex items-center gap-1 font-semibold text-foreground">
                      <TrendingUp className="h-4 w-4 text-green-400" />
                      {conductor.score}%
                    </span>
                  </td>
                  <td className="px-6 py-3 text-foreground">{conductor.viajes}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                        conductor.estado === "VERDE"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {conductor.estado}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <Link
                      href={`/dashboard/conductor/${conductor.id}`}
                      className="text-primary hover:text-primary/80 font-medium transition text-sm"
                    >
                      Ver Dashboard
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
