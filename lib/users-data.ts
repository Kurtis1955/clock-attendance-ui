export type Userroles = "Super Admin" | "Branch Admin" | "Manager" | "Operator";

export type UserStatus = "active" | "inactive";

export interface ManagedUser {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  eCode: string;
  phoneNumber: string;
  initials: string;
  roles: string;
  company: string;
  department: string;
  branch: string;
  status: "active" | "inactive";
  userType: string[];
  assignedDevices: string[];
  permissions: string[];
  temporaryPassword: string;
  confirmPassword: string;
  enabled: boolean;
  lastLogin: string;
  lastLoginAt: number;
  devices: number;
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
};

export const rolesFilterOptions = [
  { value: "all", label: "All roless" },
  { value: "Super Admin", label: "Super Admin" },
  { value: "Branch Admin", label: "Branch Admin" },
  { value: "Manager", label: "Manager" },
  { value: "Operator", label: "Operator" },
] as const;

export const branchFilterOptions = [
  { value: "all", label: "All Branches" },
  { value: "Head Office", label: "Head Office" },
  { value: "Kumasi Branch", label: "Kumasi Branch" },
  { value: "Tema Branch", label: "Tema Branch" },
  { value: "Takoradi Branch", label: "Takoradi Branch" },
  { value: "Accra HQ", label: "Accra HQ" },
] as const;

export const statusFilterOptions = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
] as const;

export const managedUsers: ManagedUser[] = [
  {
    id: "1",
    firstName: "Sarah",
    lastName: "Mensah",
    userName: "sarah.mensah",
    email: "sarah.mensah@company.com",
    eCode: "EMP0001",
    phoneNumber: "+233241234567",
    initials: "SM",
    roles: "Super Admin",
    company: "SuperTech Limited",
    department: "ICT GENERAL",
    branch: "Head Office",
    status: "active",
    enabled: true,

    userType: ["System User"],
    assignedDevices: ["ZKT-Pro-01", "ZKT-Pro-02", "ZKT-Pro-03"],

    temporaryPassword: "Temp@123",
    confirmPassword: "Temp@123",

    permissions: [
      "dashboard.view",
      "users.view",
      "users.create",
      "users.edit",
      "roles.view",
      "roles.create",
      "attendance.view",
      "devices.view",
      "reports.view",
      "reports.export",
    ],

    lastLogin: "Today, 09:01 AM",
    lastLoginAt: Date.now() - 1000 * 60 * 45,
    devices: 12,
  },

  {
    id: "2",
    firstName: "Kwame",
    lastName: "Osei",
    userName: "kwame.osei",
    email: "kwame.osei@company.com",
    eCode: "EMP0002",
    phoneNumber: "+233245678901",
    initials: "KO",
    roles: "Branch Admin",
    company: "SuperTech Limited",
    department: "NETWORK OPERATIONS",
    branch: "Kumasi Branch",
    status: "active",
    enabled: true,

    userType: ["System User"],
    assignedDevices: ["ZKT-KSI-01", "ZKT-KSI-02"],

    temporaryPassword: "Temp@123",
    confirmPassword: "Temp@123",

    permissions: [
      "dashboard.view",
      "users.view",
      "users.edit",
      "attendance.view",
      "devices.view",
    ],

    lastLogin: "Today, 08:47 AM",
    lastLoginAt: Date.now() - 1000 * 60 * 90,
    devices: 8,
  },

  {
    id: "3",
    firstName: "Grace",
    lastName: "Addo",
    userName: "grace.addo",
    email: "grace.addo@company.com",
    eCode: "EMP0003",
    phoneNumber: "+233244567890",
    initials: "GA",
    roles: "Manager",
    company: "SuperTech Limited",
    department: "APPLICATIONS",
    branch: "Accra HQ",
    status: "active",
    enabled: true,

    userType: ["Device User"],
    assignedDevices: ["ZKT-ACC-01"],

    temporaryPassword: "Temp@123",
    confirmPassword: "Temp@123",

    permissions: ["dashboard.view", "attendance.view", "reports.view"],

    lastLogin: "Today, 07:55 AM",
    lastLoginAt: Date.now() - 1000 * 60 * 120,
    devices: 6,
  },

  {
    id: "4",
    firstName: "Emmanuel",
    lastName: "Boateng",
    userName: "emmanuel.boateng",
    email: "emmanuel.boateng@company.com",
    eCode: "EMP0004",
    phoneNumber: "+233246789012",
    initials: "EB",
    roles: "Operator",
    company: "SuperTech Limited",
    department: "FIELD INSTALLATIONS",
    branch: "Head Office",
    status: "inactive",
    enabled: false,

    userType: ["System User", "Device User"],
    assignedDevices: ["ZKT-HQ-01", "ZKT-HQ-02"],

    temporaryPassword: "Temp@123",
    confirmPassword: "Temp@123",

    permissions: ["attendance.view"],

    lastLogin: "Mar 12, 2026",
    lastLoginAt: Date.now() - 1000 * 60 * 60 * 24 * 14,
    devices: 2,
  },
];

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
};

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
};
