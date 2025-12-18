"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/context/auth-context"
import { Card } from "@/components/ui/card"
import {
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ComposedChart,
  ScatterChart,
  Scatter,
} from "recharts"
import { Fuel, Clock, DollarSign, TrendingUp } from "lucide-react"

// 🔹 Leaflet + Heatmap
import { MapContainer, TileLayer } from "react-leaflet"
import { HeatmapLayer } from "react-leaflet-heatmap-layer-v3"
// Asegúrate en app/layout.tsx:
// import "leaflet/dist/leaflet.css"

// ====================== RUTAS (waypoints) ======================

const route1: [number, number][] = [
  [-16.51659, -68.11835],
  [-16.51561, -68.11964],
  [-16.51388, -68.12135],
  [-16.5124, -68.12256],
  [-16.51141, -68.12487],
  [-16.51026, -68.12522],
  [-16.50927, -68.12608],
  [-16.50779, -68.12728],
  [-16.50664, -68.12882],
  [-16.50524, -68.12994],
  [-16.50467, -68.13071],
  [-16.50327, -68.13166],
  [-16.49932, -68.13509],
  [-16.50056, -68.13372],
  [-16.49875, -68.13535],
  [-16.49825, -68.13586],
  [-16.49735, -68.13629],
  [-16.49702, -68.13672],
  [-16.49611, -68.13672],
  [-16.49537, -68.13689],
  [-16.49398, -68.13698],
  [-16.49348, -68.1375],
  [-16.49241, -68.1375],
  [-16.49192, -68.13827],
  [-16.49151, -68.13861],
  [-16.49101, -68.1393],
  [-16.49052, -68.13973],
  [-16.49044, -68.14119],
  [-16.4897, -68.14162],
  [-16.48929, -68.14316],
]

const route2: [number, number][] = [
  [-16.50379, -68.12091],
  [-16.50198, -68.12108],
  [-16.50091, -68.12108],
  [-16.49713, -68.12138],
  [-16.49626, -68.12134],
  [-16.49401, -68.12147],
  [-16.49141, -68.12156],
  [-16.48874, -68.1216],
  [-16.48718, -68.12186],
  [-16.48537, -68.1219],
]

const route3: [number, number][] = [
  [-16.48599, -68.16643],
  [-16.48895, -68.16961],
  [-16.49224, -68.16806],
  [-16.49463, -68.16557],
  [-16.49874, -68.16308],
  [-16.50434, -68.16342],
  [-16.50804, -68.16445],
  [-16.51355, -68.16583],
  [-16.51256, -68.16626],
  [-16.5198, -68.16789],
  [-16.5281, -68.17064],
  [-16.5249, -68.17012],
  [-16.53246, -68.17287],
]

// ====================== HEATMAP ======================

function expandRoute(route: [number, number][], intensity = 0.6) {
  const spread = 0.0002
  const points: { lat: number; lng: number; intensity: number }[] = []

  route.forEach(([lat, lng]) => {
    points.push(
      { lat, lng, intensity },
      { lat: lat + spread, lng, intensity: intensity * 0.8 },
      { lat: lat - spread, lng, intensity: intensity * 0.8 },
      { lat, lng: lng + spread, intensity: intensity * 0.8 },
      { lat, lng: lng - spread, intensity: intensity * 0.8 },
    )
  })

  return points
}

const heatmapPoints = [
  ...expandRoute(route1, 0.75),
  ...expandRoute(route2, 0.65),
  ...expandRoute(route3, 0.65),
]

const HEATMAP_GRADIENT: { [key: number]: string } = {
  0.0: "rgba(0, 0, 0, 0.0)",
  0.3: "rgba(56, 189, 248, 0.12)",
  0.55: "rgba(34, 197, 94, 0.14)",
  0.75: "rgba(234, 179, 8, 0.16)",
  0.9: "rgba(248, 113, 113, 0.18)",
  1.0: "rgba(239, 68, 68, 0.20)",
}

