import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip } from "@chakra-ui/react";

import {
  RiRouterLine,
  RiUserLine,
  RiEdit2Fill,
  RiMore2Fill,
} from "react-icons/ri";
import { FaEye } from "react-icons/fa";

export const deviceTableColumns = (rowCallback: any) => [
  {
    accessorKey: "name",
    header: "Device Name",
    cell: ({ row }: { row: any }) => (
      <div className="flex items-center gap-3 pl-2">
        {/* <div
          className={`flex size-10 items-center justify-center rounded-lg ${
            row.original.color || "bg-blue-50 text-blue-700"
          }`}
        >
          <RiRouterLine className="size-5" />
        </div> */}

        <div>
          <p className="font-medium text-gray-700">{row.original.name}</p>

          <p className="text-xs text-slate-500">{row.original.model}</p>
        </div>
      </div>
    ),
  },

  {
    accessorKey: "serialNumber",
    header: "Serial Number",
    cell: ({ row }: { row: any }) => (
      <span className="font-mono text-sm">{row.original.serialNumber}</span>
    ),
  },

  {
    accessorKey: "branch",
    header: "Device Location",
  },

  {
    accessorKey: "ipAddress",
    header: "IP Address",
    cell: ({ row }: { row: any }) => (
      <Badge variant="outline">{row.original.ipAddress}</Badge>
    ),
  },

  {
    accessorKey: "assignedUsers",
    header: "Assigned Users",
    cell: ({ row }: { row: any }) => (
      <div className="flex items-center gap-2">
        <RiUserLine className="size-4 text-slate-500" />
        {row.original.assignedUsers}
      </div>
    ),
  },

  {
    accessorKey: "lastSync",
    header: "Last Sync",
  },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }: { row: any }) => {
      const status = row.original.status;

      return (
        <Badge
          className={
            status === "Online"
              ? "bg-green-100 text-green-700"
              : status === "Offline"
                ? "bg-red-100 text-red-700"
                : status === "Warning"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-blue-100 text-blue-700"
          }
        >
          {status}
        </Badge>
      );
    },
  },

  {
    accessorKey: "actions",
    header: "Actions",

    cell: ({ row }: { row: any }) => (
      <div className="flex justify-center gap-2">
        <Tooltip label="View Device" hasArrow placement="top" className="z-50 text-sm text-stone-400">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => rowCallback("view", row.original)}
          >
            <FaEye />
          </Button>
        </Tooltip>

        <Tooltip label="Edit Device" hasArrow placement="top" className="z-50 text-sm text-stone-400">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => rowCallback("edit", row.original)}
          >
            <RiEdit2Fill />
          </Button>
        </Tooltip>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon-sm">
              <RiMore2Fill />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => rowCallback("assign-users", row.original)}
            >
              Assign Users
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => rowCallback("sync-device", row.original)}
            >
              Sync Device
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => rowCallback("configuration", row.original)}
            >
              Configure Device
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => rowCallback("logs", row.original)}>
              View Logs
            </DropdownMenuItem>

            <DropdownMenuItem
              className="text-red-600"
              onClick={() => rowCallback("delete", row.original)}
            >
              Delete Device
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];
