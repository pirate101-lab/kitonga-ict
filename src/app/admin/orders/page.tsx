"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Trash2, Phone, Mail, MoveRight } from "lucide-react";
import {
  AdminButton,
  AdminCard,
  AdminPage,
} from "@/components/admin/AdminPage";
import { ORDER_BOARD, readOrders, saveOrders } from "@/lib/order-tracker";
import type { AdminOrder, AdminOrderStatus } from "@/lib/adminStore";
import { buildWhatsAppUrl } from "@/lib/site";

const SEED: AdminOrder[] = [
  {
    id: "ord-001",
    client: "Naomi Mwangi · Bara Capital",
    service: "Pitch Deck",
    brief: "24-slide series A deck. Story-led, data-heavy, editable PPTX.",
    status: "in-progress",
    channel: "WhatsApp",
    amount: "KSh 35,000",
    receivedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "ord-002",
    client: "Studio Lumière",
    service: "Photoshop Retouching",
    brief: "12-frame editorial retouch — frequency separation, color grade.",
    status: "delivered",
    channel: "WhatsApp",
    amount: "KSh 18,000",
    receivedAt: new Date(Date.now() - 86400000 * 6).toISOString(),
  },
  {
    id: "ord-003",
    client: "Faith Wanjiru",
    service: "Resumes & Cover Letters",
    brief: "Senior PM CV + cover letter + LinkedIn cover. ATS friendly.",
    status: "new",
    channel: "Form",
    amount: "KSh 2,500",
    receivedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
];

function fmtTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function nextStatus(s: AdminOrderStatus): AdminOrderStatus | null {
  const order: AdminOrderStatus[] = [
    "new",
    "in-progress",
    "review",
    "delivered",
    "archived",
  ];
  const i = order.indexOf(s);
  return i >= 0 && i < order.length - 1 ? order[i + 1] : null;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);

  useEffect(() => {
    const stored = readOrders();
    setOrders(stored.length ? stored : SEED);
  }, []);

  function commit(updated: AdminOrder[]) {
    setOrders(updated);
    saveOrders(updated);
  }

  function move(id: string, status: AdminOrderStatus) {
    commit(orders.map((o) => (o.id === id ? { ...o, status } : o)));
  }

  function remove(id: string) {
    if (!confirm("Permanently delete this order?")) return;
    commit(orders.filter((o) => o.id !== id));
  }

  function reset() {
    if (!confirm("Reset to demo seed data? Custom orders will be lost.")) return;
    commit(SEED);
  }

  return (
    <AdminPage
      eyebrow="Orders inbox"
      title="Order tracking · Kanban"
      description="Every brief that leaves the homepage Hero, the FastOrderForm intake, and any direct WhatsApp Fast Order CTA is logged here automatically. Drag the status pill to move work through the pipeline."
      actions={
        <AdminButton variant="ghost" onClick={reset} type="button">
          Reset seed
        </AdminButton>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {ORDER_BOARD.map((col) => {
          const lane = orders.filter((o) => o.status === col.status);
          return (
            <AdminCard key={col.status} className="flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-card-border pb-2">
                <h2 className="font-display text-sm font-bold tracking-tight text-foreground">
                  {col.label}
                </h2>
                <span className="font-mono text-[11px] text-muted-foreground">
                  {lane.length}
                </span>
              </div>

              {lane.length === 0 ? (
                <p className="text-xs text-muted-foreground italic py-2">
                  Nothing here yet.
                </p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {lane.map((order) => {
                    const advance = nextStatus(order.status);
                    const followUp = buildWhatsAppUrl(
                      `Hi ${order.client.split(" ")[0]}, following up on your "${order.service}" brief. Quick status: ${col.label}.`,
                    );
                    return (
                      <li
                        key={order.id}
                        className="rounded-xl border border-card-border bg-background p-3 flex flex-col gap-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-[13px] font-bold text-foreground truncate">
                              {order.client}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              {order.service}
                              {order.amount ? ` · ${order.amount}` : ""}
                            </p>
                          </div>
                          <span
                            className="rounded-full border border-card-border bg-secondary px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.12em] text-primary"
                          >
                            {order.channel}
                          </span>
                        </div>

                        {order.brief ? (
                          <p className="text-[12px] leading-relaxed text-foreground line-clamp-3">
                            {order.brief}
                          </p>
                        ) : null}

                        <p className="text-[10.5px] font-mono text-muted-foreground">
                          {fmtTime(order.receivedAt)}
                        </p>

                        <div className="flex items-center gap-1.5 pt-1 border-t border-card-border">
                          <a
                            href={followUp}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-lg border border-card-border bg-card px-2 py-1 text-[11px] font-semibold text-foreground hover:border-primary hover:text-primary"
                          >
                            <ExternalLink size={11} aria-hidden /> WhatsApp
                          </a>
                          {advance ? (
                            <button
                              type="button"
                              onClick={() => move(order.id, advance)}
                              className="inline-flex items-center gap-1 rounded-lg border border-primary bg-secondary px-2 py-1 text-[11px] font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                            >
                              <MoveRight size={11} aria-hidden /> Move
                            </button>
                          ) : null}
                          <button
                            type="button"
                            onClick={() => remove(order.id)}
                            className="ml-auto inline-flex items-center gap-1 rounded-lg border border-card-border bg-card px-2 py-1 text-[11px] font-semibold text-destructive hover:border-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
                            aria-label="Delete order"
                          >
                            <Trash2 size={11} aria-hidden />
                          </button>
                        </div>

                        <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
                          {order.client.match(/\+?\d{6,}/) ? (
                            <span className="inline-flex items-center gap-1">
                              <Phone size={10} aria-hidden />
                              {order.client.match(/\+?\d{6,}/)?.[0]}
                            </span>
                          ) : null}
                          {order.client.includes("@") ? (
                            <span className="inline-flex items-center gap-1">
                              <Mail size={10} aria-hidden />
                              {order.client.match(/\S+@\S+/)?.[0]}
                            </span>
                          ) : null}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </AdminCard>
          );
        })}
      </div>
    </AdminPage>
  );
}
