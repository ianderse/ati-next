export type DocumentType =
  | "sutta"
  | "article"
  | "book"
  | "excerpt"
  | "index"
  | "guide"
  | "glossary"
  | "unknown";

export type LicenseType =
  | "CC-BY-NC"
  | "CC-BY"
  | "PUBLIC_DOMAIN"
  | "FREEWARE"
  | "©"
  | "UNKNOWN";

export type Nikaya =
  | "Digha"
  | "Majjhima"
  | "Samyutta"
  | "Anguttara"
  | "Khuddaka"
  | "Vinaya"
  | "Abhidhamma"
  | "";

export interface ATIDocument {
  // Identity
  slug: string;
  originalPath: string;
  urlPath: string;
  type: DocumentType;

  // Titles
  title: string;
  subtitle: string;
  subtitle2: string;
  pageTitle: string;

  // Authorship
  author: string;
  authorShortname: string;
  authorAltname: string;
  author2: string;
  translator: string;

  // Classification
  nikaya: Nikaya;
  nikayaAbbrev: string;
  number: string;
  ptsId: string;
  tipitakaBook: string;
  tipitakaBookAbbrev: string;

  // Content
  contentHtml: string;
  summary: string;
  extent: string;

  // Licensing
  license: LicenseType;
  copyrightOwner: string;
  copyrightYear: string;
  derivedLicenseHtml: string;
  derivedLicenseImage: string;

  // Cross-references
  altTranslations: AltTranslation[];
  seeAlso: string[];
  altFormats: AltFormat[];

  // Metadata
  atiYear: string;
  source: string;
  editorsNote: string;
  suttaNote: string;

  // Computed
  breadcrumbs: Breadcrumb[];
  section: string;
}

export interface AltTranslation {
  path: string;
  translator: string;
}

export interface AltFormat {
  type: "pdf" | "audio" | "zip" | "print" | string;
  url: string;
  label: string;
}

export interface Breadcrumb {
  label: string;
  href: string;
}

export interface DocumentManifest {
  documents: ManifestEntry[];
  totalCount: number;
  generatedAt: string;
}

export interface ManifestEntry {
  slug: string;
  originalPath: string;
  urlPath: string;
  type: DocumentType;
  title: string;
  subtitle: string;
  author: string;
  authorShortname: string;
  nikaya: Nikaya;
  nikayaAbbrev: string;
  number: string;
  ptsId: string;
  license: LicenseType;
  extent: string;
  summary: string;
  section: string;
}

export interface RedirectMap {
  [oldPath: string]: string;
}
