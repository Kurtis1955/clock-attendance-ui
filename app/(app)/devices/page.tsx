"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import AddEditDevice, {
  type DeviceRecord,
} from "@/components/modals/addeditDeviceModal/AddEditDevice";
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
import { regrexForSpecialDashChars } from "@/lib/helpers";
import { useMemo, useState } from "react";
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

type DeviceStatus = "Online" | "Offline" | "Warning" | "offline";

interface DeviceItem extends DeviceRecord {
  id: string;
  name: string;
  serialNumber: string;
  model: string;
  branch: string;
  ipAddress: string;
  assignedUsers: number;
  lastSync: string;
  status: DeviceStatus;
  color: string;
}

const locationLabels: Record<string, string> = {
  "main-entrance": "Main Entrance",
  reception: "Reception",
  "server-room": "Server Room",
  "hr-office": "HR Office",
  "finance-office": "Finance Office",
  warehouse: "Warehouse",
  "branch-office": "Branch Office",
};

const createDevice = (
  device: DeviceRecord &
    Pick<DeviceItem, "id" | "assignedUsers" | "lastSync" | "status" | "color">,
): DeviceItem => ({
  ...device,
  name: device.device_name,
  serialNumber: device.device_sn,
  model: device.device_type,
  branch: locationLabels[device.alias_name] ?? device.alias_name,
  ipAddress: device.ipaddress,
});

const devices: DeviceItem[] = [
  createDevice({
    id: "1",
    device_sn: "ZKT-HO-001",
    device_name: "Head Office Clock 01",
    alias_name: "main-entrance",
    vendor: "ZKTeco",
    device_type: "SpeedFace V5L",
    ipaddress: "10.10.1.15",
    push_comm_key: "ho-clock-01",
    time_zone: "GMT+0",
    trans_interval: 1,
    error_delay: 60,
    delay: 30,
    finger_fun_on: true,
    face_fun_on: true,
    palm_fun_on: true,
    userpicurl_fun_on: true,
    mask_fun_on: true,
    real_time: true,
    assignedUsers: 245,
    lastSync: "2 mins ago",
    status: "Online",
    color: "bg-green-50 text-green-700",
  }),
  createDevice({
    id: "2",
    device_sn: "ZKT-HO-002",
    device_name: "Head Office Clock 02",
    alias_name: "reception",
    vendor: "ZKTeco",
    device_type: "MB560-VL",
    ipaddress: "10.10.1.16",
    push_comm_key: "ho-clock-02",
    time_zone: "GMT+0",
    trans_interval: 2,
    error_delay: 60,
    delay: 30,
    finger_fun_on: true,
    face_fun_on: true,
    palm_fun_on: false,
    userpicurl_fun_on: true,
    mask_fun_on: true,
    real_time: true,
    assignedUsers: 198,
    lastSync: "1 min ago",
    status: "Online",
    color: "bg-green-50 text-green-700",
  }),
  createDevice({
    id: "3",
    device_sn: "ZKT-KSI-001",
    device_name: "Kumasi Branch Clock",
    alias_name: "branch-office",
    vendor: "ZKTeco",
    device_type: "SpeedFace V4L",
    ipaddress: "10.10.2.10",
    push_comm_key: "kumasi-clock",
    time_zone: "GMT+0",
    trans_interval: 5,
    error_delay: 90,
    delay: 45,
    finger_fun_on: true,
    face_fun_on: true,
    palm_fun_on: false,
    userpicurl_fun_on: false,
    mask_fun_on: false,
    real_time: false,
    assignedUsers: 134,
    lastSync: "15 mins ago",
    status: "Offline",
    color: "bg-amber-50 text-amber-700",
  }),
  createDevice({
    id: "4",
    device_sn: "ZKT-TKD-001",
    device_name: "Takoradi Clock",
    alias_name: "warehouse",
    vendor: "ZKTeco",
    device_type: "MB360",
    ipaddress: "10.10.3.12",
    push_comm_key: "takoradi-clock",
    time_zone: "GMT+0",
    trans_interval: 10,
    error_delay: 120,
    delay: 60,
    finger_fun_on: true,
    face_fun_on: false,
    palm_fun_on: false,
    userpicurl_fun_on: true,
    mask_fun_on: false,
    real_time: false,
    assignedUsers: 97,
    lastSync: "1 hour ago",
    status: "Offline",
    color: "bg-red-50 text-red-700",
  }),
  createDevice({
    id: "5",
    device_sn: "ZKT-CC-001",
    device_name: "Cape Coast Clock",
    alias_name: "finance-office",
    vendor: "ZKTeco",
    device_type: "SpeedFace V5L",
    ipaddress: "10.10.4.11",
    push_comm_key: "cape-coast-clock",
    time_zone: "GMT+0",
    trans_interval: 2,
    error_delay: 60,
    delay: 30,
    finger_fun_on: true,
    face_fun_on: true,
    palm_fun_on: true,
    userpicurl_fun_on: true,
    mask_fun_on: true,
    real_time: true,
    assignedUsers: 86,
    lastSync: "5 mins ago",
    status: "Online",
    color: "bg-green-50 text-green-700",
  }),
  createDevice({
    id: "6",
    device_sn: "ZKT-TML-001",
    device_name: "Tamale Clock",
    alias_name: "hr-office",
    vendor: "ZKTeco",
    device_type: "MB560-VL",
    ipaddress: "10.10.5.14",
    push_comm_key: "tamale-clock",
    time_zone: "GMT+0",
    trans_interval: 3,
    error_delay: 60,
    delay: 30,
    finger_fun_on: true,
    face_fun_on: true,
    palm_fun_on: false,
    userpicurl_fun_on: true,
    mask_fun_on: false,
    real_time: true,
    assignedUsers: 122,
    lastSync: "3 mins ago",
    status: "Online",
    color: "bg-green-50 text-green-700",
  }),
  createDevice({
    id: "7",
    device_sn: "ZKT-SNY-001",
    device_name: "Sunyani Clock",
    alias_name: "server-room",
    vendor: "ZKTeco",
    device_type: "SpeedFace V4L",
    ipaddress: "10.10.6.18",
    push_comm_key: "sunyani-clock",
    time_zone: "GMT+0",
    trans_interval: 5,
    error_delay: 90,
    delay: 45,
    finger_fun_on: true,
    face_fun_on: true,
    palm_fun_on: false,
    userpicurl_fun_on: false,
    mask_fun_on: false,
    real_time: false,
    assignedUsers: 65,
    lastSync: "25 mins ago",
    status: "Offline",
    color: "bg-blue-50 text-blue-700",
  }),
  createDevice({
    id: "8",
    device_sn: "ZKT-TMA-001",
    device_name: "Tema Clock",
    alias_name: "branch-office",
    vendor: "ZKTeco",
    device_type: "MB360",
    ipaddress: "10.10.7.21",
    push_comm_key: "tema-clock",
    time_zone: "GMT+0",
    trans_interval: 2,
    error_delay: 60,
    delay: 30,
    finger_fun_on: true,
    face_fun_on: false,
    palm_fun_on: false,
    userpicurl_fun_on: true,
    mask_fun_on: false,
    real_time: true,
    assignedUsers: 178,
    lastSync: "7 mins ago",
    status: "Online",
    color: "bg-green-50 text-green-700",
  }),
];

