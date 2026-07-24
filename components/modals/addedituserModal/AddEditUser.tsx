import React, { useEffect, useState } from "react";
import ReactSelect from "react-select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PermissionPicker } from "@/components/users/permission-picker";
import { useCompanies, findCompanyByName } from "@/hooks/useCompanies";
import type { CompanyOption } from "@/hooks/useCompanies";
import { useRoles } from "@/hooks/useRoles";
import {
  buildUserApiPayload,
  normalizeIdList,
  normalizeRoleIds,
  normalizeStringArray,
  parseApiError,
} from "@/lib/user-payload";
import type { DepartmentOption } from "@/hooks/useDepartments";
import { toast } from "sonner";

interface CompanyDepartmentRow {
  id: string;
  selectedCompany: any | null;
  departmentNames: string[];
  departmentOptions: DepartmentOption[];
  loadingDepartments: boolean;
  departmentsError: string | null;
}

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

function buildRowsFromUserDepartments(
  userDepartments: Array<{
    companyName?: string;
    departmentName?: string;
  }>,
  companies: CompanyOption[],
): CompanyDepartmentRow[] {
  const grouped = new Map<string, string[]>();

  for (const entry of userDepartments) {
    const companyName = entry.companyName?.trim();
    const departmentName = entry.departmentName?.trim();

    if (!companyName || !departmentName) {
      continue;
    }

    const existing = grouped.get(companyName) ?? [];
    grouped.set(companyName, [...existing, departmentName]);
  }

  if (!grouped.size) {
    return [];
  }

  return Array.from(grouped.entries()).map(([companyName, departmentNames]) => {
    const matchedCompany = findCompanyByName(companyName, companies);

    return createCompanyDepartmentRow(matchedCompany, departmentNames);
  });
}

function createCompanyDepartmentRow(
  selectedCompany: CompanyOption | null = null,
  departmentNames: string[] = [],
): CompanyDepartmentRow {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    selectedCompany,
    departmentNames,
    departmentOptions: [],
    loadingDepartments: false,
    departmentsError: null,
  };
}

