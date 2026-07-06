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
    accessorKey: "serialNumber",
    header: "Serial Number",
    cell: ({ row }: { row: any }) => (
      <span className="font-mono text-sm">{row.original.serialNumber}</span>
    ),
  },
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
    accessorKey: "location",
    header: "Device Location",
  },

  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }: { row: any }) => (
      <Badge variant="outline">{row.original.description}</Badge>
    ),
  },

  // {
  //   accessorKey: "assignedUsers",
  //   header: "Assigned Users",
  //   cell: ({ row }: { row: any }) => (
  //     <div className="flex items-center gap-2">
  //       <RiUserLine className="size-4 text-slate-500" />
  //       {row.original.assignedUsers}
  //     </div>
  //   ),
  // },

  {
    accessorKey: "deviceTypeName",
    header: "Device Type",
  },

  {
    accessorKey: "status",
    header: "Sync Status",
    cell: ({ row }: { row: any }) => {
      const status = row.original.status;

      return (
        <Badge
          className={
            status.toLowerCase() === "active"
              ? "bg-green-100 text-green-700"
              : status.toLowerCase() === "offline"
                ? "bg-red-100 text-red-700"
                : status.toLowerCase() === "not synced"
                  ? "bg-red-100 text-red-700"
                  : "bg-blue-100 text-blue-700"
          }
        >
          {status}
        </Badge>
      );
    },
  },

  {
    accessorKey: "enabled",
    headerLabel: " Active Status",
    header: ({ column }: { column: any }) => {
      return (
        <div
          className="flex gap-1 "
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Active Status
        </div>
      );
    },
    cell: ({ row }: { row: any }) => {
      if (row.original.enabled) {
        return (
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={row.original.enabled}
              onChange={(e) => {
                rowCallback("switch", {
                  ...row.original,
                  statusCheck: e.target.checked,
                });
              }}
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#4129f6]"></div>
            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300"></span>
          </label>
        );

        // return <span className="text-green-500">Active</span>;
      } else {
        return (
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={row.original.enabled}
              className="sr-only peer"
              onChange={(e) => {
                rowCallback("switch", {
                  ...row.original,
                  statusCheck: e.target.checked,
                });
              }}
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#4129f6]"></div>
            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300"></span>
          </label>
        );
        // return <span className="text-red-500">Inactive</span>;
      }
    },
  },

  {
    accessorKey: "actions",
    header: "Actions",

    cell: ({ row }: { row: any }) => (
      <div className="flex justify-center gap-2">
        <Tooltip
          label="View Device"
          hasArrow
          placement="top"
          className="z-50 text-sm text-stone-400"
        >
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => rowCallback("view", row.original)}
          >
            <FaEye />
          </Button>
        </Tooltip>

        <Tooltip
          label="Edit Device"
          hasArrow
          placement="top"
          className="z-50 text-sm text-stone-400"
        >
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
            {/* <DropdownMenuItem
              onClick={() => rowCallback("assign-users", row.original)}
            >
              Assign Users
            </DropdownMenuItem> */}

            <DropdownMenuItem
              onClick={() => rowCallback("sync-device", row.original)}
            >
              Sync Device
            </DropdownMenuItem>

            {/* <DropdownMenuItem
              onClick={() => rowCallback("configuration", row.original)}
            >
              Configure Device
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => rowCallback("logs", row.original)}>
              View Logs
            </DropdownMenuItem> */}

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
