import React, { useEffect, useMemo, useState } from "react";
import ReactSelect from "react-select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  getNavigationItemPermissionValues,
  navigationItems,
} from "@/lib/navigation";
import PermissionGroup from "@/hooks/permissions";

const deviceOptions = [
  { value: "zk-speedface-v5l-main", label: "SpeedFace V5L - Main Entrance" },
  { value: "zk-k40-hr", label: "K40 - HR Office" },
  { value: "zk-u300-finance", label: "U300 - Finance" },
  { value: "zk-mb360-warehouse", label: "MB360 - Warehouse" },
  { value: "zk-speedface-mini-admin", label: "SpeedFace Mini - Admin Block" },
];

const AddEditUser = ({
  actionType,
  existingUserData,
  userPermissions,
  permissionCategories,
  callback,
  onClose,
}: any) => {
  const roles = [
    { id: 1, name: "Super Admin" },
    { id: 2, name: "Admin" },
    { id: 3, name: "Manager" },
    { id: 4, name: "Supervisor" },
    { id: 5, name: "HR" },
    { id: 6, name: "User" },
  ];

  const departments = [
    {
      department: "APPLICATIONS",
    },
    {
      department: "FIELD INSTALLATIONS",
    },
    {
      department: "ICT GENERAL",
    },
    {
      department: "NETWORK OPERATIONS",
    },
    {
      department: "NHIA BIO PROJECT",
    },
    {
      department: "SYSTEM AND DATA CENT",
    },
    {
      department: "STECH CCTV",
    },
    {
      department: "EC BIO PROJECT",
    },
    {
      department: "CUSTOMER SUPPORT CENTER",
    },
    {
      department: "BUSINESS DEVELOPMENT",
    },
    {
      department: "STECH H/O DRIVERS",
    },
    {
      department: "BOG",
    },
    {
      department: "INTEGRATED LOGISTICS SUPPORT",
    },
    {
      department: "LOW VOLTAGE",
    },
    {
      department: "PRINT FACTORY",
    },
    {
      department: "PROJECTS",
    },
    {
      department: "VOIP",
    },
  ];

  const [loadingSaveUpdateUser, setloadingSaveUpdateUser] =
    useState<boolean>(false);
  const [firstName, setFirstName] = useState<string>(
    existingUserData?.firstName || "",
  );
  const [lastName, setLastName] = useState<string>(
    existingUserData?.lastName || "",
  );
  const [userName, setUserName] = useState<string>(
    existingUserData?.userName || "",
  );
  const [email, setEmail] = useState<string>(existingUserData?.email || "");
  const [ecode, setEcode] = useState<string>(existingUserData?.ecode || "");
  const [phoneNumber, setPhoneNumber] = useState<string>(
    existingUserData?.phoneNumber || "",
  );
  const [userRoles, setUserRoles] = useState<string>(
    existingUserData?.roles || "",
  );
  const [manager, setManager] = useState<string>(
    existingUserData?.manager || "",
  );
  const [enabled, setEnabled] = useState<boolean>(
    existingUserData?.status === "active" ? true : false,
  );
  const [isLDAP, setisLDAP] = useState<boolean>(
    existingUserData?.isLDAP || false,
  );
  const [errorFirstName, setErrorFirstName] = useState<string>("");
  const [errorLastName, setErrorLastName] = useState<string>("");
  const [errorUsername, setErrorUsername] = useState<string>("");
  const [errorEmail, setErrorEmail] = useState<string>("");
  const [errorEcode, setErrorEcode] = useState<string>("");
  const [errorPhone, setErrorPhone] = useState<string>("");
  const [loadingManagers, setLoadingManagers] = useState(true);
  const [managers, setManagers] = useState<any[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [companies, setCompanies] = useState<any[]>([]);
  const [companyDepartments, setCompanyDepartments] = useState<any[]>([]);
  // const [permissionCategories, setPermissionCategories] = useState<any>({});
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    existingUserData?.permissions || userPermissions || [],
  );
  const [assignedDevices, setAssignedDevices] = useState<any[]>([]);
  const isView = actionType === "view";
  const selectedCount = selectedPermissions.length;
  const totalPermissionCount = useMemo(
    () =>
      navigationItems.reduce(
        (total, item) => total + getNavigationItemPermissionValues(item).length,
        0,
      ),
    [],
  );

  const handleSelectAll = () => {
    const allPermissions = navigationItems.flatMap((item) =>
      getNavigationItemPermissionValues(item),
    );
    setSelectedPermissions((currentPermissions) =>
      currentPermissions.length === allPermissions.length ? [] : allPermissions,
    );
  };

  useEffect(() => {
    setFirstName(existingUserData?.firstName || "");
    setLastName(existingUserData?.lastName || "");
    setUserName(existingUserData?.userName || "");
    setEmail(existingUserData?.email || "");
    setEcode(existingUserData?.ecode || "");
    setPhoneNumber(existingUserData?.phoneNumber || "");
    setUserRoles(existingUserData?.roles || "");
    setManager(existingUserData?.manager || "");
    setEnabled(existingUserData?.status === "active");
    setisLDAP(existingUserData?.isLDAP || false);
    setSelectedPermissions(
      existingUserData?.permissions || userPermissions || [],
    );
  }, [existingUserData, userPermissions]);

  const validateFirstLastName = (value: string): boolean => {
    const regex = /^[A-Za-z\s\-']*$/;
    return regex.test(value);
  };

  const validateUsername = (value: string): boolean => {
    const regex = /^[A-Za-z]*$/;
    return regex.test(value);
  };

  const validateEcode = (value: string): boolean => {
    const regex = /^[A-Za-z0-9]*$/;
    return regex.test(value);
  };

  const validateEmail = (value: string): boolean => {
    const regex = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
    return regex.test(value);
  };

  const handlePermissionChange = (permissionValues: string[]) => {
    setSelectedPermissions((currentPermissions: string[]) =>
      permissionValues.every((permissionValue) =>
        currentPermissions.includes(permissionValue),
      )
        ? currentPermissions.filter(
            (permission) => !permissionValues.includes(permission),
          )
        : Array.from(new Set([...currentPermissions, ...permissionValues])),
    );
  };

  return (
    <form
      className="w-full space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        callback?.({
          ...existingUserData,
          firstName,
          lastName,
          userName,
          email,
          ecode,
          phoneNumber,
          roles: userRoles,
          manager,
          status: enabled ? "active" : "inactive",
          permissions: selectedPermissions,
        });
        onClose?.();
      }}
    >
      <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>
            First Name <span className="text-red-500">*</span>
          </Label>
          <Input
            type="text"
            className="form-control"
            value={firstName}
            onChange={(e) => {
              const value = e.target.value;
              if (validateFirstLastName(value) || value === "") {
                setFirstName(value);
                setErrorFirstName("");
              } else {
                setErrorFirstName("Only letters, spaces, and hyphens allowed");
              }
            }}
            maxLength={25}
            required
            placeholder="Firstname"
            disabled={actionType === "view"}
          />
          {errorFirstName && (
            <span className="text-red-500 text-[12px]">{errorFirstName}</span>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>
            Last Name <span className="text-red-500">*</span>
          </Label>
          <Input
            type="text"
            className="form-control"
            value={lastName}
            onChange={(e) => {
              const value = e.target.value;
              if (validateFirstLastName(value) || value === "") {
                setLastName(value);
                setErrorLastName("");
              } else {
                setErrorLastName("Only letters, spaces, and hyphens allowed");
              }
            }}
            maxLength={25}
            required
            placeholder="Lastname"
            disabled={actionType === "view"}
          />
          {errorLastName && (
            <span className="text-red-500 text-[12px]">{errorLastName}</span>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>
            UserName <span className="text-red-500">*</span>
          </Label>
          <Input
            type="text"
            className="form-control"
            value={userName}
            onChange={(e) => {
              const value = e.target.value;
              if (validateUsername(value) || value === "") {
                setUserName(value);
                setErrorUsername("");
              } else {
                setErrorUsername("Only letters and underscores allowed");
              }
            }}
            maxLength={25}
            required
            placeholder="Enter username"
            disabled={actionType === "view" || isLDAP}
          />
          {errorUsername && (
            <span className="text-red-500 text-[12px]">{errorUsername}</span>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => {
              if (email === "" || validateEmail(email)) {
                setErrorEmail("");
              } else {
                setErrorEmail("Please enter a valid email");
              }
            }}
            maxLength={50}
            required
            placeholder="name@gmail.com"
            disabled={actionType === "view"}
          />
          {errorEmail && (
            <span className="text-red-500 text-[12px]">{errorEmail}</span>
          )}
        </div>
        <div className="space-y-1.5">
          <Label>
            Ecode <span className="text-red-500">*</span>
          </Label>
          <Input
            type="text"
            className="form-control"
            value={ecode}
            onChange={(e) => {
              const value = e.target.value;
              if (validateEcode(value) || value === "") {
                setEcode(value);
                setErrorEcode("");
              } else {
                setErrorEcode("Only letters and numbers allowed");
              }
            }}
            maxLength={8}
            required
            placeholder="Ecode"
            disabled={actionType === "view" || actionType === "edit"}
          />
          {errorEcode && (
            <span className="text-red-500 text-[12px]">{errorEcode}</span>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>
            Phone Number <span className="text-red-500">*</span>
          </Label>
          <Input
            type="tel"
            placeholder="Enter phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            disabled={actionType === "view"}
            //   limitMaxLength={true}
            //   onChange={handleChangePhoneNumber}
            //   defaultCountry="GH"
            //   international
          />

          {errorPhone && (
            <span className="text-red-500 text-[12px]">{errorPhone}</span>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>
            Role <span className="text-red-500">*</span>
          </Label>
          <ReactSelect
            name="role"
            classNamePrefix="react-select"
            placeholder="Select Role"
            value={
              roles?.find((role: any) => role.name === userRoles)
                ? { label: userRoles, value: userRoles }
                : null
            }
            onChange={(selectedOption: any) => {
              setUserRoles(selectedOption?.value || "");
              const foundName = roles.find((r) => r == selectedOption?.value);
              // foundName && getPermissionByRoleId(foundName?.id);
            }}
            isDisabled={actionType === "view"}
            options={
              roles?.map((role: any) => ({
                value: role.name,
                label: role.name,
              })) || []
            }
            isClearable
            required
          />
          {/* <select
            id="role"
            value={userRoles}
            onChange={(e) => setUserRoles(e.target.value)}
            disabled={actionType === "view"}
            className="h-10 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50"
          >
            <option value="">Select a role</option>

            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select> */}
        </div>

        <div className="space-y-1.5">
          <Label>
            Department <span className="text-red-500">*</span>
          </Label>
          <ReactSelect
            name="department"
            classNamePrefix="react-select"
            placeholder="Select Department"
            isMulti
            value={companyDepartments.map((dept) => ({
              label: dept,
              value: dept,
            }))}
            onChange={(selectedOption: any) => {
              setCompanyDepartments(
                selectedOption
                  ? [...selectedOption].map((option) => option.value)
                  : [],
              );
            }}
            isDisabled={actionType === "view"}
            options={
              departments?.map((dept: any) => ({
                value: dept.department,
                label: dept.department,
              })) || []
            }
            isClearable
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label>
            Temporary Password <span className="text-red-500">*</span>
          </Label>
          <Input
            type="text"
            className="form-control"
            value={"********"}
            readOnly
            //   disabled
            placeholder="Temporary Password"
          />
        </div>

        <div className="space-y-1.5">
          <Label>
            Confirm Password <span className="text-red-500">*</span>
          </Label>
          <Input
            type="text"
            className="form-control"
            value={"********"}
            readOnly
            //   disabled
            placeholder="Temporary Password"
          />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label>Device Assignment</Label>
          <ReactSelect
            instanceId="device-assignment"
            inputId="device-assignment"
            isMulti
            isClearable
            closeMenuOnSelect={false}
            options={deviceOptions}
            value={assignedDevices}
            onChange={(selectedOptions) =>
              setAssignedDevices(selectedOptions ? [...selectedOptions] : [])
            }
            isDisabled={actionType === "view"}
            placeholder="Select devices"
            classNamePrefix="react-select"
            styles={{
              control: (base, state) => ({
                ...base,
                minHeight: "40px",
                borderColor: state.isFocused ? "var(--ring)" : "var(--input)",
                borderRadius: "0.5rem",
                boxShadow: state.isFocused
                  ? "0 0 0 3px color-mix(in oklch, var(--ring) 50%, transparent)"
                  : "none",
                fontSize: "0.875rem",
              }),
              placeholder: (base) => ({
                ...base,
                color: "var(--muted-foreground)",
              }),
              multiValue: (base) => ({
                ...base,
                borderRadius: "0.375rem",
              }),
            }}
          />
        </div>

        <div className="sm:col-span-2">
          <div className="flex items-center gap-2">
            <Label className="mr-2">Enable User</Label>
            <input
              className="size-4 rounded border-input text-primary focus:ring-ring"
              type="checkbox"
              checked={enabled}
              disabled={actionType === "view"}
              onChange={(e) => setEnabled(e.target.checked)}
            />
          </div>
        </div>
      </div>

      {/* <div className="mt-6">
          <Label className="text-base font-semibold mb-3 flex items-center text-gray-700">
            Permissions Category {loadingPermissions && <Spinner size="sm" />}{" "}
            <span className="text-red-500">*</span>
          </Label>

          <div className="grid grid-cols-2">
            {Object.keys(permissionCategories).map((r: any, i: any) => {
              return (
                <PermissionCategory
                  key={permissionCategories[r].categoryId}
                  other={permissionCategories[r]}
                  keys={permissionCategories[r].categoryId}
                  title={permissionCategories[r]?.title}
                  items={permissionCategories[r]?.items}
                  selectedPermissions={selectedPermissions}
                  onCategoryChange={handleCategoryChange}
                  onItemChange={handleItemChange}
                  disabled={actionType === "view"}
                />
              );
            })}
          </div>
        </div> */}

      <div className="space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Label>
              Permissions <span className="text-red-500">*</span>
            </Label>
            <p className="mt-1 text-xs text-slate-500">
              {selectedCount} of {totalPermissionCount} permissions selected
            </p>
          </div>

          {!isView ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
            >
              {selectedCount === totalPermissionCount
                ? "Clear All"
                : "Select All"}
            </Button>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {navigationItems.map((item) => (
            <PermissionGroup
              key={item.href}
              item={item}
              disabled={isView}
              selectedPermissions={selectedPermissions}
              onToggle={handlePermissionChange}
            />
          ))}
        </div>
      </div>

      {actionType !== "view" && (
        <div className="flex justify-end border-t pt-5">
          <Button
            type="submit"
            disabled={loadingSaveUpdateUser}
            className="min-w-24 bg-yellow-500 text-white hover:bg-yellow-600 focus-visible:ring-yellow-400 disabled:pointer-events-none disabled:opacity-50"
          >
            {actionType === "edit" ? "Save Changes" : "Save"}
          </Button>
        </div>
      )}
    </form>
  );
};

export default AddEditUser;
