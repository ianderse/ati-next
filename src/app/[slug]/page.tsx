import { notFound } from "next/navigation";
import { getManifest, getDocumentByUrlPath } from "@/lib/content/loader";
import { DocumentPage, generateDocumentMetadata } from "@/components/DocumentPage";
import type { Metadata } from "next";

export function generateStaticParams() {
  const manifest = getManifest();
  const params: { slug: string }[] = [];

  for (const doc of manifest.documents) {
    // Only root-level pages (single path segment)
    const path = doc.urlPath.replace(/^\//, "");
    if (!path.includes("/") && path.length > 0) {
      params.push({ slug: path });
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDocumentByUrlPath(`/${slug}`);
  if (!doc) return { title: "Not Found" };
  return generateDocumentMetadata(doc);
}

export default async function RootPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = getDocumentByUrlPath(`/${slug}`);

  if (!doc) notFound();

  return <DocumentPage doc={doc} />;
}
