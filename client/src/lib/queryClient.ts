import { QueryClient } from "@tanstack/react-query";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

// Seule méthode HTTP utilisée par l'application : GET.
export async function apiGet<T>(url: string, opts: { nullOn401?: boolean; nullOn404?: boolean } = {}): Promise<T | null> {
  const res = await fetch(url, { method: "GET", credentials: "same-origin" });
  if (opts.nullOn401 && res.status === 401) return null;
  if (opts.nullOn404 && res.status === 404) return null;
  if (!res.ok) {
    let message = res.statusText;
    try { message = (await res.json()).message ?? message; } catch {}
    throw new ApiError(res.status, message);
  }
  return (await res.json()) as T;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, refetchOnWindowFocus: false, staleTime: 30_000 },
  },
});
