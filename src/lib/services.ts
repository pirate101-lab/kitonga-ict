import {
  FileText,
  CreditCard,
  Shirt,
  Image as ImageIcon,
  Globe,
  Printer,
  type LucideIcon,
} from "lucide-react";

export type Service = {
  id: string;
  title: string;
  category: string;
  short: string;
  description: string;
  bullets: string[];
  startingPrice: string;
  turnaround: string;
  icon: LucideIcon;
};

export const SERVICES: Service[] = [
  // ── Design & Print ──────────────────────────────────────────────
  {
    id: "flyers",
    title: "Flyer Design",
    category: "Design & Print",
    short: "High-impact digital and print-ready promotional flyers.",
    description:
      "Event flyers, product launches, promotions — designed for both screen and print. CMYK-ready at 300 DPI with bleed.",
    bullets: [
      "Digital and print-ready versions",
      "300 DPI CMYK with bleed & trim",
      "Social format variants included",
    ],
    startingPrice: "from KSh 800",
    turnaround: "12 – 24 hrs",
    icon: Printer,
  },
  {
    id: "business-cards",
    title: "Business Cards",
    category: "Design & Print",
    short: "Professional, corporate-grade business card design and formatting.",
    description:
      "Front + back layout. Print-ready PDF delivered alongside editable source files. Up to three colorway variants.",
    bullets: [
      "Front + back layout",
      "3.5 × 2 in with bleed",
      "Up to 3 colorway variants",
    ],
    startingPrice: "from KSh 500",
    turnaround: "24 hrs",
    icon: CreditCard,
  },
  {
    id: "tshirts",
    title: "T-Shirt Printing",
    category: "Design & Print",
    short: "Custom apparel printing and brand mockups.",
    description:
      "Screen-print-ready artwork and photorealistic mockups. Sizes, placements, and colour separations all included.",
    bullets: [
      "Screen-print-ready artwork",
      "Photorealistic apparel mockups",
      "Colour separations included",
    ],
    startingPrice: "from KSh 600",
    turnaround: "24 – 48 hrs",
    icon: Shirt,
  },
  // ── Document Formatting ─────────────────────────────────────────
  {
    id: "cvs",
    title: "CVs & Resumes",
    category: "Document Formatting",
    short: "ATS-optimised formatting for modern job applications.",
    description:
      "Clean typographic hierarchy, ATS-safe structure, and a design-forward layout variant. Delivered as PDF + editable Word.",
    bullets: [
      "ATS-optimised base layout",
      "Cover letter on request",
      "PDF + .docx delivered",
    ],
    startingPrice: "from KSh 500",
    turnaround: "12 – 24 hrs",
    icon: FileText,
  },
  // ── Image Manipulation ──────────────────────────────────────────
  {
    id: "photoshop",
    title: "Photoshop Editing",
    category: "Image Manipulation",
    short: "Precision retouching, background removal, and photo manipulation.",
    description:
      "Skin retouching, background swaps, colour grading, compositing, and product photo cleanup. Delivered in 24 hrs.",
    bullets: [
      "Background removal & replacement",
      "Colour grading & retouching",
      "Compositing & object removal",
    ],
    startingPrice: "from KSh 300",
    turnaround: "12 – 24 hrs",
    icon: ImageIcon,
  },
  // ── Cyber Services ──────────────────────────────────────────────
  {
    id: "cyber",
    title: "Cyber Services",
    category: "Cyber Services",
    short: "KRA returns, eCitizen, online applications, and digital portal tasks.",
    description:
      "Efficient handling of KRA iTax returns, eCitizen services, NHIF/NSSF, HELB, driving licence renewals, and general digital portal assistance.",
    bullets: [
      "KRA iTax & eCitizen filings",
      "NHIF, NSSF, HELB applications",
      "Driving licence & portal tasks",
    ],
    startingPrice: "from KSh 200",
    turnaround: "Same day",
    icon: Globe,
  },
];

export const SERVICE_CATEGORIES = [
  "Design & Print",
  "Document Formatting",
  "Image Manipulation",
  "Cyber Services",
] as const;

export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number];

export const VALUE_PROPS: {
  title: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    title: "Fast, on purpose",
    description:
      "Brief in via WhatsApp, work starts within the hour. Most jobs ship inside 24 hours.",
    icon: Printer,
  },
  {
    title: "One price, no surprises",
    description:
      "You get a clear quote before any work starts. No scope creep. No hidden charges.",
    icon: CreditCard,
  },
  {
    title: "Ready to use on arrival",
    description:
      "Print-ready specs, web exports, source files. Nothing leaves the studio half-done.",
    icon: FileText,
  },
];
