import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/security";
import { signIn, signOut } from "next-auth/react";

type Options = {
  data?: unknown;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  next?: { tags: string[] };
  token?: string;
};

export const queryService = async (endpoint: string, options?: Options) => {
  const apiBaseUrl = process.env.API_ENDPOINT_BASEURL;

  if (!apiBaseUrl) {
    throw new Error("API_ENDPOINT_BASEURL is not defined.");
  }

  const isFormData = options?.data instanceof FormData;

  const session = await getServerSession(authOptions);
  const sessionToken = (session as any)?.accessToken?.toString?.();
  const envToken = process.env.API_TOKEN?.replace(/^Bearer\s+/i, "").trim();
  const token = options?.token || sessionToken || envToken;

  if (!token) {
    throw new Error("API token is not defined.");
  }

  const url = `${apiBaseUrl.replace(/\/+$/, "")}/${endpoint.replace(/^\/+/, "")}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...options?.headers,
  };

  try {
    let body: BodyInit | null | undefined;
    if (options?.data) {
      body = isFormData
        ? (options.data as FormData)
        : JSON.stringify(options.data);
    } else {
      body = undefined;
    }

    const response = await fetch(url, {
      method: options?.method || "GET",
      headers,
      body,
      next: options?.next,
    });

    if (response.status === 401) {
      await signOut({ redirect: false });
      signIn("keycloak");
    }

    return response;
  } catch (error) {
    console.error(`Fetch Error at ${endpoint}:`, error);
    throw error;
  }
};


export const queryDeviceAttendanceService = async (endpoint: string, options?: Options) => {
  const apiBaseUrl = process.env.API_ENDPOINT_BASEURL_DEVICE_ATTENDANCE;

  if (!apiBaseUrl) {
    throw new Error("API_ENDPOINT_BASEURL_DEVICE_ATTENDANCE is not defined.");
  }

  const isFormData = options?.data instanceof FormData;

  const session = await getServerSession(authOptions);
  const sessionToken = (session as any)?.accessToken?.toString?.();
  const envToken = process.env.API_TOKEN?.replace(/^Bearer\s+/i, "").trim();
  const token = options?.token || sessionToken || envToken;

  if (!token) {
    throw new Error("API token is not defined.");
  }

  const url = `${apiBaseUrl.replace(/\/+$/, "")}/${endpoint.replace(/^\/+/, "")}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...options?.headers,
  };

  try {
    let body: BodyInit | null | undefined;
    if (options?.data) {
      body = isFormData
        ? (options.data as FormData)
        : JSON.stringify(options.data);
    } else {
      body = undefined;
    }

    const response = await fetch(url, {
      method: options?.method || "GET",
      headers,
      body,
      next: options?.next,
    });

    if (response.status === 401) {
      await signOut({ redirect: false });
      signIn("keycloak");
    }

    return response;
  } catch (error) {
    console.error(`Fetch Error at ${endpoint}:`, error);
    throw error;
  }
};

