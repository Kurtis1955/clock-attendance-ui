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

import AddEditBiometricUser from "@/components/modals/addeditbiometricuserModal/AddEditBiometricUser";
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
import { DataTable } from "@/components/tables/data-table";
import { enrollmentTableColumns } from "@/components/tables/enrollmentTable/enrollmentTable";

const biometricUsersSeed = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    userName: "John Doe",
    email: "john.doe@company.com",
    ecode: "EMP-2041",
    phoneNumber: "+233 24 000 2041",
    department: "Information Technology",
    branch: "Head Office",
    userType: "Device User",
    assignedDevices: 3,
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
    ecode: "EMP-3523",
    phoneNumber: "+233 24 000 3523",
    department: "Human Resources",
    branch: "Head Office",
    userType: "Device User",
    assignedDevices: 4,
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
    ecode: "EMP-4187",
    phoneNumber: "+233 24 000 4187",
    department: "Operations",
    branch: "Takoradi Branch",
    userType: "Device User",
    assignedDevices: 1,
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
    ecode: "EMP-3022",
    phoneNumber: "+233 24 000 3022",
    department: "Finance",
    branch: "Tema Branch",
    userType: "Device User",
    assignedDevices: 2,
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
    ecode: "EMP-5011",
    phoneNumber: "+233 24 000 5011",
    department: "Security",
    branch: "Head Office",
    userType: "Device User",
    assignedDevices: 4,
    biometricMethods: ["Fingerprint"],
    syncStatus: "Failed",
    dateAdded: "20 May 2024 09:55 AM",
    lastSync: "15 mins ago",
    enabled: true,
  },
];

export default function EnrollmentPage() {
  const [storeRetrievedData, setStoreRetrievedData] =
    useState<any[]>(biometricUsersSeed);
  const [selectedUser, setSelectedUser] = useState<any[]>(
    [],
  );
  const [modalAction, setModalAction] = useState<"add" | "edit" | "view">(
    "add",
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const statCards = [
    {
      title: "Total Device Users",
      value: 2,
      caption: "All users in the system",
      trend: "8.4%",
      trendDirection: "up",
      icon: RiTeamLine,
      color: "bg-blue-50 text-blue-700",
    },
    {
      title: "Assigned Users",
      value: 4,
      caption: "Assigned to at least one device",
      trend: "6.7%",
      trendDirection: "up",
      icon: RiShieldUserLine,
      color: "bg-emerald-50 text-emerald-700",
    },
    {
      title: "Unassigned Users",
      value: 3,
      caption: "Not assigned to any device",
      trend: "3.2%",
      trendDirection: "down",
      icon: RiUserUnfollowLine,
      color: "bg-orange-50 text-orange-700",
    },
    // {
    //   title: "Pending Sync",
    //   value: pendingUsers.toLocaleString(),
    //   caption: "Awaiting device sync",
    //   trend: "12.5%",
    //   trendDirection: "down",
    //   icon: RiUploadCloud2Line,
    //   color: "bg-violet-50 text-violet-700",
    // },
  ];

  const openModal = (
    action: "add" | "edit" | "view",
  ) => {
    setModalAction(action);
    setSelectedUser([]);
    setIsModalOpen(true);
  };

  const handleRowAction = (actionType: any, rowData: any) => {
    console.log("actionType", actionType, "rowData>>", rowData);
    if (actionType === "edit") {
      setSelectedUser(rowData);
      setModalAction("edit");
      setIsModalOpen(true);
      console.log("edit action clicked", rowData.id);
      Promise.all([
        // getUserPermissionsByUserId(rowData.userName),
        // getUserById(rowData.userName),
      ]);
    } else if (actionType === "view") {
      setSelectedUser(rowData);
      setModalAction("view");
      setIsModalOpen(true);
      Promise.all([
        // getUserPermissionsByUserId(rowData.userName),
        // getUserById(rowData.userName),
      ]);
      // setisLDAP(false);
      console.log("isGeneralModalOpen:", true);
    } else if (actionType == "switch") {
      // getChangeRowStatus(rowData);
    }
  };

  const handlePageChange = (pageIndex: number, pageSize: number) => {
    //fetchPageData(pageIndex, pageSize);
    console.log("pageIndex@11>>", pageIndex, "pageSize>>", pageSize);
    setPageCount(pageIndex);
    setPageSize(pageSize);
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
          {/* <Button variant="outline" className="h-10 border-slate-200 bg-white">
            <RiRefreshLine className="size-4" />
            Sync Devices
          </Button> */}
          <Button
          variant="outline"
            className="h-10 "
            onClick={() => openModal("add")}
          >
            <RiAddLine className="size-4" />
            Enroll User
          </Button>
        </div>
      </div>

      <div className="grid gap-16 sm:grid-cols-2 xl:grid-cols-3">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          const TrendIcon =
            stat.trendDirection === "up" ? RiArrowUpLine : RiArrowDownLine;

          return (
            <Card key={stat.title} className="border-slate-200 shadow-sm">
              <CardContent className="flex min-h-22 items-center gap-4">
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
                    {/* <Badge
                      className={cn(
                        stat.trendDirection === "up"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-orange-50 text-orange-700",
                      )}
                    >
                      <TrendIcon className="size-3" />
                      {stat.trend}
                    </Badge> */}
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

      <div className="w-full">
        <DataTable
          columns={enrollmentTableColumns(handleRowAction) as any}
          data={storeRetrievedData as any}
          pageCount={pageCount}
          onPageChange={handlePageChange}
          pageSize={pageSize}
          totalItems={storeRetrievedData.length}
          type="roles"
          defaultColumns={["Drag", "Actions", "User Number"]}
        />
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
            callback={()=>{

            }}
            onClose={() => setIsModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

