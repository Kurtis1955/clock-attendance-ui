export const attendanceTrend7Days = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  values: [920, 1050, 980, 1180, 1120, 640, 480],
}

export const attendanceTrend30Days = {
  labels: Array.from({ length: 30 }, (_, i) => `${i + 1}`),
  values: [
    890, 910, 945, 980, 1020, 1010, 995, 1040, 1080, 1100, 1095, 1120, 1150,
    1140, 1180, 1175, 1160, 1190, 1210, 1205, 1185, 1155, 1100, 1050, 980,
    940, 900, 870, 850, 820,
  ],
}

export const deviceHealth = {
  healthy: 38,
  warning: 3,
  offline: 1,
}

export type AttendanceStatus = "success" | "denied" | "flagged"

export type AttendanceMethod = "face" | "fingerprint" | "rfid"

export interface RecentAttendanceRecord {
  id: string
  userName: string
  employeeId: string
  initials: string
  deviceName: string
  branch: string
  method: AttendanceMethod
  timestamp: string
  status: AttendanceStatus
}

export const recentAttendanceRecords: RecentAttendanceRecord[] = [
  {
    id: "1",
    userName: "Sarah Mensah",
    employeeId: "EMP-2041",
    initials: "SM",
    deviceName: "ZKT-Pro-01",
    branch: "Main Entrance - HQ",
    method: "face",
    timestamp: "08:42:15 AM",
    status: "success",
  },
  {
    id: "2",
    userName: "Kwame Osei",
    employeeId: "EMP-1876",
    initials: "KO",
    deviceName: "ZKT-Mini-12",
    branch: "Warehouse - Block B",
    method: "fingerprint",
    timestamp: "08:39:02 AM",
    status: "success",
  },
  {
    id: "3",
    userName: "Ama Darko",
    employeeId: "EMP-2210",
    initials: "AD",
    deviceName: "ZKT-Pro-03",
    branch: "Admin Block",
    method: "rfid",
    timestamp: "08:35:48 AM",
    status: "denied",
  },
  {
    id: "4",
    userName: "Emmanuel Boateng",
    employeeId: "EMP-1955",
    initials: "EB",
    deviceName: "ZKT-Pro-02",
    branch: "Finance Wing",
    method: "face",
    timestamp: "08:33:21 AM",
    status: "success",
  },
  {
    id: "5",
    userName: "Grace Addo",
    employeeId: "EMP-2088",
    initials: "GA",
    deviceName: "ZKT-Mini-08",
    branch: "Production Floor",
    method: "fingerprint",
    timestamp: "08:30:55 AM",
    status: "denied",
  },
  {
    id: "6",
    userName: "Daniel Kwarteng",
    employeeId: "EMP-1762",
    initials: "DK",
    deviceName: "ZKT-Pro-05",
    branch: "Security Gate",
    method: "face",
    timestamp: "08:28:10 AM",
    status: "success",
  },
]
