import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { SITE } from "@/lib/site";
import { readSiteSettings } from "@/lib/site-settings-db";

/**
 * Editorial light-theme footer.
 *
 * - All text uses bold slate-900 weights for an editorial feel.
 * - Only two social icons are surfaced — WhatsApp and TikTok — both
 *   wired to URLs the admin can edit from /admin/settings without a
 *   redeploy. URLs are loaded from `data/site-settings.json` via
 *   `readSiteSettings()` on the server.
 */
export async function Footer() {
  const settings = await readSiteSettings();

  return (
    <footer
      id="contact"
      className="relative mt-16 border-t border-card-border bg-card text-slate-900"
    >
      <div className="container-narrow py-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <Link
            href="/"
            className="flex items-center gap-3"
            aria-label="KITONGA-ICT — home"
          >
            <Logo />
            <span className="hidden sm:inline-block text-[12px] font-bold text-slate-900">
              · {SITE.tagline}
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <SocialLink href={settings.social.whatsapp} label="Chat on WhatsApp">
              <WhatsAppIcon />
            </SocialLink>
            <SocialLink href={settings.social.tiktok} label="Follow on TikTok">
              <TikTokIcon />
            </SocialLink>
            <a
              href={`mailto:${SITE.contactEmail}`}
              className="hidden sm:inline-flex items-center rounded-full border border-card-border bg-card px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-900 hover:text-primary hover:border-primary transition-colors"
            >
              Email
            </a>
          </div>
        </div>

        <div className="mt-3 flex flex-col gap-1 border-t border-card-border pt-3 text-[12px] font-bold text-slate-900 md:flex-row md:items-center md:justify-between">
          <span>
            © {new Date().getFullYear()}{" "}
            <span className="font-black text-slate-900">{SITE.name}</span> · All rights reserved
          </span>
          <span className="font-bold text-slate-900">{SITE.location}</span>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="grid h-10 w-10 place-items-center rounded-xl border border-card-border bg-card text-slate-900 transition hover:border-primary hover:text-primary"
    >
      {children}
    </a>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 32 32"
      fill="currentColor"
      aria-hidden
    >
      <path d="M16.001 0C7.165 0 0 7.165 0 16c0 2.832.74 5.6 2.146 8.04L0 32l8.18-2.135A15.953 15.953 0 0 0 16 32c8.835 0 16-7.164 16-16S24.836 0 16.001 0Zm0 29.27a13.247 13.247 0 0 1-6.748-1.85l-.483-.288-4.853 1.267 1.292-4.74-.314-.503A13.234 13.234 0 0 1 2.731 16C2.731 8.682 8.682 2.731 16 2.731c7.319 0 13.27 5.951 13.27 13.269 0 7.318-5.951 13.27-13.269 13.27Zm7.286-9.93c-.4-.2-2.366-1.166-2.733-1.299-.367-.133-.633-.2-.9.2-.265.4-1.033 1.299-1.266 1.566-.234.266-.467.3-.867.1-.4-.2-1.687-.621-3.213-1.984-1.187-1.06-1.99-2.367-2.224-2.767-.233-.4-.025-.616.176-.815.18-.18.4-.467.6-.7.2-.234.267-.4.4-.667.133-.267.067-.5-.034-.7-.1-.2-.9-2.166-1.232-2.967-.323-.776-.652-.671-.9-.683-.234-.012-.5-.014-.766-.014a1.476 1.476 0 0 0-1.067.5c-.367.4-1.4 1.367-1.4 3.333 0 1.967 1.434 3.866 1.633 4.133.2.267 2.823 4.31 6.84 6.044.955.412 1.7.658 2.281.842.957.305 1.829.262 2.518.16.768-.115 2.366-.967 2.7-1.9.333-.933.333-1.733.234-1.9-.1-.166-.367-.266-.767-.466Z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743 2.895 2.895 0 0 1-.945-2.234 2.872 2.872 0 0 1 1.736-2.66 2.86 2.86 0 0 1 2.063-.061V8.987a6.341 6.341 0 0 0-7.357 6.197 6.336 6.336 0 0 0 10.857 4.473 6.342 6.342 0 0 0 1.856-4.473V9.539a8.183 8.183 0 0 0 4.773 1.527V7.628a4.795 4.795 0 0 1-.567-.94Z" />
    </svg>
  );
}
