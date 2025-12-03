import { apiClient } from "./client"
import { ENV } from "@/lib/env"
import type { Ruta } from "@/lib/types"

export const rutasService = {
  async list(): Promise<Ruta[]> {
    return apiClient.get<Ruta[]>(`${ENV.RUTAS_BASE_URL}/rutas`)
  },

  async getById(id: number): Promise<Ruta> {
    return apiClient.get<Ruta>(`${ENV.RUTAS_BASE_URL}/rutas/${id}`)
  },
}
