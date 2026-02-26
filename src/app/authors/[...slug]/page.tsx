import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getManifest,
  getDocumentByUrlPath,
  getDocumentsByAuthor,
} from "@/lib/content/loader";
import { DocumentPage, generateDocumentMetadata } from "@/components/DocumentPage";
import type { Metadata } from "next";

export function generateStaticParams() {
  const manifest = getManifest();
  const params: { slug: string[] }[] = [];

  for (const doc of manifest.documents) {
    if (!doc.urlPath.startsWith("/authors/")) continue;
    const slug = doc.urlPath.replace("/authors/", "").split("/");
    params.push({ slug });
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const urlPath = `/authors/${slug.join("/")}`;
  const doc = getDocumentByUrlPath(urlPath);
  if (doc) return generateDocumentMetadata(doc);

  // Author listing page
  return { title: slug[0] };
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const urlPath = `/authors/${slug.join("/")}`;

  // Try to find exact document
  const doc = getDocumentByUrlPath(urlPath);
  if (doc) {
    return <DocumentPage doc={doc} />;
  }

  // If single segment, show author listing
  if (slug.length === 1) {
    const authorDocs = getDocumentsByAuthor(slug[0]);
    if (authorDocs.length === 0) notFound();

    const authorName = authorDocs[0].author;

    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="font-sans text-3xl font-bold mb-2">{authorName}</h1>
        <p className="text-[var(--muted)] mb-8">
          {authorDocs.length} texts available
        </p>

        <div className="space-y-2">
          {authorDocs
            .sort((a, b) => a.title.localeCompare(b.title))
            .map((d) => (
              <div key={d.slug}>
                <Link href={d.urlPath} className="font-medium">
                  {d.title}
                </Link>
                {d.subtitle && (
                  <span className="text-[var(--muted)]">: {d.subtitle}</span>
                )}
                {d.nikayaAbbrev && (
                  <span className="ml-2 badge">{d.nikayaAbbrev} {d.number}</span>
                )}
              </div>
            ))}
        </div>
      </div>
    );
  }

  notFound();
}
