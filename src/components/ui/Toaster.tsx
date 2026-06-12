"use client";

import { Toaster as SonnerToaster } from "sonner";

/**
 * Light-theme sonner Toaster wrapper.
 * Used by the admin Media Manager and other admin flows for success /
 * failure notifications. No drop-shadows; the toast surface is a plain
 * white card with a slate hairline.
 */
export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        style: {
          background: "hsl(0 0% 100%)",
          color: "hsl(240 16% 10%)",
          border: "1px solid hsl(230 30% 90%)",
          borderRadius: "0.875rem",
          boxShadow: "none",
          fontWeight: 500,
        },
        className: "kitonga-toast",
      }}
    />
  );
}
