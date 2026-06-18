export type Userroles =
  | "Super Admin"
  | "Branch Admin"
  | "Manager"
  | "Operator"

export type UserStatus = "active" | "inactive"

export interface ManagedUser {
  id: string
  lastName: string
  firstName: string
  userName: string
  email: string
  initials: string
  roles: Userroles
  branch: string
  status: UserStatus
  lastLogin: string
  lastLoginAt: number
  devices: number
  userType: string
}

export const userStats = {
  total: 12458,
  active: 11842,
  inactive: 616,
  admins: 245,
  activePercent: 93.3,
  inactivePercent: 4.9,
  adminPercent: 8.7,
  growthPercent: 15.2,
}

export const rolesFilterOptions = [
  { value: "all", label: "All roless" },
  { value: "Super Admin", label: "Super Admin" },
  { value: "Branch Admin", label: "Branch Admin" },
  { value: "Manager", label: "Manager" },
  { value: "Operator", label: "Operator" },
] as const

export const branchFilterOptions = [
  { value: "all", label: "All Branches" },
  { value: "Head Office", label: "Head Office" },
  { value: "Kumasi Branch", label: "Kumasi Branch" },
  { value: "Tema Branch", label: "Tema Branch" },
  { value: "Takoradi Branch", label: "Takoradi Branch" },
  { value: "Accra HQ", label: "Accra HQ" },
] as const

export const statusFilterOptions = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
] as const

export const managedUsers: ManagedUser[] = [
  {
    id: "1",
    firstName: "Sarah",
    lastName: "Mensah",
    userName: "sarah.mensah",
    email: "sarah.mensah@company.com",
    initials: "SM",
    roles: "Super Admin",
    branch: "Head Office",
    status: "active",
    lastLogin: "Today, 09:01 AM",
    lastLoginAt: Date.now() - 1000 * 60 * 45,
    devices: 12,
    userType: "System User"
  },
  {
    id: "2",
    firstName: "Kwame",
    lastName: "Osei",
    userName: "kwame.osei",
    email: "kwame.osei@company.com",
    initials: "KO",
    roles: "Branch Admin",
    branch: "Kumasi Branch",
    status: "active",
    lastLogin: "Today, 08:47 AM",
    lastLoginAt: Date.now() - 1000 * 60 * 90,
    devices: 8,
    userType: "System User"
  },
  {
    id: "3",
    firstName: "Ama",
    lastName: "Darko",
    userName: "ama.darko",
    email: "ama.darko@company.com",
    initials: "AD",
    roles: "Manager",
    branch: "Tema Branch",
    status: "active",
    lastLogin: "Yesterday, 05:12 PM",
    lastLoginAt: Date.now() - 1000 * 60 * 60 * 18,
    devices: 5,
    userType: "System User"
  },
  {
    id: "4",
    firstName: "Emmanuel",
    lastName: "Boateng",
    userName: "emmanuel.boateng",
    email: "emmanuel.boateng@company.com",
    initials: "EB",
    roles: "Operator",
    branch: "Head Office",
    status: "inactive",
    lastLogin: "Mar 12, 2026",
    lastLoginAt: Date.now() - 1000 * 60 * 60 * 24 * 14,
    devices: 2,
    userType: "System User"
  },
  {
    id: "5",
    firstName: "Grace",
    lastName: "Addo",
    userName: "grace.addo",
    email: "grace.addo@company.com",
    initials: "GA",
    roles: "Manager",
    branch: "Accra HQ",
    status: "active",
    lastLogin: "Today, 07:55 AM",
    lastLoginAt: Date.now() - 1000 * 60 * 120,
    devices: 6,
    userType: "Device User"
  },
  {
    id: "6",
    firstName: "Daniel",
    lastName: "Kwarteng",
    userName: "daniel.kwarteng",
    email: "daniel.kwarteng@company.com",
    initials: "DK",
    roles: "Branch Admin",
    branch: "Takoradi Branch",
    status: "active",
    lastLogin: "Today, 08:20 AM",
    lastLoginAt: Date.now() - 1000 * 60 * 105,
    devices: 7,
    userType: "System User"
  },
  {
    id: "7",
    firstName: "Abena",
    lastName: "Owusu",
    userName: "abena.owusu",
    email: "abena.owusu@company.com",
    initials: "AO",
    roles: "Operator",
    branch: "Kumasi Branch",
    status: "active",
    lastLogin: "Today, 08:05 AM",
    lastLoginAt: Date.now() - 1000 * 60 * 130,
    devices: 3,
    userType: "Device User"
  },
  {
    id: "8",
    firstName: "Michael",
    lastName: "Asante",
    userName: "michael.asante",
    email: "michael.asante@company.com",
    initials: "MA",
    roles: "Super Admin",
    branch: "Head Office",
    status: "active",
    lastLogin: "Today, 09:15 AM",
    lastLoginAt: Date.now() - 1000 * 60 * 30,
    devices: 15,
    userType: "System User"
  },
  {
    id: "9",
    firstName: "Patience",
    lastName: "Adjei",
    userName: "patience.adjei",
    email: "patience.adjei@company.com",
    initials: "PA",
    roles: "Operator",
    branch: "Tema Branch",
    status: "inactive",
    lastLogin: "Feb 28, 2026",
    lastLoginAt: Date.now() - 1000 * 60 * 60 * 24 * 21,
    devices: 1,
    userType: "System User"
  },
  {
    id: "10",
    firstName: "Francis",
    lastName: "Nyarko",
    userName: "francis.nyarko",
    email: "francis.nyarko@company.com",
    initials: "FN",
    roles: "Manager",
    branch: "Takoradi Branch",
    status: "active",
    lastLogin: "Yesterday, 04:30 PM",
    lastLoginAt: Date.now() - 1000 * 60 * 60 * 20,
    devices: 4,
    userType: "System User"
  },
  // {
  //   id: "11",
  //   firstName: "Rita",
  //   lastName: "Agyeman",
  //   userName: "rita.agyeman",
  //   email: "rita.agyeman@company.com",
  //   initials: "RA",
  //   roles: "Branch Admin",
  //   branch: "Accra HQ",
  //   status: "active",
  //   lastLogin: "Today, 07:40 AM",
  //   lastLoginAt: Date.now() - 1000 * 60 * 140,
  //   devices: 9,
  // },
  // {
  //   id: "12",
  //   firstName: "Samuel",
  //   lastName: "Tetteh",
  //   userName: "samuel.tetteh",
  //   email: "samuel.tetteh@company.com",
  //   initials: "ST",
  //   roles: "Operator",
  //   branch: "Head Office",
  //   status: "active",
  //   lastLogin: "Today, 08:58 AM",
  //   lastLoginAt: Date.now() - 1000 * 60 * 50,
  //   devices: 2,
  // },
  // ...generateMockUsers(36),
]

