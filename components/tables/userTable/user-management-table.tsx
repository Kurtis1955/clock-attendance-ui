"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { TfiEye } from "react-icons/tfi";
import { TfiPencilAlt } from "react-icons/tfi";
import { TfiExchangeVertical } from "react-icons/tfi";
import { Checkbox } from "@/components/ui/checkbox";
// import DeleteRowAlert from "@/components/modals/alertModals/DeleteRowAlert";
import { MdOutlineDeleteOutline } from "react-icons/md";

import { Tooltip } from "@chakra-ui/react";
// import TaskAssignment from "@/components/forms/assignments/taskCombo";
import { MdCancel, MdDelete, MdRefresh } from "react-icons/md";
import { RxDragHandleDots2 } from "react-icons/rx";
// import PriorityBadge from "@/components/ui/PriorityBadge";
import { useRouter } from "next/navigation";
// import { format } from "date-fns";
import { FaEye } from "react-icons/fa";
import React from "react";
import { RiEdit2Fill } from "react-icons/ri";

const columnHelper: any = createColumnHelper<any>();
// This type is used to define the shape of our data.
//This export the columns and the and the keys that would be used
//to target the data in the backend response
//this is for active Roles

export const userTableColumns = (rowCallback: any) => {
  return [
    {
          accessorKey: "drag",
          headerLabel: "Drag",
          header: ({ column }: { column: any }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                #
              </Button>
            );
          },
    
          cell: ({ row }: { row: any }) => {
            return (
              <div className="cursor-grab">
                <div className="px-0">
                  <RxDragHandleDots2 />
                </div>
              </div>
            );
          },
          minSize: 5,
          size: 5,
        },
    {
      accessorKey: "eCode",
      headerLabel: "E-code",
      header: ({ column }: { column: any }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            E-code
            <TfiExchangeVertical />
          </Button>
        );
      },
      size: 50,
    },
    {
      accessorKey: "userName",
      headerLabel: "User Name",
      header: ({ column }: { column: any }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            User Name
            <TfiExchangeVertical />
          </Button>
        );
      },
      size: 50,
    },

    {
      accessorKey: "firstName",
      headerLabel: "First Name",
      header: ({ column }: { column: any }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            First Name
            <TfiExchangeVertical />
          </Button>
        );
      },
    },

    {
      accessorKey: "lastName",
      headerLabel: "Last Name",
      header: ({ column }: { column: any }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Last Name
            <TfiExchangeVertical />
          </Button>
        );
      },
    },
    {
      accessorKey: "email",
      headerLabel: "Email",
      header: ({ column }: { column: any }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            <TfiExchangeVertical />
          </Button>
        );
      },
    },
    {
      accessorKey: "roles",
      headerLabel: "Role",
      header: ({ column }: { column: any }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Role
            <TfiExchangeVertical />
          </Button>
        );
      },
    },
    // {
    //   accessorKey: "department",
    //   headerLabel: "Department",
    //   header: ({ column }: { column: any }) => {
    //     return (
    //       <Button
    //         variant="ghost"
    //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //       >
    //         Department
    //         <TfiExchangeVertical />
    //       </Button>
    //     );
    //   },
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
      headerLabel: "Actions",
      header: "Actions",
      cell: ({ row }: { row: any }) => {
        return (
          <div className="flex gap-1 px-0  justify-center">
            <Tooltip label={"View"} hasArrow placement="bottom">
              <Button
                variant={"outline"}
                className=" text-black-600"
                onClick={() =>
                  // router.push(`/management/users/${row.original.id}`)
                  rowCallback("view", {
                    ...row.original,
                  })
                }
              >
                <FaEye />
              </Button>
            </Tooltip>
            <Tooltip label={"Edit"} hasArrow placement="bottom">
              <Button
                variant={"outline"}
                className=" text-black-600"
                onClick={() =>
                  // router.push(`/management/users/edit/${row.original.id}`)
                  rowCallback("edit", {
                    ...row.original,
                  })
                }
              >
                <RiEdit2Fill />
              </Button>
            </Tooltip>
          </div>
        );
      },
    },
  ];
};

export const teamsTableColumns = (rowCallback: any) => {
  return [
    {
          accessorKey: "drag",
          headerLabel: "Drag",
          header: ({ column }: { column: any }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                #
              </Button>
            );
          },
    
          cell: ({ row }: { row: any }) => {
            return (
              <div className="cursor-grab">
                <div className="px-0">
                  <RxDragHandleDots2 />
                </div>
              </div>
            );
          },
          minSize: 5,
          size: 5,
        },
    {
      accessorKey: "teamName",
      headerLabel: "Team Name",
      header: ({ column }: { column: any }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Team Name
            <TfiExchangeVertical />
          </Button>
        );
      },
      size: 50,
    },
    {
      accessorKey: "teamLicensePlate",
      headerLabel: "Team License Plate",
      header: ({ column }: { column: any }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Team License Plate
            <TfiExchangeVertical />
          </Button>
        );
      },
    },
    {
      accessorKey: "appVersion",
      headerLabel: "Device Version",
      header: ({ column }: { column: any }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Device Version
            <TfiExchangeVertical />
          </Button>
        );
      },
    },

    {
      accessorKey: "teamLeaderName",
      headerLabel: "Team Leader Name",
      header: ({ column }: { column: any }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Team Leader Name
            <TfiExchangeVertical />
          </Button>
        );
      },
    },

    {
      accessorKey: "departmentName",
      headerLabel: "Department",
      header: ({ column }: { column: any }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Department
            <TfiExchangeVertical />
          </Button>
        );
      },
    },

    // {
    //   accessorKey: "teamLeaderEmail",
    //   headerLabel: "Team Leader Email",
    //   header: ({ column }: { column: any }) => {
    //     return (
    //       <Button
    //         variant="ghost"
    //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //       >
    //         Team Leader Email
    //         <TfiExchangeVertical />
    //       </Button>
    //     );
    //   },
    // },
    // {
    //   accessorKey: "teamLeaderContact",
    //   headerLabel: "Team Leader Contact",
    //   header: ({ column }: { column: any }) => {
    //     return (
    //       <Button
    //         variant="ghost"
    //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //       >
    //         Team Leader Contact
    //         <TfiExchangeVertical />
    //       </Button>
    //     );
    //   },
    // },

    {
      accessorKey: "isActive",
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
        if (row.original.isActive) {
          return (
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                defaultChecked
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
                value=""
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
      headerLabel: "Actions",
      header: "Actions",
      cell: ({ row }: { row: any }) => {
        return (
          <div className="flex gap-1 px-0  justify-center">
            <Tooltip label={"View"} hasArrow placement="bottom">
              <Button
                variant={"outline"}
                className=" text-black-600"
                onClick={() =>
                  // router.push(`/management/users/${row.original.id}`)
                  rowCallback("view", {
                    ...row.original,
                  })
                }
              >
                <FaEye />
              </Button>
            </Tooltip>
            <Tooltip label={"Edit"} hasArrow placement="bottom">
              <Button
                variant={"outline"}
                className=" text-black-600"
                onClick={() =>
                  // router.push(`/management/users/edit/${row.original.id}`)
                  rowCallback("edit", {
                    ...row.original,
                  })
                }
              >
                <RiEdit2Fill />
              </Button>
            </Tooltip>
          </div>
        );
      },
    },
  ];
};


