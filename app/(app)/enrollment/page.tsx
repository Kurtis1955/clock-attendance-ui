"use client";

import { useMemo, useState } from "react";
import {
  RiAddLine,
  RiArrowDownLine,
  RiArrowUpLine,
  RiCheckboxCircleLine,
  RiCloseCircleLine,
  RiEdit2Line,
  RiEyeLine,
  RiRefreshLine,
  RiSearchLine,
  RiShieldUserLine,
  RiSmartphoneLine,
  RiTeamLine,
  RiUploadCloud2Line,
  RiUserAddLine,
  RiUserUnfollowLine,
} from "react-icons/ri";

import AddEditBiometricUser, {
  biometricDeviceOptions,
  type BiometricSyncStatus,
  type BiometricUserRecord,
} from "@/components/modals/addeditbiometricuserModal/AddEditBiometricUser";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { regrexForSpecialDashChars } from "@/lib/helpers";
import { cn } from "@/lib/utils";

const biometricUsersSeed: BiometricUserRecord[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    userName: "John Doe",
    email: "john.doe@company.com",
    employeeId: "EMP-2041",
    phoneNumber: "+233 24 000 2041",
    department: "Information Technology",
    branch: "Head Office",
    userType: "Device User",
    assignedDevices: [
      biometricDeviceOptions[0],
      biometricDeviceOptions[1],
      biometricDeviceOptions[3],
    ],
    biometricMethods: ["Face", "Fingerprint"],
    syncStatus: "Synced",
    dateAdded: "20 May 2024 10:32 AM",
    lastSync: "2 mins ago",
    enabled: true,
  },
  {
    id: "2",
    firstName: "Mary",
    lastName: "Smith",
    userName: "Mary Smith",
    email: "mary.smith@company.com",
    employeeId: "EMP-3523",
    phoneNumber: "+233 24 000 3523",
    department: "Human Resources",
    branch: "Head Office",
    userType: "Device User",
    assignedDevices: [biometricDeviceOptions[1]],
    biometricMethods: ["Face"],
    syncStatus: "Synced",
    dateAdded: "20 May 2024 10:28 AM",
    lastSync: "5 mins ago",
    enabled: true,
  },
  {
    id: "3",
    firstName: "Daniel",
    lastName: "Owusu",
    userName: "Daniel Owusu",
    email: "daniel.owusu@company.com",
    employeeId: "EMP-4187",
    phoneNumber: "+233 24 000 4187",
    department: "Operations",
    branch: "Takoradi Branch",
    userType: "Device User",
    assignedDevices: [],
    biometricMethods: ["Fingerprint"],
    syncStatus: "Pending",
    dateAdded: "20 May 2024 10:15 AM",
    lastSync: "-",
    enabled: true,
  },
  {
    id: "4",
    firstName: "Ama",
    lastName: "Mensah",
    userName: "Ama Mensah",
    email: "ama.mensah@company.com",
    employeeId: "EMP-3022",
    phoneNumber: "+233 24 000 3022",
    department: "Finance",
    branch: "Tema Branch",
    userType: "Device User",
    assignedDevices: [biometricDeviceOptions[0], biometricDeviceOptions[4]],
    biometricMethods: ["Face", "Palm"],
    syncStatus: "Synced",
    dateAdded: "20 May 2024 10:08 AM",
    lastSync: "12 mins ago",
    enabled: true,
  },
  {
    id: "5",
    firstName: "Kofi",
    lastName: "Boateng",
    userName: "Kofi Boateng",
    email: "kofi.boateng@company.com",
    employeeId: "EMP-5011",
    phoneNumber: "+233 24 000 5011",
    department: "Security",
    branch: "Head Office",
    userType: "Device User",
    assignedDevices: [biometricDeviceOptions[3]],
    biometricMethods: ["Fingerprint"],
    syncStatus: "Failed",
    dateAdded: "20 May 2024 09:55 AM",
    lastSync: "15 mins ago",
    enabled: true,
  },
];

const deviceOverview = [
  {
    name: "Head Office - Main Entrance",
    ip: "192.168.1.201",
    users: 245,
    color: "bg-emerald-500",
  },
  {
    name: "Reception - Front Desk",
    ip: "192.168.1.205",
    users: 186,
    color: "bg-blue-500",
  },
  {
    name: "Warehouse - Gate",
    ip: "192.168.1.210",
    users: 92,
    color: "bg-orange-500",
  },
  {
    name: "Server Room - Access",
    ip: "192.168.1.215",
    users: 18,
    color: "bg-violet-500",
  },
];

