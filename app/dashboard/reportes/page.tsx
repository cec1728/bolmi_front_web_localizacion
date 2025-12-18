"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/context/auth-context"
import { Card } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { AlertTriangle, MapPin, Activity, SatelliteDish, Download } from "lucide-react"
import { Button } from "@/components/ui/button" // si tienes tu propio Button; si no, usa un <button>

// Mock de datos pensados para alcaldía / regulador
const kpis = [
  {
    label: "Desvíos críticos (últimos 30 días)",
    value: 42,
    subtitle: "Eventos fuera de ruta validados",
    icon: AlertTriangle,
    color: "bg-red-500/20 text-red-400",
  },
  {
    label: "Zonas conflictivas activas",
    value: 7,
    subtitle: "Corredores con alta incidencia",
    icon: MapPin,
    color: "bg-amber-500/20 text-amber-400",
  },
  {
    label: "Flota con GPS activo",
    value: "91%",
    subtitle: "Conductores monitoreados en tiempo real",
    icon: SatelliteDish,
    color: "bg-emerald-500/20 text-emerald-400",
  },
  {
    label: "Reducción tiempo medio de viaje",
    value: "-8%",
    subtitle: "Vs. línea base histórica",
    icon: Activity,
    color: "bg-sky-500/20 text-sky-400",
  },
]

// Desvíos críticos por zona
const criticalByZone = [
  { zona: "Villa Fátima", desviaciones: 12 },
  { zona: "Ceja de El Alto", desviaciones: 9 },
  { zona: "San Pedro", desviaciones: 7 },
  { zona: "Miraflores", desviaciones: 6 },
  { zona: "Zona Sur", desviaciones: 5 },
  { zona: "Cementerio", desviaciones: 3 },
]

// Evolución diaria de incidentes
const incidentsTrend = [
  { dia: "Lun", criticos: 5, moderados: 12 },
  { dia: "Mar", criticos: 6, moderados: 14 },
  { dia: "Mié", criticos: 4, moderados: 10 },
  { dia: "Jue", criticos: 8, moderados: 16 },
  { dia: "Vie", criticos: 9, moderados: 18 },
  { dia: "Sáb", criticos: 7, moderados: 15 },
  { dia: "Dom", criticos: 3, moderados: 8 },
]

// Tabla de incidentes relevantes
const incidentesRelevantes = [
  {
    fecha: "2025-01-21",
    hora: "07:40",
    zona: "Villa Fátima",
    tipo: "Desvío crítico",
    detalle: "Salida de ruta hacia vía no autorizada en hora pico.",
    severidad: "ALTA",
  },
  {
    fecha: "2025-01-21",
    hora: "08:15",
    zona: "Ceja de El Alto",
    tipo: "Congestión anómala",
    detalle: "Aumento súbito de densidad de minis en 2 cuadras.",
    severidad: "ALTA",
  },
  {
    fecha: "2025-01-20",
    hora: "18:05",
    zona: "San Pedro",
    tipo: "Detención prolongada",
    detalle: "Vehículo detenido 18 min sobre carril principal.",
    severidad: "MEDIA",
  },
  {
    fecha: "2025-01-19",
    hora: "06:50",
    zona: "Miraflores",
    tipo: "GPS desactivado",
    detalle: "Pérdida de señal en tramo escolar.",
    severidad: "MEDIA",
  },
]

