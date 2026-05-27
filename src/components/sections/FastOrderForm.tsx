"use client";

import { useMemo, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { SERVICES } from "@/lib/services";
import { SITE, buildWhatsAppUrl } from "@/lib/site";
import { logOrder } from "@/lib/order-tracker";
import { WhatsAppButtonButton, WhatsAppIcon } from "@/components/ui/WhatsAppButton";

const TURNAROUNDS = ["Standard (24–48h)", "Rush (12h)", "Same-day"];
const BUDGETS = [
  "Under KSh 2,000",
  "KSh 2,000 – 5,000",
  "KSh 5,000 – 15,000",
  "KSh 15,000 – 50,000",
  "KSh 50,000+",
];

/**
 * Fast Order intake form. Every piece of state, every handler, and the
 * dynamic WhatsApp message generation remain unchanged — only the visual
 * presentation has been tuned to the new editorial light system.
 */
export function FastOrderForm() {
  const [serviceId, setServiceId] = useState(SERVICES[0].id);
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [turnaround, setTurnaround] = useState(TURNAROUNDS[0]);
  const [budget, setBudget] = useState(BUDGETS[1]);
  const [referenceLink, setReferenceLink] = useState("");

  const service = SERVICES.find((s) => s.id === serviceId) ?? SERVICES[0];

  const message = useMemo(() => {
    return [
      `Hello KITONGA-ICT! 👋`,
      ``,
      `I'd like to place a Fast Order:`,
      `• Project type: ${service.title}`,
      `• Turnaround: ${turnaround}`,
      `• Budget: ${budget}`,
      name ? `• Name: ${name}` : null,
      referenceLink ? `• Reference: ${referenceLink}` : null,
      ``,
      `Brief:`,
      details ? details : "(I'll share the details on chat)",
      ``,
      `— Sent from kitongaict.tech`,
    ]
      .filter(Boolean)
      .join("\n");
  }, [service.title, turnaround, budget, name, referenceLink, details]);

  const whatsappHref = buildWhatsAppUrl(message);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Log to the admin Kanban so every brief is trackable even though
    // the actual conversation continues over WhatsApp.
    logOrder({
      client: name || "Anonymous",
      service: service.title,
      brief: details || "(brief shared on WhatsApp)",
      channel: "Form",
      amount: budget,
    });
    window.open(whatsappHref, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
      {/* Form */}
      <div className="rounded-2xl border border-card-border bg-card p-5 md:p-7">
        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          <div className="grid gap-2">
            <Label>Project type</Label>
            <div className="grid gap-2 sm:grid-cols-2">
              {SERVICES.map((s) => (
                <label
                  key={s.id}
                  className={`flex cursor-pointer items-start gap-2.5 rounded-xl border p-2.5 transition-colors ${
                    serviceId === s.id
                      ? "border-primary bg-secondary text-foreground"
                      : "border-card-border bg-card text-foreground hover:border-primary hover:bg-secondary"
                  }`}
                >
                  <input
                    type="radio"
                    name="service"
                    value={s.id}
                    checked={serviceId === s.id}
                    onChange={() => setServiceId(s.id)}
                    className="sr-only"
                  />
                  <span
                    className={`mt-0.5 grid h-8 w-8 place-items-center rounded-lg shrink-0 ${
                      serviceId === s.id
                        ? "bg-primary text-primary-foreground"
                        : "border border-card-border bg-secondary text-primary"
                    }`}
                    aria-hidden
                  >
                    <s.icon size={14} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[13px] font-semibold text-foreground">
                      {s.title}
                    </span>
                    <span className="block text-[11px] text-muted-foreground">
                      {s.turnaround}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="name">Your name</Label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Naomi Mwangi"
              className={inputClass}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="details">Brief details</Label>
            <textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={5}
              placeholder="Tell us what you need — event, audience, mood, deadline, anything that helps us nail it on the first pass."
              className={`${inputClass} resize-y min-h-[130px]`}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Turnaround</Label>
              <div className="flex flex-wrap gap-1.5">
                {TURNAROUNDS.map((t) => (
                  <Pill
                    key={t}
                    active={turnaround === t}
                    onClick={() => setTurnaround(t)}
                  >
                    {t}
                  </Pill>
                ))}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="budget">Budget</Label>
              <select
                id="budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className={inputClass}
              >
                {BUDGETS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="reference">Reference link (optional)</Label>
            <input
              id="reference"
              type="url"
              value={referenceLink}
              onChange={(e) => setReferenceLink(e.target.value)}
              placeholder="A Drive folder, mood board, Pinterest board…"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-[11.5px] text-muted-foreground">
              <ShieldCheck size={13} className="text-primary" aria-hidden />
              We never share your brief. Your details stay between you and the
              studio.
            </div>
            <WhatsAppButtonButton size="md">
              Send via WhatsApp
            </WhatsAppButtonButton>
          </div>
        </form>
      </div>

      {/* Live preview */}
      <div className="lg:sticky lg:top-24 flex flex-col gap-3">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Live preview · WhatsApp message
        </span>
        <div className="rounded-2xl border border-card-border bg-card p-4">
          <div className="flex items-center gap-2 border-b border-card-border pb-3">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#25D366] text-foreground">
              <WhatsAppIcon size={15} />
            </span>
            <div>
              <div className="text-[13px] font-semibold text-foreground">
                {SITE.name} · Studio
              </div>
              <div className="text-[11px] text-muted-foreground">online</div>
            </div>
          </div>
          <div className="mt-3 max-w-full">
            <div className="ml-auto max-w-[92%] rounded-xl rounded-br-sm bg-[#25D366] px-3.5 py-2.5 text-[12.5px] leading-relaxed text-foreground font-medium whitespace-pre-wrap">
              {message}
            </div>
            <div className="mt-2 text-right text-[10px] text-muted-foreground">
              Sent from kitongaict.tech
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-card-border bg-card p-3.5 text-[11.5px] text-muted-foreground">
          Hitting{" "}
          <span className="font-semibold text-primary">Send via WhatsApp</span>{" "}
          opens chat with our admin pre-filled with this message — you can still
          edit before sending.
        </div>
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-card-border bg-card px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition";

function Label({
  children,
  htmlFor,
}: {
  children: React.ReactNode;
  htmlFor?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-foreground"
    >
      {children}
    </label>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-2.5 py-1.5 text-[11.5px] font-semibold transition-colors ${
        active
          ? "border-primary bg-secondary text-primary"
          : "border-card-border bg-card text-muted-foreground hover:border-primary hover:text-primary"
      }`}
    >
      {children}
    </button>
  );
}
