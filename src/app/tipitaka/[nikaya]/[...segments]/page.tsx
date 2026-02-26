import { notFound } from "next/navigation";
import { getManifest, getDocumentByUrlPath } from "@/lib/content/loader";
import { DocumentPage, generateDocumentMetadata } from "@/components/DocumentPage";
import type { Metadata } from "next";

export function generateStaticParams() {
  const manifest = getManifest();
  const params: { nikaya: string; segments: string[] }[] = [];

  for (const doc of manifest.documents) {
    if (!doc.urlPath.startsWith("/tipitaka/")) continue;
    const parts = doc.urlPath.replace("/tipitaka/", "").split("/");
    if (parts.length < 2) continue;
    const nikaya = parts[0];
    const segments = parts.slice(1);
    params.push({ nikaya, segments });
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ nikaya: string; segments: string[] }>;
}): Promise<Metadata> {
  const { nikaya, segments } = await params;
  const urlPath = `/tipitaka/${nikaya}/${segments.join("/")}`;
  const doc = getDocumentByUrlPath(urlPath);
  if (!doc) return { title: "Not Found" };
  return generateDocumentMetadata(doc);
}

export default async function SuttaPage({
  params,
}: {
  params: Promise<{ nikaya: string; segments: string[] }>;
}) {
  const { nikaya, segments } = await params;
  const urlPath = `/tipitaka/${nikaya}/${segments.join("/")}`;
  const doc = getDocumentByUrlPath(urlPath);

  if (!doc) notFound();

  return <DocumentPage doc={doc} />;
}
