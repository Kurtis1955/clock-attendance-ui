"use client";

import { useCallback, useEffect, useState } from "react";

export interface DepartmentOption {
  id: string;
  departmentId: string;
  companyId: string;
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
  companyId?: string,
): DepartmentOption | null {
  const departmentId = String(
    item.departmentId ?? item.id ?? item.department_id ?? "",
  );
  const departmentName = String(
    item.departmentName ?? item.department ?? item.name ?? "",
  );
  const resolvedCompanyId = String(
    item.companyId ?? item.company_id ?? companyId ?? "",
  );
  const resolvedCompanyName = String(
    item.companyName ?? item.company ?? companyName,
  );

  if (!departmentId || !departmentName) {
    return null;
  }

  return {
    id: departmentId,
    departmentId,
    companyId: resolvedCompanyId,
    departmentName,
    companyName: resolvedCompanyName,
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
  companyId?: string | null,
): UseDepartmentsResult {
  const [departments, setDepartments] = useState<DepartmentOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDepartments = useCallback(async () => {
    if (!companyName) {
      setDepartments([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/departments?name=${encodeURIComponent(companyName)}`,
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(`Failed to fetch companies ("User not authorised")`);
        } else {
          throw new Error(`Failed to fetch companies (${response.status})`);
        }
      }

      const json = await response.json();
      const content = json?.data?.content ?? json?.data ?? json ?? [];
      const mapped = (Array.isArray(content) ? content : [])
        .map((item: Record<string, unknown>) =>
          mapDepartmentItem(item, companyName, companyId ?? undefined),
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
  }, [companyName, companyId]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  return { departments, loading, error, refetch: fetchDepartments };
}
