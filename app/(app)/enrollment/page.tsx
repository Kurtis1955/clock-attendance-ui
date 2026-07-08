"use client";

import { useEffect, useMemo, useState } from "react";
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
import useSearchBiometricUser from "@/hooks/useSearchBiometricUser";
import _debounce from "lodash/debounce";
import { totalmem } from "os";
import { useToast } from "@chakra-ui/react";

export default function EnrollmentPage() {
  const [storeRetrievedData, setStoreRetrievedData] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any[]>([]);
  const [modalAction, setModalAction] = useState<"add" | "edit" | "view">(
    "add",
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [loadingRoleDetails, setLoadingUserDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterData, setFilterData] = useState("");
  const [totalItems, setTotalItems] = useState(storeRetrievedData.length);
  const toast = useToast();

  const openModal = (action: "add" | "edit" | "view") => {
    setModalAction(action);
    setSelectedUser([]);
    setIsModalOpen(true);
  };
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

  const {
    inputValue,
    handleInputRoleChange,
    deviceSearch,
    error: roleSearchError,
    loading: loadingRole,
  } = useSearchBiometricUser({ pageCount, pageSize, filterData });

  useEffect(() => {
    if (inputValue == "") {
      fetchUsers();
    } else {
      if (deviceSearch?.content?.length) {
        console.log("deviceSearch>>>", deviceSearch);
        setStoreRetrievedData(deviceSearch?.content);
        setLoadingUserDetails(!loadingRoleDetails);
      } else {
        setStoreRetrievedData([]);
        setLoadingUserDetails(!loadingRoleDetails);
      }
    }
  }, [deviceSearch?.content?.length, inputValue, pageCount, pageSize]);

  const fetchUsers = async () => {
    try {
      setLoadingUserDetails(true);
      const res = await fetch(
        `/api/enrollment?paginate=true&page=${pageCount}&size=${pageSize}`,
      );

      if (!res.ok) {
        toast({
          title: "Error!",
          description: "Failed to load users",
          status: "error", // 'info', 'warning', 'error', 'success'
          duration: 3000, // Duration in milliseconds
          isClosable: true, // Allows closing the toast
        });
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setStoreRetrievedData(data.content);
      setTotalItems(data.totalElements);
    } catch (error) {
      console.error("Error Fecthing users:", error);
      toast({
        title: "Error!",
        description: "Failed to load users",
        status: "error", // 'info', 'warning', 'error', 'success'
        duration: 3000, // Duration in milliseconds
        isClosable: true, // Allows closing the toast
      });
    } finally {
      setTimeout(() => {
        setLoadingUserDetails(false);
      }, 500);
    }
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
      getChangeUserStatus(rowData);
    }
  };

  const getChangeUserStatus = async (rowData: any) => {
    setLoading(true);
    const payload = {
      id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      name: rowData.name,
      description: rowData.description,
      enabled: rowData.statusCheck,
    };
    try {
      const userReq = await fetch(`/api/user/${rowData.id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      if (userReq.ok) {
        // toast({
        //   title: "Success!",
        //   description: "User updated successfully",
        //   status: "success", // 'info', 'warning', 'error', 'success'
        //   duration: 3000, // Duration in milliseconds
        //   isClosable: true, // Allows closing the toast
        // });

        setStoreRetrievedData((prevData) => {
          if (!prevData) return prevData;
          return prevData.map((item: any) => {
            console.log("item", item, "equals", item.id === rowData.id);
            return item.id === rowData.id
              ? { ...item, enabled: rowData.statusCheck }
              : item;
          });
        });
      } else {
        console.log("error changing role status");
      }
    } catch (error) {
      console.error("Error updating role status:", error);
      // toast({
      //   title: "Error!",
      //   description: "Failed to update role status",
      //   status: "error", // 'info', 'warning', 'error', 'success'
      //   duration: 3000, // Duration in milliseconds
      //   isClosable: true, // Allows closing the toast
      // });
    }
    setTimeout(() => {
      setLoading(false);
    }, 200);
  };

  const handlePageChange = (pageIndex: number, pageSize: number) => {
    //fetchPageData(pageIndex, pageSize);
    console.log("pageIndex@11>>", pageIndex, "pageSize>>", pageSize);
    setPageCount(pageIndex);
    setPageSize(pageSize);
  };

  const handleChangeTextSearch = (e: any) => {
    const dataToSearch = regrexForSpecialDashChars(e.target.value);
    setSearchQuery(dataToSearch);
    debouncedSearch(dataToSearch);
  };
  const debouncedSearch = _debounce(handleInputRoleChange, 500);

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
          {/* <Button variant="outline" className="h-10 border-slate-200 bg-white">
            <RiTeamLine className="size-4" />
            Bulk Assignment
          </Button> */}
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

      <div className="grid gap-6 lg:gap-8 sm:grid-cols-2 xl:grid-cols-3">
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
        <div className="w-full md:w-1/2 xl:w-1/3 relative min-w-0 flex-1">
          <Input
            type="search"
            placeholder="Search user by name or description..."
            value={searchQuery}
            onChange={(e) => {
              handleChangeTextSearch(e);
              setFilterData("");
            }}
            className="h-10 pr-10"
          />
          <RiSearchLine className="absolute right-3 top-1/2 size-5 -translate-y-1/2 text-slate-500" />
        </div>
      </div>
      <div className="w-full">
        <DataTable
          columns={enrollmentTableColumns(handleRowAction) as any}
          data={storeRetrievedData as any}
          pageCount={pageCount}
          onPageChange={handlePageChange}
          pageSize={pageSize}
          totalItems={
            inputValue == "" ? totalItems : deviceSearch?.content?.length
          }
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
            callback={() => {
              fetchUsers();
              setIsModalOpen(false);
            }}
            onClose={() => setIsModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
