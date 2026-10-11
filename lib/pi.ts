/**
 * Lightweight client for the per-user key/value storage backing this app.
 *
 * Plain import, not a hook — safe to call from any client-side code once the
 * user is authenticated (screens only render after login, so no auth check
 * is needed before calling these).
 *
 * @example
 * import { pi } from "@/lib/pi";
 * await pi.userState.set("save", { level: 4, coins: 120 });
 * const record = await pi.userState.get("save"); // -> { blob, updatedAt, version } | null
 * await pi.userState.delete("save");
 * const keys = await pi.userState.keys();
 */

import { api } from "@/lib/api";
import { BACKEND_CONFIG } from "@/lib/system-config";

export type UserStateRecord = {
  blob: Record<string, any>;
  updatedAt: string;
  version: number;
};

let currentAppId: string | null = null;

/**
 * Called once by the auth context right after login resolves the app id.
 * Not meant to be called from app code.
 */
export function __setPiAppId(appId: string) {
  currentAppId = appId;
}

function requireAppId(): string {
  if (!currentAppId) {
    throw new Error(
      "Pi storage is not ready yet. Wait until the app has finished signing in."
    );
  }
  return currentAppId;
}

function keyUrl(key: string): string {
  return `${BACKEND_CONFIG.BASE_URL}/v1/apps/${requireAppId()}/user-state/${encodeURIComponent(
    key
  )}`;
}

function collectionUrl(): string {
  return `${BACKEND_CONFIG.BASE_URL}/v1/apps/${requireAppId()}/user-state`;
}

export const pi = {
  userState: {
    /** Fetch a stored value. Resolves to `null` if the key has never been written. */
    async get(key: string): Promise<UserStateRecord | null> {
      try {
        const { data } = await api.get<UserStateRecord>(keyUrl(key));
        return data ?? null;
      } catch (err) {
        const status = (err as { status?: number })?.status;
        if (status === 404) return null;
        throw err;
      }
    },

    /** Upsert a JSON object under a key (max 64KB, 4 levels deep). */
    async set(key: string, value: Record<string, any>): Promise<UserStateRecord> {
      const { data } = await api.put<UserStateRecord>(keyUrl(key), { value });
      return data;
    },

    /** Remove a key. */
    async delete(key: string): Promise<void> {
      try {
        await api.delete(keyUrl(key));
      } catch (err) {
        const status = (err as { status?: number })?.status;
        if (status === 404) return;
        throw err;
      }
    },

    /** List every key currently stored for this user. */
    async keys(): Promise<string[]> {
      const { data } = await api.get<{ keys: string[] }>(collectionUrl());
      return data?.keys ?? [];
    },
  },
};
