import Link from "next/link";
import Image from "next/image";
import { SITE, buildWhatsAppUrl } from "@/lib/site";
import { readSiteSettings } from "@/lib/site-settings-db";

/**
 * Footer — ultra-minimal single-row.
 * Logo image + wordmark · contact · social. Min height on all devices.
 */
export async function Footer() {
  const settings = await readSiteSettings();

  const whatsappHref = buildWhatsAppUrl(
    `Hello KITONGA-ICT! 👋\n\nI'd like to get in touch. — Sent from kitongaict.tech`,
  );

  return (
    <footer id="contact" className="bg-white border-t border-gray-200/30">
      <div className="container-narrow">

        {/* Main row */}
        <div className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">

          {/* Logo image + wordmark */}
          <Link href="/" aria-label="KITONGA-ICT home" className="flex items-center gap-2 shrink-0">
            <Image
              src="/brand/logo-round.png"
              alt=""
              width={28}
              height={28}
              quality={60}
              sizes="32px"
              className="rounded-full object-cover"
              style={{ width: 28, height: 28 }}
            />
            <div>
              <span className="block text-[12.5px] font-black text-[#0a0a0a] uppercase tracking-tight leading-none">
                KITONGA-ICT
              </span>
              <span className="block text-[10.5px] text-[#444] mt-0.5 leading-none">
                {SITE.tagline}
              </span>
            </div>
          </Link>

          {/* Contact details */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-[#222]">
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="hover:text-[#0067b8] transition-colors">
              {SITE.whatsappDisplay}
            </a>
            <a href={`mailto:${SITE.contactEmail}`} className="hover:text-[#0067b8] transition-colors">
              {SITE.contactEmail}
            </a>
            <span className="hidden sm:inline">{SITE.location}</span>
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-2 shrink-0">
            <SocialLink href={settings.social.whatsapp} label="WhatsApp">
              <WhatsAppIcon />
            </SocialLink>
            <SocialLink href={settings.social.tiktok} label="TikTok">
              <TikTokIcon />
            </SocialLink>
          </div>
        </div>

        {/* Legal line */}
        <div className="border-t border-[#ececec] py-3 flex items-center justify-between gap-3 flex-wrap">
          <span className="text-[11px] text-[#444]">
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </span>
          <nav className="flex items-center gap-4" aria-label="Footer navigation">
            {[
              { label: "Services", href: "/services" },
              { label: "Portfolio", href: "/portfolio" },
              { label: "About", href: "/about" },
              { label: "Order", href: "/order" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-[11px] text-[#444] hover:text-[#0067b8] transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="grid h-8 w-8 place-items-center rounded-lg border-2 border-black text-[#333] hover:text-[#0067b8] hover:border-[#0067b8] transition-colors"
    >
      {children}
    </a>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 32 32" fill="currentColor" aria-hidden>
      <path d="M16.001 0C7.165 0 0 7.165 0 16c0 2.832.74 5.6 2.146 8.04L0 32l8.18-2.135A15.953 15.953 0 0 0 16 32c8.835 0 16-7.164 16-16S24.836 0 16.001 0Zm0 29.27a13.247 13.247 0 0 1-6.748-1.85l-.483-.288-4.853 1.267 1.292-4.74-.314-.503A13.234 13.234 0 0 1 2.731 16C2.731 8.682 8.682 2.731 16 2.731c7.319 0 13.27 5.951 13.27 13.269 0 7.318-5.951 13.27-13.269 13.27Zm7.286-9.93c-.4-.2-2.366-1.166-2.733-1.299-.367-.133-.633-.2-.9.2-.265.4-1.033 1.299-1.266 1.566-.234.266-.467.3-.867.1-.4-.2-1.687-.621-3.213-1.984-1.187-1.06-1.99-2.367-2.224-2.767-.233-.4-.025-.616.176-.815.18-.18.4-.467.6-.7.2-.234.267-.4.4-.667.133-.267.067-.5-.034-.7-.1-.2-.9-2.166-1.232-2.967-.323-.776-.652-.671-.9-.683-.234-.012-.5-.014-.766-.014a1.476 1.476 0 0 0-1.067.5c-.367.4-1.4 1.367-1.4 3.333 0 1.967 1.434 3.866 1.633 4.133.2.267 2.823 4.31 6.84 6.044.955.412 1.7.658 2.281.842.957.305 1.829.262 2.518.16.768-.115 2.366-.967 2.7-1.9.333-.933.333-1.733.234-1.9-.1-.166-.367-.266-.767-.466Z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743 2.895 2.895 0 0 1-.945-2.234 2.872 2.872 0 0 1 1.736-2.66 2.86 2.86 0 0 1 2.063-.061V8.987a6.341 6.341 0 0 0-7.357 6.197 6.336 6.336 0 0 0 10.857 4.473 6.342 6.342 0 0 0 1.856-4.473V9.539a8.183 8.183 0 0 0 4.773 1.527V7.628a4.795 4.795 0 0 1-.567-.94Z" />
    </svg>
  );
}
