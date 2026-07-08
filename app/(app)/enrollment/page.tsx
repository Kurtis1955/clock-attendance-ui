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
import { Label } from "@/components/ui/label";
import ReactSelect from "react-select";

const searchSelectStyles = {
  control: (base: any) => ({
    ...base,
    minHeight: 44,
    // borderRadius: 12,
    borderColor: "#d1d5db",
    boxShadow: "none",
    transition: "border-color 150ms ease",
    "&:hover": {
      borderColor: "#cbd5e1",
    },
  }),
  menu: (base: any) => ({
    ...base,
    zIndex: 9999,
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.15)",
  }),
  menuPortal: (base: any) => ({
    ...base,
    zIndex: 9999,
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isFocused ? "#f8fafc" : "white",
    color: "#0f172a",
    cursor: "pointer",
  }),
  placeholder: (base: any) => ({
    ...base,
    color: "#64748b",
  }),
  singleValue: (base: any) => ({
    ...base,
    color: "#0f172a",
  }),
};

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
  const [batchUserDeviceData, setBatchUserDeviceData] = useState<any[]>([]);
  const [isenableAssign, setisenableAssign] = useState(true);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [batchModalAction, setBatchModalAction] = useState<
    "assign" | "unassign"
  >("assign");
  const [deviceOptions, setDeviceOptions] = useState<any[]>([]);
  const [assignedDevices, setAssignedDevices] = useState<any[]>([]);
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
      fetchDeviceOptions();
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

  const handleSelectedRows = (data: any) => {
    console.log(
      "Selected Data>>>",
      data.map((item: any) => item.id),
    );
    if (data.length) {
      setisenableAssign(false);
      setBatchUserDeviceData(data.map((item: any) => item.id));
    } else {
      setisenableAssign(true);
      setBatchUserDeviceData([]);
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

  const fetchDeviceOptions = async () => {
    try {
      const response = await fetch("/api/device");
      if (!response.ok) {
        throw new Error("Failed to fetch devices");
      }
      const data = await response.json();
      const options = data?.content?.map((device: any) => ({
        label: device.name,
        value: device.serialNumber,
      }));
      setDeviceOptions(options || []);
    } catch (error) {
      console.error("Error fetching devices:", error);
    }
  };

  const handleBulkAssign = async () => {
    try {
      setLoading(true);

      const serialNumbers = assignedDevices.map((item: any) => item.value);
      const payload = {
        userIds: batchUserDeviceData,
        serialNumbers,
      };

      console.log("payLoad", payload);
      // return;
      const bulkassign =
        batchModalAction === "assign"
          ? await fetch(`/api/enrollment/bulkassign`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payload),
            })
          : await fetch(`/api/enrollment/bulkunassign`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payload),
            });

      if (bulkassign.ok) {
        if (batchModalAction === "assign") {
          toast({
            title: "Success",
            description: "Users assigned successfully",
            status: "success", // 'info', 'warning', 'error', 'success'
            duration: 3000, // Duration in milliseconds
            isClosable: true, // Allows closing the toast
          });
        } else if (batchModalAction === "unassign") {
          toast({
            title: "Success",
            description: "Users unassigned successfully",
            status: "success", // 'info', 'warning', 'error', 'success'
            duration: 3000, // Duration in milliseconds
            isClosable: true, // Allows closing the toast
          });
        }
      } else {
        if (batchModalAction === "assign") {
          toast({
            title: "error",
            description: "Failed to assign Users",
            status: "success", // 'info', 'warning', 'error', 'success'
            duration: 3000, // Duration in milliseconds
            isClosable: true, // Allows closing the toast
          });
        } else {
          toast({
            title: "error",
            description: "Failed to unassign Users",
            status: "success", // 'info', 'warning', 'error', 'success'
            duration: 3000, // Duration in milliseconds
            isClosable: true, // Allows closing the toast
          });
        }
      }
    } catch (error) {
    } finally {
      setLoading(false);
      fetchUsers;
      setIsBatchModalOpen(false)
    }
  };

  const debouncedSearch = _debounce(handleInputRoleChange, 500);
  console.log(
    "batchUserDeviceData>>",
    batchUserDeviceData,
    "assignedDevices>>",
    assignedDevices,
  );
  return (
    <div className="flex flex-col gap-5 px-2 xl:px-8 pt-2">
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

      <div className="w-full flex flex-col items-center justify-between gap-2 sm:flex-row">
        <div className="w-full md:w-1/2 xl:w-1/3 relative">
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

        <div>
          <Button
            variant="outline"
            className="ml-2 h-10"
            onClick={() => {
              setIsBatchModalOpen(true);
              setBatchModalAction("assign");
            }}
            disabled={isenableAssign}
          >
            Bulk Device Assignment
          </Button>
          <Button
            variant="outline"
            className="ml-2 h-10"
            onClick={() => {
              setIsBatchModalOpen(true);
              setBatchModalAction("unassign");
            }}
            disabled={isenableAssign}
          >
            Bulk Device Unassignment
          </Button>
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
          onSelectedRowsChange={handleSelectedRows}
        />
      </div>

      <Dialog open={isBatchModalOpen} onOpenChange={setIsBatchModalOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {batchModalAction === "assign"
                ? "Assign Device to Users"
                : "Unassign Device from Users"}
            </DialogTitle>
            <DialogDescription>
              {batchModalAction === "assign"
                ? "Assign selected users to a biometric device."
                : "Unassign selected users from a biometric device."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-6">
            <div className="space-y-2 ">
              <ReactSelect
                name="devices"
                classNamePrefix="react-select"
                placeholder="Select Devices"
                styles={searchSelectStyles}
                // menuPosition="absolute"
                // menuPlacement="auto"
                isMulti
                value={assignedDevices.map((device) => ({
                  label: device.label,
                  value: device.value,
                }))}
                onChange={(selectedOption: any) => {
                  setAssignedDevices(
                    selectedOption
                      ? [...selectedOption].map((option) => ({
                          label: option.label,
                          value: option.value,
                        }))
                      : [],
                  );
                }}
                options={deviceOptions}
                isClearable
              />
            </div>
            <div className="w-full flex justify-end">
              {batchModalAction == "assign" && (
                <Button
                  onClick={handleBulkAssign}
                  className="w-28 bg-amber-400"
                >
                  Assign
                </Button>
              )}
              {batchModalAction === "unassign" && (
                <Button
                  onClick={handleBulkAssign}
                  className="w-28 bg-amber-400"
                >
                  Unassign
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
