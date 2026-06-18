"use client";

import { useMemo, useState } from "react";
import {
  RiAddLine,
  RiBarChartBoxLine,
  RiDashboardLine,
  RiFilter3Line,
  RiFingerprintLine,
  RiRouterLine,
  RiSearchLine,
  RiShieldCheckLine,
  RiShieldKeyholeLine,
  RiUserLine,
} from "react-icons/ri";

import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  getAllNavigationPermissionValues,
} from "@/lib/navigation";
import { DataTable } from "@/components/tables/data-table";
import { roleTableColumns } from "@/components/tables/roleTable/role-management-table";
import AddEditRole from "@/components/modals/addeditroleModal/AddEditRole";
import { regrexForSpecialDashChars } from "@/lib/helpers";

type RoleType = "System" | "Custom";
type RoleStatus = "Active" | "Inactive";

interface RoleItem {
  id: string;
  name: string;
  description: string;
  type: RoleType;
  users: number;
  status: RoleStatus;
  permissions: string[];
  color: string;
}

const roles: RoleItem[] = [
  {
    id: "1",
    name: "Super Administrator",
    description: "Full system access and configuration",
    type: "System",
    users: 2,
    status: "Active",
    permissions: getAllNavigationPermissionValues(),
    color: "bg-purple-50 text-purple-700",
  },
  {
    id: "2",
    name: "Administrator",
    description: "Manage users, devices, and system settings",
    type: "System",
    users: 5,
    status: "Active",
    permissions: ["/dashboard", "/users", "/roles", "/devices", "/reports"],
    color: "bg-blue-50 text-blue-700",
  },
  {
    id: "3",
    name: "Branch Manager",
    description: "Manage branch operations and reports",
    type: "Custom",
    users: 8,
    status: "Active",
    permissions: ["/dashboard", "/users", "/attendance", "/reports"],
    color: "bg-green-50 text-green-700",
  },
  {
    id: "4",
    name: "HR Manager",
    description: "Manage employees and attendance",
    type: "Custom",
    users: 6,
    status: "Active",
    permissions: ["/users", "/enrollment", "/attendance", "/reports"],
    color: "bg-amber-50 text-amber-700",
  },
  {
    id: "5",
    name: "Attendance Officer",
    description: "View and manage attendance records",
    type: "Custom",
    users: 12,
    status: "Active",
    permissions: ["/dashboard", "/attendance", "/reports"],
    color: "bg-violet-50 text-violet-700",
  },
  {
    id: "6",
    name: "Device Operator",
    description: "Manage device operations and logs",
    type: "Custom",
    users: 4,
    status: "Active",
    permissions: ["/devices", "/enrollment"],
    color: "bg-cyan-50 text-cyan-700",
  },
  {
    id: "7",
    name: "Reports Viewer",
    description: "View reports and analytics",
    type: "Custom",
    users: 7,
    status: "Inactive",
    permissions: ["/dashboard", "/reports"],
    color: "bg-slate-100 text-slate-700",
  },
  {
    id: "8",
    name: "Security Officer",
    description: "Manage security and access logs",
    type: "Custom",
    users: 3,
    status: "Active",
    permissions: ["/dashboard", "/roles", "/devices"],
    color: "bg-rose-50 text-rose-700",
  },
];

const getStatCards = (currentRoles: RoleItem[]) => [
  {
    title: "Total Roles",
    value: currentRoles.length,
    caption: "All system roles",
    icon: RiShieldKeyholeLine,
    color: "bg-purple-50 text-purple-700",
  },
  {
    title: "Active Roles",
    value: currentRoles.filter((role) => role.status === "Active").length,
    caption: "Currently active",
    icon: RiUserLine,
    color: "bg-green-50 text-green-700",
  },
  {
    title: "System Roles",
    value: currentRoles.filter((role) => role.type === "System").length,
    caption: "Default system roles",
    icon: RiShieldCheckLine,
    color: "bg-amber-50 text-amber-700",
  },
  {
    title: "Custom Roles",
    value: currentRoles.filter((role) => role.type === "Custom").length,
    caption: "Created by administrators",
    icon: RiAddLine,
    color: "bg-red-50 text-red-600",
  },
];

