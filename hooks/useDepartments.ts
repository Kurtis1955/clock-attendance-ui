"use client";

import { useCallback, useEffect, useState } from "react";

export interface DepartmentOption {
  id: string;
  departmentId: string;
  companycode: string;
  departmentName: string;
  companyName: string;
  companyBranchId?: string;
  companyBranchName?: string;
}

interface UseDepartmentsResult {
  departments: DepartmentOption[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

function mapDepartmentItem(
  item: Record<string, unknown>,
  companyName: string,
  companycode: string,
): DepartmentOption | null {
  const departmentName = String(
    item.department ?? item.departmentName ?? item.name ?? "",
  );

  if (!departmentName) {
    return null;
  }

  return {
    id: departmentName,
    departmentId: departmentName,
    companycode,
    departmentName,
    companyName: String(item.companyName ?? item.company ?? companyName),
    companyBranchId: item.companyBranchId
      ? String(item.companyBranchId)
      : undefined,
    companyBranchName: item.companyBranchName
      ? String(item.companyBranchName)
      : undefined,
  };
}

export function useDepartments(
  companyName: string | null,
  companycode: string | null,
): UseDepartmentsResult {
  const [departments, setDepartments] = useState<DepartmentOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDepartments = useCallback(async () => {
    if (!companycode) {
      setDepartments([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/departments?code=${encodeURIComponent(companycode)}`,
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Failed to fetch departments (user not authorised)");
        }

        throw new Error(`Failed to fetch departments (${response.status})`);
      }

      const json = await response.json();
      const content = json?.department ?? json?.data ?? json ?? [];
      const mapped = (Array.isArray(content) ? content : [])
        .map((item: Record<string, unknown>) =>
          mapDepartmentItem(item, companyName ?? "", companycode),
        )
        .filter(Boolean) as DepartmentOption[];

      setDepartments(mapped);
    } catch (fetchError) {
      const message =
        fetchError instanceof Error
          ? fetchError.message
          : "Failed to load departments";
      setError(message);
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  }, [companyName, companycode]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  return { departments, loading, error, refetch: fetchDepartments };
}
