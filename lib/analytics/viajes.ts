import { findClosestPointOnRoute } from "./distance"
import type { Viaje, Ruta, ViajeMetricas } from "@/lib/types"

const THRESHOLD_DISTANCE_M = 100 // 100 meters threshold

export function calculateDeviationMetrics(viaje: Viaje, ruta: Ruta): ViajeMetricas {
  const plannedRoute = ruta.recorrido_planeado || ruta.esquina || []
  const realRoute = viaje.ruta_vivo?.recorrido.map((r) => r.localizacion) || []

  // Calculate distances from real points to planned route
  const distances: number[] = []
  const pointsInRoute: number[] = []

  for (const realPoint of realRoute) {
    const { distance } = findClosestPointOnRoute(realPoint, plannedRoute)
    distances.push(distance)
    if (distance <= THRESHOLD_DISTANCE_M) {
      pointsInRoute.push(1)
    }
  }

  // Calculate metrics
  const avgDistance = distances.length > 0 ? distances.reduce((a, b) => a + b, 0) / distances.length : 0

  const percentageInRoute = realRoute.length > 0 ? (pointsInRoute.length / realRoute.length) * 100 : 0

  // Calculate time out of route
  let timeOutOfRoute = 0
  let totalTime = 0

  for (let i = 0; i < realRoute.length - 1; i++) {
    const current = realRoute[i]
    const next = realRoute[i + 1]

    if (current.hora && next.hora) {
      const currentTime = new Date(current.hora).getTime()
      const nextTime = new Date(next.hora).getTime()
      const timeDiff = nextTime - currentTime

      totalTime += timeDiff

      const { distance: currentDist } = findClosestPointOnRoute(current, plannedRoute)
      const { distance: nextDist } = findClosestPointOnRoute(next, plannedRoute)

      if (currentDist > THRESHOLD_DISTANCE_M && nextDist > THRESHOLD_DISTANCE_M) {
        timeOutOfRoute += timeDiff
      }
    }
  }

  const percentageTimeOutOfRoute = totalTime > 0 ? (timeOutOfRoute / totalTime) * 100 : 0

  // Calculate accuracy score (0-100)
  const distanceFactor = Math.min(avgDistance / 50, 1) // Normalize by 50m
  const scoreExactitud = Math.max(0, 100 - distanceFactor * 100)

  // Classify by rules
  let clasificacion: "VERDE" | "AMARILLO" | "ROJO"

  if (scoreExactitud >= 85 && percentageTimeOutOfRoute < 5) {
    clasificacion = "VERDE"
  } else if (
    (scoreExactitud >= 70 && scoreExactitud < 85) ||
    (percentageTimeOutOfRoute >= 5 && percentageTimeOutOfRoute < 15)
  ) {
    clasificacion = "AMARILLO"
  } else {
    clasificacion = "ROJO"
  }

  return {
    viaje_id: viaje.id,
    conductor_id: viaje.conductor_id,
    ruta_id: viaje.ruta_id,
    sindicato_id: viaje.sindicato_id || 0,
    distancia_promedio_a_ruta_m: Math.round(avgDistance),
    porcentaje_puntos_en_ruta: Math.round(percentageInRoute),
    porcentaje_tiempo_fuera_ruta: Math.round(percentageTimeOutOfRoute),
    score_exactitud: Math.round(scoreExactitud),
    clasificacion,
  }
}

export function aggregateMetricsByConductor(metricsList: ViajeMetricas[]): Record<number, any> {
  const aggregated: Record<number, any> = {}

  for (const metrics of metricsList) {
    if (!aggregated[metrics.conductor_id]) {
      aggregated[metrics.conductor_id] = {
        conductor_id: metrics.conductor_id,
        viajes_totales: 0,
        score_promedio: 0,
        porcentaje_puntos_en_ruta_promedio: 0,
        clasificaciones: { VERDE: 0, AMARILLO: 0, ROJO: 0 },
        scores: [],
      }
    }

    const agg = aggregated[metrics.conductor_id]
    agg.viajes_totales += 1
    agg.scores.push(metrics.score_exactitud)
    agg.porcentaje_puntos_en_ruta_promedio += metrics.porcentaje_puntos_en_ruta
    agg.clasificaciones[metrics.clasificacion] += 1
  }

  // Calculate averages
  for (const conductor_id in aggregated) {
    const agg = aggregated[conductor_id]
    agg.score_promedio = Math.round(agg.scores.reduce((a: number, b: number) => a + b, 0) / agg.scores.length)
    agg.porcentaje_puntos_en_ruta_promedio = Math.round(agg.porcentaje_puntos_en_ruta_promedio / agg.viajes_totales)
    delete agg.scores
  }

  return aggregated
}

export function aggregateMetricsBySindicato(metricsList: ViajeMetricas[]): any {
  const aggregated: Record<number, ViajeMetricas[]> = {}

  for (const metrics of metricsList) {
    if (!aggregated[metrics.sindicato_id]) {
      aggregated[metrics.sindicato_id] = []
    }
    aggregated[metrics.sindicato_id].push(metrics)
  }

  const result: Record<number, any> = {}

  for (const sindicato_id in aggregated) {
    const metrics = aggregated[sindicato_id]
    const scores = metrics.map((m) => m.score_exactitud)
    const clasificaciones = { VERDE: 0, AMARILLO: 0, ROJO: 0 }

    for (const m of metrics) {
      clasificaciones[m.clasificacion] += 1
    }

    result[sindicato_id] = {
      sindicato_id: Number(sindicato_id),
      viajes_totales: metrics.length,
      score_promedio: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
      clasificaciones,
      porcentaje_viajes_correctos: Math.round((clasificaciones.VERDE / metrics.length) * 100),
    }
  }

  return result
}