function MapHeatmap() {
  return (
    <MapContainer center={[-16.5, -68.14]} zoom={13} scrollWheelZoom className="h-full w-full">
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <HeatmapLayer
        points={heatmapPoints}
        latitudeExtractor={(p: any) => p.lat}
        longitudeExtractor={(p: any) => p.lng}
        intensityExtractor={(p: any) => p.intensity}
        radius={30}
        blur={25}
        max={0.8}
        maxZoom={18}
        gradient={HEATMAP_GRADIENT}
      />
    </MapContainer>
  )
}

// ====================== MODELO DE COMBUSTIBLE (MOCK + ESTIMACIONES) ======================

type FuelType = "DIESEL" | "GASOLINA"

const WEEK = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]

// ⚠️ Ajusta esto a tu realidad (precios, consumo, etc.)
const PRICE_PER_LITER_BS: Record<FuelType, number> = {
  DIESEL: 9.8,
  GASOLINA: 6.96,
}

// Consumo base (L/100km). Si estás en La Paz con tráfico pesado, esto suele subir.
// (Hiace diésel ~9–9.8 L/100km en urbano; Urvan ~8.7–9.1 L/100km equivalente)
const BASE_L_PER_100KM: Record<FuelType, number> = {
  DIESEL: 9.4,
  GASOLINA: 12.0,
}

// Ralentí / trancadera (L/h). Para “vagoneta grande” suele estar más cerca de 1.0–1.6 L/h.
// (DOE muestra que sube bastante con tamaño/motor)
const IDLE_L_PER_HOUR: Record<FuelType, number> = {
  DIESEL: 1.25,
  GASOLINA: 1.45,
}

type SindicatoInput = {
  sindicato: string
  minis: number
  fuel: FuelType
  // Por minibús (promedio):
  kmDiaPorMini: number
  idleMinDiaPorMini: number
  // Ingresos estimados por sindicato (por día):
  pasajerosDiaTotal: number
  tarifaPromBs: number
  // Ajustes:
  trafficFactor: number // 1.0 normal, 1.2–1.4 tráfico pesado
}

const SYNDICATES: SindicatoInput[] = [
  {
    sindicato: "Sindicato Central",
    minis: 24,
    fuel: "DIESEL",
    kmDiaPorMini: 155,
    idleMinDiaPorMini: 95,
    pasajerosDiaTotal: 2300,
    tarifaPromBs: 2.5,
    trafficFactor: 1.28,
  },
  {
    sindicato: "Sindicato Sur",
    minis: 18,
    fuel: "DIESEL",
    kmDiaPorMini: 140,
    idleMinDiaPorMini: 110,
    pasajerosDiaTotal: 1750,
    tarifaPromBs: 2.5,
    trafficFactor: 1.32,
  },
  {
    sindicato: "Sindicato El Alto",
    minis: 20,
    fuel: "GASOLINA",
    kmDiaPorMini: 130,
    idleMinDiaPorMini: 120,
    pasajerosDiaTotal: 1900,
    tarifaPromBs: 2.5,
    trafficFactor: 1.35,
  },
]

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function jitter(base: number, dayIdx: number, amp = 0.08) {
  // variación suave para que las gráficas se vean “vivas”
  const s = Math.sin(dayIdx * 1.35) * amp
  return base * (1 + s)
}

