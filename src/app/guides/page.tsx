import { getDocumentByUrlPath } from "@/lib/content/loader";
import { DocumentPage } from "@/components/DocumentPage";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Path to Freedom",
};

export default function GuidesPage() {
  const doc = getDocumentByUrlPath("/guides");
  if (!doc) notFound();

  return <DocumentPage doc={doc} />;
}
