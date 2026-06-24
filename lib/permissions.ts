export interface Permission {
  id: string
  name: string
  description: string
  enabled: boolean
  categoryId: string
  categoryName: string
  icon: string | null
}

export interface PermissionCategory {
  categoryId: string
  categoryName: string
  permissions: Permission[]
}

export interface PermissionsApiResponse {
  message: string
  statusCode: number
  data: {
    content: Permission[]
    totalElements: number
    totalPages: number
    number: number
    size: number
  }
  dateTime: string
}

export function groupPermissionsByCategory(
  permissions: Permission[]
): PermissionCategory[] {
  const categoryMap = new Map<string, PermissionCategory>()

  for (const permission of permissions) {
    if (!permission.enabled) continue

    const existing = categoryMap.get(permission.categoryId)

    if (existing) {
      existing.permissions.push(permission)
    } else {
      categoryMap.set(permission.categoryId, {
        categoryId: permission.categoryId,
        categoryName: permission.categoryName,
        permissions: [permission],
      })
    }
  }

  return Array.from(categoryMap.values()).sort((a, b) =>
    a.categoryName.localeCompare(b.categoryName)
  )
}

export function getAllPermissionIds(permissions: Permission[]): string[] {
  return permissions.filter((permission) => permission.enabled).map((p) => p.id)
}