const AddEditUser = ({
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
  const [companyDepartmentRows, setCompanyDepartmentRows] = useState<
    CompanyDepartmentRow[]
  >([createCompanyDepartmentRow()]);

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
  const [exists, setExists] = useState<boolean>(false);
  const [isLDAP, setisLDAP] = useState<boolean>(
    existingUserData?.isLDAP || false,
  );
  const [errorFirstName, setErrorFirstName] = useState<string>("");
  const [errorLastName, setErrorLastName] = useState<string>("");
  const [errorUsername, setErrorUsername] = useState<string>("");
  const [errorEmail, setErrorEmail] = useState<string>("");
  const [errorEcode, setErrorEcode] = useState<string>("");
  const [errorPhone, setErrorPhone] = useState<string>("");
  const [submitError, setSubmitError] = useState<string>("");
  const [resolvedUser, setResolvedUser] = useState<any>(
    existingUserData ?? null,
  );
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    normalizeIdList(existingUserData?.permissions || userPermissions),
  );
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
    setSelectedRoleIds(
      normalizeRoleIds(
        user?.roles ?? user?.userRoles ?? user?.roleNames ?? user?.roleName,
      ),
    );
    setManager(user?.managerName || user?.manager || "");
    setEnabled(Boolean(user?.enabled));
    setisLDAP(user?.isLDAP || false);
    setSelectedPermissions(normalizeIdList(user?.permissions));
  }

  useEffect(() => {
    if (!companies.length || actionType === "add") {
      return;
    }

    const userDepartments = Array.isArray(
      resolvedUser?.userDepartments ?? existingUserData?.userDepartments,
    )
      ? (resolvedUser?.userDepartments ?? existingUserData?.userDepartments)
      : [];

    const rowsFromUserDepartments = buildRowsFromUserDepartments(
      userDepartments,
      companies,
    );

    if (rowsFromUserDepartments.length) {
      setCompanyDepartmentRows(rowsFromUserDepartments);
      return;
    }

    const userCompanyNames = normalizeStringArray(
      resolvedUser?.companyName ?? existingUserData?.companyName,
    );
    const userDepartmentNames = normalizeStringArray(
      resolvedUser?.departmentName ?? existingUserData?.departmentName,
    );

    if (!userCompanyNames.length) {
      setCompanyDepartmentRows([createCompanyDepartmentRow()]);
      return;
    }

    const nextRows = userCompanyNames.map((companyName, index) => {
      const matchedCompany = findCompanyByName(companyName, companies);

      return createCompanyDepartmentRow(
        matchedCompany,
        index === 0 ? userDepartmentNames : [],
      );
    });

    setCompanyDepartmentRows(nextRows);
  }, [
    companies,
    resolvedUser?.companyName,
    resolvedUser?.departmentName,
    resolvedUser?.userDepartments,
    existingUserData?.companyName,
    existingUserData?.departmentName,
    existingUserData?.userDepartments,
    actionType,
  ]);

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
      if (!existingUserData?.id || actionType === "add") {
        return;
      }

      try {
        const response = await fetch(
          `/api/users/permissions?username=${existingUserData?.userName}`,
        );

        if (!response.ok) {
          toast.error("Failed to fetch user permissions", {
            position: "top-right",
            style: {
              color: "#dc2626",
              background: "#fff",
              border: "1px solid #dc2626",
            },
          });
          return;
        }

        const json = await response.json();
        const content = json?.data?.content ?? json ?? [];
        const permissionIds = Array.isArray(content)
          ? content
              .map((item: { id?: string } | string) =>
                typeof item === "string" ? item : (item.id ?? ""),
              )
              .filter(Boolean)
          : [];
        console.log(
          "user permmissions fetched",
          content,
          "permissionIds>>",
          permissionIds,
        );
        if (permissionIds.length) {
          setSelectedPermissions(permissionIds);
        }
      } catch (error) {
        toast.error("Failed to fetch user permissions", {
          position: "top-right",
          style: {
            color: "#dc2626",
            background: "#fff",
            border: "1px solid #dc2626",
          },
        });
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

  const updateCompanyDepartmentRow = (
    rowId: string,
    updates: Partial<CompanyDepartmentRow>,
  ) => {
    setCompanyDepartmentRows((prevRows) =>
      prevRows.map((row) => (row.id === rowId ? { ...row, ...updates } : row)),
    );
  };

  const addCompanyDepartmentRow = () => {
    setCompanyDepartmentRows((prevRows) => [
      ...prevRows,
      createCompanyDepartmentRow(),
    ]);
  };

  const removeCompanyDepartmentRow = (rowId: string) => {
    setCompanyDepartmentRows((prevRows) =>
      prevRows.length > 1
        ? prevRows.filter((row) => row.id !== rowId)
        : prevRows,
    );
  };

  const fetchDepartmentsForRow = async (
    rowId: string,
    company: CompanyOption | null,
  ) => {
    if (!company?.companycode) {
      updateCompanyDepartmentRow(rowId, {
        departmentOptions: [],
        departmentNames: [],
        loadingDepartments: false,
        departmentsError: null,
      });
      return;
    }

    updateCompanyDepartmentRow(rowId, {
      loadingDepartments: true,
      departmentsError: null,
    });

    try {
      const response = await fetch(
        `/api/departments?code=${encodeURIComponent(company.companycode)}`,
      );

      if (!response.ok) {
        throw new Error(
          response.status === 401
            ? "Failed to fetch departments (user not authorised)"
            : `Failed to fetch departments (${response.status})`,
        );
      }

      const json = await response.json();
      const content = json?.department ?? json?.data ?? json ?? [];

      if (content.length === 0) {
        updateCompanyDepartmentRow(rowId, {
          departmentOptions: [],
          departmentNames: [],
          loadingDepartments: false,
          departmentsError: "No departments found for the selected company",
        });
        return;
      }
      const mapped = (Array.isArray(content) ? content : [])
        .map((item: Record<string, unknown>) => {
          const departmentName = String(
            item.department ?? item.departmentName ?? item.name ?? "",
          );

          if (!departmentName) {
            return null;
          }

          return {
            id: departmentName,
            departmentId: departmentName,
            companycode: company.companycode,
            departmentName,
            companyName: company.company,
          } as DepartmentOption;
        })
        .filter(Boolean) as DepartmentOption[];

      updateCompanyDepartmentRow(rowId, {
        departmentOptions: mapped,
        loadingDepartments: false,
        departmentsError: null,
      });
    } catch (error) {
      updateCompanyDepartmentRow(rowId, {
        departmentOptions: [],
        loadingDepartments: false,
        departmentsError:
          error instanceof Error ? error.message : "Failed to load departments",
      });
    }
  };

  useEffect(() => {
    companyDepartmentRows.forEach((row) => {
      if (
        row.selectedCompany &&
        row.departmentOptions.length === 0 &&
        !row.loadingDepartments
      ) {
        fetchDepartmentsForRow(row.id, row.selectedCompany);
      }
    });
  }, [companyDepartmentRows]);

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

    const selectedCompanyRows = companyDepartmentRows.filter(
      (row) => row.selectedCompany,
    );

    if (!selectedCompanyRows.length) {
      setSubmitError("Select at least one company.");
      return;
    }

    const hasMissingDepartments = selectedCompanyRows.some(
      (row) => !row.departmentNames.length,
    );

    if (hasMissingDepartments) {
      setSubmitError("Select at least one department for each company.");
      return;
    }

    // if (!companyDepartments.length) {
    //   setSubmitError("Select at least one department.");
    //   return;
    // }

    setloadingSaveUpdateUser(true);

    try {
      const companyDepartmentMappings = selectedCompanyRows.map((row) => ({
        companyName: row.selectedCompany?.company ?? "",
        departmentNames: row.departmentNames,
      }));
      const companyNames = companyDepartmentMappings.map(
        (mapping) => mapping.companyName,
      );
      const primaryCompanyRow = selectedCompanyRows[0];
      const primaryDepartment = resolvePrimaryDepartment(
        companyNames,
        primaryCompanyRow?.departmentNames ?? [],
        primaryCompanyRow?.departmentOptions ?? [],
      );
      const departmentId =
        primaryDepartment?.departmentId ??
        resolvedUser?.departmentId ??
        existingUserData?.departmentId;
      const companyId =
        primaryCompanyRow?.selectedCompany?.companycode ??
        resolvedUser?.companyId ??
        existingUserData?.companyId;

      const selectedRoleNames = roleOptions
        .filter((role) => selectedRoleIds.includes(role.id))
        .map((role) => role.name);

      const departmentNames = companyDepartmentMappings.flatMap(
        (mapping) => mapping.departmentNames,
      );

      const payload = buildUserApiPayload({
        id:
          actionType === "edit"
            ? (resolvedUser?.id ?? existingUserData?.id)
            : undefined,
        userName,
        email,
        firstName,
        lastName,
        phoneNumber,
        roleIds: selectedRoleIds,
        permissionIds: selectedPermissions,
        companyNames,
        departmentNames,
        companyDepartmentMappings,
        enabled,
        ecode,
        departmentId,
        companyId,
        managerId: resolvedUser?.managerId ?? existingUserData?.managerId,
        companyBranchId:
          primaryDepartment?.companyBranchId ??
          resolvedUser?.companyBranchId ??
          existingUserData?.companyBranchId,
        managerName:
          manager || resolvedUser?.managerName || existingUserData?.managerName,
        companyBranchName:
          primaryDepartment?.companyBranchName ??
          resolvedUser?.companyBranchName ??
          existingUserData?.companyBranchName,
        userRoles:
          selectedRoleNames.length > 0
            ? selectedRoleNames
            : normalizeStringArray(
                resolvedUser?.userRoles ?? existingUserData?.userRoles,
              ),
        exists: exists ?? resolvedUser?.exists ?? existingUserData?.exists,
      });

      if (actionType === "edit") {
        const userId = resolvedUser?.userName ?? existingUserData?.userName;

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
        toast.error("Failed to save user", {
          position: "top-right",
          style: {
            color: "#dc2626",
            background: "#fff",
            border: "1px solid #dc2626",
          },
        });
        throw new Error(await parseApiError(response));
      }

      const json = await response.json();
      toast.success("User save successfully", {
        position: "top-right",
        style: {
          color: "#16a34a",
          background: "#fff",
          border: "1px solid #16a34a",
        },
      });
      callback?.(json?.data ?? payload);
      onClose?.();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to save user.";
      // const message = "Failed to save user details.";
      setSubmitError(message);
      toast.error("Failed to save user", {
        position: "top-right",
        style: {
          color: "#dc2626",
          background: "#fff",
          border: "1px solid #dc2626",
        },
      });
      console.error("Error saving user:", error);
    } finally {
      setloadingSaveUpdateUser(false);
    }
  };

  return (
    <form className="w-full space-y-5" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>
            First Name <span className="text-red-500">*</span>
          </Label>
          <Input
            type="text"
            className="form-control border-gray-300 text-xs"
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
            disabled={actionType === "view" || actionType === "edit"}
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
            className="form-control border-gray-300"
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
            disabled={actionType === "view" || actionType === "edit"}
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
            className="form-control border-gray-300"
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
            disabled={actionType === "view" || actionType === "edit"}
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
            className="form-control border-gray-300"
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
            disabled={actionType === "view" || actionType === "edit"}
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
            className="form-control border-gray-300"
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
            className="form-control border-gray-300"
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

        <div className="space-y-1.5 sm:col-span-2">
          <Label>
            Role <span className="text-red-500">*</span>
          </Label>
          <ReactSelect
            name="role"
            classNamePrefix="react-select border-gray-300"
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
        </div>

        <div className="space-y-3 sm:col-span-2">
          <div className="flex items-center justify-between">
            <Label>
              Company & Department <span className="text-red-500">*</span>
            </Label>
            <Button
              className="py-3 bg-yellow-400 hover:bg-yellow-500 text-black text-xs"
              type="button"
              variant="outline"
              size="sm"
              onClick={addCompanyDepartmentRow}
              disabled={actionType === "view"}
            >
              Add another
            </Button>
          </div>

          {companyDepartmentRows.map((row, index) => (
            <div
              key={row.id}
              className="rounded-lg border border-gray-400 bg-background/70 p-3"
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs">Company {index + 1}</p>
                {companyDepartmentRows.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCompanyDepartmentRow(row.id)}
                    disabled={actionType === "view"}
                    className="text-red-500 hover:text-red-600 border border-red-500 hover:border-red-600 rounded px-2 py-1 text-xs"
                  >
                    Remove
                  </Button>
                )}
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Company</Label>
                  <ReactSelect
                    name={`company-${row.id}`}
                    classNamePrefix="react-select"
                    placeholder={
                      loadingCompanies
                        ? "Loading companies..."
                        : "Select Company"
                    }
                    value={
                      row.selectedCompany
                        ? {
                            value: row.selectedCompany.companycode,
                            label: row.selectedCompany.company,
                          }
                        : null
                    }
                    onChange={(
                      selectedOption: { value: string; label: string } | null,
                    ) => {
                      const nextCompany =
                        companies.find(
                          (company) =>
                            company.companycode === selectedOption?.value,
                        ) ?? null;

                      updateCompanyDepartmentRow(row.id, {
                        selectedCompany: nextCompany,
                        departmentNames: [],
                      });

                      fetchDepartmentsForRow(row.id, nextCompany);
                    }}
                    isDisabled={actionType === "view" || loadingCompanies}
                    options={companies.map((company) => ({
                      value: company.companycode,
                      label: company.company,
                    }))}
                    isClearable
                  />
                </div>

                <div className="space-y-2">
                  <Label>Department</Label>
                  <ReactSelect
                    name={`department-${row.id}`}
                    classNamePrefix="react-select"
                    placeholder={
                      !row.selectedCompany
                        ? "Select a company first"
                        : row.loadingDepartments
                          ? "Loading departments..."
                          : "Select Department"
                    }
                    isMulti
                    value={row.departmentNames.map((dept) => ({
                      label: dept,
                      value: dept,
                    }))}
                    onChange={(selectedOption: any) => {
                      updateCompanyDepartmentRow(row.id, {
                        departmentNames: selectedOption
                          ? [...selectedOption].map(
                              (option: any) => option.value,
                            )
                          : [],
                      });
                    }}
                    isDisabled={
                      actionType === "view" ||
                      !row.selectedCompany ||
                      row.loadingDepartments
                    }
                    options={
                      row.departmentOptions.map((dept) => ({
                        value: dept.departmentName,
                        label: dept.departmentName,
                      })) || []
                    }
                    isClearable
                  />
                  {row.departmentsError ? (
                    <p className="text-xs text-red-500">
                      {row.departmentsError}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          ))}

          {companiesError ? (
            <p className="text-xs text-red-500">{companiesError}</p>
          ) : null}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:col-span-2">
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
          <div className="flex items-center gap-2">
            <Label className="mr-2">User in Active Directory</Label>
            <input
              className="size-4 rounded border-input text-primary focus:ring-ring"
              type="checkbox"
              checked={exists}
              disabled={actionType === "view"}
              onChange={(e) => setExists(e.target.checked)}
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

      <PermissionPicker
        selectedPermissionIds={selectedPermissions}
        onChange={handlePermissionChange}
        disabled={isView}
      />

      {submitError ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {submitError}
        </p>
      ) : null}

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
