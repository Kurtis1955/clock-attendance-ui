import { Button } from "@/components/ui/button";
import { getNavigationItemPermissionValues, NavigationItem } from "@/lib/navigation";
import { Badge } from "@chakra-ui/react";
import React, { useState } from "react";
import { RiArrowDownSLine, RiArrowRightSLine } from "react-icons/ri";

const PermissionGroup = ({
  item,
  disabled,
  selectedPermissions,
  onToggle,
}: {
  item: NavigationItem;
  disabled: boolean;
  selectedPermissions: string[];
  onToggle: (permissionValues: string[]) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const permissionValues = getNavigationItemPermissionValues(item);
  const childValues = item.children?.flatMap((child) =>
    getNavigationItemPermissionValues(child),
  );
  const checkedCount = permissionValues.filter((permissionValue) =>
    selectedPermissions.includes(permissionValue),
  ).length;
  const isChecked = permissionValues.every((permissionValue) =>
    selectedPermissions.includes(permissionValue),
  );
  const hasChildren = Boolean(item.children?.length);
  const Icon = item.icon;

  return (
    <div className="rounded-lg border border-input bg-background text-sm">
      <div className="flex min-h-12 items-center gap-2 px-3 py-2">
        {hasChildren ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className="shrink-0"
            onClick={() => setIsExpanded((current) => !current)}
            aria-label={
              isExpanded ? "Collapse permissions" : "Expand permissions"
            }
          >
            {isExpanded ? <RiArrowDownSLine /> : <RiArrowRightSLine />}
          </Button>
        ) : (
          <span className="size-6 shrink-0" />
        )}

        <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60">
          <input
            type="checkbox"
            className="size-4 rounded border-input text-primary focus:ring-ring"
            checked={isChecked}
            disabled={disabled}
            onChange={() => onToggle(permissionValues)}
          />
          <Icon className="size-4 shrink-0 text-slate-500" />
          <span className="truncate font-medium text-slate-900">
            {item.label}
          </span>
        </label>

        <Badge variant="outline" className="shrink-0">
          {checkedCount}/{permissionValues.length}
        </Badge>
      </div>

      {hasChildren && isExpanded ? (
        <div className="space-y-2 border-t border-slate-100 px-4 py-3 pl-12">
          {item.children?.map((child) => {
            const values = getNavigationItemPermissionValues(child);
            const isChildChecked = values.every((permissionValue) =>
              selectedPermissions.includes(permissionValue),
            );
            const ChildIcon = child.icon;

            return (
              <label
                key={child.href}
                className="flex min-h-7 cursor-pointer items-center gap-2 text-xs font-medium text-slate-600 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60"
              >
                <input
                  type="checkbox"
                  className="size-3.5 rounded border-input text-primary focus:ring-ring"
                  checked={isChildChecked}
                  disabled={disabled}
                  onChange={() => onToggle(values)}
                />
                <ChildIcon className="size-3.5 shrink-0 text-slate-400" />
                <span className="truncate">{child.label}</span>
              </label>
            );
          })}

          {childValues?.length ? (
            <Button
              type="button"
              variant="ghost"
              size="xs"
              className="mt-1 text-xs text-slate-600"
              disabled={disabled}
              onClick={() => onToggle(childValues)}
            >
              Toggle submenu permissions
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default PermissionGroup;
