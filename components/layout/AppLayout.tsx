"use client"

import * as React from "react"
import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"

import { cn } from "@/lib/utils"

import { hasPermissionAccessToRoute, useUserPermissions } from "@/hoc/permissions-context"
import { Header } from "./Header"
import { LayoutProvider, useLayout } from "./layout-context"
import { MobileSidebar, Sidebar } from "./Sidebar"

interface AppLayoutProps {
  children: React.ReactNode
}

function AppLayoutContent({ children }: AppLayoutProps) {
  const { collapsed } = useLayout()
  const pathname = usePathname()
  const router = useRouter()
  const { permissions, loading } = useUserPermissions()

  useEffect(() => {
    if (loading || !pathname || pathname === "/dashboard") {
      return
    }

    const protectedRoutes = ["/users", "/roles", "/devices", "/enrollment", "/attendance"]

    if (!protectedRoutes.includes(pathname)) {
      return
    }

    const hasAccess = hasPermissionAccessToRoute(pathname, permissions)

    if (!hasAccess) {
      router.replace("/dashboard")
    }
  }, [loading, pathname, permissions, router])

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <MobileSidebar />

      <div
        className={cn(
          "flex min-h-screen flex-col transition-[margin] duration-300 ease-in-out",
          collapsed ? "lg:ml-20" : "lg:ml-[200px] xl:ml-[280px]"
        )}
      >
        <Header />
        <main
          id="main-content"
          className="flex-1 overflow-y-auto p-4 sm:p-6"
          role="main"
          tabIndex={-1}
        >
          {children}
        </main>
      </div>
    </div>
  )
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <LayoutProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </LayoutProvider>
  )
}
