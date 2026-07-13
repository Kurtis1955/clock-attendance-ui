"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import AddEditDevice from "@/components/modals/addeditDeviceModal/AddEditDevice";
import { DataTable } from "@/components/tables/data-table";
import { deviceTableColumns } from "@/components/tables/deviceTable/device-table";
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
import { Label } from "@/components/ui/label";
import useSearchDevice from "@/hooks/useSearchDevice";
import { regrexForSpecialDashChars } from "@/lib/helpers";
import { useEffect, useMemo, useState } from "react";
import {
  RiAddLine,
  RiFilter3Line,
  RiRouterLine,
  RiSearchLine,
  RiUserLine,
  RiWifiLine,
  RiWifiOffLine,
} from "react-icons/ri";
import ReactSelect from "react-select";
import _debounce from "lodash/debounce";
import { useUserPermissions } from "@/hoc/permissions-context";
import { toast } from "sonner";

type DeviceStatus = "Online" | "Offline" | "Warning" | "offline";

const getDeviceStatCards = () => [
  {
    title: "Total Devices",
    value: 1,
    caption: "Registered devices",
    icon: RiRouterLine,
    color: "bg-blue-50 text-blue-700",
  },

  {
    title: "Online Devices",
    value: 1,
    caption: "Currently connected",
    icon: RiWifiLine,
    color: "bg-green-50 text-green-700",
  },

  {
    title: "Offline Devices",
    value: 1,
    caption: "Require attention",
    icon: RiWifiOffLine,
    color: "bg-red-50 text-red-700",
  },

  {
    title: "Assigned Users",
    value: 1,
    caption: "Across all devices",
    icon: RiUserLine,
    color: "bg-amber-50 text-amber-700",
  },
];

