import { apiClient } from "./client"
import { ENV } from "@/lib/env"
import type { Viaje } from "@/lib/types"

export const viagesService = {
  async getById(id: number): Promise<Viaje> {
    return apiClient.get<Viaje>(`${ENV.VIAJES_BASE_URL}/viajes/${id}`)
  },

  async getByConductor(conductor_id: number): Promise<Viaje[]> {
    return apiClient.get<Viaje[]>(`${ENV.VIAJES_BASE_URL}/conductores/${conductor_id}/viajes`)
  },

  async getBySindicato(sindicato_id: number): Promise<Viaje[]> {
    return apiClient.get<Viaje[]>(`${ENV.VIAJES_BASE_URL}/sindicatos/${sindicato_id}/viajes`)
  },

  async updatePagado(id: number, pagado: "SI" | "NO"): Promise<Viaje> {
    // TODO: Implement once PATCH endpoint exists
    return apiClient.patch<Viaje>(`${ENV.VIAJES_BASE_URL}/viajes/${id}/pagado`, { pagado })
  },
}
