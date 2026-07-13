"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { useSession } from "next-auth/react"

interface PermissionContextValue {
  permissions: string[]
  loading: boolean
  error: string | null
  refreshPermissions: () => Promise<void>
}

const PermissionContext = createContext<PermissionContextValue | undefined>(undefined)

const ROUTE_PERMISSION_HINTS: Record<string, string[]> = {
  "/dashboard": ["dashboard", "view_statistics", "admin_dashboard_view"],
  "/users": ["user_read", "user_manage", "user_create", "user_management", "user"],
  "/roles": ["role_read", "role_manage", "role_create", "permission_read", "permission_manage", "permission_create", "setup_read", "setup_manage", "setup_create", "role_management", "permission", "setup"],
  "/devices": ["device_read", "device_manage", "device_create", "device_sync", "device_management", "device"],
  "/enrollment": ["staff_read", "staff_manage", "staff_create", "biometric_enrollment", "enrollment", "staff"],
  "/attendance": ["attendance_read", "manual_attendance_manage", "manual_attendance_create", "manual_attendance_read", "manual_attendance_delete", "attendance"],
}

function normalizeText(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()
}

function collectPermissionValues(value: unknown, values: Set<string>) {
  if (typeof value === "string") {
    values.add(value)
    return
  }

  if (Array.isArray(value)) {
    value.forEach((item) => collectPermissionValues(item, values))
    return
  }

  if (!value || typeof value !== "object") {
    return
  }

  const entry = value as Record<string, unknown>

  if (typeof entry.name === "string") {
    values.add(entry.name)
  }

  if (typeof entry.id === "string") {
    values.add(entry.id)
  }

  if (typeof entry.categoryName === "string") {
    values.add(entry.categoryName)
  }

  if (typeof entry.permissionName === "string") {
    values.add(entry.permissionName)
  }

  if (typeof entry.permissionId === "string") {
    values.add(entry.permissionId)
  }

  Object.values(entry).forEach((nestedValue) => {
    collectPermissionValues(nestedValue, values)
  })
}

function normalizePermissions(payload: unknown): string[] {
  const values = new Set<string>()
  collectPermissionValues(payload, values)
  return Array.from(values)
}

export function hasPermissionAccessToRoute(route: string, permissions: string[]): boolean {
  const normalizedRoute = normalizeText(route)
  const directMatch = permissions.some((permission) => {
    const normalizedPermission = normalizeText(permission)
    return (
      normalizedPermission === normalizedRoute ||
      normalizedPermission.includes(normalizedRoute)
    )
  })

  if (directMatch) {
    return true
  }

  const routeHints = ROUTE_PERMISSION_HINTS[route] ?? []
  return permissions.some((permission) => {
    const normalizedPermission = normalizeText(permission)
    return routeHints.some((hint) => {
      const normalizedHint = normalizeText(hint)
      return normalizedPermission.includes(normalizedHint)
    })
  })
}

export function PermissionProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const [permissions, setPermissions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPermissions = useCallback(async () => {
    if (status !== "authenticated") {
      setPermissions([])
      setError(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/users/permissions/current-user")

      if (!response.ok) {
        throw new Error(`Failed to load permissions (${response.status})`)
      }

      const payload = await response.json()
      setPermissions(normalizePermissions(payload))
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to load permissions"
      setPermissions([])
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [status])

  useEffect(() => {
    void fetchPermissions()
  }, [fetchPermissions])

  const value = useMemo<PermissionContextValue>(
    () => ({
      permissions,
      loading,
      error,
      refreshPermissions: fetchPermissions,
    }),
    [error, fetchPermissions, loading, permissions]
  )

  return (
    <PermissionContext.Provider value={value}>{children}</PermissionContext.Provider>
  )
}

export function useUserPermissions() {
  const context = useContext(PermissionContext)

  if (!context) {
    throw new Error("useUserPermissions must be used within a PermissionProvider")
  }

  return context
}
