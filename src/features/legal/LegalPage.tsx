import type { LegalPageContent } from "./legalPages";

export function LegalPage({ content }: { content: LegalPageContent }) {
  return (
    <article className="legal-page stack-lg">
      <header className="page-heading"><p className="eyebrow">Legal information</p><h2>{content.title}</h2><p>{content.summary}</p><p className="muted">Last updated: {content.lastUpdated}</p></header>
      {content.sections.map((section) => <section className="content-panel" key={section.heading}><h3>{section.heading}</h3>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>)}
    </article>
  );
}
