import React, { useEffect, useState } from "react";
import ReactSelect from "react-select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PermissionPicker } from "@/components/users/permission-picker";
import { useCompanies } from "@/hooks/useCompanies";
import type { CompanyOption } from "@/hooks/useCompanies";
import { useDepartments } from "@/hooks/useDepartments";
import { useRoles } from "@/hooks/useRoles";
import {
  buildUserApiPayload,
  normalizeIdList,
  normalizeRoleIds,
  normalizeStringArray,
  parseApiError,
} from "@/lib/user-payload";
import type { DepartmentOption } from "@/hooks/useDepartments";

const deviceOptions = [
  { value: "zk-speedface-v5l-main", label: "SpeedFace V5L - Main Entrance" },
  { value: "zk-k40-hr", label: "K40 - HR Office" },
  { value: "zk-u300-finance", label: "U300 - Finance" },
  { value: "zk-mb360-warehouse", label: "MB360 - Warehouse" },
  { value: "zk-speedface-mini-admin", label: "SpeedFace Mini - Admin Block" },
];

function resolvePrimaryDepartment(
  companyNames: string[],
  departmentNames: string[],
  options: DepartmentOption[],
): DepartmentOption | undefined {
  if (!options.length) {
    return undefined;
  }

  for (const companyName of companyNames) {
    for (const departmentName of departmentNames) {
      const match = options.find(
        (option) =>
          option.companyName === companyName &&
          option.departmentName === departmentName,
      );
      if (match) {
        return match;
      }
    }
  }

  if (departmentNames.length) {
    return options.find(
      (option) => option.departmentName === departmentNames[0],
    );
  }

  if (companyNames.length) {
    return options.find((option) => option.companyName === companyNames[0]);
  }

  return undefined;
}

