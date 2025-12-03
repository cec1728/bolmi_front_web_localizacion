"use client"

import { useAuth } from "@/lib/context/auth-context"
import { Card } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp, Users, FileText } from "lucide-react"
import { useState } from "react"

// Mock data for demo
const generateChartData = () => ({
  dailyTrips: [
    { date: "Lun", verde: 45, amarillo: 30, rojo: 15 },
    { date: "Mar", verde: 52, amarillo: 28, rojo: 12 },
    { date: "Mié", verde: 48, amarillo: 32, rojo: 18 },
    { date: "Jue", verde: 61, amarillo: 25, rojo: 10 },
    { date: "Vie", verde: 55, amarillo: 31, rojo: 14 },
    { date: "Sáb", verde: 42, amarillo: 33, rojo: 20 },
    { date: "Dom", verde: 38, amarillo: 35, rojo: 22 },
  ],
  paymentStatus: [
    { name: "Pagados", value: 245, color: "#10b981" },
    { name: "Pendientes", value: 85, color: "#f59e0b" },
  ],
  topConductors: [
    { conductor: "Juan P.", score: 92 },
    { conductor: "María G.", score: 88 },
    { conductor: "Carlos M.", score: 85 },
    { conductor: "Rosa L.", score: 82 },
    { conductor: "Pedro R.", score: 78 },
  ],
  classificationTrend: [
    { semana: "Sem 1", verde: 65, amarillo: 25, rojo: 10 },
    { semana: "Sem 2", verde: 68, amarillo: 22, rojo: 10 },
    { semana: "Sem 3", verde: 70, amarillo: 20, rojo: 10 },
    { semana: "Sem 4", verde: 72, amarillo: 18, rojo: 10 },
  ],
})

const DashboardPageContent = () => {
  const { user } = useAuth()
  const [data] = useState(generateChartData())

  const kpis = [
    {
      label: "Total Viajes",
      value: "330",
      change: "+12%",
      icon: FileText,
      color: "bg-blue-500/20 text-blue-400",
    },
    {
      label: "Viajes Correctos",
      value: "238",
      change: "+8%",
      icon: TrendingUp,
      color: "bg-green-500/20 text-green-400",
    },
    {
      label: "Score Promedio",
      value: "87%",
      change: "+3%",
      icon: TrendingUp,
      color: "bg-purple-500/20 text-purple-400",
    },
    {
      label: "Conductores Activos",
      value: "24",
      change: "Estable",
      icon: Users,
      color: "bg-amber-500/20 text-amber-400",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard de Desviaciones</h1>
        <p className="text-muted-foreground mt-1">Análisis de rutas y métricas de exactitud de tu sindicato</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon
          return (
            <Card key={idx} className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{kpi.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{kpi.value}</p>
                  <p className="text-xs text-green-500 mt-2">{kpi.change}</p>
                </div>
                <div className={`p-3 rounded-lg ${kpi.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Viajes por Clasificación */}
        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Viajes por Día (Última Semana)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.dailyTrips}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b" }} />
              <Legend />
              <Bar dataKey="verde" stackId="a" fill="#10b981" name="Verde" />
              <Bar dataKey="amarillo" stackId="a" fill="#f59e0b" name="Amarillo" />
              <Bar dataKey="rojo" stackId="a" fill="#ef4444" name="Rojo" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Estado de Pagos */}
        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Estado de Pagos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.paymentStatus}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {data.paymentStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-8 mt-4">
            {data.paymentStatus.map((item, idx) => (
              <div key={idx} className="text-center">
                <p className="text-sm text-muted-foreground">{item.name}</p>
                <p className="font-semibold text-foreground">{item.value}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Top Conductors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Top 5 Conductores</h3>
          <div className="space-y-3">
            {data.topConductors.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                    {idx + 1}
                  </div>
                  <span className="text-foreground">{item.conductor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-secondary rounded-full h-1.5">
                    <div className="bg-primary h-1.5 rounded-full" style={{ width: `${item.score}%` }} />
                  </div>
                  <span className="font-semibold text-foreground text-sm">{item.score}%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Tendencia de Clasificación */}
        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Tendencia de Exactitud (%)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.classificationTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="semana" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b" }} />
              <Legend />
              <Line type="monotone" dataKey="verde" stroke="#10b981" name="Verde" strokeWidth={2} />
              <Line type="monotone" dataKey="amarillo" stroke="#f59e0b" name="Amarillo" strokeWidth={2} />
              <Line type="monotone" dataKey="rojo" stroke="#ef4444" name="Rojo" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Viajes Recientes */}
      <Card className="p-6">
        <h3 className="font-semibold text-foreground mb-4">Viajes Recientes</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-2 text-left font-semibold text-foreground">Fecha</th>
                <th className="px-4 py-2 text-left font-semibold text-foreground">Conductor</th>
                <th className="px-4 py-2 text-left font-semibold text-foreground">Ruta</th>
                <th className="px-4 py-2 text-left font-semibold text-foreground">Score</th>
                <th className="px-4 py-2 text-left font-semibold text-foreground">Estado</th>
                <th className="px-4 py-2 text-left font-semibold text-foreground">Pagado</th>
              </tr>
            </thead>
            <tbody>
              {[
                { fecha: "2025-01-23", conductor: "Juan P.", ruta: "L-101", score: 92, estado: "VERDE", pagado: "SI" },
                {
                  fecha: "2025-01-23",
                  conductor: "María G.",
                  ruta: "L-205",
                  score: 78,
                  estado: "AMARILLO",
                  pagado: "NO",
                },
                { fecha: "2025-01-23", conductor: "Carlos M.", ruta: "L-302", score: 65, estado: "ROJO", pagado: "SI" },
                { fecha: "2025-01-22", conductor: "Rosa L.", ruta: "L-101", score: 88, estado: "VERDE", pagado: "SI" },
                {
                  fecha: "2025-01-22",
                  conductor: "Pedro R.",
                  ruta: "L-450",
                  score: 72,
                  estado: "AMARILLO",
                  pagado: "NO",
                },
              ].map((item, idx) => (
                <tr key={idx} className="border-b border-border hover:bg-secondary/30 transition">
                  <td className="px-4 py-3 text-muted-foreground">{item.fecha}</td>
                  <td className="px-4 py-3 text-foreground font-medium">{item.conductor}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.ruta}</td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-foreground">{item.score}%</span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                        item.estado === "VERDE"
                          ? "bg-green-500/20 text-green-400"
                          : item.estado === "AMARILLO"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {item.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-medium ${item.pagado === "SI" ? "text-green-400" : "text-yellow-400"}`}>
                      {item.pagado}
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

export default DashboardPageContent
export { DashboardPageContent }