const permissionSummary = [
  {
    label: "User Management",
    value: 32,
    color: "bg-blue-600",
    icon: RiUserLine,
  },
  {
    label: "Device Management",
    value: 28,
    color: "bg-green-500",
    icon: RiRouterLine,
  },
  {
    label: "Attendance",
    value: 24,
    color: "bg-amber-500",
    icon: RiFingerprintLine,
  },
  {
    label: "Reports & Analytics",
    value: 20,
    color: "bg-purple-500",
    icon: RiBarChartBoxLine,
  },
  {
    label: "System Access",
    value: 16,
    color: "bg-cyan-500",
    icon: RiDashboardLine,
  },
  {
    label: "Other Permissions",
    value: 8,
    color: "bg-slate-400",
    icon: RiShieldCheckLine,
  },
];

const totalPermissions = permissionSummary.reduce(
  (total, item) => total + item.value,
  0,
);

export default function RolesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [storeRetrievedData, setStoreRetrievedData] = useState(roles);
  const [pageCount, setPageCount] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRole, setSelectedRole] = useState<RoleItem | null>(null);
  const [roleModalAction, setRoleModalAction] = useState<"view" | "edit">(
    "view",
  );
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);

  const statCards = useMemo(
    () => getStatCards(storeRetrievedData),
    [storeRetrievedData],
  );

  const filteredRoles = useMemo(() => {
    return storeRetrievedData.filter((role) => {
      const matchesSearch =
        role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        role.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || role.status.toLowerCase() === statusFilter;
      const matchesType =
        typeFilter === "all" || role.type.toLowerCase() === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [searchQuery, statusFilter, storeRetrievedData, typeFilter]);

  const handleRowAction = (actionType: any, rowData: any) => {
    console.log("actionType", actionType, "rowData>>", rowData);
    if (actionType === "edit") {
      setSelectedRole(rowData);
      setRoleModalAction("edit");
      setIsRoleModalOpen(true);
      console.log("edit action clicked", rowData.id);
      Promise.all([
        // getUserPermissionsByUserId(rowData.userName),
        // getUserById(rowData.userName),
      ]);
    } else if (actionType === "view") {
      setSelectedRole(rowData);
      setRoleModalAction("view");
      setIsRoleModalOpen(true);
      Promise.all([
        // getUserPermissionsByUserId(rowData.userName),
        // getUserById(rowData.userName),
      ]);
      // setisLDAP(false);
      console.log("isGeneralModalOpen:", true);
    } else if (actionType == "switch") {
      // getChangeUserStatus(rowData);
    }
  };

  const handlePageChange = (pageIndex: number, pageSize: number) => {
    //fetchPageData(pageIndex, pageSize);
    console.log("pageIndex@11>>", pageIndex, "pageSize>>", pageSize);
    setPageCount(pageIndex);
    setPageSize(pageSize);
  };

  const handleRoleSave = (updatedRole: RoleItem) => {
    setStoreRetrievedData((currentRoles) => {
      const roleExists = currentRoles.some((role) => role.id === updatedRole.id);

      if (!roleExists) {
        return [updatedRole, ...currentRoles];
      }

      return currentRoles.map((role) =>
        role.id === updatedRole.id ? { ...role, ...updatedRole } : role,
      );
    });
  };

  const handleChangeTextSearch = (e: any) => {
    const dataToSearch = regrexForSpecialDashChars(e.target.value);
    setSearchQuery(dataToSearch);
  };

  return (
    <div className="w-full flex flex-col gap-5 px-2 lg:px-8 pt-2">
      <PageHeader
        title="Roles"
        // description="Create, manage, and configure roles and permissions for system access control."
        actions={
          <div className="flex w-full justify-start gap-2 sm:justify-end">
            {/* <Button variant="outline" className="border-slate-200 bg-white">
              <RiRefreshLine className="size-4 text-blue-700" />
              Permission Matrix
            </Button> */}
            <Dialog
              open={isAddRoleModalOpen}
              onOpenChange={setIsAddRoleModalOpen}
            >
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="h-10 border-slate-200 bg-white"
                >
                  <RiAddLine className="size-4" />
                  Add Role
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Add Role</DialogTitle>
                  <DialogDescription>
                    Create a role and choose the permissions it can access.
                  </DialogDescription>
                </DialogHeader>
                <AddEditRole
                  actionType="add"
                  callback={handleRoleSave}
                  onClose={() => setIsAddRoleModalOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.title} className="border-slate-200 shadow-sm">
              <CardContent className="flex items-center gap-4">
                <div
                  className={`flex size-14 shrink-0 items-center justify-center rounded-xl ${stat.color}`}
                >
                  <Icon className="size-7" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#0f172a]">
                    {stat.title}
                  </p>
                  <p className="mt-2 text-2xl font-bold text-[#0f172a]">
                    {stat.value}
                  </p>
                  <p className="text-sm text-[#475569]">{stat.caption}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="space-y-4 mt-2 flex flex-col gap-4 lg:mt-0">
        <div className="w-full space-y-4 mt-4 flex flex-col gap-4 lg:mt-0">
          <div className="w-ull flex flex-col gap-3 sm:flex-row lg:items-center">
            <div className="w-full sm:w-1/3 relative min-w-0 flex-1">
              <Input
                type="search"
                placeholder="Search roles by name or description..."
                value={searchQuery}
                onChange={(e) => {
                  handleChangeTextSearch(e);
                  // setFilterData("");
                }}
                className="h-10 pr-10"
              />
              <RiSearchLine className="absolute right-3 top-1/2 size-5 -translate-y-1/2 text-slate-500" />
            </div>
            <div className="w-full sm:w-2/3 flex items-center justify-between sm:justify-end gap-2">
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="h-10 rounded-lg border border-input bg-white px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 w-full sm:w-36"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <select
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value)}
                className="h-10 rounded-lg border border-input bg-white px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 w-full sm:w-32"
              >
                <option value="all">All Type</option>
                <option value="system">System</option>
                <option value="custom">Custom</option>
              </select>
              {/* <Button
                variant="outline"
                className="h-10 border-slate-200 bg-black text-white hover:bg-[#141313] hover:text-white"
              >
                <RiFilter3Line className="size-4 text-yellow-500" />
                Filters
              </Button> */}
            </div>
          </div>

          <div className="w-full flex flex-row gap-4">
            <DataTable
              columns={roleTableColumns(handleRowAction) as any}
              data={filteredRoles as any}
              pageCount={pageCount}
              onPageChange={handlePageChange}
              pageSize={pageSize}
              totalItems={filteredRoles.length}
              type="roles"
              defaultColumns={["Drag", "Actions", "User Number"]}
            />

            {/* <aside className="space-y-5 h-full lg:h-auto">
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="border-b">
                  <CardTitle>Role Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div>
                    <p className="mb-4 font-semibold text-[#0f172a]">
                      Permissions Overview
                    </p>
                    <div className="mx-auto flex size-44 items-center justify-center rounded-full bg-[conic-gradient(#2563eb_0_25%,#22c55e_25%_47%,#f59e0b_47%_66%,#8b5cf6_66%_82%,#06b6d4_82%_94%,#94a3b8_94%_100%)]">
                      <div className="flex size-28 flex-col items-center justify-center rounded-full bg-white">
                        <span className="text-2xl font-bold text-[#0f172a]">
                          {totalPermissions}
                        </span>
                        <span className="text-xs text-slate-500">
                          Total Permissions
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {permissionSummary.map((item) => {
                      const Icon = item.icon;
                      const percent = Math.round(
                        (item.value / totalPermissions) * 100,
                      );

                      return (
                        <div
                          key={item.label}
                          className="flex items-center justify-between gap-3 text-sm"
                        >
                          <div className="flex min-w-0 items-center gap-2">
                            <span
                              className={`size-2.5 rounded-full ${item.color}`}
                            />
                            <Icon className="size-4 shrink-0 text-slate-500" />
                            <span className="truncate text-slate-700">
                              {item.label}
                            </span>
                          </div>
                          <span className="shrink-0 font-semibold text-[#0f172a]">
                            {item.value} ({percent}%)
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </aside> */}
          </div>
        </div>
      </div>

      <Dialog open={isRoleModalOpen} onOpenChange={setIsRoleModalOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {roleModalAction === "edit" ? "Edit Role" : "View Role"}
            </DialogTitle>
            <DialogDescription>
              {roleModalAction === "edit"
                ? "Update this role and its permissions."
                : "Review this role and its permissions."}
            </DialogDescription>
          </DialogHeader>
          <AddEditRole
            actionType={roleModalAction}
            existingRoleData={selectedRole}
            callback={handleRoleSave}
            onClose={() => setIsRoleModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