export const roleTableColumns = (rowCallback: any) => {
  return [
    {
          accessorKey: "drag",
          headerLabel: "Drag",
          header: ({ column }: { column: any }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                #
              </Button>
            );
          },
    
          cell: ({ row }: { row: any }) => {
            return (
              <div className="cursor-grab">
                <div className="px-0">
                  <RxDragHandleDots2 />
                </div>
              </div>
            );
          },
          minSize: 5,
          size: 5,
        },
    {
      accessorKey: "name",
      headerLabel: "Role",
      header: ({ column }: { column: any }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Role
            <TfiExchangeVertical />
          </Button>
        );
      },
      size: 50,
    },
    {
      accessorKey: "description",
      headerLabel: "Description",
      header: ({ column }: { column: any }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
          Description
            <TfiExchangeVertical />
          </Button>
        );
      },
    },

   

    {
      accessorKey: "enabled",
      headerLabel: "Status",
      header: ({ column }: { column: any }) => {
        return (
          <div
            className="flex gap-1 "
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
             Status
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
                defaultChecked
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
                value=""
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
      headerLabel: "Actions",
      header: "Actions",
      cell: ({ row }: { row: any }) => {
        return (
          <div className="flex gap-1 px-0  justify-center">
            <Tooltip label={"View"} hasArrow placement="bottom">
              <Button
                variant={"outline"}
                className=" text-black-600"
                onClick={() =>
                  // router.push(`/management/users/${row.original.id}`)
                  rowCallback("view", {
                    ...row.original,
                  })
                }
              >
                <FaEye />
              </Button>
            </Tooltip>
            <Tooltip label={"Edit"} hasArrow placement="bottom">
              <Button
                variant={"outline"}
                className=" text-black-600"
                onClick={() =>
                  // router.push(`/management/users/edit/${row.original.id}`)
                  rowCallback("edit", {
                    ...row.original,
                  })
                }
              >
                <RiEdit2Fill />
              </Button>
            </Tooltip>
          </div>
        );
      },
    },
  ];
};


export const licensePlateTableColumns = (rowCallback: any) => {
  return [
    {
          accessorKey: "drag",
          headerLabel: "Drag",
          header: ({ column }: { column: any }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                #
              </Button>
            );
          },
    
          cell: ({ row }: { row: any }) => {
            return (
              <div className="cursor-grab">
                <div className="px-0">
                  <RxDragHandleDots2 />
                </div>
              </div>
            );
          },
          minSize: 5,
          size: 5,
        },
    {
      accessorKey: "licensePlate",
      headerLabel: "License Plate Number",
      header: ({ column }: { column: any }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
          License Plate Number
            <TfiExchangeVertical />
          </Button>
        );
      },
      size: 50,
    },

    {
      accessorKey: "createdAt",
      headerLabel: "createdAt",
      header: ({ column }: { column: any }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
           Created At
            <TfiExchangeVertical />
          </Button>
        );
      },
    },

   
    {
      accessorKey: "createdByName",
      headerLabel: "createdBy",
      header: ({ column }: { column: any }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
           Created By
            <TfiExchangeVertical />
          </Button>
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
        if (row.original.isActive) {
          return (
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                defaultChecked
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
                value=""
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
      headerLabel: "Actions",
      header: "Actions",
      cell: ({ row }: { row: any }) => {
        return (
          <div className="flex gap-1 px-0  justify-center">
            {/* <Tooltip label={"View"} hasArrow placement="bottom">
              <Button
                variant={"outline"}
                className=" text-black-600"
                onClick={() =>
                  // router.push(`/management/users/${row.original.id}`)
                  rowCallback("view", {
                    ...row.original,
                  })
                }
              >
                <FaEye />
              </Button>
            </Tooltip> */}
            <Tooltip label={"Edit"} hasArrow placement="bottom">
              <Button
                variant={"outline"}
                className=" text-black-600"
                onClick={() =>
                  // router.push(`/management/users/edit/${row.original.id}`)
                  rowCallback("edit", {
                    ...row.original,
                  })
                }
              >
                <RiEdit2Fill />
              </Button>
            </Tooltip>
          </div>
        );
      },
    },

  ];
};