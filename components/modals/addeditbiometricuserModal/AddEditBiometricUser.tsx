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
import { toast } from "sonner";

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
  callback,
  onClose,
}: any) => {
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
  const [loadingSaveUpdateUser, setloadingSaveUpdateUser] =
    useState<boolean>(false);
  const [firstName, setFirstName] = useState<string>(
    existingUserData?.firstName || "",
  );
  const [lastName, setLastName] = useState<string>(
    existingUserData?.lastName || "",
  );
  const [email, setEmail] = useState<string>(existingUserData?.email || "");
  const [ecode, setEcode] = useState<string>(
    existingUserData?.e_code || existingUserData?.e_code || "",
  );
  const [phoneNumber, setPhoneNumber] = useState<string>(
    existingUserData?.phone || "",
  );
  const [enabled, setEnabled] = useState<boolean>(
    existingUserData?.enabled ?? existingUserData?.status === "active",
  );
  const [deviceOptions, setDeviceOptions] = useState<any[]>([]);
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
  const [assignedDevices, setAssignedDevices] = useState<any[]>([]);
  const isView = actionType === "view";

  useEffect(() => {
    setFirstName(existingUserData?.firstName || "");
    setLastName(existingUserData?.lastName || "");
    setEmail(existingUserData?.email || "");
    setEcode(existingUserData?.e_code || existingUserData?.e_code || "");
    setPhoneNumber(existingUserData?.phone || "");
    setEnabled(
      existingUserData?.enabled ?? existingUserData?.status === "active",
    );
    setErrorFirstName("");
    setErrorLastName("");
    setErrorUsername("");
    setErrorEmail("");
    setErrorEcode("");
    setErrorPhone("");
    setSubmitError("");
    setAssignedDevices(
      (existingUserData?.assignedDevices || []).map((device: any) => ({
        label: device.deviceName,
        value: device.deviceId,
      })),
    );
    setCompanyDepartments(
      normalizeStringArray(existingUserData?.departmentName),
    );
  }, [existingUserData, userPermissions]);

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

  const validatePhoneNumberCharacters = (value: string): boolean => {
    return /^[0-9+]*$/.test(value);
  };

  const validatePhoneNumber = (value: string): boolean => {
    const regex =
      /^(?:\+233|233|0)(20|23|24|25|26|27|28|50|53|54|55|56|57|59)\d{7}$/;
    return regex.test(value);
  };

  const fetchDeviceOptions = async () => {
    try {
      const response = await fetch("/api/device");
      if (!response.ok) {
        toast.error("Failed to fetch devices");
        throw new Error("Failed to fetch devices");
      }
      const data = await response.json();
      const options = data?.content?.map((device: any) => ({
        label: device.name,
        value: device.serialNumber,
      }));
      setDeviceOptions(options || []);
    } catch (error) {
      toast.error("Failed to fetch devices");
      console.error("Error fetching devices:", error);
    }
  };

  useEffect(() => {
    fetchDeviceOptions();
  }, []);

  const formatGhanaPhoneNumber = (phoneNumber: string) => {
    const phone = phoneNumber.trim();

    if (phone.startsWith("+233")) {
      return phone.replace("+", "");
    }

    if (phone.startsWith("233")) {
      return phone;
    }

    if (phone.startsWith("0")) {
      return `233${phone.slice(1)}`;
    }

    return phone;
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError("");

    setloadingSaveUpdateUser(true);

    const formattedPhone = formatGhanaPhoneNumber(phoneNumber);
    try {
      const companyNames = selectedCompany
        ? [selectedCompany.id]
        : normalizeStringArray(
            resolvedUser?.companyName ?? existingUserData?.companyName,
          );
      const primaryDepartment = resolvePrimaryDepartment(
        companyNames,
        companyDepartments,
        departmentOptions,
      );
      const departmentId =
        primaryDepartment?.departmentId ??
        resolvedUser?.departmentId ??
        existingUserData?.departmentId;
      const companyId =
        selectedCompany?.id ??
        primaryDepartment?.companyId ??
        resolvedUser?.companyId ??
        existingUserData?.companyId;
      const departmentNames =
        companyDepartments.length > 0
          ? companyDepartments
          : normalizeStringArray(
              resolvedUser?.departmentName ?? existingUserData?.departmentName,
            );

      const payload = {
        id:
          actionType === "edit"
            ? (resolvedUser?.id ?? existingUserData?.id)
            : undefined,
        email,
        firstName,
        lastName,
        phone: formattedPhone,
        enabled,
        e_code: ecode,
        devices: assignedDevices.map((device) => device.value),
        userInfos: [],
        companyName: companyNames,
        departmentName: departmentNames,
        companyId,
        departmentId,
        companyBranchId:
          primaryDepartment?.companyBranchId ??
          resolvedUser?.companyBranchId ??
          existingUserData?.companyBranchId,
        companyBranchName:
          primaryDepartment?.companyBranchName ??
          resolvedUser?.companyBranchName ??
          existingUserData?.companyBranchName,
      };

      if (actionType === "edit") {
        const userId = resolvedUser?.id ?? existingUserData?.id;

        if (!userId) {
          throw new Error("Missing user id for update.");
        }

        const response = await fetch(`/api/enrollment/${userId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await response.json();

        if (!response.ok) {
          toast.error(`Failed to save user, ${json.message} `, {
            style: {
              color: "red",
              background: "#fff",
              border: "1px solid red",
            },
          });
        }

        callback?.(json?.data ?? payload);
        onClose?.();
        return;
      }

      const response = await fetch("/api/enrollment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        toast.error(`Failed to save user ${data?.data.phone}`);
      }

      const json = await response.json();
      callback?.(json?.data ?? payload);
      onClose?.();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to save user.";
      setSubmitError(message);
      console.error("Error saving user:", error);
      toast.error("Error saving user", {
        style: {
          color: "red",
          background: "#fff",
          border: "1px solid red",
        },
      });
    } finally {
      setloadingSaveUpdateUser(false);
    }
  };

  console.log("deviceOption>>", deviceOptions);
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

        {/* <div className="space-y-1.5">
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
        </div> */}

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
              // setPhoneNumber(e.target.value)
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
            type="text"
            placeholder="Enter phone number"
            value={phoneNumber}
            onChange={(e) => {
              const value = e.target.value;
              if (validatePhoneNumberCharacters(value)) {
                setPhoneNumber(value);
                setErrorPhone("");
              } else {
                setErrorPhone("Only numbers and + are allowed");
              }
            }}
            onBlur={() => {
              if (phoneNumber && !validatePhoneNumber(phoneNumber)) {
                setErrorPhone("Please enter a valid phone number");
              }
            }}
            disabled={actionType === "view"}
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

        <div className="space-y-2 ">
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

        <div className="space-y-2 sm:col-span-2">
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
