import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip } from "@chakra-ui/react";

import { RiEdit2Line, RiEyeLine } from "react-icons/ri";
import { TfiExchangeVertical, TfiReload } from "react-icons/tfi";
import { MdDeleteForever } from "react-icons/md";

export const enrollmentTableColumns = (rowCallback: any) => [
  {
    accessorKey: "userName",
    header: ({ column }: { column: any }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        User
        <TfiExchangeVertical />
      </Button>
    ),

    cell: ({ row }: { row: any }) => {
      const user = row.original;

      const initials = user.userName
        ?.split(" ")
        .map((x: string) => x[0])
        .join("");

      return (
        <div className="flex items-center gap-3">
          <Avatar className="size-9">
            <AvatarFallback className="bg-slate-200 text-xs text-slate-700">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div>
            <p className="font-semibold text-slate-900">{user.userName}</p>

            <p className="text-xs text-slate-500">{user.email}</p>
          </div>
        </div>
      );
    },

    size: 250,
  },

  {
    accessorKey: "employeeId",

    header: ({ column }: { column: any }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Employee ID
        <TfiExchangeVertical />
      </Button>
    ),

    cell: ({ row }: { row: any }) => (
      <span className="font-mono text-xs text-slate-700">
        {row.original.employeeId}
      </span>
    ),
  },

  {
    accessorKey: "department",

    header: ({ column }: { column: any }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Department
        <TfiExchangeVertical />
      </Button>
    ),

    cell: ({ row }: { row: any }) => <span className="flex items-center">{row.original.department}</span>,
  },

  {
    accessorKey: "assignedDevices",

    header: "Assigned Devices",

    cell: ({ row }: { row: any }) => <span className="ml-12">{row.original.assignedDevices}</span>,
  },

  {
    accessorKey: "syncStatus",

    header: ({ column }: { column: any }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Sync Status
        <TfiExchangeVertical />
      </Button>
    ),

    cell: ({ row }: { row: any }) => (
      <div className="flex flex-col items-start ml-4">
        <Badge 
        className={`${row.original.syncStatus.toLowerCase() === "synced" ? "bg-green-600" : row.original.syncStatus.toLowerCase() === "pending" ? "bg-yellow-500" : "bg-red-500"}`}
        >
          {row.original.syncStatus}
        </Badge>

        <p className="mt-1 text-xs text-slate-500">{row.original.lastSync}</p>
      </div>
    ),
  },

  {
    accessorKey: "dateAdded",

    header: ({ column }: { column: any }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Date Added
        <TfiExchangeVertical />
      </Button>
    ),

    cell: ({ row }: { row: any }) => (
      <span className="text-xs text-slate-700">{row.original.dateAdded}</span>
    ),
  },

  {
    accessorKey: "actions",

    header: () => <div className="text-right pr-2">Actions</div>,

    cell: ({ row }: { row: any }) => (
      <div className="flex justify-center gap-2">
        <Tooltip label="View" hasArrow placement="top" className="text-[12px]">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => rowCallback("view", row.original)}
          >
            <RiEyeLine />
          </Button>
        </Tooltip>

        <Tooltip label="Edit" hasArrow placement="top" className="text-[12px]">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => rowCallback("edit", row.original)}
          >
            <RiEdit2Line />
          </Button>
        </Tooltip>
        <Tooltip label="Retry Syncing" hasArrow placement="top" className="text-[12px]">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => rowCallback("edit", row.original)}
          >
            <TfiReload />
          </Button>
        </Tooltip>
        <Tooltip label="Delete User Bio" hasArrow placement="top" className="text-[12px]">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => rowCallback("edit", row.original)}
          >
           <MdDeleteForever />
          </Button>
        </Tooltip>
      </div>
    ),
  },
];
