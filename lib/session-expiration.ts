export const SESSION_EXPIRED_ERROR_MESSAGE = "Session expired";

const AUTH_RELATED_ERROR_PATTERNS = [
  "session",
  "expired",
  "token",
  "unauthorized",
  "unauthorised",
  "invalid",
  "forbidden",
  "authentication",
  "jwt",
  "refresh",
  "login",
  "access denied",
  "not authenticated",
  "not authorized",
];

export async function shouldTriggerSessionExpired(
  response: Response
): Promise<boolean> {
  if (!response) {
    return false;
  }

  if (response.status === 401 || response.status === 403) {
    const wwwAuthenticate = response.headers.get("www-authenticate") ?? "";
    if (wwwAuthenticate.toLowerCase().includes("bearer")) {
      return true;
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json") && !contentType.includes("text/")) {
      return false;
    }

    try {
      const responseText = await response.clone().text();
      if (!responseText) {
        return false;
      }

      const normalizedBody = responseText.toLowerCase();
      return AUTH_RELATED_ERROR_PATTERNS.some((pattern) =>
        normalizedBody.includes(pattern)
      );
    } catch {
      return false;
    }
  }

  if (response.status < 500) {
    return false;
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json") && !contentType.includes("text/")) {
    return false;
  }

  try {
    const responseText = await response.clone().text();
    if (!responseText) {
      return false;
    }

    const normalizedBody = responseText.toLowerCase();
    return AUTH_RELATED_ERROR_PATTERNS.some((pattern) =>
      normalizedBody.includes(pattern)
    );
  } catch {
    return false;
  }
}