const getDeviceStatCards = (currentDevices: DeviceItem[]) => [
  {
    title: "Total Devices",
    value: currentDevices.length,
    caption: "Registered devices",
    icon: RiRouterLine,
    color: "bg-blue-50 text-blue-700",
  },

  {
    title: "Online Devices",
    value: currentDevices.filter((device) => device.status === "Online").length,
    caption: "Currently connected",
    icon: RiWifiLine,
    color: "bg-green-50 text-green-700",
  },

  {
    title: "Offline Devices",
    value: currentDevices.filter((device) => device.status === "Offline")
      .length,
    caption: "Require attention",
    icon: RiWifiOffLine,
    color: "bg-red-50 text-red-700",
  },

  {
    title: "Assigned Users",
    value: currentDevices.reduce(
      (sum, device) => sum + device.assignedUsers,
      0,
    ),
    caption: "Across all devices",
    icon: RiUserLine,
    color: "bg-amber-50 text-amber-700",
  },
];

const locationOptions = [
  { value: "main-entrance", label: "Main Entrance" },
  { value: "reception", label: "Reception" },
  { value: "server-room", label: "Server Room" },
  { value: "hr-office", label: "HR Office" },
  { value: "finance-office", label: "Finance Office" },
  { value: "warehouse", label: "Warehouse" },
  { value: "branch-office", label: "Branch Office" },
];

