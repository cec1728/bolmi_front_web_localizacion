"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"
import type { Usuario } from "@/lib/types"
import { UserRole } from "@/lib/types"

interface UserDetailModalProps {
  user: Usuario
  onClose: () => void
}

export function UserDetailModal({ user, onClose }: UserDetailModalProps) {
  const getRolLabel = (rol_id: number) => {
    switch (rol_id) {
      case UserRole.CONDUCTOR:
        return "Conductor"
      case UserRole.ADMIN_SINDICATO:
        return "Admin Sindicato"
      case UserRole.ADMIN_GLOBAL:
        return "Admin Global"
      default:
        return "Usuario"
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <Card className="w-full max-w-2xl my-8">
        <div className="p-8">
          <div className="flex items-start justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Detalles del Usuario</h2>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Account Info */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Información de Cuenta</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Rol</p>
                  <p className="font-medium text-foreground">{getRolLabel(user.rol_id)}</p>
                </div>
              </div>
            </div>

            {/* Personal Info */}
            {user.persona && (
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Información Personal</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Nombre Completo</p>
                    <p className="font-medium text-foreground">
                      {user.persona.nombre} {user.persona.apellido}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">CI/Cédula</p>
                    <p className="font-medium text-foreground">{user.persona.ci}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Sexo</p>
                    <p className="font-medium text-foreground">{user.persona.sexo || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Departamento</p>
                    <p className="font-medium text-foreground">{user.persona.departamento || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Zona</p>
                    <p className="font-medium text-foreground">{user.persona.zona || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Teléfono</p>
                    <p className="font-medium text-foreground">{user.persona.telefono || "-"}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-6 border-t border-border">
              <Button onClick={onClose} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
