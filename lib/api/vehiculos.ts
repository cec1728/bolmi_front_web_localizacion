import { apiClient } from "./client"
import { ENV } from "@/lib/env"
import type { Vehiculo } from "@/lib/types"

export const vehiculosService = {
  async getByConductor(conductor_id: number): Promise<Vehiculo[]> {
    return apiClient.get<Vehiculo[]>(`${ENV.VEHICULO_BASE_URL}/conductores/${conductor_id}/vehiculos`)
  },

  async getById(id: number): Promise<Vehiculo> {
    return apiClient.get<Vehiculo>(`${ENV.VEHICULO_BASE_URL}/vehiculos/${id}`)
  },

  async create(data: Vehiculo): Promise<Vehiculo> {
    return apiClient.post<Vehiculo>(`${ENV.VEHICULO_BASE_URL}/vehiculos`, data)
  },
}
