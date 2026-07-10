"use client"

import { useCallback, useEffect, useState } from "react"

import {
  getAllPermissionIds,
  groupPermissionsByCategory,
  type Permission,
  type PermissionCategory,
} from "@/lib/permissions"

interface UsePermissionsResult {
  categories: PermissionCategory[]
  permissions: Permission[]
  allPermissionIds: string[]
  totalCount: number
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function usePermissions(): UsePermissionsResult {
  const [categories, setCategories] = useState<PermissionCategory[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [allPermissionIds, setAllPermissionIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPermissions = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(
        "/api/permission?paginate=true&page=0&size=500"
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch permissions (${response.status})`)
      }

      const json = await response.json()
      const content: Permission[] = json ?? []
      const grouped = groupPermissionsByCategory(content)
      const ids = getAllPermissionIds(content)

      console.log("permission content>>", content, json, "permission ids", ids )

      setPermissions(content)
      setCategories(grouped)
      setAllPermissionIds(ids)
    } catch (fetchError) {
      const message =
        fetchError instanceof Error
          ? fetchError.message
          : "Failed to load permissions"
      setError(message)
      setPermissions([])
      setCategories([])
      setAllPermissionIds([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPermissions()
  }, [fetchPermissions])

  return {
    categories,
    permissions,
    allPermissionIds,
    totalCount: allPermissionIds.length,
    loading,
    error,
    refetch: fetchPermissions,
  }
}
