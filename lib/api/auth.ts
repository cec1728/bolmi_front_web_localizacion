import { apiClient } from "./client"
import { ENV } from "@/lib/env"
import { TOKEN_KEY, USER_KEY } from "@/lib/env"
import type { AuthUser, LoginPayload, LoginResponse, Usuario } from "@/lib/types"

export const authService = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(`${ENV.AUTH_BASE_URL}/auth/login`, payload)

    // Store token and user
    localStorage.setItem(TOKEN_KEY, response.access_token)
    localStorage.setItem(USER_KEY, JSON.stringify(response.user))

    return response
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
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
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
