"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/context/auth-context"
import { UserRole } from "@/lib/types"
import {
  LayoutDashboard,
  Users,
  Truck,
  MapPin,
  FileText,
  Building2,
  LogOut,
  Menu,
  X,
  BarChart3,           // 👈 NUEVO
} from "lucide-react"
import { useState } from "react"

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: [UserRole.ADMIN_SINDICATO, UserRole.ADMIN_GLOBAL],
  },
  {
    label: "Reportes",
    href: "/dashboard/reportes",     // 👈 NUEVO
    icon: BarChart3,
    roles: [UserRole.ADMIN_SINDICATO, UserRole.ADMIN_GLOBAL],
  },
  {
    label: "Usuarios",
    href: "/dashboard/usuarios",
    icon: Users,
    roles: [UserRole.ADMIN_SINDICATO, UserRole.ADMIN_GLOBAL],
  },
  {
    label: "Viajes",
    href: "/dashboard/viajes",
    icon: FileText,
    roles: [UserRole.ADMIN_SINDICATO, UserRole.ADMIN_GLOBAL],
  },
  {
    label: "Conductores",
    href: "/dashboard/conductores",
    icon: Users,
    roles: [UserRole.ADMIN_SINDICATO, UserRole.ADMIN_GLOBAL],
  },
  {
    label: "Vehículos",
    href: "/dashboard/vehiculos",
    icon: Truck,
    roles: [UserRole.ADMIN_SINDICATO, UserRole.ADMIN_GLOBAL],
  },
  {
    label: "Rutas",
    href: "/dashboard/rutas",
    icon: MapPin,
    roles: [UserRole.ADMIN_SINDICATO, UserRole.ADMIN_GLOBAL],
  },
  {
    label: "Sindicatos",
    href: "/dashboard/sindicatos",
    icon: Building2,
    roles: [UserRole.ADMIN_GLOBAL],
  },
]

export function Sidebar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const visibleItems = NAV_ITEMS.filter((item) => user && item.roles.includes(user.rol_id as UserRole))

  return (
    <>
      {/* Mobile menu button */}
      <button onClick={() => setOpen(!open)} className="fixed left-4 top-4 z-40 md:hidden text-bolmi-text-light">
        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-30 h-screen w-64 bg-bolmi-secondary border-r border-bolmi-black/20 transition-transform md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="border-b border-bolmi-black/20 p-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-bolmi-gold flex items-center justify-center">
                <span className="font-bold text-bolmi-black">B</span>
              </div>
              <div>
                <h1 className="font-bold text-bolmi-text-light">Bolmi</h1>
                <p className="text-xs text-bolmi-text-muted">Admin</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-4">
            <ul className="space-y-1">
              {visibleItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                        isActive
                          ? "bg-bolmi-gold text-bolmi-black"
                          : "text-bolmi-text-muted hover:text-bolmi-text-light hover:bg-bolmi-black/20"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* User & Logout */}
          <div className="border-t border-bolmi-black/20 p-4">
            <div className="mb-4 rounded-lg bg-bolmi-black/20 p-3">
              <p className="text-xs text-bolmi-text-muted">Conectado como:</p>
              <p className="text-sm font-medium text-bolmi-text-light truncate">{user?.email}</p>
            </div>
            <button
              onClick={() => {
                logout()
                setOpen(false)
              }}
              className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-bolmi-text-muted hover:text-bolmi-text-light hover:bg-bolmi-black/20 transition"
            >
              <LogOut className="h-4 w-4" />
              <span>Salir</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 z-20 bg-black/50 md:hidden" onClick={() => setOpen(false)} />}
    </>
  )
}
