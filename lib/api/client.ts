import { TOKEN_KEY, USER_KEY } from "@/lib/env"
import type { ApiError } from "@/lib/types"

class ApiClient {
  private getToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem(TOKEN_KEY)
  }

  private getHeaders(): HeadersInit {
    const token = this.getToken()
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  async request<T>(method: string, url: string, data?: unknown): Promise<T> {
    try {
      const options: RequestInit = {
        method,
        headers: this.getHeaders(),
      }

      if (data && (method === "POST" || method === "PATCH" || method === "PUT")) {
        options.body = JSON.stringify(data)
      }

      const response = await fetch(url, options)

      // Handle 401 - unauthorized
      if (response.status === 401) {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
        window.location.href = "/login"
        throw new Error("No autorizado")
      }

      if (!response.ok) {
        const error: ApiError = {
          message: `Error ${response.status}`,
          status: response.status,
        }
        try {
          const data = await response.json()
          error.message = data.message || error.message
        } catch {}
        throw error
      }

      const result = await response.json()
      return result
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error("Error en la solicitud")
    }
  }

  get<T>(url: string): Promise<T> {
    return this.request<T>("GET", url)
  }

  post<T>(url: string, data?: unknown): Promise<T> {
    return this.request<T>("POST", url, data)
  }

  patch<T>(url: string, data?: unknown): Promise<T> {
    return this.request<T>("PATCH", url, data)
  }

  put<T>(url: string, data?: unknown): Promise<T> {
    return this.request<T>("PUT", url, data)
  }
}

export const apiClient = new ApiClient()
