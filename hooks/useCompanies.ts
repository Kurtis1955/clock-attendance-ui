"use client"

import { useCallback, useEffect, useState } from "react"

export interface CompanyOption {
  id: string
  name: string
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
        if(response.status === 401){
          throw new Error(`Failed to fetch companies ("User not authorised")`)
        }else{
          throw new Error(`Failed to fetch companies (${response.status})`)
        }
      }

      const json = await response.json()
      console.log("json data>>>",json,"json.companies",json.companies)
      const content = json?.companies ?? json?.data ?? json ?? []
      const mapped = (Array.isArray(content) ? content : [])
        .map(
          (company: {
            company: string
            companycode: string
            description?: string
            enabled?: boolean
          }) => ({
            id: company.companycode,
            name: company.company,
            description: company.description,
            enabled: company.enabled ?? true,
          })
        )
        .filter((company: CompanyOption) => company.id && company.name)

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
