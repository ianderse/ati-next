import { notFound } from "next/navigation";
import { getDocumentByUrlPath } from "@/lib/content/loader";
import { DocumentPage, generateDocumentMetadata } from "@/components/DocumentPage";
import type { Metadata } from "next";

const indexTypes = [
  "sutta",
  "subject",
  "similes",
  "author",
  "names",
  "number",
  "title",
];

const indexLabels: Record<string, string> = {
  sutta: "Index of Suttas",
  subject: "Subject Index",
  similes: "Index of Similes",
  author: "Index by Author",
  names: "Index of Proper Names",
  number: "Index by Number",
  title: "Index by Title",
};

export function generateStaticParams() {
  return indexTypes.map((type) => ({ type }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>;
}): Promise<Metadata> {
  const { type } = await params;
  return { title: indexLabels[type] || `Index: ${type}` };
}

export default async function IndexPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;

  if (!indexTypes.includes(type)) notFound();

  // Try to find the extracted index document
  // Original paths: index-sutta.html, index-subject.html, etc.
  const urlPath = `/index-${type}`;
  const doc = getDocumentByUrlPath(urlPath);

  if (doc) {
    return <DocumentPage doc={doc} />;
  }

  // Fallback: simple page
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="font-sans text-3xl font-bold mb-4">
        {indexLabels[type]}
      </h1>
      <p className="text-[var(--muted)]">
        This index is being prepared.
      </p>
    </div>
  );
}
