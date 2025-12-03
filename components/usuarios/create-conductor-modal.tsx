"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/context/auth-context"
import { UserRole } from "@/lib/types"
import { authService } from "@/lib/api/auth"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertCircle, Loader2 } from "lucide-react"

interface CreateConductorModalProps {
  onClose: () => void
  onSuccess: () => void
}

const SEXOS = ["MASCULINO", "FEMENINO"]
const DEPARTAMENTOS = ["La Paz", "Cochabamba", "Santa Cruz", "Oruro", "Potosí", "Chuquisaca", "Tarija", "Beni", "Pando"]

export function CreateConductorModal({ onClose, onSuccess }: CreateConductorModalProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userType, setUserType] = useState<"conductor" | "admin">("conductor")

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
    ci: "",
    nombre: "",
    apellido: "",
    zona: "",
    telefono: "",
    direccion: "",
    sexo: "MASCULINO",
    departamento: "La Paz",
    nacionalidad: "Boliviana",
    fecha_nacimiento: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate
    if (!formData.email || !formData.password) {
      setError("Email y contraseña son requeridos")
      return
    }

    if (formData.password !== formData.passwordConfirm) {
      setError("Las contraseñas no coinciden")
      return
    }

    setLoading(true)

    try {
      await authService.registerConductor({
        username: formData.username || formData.email.split("@")[0],
        email: formData.email,
        password: formData.password,
        persona: {
          ci: formData.ci,
          nombre: formData.nombre,
          apellido: formData.apellido,
          zona: formData.zona,
          telefono: formData.telefono,
          direccion: formData.direccion,
          sexo: formData.sexo,
          departamento: formData.departamento,
          nacionalidad: formData.nacionalidad,
          fecha_nacimiento: formData.fecha_nacimiento,
        },
        rol_id: userType === "conductor" ? UserRole.CONDUCTOR : UserRole.ADMIN_SINDICATO,
        sindicato_id: user?.sindicato_id || 1,
      })

      onSuccess()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al crear usuario"
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <Card className="w-full max-w-2xl my-8">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Crear {userType === "conductor" ? "Conductor" : "Admin Sindicato"}
          </h2>

          {error && (
            <div className="flex gap-3 rounded-lg bg-red-500/20 p-4 mb-6">
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* User Type Selector */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setUserType("conductor")}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                userType === "conductor"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              Conductor
            </button>
            <button
              onClick={() => setUserType("admin")}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                userType === "admin"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              Admin Sindicato
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Account Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Información de Cuenta</h3>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="email"
                  name="email"
                  placeholder="Correo electrónico"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="col-span-2 rounded-lg border border-input bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Contraseña"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="rounded-lg border border-input bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                />
                <input
                  type="password"
                  name="passwordConfirm"
                  placeholder="Confirmar contraseña"
                  value={formData.passwordConfirm}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="rounded-lg border border-input bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                />
              </div>
            </div>

            {/* Personal Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Información Personal</h3>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="ci"
                  placeholder="CI/Cédula"
                  value={formData.ci}
                  onChange={handleChange}
                  disabled={loading}
                  className="rounded-lg border border-input bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                />
                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  disabled={loading}
                  className="rounded-lg border border-input bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                />
                <input
                  type="text"
                  name="apellido"
                  placeholder="Apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  disabled={loading}
                  className="rounded-lg border border-input bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                />
                <input
                  type="date"
                  name="fecha_nacimiento"
                  value={formData.fecha_nacimiento}
                  onChange={handleChange}
                  disabled={loading}
                  className="rounded-lg border border-input bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                />
                <select
                  name="sexo"
                  value={formData.sexo}
                  onChange={handleChange}
                  disabled={loading}
                  className="rounded-lg border border-input bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                >
                  {SEXOS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <select
                  name="departamento"
                  value={formData.departamento}
                  onChange={handleChange}
                  disabled={loading}
                  className="rounded-lg border border-input bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                >
                  {DEPARTAMENTOS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Información de Contacto</h3>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="tel"
                  name="telefono"
                  placeholder="Teléfono"
                  value={formData.telefono}
                  onChange={handleChange}
                  disabled={loading}
                  className="rounded-lg border border-input bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                />
                <input
                  type="text"
                  name="zona"
                  placeholder="Zona"
                  value={formData.zona}
                  onChange={handleChange}
                  disabled={loading}
                  className="rounded-lg border border-input bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                />
                <input
                  type="text"
                  name="direccion"
                  placeholder="Dirección"
                  value={formData.direccion}
                  onChange={handleChange}
                  disabled={loading}
                  className="col-span-2 rounded-lg border border-input bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-6 border-t border-border">
              <Button
                type="button"
                onClick={onClose}
                disabled={loading}
                variant="outline"
                className="flex-1 bg-transparent"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creando...
                  </>
                ) : (
                  "Crear Usuario"
                )}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}
