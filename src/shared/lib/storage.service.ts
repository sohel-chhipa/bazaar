export type StorageKey = string;
export type StorageValue = unknown;

const isBrowser = () => typeof window !== "undefined";

/** Plain string storage for libraries like Zustand persist. */
export const storageService = {
  getItem: (key: StorageKey): string | null => {
    if (!isBrowser()) return null;
    return localStorage.getItem(key);
  },

  setItem: (key: StorageKey, value: string): void => {
    if (!isBrowser()) return;
    localStorage.setItem(key, value);
  },

  removeItem: (key: StorageKey): void => {
    if (!isBrowser()) return;
    localStorage.removeItem(key);
  },

  clear: (): void => {
    if (!isBrowser()) return;
    localStorage.clear();
  },

  has: (key: StorageKey): boolean => {
    if (!isBrowser()) return false;
    return localStorage.getItem(key) !== null;
  },
};

export const localStorageService = {
  set: (key: StorageKey, value: StorageValue): void => {
    if (!isBrowser()) return;
    localStorage.setItem(key, JSON.stringify(value));
  },

  get: <T = StorageValue>(key: StorageKey): T | null => {
    if (!isBrowser()) return null;
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  remove: (key: StorageKey): void => {
    storageService.removeItem(key);
  },

  clear: (): void => {
    storageService.clear();
  },

  has: (key: StorageKey): boolean => storageService.has(key),
};

interface CookieOptions {
  path?: string;
  sameSite?: "Strict" | "Lax" | "None";
  secure?: boolean;
  expires?: Date;
  maxAge?: number;
}

type CookieValue = string | boolean | string[] | number[] | Record<string, unknown>;

export const CookieService = {
  set: (name: string, value: CookieValue, options: CookieOptions = {}): void => {
    if (!isBrowser()) return;

    const defaults: CookieOptions = {
      path: "/",
      sameSite: "Lax",
      secure: window.location.protocol === "https:",
    };

    const cookieOptions = { ...defaults, ...options };
    const serializedValue = typeof value === "object" ? JSON.stringify(value) : String(value);
    const parts = [`${encodeURIComponent(name)}=${encodeURIComponent(serializedValue)}`];

    if (cookieOptions.path) parts.push(`path=${cookieOptions.path}`);
    if (cookieOptions.sameSite) parts.push(`SameSite=${cookieOptions.sameSite}`);
    if (cookieOptions.secure) parts.push("Secure");
    if (cookieOptions.expires) parts.push(`expires=${cookieOptions.expires.toUTCString()}`);
    if (typeof cookieOptions.maxAge === "number") parts.push(`max-age=${cookieOptions.maxAge}`);

    document.cookie = parts.join("; ");
  },

  get: <T = CookieValue>(name: string): T | null => {
    if (!isBrowser()) return null;

    const cookies = document.cookie.split(";");
    const encodedName = encodeURIComponent(name);

    for (const cookie of cookies) {
      const [rawKey, rawVal] = cookie.trim().split("=");
      if (rawKey === encodedName) {
        const decodedValue = decodeURIComponent(rawVal || "");

        try {
          return JSON.parse(decodedValue) as T;
        } catch {
          return decodedValue as unknown as T;
        }
      }
    }

    return null;
  },

  remove: (name: string, options: CookieOptions = {}): void => {
    if (!isBrowser()) return;

    const defaults: CookieOptions = {
      path: "/",
      sameSite: "Lax",
      secure: window.location.protocol === "https:",
    };

    const cookieOptions = { ...defaults, ...options };
    const parts = [
      `${encodeURIComponent(name)}=`,
      "expires=Thu, 01 Jan 1970 00:00:00 GMT",
    ];

    if (cookieOptions.path) parts.push(`path=${cookieOptions.path}`);
    if (cookieOptions.sameSite) parts.push(`SameSite=${cookieOptions.sameSite}`);
    if (cookieOptions.secure) parts.push("Secure");

    document.cookie = parts.join("; ");
  },

  has: (name: string): boolean => CookieService.get(name) !== null,
};
