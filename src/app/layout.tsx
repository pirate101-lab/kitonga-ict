import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { FloatingActions } from "@/components/ui/FloatingActions";
import { Toaster } from "@/components/ui/Toaster";
import { SITE } from "@/lib/site";

const jakarta = Plus_Jakarta_Sans({
 variable: "--font-jakarta",
 subsets: ["latin"],
 display: "swap",
});

const fraunces = Fraunces({
 variable: "--font-fraunces",
 subsets: ["latin"],
 display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
 variable: "--font-mono-jet",
 subsets: ["latin"],
 display: "swap",
});

export const metadata: Metadata = {
 metadataBase: new URL(SITE.url),
 title: {
 default: `${SITE.name} — ${SITE.tagline}`,
 template: `%s · ${SITE.name}`,
 },
 description: SITE.description,
 keywords: [
 "graphic design",
 "Photoshop",
 "branding",
 "posters",
 "business cards",
 "banners",
 "CV design",
 "design studio",
 "KITONGA-ICT",
 "ICT partner",
 "digital agency",
 ],
 authors: [{ name: SITE.name }],
 openGraph: {
 title: `${SITE.name} — ${SITE.tagline}`,
 description: SITE.description,
 url: SITE.url,
 siteName: SITE.name,
 type: "website",
 locale: "en_KE",
 },
 twitter: {
 card: "summary_large_image",
 title: `${SITE.name} — ${SITE.tagline}`,
 description: SITE.description,
 },
 icons: {
 icon: [
 { url: "/brand/favicon-32.png", sizes: "32x32", type: "image/png" },
 { url: "/brand/favicon-192.png", sizes: "192x192", type: "image/png" },
 { url: "/brand/favicon-512.png", sizes: "512x512", type: "image/png" },
 ],
 shortcut: "/brand/favicon.ico",
 apple: "/brand/favicon-192.png",
 },
 manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
 themeColor: "#eef2fe",
 width: "device-width",
 initialScale: 1,
 maximumScale: 5,
 viewportFit: "cover",
};

export default function RootLayout({
 children,
}: Readonly<{
 children: React.ReactNode;
}>) {
 return (
 <html
 lang="en"
 data-theme="light"
 suppressHydrationWarning
 className={`${jakarta.variable} ${fraunces.variable} ${jetbrainsMono.variable} h-full antialiased`}
 >
 <head>
 {/* Force the editorial light theme regardless of prior localStorage
 or OS preference. ThemeProvider logic remains intact for future
 expansion, but the rendered surface is always the light palette. */}
 <script
 dangerouslySetInnerHTML={{
 __html: `(function(){try{document.documentElement.dataset.theme='light';document.documentElement.style.colorScheme='light';localStorage.setItem('kitonga.theme','light');}catch(e){}})();`,
 }}
 />
 </head>
 <body className="min-h-full flex flex-col bg-background text-foreground">
 <ThemeProvider>
 <Navbar />
 <main className="flex-1">{children}</main>
 <Footer />
 <FloatingActions />
 <Toaster />
 </ThemeProvider>
 </body>
 </html>
 );
}
