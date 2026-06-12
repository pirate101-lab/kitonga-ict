import { ReactNode } from "react";

type Props = {
  eyebrow: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
};

/**
 * Page-header + content shell used by every admin route. Editorial
 * light theme — white cards, slate hairlines, indigo eyebrow accent.
 * No drop-shadows.
 */
export function AdminPage({
  eyebrow,
  title,
  description,
  actions,
  children,
}: Props) {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary font-bold">
            {eyebrow}
          </p>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          {description ? (
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </header>

      <div className="flex flex-col gap-6">{children}</div>
    </div>
  );
}

export function AdminCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-card-border bg-card p-6 ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

export function AdminField({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-semibold text-foreground">{label}</span>
      {children}
      {hint ? (
        <span className="text-xs text-muted-foreground">{hint}</span>
      ) : null}
    </label>
  );
}

const inputBase =
  "rounded-xl border border-card-border bg-card px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground";

export function AdminInput(
  props: React.InputHTMLAttributes<HTMLInputElement>,
) {
  const { className, ...rest } = props;
  return <input className={`${inputBase} ${className ?? ""}`} {...rest} />;
}

export function AdminTextarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  const { className, ...rest } = props;
  return (
    <textarea
      className={`${inputBase} min-h-[110px] ${className ?? ""}`}
      {...rest}
    />
  );
}

export function AdminSelect(
  props: React.SelectHTMLAttributes<HTMLSelectElement>,
) {
  const { className, ...rest } = props;
  return <select className={`${inputBase} ${className ?? ""}`} {...rest} />;
}

export function AdminButton({
  variant = "primary",
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger";
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed border";
  const styles =
    variant === "primary"
      ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
      : variant === "danger"
        ? "border-destructive bg-card text-destructive hover:bg-destructive hover:text-destructive-foreground"
        : "border-card-border bg-card text-foreground hover:border-primary hover:text-primary";
  return (
    <button className={`${base} ${styles} ${className ?? ""}`} {...rest} />
  );
}
