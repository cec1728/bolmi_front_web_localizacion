"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/context/auth-context"
import type { UserRole } from "@/lib/types"
import { Sidebar } from "./sidebar"
import { Header } from "./header"

interface DashboardLayoutProps {
  children: React.ReactNode
  requiredRoles?: UserRole[]
}

export function DashboardLayout({ children, requiredRoles }: DashboardLayoutProps) {
  const router = useRouter()
  const { user, loading, isAuthenticated } = useAuth()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    router.push("/login")
    return null
  }

  if (requiredRoles && !requiredRoles.includes(user?.rol_id as UserRole)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">No Autorizado</h1>
          <p className="text-muted-foreground">No tienes permiso para acceder a esta página</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-64">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
