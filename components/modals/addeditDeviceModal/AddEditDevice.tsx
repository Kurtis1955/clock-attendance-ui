"use client";

import { useEffect, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Select from "react-select";
import { Textarea } from "@chakra-ui/react";
import { toast } from "sonner";

interface AddEditDeviceProps {
  actionType: any;
  existingDeviceData?: any | null;
  callback?: (record: any) => void;
  onClose?: () => void;
}

const deviceTypeOptions = [
  { label: "ZKTeco ADMS", value: "ZKTeco ADMS" },
  // { label: "ZKTeco Pull SDK", value: "ZKTeco Pull SDK" },
  // { label: "ZKTeco Push SDK", value: "ZKTeco Push SDK" },
  // { label: "Hikvision MinMoe", value: "Hikvision MinMoe" },
  // { label: "Suprema BioStar", value: "Suprema BioStar" },
  // { label: "Anviz CrossChex", value: "Anviz CrossChex" },
];

export default function AddEditDevice({
  actionType,
  existingDeviceData,
  callback,
  onClose,
}: AddEditDeviceProps) {
  const [id, setId] = useState("");

  const [uuid, setUuid] = useState("");

  const [deviceInfoId, setDeviceInfoId] = useState("");

  const [serialNumber, setSerialNumber] = useState("");

  const [deviceName, setDeviceName] = useState("");

  const [description, setDescription] = useState("");

  const [deviceLocation, setDeviceLocation] = useState("");

  const [status, setStatus] = useState("Inactive");

  const [enabled, setEnabled] = useState(true);

  const [deviceTypeCode, setDeviceTypeCode] = useState("");

  const [deviceTypeName, setDeviceTypeName] = useState("");

  const isViewMode = actionType === "view";

  useEffect(() => {
    if (existingDeviceData) {
      setId(existingDeviceData.id || "");
      setUuid(existingDeviceData.uuid || "");
      setDeviceInfoId(existingDeviceData.device_sn || "");
      setSerialNumber(existingDeviceData.serialNumber || "");
      setDeviceName(existingDeviceData.name || "");
      setDescription(existingDeviceData.description || "");
      setDeviceLocation(existingDeviceData.location || "");
      setStatus(existingDeviceData.status || "Offline");
      setEnabled(existingDeviceData.enabled ?? true);
      setDeviceTypeCode(existingDeviceData.device_type || "");
      setDeviceTypeName(existingDeviceData.deviceTypeName || "");
    }
  }, [existingDeviceData]);

  const handleEditDevice = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const payload = {
        // id: id ? id.toString() : "",
        // uuid: uuid ? uuid : "",
        // deviceInfoId: deviceInfoId ? deviceInfoId : "",
        serialNumber: serialNumber,
        name: deviceName,
        description,
        location: deviceLocation,
        status,
        enabled,
        // device_type: deviceTypeCode,
        // deviceTypeName,
      };

      console.log("device payload", payload);
      if (actionType === "edit") {
        const response = await fetch(`/api/device?id=${uuid}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          toast.error("Failed to update device", {
            position: "top-right",
            style: {
              color: "#dc2626",
              background: "#fff",
              border: "1px solid #dc2626",
            },
          });
          throw new Error("Failed to update device.");
        } else {
          const data = await response.json();
          toast.success("Device update successfully", {
            position: "top-right",
            style: {
              color: "#16a34a",
              background: "#fff",
              border: "1px solid #16a34a",
            },
          });
          callback && callback(data);
          onClose && onClose();
        }
      } else {
        const response = await fetch(`/api/device`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          toast.error("Failed to add device", {
            position: "top-right",
            style: {
              color: "#dc2626",
              background: "#fff",
              border: "1px solid #dc2626",
            },
          });
          throw new Error("Failed to add device.");
        } else {
          const data = await response.json();
          toast.success("Device saved successfully", {
            position: "top-right",
            style: {
              color: "#16a34a",
              background: "#fff",
              border: "1px solid #16a34a",
            },
          });
          callback && callback(data);
          onClose && onClose();
        }
      }
    } catch (error) {
      console.error("Error editing device:", error);
    }
  };
  return (
    <form onSubmit={handleEditDevice} className="space-y-1 text-sm">
      {/* Device Information */}
      <div>
        <h3 className="mb-4 text-lg text-gray-500 font-semibold">
          Device Information
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label>Device Serial Number</Label>
            <Input
              value={serialNumber}
              disabled={isViewMode}
              onChange={(e) => setSerialNumber(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Device Name</Label>
            <Input
              value={deviceName}
              disabled={isViewMode}
              onChange={(e) => setDeviceName(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Device Location</Label>

            <Input
              value={deviceLocation}
              disabled={isViewMode}
              onChange={(e) => setDeviceLocation(e.target.value)}
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
              value={deviceTypeCode || "ZKTECO"}
              disabled={isViewMode}
              onChange={(e) => setDeviceTypeCode(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Device Type</Label>

            <Select
              options={deviceTypeOptions}
              isDisabled={isViewMode}
              placeholder="Select Device Type"
              value={deviceTypeOptions.find(
                (option) => option.value === deviceTypeName,
              )}
              onChange={(selectedOption) =>
                setDeviceTypeName(selectedOption?.value || "")
              }
              className="text-sm"
              classNamePrefix="react-select"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Status</Label>
            <Select
              isDisabled={isViewMode}
              options={[
                { value: "Active", label: "Active" },
                { value: "Inactive", label: "Inactive" },
              ]}
              value={{ value: status, label: status }}
              onChange={(selectedOption) =>
                setStatus(selectedOption?.value ?? "Inactive")
              }
              placeholder="Select device status"
              className="text-sm"
            />
          </div>

          <div className="flex flex-col gap-2 col-span-2">
            <Label>Device Description</Label>
            <Textarea
              className="resize-none p-2 border rounded-md border-gray-300 focus:border-yellow-500 focus:ring focus:ring-yellow-200 focus:ring-opacity-50"
              rows={3}
              placeholder="Enter device description"
              value={description}
              disabled={isViewMode}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="sm:col-span-2 mt-4">
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