// function generateMockUsers(count: number): ManagedUser[] {
//   const firstNames = [
//     "John",
//     "Mary",
//     "Joseph",
//     "Elizabeth",
//     "David",
//     "Ruth",
//     "Peter",
//     "Esther",
//   ]
//   const lastNames = [
//     "Mensah",
//     "Osei",
//     "Darko",
//     "Boateng",
//     "Addo",
//     "Kwarteng",
//     "Owusu",
//     "Asante",
//   ]
//   const roless: Userroles[] = [
//     "Super Admin",
//     "Branch Admin",
//     "Manager",
//     "Operator",
//   ]
//   const branches = [
//     "Head Office",
//     "Kumasi Branch",
//     "Tema Branch",
//     "Takoradi Branch",
//     "Accra HQ",
//   ]
//   const statuses: UserStatus[] = ["active", "inactive"]

//   return Array.from({ length: count }, (_, index) => {
//     const first = firstNames[index % firstNames.length]
//     const last = lastNames[(index + 3) % lastNames.length]
//     const userName = `${first.toLowerCase()}.${last.toLowerCase()}`
//     const roles: Userroles = roless[index % roless.length]
//     const branch = branches[index % branches.length]
//     const status = statuses[index % 7 === 0 ? 1 : 0]

//     return {
//       id: String(index + 13),
//       firstName: first,
//       lastName: last,
//       userName,
//       email: `${first.toLowerCase()}.${last.toLowerCase()}${index + 1}@company.com`,
//       initials: `${first[0]}${last[0]}`,
//       roles,
//       branch,
//       status,
//       lastLogin: status === "active" ? "Today, 08:00 AM" : "Jan 15, 2026",
//       lastLoginAt: Date.now() - 1000 * 60 * 60 * (index + 2),
//       devices: (index % 10) + 1,
//     }
//   })
// }

export const rolesBadgeStyles: Record<Userroles, string> = {
  "Super Admin": "border-purple-200 bg-purple-50 text-purple-700",
  "Branch Admin": "border-blue-200 bg-blue-50 text-blue-700",
  Manager: "border-green-200 bg-green-50 text-green-700",
  Operator: "border-orange-200 bg-orange-50 text-orange-700",
}

export const statusBadgeStyles: Record<
  UserStatus,
  { dot: string; badge: string; label: string }
> = {
  active: {
    label: "Active",
    dot: "bg-green-500",
    badge: "border-green-200 bg-green-50 text-green-700",
  },
  inactive: {
    label: "Inactive",
    dot: "bg-red-500",
    badge: "border-red-200 bg-red-50 text-red-700",
  },
}
