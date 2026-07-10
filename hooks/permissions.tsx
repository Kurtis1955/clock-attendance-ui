"use client"

import { useState } from "react"
import { RiArrowDownSLine, RiArrowRightSLine } from "react-icons/ri"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { PermissionCategory } from "@/lib/permissions"

interface PermissionCategoryGroupProps {
  category: PermissionCategory
  disabled?: boolean
  selectedPermissionIds: string[]
  onToggle: (permissionIds: string[]) => void
}

export function PermissionCategoryGroup({
  category,
  disabled = false,
  selectedPermissionIds,
  onToggle,
}: PermissionCategoryGroupProps) {
  console.log("permission category group>>>",category)
  const [isExpanded, setIsExpanded] = useState(true)
  const permissionIds = category.permissions.map((permission) => permission.id)
  const checkedCount = permissionIds.filter((id) =>
    selectedPermissionIds.includes(id)
  ).length
  const isCategoryChecked =
    permissionIds.length > 0 &&
    permissionIds.every((id) => selectedPermissionIds.includes(id))
  const isCategoryIndeterminate =
    checkedCount > 0 && checkedCount < permissionIds.length

  return (
    <div className="rounded-lg border border-input bg-background text-sm">
      <div className="flex min-h-12 items-center gap-2 px-3 py-2">
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className="shrink-0"
          onClick={() => setIsExpanded((current) => !current)}
          aria-label={
            isExpanded ? "Collapse category" : "Expand category"
          }
        >
          {isExpanded ? <RiArrowDownSLine /> : <RiArrowRightSLine />}
        </Button>

        <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60">
          <input
            type="checkbox"
            className="size-4 rounded border-input text-primary focus:ring-ring"
            checked={isCategoryChecked}
            ref={(input) => {
              if (input) {
                input.indeterminate = isCategoryIndeterminate
              }
            }}
            disabled={disabled}
            onChange={() => onToggle(permissionIds)}
          />
          <span className="truncate font-medium text-slate-900">
            {category.categoryName}
          </span>
        </label>

        <Badge variant="outline" className="shrink-0">
          {checkedCount}/{permissionIds.length}
        </Badge>
      </div>

      {isExpanded ? (
        <div className="space-y-2 border-t border-slate-100 px-4 py-3 pl-12">
          {category.permissions.map((permission) => {
            const isChecked = selectedPermissionIds.includes(permission.id)

            return (
              <label
                key={permission.id}
                className="flex min-h-8 cursor-pointer items-start gap-2 rounded-md px-1 py-1 text-xs has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60 hover:bg-slate-50"
              >
                <input
                  type="checkbox"
                  className="mt-0.5 size-3.5 rounded border-input text-primary focus:ring-ring"
                  checked={isChecked}
                  disabled={disabled}
                  onChange={() => onToggle([permission.id])}
                />
                <div className="min-w-0">
                  <p className="font-medium text-slate-800">{permission.name}</p>
                  {permission.description ? (
                    <p className="text-slate-500">{permission.description}</p>
                  ) : null}
                </div>
              </label>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}

export default PermissionCategoryGroup
