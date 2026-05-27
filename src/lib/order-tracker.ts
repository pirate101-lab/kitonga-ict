"use client";

import {
  ADMIN_STORAGE_KEYS,
  genId,
  readAdminStore,
  writeAdminStore,
  type AdminOrder,
  type AdminOrderStatus,
} from "@/lib/adminStore";

/** Friendly grouping the admin Kanban renders. */
export const ORDER_BOARD: { label: string; status: AdminOrderStatus }[] = [
  { label: "Pending", status: "new" },
  { label: "In Progress", status: "in-progress" },
  { label: "Review", status: "review" },
  { label: "Completed", status: "delivered" },
  { label: "Archived", status: "archived" },
];

export type NewOrderInput = {
  client: string;
  service: string;
  brief: string;
  channel?: AdminOrder["channel"];
  amount?: string;
};

/**
 * Append an order to the admin localStorage so the /admin/orders Kanban
 * sees every brief that left the site, even when it actually went out
 * via a WhatsApp deep link instead of a real backend POST.
 *
 * Returns the persisted record. Calling on the server is a no-op.
 */
export function logOrder(input: NewOrderInput): AdminOrder | null {
  if (typeof window === "undefined") return null;

  const order: AdminOrder = {
    id: genId("o"),
    client: input.client.trim() || "Anonymous",
    service: input.service.trim() || "General brief",
    brief: input.brief.trim(),
    status: "new",
    channel: input.channel ?? "WhatsApp",
    amount: input.amount,
    receivedAt: new Date().toISOString(),
  };

  const existing = readAdminStore<AdminOrder[]>(ADMIN_STORAGE_KEYS.orders) ?? [];
  const next = [order, ...existing].slice(0, 500);
  writeAdminStore(ADMIN_STORAGE_KEYS.orders, next);
  return order;
}

/** Read all logged orders, newest first. */
export function readOrders(): AdminOrder[] {
  return readAdminStore<AdminOrder[]>(ADMIN_STORAGE_KEYS.orders) ?? [];
}

/** Persist the entire orders list (used by the Kanban admin UI). */
export function saveOrders(orders: AdminOrder[]) {
  writeAdminStore(ADMIN_STORAGE_KEYS.orders, orders);
}

/** Update a single order in-place. */
export function updateOrder(id: string, patch: Partial<AdminOrder>) {
  const list = readOrders().map((o) => (o.id === id ? { ...o, ...patch } : o));
  saveOrders(list);
  return list;
}

/** Permanently remove an order. */
export function deleteOrder(id: string) {
  const list = readOrders().filter((o) => o.id !== id);
  saveOrders(list);
  return list;
}
