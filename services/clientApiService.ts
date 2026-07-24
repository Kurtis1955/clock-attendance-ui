"use client";

import { useApiWithSessionHandler } from "@/hooks/useApiWithSessionHandler";

/**
 * Client-side API service that handles 401 responses by showing the session expired modal.
 * This should be used for client-side fetch calls instead of the native fetch.
 * 
 * @example
 * ```tsx
 * const { fetchWithAuth } = useClientApi();
 * const response = await fetchWithAuth('/api/users', { method: 'GET' });
 * ```
 */
export function useClientApi() {
  const { fetchWithAuth } = useApiWithSessionHandler();

  return { fetchWithAuth };
}

/**
 * Helper function to make authenticated API calls with automatic 401 handling.
 * This is a convenience wrapper around useClientApi for components that don't need
 * the full hook functionality.
 * 
 * @param url - The API endpoint URL
 * @param options - Fetch options (same as native fetch)
 * @returns Promise<Response> - The fetch response
 * 
 * @example
 * ```tsx
 * const response = await authenticatedFetch('/api/users', { method: 'GET' });
 * ```
 */
export async function authenticatedFetch(url: string, options?: RequestInit) {
  // This function requires the hook context, so it should be used within components
  // that are wrapped in the SessionExpiredProvider
  throw new Error(
    "authenticatedFetch must be used within a component. Use useClientApi hook instead."
  );
}
