"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/context/auth-context"
import { UserRole } from "@/lib/types"
import { sindicatosService } from "@/lib/api/sindicatos"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { Usuario } from "@/lib/types"
import { Users, Plus, Eye } from "lucide-react"
import { CreateConductorModal } from "@/components/usuarios/create-conductor-modal"
import { UserDetailModal } from "@/components/usuarios/user-detail-modal"

export default function UsuariosPage() {
  const { user } = useAuth()
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<number | null>(null)

  const loadUsuarios = async () => {
    try {
      setLoading(true)
      if (user?.sindicato_id) {
        const conductores = await sindicatosService.getConductores(user.sindicato_id)
        setUsuarios(conductores)
      }
    } catch (error) {
      console.error("Error loading usuarios:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsuarios()
  }, [user?.sindicato_id])

  const filteredUsuarios = usuarios.filter((u) => {
    const matchesSearch =
      u.persona?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.persona?.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.persona?.ci?.includes(searchTerm)

    const matchesRole = roleFilter ? u.rol_id === roleFilter : true

    return matchesSearch && matchesRole
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Users className="h-8 w-8" />
            Gestión de Usuarios
          </h1>
          <p className="text-muted-foreground mt-1">Crea y administra conductores y admins de sindicato</p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
        >
          <Plus className="h-4 w-4" />
          Crear Usuario
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Buscar por nombre, email o CI..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="rounded-lg border border-input bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <select
          value={roleFilter || ""}
          onChange={(e) => setRoleFilter(e.target.value ? Number(e.target.value) : null)}
          className="rounded-lg border border-input bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="">Todos los roles</option>
          <option value={UserRole.CONDUCTOR}>Conductor</option>
          <option value={UserRole.ADMIN_SINDICATO}>Admin Sindicato</option>
        </select>
        <div></div>
      </div>

      {/* Users Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Nombre</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">CI</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Rol</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    Cargando usuarios...
                  </td>
                </tr>
              ) : filteredUsuarios.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    No hay usuarios que mostrar
                  </td>
                </tr>
              ) : (
                filteredUsuarios.map((usuario) => (
                  <tr key={usuario.id} className="border-b border-border hover:bg-secondary/50 transition">
                    <td className="px-6 py-4">
                      <p className="font-medium text-foreground">
                        {usuario.persona?.nombre} {usuario.persona?.apellido}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{usuario.email}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{usuario.persona?.ci || "-"}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-blue-500/20 px-3 py-1 text-xs font-medium text-blue-400">
                        {usuario.rol_id === UserRole.CONDUCTOR ? "Conductor" : "Admin"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Button onClick={() => setSelectedUser(usuario)} variant="outline" size="sm" className="gap-2">
                        <Eye className="h-4 w-4" />
                        Ver
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modals */}
      {showCreateModal && (
        <CreateConductorModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false)
            loadUsuarios()
          }}
        />
      )}

      {selectedUser && <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />}
    </div>
  )
}
