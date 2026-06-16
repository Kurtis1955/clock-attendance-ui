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
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { modalContentTypeData } from "@/lib/constants";
import { regrexForSpecialDashChars } from "@/lib/helpers";
import { managedUsers } from "@/lib/users-data";
import { useState } from "react";
import _debounce from "lodash/debounce";
import { Button } from "@/components/ui/button";
import AddEditUser from "@/components/modals/addedituserModal/AddEditUser";
import { RiAddLine, RiDownloadLine } from "react-icons/ri";

const retrievedData = managedUsers;
export default function UsersPage() {
  const [storeRetrievedData, setStoreRetrievedData] = useState(retrievedData);
  const [modalContentType, setmodalContentType] = useState<any>(null);
  const [isGeneralModalOpen, setIsGeneralModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(storeRetrievedData.length);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterData, setFilterData] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [actionType, setActionType] = useState("");


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
      // getChangeUserStatus(rowData);
    }
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

  const debouncedSearch = _debounce((query: string) => {
    if (query.trim() === "") {
      setStoreRetrievedData(retrievedData);
    } else {
      const filteredData = retrievedData.filter((user) => {
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        return (
          fullName.includes(query.toLowerCase()) ||
          user.userName.toLowerCase().includes(query.toLowerCase()) ||
          user.email.toLowerCase().includes(query.toLowerCase())
        );
      });
      setStoreRetrievedData(filteredData);
    }
  }, 300);

  const initialCallback = (e: any) => {
    setModalOpen(false);
  };

  const handleUserSave = (updatedUser: any) => {
    setStoreRetrievedData((currentUsers) =>
      currentUsers.map((user) =>
        user.id === updatedUser.id ? { ...user, ...updatedUser } : user,
      ),
    );
  };

  return (
    <div className="px-2 lg:px-8 pt-2 flex flex-col gap-4">
      <div className="w-full space-y-4">
        <div className="flex gap-4 flex-row lg:items-center lg:justify-between">
          <h1 className="w-1/2 text-2xl font-bold tracking-tight text-[#0f172a] sm:text-3xl">
            Users
          </h1>

          <div className="w-1/2 flex items-center justify-end gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-slate-200 bg-white">
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
                existingRolePermissionData={null}
                permissionCategories={null}
                callback={() => {
                  // loadRoles();
                }}
                onClose={() => {
                  setIsGeneralModalOpen(false);
                  // loadRoles();
                }}
              />
            </DialogContent>
          </Dialog>
            {/* <Button variant="outline" className="border-slate-200 bg-white">
            <RiUploadLine className="size-4" />
            Import Users
          </Button> */}
            <Button variant="outline" className="border-slate-200 bg-white">
              <RiDownloadLine className="size-4" />
              Export
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

      <UserStatsCards />

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

        <div className="sm:w-30 flex items-center gap-2">
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
        </div>
      </div>

      <div className="mt-6">
        <DataTable
          columns={userTableColumns(handleRowAction) as any}
          data={storeRetrievedData as any}
          pageCount={pageCount}
          onPageChange={handlePageChange}
          pageSize={pageSize}
          totalItems={totalItems}
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
