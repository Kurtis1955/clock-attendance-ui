type Options = {
  data?: unknown;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  next?: { tags: string[] };
};

export const queryService = async (endpoint: string, options?: Options) => {
  const apiBaseUrl = process.env.API_ENDPOINT_BASEURL;
  // const token = process.env.API_TOKEN;

  if (!apiBaseUrl) {
    throw new Error("API_ENDPOINT_BASEURL is not defined.");
  }

  // const url = `${apiBaseUrl}${endpoint}`;
  const isFormData = options?.data instanceof FormData;


const token = process.env.API_TOKEN?.replace(/^Bearer\s+/i, "").trim();

if (!token) {
  throw new Error("API_TOKEN is not defined.");
}

const url = `${apiBaseUrl.replace(/\/+$/, "")}/${endpoint.replace(/^\/+/, "")}`;
console.log("url on server side",url)
const headers = {
  Authorization: `Bearer ${token}`,
  ...(isFormData ? {} : { "Content-Type": "application/json" }),
  ...options?.headers,
};

  try {
    let body: BodyInit | null | undefined;
    if (options?.data) {
      body = isFormData ? (options.data as FormData) : JSON.stringify(options.data);
    } else {
      body = undefined;
    }

    const response = await fetch(url, {
      method: options?.method || "GET",
      headers,
      body,
      next: options?.next,
    });

    return response;
  } catch (error) {
    console.error(`Fetch Error at ${endpoint}:`, error);
    throw error;
  }
};

export default queryService;

