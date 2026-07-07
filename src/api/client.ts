import { getApiBaseUrl } from "@/api/config";
import { getStoredAuthToken } from "@/lib/auth-storage";
import { ApiError, parseApiError } from "@/api/errors";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiRequestOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  /** When set, body is sent as-is (e.g. FormData) without JSON serialization. */
  rawBody?: BodyInit;
}

/**
 * Thin fetch wrapper for backend communication.
 * JWT: call setAuthToken() after login — Authorization header is attached automatically.
 */
class ApiClient {
  private authToken: string | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      const stored = getStoredAuthToken();
      if (stored) {
        this.authToken = stored;
      }
    }
  }

  setAuthToken(token: string | null): void {
    this.authToken = token;
  }

  getAuthToken(): string | null {
    return this.authToken;
  }

  private buildUrl(path: string): string {
    const base = getApiBaseUrl();
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${base}${normalizedPath}`;
  }

  private buildHeaders(extra?: Record<string, string>): HeadersInit {
    const headers: Record<string, string> = {
      Accept: "application/json",
      ...extra,
    };

    if (this.authToken) {
      headers.Authorization = `Bearer ${this.authToken}`;
    }

    return headers;
  }

  async request<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
    const { method = "GET", body, headers, signal, rawBody } = options;

    const init: RequestInit = {
      method,
      headers: this.buildHeaders({
        ...(body !== undefined && rawBody === undefined
          ? { "Content-Type": "application/json" }
          : {}),
        ...headers,
      }),
      signal,
    };

    if (rawBody !== undefined) {
      init.body = rawBody;
    } else if (body !== undefined) {
      init.body = JSON.stringify(body);
    }

    const response = await fetch(this.buildUrl(path), init);

    if (response.status === 204) {
      return undefined as T;
    }

    if (!response.ok) {
      throw await parseApiError(response);
    }

    return (await response.json()) as T;
  }

  get<T>(path: string, signal?: AbortSignal): Promise<T> {
    return this.request<T>(path, { method: "GET", signal });
  }

  post<T>(path: string, body?: unknown, signal?: AbortSignal): Promise<T> {
    return this.request<T>(path, { method: "POST", body, signal });
  }

  put<T>(path: string, body?: unknown, signal?: AbortSignal): Promise<T> {
    return this.request<T>(path, { method: "PUT", body, signal });
  }

  patch<T>(path: string, body?: unknown, signal?: AbortSignal): Promise<T> {
    return this.request<T>(path, { method: "PATCH", body, signal });
  }

  delete<T = void>(path: string, signal?: AbortSignal): Promise<T> {
    return this.request<T>(path, { method: "DELETE", signal });
  }

  upload<T>(path: string, formData: FormData, signal?: AbortSignal): Promise<T> {
    return this.request<T>(path, { method: "POST", rawBody: formData, signal });
  }
}

export const apiClient = new ApiClient();

export { ApiError };
