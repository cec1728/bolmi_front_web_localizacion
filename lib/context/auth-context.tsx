// lib/context/auth-context.tsx
"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { authService } from "@/lib/api/auth"
import { UserRole } from "@/lib/types"
import type { AuthUser } from "@/lib/types"
import { USER_KEY } from "@/lib/env"

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

  // 🔹 Restaurar sesión al cargar la app
  useEffect(() => {
    const storedUser = authService.getStoredUser()
    const token = authService.getStoredToken()

    if (storedUser) {
      console.log("[AuthContext] Usuario restaurado desde localStorage:", storedUser.email)
      setUser(storedUser)
      setLoading(false)
      return
    }

    if (token) {
      console.log("[AuthContext] Hay token sin user → llamando /auth/me")
      authService
        .getMe()
        .then((u) => {
          console.log("[AuthContext] /auth/me OK para:", u.email)
          setUser(u)
          if (typeof window !== "undefined") {
            localStorage.setItem(USER_KEY, JSON.stringify(u))
          }
        })
        .catch((err) => {
          console.warn("[AuthContext] /auth/me falló, limpiando sesión:", err)
          authService.logout()
          setUser(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  // 🔹 LOGIN: ahora authService.login devuelve directamente AuthUser
  const login = async (email: string, password: string) => {
    try {
      setError(null)
      setLoading(true)
      console.log("[AuthContext] login() intentando con:", email)

      const user = await authService.login({ email, password })
      console.log("[AuthContext] login() OK, usuario:", user.email)

      setUser(user)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error en login"
      console.error("[AuthContext] login() ERROR:", message)
      setError(message)
      throw err
    } finally {
      setLoading(false)
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
    if (user.rol_id === UserRole.ADMIN_GLOBAL) return true
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
