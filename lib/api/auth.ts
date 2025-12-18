// lib/api/auth.ts
import { apiClient } from "./client"
import { ENV, TOKEN_KEY, USER_KEY } from "@/lib/env"
import type { AuthUser, LoginPayload, Usuario } from "@/lib/types"

export const authService = {
  async login(payload: LoginPayload): Promise<AuthUser> {
    // 1) Login: obtener token
    const loginResp = await apiClient.post<{ access_token: string; token_type: string }>(
      `${ENV.AUTH_BASE_URL}/auth/login`,
      payload,
    )

    const token = loginResp.access_token
    if (!token) {
      throw new Error("No se recibió access_token desde el backend")
    }

    // Guardar token
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, token)
    }

    // 2) Llamar a /auth/me con ese token (apiClient ya debería inyectarlo en headers)
    const user = await this.getMe()

    // Guardar user
    if (typeof window !== "undefined") {
      localStorage.setItem(USER_KEY, JSON.stringify(user))
    }

    return user
  },

  async getMe(): Promise<AuthUser> {
    return apiClient.get<AuthUser>(`${ENV.AUTH_BASE_URL}/auth/me`)
  },
    async registerConductor(data: {
    username: string
    email: string
    password: string
    persona: {
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
    rol_id: number
    sindicato_id: number
  }): Promise<Usuario> {
    return apiClient.post<Usuario>(`${ENV.AUTH_BASE_URL}/auth/register-conductor`, data)
  },

  logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    }
  },

  getStoredUser(): AuthUser | null {
    if (typeof window === "undefined") return null
    const user = localStorage.getItem(USER_KEY)
    return user ? JSON.parse(user) : null
  },

  getStoredToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem(TOKEN_KEY)
  },
}
