import { getDocumentByUrlPath } from "@/lib/content/loader";
import { DocumentPage, generateDocumentMetadata } from "@/components/DocumentPage";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export function generateMetadata(): Metadata {
  const doc = getDocumentByUrlPath("/glossary");
  if (!doc) return { title: "Glossary" };
  return generateDocumentMetadata(doc);
}

export default function GlossaryPage() {
  const doc = getDocumentByUrlPath("/glossary");
  if (!doc) notFound();

  return <DocumentPage doc={doc} />;
}
