import type { ATIDocument } from "@/lib/content/types";
import { Breadcrumbs } from "./Breadcrumbs";
import { SuttaHeader } from "./SuttaHeader";
import { SuttaContent } from "./SuttaContent";
import { Attribution } from "./Attribution";
import type { Metadata } from "next";

const licenseUrls: Record<string, string> = {
  "CC-BY-NC": "https://creativecommons.org/licenses/by-nc/4.0/",
  "CC-BY": "https://creativecommons.org/licenses/by/4.0/",
};

function buildJsonLd(doc: ATIDocument) {
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: doc.subtitle ? `${doc.title}: ${doc.subtitle}` : doc.title,
    url: `https://accesstoinsight.org${doc.urlPath}`,
    inLanguage: "en",
  };

  if (doc.author) {
    jsonLd.author = { "@type": "Person", name: doc.author };
  }
  if (doc.type === "sutta") {
    jsonLd.translator = { "@type": "Person", name: doc.author };
  }
  if (doc.copyrightYear) {
    jsonLd.datePublished = doc.copyrightYear;
  }
  if (doc.summary) {
    jsonLd.description = doc.summary.replace(/<[^>]*>/g, "").slice(0, 300);
  }
  if (licenseUrls[doc.license]) {
    jsonLd.license = licenseUrls[doc.license];
  }
  if (doc.nikaya) {
    jsonLd.isPartOf = {
      "@type": "CreativeWork",
      name: `${doc.nikaya} Nikaya`,
    };
  }

  return jsonLd;
}

export function DocumentPage({ doc }: { doc: ATIDocument }) {
  const jsonLd = buildJsonLd(doc);

  return (
    <article
      className="max-w-[42rem] mx-auto px-4 sm:px-6 py-8 md:py-12"
      data-pagefind-meta={`nikaya:${doc.nikayaAbbrev || ""}, author:${doc.authorShortname || ""}, type:${doc.type}`}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumbs items={doc.breadcrumbs} />
      <SuttaHeader doc={doc} />
      <SuttaContent html={doc.contentHtml} />
      <Attribution doc={doc} />
    </article>
  );
}

export function generateDocumentMetadata(doc: ATIDocument): Metadata {
  const title = doc.subtitle
    ? `${doc.title}: ${doc.subtitle}`
    : doc.title;

  return {
    title,
    description: doc.summary
      ? doc.summary.replace(/<[^>]*>/g, "").slice(0, 200)
      : `${title} — ${doc.author || "Access to Insight"}`,
    openGraph: {
      title,
      description: doc.summary
        ? doc.summary.replace(/<[^>]*>/g, "").slice(0, 200)
        : undefined,
      type: "article",
    },
  };
}
