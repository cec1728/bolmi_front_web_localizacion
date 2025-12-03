"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { authService } from "@/lib/api/auth"
import { UserRole } from "@/lib/types"
import type { AuthUser } from "@/lib/types"

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  hasRole: (role: UserRole) => boolean
  canManageSindicato: (sindicatoId?: number) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const storedUser = authService.getStoredUser()
    if (storedUser) {
      setUser(storedUser)
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setError(null)
      const response = await authService.login({ email, password })
      setUser(response.user)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error en login"
      setError(message)
      throw err
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
    setError(null)
  }

  const hasRole = (role: UserRole): boolean => {
    return user?.rol_id === role
  }

  const canManageSindicato = (sindicatoId?: number): boolean => {
    if (!user) return false

    // Admin global can manage any sindicato
    if (user.rol_id === UserRole.ADMIN_GLOBAL) return true

    // Admin sindicato can only manage their own
    if (user.rol_id === UserRole.ADMIN_SINDICATO) {
      return !sindicatoId || user.sindicato_id === sindicatoId
    }

    return false
  }

  const value: AuthContextType = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
    hasRole,
    canManageSindicato,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
