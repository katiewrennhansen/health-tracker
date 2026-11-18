import { useAuth } from "@clerk/react";

interface ApiOptions<T> {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  /** Sent as JSON. */
  body?: unknown;
  /** Parses the response, e.g. the shared `activitySchema`. Leave out for responses with no body (DELETE's 204). */
  schema?: { parse: (data: unknown) => T };
}

/**
 * Returns `api(path, options)` for calling our `/api` routes. It attaches the Clerk token,
 * sends `body` as JSON, throws on non-2xx responses and parses the response with `schema`.
 */
export function useApi() {
  const { getToken } = useAuth();

  // T comes from `schema`; with no schema it defaults to void.
  return async function api<T = void>(
    path: string,
    { method = "GET", body, schema }: ApiOptions<T> = {},
  ): Promise<T> {
    const token = await getToken();
    const res = await fetch(`/api${path}`, {
      method,
      headers: {
        ...(body === undefined ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (!res.ok) {
      throw new Error(`${method} /api${path} failed with ${res.status}`);
    }
    // Checks the response against the shared schema, so a client/server mismatch fails loudly.
    return schema ? schema.parse(await res.json()) : (undefined as T);
  };
}
