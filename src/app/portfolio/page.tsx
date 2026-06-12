import type { Metadata } from "next";
import { Portfolio } from "@/components/sections/Portfolio";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Selected work from KITONGA-ICT — posters, business cards, banners, resumes, branding and editorial photo retouching.",
};

export default function PortfolioPage() {
  return (
    <>
      <Portfolio />
    </>
  );
}
