"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { PermissionCategoryGroup } from "@/hooks/permissions"
import { usePermissions } from "@/hooks/usePermissions"

interface PermissionPickerProps {
  selectedPermissionIds: string[]
  onChange: (permissionIds: string[]) => void
  disabled?: boolean
  error?: string
}

export function PermissionPicker({
  selectedPermissionIds,
  onChange,
  disabled = false,
  error,
}: PermissionPickerProps) {
  const { categories, allPermissionIds, totalCount, loading, error: fetchError } =
    usePermissions()

  const selectedCount = selectedPermissionIds.length
  const allSelected =
    totalCount > 0 && selectedCount === totalCount

  const handleToggle = (permissionIds: string[]) => {
    const allSelectedInGroup = permissionIds.every((id) =>
      selectedPermissionIds.includes(id)
    )

    onChange(
      allSelectedInGroup
        ? selectedPermissionIds.filter((id) => !permissionIds.includes(id))
        : Array.from(new Set([...selectedPermissionIds, ...permissionIds]))
    )
  }

  const handleSelectAll = () => {
    onChange(allSelected ? [] : allPermissionIds)
  }

  console.log("permission categories", categories)

  if (loading) {
    return (
      <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
        Loading permissions...
      </div>
    )
  }

  if (fetchError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {fetchError}
      </div>
    )
  }

  if (!categories.length) {
    return (
      <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
        No permissions available.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Label>
            Permissions <span className="text-red-500">*</span>
          </Label>
          <p className="mt-1 text-xs text-slate-500">
            {selectedCount} of {totalCount} permissions selected
          </p>
          {error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null}
        </div>

        {!disabled ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
          >
            {allSelected ? "Clear All" : "Select All"}
          </Button>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {categories.map((category) => (
          <PermissionCategoryGroup
            key={category.categoryId}
            category={category}
            disabled={disabled}
            selectedPermissionIds={selectedPermissionIds}
            onToggle={handleToggle}
          />
        ))}
      </div>
    </div>
  )
}
