import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, Clock } from "lucide-react";
import { ARTICLES, getArticleBySlug } from "@/lib/articles";

type Params = { params: Promise<{ slug: string }> };

/**
 * Pre-render the static set of insight slugs at build time. New
 * articles added to `lib/articles.ts` are picked up automatically
 * whenever the site is rebuilt.
 */
export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Article not found" };
  return {
    title: `${article.title} · KITONGA-ICT`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
    },
  };
}

export default async function InsightPage({ params }: Params) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  return (
    <article className="relative bg-background pt-10 pb-20 md:pt-14">
      <div className="container-narrow max-w-3xl">
        <Link
          href="/insights"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
        >
          <ArrowLeft size={14} aria-hidden /> All articles
        </Link>

        <header className="mt-6 flex flex-col gap-3">
          <span className="inline-flex w-fit items-center rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
            {article.category}
          </span>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight text-foreground">
            {article.title}
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            {article.excerpt}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-card-border pt-4 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{article.author}</span>
            <span aria-hidden>·</span>
            <span className="font-mono text-[11px] uppercase tracking-[0.16em]">
              {article.date}
            </span>
            <span aria-hidden>·</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock size={12} aria-hidden /> {article.readTime}
            </span>
          </div>
        </header>

        <div className="mt-10 flex flex-col gap-6">
          {article.paragraphs.map((p, i) => (
            <p
              key={i}
              className="text-base sm:text-[17px] leading-[1.75] text-foreground"
            >
              {p}
            </p>
          ))}
        </div>

        <footer className="mt-12 flex flex-col gap-3 rounded-2xl border border-card-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-lg font-bold text-foreground">
              Brief us on your next project.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              We reply on WhatsApp inside the hour during studio hours.
            </p>
          </div>
          <Link
            href="/order"
            className="btn-indigo inline-flex items-center gap-2 px-4 py-2.5 text-sm"
          >
            <BookOpen size={14} aria-hidden /> Start a Fast Order
          </Link>
        </footer>
      </div>
    </article>
  );
}
