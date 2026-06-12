/**
 * Lightweight localStorage-backed store for the admin panel.
 *
 * Each editable surface (slides, portfolio, services overrides, testimonials,
 * orders inbox, clients, site settings) writes to a namespaced key here. The
 * frontend components read from these keys on mount and fall back to the
 * curated defaults shipped with the bundle.
 *
 * Keeping persistence in localStorage means the admin panel works
 * end-to-end against the static frontend without needing a backend, while
 * still being trivial to upgrade to a real API later — every read/write
 * already goes through these helpers.
 */

export const ADMIN_STORAGE_KEYS = {
 slides: "kitonga.admin.slides",
 portfolio: "kitonga.admin.portfolio",
 services: "kitonga.admin.services",
 beforeAfter: "kitonga.admin.beforeAfter",
 testimonials: "kitonga.admin.testimonials",
 orders: "kitonga.admin.orders",
 clients: "kitonga.admin.clients",
 settings: "kitonga.admin.settings",
} as const;

export type AdminStorageKey =
 (typeof ADMIN_STORAGE_KEYS)[keyof typeof ADMIN_STORAGE_KEYS];

export function readAdminStore<T>(key: AdminStorageKey): T | null {
 if (typeof window === "undefined") return null;
 try {
 const raw = window.localStorage.getItem(key);
 if (!raw) return null;
 return JSON.parse(raw) as T;
 } catch {
 return null;
 }
}

export function writeAdminStore<T>(key: AdminStorageKey, value: T) {
 if (typeof window === "undefined") return;
 try {
 window.localStorage.setItem(key, JSON.stringify(value));
 } catch {
 // ignore — storage may be disabled / quota exceeded
 }
}

export function clearAdminStore(key: AdminStorageKey) {
 if (typeof window === "undefined") return;
 try {
 window.localStorage.removeItem(key);
 } catch {
 // ignore
 }
}

/** Generic id helper used by admin CRUD forms. */
export function genId(prefix: string) {
 const rnd = Math.random().toString(36).slice(2, 8);
 return `${prefix}-${Date.now().toString(36)}-${rnd}`;
}

/* -------------------------------------------------------------------------- */
/* Domain types persisted by the admin panel */
/* -------------------------------------------------------------------------- */

export type AdminOrderStatus =
 | "new"
 | "in-progress"
 | "review"
 | "delivered"
 | "archived";

export type AdminOrder = {
 id: string;
 client: string;
 service: string;
 brief: string;
 status: AdminOrderStatus;
 channel: "WhatsApp" | "Form" | "Email" | "Other";
 amount?: string;
 receivedAt: string;
};

export type AdminClient = {
 id: string;
 name: string;
 company?: string;
 email?: string;
 phone?: string;
 tags: string[];
 notes?: string;
};

export type AdminTestimonial = {
 id: string;
 quote: string;
 author: string;
 role: string;
 rating: 1 | 2 | 3 | 4 | 5;
};

export type AdminBeforeAfter = {
 id: string;
 title: string;
 category: string;
 description: string;
 beforeImage?: string;
 afterImage?: string;
};

export type AdminServiceOverride = {
 id: string;
 enabled: boolean;
 startingPrice?: string;
 turnaround?: string;
};

export type AdminSiteSettings = {
 whatsappNumber?: string;
 contactEmail?: string;
 location?: string;
 hours?: string;
 defaultTheme?: "dark" | "light";
 social?: {
 instagram?: string;
 twitter?: string;
 behance?: string;
 dribbble?: string;
 };
};
