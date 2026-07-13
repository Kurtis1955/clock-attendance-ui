import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip } from "@chakra-ui/react";

import { RiEdit2Line, RiEyeLine } from "react-icons/ri";
import { TfiExchangeVertical, TfiReload } from "react-icons/tfi";
import { MdDeleteForever } from "react-icons/md";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

let sortValue = "asc";

export const enrollmentTableColumns = (
  rowCallback: any,
  permissions: {
    canManageStaff?: boolean;
    // canManageUsers?: boolean;
    canToggleUserStatus?: boolean;
  } = {},
) => {
  const canManageStaff = permissions.canManageStaff ?? true;
  const canToggleUserStatus = permissions.canToggleUserStatus ?? true;
  return [
    {
      id: "select",
      header: ({ table }: { table: any }) => <div className="">Check</div>,
      cell: ({ row }: { row: any }) => (
        <div>
          <Checkbox
            checked={row.getIsSelected()}
            disabled={!canManageStaff}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
      size: 50,
    },
    {
      accessorKey: "firstName",
      header: ({ column }: { column: any }) => (
        <Button
          variant="ghost"
          onClick={() => {
            sortValue = sortValue === "asc" ? "desc" : "asc";
            rowCallback("sort", { sortValue, field: "firstName" });
          }}
        >
          First Name
          <TfiExchangeVertical />
        </Button>
      ),

      cell: ({ row }: { row: any }) => {
        const user = row.original;

        return (
          <div className="flex items-center gap-3">
            <div>
              <p className=" ml-3">{user.firstName}</p>
            </div>
          </div>
        );
      },

      size: 250,
    },
    {
      accessorKey: "lastName",
      header: ({ column }: { column: any }) => (
        <Button
          variant="ghost"
          onClick={() => {
            sortValue = sortValue === "asc" ? "desc" : "asc";
            rowCallback("sort", { sortValue, field: "lastName" });
          }}
        >
          Last Name
          <TfiExchangeVertical />
        </Button>
      ),

      cell: ({ row }: { row: any }) => {
        const user = row.original;

        return (
          <div className="flex items-center gap-3">
            <div>
              <p className=" ml-3">{user.lastName}</p>
            </div>
          </div>
        );
      },

      size: 250,
    },
    {
      accessorKey: "email",

      header: ({ column }: { column: any }) => (
        <Button
          variant="ghost"
          onClick={() => {
            sortValue = sortValue === "asc" ? "desc" : "asc";
            rowCallback("sort", { sortValue, field: "email" });
          }}
        >
          Email
          <TfiExchangeVertical />
        </Button>
      ),

      cell: ({ row }: { row: any }) => (
        <span className="flex items-center ml-3">{row.original.email}</span>
      ),
    },
    {
      accessorKey: "e_code",

      header: ({ column }: { column: any }) => (
        <Button
          variant="ghost"
          onClick={() => {
            sortValue = sortValue === "asc" ? "desc" : "asc";
            rowCallback("sort", { sortValue, field: "e_code" });
          }}
        >
          Employee ID
          <TfiExchangeVertical />
        </Button>
      ),

      cell: ({ row }: { row: any }) => (
        <span className="font-mono text-sm text-slate-700 ml-3">
          {row.original.e_code}
        </span>
      ),
    },

    {
      accessorKey: "assignedDevices",

      header: "Assigned Devices",

      cell: ({ row }: { row: any }) => (
        <span className="ml-3">{row.original.assignedDevices?.length}</span>
      ),
    },

    // {
    //   accessorKey: "syncStatus",

    //   header: ({ column }: { column: any }) => (
    //     <Button
    //       variant="ghost"
    //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //     >
    //       Sync Status
    //       <TfiExchangeVertical />
    //     </Button>
    //   ),

    //   cell: ({ row }: { row: any }) => (
    //     <div className="flex flex-col items-start ml-4">
    //       <Badge
    //       className={`${row.original.syncStatus.toLowerCase() === "synced" ? "bg-green-600" : row.original.syncStatus.toLowerCase() === "pending" ? "bg-yellow-500" : "bg-red-500"}`}
    //       >
    //         {row.original.syncStatus}
    //       </Badge>

    //       <p className="mt-1 text-xs text-slate-500">{row.original.lastSync}</p>
    //     </div>
    //   ),
    // },

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
                disabled={!canToggleUserStatus}
                onChange={(e) => {
                  if (!canToggleUserStatus) {
                    return;
                  }
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
                disabled={!canToggleUserStatus}
                onChange={(e) => {
                  if (!canToggleUserStatus) {
                    return;
                  }
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

      header: () => <div className="text-center">Actions</div>,

      cell: ({ row }: { row: any }) => (
        <div className="flex justify-center gap-2">
          <Tooltip
            label="View"
            hasArrow
            placement="top"
            className="text-[12px]"
          >
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => rowCallback("view", row.original)}
            >
              <RiEyeLine />
            </Button>
          </Tooltip>

          <Tooltip
            label="Edit"
            hasArrow
            placement="top"
            className="text-[12px]"
          >
            <Button
              variant="outline"
              size="icon-sm"
              disabled={!canManageStaff}
              onClick={() => {
                if(!canManageStaff){
                  return
                }
                rowCallback("edit", row.original)}}
            >
              <RiEdit2Line />
            </Button>
          </Tooltip>
          {/* <Tooltip label="Retry Syncing" hasArrow placement="top" className="text-[12px]">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => rowCallback("edit", row.original)}
          >
            <TfiReload />
          </Button>
        </Tooltip> */}
          {/* <Tooltip
          label="Delete User Bio"
          hasArrow
          placement="top"
          className="text-[12px]"
        >
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => rowCallback("edit", row.original)}
          >
            <MdDeleteForever />
          </Button>
        </Tooltip> */}
        </div>
      ),
    },
  ];
};