const activities = [
  {
    icon: RiUserAddLine,
    color: "bg-emerald-50 text-emerald-700",
    text: "John Doe assigned to Head Office - Main Entrance",
    meta: "10:32 AM - by Administrator",
  },
  {
    icon: RiUserAddLine,
    color: "bg-emerald-50 text-emerald-700",
    text: "Mary Smith assigned to Reception - Front Desk",
    meta: "10:28 AM - by Administrator",
  },
  {
    icon: RiUserUnfollowLine,
    color: "bg-orange-50 text-orange-700",
    text: "Daniel Owusu removed from Warehouse - Gate",
    meta: "10:15 AM - by Administrator",
  },
  {
    icon: RiRefreshLine,
    color: "bg-blue-50 text-blue-700",
    text: "Ama Mensah synchronized successfully",
    meta: "09:55 AM - System",
  },
  {
    icon: RiCloseCircleLine,
    color: "bg-red-50 text-red-700",
    text: "Sync failed for Kofi Boateng on Server Room - Access",
    meta: "09:45 AM - System",
  },
];

const departments = [
  "Information Technology",
  "Human Resources",
  "Operations",
  "Finance",
  "Security",
];
const branches = ["Head Office", "Kumasi Branch", "Tema Branch", "Takoradi Branch"];
const statusStyles: Record<BiometricSyncStatus, string> = {
  Synced: "bg-emerald-50 text-emerald-700",
  Pending: "bg-amber-50 text-amber-700",
  Failed: "bg-red-50 text-red-700",
};

