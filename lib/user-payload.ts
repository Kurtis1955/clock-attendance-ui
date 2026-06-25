export interface UserDepartmentPayload {
  username: string
  companyName: string
  departmentName: string
}

export interface UserApiPayload {
  id?: string
  userName: string
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
  roles: string[]
  permissions: string[]
  departmentName: string[]
  companyName: string[]
  userDepartments: UserDepartmentPayload[]
  enabled: boolean
  ecode: string
  eCode: string
  departmentId?: string
  companyId?: string
  managerId?: string
  companyBranchId?: string
  managerName?: string
  companyBranchName?: string
  userRoles?: string[]
  assignedDevices?: string[]
  userType?: string[]
  exists?: boolean
}

export interface BuildUserPayloadInput {
  id?: string
  userName: string
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
  roleIds: string[]
  permissionIds: string[]
  companyNames: string[]
  departmentNames: string[]
  enabled: boolean
  ecode: string
  departmentId?: string
  companyId?: string
  managerId?: string
  companyBranchId?: string
  managerName?: string
  companyBranchName?: string
  userRoles?: string[]
  assignedDevices?: string[]
  userType?: string[]
  exists?: boolean
}

export function buildUserDepartments(
  userName: string,
  companyNames: string[],
  departmentNames: string[]
): UserDepartmentPayload[] {
  if (!userName || !companyNames.length || !departmentNames.length) {
    return []
  }

  return companyNames.flatMap((companyName) =>
    departmentNames.map((departmentName) => ({
      username: userName,
      companyName,
      departmentName,
    }))
  )
}

export function normalizeRoleIds(roles: unknown): string[] {
  if (!roles) return []

  if (Array.isArray(roles)) {
    return roles
      .map((role) => {
        if (typeof role === "string") return role
        if (role && typeof role === "object" && "id" in role) {
          return String((role as { id: string }).id)
        }
        return ""
      })
      .filter(Boolean)
  }

  if (typeof roles === "string") {
    return roles ? [roles] : []
  }

  return []
}

export function normalizeIdList(value: unknown): string[] {
  return normalizeRoleIds(value)
}

export function normalizeStringArray(value: unknown): string[] {
  if (!value) return []
  if (Array.isArray(value)) {
    return value.map((item) => String(item)).filter(Boolean)
  }
  if (typeof value === "string") {
    return value ? [value] : []
  }
  return []
}

export function buildUserApiPayload(input: BuildUserPayloadInput): UserApiPayload {
  const companyNames = normalizeStringArray(input.companyNames)
  const departmentNames = normalizeStringArray(input.departmentNames)

  const payload: UserApiPayload = {
    userName: input.userName.trim(),
    email: input.email.trim(),
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    phoneNumber: input.phoneNumber.trim(),
    roles: input.roleIds,
    permissions: input.permissionIds,
    departmentName: departmentNames,
    companyName: companyNames,
    userDepartments: buildUserDepartments(
      input.userName.trim(),
      companyNames,
      departmentNames
    ),
    enabled: input.enabled,
    ecode: input.ecode.trim(),
    eCode: input.ecode.trim(),
  }

  if (input.id) payload.id = input.id
  if (input.departmentId) payload.departmentId = input.departmentId
  if (input.companyId) payload.companyId = input.companyId
  if (input.managerId) payload.managerId = input.managerId
  if (input.companyBranchId) payload.companyBranchId = input.companyBranchId
  if (input.managerName) payload.managerName = input.managerName
  if (input.companyBranchName) payload.companyBranchName = input.companyBranchName
  if (input.userRoles?.length) payload.userRoles = input.userRoles
  if (input.assignedDevices?.length) payload.assignedDevices = input.assignedDevices
  if (input.userType?.length) payload.userType = input.userType
  if (typeof input.exists === "boolean") payload.exists = input.exists

  return payload
}

export async function parseApiError(response: Response): Promise<string> {
  try {
    const json = await response.json()

    if (Array.isArray(json?.errors) && json.errors.length) {
      const fieldErrors = json.errors
        .map(
          (entry: { field?: string; defaultMessage?: string; message?: string }) =>
            entry.defaultMessage || entry.message || entry.field
        )
        .filter(Boolean)
        .join("; ")

      if (fieldErrors) {
        return fieldErrors
      }
    }

    if (typeof json?.message === "string" && json.message) {
      return json.message
    }

    if (typeof json?.error === "string" && json.error) {
      return json.error
    }

    if (typeof json?.data?.message === "string" && json.data.message) {
      return json.data.message
    }

    return `Request failed (${response.status})`
  } catch {
    return `Request failed (${response.status})`
  }
}