export default function DevicesPage() {
  const { permissions: userPermissions } = useUserPermissions();
  const [isAddDeviceModalOpen, setIsAddDeviceModalOpen] = useState(false);
  const [storeRetrievedData, setStoreRetrievedData] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDevice, setSelectedDevice] = useState<any | null>(null);
  const [actionType, setActionType] = useState<"add" | "edit" | "view">("add");
  const [pageCount, setPageCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(10);
  const [filterData, setFilterData] = useState("");
  const [loadingRoleDetails, setLoadingUserDetails] = useState(false);

  const {
    inputValue,
    handleInputRoleChange,
    deviceSearch,
    error: roleSearchError,
    loading: loadingRole,
  } = useSearchDevice({ pageCount, pageSize, filterData });

  const notifySuccess = (message: string) =>
    toast.success(message, {
      position: "top-right",
      style: {
        background: "#16a34a",
        color: "#fff",
        border: "1px solid #15803d",
      },
    });

  const notifyError = (message: string) =>
    toast.error(message, {
      position: "top-right",
      style: {
        background: "#dc2626",
        color: "#fff",
        border: "1px solid #b91c1c",
      },
    });

  const statCards = useMemo(() => getDeviceStatCards(), [storeRetrievedData]);

  const canCreateDevice = userPermissions.some((permission) =>
    ["device_create"].some((hint) =>
      permission.toLowerCase().includes(hint),
    ),
  );

  const canManageDevices = userPermissions.some((permission) =>
    ["device_manage", "device_create", "device_sync"].some((hint) =>
      permission.toLowerCase().includes(hint),
    ),
  );

  const canViewDevices = userPermissions.some((permission) =>
    ["device_read"].some((hint) =>
      permission.toLowerCase().includes(hint),
    ),
  );

  const canToggleDeviceStatus = canManageDevices;

  // useEffect(() => {
  //   fetchDevices();
  // }, [pageCount, pageSize]);
  useEffect(() => {
    if (inputValue == "") {
      fetchDevices();
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

  const fetchDevices = async () => {
    try {
      const res = await fetch(
        `/api/device?paginate=true&page=${pageCount}&size=${pageSize}`,
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setStoreRetrievedData(data.content);
      setTotalItems(data.totalElements);
    } catch (error) {
      console.error("Error Fecthing users:", error);
      notifyError("Unable to load devices. Please try again.");
    }
  };

  const handleRowAction = (actionType: any, rowData: any) => {
    console.log("actionType", actionType, "rowData>>", rowData);

    if (actionType === "view" && !canViewDevices) return
    if ((actionType === "edit" || actionType === "switch") && !canManageDevices) return
    if (["delete", "sync-device"].includes(actionType) && !canManageDevices) return

    if (actionType === "edit") {
      setSelectedDevice(rowData);
      setActionType("edit");
      setIsAddDeviceModalOpen(true);
      console.log("edit action clicked", rowData.id);
      Promise.all([
        // getUserPermissionsByUserId(rowData.userName),
        // getUserById(rowData.userName),
      ]);
    } else if (actionType === "view") {
      setSelectedDevice(rowData);
      setActionType("view");
      setIsAddDeviceModalOpen(true);
      Promise.all([
        // getUserPermissionsByUserId(rowData.userName),
        // getUserById(rowData.userName),
      ]);
      // setisLDAP(false);
      console.log("isGeneralModalOpen:", true);
    } else if (actionType == "delete") {
      getDeviceSyncStatus(rowData, actionType);
    } else if (actionType == "sync-device") {
      getDeviceSyncStatus(rowData, actionType);
    } else if (actionType == "switch") {
      getDeviceSyncStatus(rowData, actionType);
    }
  };

  const handleChangeTextSearch = (e: any) => {
    const dataToSearch = regrexForSpecialDashChars(e.target.value);
    setSearchQuery(dataToSearch);
    debouncedSearch(dataToSearch);
  };
  const debouncedSearch = _debounce(handleInputRoleChange, 500);

  const handlePageChange = (pageIndex: number, pageSize: number) => {
    //fetchPageData(pageIndex, pageSize);
    console.log("pageIndex@11>>", pageIndex, "pageSize>>", pageSize);
    setPageCount(pageIndex);
    setPageSize(pageSize);
  };

  const getDeviceSyncStatus = async (rowData: any, actionType: any) => {
    try {
      if (actionType.toLowerCase() === "delete") {
        const deviceRemoval = await fetch(`/api/device/?id=${rowData.uuid}`, {
          method: "PUT",
          body: JSON.stringify({ enabled: rowData.statusCheck }),
        });

        if (!deviceRemoval.ok) {
          throw new Error(`HTTP error! status: ${deviceRemoval.status}`);
        }
        console.log("Device removed");
        notifySuccess("Device removed successfully.");
      } else if (actionType.toLowerCase() === "sync-device") {
        const deviceResync = await fetch(`/api/device/${rowData.uuid}/?id=${rowData.uuid}`, {
          method: "POST",
          body: JSON.stringify({ status: "ACTIVE" }),
        });

        if (!deviceResync.ok) {
          throw new Error(`HTTP error! status: ${deviceResync.status}`);
        }
        console.log("Device synced");
        notifySuccess("Device synced successfully.");
      } else {
        const deviceResync = await fetch(
          `/api/device/${rowData.uuid}?enabled=${rowData.statusCheck}`,
          {
            method: "PATCH",
            body: JSON.stringify({ status: rowData.statusCheck }),
          },
        );

        if (!deviceResync.ok) {
          throw new Error(`HTTP error! status: ${deviceResync.status}`);
        }
        console.log("Device synced");
        notifySuccess("Device status updated successfully.");
      }
      fetchDevices();
    } catch (error) {
      console.log("error occured");
      notifyError("Unable to complete the device action. Please try again.");
    }
  };

  const filteredDevices = useMemo(() => {
    return storeRetrievedData.filter((device) => {
      const matchesSearchQuery =
        device.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        device.serialNumber?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatusFilter =
        statusFilter === "all" || device.status.toLowerCase() === statusFilter;
      return matchesSearchQuery && matchesStatusFilter;
    });
  }, [storeRetrievedData, searchQuery, statusFilter]);

  const handleDeviceSave = async () => {
    await fetchDevices();
    setIsAddDeviceModalOpen(false);
    // setIsAddDeviceModalOpen(false);
  };

  return (
    <div className="w-full flex flex-col gap-5 px-2 xl:px-8 pt-2">
      <div className="w-full flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-[#0f172a]">
          Device Management
        </h1>

        <Button
          variant="outline"
          className="h-10 border-slate-200"
          disabled={!canCreateDevice}
          onClick={() => {
            setActionType("add");
            setSelectedDevice(null);
            setIsAddDeviceModalOpen(true);
          }}
        >
          <RiAddLine className="size-4 text-yellow-500" />
          Add Device
        </Button>
      </div>

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
                    {stat?.title}
                  </p>
                  <p className="mt-2 text-2xl font-bold text-[#0f172a]">
                    {stat?.value}
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
                placeholder="Search device by name or serial no..."
                value={searchQuery}
                onChange={(e) => {
                  handleChangeTextSearch(e);
                  // setFilterData("");
                }}
                className="h-10 pr-10"
              />
              <RiSearchLine className="absolute right-3 top-1/2 size-5 -translate-y-1/2 text-slate-500" />
            </div>
            <div className="w-full sm:w-2/3 flex items-center justify-start sm:justify-start gap-2">
              {/* <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="h-10 rounded-lg border border-input bg-white px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 w-full sm:w-36"
              >
                <option value="all">All Status</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select> */}
              {/* <select
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value)}
                className="h-10 rounded-lg border border-input bg-white px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 w-full sm:w-32"
              >
                <option value="all">All Type</option>
                <option value="system">System</option>
                <option value="custom">Custom</option>
              </select> */}
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
              columns={deviceTableColumns(
            handleRowAction,
            {
              canViewDevices,
              canManageDevices,
              canToggleDeviceStatus,
            },
          ) as any}
              data={storeRetrievedData}
              pageCount={pageCount}
              onPageChange={handlePageChange}
              pageSize={pageSize}
              totalItems={filteredDevices.length}
              type="devices"
              defaultColumns={["Drag", "Actions", "User Number"]}
            />
          </div>
        </div>
      </div>

      <Dialog
        open={isAddDeviceModalOpen}
        onOpenChange={setIsAddDeviceModalOpen}
      >
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {actionType === "edit" ? "Edit Device" : "View Device"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "edit"
                ? "Update the selected device details."
                : actionType === "add"
                  ? "Add a new device to the system."
                  : "Review the selected device details."}
            </DialogDescription>
          </DialogHeader>
          <AddEditDevice
            existingDeviceData={selectedDevice}
            actionType={actionType}
            callback={handleDeviceSave}
            onClose={() => setIsAddDeviceModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
