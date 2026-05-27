import { cn } from "@/lib/utils";

type PortfolioMockupProps = {
 title: string;
 preview: string;
 client: string;
 category: string;
 gradient: string;
 /** Optional admin-uploaded image URL. When present, shows the real photo. */
 customImage?: string;
 className?: string;
};

/**
 * Portfolio tile. Two modes:
 * - If `customImage` is provided (admin-uploaded), it renders the real
 * photograph full-bleed with a caption overlay.
 * - Otherwise it renders the branded Electronic Blue placeholder wordmark.
 *
 * Height is intentionally compact (aspect-[4/3] ≈ 30% shorter than the
 * old 4/5 ratio) so the grid fits more items above the fold.
 */
export function PortfolioMockup({
 title,
 preview,
 client,
 category,
 customImage,
 className,
}: PortfolioMockupProps) {
 const lines = preview.split("\n");

 return (
 <div
 className={cn(
 "relative aspect-[4/3] w-full overflow-hidden",
 !customImage && "bg-primary",
 className,
 )}
 >
 {customImage ? (
 /* ── Real admin-uploaded photo ── */
 <>
 {/* eslint-disable-next-line @next/next/no-img-element */}
 <img
 src={customImage}
 alt={title}
 className="absolute inset-0 h-full w-full object-cover"
 loading="lazy"
 />
 {/* Gradient overlay for caption legibility */}
 <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
 </>
 ) : (
 /* ── Branded placeholder ── */
 <>
 {/* Soft depth highlights */}
 <span aria-hidden className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10" />
 <span aria-hidden className="absolute -bottom-14 -left-14 h-40 w-40 rounded-full bg-white/5" />

 {/* Category label */}
 <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
 <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-foreground">
 {category}
 </span>
 <span className="rounded-full border border-white/30 bg-white/10 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-foreground">
 KITONGA·ICT
 </span>
 </div>

 {/* Centred wordmark */}
 <div className="absolute inset-0 flex items-center justify-center">
 <div className="text-center px-5">
 {lines.map((line, i) => (
 <div
 key={i}
 className="font-display font-black leading-[0.95] text-foreground kitonga-wordmark"
 style={{
 fontSize: lines.length > 2 ? "1.7rem" : "2.1rem",
 letterSpacing: "-0.04em",
 }}
 >
 {line}
 </div>
 ))}
 </div>
 </div>
 </>
 )}

 {/* Footer strip — shown in both modes */}
 <div className="absolute bottom-0 left-0 right-0 bg-white/10 border-t border-white/15 px-3 py-2">
 <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-foreground">
 {client}
 </div>
 <div className="text-xs font-bold text-foreground truncate">{title}</div>
 </div>
 </div>
 );
}
