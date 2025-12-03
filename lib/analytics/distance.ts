const EARTH_RADIUS_M = 6371000 // Earth radius in meters

export function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

export function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dLat = toRadians(lat2 - lat1)
  const dLon = toRadians(lon2 - lon1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return EARTH_RADIUS_M * c
}

export function findClosestPointOnRoute(
  realPoint: { latitud: number; longitud: number },
  plannedRoute: { latitud: number; longitud: number }[],
): { distance: number; closest: { latitud: number; longitud: number } } {
  let minDistance = Number.POSITIVE_INFINITY
  let closestPoint = plannedRoute[0]

  for (const point of plannedRoute) {
    const distance = haversineDistance(realPoint.latitud, realPoint.longitud, point.latitud, point.longitud)
    if (distance < minDistance) {
      minDistance = distance
      closestPoint = point
    }
  }

  return { distance: minDistance, closest: closestPoint }
}
