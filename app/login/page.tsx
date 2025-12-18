"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertCircle, Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { login, isAuthenticated, loading: authLoading } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log("[LoginPage] isAuthenticated:", isAuthenticated, "authLoading:", authLoading)
    if (!authLoading && isAuthenticated) {
      console.log("[LoginPage] Usuario autenticado, navegando a /dashboard")
      router.replace("/dashboard")
    }
  }, [isAuthenticated, authLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    console.log("[LoginPage] Intentando login con", email)

    try {
      await login(email, password)
      console.log("[LoginPage] login() resuelto sin error")
      // NO hagas push aquí, el useEffect de arriba se encargará
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error en autenticación"
      setError(message)
      console.error("[LoginPage] Error en login:", message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-bolmi-black via-bolmi-secondary to-bolmi-black px-4">
      <div className="w-full max-w-md">
        {/* Logo / Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-bolmi-gold">
            <span className="text-xl font-bold text-bolmi-black">B</span>
          </div>
          <h1 className="text-3xl font-bold text-bolmi-text-light">Bolmi Admin</h1>
          <p className="mt-2 text-bolmi-text-muted">Panel de control para transporte público</p>
        </div>

        {/* Login Card */}
        <Card className="border-0 bg-bolmi-secondary shadow-2xl">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Alert */}
              {error && (
                <div className="flex gap-3 rounded-lg bg-red-500/20 p-4">
                  <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-400" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-bolmi-text-light">
                  Correo Electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@bolmi.com"
                  disabled={loading || authLoading}
                  required
                  className="w-full rounded-lg border border-bolmi-black/20 bg-bolmi-black/30 px-4 py-2.5 text-bolmi-text-light placeholder-bolmi-text-muted transition focus:border-bolmi-gold focus:outline-none focus:ring-2 focus:ring-bolmi-gold/20 disabled:opacity-50"
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-bolmi-text-light">
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading || authLoading}
                  required
                  className="w-full rounded-lg border border-bolmi-black/20 bg-bolmi-black/30 px-4 py-2.5 text-bolmi-text-light placeholder-bolmi-text-muted transition focus:border-bolmi-gold focus:outline-none focus:ring-2 focus:ring-bolmi-gold/20 disabled:opacity-50"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading || authLoading || !email || !password}
                className="w-full rounded-lg bg-bolmi-gold py-2.5 font-semibold text-bolmi-black transition hover:bg-bolmi-gold/90 disabled:opacity-50"
              >
                {loading || authLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Autenticando...
                  </>
                ) : (
                  "Ingresar"
                )}
              </Button>

              {/* Demo Info */}
              <div className="rounded-lg bg-bolmi-black/40 p-4 text-center text-xs text-bolmi-text-muted">
                <p>Demo: usa credenciales de prueba</p>
                <p className="mt-1">admin@bolmi.com / password123</p>
              </div>
            </form>
          </div>
        </Card>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-bolmi-text-muted">
          © 2025 Bolmi. Plataforma de Transporte Público.
        </p>
      </div>
    </div>
  )
}