function computeDay(s: SindicatoInput, dayIdx: number) {
  const km = clamp(jitter(s.kmDiaPorMini, dayIdx, 0.10), s.kmDiaPorMini * 0.85, s.kmDiaPorMini * 1.2)
  const idleMin = clamp(
    jitter(s.idleMinDiaPorMini, dayIdx, 0.18),
    s.idleMinDiaPorMini * 0.75,
    s.idleMinDiaPorMini * 1.35,
  )

  const baseL100 = BASE_L_PER_100KM[s.fuel]
  const idleLh = IDLE_L_PER_HOUR[s.fuel]
  const price = PRICE_PER_LITER_BS[s.fuel]

  // Por minibús:
  const litrosRutaPorMini = (km * (baseL100 / 100)) * s.trafficFactor
  const litrosIdlePorMini = (idleMin / 60) * idleLh
  const litrosTotalPorMini = litrosRutaPorMini + litrosIdlePorMini

  // Total sindicato:
  const litrosRuta = litrosRutaPorMini * s.minis
  const litrosIdle = litrosIdlePorMini * s.minis
  const litrosTotal = litrosTotalPorMini * s.minis

  const costoRuta = litrosRuta * price
  const costoIdle = litrosIdle * price
  const costoTotal = litrosTotal * price

  const ingresos = s.pasajerosDiaTotal * s.tarifaPromBs
  const margen = ingresos - costoTotal

  const kmTotalesSindicato = km * s.minis
  const eficienciaRealL100 = kmTotalesSindicato > 0 ? (litrosTotal / kmTotalesSindicato) * 100 : 0
  const costoPorKm = kmTotalesSindicato > 0 ? costoTotal / kmTotalesSindicato : 0
  const costoPorPasajero = s.pasajerosDiaTotal > 0 ? costoTotal / s.pasajerosDiaTotal : 0
  const idlePct = litrosTotal > 0 ? (litrosIdle / litrosTotal) * 100 : 0

  return {
    day: WEEK[dayIdx],
    sindicato: s.sindicato,
    fuel: s.fuel,
    minis: s.minis,

    kmTotales: Math.round(kmTotalesSindicato),
    idleMinTotales: Math.round(idleMin * s.minis),

    litrosRuta: +litrosRuta.toFixed(1),
    litrosIdle: +litrosIdle.toFixed(1),
    litrosTotal: +litrosTotal.toFixed(1),

    costoRuta: +costoRuta.toFixed(0),
    costoIdle: +costoIdle.toFixed(0),
    costoTotal: +costoTotal.toFixed(0),

    ingresos: +ingresos.toFixed(0),
    margen: +margen.toFixed(0),

    eficienciaRealL100: +eficienciaRealL100.toFixed(2),
    costoPorKm: +costoPorKm.toFixed(2),
    costoPorPasajero: +costoPorPasajero.toFixed(2),
    idlePct: +idlePct.toFixed(1),
  }
}

