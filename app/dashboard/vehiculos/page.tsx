"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Truck, Plus } from "lucide-react"

const mockVehiculos = [
  {
    id: 1,
    placa: "LP-4521",
    marca: "Toyota",
    modelo: "Hiace",
    color: "Blanco",
    conductor: "Juan Pérez",
    viajes: 142,
    estado: "ACTIVO",
  },
  {
    id: 2,
    placa: "LP-3891",
    marca: "Ford",
    modelo: "Transit",
    color: "Blanco",
    conductor: "María García",
    viajes: 135,
    estado: "ACTIVO",
  },
  {
    id: 3,
    placa: "LP-5612",
    marca: "Mercedes",
    modelo: "Sprinter",
    color: "Blanco",
    conductor: "Carlos Morales",
    viajes: 128,
    estado: "ACTIVO",
  },
  {
    id: 4,
    placa: "LP-2934",
    marca: "Toyota",
    modelo: "Hiace",
    color: "Azul",
    conductor: "Rosa López",
    viajes: 120,
    estado: "ACTIVO",
  },
]

export default function VehiculosPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Truck className="h-8 w-8" />
            Vehículos
          </h1>
          <p className="text-muted-foreground mt-1">Gestión de flotas y asignaciones</p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Vehículo
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Total Vehículos</p>
          <p className="text-3xl font-bold text-foreground mt-2">{mockVehiculos.length}</p>
        </Card>
        <Card className="p-6 border-green-500/20 bg-green-500/5">
          <p className="text-sm text-green-400">Vehículos Activos</p>
          <p className="text-3xl font-bold text-green-400 mt-2">
            {mockVehiculos.filter((v) => v.estado === "ACTIVO").length}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Viajes Totales</p>
          <p className="text-3xl font-bold text-foreground mt-2">
            {mockVehiculos.reduce((acc, v) => acc + v.viajes, 0)}
          </p>
        </Card>
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Placa</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Marca/Modelo</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Color</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Conductor</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Viajes</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Estado</th>
              </tr>
            </thead>
            <tbody>
              {mockVehiculos.map((vehiculo) => (
                <tr key={vehiculo.id} className="border-b border-border hover:bg-secondary/30 transition">
                  <td className="px-6 py-3 font-semibold text-foreground">{vehiculo.placa}</td>
                  <td className="px-6 py-3 text-foreground">
                    {vehiculo.marca} {vehiculo.modelo}
                  </td>
                  <td className="px-6 py-3 text-muted-foreground">{vehiculo.color}</td>
                  <td className="px-6 py-3 text-foreground">{vehiculo.conductor}</td>
                  <td className="px-6 py-3 text-muted-foreground">{vehiculo.viajes}</td>
                  <td className="px-6 py-3">
                    <span className="inline-flex items-center rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400">
                      {vehiculo.estado}
                    </span>
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
