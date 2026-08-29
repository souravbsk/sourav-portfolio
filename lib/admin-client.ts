/**
 * Thin client-side wrapper around the admin API. Every call goes through here
 * so error shapes (401, 409, 422 zod trees) are unpacked into one message the
 * forms can show, instead of each form re-implementing that.
 */
export class RequestError extends Error {
  status: number;
  fieldErrors: Record<string, string>;

  constructor(
    status: number,
    message: string,
    fieldErrors: Record<string, string> = {},
  ) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

type ZodTree = {
  errors?: string[];
  properties?: Record<string, ZodTree>;
};

function flattenZodTree(tree: ZodTree | undefined) {
  const result: Record<string, string> = {};
  if (!tree?.properties) return result;

  for (const [field, value] of Object.entries(tree.properties)) {
    const first = value.errors?.[0];
    if (first) result[field] = first;
  }

  return result;
}

export async function apiRequest<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers:
      init?.body instanceof FormData
        ? init.headers
        : { "Content-Type": "application/json", ...init?.headers },
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const details = payload?.details;

    const fieldErrors =
      details && typeof details === "object" && "properties" in details
        ? flattenZodTree(details as ZodTree)
        : details && typeof details === "object"
          ? (Object.fromEntries(
              Object.entries(details as Record<string, unknown>).map(
                ([key, value]) => [key, String(value)],
              ),
            ) as Record<string, string>)
          : {};

    throw new RequestError(
      response.status,
      response.status === 401
        ? "Your session expired. Sign in again."
        : (payload?.error ?? "Request failed"),
      fieldErrors,
    );
  }

  return payload as T;
}

export async function uploadImages(files: File[], folder?: string) {
  const form = new FormData();
  files.forEach((file) => form.append("file", file));
  if (folder) form.append("folder", folder);

  return apiRequest<{ url: string; urls: string[] }>("/api/upload", {
    method: "POST",
    body: form,
  });
}