function buildFuelDashboard() {
  const dailyRows: any[] = []
  for (const s of SYNDICATES) {
    for (let d = 0; d < 7; d++) dailyRows.push(computeDay(s, d))
  }

  // Sumatoria semanal por sindicato
  const bySindicato = SYNDICATES.map((s) => {
    const rows = dailyRows.filter((r) => r.sindicato === s.sindicato)
    const sum = (key: string) => rows.reduce((acc, r) => acc + (Number(r[key]) || 0), 0)

    const litrosRuta = sum("litrosRuta")
    const litrosIdle = sum("litrosIdle")
    const litrosTotal = sum("litrosTotal")
    const costoRuta = sum("costoRuta")
    const costoIdle = sum("costoIdle")
    const costoTotal = sum("costoTotal")
    const ingresos = sum("ingresos")
    const margen = sum("margen")
    const kmTotales = sum("kmTotales")
    const idleMinTotales = sum("idleMinTotales")

    const eficienciaRealL100 = kmTotales > 0 ? (litrosTotal / kmTotales) * 100 : 0
    const costoPorKm = kmTotales > 0 ? costoTotal / kmTotales : 0
    const costoPorPasajero = (ingresos > 0 && s.tarifaPromBs > 0) ? costoTotal / (ingresos / s.tarifaPromBs) : 0
    const idlePct = litrosTotal > 0 ? (litrosIdle / litrosTotal) * 100 : 0

    return {
      sindicato: s.sindicato,
      fuel: s.fuel,
      minis: s.minis,

      litrosRuta: +litrosRuta.toFixed(1),
      litrosIdle: +litrosIdle.toFixed(1),
      litrosTotal: +litrosTotal.toFixed(1),

      costoRuta: +costoRuta.toFixed(0),
      costoIdle: +costoIdle.toFixed(0),
      costoTotal: +costoTotal.toFixed(0),

      ingresos: +ingresos.toFixed(0),
      margen: +margen.toFixed(0),

      kmTotales: Math.round(kmTotales),
      idleHoras: +(idleMinTotales / 60).toFixed(1),

      eficienciaRealL100: +eficienciaRealL100.toFixed(2),
      costoPorKm: +costoPorKm.toFixed(2),
      costoPorPasajero: +costoPorPasajero.toFixed(2),
      idlePct: +idlePct.toFixed(1),
    }
  })

  // Tendencia diaria (formato “wide” para LineChart multi-line)
  const trendLitros = WEEK.map((day) => {
    const row: any = { day }
    for (const s of SYNDICATES) {
      const r = dailyRows.find((x) => x.day === day && x.sindicato === s.sindicato)
      row[s.sindicato] = r?.litrosTotal ?? 0
    }
    return row
  })

  const trendIdle = WEEK.map((day) => {
    const row: any = { day }
    for (const s of SYNDICATES) {
      const r = dailyRows.find((x) => x.day === day && x.sindicato === s.sindicato)
      row[s.sindicato] = r ? +(r.idleMinTotales / 60).toFixed(1) : 0
    }
    return row
  })

  const totals = {
    litrosTotal: bySindicato.reduce((a, r) => a + r.litrosTotal, 0),
    litrosIdle: bySindicato.reduce((a, r) => a + r.litrosIdle, 0),
    costoTotal: bySindicato.reduce((a, r) => a + r.costoTotal, 0),
    costoIdle: bySindicato.reduce((a, r) => a + r.costoIdle, 0),
    ingresos: bySindicato.reduce((a, r) => a + r.ingresos, 0),
    margen: bySindicato.reduce((a, r) => a + r.margen, 0),
  }

  return { dailyRows, bySindicato, trendLitros, trendIdle, totals }
}

// ====================== DASHBOARD ======================

