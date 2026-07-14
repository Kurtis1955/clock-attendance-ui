"use client"

import { useCallback, useEffect, useState } from "react"

export interface CompanyOption {
  id: string
  company: string
  companycode: string
  description?: string
  enabled: boolean
}

interface UseCompaniesResult {
  companies: CompanyOption[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useCompanies(): UseCompaniesResult {
  const [companies, setCompanies] = useState<CompanyOption[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCompanies = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(
        "/api/company?paginate=true&page=0&size=500"
      )

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(`Failed to fetch companies ("User not authorised")`)
        }

        throw new Error(`Failed to fetch companies (${response.status})`)
      }

      const json = await response.json()
      const content =
        json?.companies ?? json?.data?.content ?? json?.data ?? json ?? []
      const mapped = (Array.isArray(content) ? content : [])
        .map(
          (company: {
            company: string
            companycode: string
            description?: string
            enabled?: boolean
          }) => ({
            id: company.companycode,
            companycode: company.companycode,
            company: company.company,
            description: company.description,
            enabled: company.enabled ?? true,
          })
        )
        .filter((company) => company.companycode && company.company)

      setCompanies(mapped)
    } catch (fetchError) {
      const message =
        fetchError instanceof Error
          ? fetchError.message
          : "Failed to load companies"
      setError(message)
      setCompanies([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCompanies()
  }, [fetchCompanies])

  return { companies, loading, error, refetch: fetchCompanies }
}

function normalizeCompanyName(value: string): string {
  return value.trim().toLowerCase()
}

export function findCompanyByName(
  companyName: string,
  companies: CompanyOption[]
): CompanyOption | null {
  const normalized = normalizeCompanyName(companyName)

  return (
    companies.find(
      (company) => normalizeCompanyName(company.company) === normalized
    ) ?? null
  )
}
