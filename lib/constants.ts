export interface AppUser {
  name: string
  role: string
  email: string
  avatarUrl?: string
  initials: string
}

export interface DeviceStatusSummary {
  onlineDevices: number
  totalDevices: number
  lastSyncTime: string
  isHealthy: boolean
}

export const currentUser: AppUser = {
  name: "Admin User",
  role: "Super Administrator",
  email: "admin@biometrichub.com",
  initials: "AU",
}

export const deviceStatus: DeviceStatusSummary = {
  onlineDevices: 42,
  totalDevices: 45,
  lastSyncTime: "1 min ago",
  isHealthy: true,
}

export const branchOptions = [
  { value: "all", label: "All Branches" },
  { value: "accra", label: "Accra HQ" },
  { value: "kumasi", label: "Kumasi Branch" },
  { value: "tema", label: "Tema Branch" },
  { value: "takoradi", label: "Takoradi Branch" },
] as const

export const SIDEBAR_WIDTH_EXPANDED = 280
export const SIDEBAR_WIDTH_COLLAPSED = 80
export const HEADER_HEIGHT = 64

export const modalContentTypeData = {
  addUser: "addUser",
  addRole: "addRole",
  editRole: "editRole",
  viewRole: "viewRole",
  confirmation: "confirmation",
  approvalConfirmation: "approvalConfirmation",
  viewUser: "viewUser",
  editLeave: "editLeave",
  batchConfirmation: "batchConfirmation",
  filter: "filter",
  searchUser: "searchUser",
  assignDelegate: "assignDelegate",
  assignDelegateAction: "assignDelegateAction",
  filterExternalLoan: "filterExternalLoan",
  viewExternalLoan: "viewExternalLoan",
  editExternalLoan: "editExternalLoan",
  viewLoan: "viewLoan",
  editLoan: "editLoan",
  addExternalLoan: "addExternalLoan",
  editUser: "editUser",
}