const DashboardPageContent = () => {
  const router = useRouter()
  const { user, loading, isAuthenticated } = useAuth()

  const fuel = useMemo(() => buildFuelDashboard(), [])
  const { totals } = fuel

  useEffect(() => {
    if (!loading && !isAuthenticated) router.replace("/login")
  }, [loading, isAuthenticated, router])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">Cargando dashboard...</p>
      </div>
    )
  }
  if (!isAuthenticated || !user) return null

  const kpis = [
    {
      label: "Litros Totales (Semana)",
      value: `${Math.round(totals.litrosTotal)} L`,
      sub: `Idle: ${Math.round(totals.litrosIdle)} L`,
      icon: Fuel,
      color: "bg-sky-500/20 text-sky-400",
    },
    {
      label: "Costo Combustible (Semana)",
      value: `Bs ${Math.round(totals.costoTotal).toLocaleString("es-BO")}`,
      sub: `Idle: Bs ${Math.round(totals.costoIdle).toLocaleString("es-BO")}`,
      icon: DollarSign,
      color: "bg-red-500/20 text-red-400",
    },
    {
      label: "Horas en Trancadera (Semana)",
      value: `${Math.round((totals.litrosIdle / IDLE_L_PER_HOUR.DIESEL) * 10) / 10} h*`,
      sub: "*estimado por tasa idle",
      icon: Clock,
      color: "bg-amber-500/20 text-amber-400",
    },
    {
      label: "Margen (Ing - Comb)",
      value: `Bs ${Math.round(totals.margen).toLocaleString("es-BO")}`,
      sub: `Ing: Bs ${Math.round(totals.ingresos).toLocaleString("es-BO")}`,
      icon: TrendingUp,
      color: "bg-emerald-500/20 text-emerald-400",
    },
  ]

  const PIE = [
    { name: "En ruta", value: totals.litrosTotal - totals.litrosIdle, color: "#10b981" },
    { name: "En trancadera (idle)", value: totals.litrosIdle, color: "#f97316" },
  ]

  const LINES = ["#60a5fa", "#a78bfa", "#34d399"] // solo para diferenciar líneas

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard de Combustible</h1>
        <p className="text-muted-foreground mt-1">
          Consumo, costos e impacto de trancadera por sindicato (estimado + listo para conectar a datos reales).
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Sesión: <span className="font-semibold">{user.email}</span>
        </p>
      </div>

      {/* 🗺️ Mapa */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
          <div>
            <h3 className="font-semibold text-foreground">Mapa de calor de minis por ruta</h3>
            <p className="text-sm text-muted-foreground">
              En producción, estos puntos vendrían del tracking en tiempo real.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="h-3 w-6 rounded bg-blue-500" /> <span>Baja</span>
            <span className="h-3 w-6 rounded bg-green-500" /> <span>Media</span>
            <span className="h-3 w-6 rounded bg-red-500" /> <span>Alta</span>
          </div>
        </div>

        <div className="h-[380px] md:h-[480px] lg:h-[560px] rounded-xl overflow-hidden border border-border">
          <MapHeatmap />
        </div>

        <p className="text-[11px] text-muted-foreground mt-3">
          *El consumo “idle” de trancadera se estima con L/h de ralentí y minutos detenidos por minibús.
        </p>
      </Card>

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
                  <p className="text-xs text-muted-foreground mt-2">{kpi.sub}</p>
                </div>
                <div className={`p-3 rounded-lg ${kpi.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* ====================== GRAFICAS “POR SINDICATO” ====================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Litros totales por sindicato */}
        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Litros Totales por Sindicato (Semana)</h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={fuel.bySindicato}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="sindicato" stroke="#94a3b8" tick={{ fontSize: 11 }} interval={0} />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b" }} />
              <Legend />
              <Bar dataKey="litrosTotal" fill="#60a5fa" name="Litros (Total)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Ruta vs Trancadera */}
        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Ruta vs Trancadera (Litros - Semana)</h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={fuel.bySindicato}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="sindicato" stroke="#94a3b8" tick={{ fontSize: 11 }} interval={0} />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b" }} />
              <Legend />
              <Bar dataKey="litrosRuta" stackId="a" fill="#10b981" name="En ruta" />
              <Bar dataKey="litrosIdle" stackId="a" fill="#f97316" name="En trancadera (idle)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie total */}
        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">¿Cuánto se va en Trancadera?</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={PIE} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} innerRadius={55}>
                {PIE.map((e, i) => (
                  <Cell key={i} fill={e.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b" }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <p className="text-xs text-muted-foreground mt-2">
            Esto es el “combustible quemado” sin avanzar (estimado por L/h y minutos detenidos).
          </p>
        </Card>

        {/* Costos por sindicato */}
        <Card className="p-6 lg:col-span-2">
          <h3 className="font-semibold text-foreground mb-4">Costo de Combustible por Sindicato (Semana)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={fuel.bySindicato}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="sindicato" stroke="#94a3b8" tick={{ fontSize: 11 }} interval={0} />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b" }} />
              <Legend />
              <Bar dataKey="costoTotal" fill="#ef4444" name="Costo Total (Bs)" radius={[8, 8, 0, 0]} />
              <Bar dataKey="costoIdle" fill="#f97316" name="Costo Trancadera (Bs)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Ingresos vs Costos vs Margen */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Ingresos vs Combustible vs Margen (Semana)</h3>
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart data={fuel.bySindicato}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="sindicato" stroke="#94a3b8" tick={{ fontSize: 11 }} interval={0} />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b" }} />
              <Legend />
              <Bar dataKey="ingresos" fill="#a78bfa" name="Ingresos (Bs)" />
              <Bar dataKey="costoTotal" fill="#ef4444" name="Combustible (Bs)" />
              <Line type="monotone" dataKey="margen" stroke="#22c55e" strokeWidth={2} name="Margen (Bs)" />
            </ComposedChart>
          </ResponsiveContainer>
          <p className="text-xs text-muted-foreground mt-2">
            *Aquí solo estoy comparando contra combustible. Si quieres, metemos mantenimiento, llantas, peajes, etc.
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Costo por km y por pasajero (Semana)</h3>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={fuel.bySindicato}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="sindicato" stroke="#94a3b8" tick={{ fontSize: 11 }} interval={0} />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b" }} />
              <Legend />
              <Area type="monotone" dataKey="costoPorKm" stroke="#60a5fa" fill="#60a5fa" name="Bs/km" />
              <Area type="monotone" dataKey="costoPorPasajero" stroke="#f59e0b" fill="#f59e0b" name="Bs/pasajero" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Tendencias */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Tendencia Diaria: Litros Totales</h3>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={fuel.trendLitros}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="day" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b" }} />
              <Legend />
              {SYNDICATES.map((s, i) => (
                <Line
                  key={s.sindicato}
                  type="monotone"
                  dataKey={s.sindicato}
                  stroke={LINES[i % LINES.length]}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Tendencia Diaria: Horas en Trancadera</h3>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={fuel.trendIdle}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="day" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b" }} />
              <Legend />
              {SYNDICATES.map((s, i) => (
                <Line
                  key={s.sindicato}
                  type="monotone"
                  dataKey={s.sindicato}
                  stroke={LINES[i % LINES.length]}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Scatter: eficiencia real */}
      <div className="grid grid-cols-1 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-2">Eficiencia Real vs Operación (Semana)</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Cada punto = sindicato. Y = L/100km real (incluye trancadera). X = km operados en la semana.
          </p>
          <ResponsiveContainer width="100%" height={360}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis type="number" dataKey="kmTotales" name="km/semana" stroke="#94a3b8" />
              <YAxis type="number" dataKey="eficienciaRealL100" name="L/100km" stroke="#94a3b8" />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b" }} />
              <Legend />
              <Scatter name="Sindicatos" data={fuel.bySindicato} fill="#60a5fa" />
            </ScatterChart>
          </ResponsiveContainer>
          <p className="text-[11px] text-muted-foreground mt-3">
            Tip: si sube mucho el L/100km real, casi siempre es por (1) tráfico/ralentí, (2) manejo agresivo, (3) sobrecarga, (4) mantenimiento.
          </p>
        </Card>
      </div>

      {/* Supuestos visibles */}
      <Card className="p-6">
        <h3 className="font-semibold text-foreground mb-2">Parámetros (rápido para ajustar)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="rounded-lg border border-border p-3">
            <p className="text-muted-foreground">Precio (Bs/L)</p>
            <p className="font-semibold text-foreground mt-1">Diésel: {PRICE_PER_LITER_BS.DIESEL}</p>
            <p className="font-semibold text-foreground">Gasolina: {PRICE_PER_LITER_BS.GASOLINA}</p>
          </div>
          <div className="rounded-lg border border-border p-3">
            <p className="text-muted-foreground">Consumo Base (L/100km)</p>
            <p className="font-semibold text-foreground mt-1">Diésel: {BASE_L_PER_100KM.DIESEL}</p>
            <p className="font-semibold text-foreground">Gasolina: {BASE_L_PER_100KM.GASOLINA}</p>
          </div>
          <div className="rounded-lg border border-border p-3">
            <p className="text-muted-foreground">Ralentí (L/h)</p>
            <p className="font-semibold text-foreground mt-1">Diésel: {IDLE_L_PER_HOUR.DIESEL}</p>
            <p className="font-semibold text-foreground">Gasolina: {IDLE_L_PER_HOUR.GASOLINA}</p>
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground mt-3">
          Si conectas datos reales: km = GPS, idle = velocidad ~0 + motor encendido (o “tiempo sin avance”), litros = (odómetro + modelo) o directamente del gasto del conductor.
        </p>
      </Card>
    </div>
  )
}

export default DashboardPageContent
export { DashboardPageContent }
