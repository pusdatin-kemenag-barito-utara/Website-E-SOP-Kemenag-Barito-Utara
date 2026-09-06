import { supabase } from "@/lib/supabase";
import type { Activity, SOPHeader, SOPListItem, AdminSOPListItem, StoredSOP } from "@/types/sop";

const API_URL = import.meta.env.PUBLIC_API_URL || "";

// getAccessToken returns the current Supabase session access token (JWT).
export async function getAccessToken(): Promise<string | null> {
  try {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  } catch {
    return null;
  }
}

// authedRequest performs a fetch to the Go backend with the Supabase JWT attached.
export async function authedRequest<T>(
  path: string,
  options: { method?: string; body?: unknown } = {},
): Promise<T> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error("Not authenticated");
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };
  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_URL}${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let msg = `Request failed (${res.status})`;
    if (text) {
      try {
        const j = JSON.parse(text);
        if (j.error) msg = j.error;
      } catch {
        msg = text;
      }
    }
    throw new Error(msg);
  }

  if (res.status === 204) {
    return undefined as T;
  }
  return (await res.json()) as T;
}

// sopsApi wraps every SOP CRUD operation that runs on the Go backend.
export const sopsApi = {
  listMine: () =>
    authedRequest<SOPListItem[]>("/api/sops"),

  listAllAdmin: () =>
    authedRequest<AdminSOPListItem[]>("/api/sops/admin"),

  get: (id: string) =>
    authedRequest<StoredSOP>(`/api/sops/${encodeURIComponent(id)}`),

  create: (payload: {
    title: string;
    header: SOPHeader;
    activities: Activity[];
    roles: string[];
  }) =>
    authedRequest<{ id: string; title: string; updated_at: string }>("/api/sops", {
      method: "POST",
      body: payload,
    }),

  update: (
    id: string,
    payload: {
      title: string;
      header: SOPHeader;
      activities: Activity[];
      roles: string[];
    },
  ) =>
    authedRequest<{ id: string; title: string; updated_at: string }>(
      `/api/sops/${encodeURIComponent(id)}`,
      { method: "PUT", body: payload },
    ),

  remove: (id: string) =>
    authedRequest<{ success: boolean; message: string }>(
      `/api/sops/${encodeURIComponent(id)}`,
      { method: "DELETE" },
    ),
};

import type { UserProfile, CreateUserInput, UpdateUserInput } from "@/types/user";

// usersApi provides super admin CRUD operations for user accounts.
export const usersApi = {
  list: () =>
    authedRequest<UserProfile[]>("/api/admin/users"),

  create: (payload: CreateUserInput) =>
    authedRequest<{ success: boolean; user: UserProfile }>("/api/admin/users", {
      method: "POST",
      body: payload,
    }),

  update: (id: string, payload: UpdateUserInput) =>
    authedRequest<{ success: boolean; message: string }>(
      `/api/admin/users/${encodeURIComponent(id)}`,
      { method: "PUT", body: payload },
    ),

  remove: (id: string) =>
    authedRequest<{ success: boolean; message: string }>(
      `/api/admin/users/${encodeURIComponent(id)}`,
      { method: "DELETE" },
    ),
};

