import Link from "next/link";
import AnimatedSection from "@/components/shared/AnimatedSection";

export type BreadcrumbItem = { label: string; href: string };

export default function PageHero({
  eyebrow,
  title,
  text,
  path,
}: {
  eyebrow: string;
  title: string;
  text: string;
  path?: BreadcrumbItem[];
}) {
  return (
    <header className="page-hero motif">
      <AnimatedSection className="container page-hero-inner">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          {path
            ? path.map((item) => (
                <span key={item.href}>
                  <span className="breadcrumb-sep">&gt;</span>
                  <Link href={item.href}>{item.label}</Link>
                </span>
              ))
            : <span><span className="breadcrumb-sep">&gt;</span> {eyebrow}</span>}
        </nav>
        <h1>{title}</h1>
        <p>{text}</p>
      </AnimatedSection>
    </header>
  );
}
