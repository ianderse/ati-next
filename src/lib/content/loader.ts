import fs from "fs";
import path from "path";
import type {
  ATIDocument,
  DocumentManifest,
  ManifestEntry,
} from "./types";

const DATA_DIR = path.join(process.cwd(), "src/data");
const DOCS_DIR = path.join(DATA_DIR, "documents");

let manifestCache: DocumentManifest | null = null;

export function getManifest(): DocumentManifest {
  if (manifestCache) return manifestCache;
  const raw = fs.readFileSync(path.join(DATA_DIR, "manifest.json"), "utf-8");
  manifestCache = JSON.parse(raw) as DocumentManifest;
  return manifestCache;
}

export function getDocument(slug: string): ATIDocument | null {
  const filePath = path.join(DOCS_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as ATIDocument;
}

export function getDocumentByUrlPath(urlPath: string): ATIDocument | null {
  const manifest = getManifest();
  const entry = manifest.documents.find((d) => d.urlPath === urlPath);
  if (!entry) return null;
  return getDocument(entry.slug);
}

export function getDocumentsBySection(section: string): ManifestEntry[] {
  const manifest = getManifest();
  return manifest.documents.filter((d) => d.section === section);
}

export function getDocumentsByNikaya(nikayaAbbrev: string): ManifestEntry[] {
  const manifest = getManifest();
  return manifest.documents.filter(
    (d) => d.nikayaAbbrev.toUpperCase() === nikayaAbbrev.toUpperCase()
  );
}

export function getDocumentsByAuthor(authorShortname: string): ManifestEntry[] {
  const manifest = getManifest();
  return manifest.documents.filter(
    (d) =>
      d.authorShortname.toLowerCase() === authorShortname.toLowerCase()
  );
}

export function getDocumentsByType(type: string): ManifestEntry[] {
  const manifest = getManifest();
  return manifest.documents.filter((d) => d.type === type);
}

export function getAllUrlPaths(): string[] {
  const manifest = getManifest();
  return manifest.documents.map((d) => d.urlPath);
}

export function getUniqueAuthors(): { name: string; shortname: string; count: number }[] {
  const manifest = getManifest();
  const authorMap = new Map<string, { name: string; count: number }>();

  for (const doc of manifest.documents) {
    if (!doc.authorShortname) continue;
    const key = doc.authorShortname.toLowerCase();
    const existing = authorMap.get(key);
    if (existing) {
      existing.count++;
    } else {
      authorMap.set(key, { name: doc.author, count: 1 });
    }
  }

  return Array.from(authorMap.entries())
    .map(([shortname, { name, count }]) => ({ name, shortname, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getSuttaList(): ManifestEntry[] {
  const manifest = getManifest();
  return manifest.documents.filter((d) => d.type === "sutta");
}

export function getArticleList(): ManifestEntry[] {
  const manifest = getManifest();
  return manifest.documents.filter(
    (d) => d.type === "article" || d.type === "book" || d.type === "excerpt"
  );
}