export default function DevicesPage() {
  const [isAddDeviceModalOpen, setIsAddDeviceModalOpen] = useState(false);
  const [storeRetrievedData, setStoreRetrievedData] =
    useState<DeviceItem[]>(devices);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDevice, setSelectedDevice] = useState<DeviceItem | null>(null);
  const [actionType, setActionType] = useState<"add" | "edit" | "view">("add");
  const [pageCount, setPageCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const statCards = useMemo(
    () => getDeviceStatCards(storeRetrievedData),
    [storeRetrievedData],
  );

  const handleRowAction = (actionType: any, rowData: any) => {
    console.log("actionType", actionType, "rowData>>", rowData);
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
    } else if (actionType == "switch") {
      // getChangeUserStatus(rowData);
    }
  };

  const handleChangeTextSearch = (e: any) => {
    const dataToSearch = regrexForSpecialDashChars(e.target.value);
    setSearchQuery(dataToSearch);
  };

  const handlePageChange = (pageIndex: number, pageSize: number) => {
    //fetchPageData(pageIndex, pageSize);
    console.log("pageIndex@11>>", pageIndex, "pageSize>>", pageSize);
    setPageCount(pageIndex);
    setPageSize(pageSize);
  };

  const handleDeviceSave = (deviceRecord: DeviceRecord) => {
    setStoreRetrievedData((currentDevices) => {
      const existingDevice = selectedDevice;
      const savedDevice = createDevice({
        ...deviceRecord,
        id:
          existingDevice?.id ||
          `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        assignedUsers: existingDevice?.assignedUsers || 0,
        lastSync: existingDevice?.lastSync || "Not synced",
        status: existingDevice?.status || "Offline",
        color: existingDevice?.color || "bg-red-50 text-red-700",
      });

      if (!existingDevice) {
        return [savedDevice, ...currentDevices];
      }

      return currentDevices.map((device) =>
        device.id === existingDevice.id ? savedDevice : device,
      );
    });
  };

  const filteredDevices = useMemo(() => {
    return storeRetrievedData.filter((device) => {
      const matchesSearchQuery =
        device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        device.serialNumber.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatusFilter =
        statusFilter === "all" || device.status.toLowerCase() === statusFilter;
      return matchesSearchQuery && matchesStatusFilter;
    });
  }, [storeRetrievedData, searchQuery, statusFilter]);

  return (
    <div className="w-full flex flex-col gap-5 px-2 lg:px-8 pt-2">
      <PageHeader
        title="Devices"
        // description="Monitor and manage ZKTeco and third-party biometric devices."
        actions={
          <div className="flex w-full justify-start gap-2 sm:justify-end">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="h-10 border-slate-200 bg-white"
                >
                  <RiAddLine className="size-4" />
                  Add Device
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Add Device</DialogTitle>
                  <DialogDescription>
                    Create a device and configure its settings.
                  </DialogDescription>
                </DialogHeader>
                <div className="w-full">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <Label>Device Serial Number</Label>
                      <Input onChange={(e) => e.target.value} />
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label>Device Name</Label>
                      <Input onChange={(e) => e.target.value} />
                    </div>

                    <div className="space-y-1.5">
                      <Label>Device Location</Label>

                      <ReactSelect
                        options={locationOptions}
                        placeholder="Select device location"
                        className="text-sm z-index"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label>Device</Label>
                      <Input onChange={(e) => e.target.value} />
                    </div>
                  </div>
                  <div className="flex justify-end  pt-6">
                    <Button
                      type="submit"
                      className="bg-yellow-500 hover:bg-yellow-600"
                    >
                      Save Device
                    </Button>
                  </div>
                </div>
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
            <div className="w-full sm:w-2/3 flex items-center justify-between sm:justify-end gap-2">
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="h-10 rounded-lg border border-input bg-white px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 w-full sm:w-36"
              >
                <option value="all">All Status</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
              {/* <select
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value)}
                className="h-10 rounded-lg border border-input bg-white px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 w-full sm:w-32"
              >
                <option value="all">All Type</option>
                <option value="system">System</option>
                <option value="custom">Custom</option>
              </select> */}
              <Button
                variant="outline"
                className="h-10 border-slate-200 bg-black text-white hover:bg-[#141313] hover:text-white"
              >
                <RiFilter3Line className="size-4 text-yellow-500" />
                Filters
              </Button>
            </div>
          </div>

          <div className="w-full flex flex-row gap-4">
            <DataTable
              columns={deviceTableColumns(handleRowAction) as any}
              data={filteredDevices}
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
        open={isAddDeviceModalOpen && actionType !== "add"}
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
