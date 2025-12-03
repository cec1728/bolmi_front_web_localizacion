import { apiClient } from "./client"
import { ENV } from "@/lib/env"
import type { Sindicato, Usuario } from "@/lib/types"

export const sindicatosService = {
  async list(): Promise<Sindicato[]> {
    return apiClient.get<Sindicato[]>(`${ENV.SINDICATO_BASE_URL}/sindicatos`)
  },

  async getById(id: number): Promise<Sindicato> {
    return apiClient.get<Sindicato>(`${ENV.SINDICATO_BASE_URL}/sindicatos/${id}`)
  },

  async getConductores(sindicato_id: number): Promise<Usuario[]> {
    return apiClient.get<Usuario[]>(`${ENV.SINDICATO_BASE_URL}/sindicatos/${sindicato_id}/conductores`)
  },

  async getViajes(sindicato_id: number): Promise<any[]> {
    // TODO: Implement once endpoint exists
    return []
  },
}
