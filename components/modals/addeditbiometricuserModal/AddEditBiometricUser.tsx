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


const AddEditBiometricUser = ({
  actionType,
  existingUserData,
  userPermissions,
  callback,
  onClose,
}: any) => {
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
    existingUserData?.phoneNumber || "",
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
    setPhoneNumber(existingUserData?.phoneNumber || "");
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

  const fetchDeviceOptions = async () => {
    try {
      const response = await fetch("/api/device");
      if (!response.ok) {
        throw new Error("Failed to fetch devices");
      }
      const data = await response.json();
      const options = data?.content?.map((device: any) => ({
        label: device.name,
        value: device.serialNumber,
      }));
      setDeviceOptions(options || []);
    } catch (error) {
      console.error("Error fetching devices:", error);
    }
  };

  useEffect(() => {
    fetchDeviceOptions();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError("")

    setloadingSaveUpdateUser(true);

    try {
      const payload =({
        id:
          actionType === "edit"
            ? (resolvedUser?.id ?? existingUserData?.id)
            : undefined,
        email,
        firstName,
        lastName,
        phoneNumber,
        enabled,
        e_code: ecode,
        devices: assignedDevices.map((device) => device.value),
      });

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

        if (!response.ok) {
          throw new Error(await parseApiError(response));
        }

        const json = await response.json();
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
