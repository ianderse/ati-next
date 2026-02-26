import Link from "next/link";
import { getManifest, getDocumentByUrlPath } from "@/lib/content/loader";
import { DocumentPage } from "@/components/DocumentPage";
import type { Metadata } from "next";

const nikayaNames: Record<string, string> = {
  dn: "Digha Nikaya",
  mn: "Majjhima Nikaya",
  sn: "Samyutta Nikaya",
  an: "Anguttara Nikaya",
  kn: "Khuddaka Nikaya",
  vin: "Vinaya Pitaka",
  abhi: "Abhidhamma",
};

const nikayaAbbrevMap: Record<string, string> = {
  dn: "DN",
  mn: "MN",
  sn: "SN",
  an: "AN",
  kn: "KN",
  vin: "Vin",
  abhi: "Abhi",
};

export function generateStaticParams() {
  return Object.keys(nikayaNames).map((nikaya) => ({ nikaya }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ nikaya: string }>;
}): Promise<Metadata> {
  return params.then(({ nikaya }) => ({
    title: nikayaNames[nikaya] || nikaya.toUpperCase(),
  }));
}

export default async function NikayaPage({
  params,
}: {
  params: Promise<{ nikaya: string }>;
}) {
  const { nikaya } = await params;

  // Check if there's an extracted document for this index page
  const doc = getDocumentByUrlPath(`/tipitaka/${nikaya}`);
  if (doc) {
    return <DocumentPage doc={doc} />;
  }

  // Otherwise build a listing page from manifest
  const manifest = getManifest();
  const abbrev = nikayaAbbrevMap[nikaya] || nikaya.toUpperCase();
  const docs = manifest.documents.filter(
    (d) =>
      d.nikayaAbbrev.toUpperCase() === abbrev.toUpperCase() &&
      d.type === "sutta"
  );

  // Group by sub-collection for SN and AN
  const grouped = new Map<string, typeof docs>();
  for (const d of docs) {
    // Extract subcollection from URL (e.g., /tipitaka/sn/sn12/... -> sn12)
    const parts = d.urlPath.split("/");
    const sub = parts.length > 3 ? parts[3] : "other";
    if (!grouped.has(sub)) grouped.set(sub, []);
    grouped.get(sub)!.push(d);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="font-sans text-3xl font-bold mb-2">
        {nikayaNames[nikaya] || nikaya}
      </h1>
      <p className="text-[var(--muted)] mb-8">
        {docs.length} translations available
      </p>

      {Array.from(grouped.entries())
        .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
        .map(([sub, subDocs]) => (
          <div key={sub} className="mb-8">
            {grouped.size > 1 && (
              <h2 className="font-sans text-lg font-semibold mb-3 text-[var(--muted)]">
                {sub}
              </h2>
            )}
            <div className="space-y-2">
              {subDocs
                .sort((a, b) => {
                  const numA = parseInt(a.number) || 0;
                  const numB = parseInt(b.number) || 0;
                  return numA - numB;
                })
                .map((d) => (
                  <div key={d.slug} className="flex gap-3 items-baseline">
                    <span className="font-sans text-sm text-[var(--muted)] w-16 flex-shrink-0">
                      {d.nikayaAbbrev} {d.number}
                    </span>
                    <div>
                      <Link href={d.urlPath} className="font-medium">
                        {d.title}
                      </Link>
                      {d.subtitle && (
                        <span className="text-[var(--muted)]">
                          : {d.subtitle}
                        </span>
                      )}
                      {d.authorShortname && (
                        <span className="text-sm text-[var(--muted)] ml-2">
                          ({d.authorShortname})
                        </span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
    </div>
  );
}