export default function ReportesPage() {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()
  const reportRef = useRef<HTMLDivElement | null>(null)

  // Protegemos la ruta
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login")
    }
  }, [loading, isAuthenticated, router])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">Cargando reportes...</p>
      </div>
    )
  }

  if (!isAuthenticated || !user) return null

  // 🔽 Descargar como PDF
  const handleDownloadPDF = async () => {
    if (!reportRef.current) return

    // import dinámico para evitar problemas de SSR
    const jsPDF = (await import("jspdf")).default
    const html2canvas = (await import("html2canvas")).default

    const element = reportRef.current

    // capturamos el área de reportes
    const canvas = await html2canvas(element, {
      scale: 2, // mejor calidad
      useCORS: true,
    })
    const imgData = canvas.toDataURL("image/png")

    const pdf = new jsPDF("p", "mm", "a4")
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()

    const imgWidth = pageWidth
    const imgHeight = (canvas.height * pageWidth) / canvas.width

    let position = 0
    let heightLeft = imgHeight

    // primera página
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    // si se pasa de una página, añadimos más
    while (heightLeft > 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    pdf.save("bolmi-reportes-alcaldia.pdf")
  }

  return (
    <div className="space-y-4">
      {/* Header + botón de descarga */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reportes para autoridades</h1>
          <p className="text-muted-foreground mt-1">
            Visión consolidada para alcaldía, reguladores y entidades de control urbano.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Dataset generado a partir de rutas monitoreadas de minibuses integrados a Bolmi.
          </p>
        </div>

        <Button
          type="button"
          onClick={handleDownloadPDF}
          className="inline-flex items-center gap-2 bg-bolmi-gold text-bolmi-black hover:bg-bolmi-gold/90"
        >
          <Download className="h-4 w-4" />
          <span>Descargar PDF</span>
        </Button>
      </div>

      {/* 🔽 Todo lo que está dentro de este contenedor se va al PDF */}
      <div ref={reportRef} className="space-y-6">
        {/* KPIs principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {kpis.map((kpi, idx) => {
            const Icon = kpi.icon
            return (
              <Card key={idx} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">{kpi.label}</p>
                    <p className="mt-2 text-2xl font-bold text-foreground">{kpi.value}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{kpi.subtitle}</p>
                  </div>
                  <div className={`inline-flex p-2 rounded-lg ${kpi.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Gráficas: desvíos por zona + tendencia diaria */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Desvíos por zona */}
          <Card className="p-6">
            <h2 className="font-semibold text-foreground mb-1">Desvíos críticos por zona</h2>
            <p className="text-xs text-muted-foreground mb-4">
              Concentración de eventos fuera de ruta que requieren coordinación con tránsito y control urbano.
            </p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={criticalByZone} layout="vertical" margin={{ left: 80 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" stroke="#94a3b8" />
                <YAxis dataKey="zona" type="category" stroke="#94a3b8" width={80} />
                <Tooltip contentStyle={{ backgroundColor: "#020617", border: "1px solid #1e293b" }} />
                <Bar dataKey="desviaciones" fill="#f97316" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Tendencia semanal de incidentes */}
          <Card className="p-6">
            <h2 className="font-semibold text-foreground mb-1">Tendencia semanal de incidentes</h2>
            <p className="text-xs text-muted-foreground mb-4">
              Comparación entre incidentes críticos y moderados en la red de minibuses monitoreados.
            </p>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={incidentsTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="dia" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: "#020617", border: "1px solid #1e293b" }} />
                <Line
                  type="monotone"
                  dataKey="criticos"
                  name="Críticos"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="moderados"
                  name="Moderados"
                  stroke="#eab308"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Tabla de incidentes relevantes */}
        <Card className="p-6">
          <h2 className="font-semibold text-foreground mb-1">Incidentes relevantes para coordinación con alcaldía</h2>
          <p className="text-xs text-muted-foreground mb-4">
            Eventos que pueden requerir ajustes de ruta, señalización, operativos de tránsito o acciones de seguridad
            vial.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th className="px-3 py-2 text-left">Fecha</th>
                  <th className="px-3 py-2 text-left">Hora</th>
                  <th className="px-3 py-2 text-left">Zona</th>
                  <th className="px-3 py-2 text-left">Tipo</th>
                  <th className="px-3 py-2 text-left">Detalle</th>
                  <th className="px-3 py-2 text-left">Severidad</th>
                </tr>
              </thead>
              <tbody>
                {incidentesRelevantes.map((inc, idx) => (
                  <tr key={idx} className="border-b border-border/60 hover:bg-secondary/40 transition">
                    <td className="px-3 py-2 text-muted-foreground">{inc.fecha}</td>
                    <td className="px-3 py-2 text-muted-foreground">{inc.hora}</td>
                    <td className="px-3 py-2 text-foreground">{inc.zona}</td>
                    <td className="px-3 py-2 text-foreground">{inc.tipo}</td>
                    <td className="px-3 py-2 text-xs text-muted-foreground max-w-md">{inc.detalle}</td>
                    <td className="px-3 py-2">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold ${
                          inc.severidad === "ALTA"
                            ? "bg-red-500/15 text-red-400 border border-red-500/40"
                            : "bg-amber-500/15 text-amber-400 border border-amber-500/40"
                        }`}
                      >
                        {inc.severidad}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
