export const ENV = {
  // Microservices URLs
  AUTH_BASE_URL: process.env.NEXT_PUBLIC_AUTH_BASE_URL || "https://bolmi-auth-service.vercel.app",
  SINDICATO_BASE_URL: process.env.NEXT_PUBLIC_SINDICATO_BASE_URL || "https://bolmi-sindicato-service.vercel.app",
  VIAJES_BASE_URL: process.env.NEXT_PUBLIC_VIAJES_BASE_URL || "https://bolmi-viajes-service.vercel.app",
  RUTAS_BASE_URL: process.env.NEXT_PUBLIC_RUTAS_BASE_URL || "https://bolmi-rutas-service.vercel.app",
  VEHICULO_BASE_URL: process.env.NEXT_PUBLIC_VEHICULO_BASE_URL || "https://bolmi-vehiculo-service.vercel.app",
}

// Token storage key
export const TOKEN_KEY = "bolmi_auth_token"
export const USER_KEY = "bolmi_auth_user"
