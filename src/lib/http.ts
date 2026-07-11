async function resolveServerUrl(path: string): Promise<string> {
  try {
    const { headers } = await import("next/headers");
    const requestHeaders = await headers();
    const host = requestHeaders.get("host") ?? "localhost:3000";
    const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";
    return `${protocol}://${host}${path}`;
  } catch {
    // Not inside an active Next.js request (e.g. a Vitest test running in
    // plain Node) - resolve against whatever base the caller shimmed via
    // globalThis.location instead.
    const base = globalThis.location?.href ?? "http://localhost:3000/";
    return new URL(path, base).toString();
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = typeof window === "undefined" ? await resolveServerUrl(path) : path;
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Erro ${res.status} ao chamar ${path}`);
  }

  return res.json() as Promise<T>;
}
