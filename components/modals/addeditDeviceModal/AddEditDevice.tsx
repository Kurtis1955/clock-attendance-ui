"use client";

import { useEffect, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Select from "react-select";

export interface DeviceRecord {
  device_sn: string;
  device_name: string;
  device_location: string;
  vendor: string;
  device_type: string;
  ipaddress: string;
  push_comm_key: string;
  time_zone: string;
  trans_interval: number;
  error_delay: number;
  delay: number;
  finger_fun_on: boolean;
  face_fun_on: boolean;
  palm_fun_on: boolean;
  userpicurl_fun_on: boolean;
  mask_fun_on: boolean;
  real_time: boolean;
}

interface AddEditDeviceProps {
  actionType: any;
  existingDeviceData?: Partial<DeviceRecord> | null;
  callback?: (record: DeviceRecord) => void;
  onClose?: () => void;
}

const emptyDevice: DeviceRecord = {
  device_sn: "",
  device_name: "",
  device_location: "",
  vendor: "ZKTeco",
  device_type: "",
  ipaddress: "",
  push_comm_key: "",
  time_zone: "GMT+0",
  trans_interval: 1,
  error_delay: 60,
  delay: 30,
  finger_fun_on: true,
  face_fun_on: true,
  palm_fun_on: false,
  userpicurl_fun_on: true,
  mask_fun_on: false,
  real_time: true,
};

const locationOptions = [
  { value: "main-entrance", label: "Main Entrance" },
  { value: "reception", label: "Reception" },
  { value: "server-room", label: "Server Room" },
  { value: "hr-office", label: "HR Office" },
  { value: "finance-office", label: "Finance Office" },
  { value: "warehouse", label: "Warehouse" },
  { value: "branch-office", label: "Branch Office" },
];

export default function AddEditDevice({
  actionType,
  existingDeviceData,
  callback,
  onClose,
}: AddEditDeviceProps) {
  const [formData, setFormData] = useState<DeviceRecord>({
    ...emptyDevice,
    ...existingDeviceData,
  });

  const isViewMode = actionType === "view";

  useEffect(() => {
    setFormData({ ...emptyDevice, ...existingDeviceData });
  }, [existingDeviceData]);

  const updateField = <K extends keyof DeviceRecord>(
    field: K,
    value: DeviceRecord[K],
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleEditDevice = async () => {
    try {
      const deviceId = (existingDeviceData as Partial<{ id: string }>)?.id;

      if (!deviceId) {
        throw new Error("Missing device id for update.");
      }

      const payload = {
        device_sn: formData.device_sn,
        device_name: formData.device_name,
        device_location: formData.device_location,
        vendor: formData.vendor,
        device_type: formData.device_type,
        ipaddress: formData.ipaddress,
        push_comm_key: formData.push_comm_key,
        time_zone: formData.time_zone,
        trans_interval: formData.trans_interval,
        error_delay: formData.error_delay,
        delay: formData.delay,
        finger_fun_on: formData.finger_fun_on,
        face_fun_on: formData.face_fun_on,
        palm_fun_on: formData.palm_fun_on,
        userpicurl_fun_on: formData.userpicurl_fun_on,
        mask_fun_on: formData.mask_fun_on,
        real_time: formData.real_time,
      };

      const response = await fetch(
        `/api/device?id=${encodeURIComponent(deviceId)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update device");
      }

      const json = await response.json();
      const updatedDevice = json?.data ?? payload;

      callback?.(updatedDevice);
      onClose?.();
    } catch (error) {
      console.error("Error editing device:", error);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // if (actionType === "edit") {
    //   void handleEditDevice();
    //   return;
    // }

    callback?.(formData);
    onClose?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-1 text-sm">
      {/* Device Information */}
      <div>
        <h3 className="mb-4 text-lg text-gray-500 font-semibold">
          Device Information
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label>Device Serial Number</Label>
            <Input
              value={formData.device_sn}
              disabled={isViewMode}
              onChange={(e) => updateField("device_sn", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Device Name</Label>
            <Input
              value={formData.device_name}
              disabled={isViewMode}
              onChange={(e) => updateField("device_name", e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Device Location</Label>

            <Input
              value={formData.device_location}
              disabled={isViewMode}
              onChange={(e) => updateField("device_location", e.target.value)}
            />
            {/* <Select
              isDisabled={isViewMode}
              options={locationOptions}
              value={locationOptions.find(
                (option) => option.value === formData.device_location,
              )}
              onChange={(selectedOption) =>
                updateField("device_location", selectedOption?.value ?? "")
              }
              placeholder="Select device location"
              className="text-sm"
            /> */}
          </div>

          <div className="flex flex-col gap-2">
            <Label>Device Brand</Label>
            <Input
              value={formData.vendor}
              disabled={isViewMode}
              onChange={(e) => updateField("vendor", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Device Type</Label>
            <Input
              value={formData.device_type}
              disabled={isViewMode}
              onChange={(e) => updateField("device_type", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Network Configuration */}
      <div className=" pt-6">
        <h3 className="mb-4 text-lg text-gray-500 font-semibold">
          Network Configuration
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label>IP Address</Label>
            <Input
              value={formData.ipaddress}
              disabled={true}
              onChange={(e) => updateField("ipaddress", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Communication Key</Label>
            <Input
              type="password"
              value={formData.push_comm_key}
              disabled={true}
              onChange={(e) => updateField("push_comm_key", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Time Zone</Label>
            <Input
              value={formData.time_zone}
              disabled={true}
              onChange={(e) => updateField("time_zone", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Synchronization */}
      {/* <div className=" pt-6">
        <h3 className="mb-4 text-lg text-gray-500 font-semibold">
          Synchronization Settings
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex flex-col gap-2">
            <Label>Sync Interval (Minutes)</Label>
            <Input
              type="number"
              value={formData.trans_interval}
              disabled={isViewMode}
              onChange={(e) =>
                updateField("trans_interval", Number(e.target.value))
              }
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Error Delay</Label>
            <Input
              type="number"
              value={formData.error_delay}
              disabled={isViewMode}
              onChange={(e) =>
                updateField("error_delay", Number(e.target.value))
              }
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Retry Delay</Label>
            <Input
              type="number"
              value={formData.delay}
              disabled={isViewMode}
              onChange={(e) => updateField("delay", Number(e.target.value))}
            />
          </div>
        </div>
      </div> */}

      {/* Features */}
      {/* <div className=" pt-6">
        <h3 className="mb-4 text-lg text-gray-500 font-semibold">
          Device Features
        </h3>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <FeatureCheckbox
            label="Fingerprint"
            checked={formData.finger_fun_on}
            disabled={isViewMode}
            onChange={(checked) => updateField("finger_fun_on", checked)}
          />

          <FeatureCheckbox
            label="Face Recognition"
            checked={formData.face_fun_on}
            disabled={isViewMode}
            onChange={(checked) => updateField("face_fun_on", checked)}
          />

          <FeatureCheckbox
            label="Palm Recognition"
            checked={formData.palm_fun_on}
            disabled={isViewMode}
            onChange={(checked) => updateField("palm_fun_on", checked)}
          />

          <FeatureCheckbox
            label="User Photos"
            checked={formData.userpicurl_fun_on}
            disabled={isViewMode}
            onChange={(checked) => updateField("userpicurl_fun_on", checked)}
          />

          <FeatureCheckbox
            label="Mask Detection"
            checked={formData.mask_fun_on}
            disabled={isViewMode}
            onChange={(checked) => updateField("mask_fun_on", checked)}
          />

          <FeatureCheckbox
            label="Real Time Sync"
            checked={formData.real_time}
            disabled={isViewMode}
            onChange={(checked) => updateField("real_time", checked)}
          />
        </div>
      </div> */}

      <div className="flex justify-end  pt-6">
        {isViewMode ? (
          <Button
            type="button"
            className="bg-yellow-500 hover:bg-yellow-600"
            onClick={onClose}
          >
            Close
          </Button>
        ) : (
          <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600">
            Save Device
          </Button>
        )}
      </div>
    </form>
  );
}

function FeatureCheckbox({
  label,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Checkbox
        checked={checked}
        disabled={disabled}
        onCheckedChange={(value) => onChange(Boolean(value))}
      />
      <Label>{label}</Label>
    </div>
  );
}
