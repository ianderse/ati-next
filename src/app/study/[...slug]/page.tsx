import { notFound } from "next/navigation";
import { getManifest, getDocumentByUrlPath } from "@/lib/content/loader";
import { DocumentPage, generateDocumentMetadata } from "@/components/DocumentPage";
import type { Metadata } from "next";

export function generateStaticParams() {
  const manifest = getManifest();
  const params: { slug: string[] }[] = [];

  for (const doc of manifest.documents) {
    if (!doc.urlPath.startsWith("/study/")) continue;
    const slug = doc.urlPath.replace("/study/", "").split("/");
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
  const urlPath = `/study/${slug.join("/")}`;
  const doc = getDocumentByUrlPath(urlPath);
  if (!doc) return { title: "Not Found" };
  return generateDocumentMetadata(doc);
}

export default async function StudyPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const urlPath = `/study/${slug.join("/")}`;
  const doc = getDocumentByUrlPath(urlPath);

  if (!doc) notFound();

  return <DocumentPage doc={doc} />;
}
