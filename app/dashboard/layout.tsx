import type React from "react"

import { AuthProvider } from "@/lib/context/auth-context"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthProvider>
  )
}
