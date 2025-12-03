// Auth
export interface AuthUser {
  id: string
  email: string
  rol_id: number
  sindicato_id?: number
  persona?: {
    nombre: string
    apellido: string
    ci: string
  }
}

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  user: AuthUser
}

// Roles
export enum UserRole {
  CONDUCTOR = 1,
  ADMIN_SINDICATO = 2,
  ADMIN_GLOBAL = 3,
}

// Sindicato
export interface Sindicato {
  id: number
  nombre: string
  descripcion?: string
  zona?: string
  telefono?: string
  direccion?: string
  createdAt?: string
}

// Persona
export interface Persona {
  ci: string
  nombre: string
  apellido: string
  zona?: string
  telefono?: string
  direccion?: string
  sexo?: string
  departamento?: string
  nacionalidad?: string
  fecha_nacimiento?: string
}

// Usuario
export interface Usuario {
  id: string
  username: string
  email: string
  rol_id: number
  sindicato_id?: number
  persona?: Persona
  createdAt?: string
  activo?: boolean
}

// Ruta
export interface EsquinaRuta {
  latitud: number
  longitud: number
  orden?: number
}

export interface Ruta {
  id: number
  nombre: string
  numero?: string
  recorrido_planeado?: EsquinaRuta[]
  esquina?: EsquinaRuta[]
  sindicato_id?: number
  createdAt?: string
}

// Vehículo
export interface Vehiculo {
  id: number
  placa: string
  marca?: string
  modelo?: string
  color?: string
  conductor_id?: number
  sindicato_id?: number
  createdAt?: string
}

// Localizacion (GPS)
export interface Localizacion {
  latitud: number
  longitud: number
  hora?: string
}

// Ruta Viva (durante un viaje)
export interface RutaViva {
  recorrido: {
    localizacion: Localizacion
  }[]
}

// Viaje
export interface Viaje {
  id: number
  conductor_id: number
  ruta_id: number
  vehiculo_id?: number
  sindicato_id?: number
  estado: "EN_CURSO" | "FINALIZADO"
  pagado: "SI" | "NO"
  fecha_inicio?: string
  fecha_fin?: string
  ruta_vivo?: RutaViva
  duracion_minutos?: number
  distancia_km?: number
  createdAt?: string
}

// Analítica de Viaje
export interface ViajeMetricas {
  viaje_id: number
  conductor_id: number
  ruta_id: number
  sindicato_id: number
  distancia_promedio_a_ruta_m: number
  porcentaje_puntos_en_ruta: number
  porcentaje_tiempo_fuera_ruta: number
  score_exactitud: number
  clasificacion: "VERDE" | "AMARILLO" | "ROJO"
  fecha?: string
}

// Error
export interface ApiError {
  message: string
  status?: number
  code?: string
}
