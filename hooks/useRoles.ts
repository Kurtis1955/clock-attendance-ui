"use client"

import { useCallback, useEffect, useState } from "react"

export interface RoleOption {
  id: string
  name: string
  description?: string
}

interface UseRolesResult {
  roles: RoleOption[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useRoles(): UseRolesResult {
  const [roles, setRoles] = useState<RoleOption[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRoles = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/roles?paginate=true&page=0 &size=200`)

      if (!response.ok) {
        throw new Error(`Failed to fetch roles (${response.status})`)
      }

      const json = await response.json()
      const content = json?.data?.content ?? json?.data ?? json ?? []
      const mapped = (Array.isArray(content) ? content : []).map(
        (role: { id: string; name: string; description?: string }) => ({
          id: role.id,
          name: role.name,
          description: role.description,
        })
      )

      setRoles(mapped)
    } catch (fetchError) {
      const message =
        fetchError instanceof Error
          ? fetchError.message
          : "Failed to load roles"
      setError(message)
      setRoles([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRoles()
  }, [fetchRoles])

  return { roles, loading, error, refetch: fetchRoles }
}
