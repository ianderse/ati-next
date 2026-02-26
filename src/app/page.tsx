import Link from "next/link";
import { getManifest } from "@/lib/content/loader";
import { ClassicHome } from "@/components/ClassicHome";
import { ModernHome } from "@/components/ModernHome";

export default function HomePage() {
  const manifest = getManifest();
  const suttaCount = manifest.documents.filter((d) => d.type === "sutta").length;
  const articleCount = manifest.documents.filter(
    (d) => d.type === "article" || d.type === "book"
  ).length;

  return (
    <>
      <ClassicHome suttaCount={suttaCount} articleCount={articleCount} />
      <ModernHome suttaCount={suttaCount} articleCount={articleCount} />
    </>
  );
}