const AddEditBiometricUser = ({
  actionType,
  existingUserData,
  userPermissions,
  permissionCategories,
  callback,
  onClose,
}: any) => {
  const { roles: roleOptions, loading: loadingRoles } = useRoles();
  const {
    companies,
    loading: loadingCompanies,
    error: companiesError,
  } = useCompanies();
  const [selectedCompany, setSelectedCompany] = useState<CompanyOption | null>(
    null,
  );
  const {
    departments: departmentOptions,
    loading: loadingDepartments,
    error: departmentsError,
  } = useDepartments(
    selectedCompany?.name ?? null,
    selectedCompany?.id ?? null,
  );

  const userType = [
    { value: "12Fes226Dkjsdfj45", label: "System User" },
    { value: "13fs37s226Dkjsdfj", label: "Device User" },
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
  const [ecode, setEcode] = useState<string>(
    existingUserData?.eCode || existingUserData?.ecode || "",
  );
  const [phoneNumber, setPhoneNumber] = useState<string>(
    existingUserData?.phoneNumber || "",
  );
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>(
    normalizeRoleIds(existingUserData?.roles),
  );
  const [manager, setManager] = useState<string>(
    existingUserData?.managerName || existingUserData?.manager || "",
  );
  const [enabled, setEnabled] = useState<boolean>(
    existingUserData?.enabled ?? existingUserData?.status === "active",
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
  const [companyDepartments, setCompanyDepartments] = useState<string[]>(
    normalizeStringArray(existingUserData?.departmentName),
  );
  const [submitError, setSubmitError] = useState<string>("");
  const [resolvedUser, setResolvedUser] = useState<any>(
    existingUserData ?? null,
  );
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    normalizeIdList(existingUserData?.permissions || userPermissions),
  );
  const [assignedDevices, setAssignedDevices] = useState<any[]>([]);
  const [assignUserType, setAssignUserType] = useState<any[]>([]);
  const isView = actionType === "view";

  function applyUserToForm(user: any) {
    if (!user) {
      return;
    }

    setResolvedUser(user);
    setFirstName(user?.firstName || "");
    setLastName(user?.lastName || "");
    setUserName(user?.userName || "");
    setEmail(user?.email || "");
    setEcode(user?.eCode || user?.ecode || "");
    setPhoneNumber(user?.phoneNumber || "");
    setSelectedRoleIds(normalizeRoleIds(user?.roles));
    setManager(user?.managerName || user?.manager || "");
    setEnabled(Boolean(user?.enabled));
    setisLDAP(user?.isLDAP || false);
    setCompanyDepartments(normalizeStringArray(user?.departmentName));
    setSelectedPermissions(normalizeIdList(user?.permissions));
    // Load assigned devices
    if (user?.assignedDevices && Array.isArray(user.assignedDevices)) {
      setAssignedDevices(user.assignedDevices);
    }
  }

  useEffect(() => {
    if (!companies.length) {
      return;
    }

    const companyNames = normalizeStringArray(
      resolvedUser?.companyName ?? existingUserData?.companyName,
    );
    const companyId = resolvedUser?.companyId ?? existingUserData?.companyId;
    const matchedCompany =
      companies.find((company) => company.id === companyId) ??
      companies.find((company) => companyNames.includes(company.name));

    if (matchedCompany) {
      setSelectedCompany(matchedCompany);
    }
  }, [companies, resolvedUser, existingUserData]);

  useEffect(() => {
    async function loadUserDetails() {
      const identifier = existingUserData?.userName || existingUserData?.id;
      if (!identifier || actionType === "add") {
        return;
      }

      try {
        const response = await fetch(`/api/users/${identifier}`);

        if (!response.ok) {
          return;
        }

        const json = await response.json();
        applyUserToForm(json?.data ?? json);
      } catch (error) {
        console.error("Error loading user details:", error);
      }
    }

    loadUserDetails();
  }, [existingUserData?.userName, existingUserData?.id, actionType]);

  useEffect(() => {
    applyUserToForm(existingUserData);
  }, [existingUserData]);

  useEffect(() => {
    async function loadUserPermissions() {
      if (!existingUserData?.userName || actionType === "add") {
        return;
      }

      try {
        const response = await fetch(
          `/api/users/${existingUserData.userName}/permissions`,
        );

        if (!response.ok) {
          return;
        }

        const json = await response.json();
        const content = json?.data?.content ?? json?.data ?? [];
        const permissionIds = Array.isArray(content)
          ? content
              .map((item: { id?: string } | string) =>
                typeof item === "string" ? item : (item.id ?? ""),
              )
              .filter(Boolean)
          : [];

        if (permissionIds.length) {
          setSelectedPermissions(permissionIds);
        }
      } catch (error) {
        console.error("Error loading user permissions:", error);
      }
    }

    loadUserPermissions();
  }, [existingUserData?.userName, actionType]);

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

  const handlePermissionChange = (permissionIds: string[]) => {
    setSelectedPermissions(permissionIds);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError("");

    // if (!selectedRoleIds.length) {
    //   setSubmitError("Select at least one role.");
    //   return;
    // }

    if (!selectedPermissions.length) {
      setSubmitError("Select at least one permission.");
      return;
    }

    if (!selectedCompany) {
      setSubmitError("Select a company.");
      return;
    }

    if (!assignedDevices.length) {
      setSubmitError("Assign at least one biometric device.");
      return;
    }

    // if (!companyDepartments.length) {
    //   setSubmitError("Select at least one department.");
    //   return;
    // }

    setloadingSaveUpdateUser(true);

    try {
      const payload =({
        id:
          actionType === "edit"
            ? (resolvedUser?.id ?? existingUserData?.id)
            : undefined,
        userName,
        email,
        firstName,
        lastName,
        phoneNumber,
        enabled,
        ecode,
        exists: false,
        assignedDevices: assignedDevices.map((device) => device.value),
      });

      if (actionType === "edit") {
        const userId = resolvedUser?.id ?? existingUserData?.id;

        if (!userId) {
          throw new Error("Missing user id for update.");
        }

        const response = await fetch(`/api/users/${userId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(await parseApiError(response));
        }

        const json = await response.json();
        callback?.(json?.data ?? payload);
        onClose?.();
        return;
      }

      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(await parseApiError(response));
      }

      const json = await response.json();
      callback?.(json?.data ?? payload);
      onClose?.();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to save user.";
      setSubmitError(message);
      console.error("Error saving user:", error);
    } finally {
      setloadingSaveUpdateUser(false);
    }
  };

  return (
    <form className="w-full space-y-5 text-gray-600" onSubmit={handleSubmit}>
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

        {/* <div className="space-y-1.5 sm:col-span-2">
          <Label>
            Role <span className="text-red-500">*</span>
          </Label>
          <ReactSelect
            name="role"
            classNamePrefix="react-select"
            placeholder={loadingRoles ? "Loading roles..." : "Select Role"}
            value={
              roleOptions.find((role) => selectedRoleIds.includes(role.id))
                ? {
                    label:
                      roleOptions.find((role) =>
                        selectedRoleIds.includes(role.id),
                      )?.name || "",
                    value: selectedRoleIds[0],
                  }
                : null
            }
            onChange={(selectedOption: any) => {
              setSelectedRoleIds(
                selectedOption?.value ? [selectedOption.value] : [],
              );
            }}
            isDisabled={actionType === "view" || loadingRoles}
            options={
              roleOptions.map((role) => ({
                value: role.id,
                label: role.name,
              })) || []
            }
            isClearable
            // required
          />
        </div> */}

        {/* <div className="space-y-2 sm:col-span-2">
          <Label>
            Company <span className="text-red-500">*</span>
          </Label>
          <ReactSelect
            name="company"
            classNamePrefix="react-select"
            placeholder={
              loadingCompanies ? "Loading companies..." : "Select Company"
            }
            value={
              selectedCompany
                ? { value: selectedCompany.id, label: selectedCompany.name }
                : null
            }
            onChange={(
              selectedOption: { value: string; label: string } | null,
            ) => {
              const nextCompany =
                companies.find(
                  (company) => company.id === selectedOption?.value,
                ) ?? null;
              setSelectedCompany(nextCompany);
              setCompanyDepartments([]);
            }}
            isDisabled={actionType === "view" || loadingCompanies}
            options={companies.map((company) => ({
              value: company.id,
              label: company.name,
            }))}
            isClearable
          />
          {companiesError ? (
            <p className="text-xs text-red-500">{companiesError}</p>
          ) : null}
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label>
            Department <span className="text-red-500">*</span>
          </Label>
          <ReactSelect
            name="department"
            classNamePrefix="react-select"
            placeholder={
              !selectedCompany
                ? "Select a company first"
                : loadingDepartments
                  ? "Loading departments..."
                  : "Select Department"
            }
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
            isDisabled={
              actionType === "view" || !selectedCompany || loadingDepartments
            }
            options={
              departmentOptions.map((dept) => ({
                value: dept.departmentName,
                label: dept.departmentName,
              })) || []
            }
            isClearable
          />
          {departmentsError ? (
            <p className="text-xs text-red-500">{departmentsError}</p>
          ) : null}
        </div> */}

        <div className="space-y-2 sm:col-span-2">
          <Label>
            Assign Devices <span className="text-red-500">*</span>
          </Label>
          <ReactSelect
            name="devices"
            classNamePrefix="react-select"
            placeholder="Select Devices"
            isMulti
            value={assignedDevices.map((device) => ({
              label: device.label,
              value: device.value,
            }))}
            onChange={(selectedOption: any) => {
              setAssignedDevices(
                selectedOption
                  ? [...selectedOption].map((option) => ({
                      label: option.label,
                      value: option.value,
                    }))
                  : [],
              );
            }}
            isDisabled={actionType === "view"}
            options={deviceOptions}
            isClearable
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

export default AddEditBiometricUser;
