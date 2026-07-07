export interface ApiErrorBody {
  message?: string;
  code?: string;
  details?: Record<string, unknown>;
}

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly details?: Record<string, unknown>;

  constructor(
    message: string,
    status: number,
    options?: { code?: string; details?: Record<string, unknown> },
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = options?.code;
    this.details = options?.details;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function getErrorMessage(error: unknown, fallback = "Something went wrong"): string {
  if (isApiError(error)) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export async function parseApiError(response: Response): Promise<ApiError> {
  let body: ApiErrorBody | undefined;

  try {
    body = (await response.json()) as ApiErrorBody;
  } catch {
    body = undefined;
  }

  const message =
    body?.message ??
    response.statusText ??
    `Request failed with status ${response.status}`;

  return new ApiError(message, response.status, {
    code: body?.code,
    details: body?.details,
  });
}
