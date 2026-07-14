"use client";
import { DataTable } from "@/components/tables/data-table";
import { userTableColumns } from "@/components/tables/userTable/user-management-table";
import { UserStatsCards } from "@/components/users/user-stats-cards";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { modalContentTypeData } from "@/lib/constants";
import { regrexForSpecialDashChars } from "@/lib/helpers";
import { managedUsers } from "@/lib/users-data";
import { useEffect, useState } from "react";
import _debounce from "lodash/debounce";
import { Button } from "@/components/ui/button";
import AddEditUser from "@/components/modals/addedituserModal/AddEditUser";
import { RiAddLine, RiDownloadLine } from "react-icons/ri";
import useSearchUsers from "@/hooks/useSearchUser";
import { useUserPermissions } from "@/hoc/permissions-context";
import { toast } from "sonner";


export default function UsersPage() {
  const { permissions: userPermissions, loading: permissionsLoading } =
    useUserPermissions();
  const [storeRetrievedData, setStoreRetrievedData] = useState<any>([]);
  const [modalContentType, setmodalContentType] = useState<any>(null);
  const [isGeneralModalOpen, setIsGeneralModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(storeRetrievedData.length);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterData, setFilterData] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [actionType, setActionType] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingUserDetails, setLoadingUserDetails] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeUser, setActiveUser] = useState(0);
  const [inActiveUser, setInActiveUser] = useState(0);
  const [adminUser, setAdminUser] = useState(0);
  const {
    inputValue,
    handleInputUserChange,
    userSearch,
    error: userSearchError,
    loading: loadingUser,
  } = useSearchUsers({ pageCount, pageSize, filterData });

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
  // const [addUserTrue,setAddUserTrue] = useState(false);

  useEffect(() => {
    console.log("userPermission on user page", userPermissions)
    if (inputValue == "") {
      fetchUsers();
    } else {
      if (userSearch?.content?.length) {
        console.log("userSearch>>>", userSearch);
        setStoreRetrievedData(userSearch?.content);
        setLoadingUserDetails(!loadingUserDetails);
      } else {
        setStoreRetrievedData([]);
        setLoadingUserDetails(!loadingUserDetails);
      }
    }
  }, [userSearch?.content?.length, inputValue, pageCount, pageSize]);

  const canCreateUser = userPermissions.some((permission) =>
    ["user_create", "user_manage", "user_read"].some((hint) =>
      permission.toLowerCase().includes(hint),
    ),
  )

  const canManageUsers = userPermissions.some((permission) =>
    ["user_manage", "user_create"].some((hint) =>
      permission.toLowerCase().includes(hint),
    ),
  )

  const canViewUsers = userPermissions.some((permission) =>
    ["user_read", "user_manage", "user_create"].some((hint) =>
      permission.toLowerCase().includes(hint),
    ),
  )

  const canToggleUserStatus = canManageUsers

  const initiateModal = (modalType: any) => {
    console.log("Setting modal content type to:", modalType);
    setmodalContentType(modalType);
    setIsGeneralModalOpen(true);
  };

  const handleRowAction = (actionType: any, rowData: any) => {
    console.log("actionType", actionType, "rowData>>", rowData);
    if (actionType === "edit") {
      console.log("edit action clicked", rowData.id);
      initiateModal(modalContentTypeData.editUser);
      setActionType("edit");
      setSelectedUser(rowData);
      Promise.all([
        // getUserPermissionsByUserId(rowData.userName),
        // getUserById(rowData.userName),
      ]);
    } else if (actionType === "view") {
      initiateModal(modalContentTypeData.viewUser);
      setActionType("view");
      setSelectedUser(rowData);
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

  const handlePageChange = (pageIndex: number, pageSize: number) => {
    //fetchPageData(pageIndex, pageSize);
    console.log("pageIndex@11>>", pageIndex, "pageSize>>", pageSize);
    setPageCount(pageIndex);
    setPageSize(pageSize);
  };

  const getChangeUserStatus = async (rowData: any) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/users/${rowData.id}/status?enabled=${rowData.statusCheck}`,
        {
          method: "PUT",
        },
      );
      setStoreRetrievedData((prevData:any) => {
        if (!prevData) return prevData;
        return prevData.map((item: any) => {
          console.log("item", item, "equals", item.id === rowData.id);
          return item.id === rowData.id
            ? { ...item, enabled: rowData.statusCheck }
            : item;
        });
      });
      notifySuccess("User status updated successfully.");
    } catch (error) {
      console.error("Error updating user status:", error);
      notifyError("Failed to update user status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeTextSearch = (e: any) => {
    const dataToSearch = regrexForSpecialDashChars(e.target.value);
    setSearchQuery(dataToSearch);
    debouncedSearch(dataToSearch);
  };

  const debouncedSearch = _debounce(handleInputUserChange, 500);

  const initialCallback = (e: any) => {
    setModalOpen(false);
  };

  const handleUserSave = async () => {
    await fetchUsers();
    setIsGeneralModalOpen(false);
    setIsAddDialogOpen(false);
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(
        `/api/users?paginate=true&page=${pageCount}&size=${pageSize}`,
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setStoreRetrievedData(data.data.content);
      setTotalItems(data.data.totalElements);
      setTotalUsers(data.data.totalElements);

      const active = data.data.content.filter(
        (u: any) => u.enabled == true,
      ).length;
      const inActive = data.data.content.filter(
        (u: any) => u.enabled == false,
      ).length;
      const admins = data.data.content.filter((u: any) =>
        String(u.roles || "")
          .toLowerCase()
          .includes("admin"),
      ).length;

      setActiveUser(active);
      setInActiveUser(inActive);
      setAdminUser(admins);
    } catch (error) {
      console.error("Error Fecthing users:", error);
      notifyError("Unable to load users. Please try again.");
    }
  };

  /**
   * Handles the export of users data to a file.
   * Calls the export API endpoint and triggers a file download.
   * Supports formats like CSV or Excel based on the API response.
   */
  const handleExportUsers = async () => {
    try {
      setLoading(true);

      // Call the export API endpoint
      const response = await fetch("/api/users/export", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to export users");
      }

      // Get the blob from the response
      const blob = await response.blob();

      // Determine file name and type from response headers
      const contentDisposition = response.headers.get("Content-Disposition");
      let fileName = "users-export.csv";

      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match) {
          fileName = match[1];
        }
      }

      // Create a temporary URL for the blob and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setLoading(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Export failed";
      console.error("Error exporting users:", message);
      notifyError("Unable to export users. Please try again.");
      setLoading(false);
    }
  };

  console.log("stored search data>>", storeRetrievedData);

  return (
    <div className="px-2 xl:px-8 pt-2 flex flex-col gap-4">
      <div className="w-full space-y-4">
        <div className="flex gap-4 flex-row lg:items-center lg:justify-between">
          <h1 className="w-1/2 text-2xl font-bold tracking-tight text-[#0f172a] sm:text-3xl">
            Users
          </h1>

          <div className="w-1/2 flex items-center justify-end gap-2">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="border-slate-200 bg-white"
                  disabled={!canCreateUser}
                  onClick={() => {
                    setIsAddDialogOpen(true)
                  }}
                >
                  <RiAddLine className="size-4" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Add User</DialogTitle>
                  <DialogDescription>
                    Fill in the details to add a new user.
                  </DialogDescription>
                </DialogHeader>
                <AddEditUser
                  actionType="add"
                  existingUserData={null}
                  permissionCategories={null}
                  callback={handleUserSave}
                  onClose={() => setIsAddDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
            {/* <Button variant="outline" className="border-slate-200 bg-white">
            <RiUploadLine className="size-4" />
            Import Users
          </Button> */}
            <Button
              variant="outline"
              className="border-slate-200 bg-white"
              onClick={handleExportUsers}
              disabled={loading}
            >
              <RiDownloadLine className="size-4" />
              {loading ? "Exporting..." : "Export"}
            </Button>
            {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-slate-200 bg-white">
                Bulk Actions
                <RiArrowDownSLine className="size-4 text-slate-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>Activate Selected</DropdownMenuItem>
              <DropdownMenuItem>Deactivate Selected</DropdownMenuItem>
              <DropdownMenuItem>Assign to Branch</DropdownMenuItem>
              <DropdownMenuItem variant="destructive">
                Delete Selected
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
          </div>
        </div>
      </div>

      {/* <UserStatsCards
        totalUsers={totalUsers}
        activeUser={activeUser}
        inActiveUsers={inActiveUser}
        adminUsers={adminUser}
      /> */}

      <div className="w-full flex items-center justify-between mt-2">
        <div className="sm:w-1/3 flex items-center max-w-sm">
          <div className="relative w-full">
            <Input
              type="search"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => {
                handleChangeTextSearch(e);
                setFilterData("");
              }}
            />
          </div>
          <button
            type="submit"
            className="p-2 ms-2 text-sm font-medium text-white  rounded-lg  bg-primary  hover:bg-[#36353b]"
          >
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
            <span className="sr-only">Search</span>
          </button>
        </div>

        {/* <div className="sm:w-30 flex items-center gap-2">
          <Button
            variant="outline"
            className="w-full rounded-sm border-slate-200 bg-black text-white hover:bg-[#333232] hover:text-white"
            onClick={() => {
              setSearchQuery("");
              setFilterData("");
              setStoreRetrievedData(retrievedData);
            }}
          >
            Filters
          </Button>
        </div> */}
      </div>

      <div className="mt-6">
        <DataTable
          columns={userTableColumns(
            (actionType: string, rowData: any) => {
              if (actionType === "view" && !canViewUsers) {
                return
              }

              if (actionType === "edit" && !canManageUsers) {
                return
              }

              if (actionType === "switch" && !canToggleUserStatus) {
                return
              }

              handleRowAction(actionType, rowData)
            },
            {
              canViewUsers,
              canManageUsers,
              canToggleUserStatus,
            },
          ) as any}
          data={storeRetrievedData as any}
          pageCount={pageCount}
          onPageChange={handlePageChange}
          pageSize={pageSize}
          totalItems={
            inputValue == "" ? totalItems : userSearch?.content?.length
          }
          type="users"
          defaultColumns={["Drag", "Actions", "User Number"]}
        />
      </div>

      <Dialog open={isGeneralModalOpen} onOpenChange={setIsGeneralModalOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {actionType === "edit" ? "Edit User" : "View User"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "edit"
                ? "Update the selected user's details and permissions."
                : "Review the selected user's details and permissions."}
            </DialogDescription>
          </DialogHeader>
          <AddEditUser
            actionType={actionType}
            existingUserData={selectedUser}
            permissionCategories={null}
            callback={handleUserSave}
            onClose={() => setIsGeneralModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
