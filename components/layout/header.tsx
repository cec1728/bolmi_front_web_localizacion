"use client"

import { useAuth } from "@/lib/context/auth-context"
import { UserRole } from "@/lib/types"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function Header() {
  const { user } = useAuth()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const getRolLabel = (rol_id?: number): string => {
    switch (rol_id) {
      case UserRole.ADMIN_SINDICATO:
        return "Admin Sindicato"
      case UserRole.ADMIN_GLOBAL:
        return "Admin Global"
      default:
        return "Usuario"
    }
  }

  return (
    <header className="border-b border-border bg-card px-6 py-4 sticky top-0 z-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Panel de Control</h1>
          <p className="text-sm text-muted-foreground">{getRolLabel(user?.rol_id)}</p>
        </div>

        <div className="flex items-center gap-4">
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg hover:bg-secondary text-foreground transition"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