export default function EnrollmentPage() {
  const [users, setUsers] = useState<BiometricUserRecord[]>(biometricUsersSeed);
  const [searchQuery, setSearchQuery] = useState("");
  const [deviceFilter, setDeviceFilter] = useState("all");
  const [branchFilter, setBranchFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<BiometricUserRecord | null>(
    null,
  );
  const [modalAction, setModalAction] = useState<"add" | "edit" | "view">("add");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredUsers = useMemo(() => {
    const normalizedSearch = searchQuery.toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        user.userName.toLowerCase().includes(normalizedSearch) ||
        user.employeeId.toLowerCase().includes(normalizedSearch) ||
        user.email.toLowerCase().includes(normalizedSearch);
      const matchesDevice =
        deviceFilter === "all" ||
        user.assignedDevices.some((device) => device.value === deviceFilter);
      const matchesBranch =
        branchFilter === "all" || user.branch === branchFilter;
      const matchesDepartment =
        departmentFilter === "all" || user.department === departmentFilter;
      const matchesStatus =
        statusFilter === "all" ||
        user.syncStatus.toLowerCase() === statusFilter;

      return (
        matchesSearch &&
        matchesDevice &&
        matchesBranch &&
        matchesDepartment &&
        matchesStatus
      );
    });
  }, [branchFilter, departmentFilter, deviceFilter, searchQuery, statusFilter, users]);

  const assignedUsers = users.filter((user) => user.assignedDevices.length > 0).length;
  const pendingUsers = users.filter((user) => user.syncStatus === "Pending").length;
  const unassignedUsers = users.filter((user) => user.assignedDevices.length === 0).length;

  const statCards = [
    {
      title: "Total Device Users",
      value: users.length.toLocaleString(),
      caption: "All users in the system",
      trend: "8.4%",
      trendDirection: "up",
      icon: RiTeamLine,
      color: "bg-blue-50 text-blue-700",
    },
    {
      title: "Assigned Users",
      value: assignedUsers.toLocaleString(),
      caption: "Assigned to at least one device",
      trend: "6.7%",
      trendDirection: "up",
      icon: RiShieldUserLine,
      color: "bg-emerald-50 text-emerald-700",
    },
    {
      title: "Unassigned Users",
      value: unassignedUsers.toLocaleString(),
      caption: "Not assigned to any device",
      trend: "3.2%",
      trendDirection: "down",
      icon: RiUserUnfollowLine,
      color: "bg-orange-50 text-orange-700",
    },
    {
      title: "Pending Sync",
      value: pendingUsers.toLocaleString(),
      caption: "Awaiting device sync",
      trend: "12.5%",
      trendDirection: "down",
      icon: RiUploadCloud2Line,
      color: "bg-violet-50 text-violet-700",
    },
  ];

  const openModal = (
    action: "add" | "edit" | "view",
    user: BiometricUserRecord | null = null,
  ) => {
    setModalAction(action);
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleSaveUser = (savedUser: BiometricUserRecord) => {
    setUsers((currentUsers) => {
      const exists = currentUsers.some((user) => user.id === savedUser.id);

      if (!exists) {
        return [savedUser, ...currentUsers];
      }

      return currentUsers.map((user) =>
        user.id === savedUser.id ? savedUser : user,
      );
    });
  };

  return (
    <div className="flex flex-col gap-5 px-2 pt-2 lg:px-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#0f172a]">
              Biometric Enrollment Management
            </h1>
            <span className="flex size-5 items-center justify-center rounded-full border border-slate-300 text-xs text-slate-500">
              i
            </span>
          </div>
          <p className="mt-2 text-sm text-[#475569]">
            Manage device users, assign to biometric terminals and monitor sync
            status.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" className="h-10 border-slate-200 bg-white">
            <RiTeamLine className="size-4" />
            Bulk Assignment
          </Button>
          <Button variant="outline" className="h-10 border-slate-200 bg-white">
            <RiRefreshLine className="size-4" />
            Sync Devices
          </Button>
          <Button
            className="h-10 bg-blue-700 text-white hover:bg-blue-800"
            onClick={() => openModal("add")}
          >
            <RiAddLine className="size-4" />
            Enroll User
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          const TrendIcon =
            stat.trendDirection === "up" ? RiArrowUpLine : RiArrowDownLine;

          return (
            <Card key={stat.title} className="border-slate-200 shadow-sm">
              <CardContent className="flex min-h-32 items-center gap-4">
                <div
                  className={cn(
                    "flex size-14 shrink-0 items-center justify-center rounded-lg",
                    stat.color,
                  )}
                >
                  <Icon className="size-7" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-sm font-medium text-[#334155]">
                      {stat.title}
                    </p>
                    <Badge
                      className={cn(
                        stat.trendDirection === "up"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-orange-50 text-orange-700",
                      )}
                    >
                      <TrendIcon className="size-3" />
                      {stat.trend}
                    </Badge>
                  </div>
                  <p className="mt-3 text-3xl font-bold text-[#0f172a]">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-xs text-[#475569]">{stat.caption}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="space-y-4">
            <div className="grid gap-3 lg:grid-cols-[1fr_150px_150px_170px_150px]">
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Search users by name, ID, email..."
                  value={searchQuery}
                  onChange={(event) =>
                    setSearchQuery(regrexForSpecialDashChars(event.target.value))
                  }
                  className="h-10 pr-10"
                />
                <RiSearchLine className="absolute right-3 top-1/2 size-5 -translate-y-1/2 text-slate-500" />
              </div>
              <FilterSelect
                value={deviceFilter}
                onChange={setDeviceFilter}
                options={[
                  { value: "all", label: "All Devices" },
                  ...biometricDeviceOptions,
                ]}
              />
              <FilterSelect
                value={branchFilter}
                onChange={setBranchFilter}
                options={[
                  { value: "all", label: "All Branches" },
                  ...branches.map((branch) => ({ value: branch, label: branch })),
                ]}
              />
              <FilterSelect
                value={departmentFilter}
                onChange={setDepartmentFilter}
                options={[
                  { value: "all", label: "All Departments" },
                  ...departments.map((department) => ({
                    value: department,
                    label: department,
                  })),
                ]}
              />
              <FilterSelect
                value={statusFilter}
                onChange={setStatusFilter}
                options={[
                  { value: "all", label: "All Status" },
                  { value: "synced", label: "Synced" },
                  { value: "pending", label: "Pending" },
                  { value: "failed", label: "Failed" },
                ]}
              />
            </div>

            <div className="overflow-x-auto rounded-md border border-slate-200">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">Employee ID</th>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3">Assigned Devices</th>
                    <th className="px-4 py-3">Sync Status</th>
                    <th className="px-4 py-3">Date Added</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="bg-white hover:bg-slate-50/70">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="size-9">
                            <AvatarFallback className="bg-slate-200 text-xs text-slate-700">
                              {getInitials(user.userName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-slate-900">
                              {user.userName}
                            </p>
                            <p className="text-xs text-slate-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 font-mono text-xs text-slate-700">
                        {user.employeeId}
                      </td>
                      <td className="px-4 py-4 text-slate-700">
                        {user.department}
                      </td>
                      <td className="px-4 py-4">
                        <DeviceCell user={user} />
                      </td>
                      <td className="px-4 py-4">
                        <Badge className={statusStyles[user.syncStatus]}>
                          {user.syncStatus}
                        </Badge>
                        <p className="mt-1 text-xs text-slate-500">
                          {user.lastSync}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-xs text-slate-700">
                        {user.dateAdded}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon-sm"
                            onClick={() => openModal("view", user)}
                            aria-label={`View ${user.userName}`}
                          >
                            <RiEyeLine />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon-sm"
                            onClick={() => openModal("edit", user)}
                            aria-label={`Edit ${user.userName}`}
                          >
                            <RiEdit2Line />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-3 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
              <p>
                Showing 1 to {filteredUsers.length} of {users.length} users
              </p>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((page) => (
                  <Button
                    key={page}
                    variant={page === 1 ? "default" : "outline"}
                    size="icon-sm"
                    className={page === 1 ? "bg-blue-700 text-white" : ""}
                  >
                    {page}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Device Assignment Overview</CardTitle>
              <Button variant="link" className="h-auto p-0 text-blue-700">
                View All Devices
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {deviceOverview.map((device) => (
                <div key={device.ip} className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-sm bg-slate-900 text-emerald-400">
                    <RiSmartphoneLine className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {device.name}
                        </p>
                        <p className="text-xs text-slate-500">{device.ip}</p>
                      </div>
                      <div className="text-right text-xs text-slate-500">
                        <p className="font-semibold text-slate-900">
                          {device.users}
                        </p>
                        Users
                      </div>
                    </div>
                    <div className="mt-2 h-1.5 rounded-full bg-slate-100">
                      <div
                        className={cn("h-full rounded-full", device.color)}
                        style={{ width: `${Math.min(device.users / 2.6, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Recent Enrollment Activities</CardTitle>
              <Button variant="link" className="h-auto p-0 text-blue-700">
                View All
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {activities.map((activity) => {
                const Icon = activity.icon;

                return (
                  <div key={activity.text} className="flex gap-3">
                    <div
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-md",
                        activity.color,
                      )}
                    >
                      <Icon className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900">
                        {activity.text}
                      </p>
                      <p className="text-xs text-slate-500">{activity.meta}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-md border border-blue-100 bg-blue-50/70 px-5 py-4 text-sm text-slate-700 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
          <RiCheckboxCircleLine className="size-5 shrink-0 text-blue-700" />
          <span className="font-semibold text-blue-900">
            How Biometric Enrollment Works
          </span>
          <span>
            Add user details in the system, assign to device(s), push to device,
            enroll biometrics on terminal, then store data on the device.
          </span>
        </div>
        <Button variant="outline" className="border-blue-100 bg-white text-blue-700">
          Learn More
        </Button>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {modalAction === "add"
                ? "Enroll Biometric User"
                : modalAction === "edit"
                  ? "Edit Biometric User"
                  : "View Biometric User"}
            </DialogTitle>
            <DialogDescription>
              {modalAction === "add"
                ? "Add user details, assign biometric devices, and choose enrollment methods."
                : modalAction === "edit"
                  ? "Update the selected biometric user's enrollment settings."
                  : "Review this biometric user's assignment and sync state."}
            </DialogDescription>
          </DialogHeader>
          <AddEditBiometricUser
            actionType={modalAction}
            existingUserData={selectedUser}
            callback={handleSaveUser}
            onClose={() => setIsModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FilterSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-10 rounded-sm border border-input bg-white px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

function DeviceCell({ user }: { user: BiometricUserRecord }) {
  if (user.assignedDevices.length === 0) {
    return <span className="text-xs text-slate-500">Unassigned</span>;
  }

  const visibleDevices = user.assignedDevices.slice(0, 2);
  const remainingDevices = user.assignedDevices.length - visibleDevices.length;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {visibleDevices.map((device) => (
          <div
            key={device.value}
            title={device.label}
            className="flex size-8 items-center justify-center rounded-sm bg-slate-900 text-emerald-400"
          >
            <RiSmartphoneLine className="size-4" />
          </div>
        ))}
      </div>
      <div className="text-xs text-slate-600">
        {remainingDevices > 0 ? (
          <Badge variant="secondary">+{remainingDevices}</Badge>
        ) : null}
        <p className="mt-1">
          {user.assignedDevices.length}{" "}
          {user.assignedDevices.length === 1 ? "Device" : "Devices"}
        </p>
      </div>
    </div>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
