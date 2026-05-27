"use client";

import { useEffect, useState } from "react";
import { CoverflowSlider, type CoverflowItem } from "@/components/ui/CoverflowSlider";
import { HERO_SLIDES, type HeroSlide } from "@/lib/slides";
import { ADMIN_STORAGE_KEYS, readAdminStore } from "@/lib/adminStore";

function toCoverflowItem(slide: HeroSlide): CoverflowItem {
 return {
 id: slide.id,
 title: slide.title,
 subtitle: slide.subtitle,
 category: slide.category,
 badge: slide.badge,
 image: slide.image,
 background: slide.background,
 caption: slide.caption,
 cta:
 slide.ctaLabel && slide.ctaHref
 ? { label: slide.ctaLabel, href: slide.ctaHref }
 : undefined,
 };
}

/**
 * Image slider that sits UNDERNEATH the hero text as a full-bleed
 * background layer. Reads slides from the admin store on mount so
 * live admin edits are reflected immediately.
 */
export function HeroSlider() {
 const [slides, setSlides] = useState<HeroSlide[]>(HERO_SLIDES);

 useEffect(() => {
 const stored = readAdminStore<HeroSlide[]>(ADMIN_STORAGE_KEYS.slides);
 if (stored && Array.isArray(stored) && stored.length > 0) {
 setSlides(stored);
 }
 }, []);

 const items = slides.map(toCoverflowItem);

 return (
 <div
 aria-label="Featured studio work"
 className="absolute inset-0 z-0"
 >
 <CoverflowSlider
 items={items}
 aspect={0}
 fullBleed
 hideControls
 className="h-full"
 />
 </div>
 );
}
