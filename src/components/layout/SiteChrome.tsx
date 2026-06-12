"use client";

import { usePathname } from "next/navigation";
import { FloatingActions } from "@/components/ui/FloatingActions";

interface SiteChromeProps {
  navbar: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}

/**
 * SiteChrome — pathname-aware wrapper.
 * On /admin/* and /studio, renders children only (no Navbar/Footer).
 * On all other routes, wraps with Navbar + Footer + FloatingActions.
 */
export function SiteChrome({ navbar, footer, children }: SiteChromeProps) {
  const pathname = usePathname();
  const isAdmin =
    pathname.startsWith("/admin") || pathname === "/studio";

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      {navbar}
      {children}
      {footer}
      <FloatingActions />
    </>
  );
}
