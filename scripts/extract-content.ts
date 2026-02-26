import * as fs from "fs";
import * as path from "path";
import * as cheerio from "cheerio";
import type {
  ATIDocument,
  AltTranslation,
  Breadcrumb,
  DocumentManifest,
  DocumentType,
  LicenseType,
  ManifestEntry,
  Nikaya,
  RedirectMap,
} from "../src/lib/content/types";

const SOURCE_DIR = path.resolve(__dirname, "../../AccessToInsight");
const OUTPUT_DIR = path.resolve(__dirname, "../src/data/documents");
const DATA_DIR = path.resolve(__dirname, "../src/data");

// --- Metadata parsing ---

function parseMetadataBlock(html: string): Record<string, string> {
  const match = html.match(
    /<!-- Begin ATIDoc metadata dump:\s*([\s\S]*?)End ATIDoc metadata dump\. -->/
  );
  if (!match) return {};

  const block = match[1];
  const metadata: Record<string, string> = {};
  const lines = block.split("\n");

  let currentKey = "";
  let currentValue = "";
  let inArrayValue = false;

  for (const line of lines) {
    const keyMatch = line.match(/^\[([A-Z_]+)\]=(.*)/);
    if (keyMatch) {
      // Save previous key
      if (currentKey) {
        metadata[currentKey] = cleanMetaValue(currentValue);
      }
      currentKey = keyMatch[1];
      const rest = keyMatch[2];
      if (rest.startsWith("{") && rest.endsWith("}")) {
        currentValue = rest.slice(1, -1);
        inArrayValue = false;
      } else if (rest === "") {
        currentValue = "";
        inArrayValue = true;
      } else {
        currentValue = rest;
        inArrayValue = false;
      }
    } else if (inArrayValue && currentKey) {
      // Multi-line value - accumulate lines wrapped in {}
      const bracketMatch = line.match(/^\{(.*)\}$/);
      if (bracketMatch) {
        if (currentValue) currentValue += "\n";
        currentValue += bracketMatch[1];
      }
    }
  }
  // Save last key
  if (currentKey) {
    metadata[currentKey] = cleanMetaValue(currentValue);
  }

  return metadata;
}

function cleanMetaValue(val: string): string {
  return val.trim();
}

// --- Path mapping ---

function originalPathToSlug(originalPath: string): string {
  // Remove .html extension and leading slashes
  let slug = originalPath.replace(/\.html$/, "").replace(/^\/+/, "");
  // Replace path separators with dashes for filename safety
  return slug.replace(/\//g, "--");
}

function originalPathToUrlPath(originalPath: string): string {
  let p = originalPath.replace(/\.html$/, "").replace(/^\/+/, "");

  // Map /lib/authors/ -> /authors/
  p = p.replace(/^lib\/authors\//, "authors/");
  // Map /lib/thai/ -> /authors/thai/
  p = p.replace(/^lib\/thai\//, "authors/thai/");
  // Map /lib/study/ -> /study/
  p = p.replace(/^lib\/study\//, "study/");
  // Map /lib/ other -> /authors/ (catch-all for lib content)
  p = p.replace(/^lib\//, "authors/");
  // Map /ptf/ -> /guides/
  p = p.replace(/^ptf\//, "guides/");
  // Map /noncanon/ -> /noncanon/
  // (stays the same)
  // Map /tipitaka/ -> /tipitaka/
  // (stays the same)

  // Remove trailing /index
  p = p.replace(/\/index$/, "");

  return "/" + p;
}

function rewriteInternalLinks(
  html: string,
  currentOriginalPath: string
): string {
  const $ = cheerio.load(html, { xml: false });

  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");
    if (!href) return;

    // Skip external links, anchors, mailto, javascript
    if (
      href.startsWith("http://") ||
      href.startsWith("https://") ||
      href.startsWith("#") ||
      href.startsWith("mailto:") ||
      href.startsWith("javascript:")
    ) {
      return;
    }

    // Resolve relative path to absolute path from source root
    const currentDir = path.dirname(currentOriginalPath);
    let resolved = path.normalize(path.join(currentDir, href));

    // Separate anchor from path
    let anchor = "";
    const anchorIdx = resolved.indexOf("#");
    if (anchorIdx !== -1) {
      anchor = resolved.slice(anchorIdx);
      resolved = resolved.slice(0, anchorIdx);
    }

    // Only rewrite .html links
    if (!resolved.endsWith(".html")) {
      return;
    }

    const newUrl = originalPathToUrlPath(resolved) + anchor;
    $(el).attr("href", newUrl);
  });

  // Rewrite image src paths to absolute /img/ paths
  const currentDir = path.dirname(currentOriginalPath);
  $("img[src]").each((_, el) => {
    const src = $(el).attr("src");
    if (!src) return;

    // Skip external images and data URIs
    if (
      src.startsWith("http://") ||
      src.startsWith("https://") ||
      src.startsWith("data:")
    ) {
      return;
    }

    // Resolve relative path
    const resolved = path.normalize(path.join(currentDir, src));

    // If it resolves to an img/ path, make it absolute
    if (resolved.startsWith("img/")) {
      $(el).attr("src", "/" + resolved);
    } else {
      // For other relative paths, try to make absolute
      $(el).attr("src", "/" + resolved);
    }
  });

  return $.html();
}

// --- Content extraction ---

function extractContent(
  html: string,
  $: cheerio.CheerioAPI
): string {
  // Try COPYRIGHTED_TEXT_CHUNK first
  const textChunk = $("#COPYRIGHTED_TEXT_CHUNK");
  if (textChunk.length > 0) {
    return textChunk.html() || "";
  }

  // Fallback: H_content
  const hContent = $("#H_content");
  if (hContent.length > 0) {
    return hContent.html() || "";
  }

  // Last resort: body content minus header/footer
  const body = $("body");
  if (body.length > 0) {
    // Remove known non-content elements
    const clone = body.clone();
    clone.find("#H_billboard, #H_billboardHome, #F_footer, script").remove();
    return clone.html() || "";
  }

  return "";
}

function parseAltTranslations(
  metaValue: string,
  currentDir: string
): AltTranslation[] {
  if (!metaValue) return [];

  const alts: AltTranslation[] = [];
  const lines = metaValue.split("\n");
  for (const line of lines) {
    const match = line.match(/\{(.+?)\}/);
    if (match) {
      const filename = match[1];
      // Extract translator shortname from filename (e.g., mn.010.than.html -> than)
      const parts = filename.replace(".html", "").split(".");
      const translator = parts[parts.length - 1] || "";
      const fullPath = path.join(currentDir, filename);
      alts.push({
        path: originalPathToUrlPath(fullPath),
        translator,
      });
    }
  }
  return alts;
}

function determineLicense(licenseStr: string): LicenseType {
  if (!licenseStr) return "UNKNOWN";
  const upper = licenseStr.toUpperCase().trim();
  if (upper.includes("CC-BY-NC")) return "CC-BY-NC";
  if (upper.includes("CC-BY")) return "CC-BY";
  if (upper.includes("PUBLIC") || upper.includes("PD")) return "PUBLIC_DOMAIN";
  if (upper.includes("FREEWARE") || upper.includes("FREE")) return "FREEWARE";
  if (upper.includes("©") || upper.includes("COPYRIGHT")) return "©";
  return "UNKNOWN";
}

function determineType(
  meta: Record<string, string>,
  originalPath: string
): DocumentType {
  const metaType = (meta.TYPE || "").toLowerCase().trim();
  if (metaType === "sutta") return "sutta";
  if (metaType === "article") return "article";
  if (metaType === "book") return "book";
  if (metaType === "excerpt") return "excerpt";

  // Infer from path
  if (originalPath.startsWith("tipitaka/")) return "sutta";
  if (originalPath.startsWith("ptf/")) return "guide";
  if (originalPath.includes("glossary")) return "glossary";
  if (
    originalPath.startsWith("lib/") ||
    originalPath.startsWith("noncanon/")
  )
    return "article";

  // Check for index pages
  if (originalPath.endsWith("index.html") || originalPath.startsWith("index-"))
    return "index";

  return "unknown";
}

function determineNikaya(meta: Record<string, string>): Nikaya {
  const val = (meta.NIKAYA || "").trim();
  const valid: Nikaya[] = [
    "Digha",
    "Majjhima",
    "Samyutta",
    "Anguttara",
    "Khuddaka",
    "Vinaya",
    "Abhidhamma",
  ];
  if (valid.includes(val as Nikaya)) return val as Nikaya;
  return "";
}

function buildBreadcrumbs(urlPath: string): Breadcrumb[] {
  const parts = urlPath.split("/").filter(Boolean);
  const crumbs: Breadcrumb[] = [{ label: "Home", href: "/" }];

  const labelMap: Record<string, string> = {
    tipitaka: "Tipitaka",
    authors: "Authors",
    guides: "Guides",
    indexes: "Indexes",
    study: "Study Guides",
    noncanon: "Post-canonical",
    dn: "Digha Nikaya",
    mn: "Majjhima Nikaya",
    sn: "Samyutta Nikaya",
    an: "Anguttara Nikaya",
    kn: "Khuddaka Nikaya",
    vin: "Vinaya",
    abhi: "Abhidhamma",
  };

  let currentPath = "";
  for (let i = 0; i < parts.length - 1; i++) {
    currentPath += "/" + parts[i];
    crumbs.push({
      label: labelMap[parts[i]] || parts[i],
      href: currentPath,
    });
  }

  return crumbs;
}

// --- Extract license HTML ---

function extractDerivedLicense(metaValue: string): {
  html: string;
  image: string;
} {
  if (!metaValue) return { html: "", image: "" };

  const lines = metaValue.split("\n");
  let html = lines[0] || "";
  let image = lines[1] || "";

  return { html, image };
}

// --- Section determination ---

function determineSection(originalPath: string): string {
  if (originalPath.startsWith("tipitaka/")) return "tipitaka";
  if (
    originalPath.startsWith("lib/authors/") ||
    originalPath.startsWith("lib/thai/")
  )
    return "authors";
  if (originalPath.startsWith("lib/study/")) return "study";
  if (originalPath.startsWith("lib/")) return "authors";
  if (originalPath.startsWith("ptf/")) return "guides";
  if (originalPath.startsWith("noncanon/")) return "noncanon";
  if (originalPath.startsWith("index-")) return "indexes";
  return "root";
}

// --- Main extraction ---

function processFile(filePath: string): ATIDocument | null {
  const html = fs.readFileSync(filePath, "utf-8");
  const originalPath = path.relative(SOURCE_DIR, filePath);

  const meta = parseMetadataBlock(html);
  const $ = cheerio.load(html, { xml: false });

  // Extract content
  let contentHtml = extractContent(html, $);

  // Rewrite internal links
  if (contentHtml) {
    contentHtml = rewriteInternalLinks(contentHtml, originalPath);
  }

  const slug = originalPathToSlug(originalPath);
  const urlPath = originalPathToUrlPath(originalPath);
  const type = determineType(meta, originalPath);
  const currentDir = path.dirname(originalPath);

  // Parse alt translations
  const altTransRaw = meta.ALT_TRANS || "";
  const altTranslations = parseAltTranslations(altTransRaw, currentDir);

  // Parse derived license
  const derivedLicense = extractDerivedLicense(
    meta.DERIVED_LICENSE_DATA || ""
  );

  // Get page title from <title> tag
  const pageTitle = $("title").text().trim() || meta.MY_TITLE || "";

  const doc: ATIDocument = {
    slug,
    originalPath,
    urlPath,
    type,

    title: meta.MY_TITLE || pageTitle || "",
    subtitle: meta.SUBTITLE || "",
    subtitle2: meta.SUBTITLE2 || "",
    pageTitle,

    author: meta.AUTHOR || "",
    authorShortname: meta.AUTHOR_SHORTNAME || "",
    authorAltname: meta.AUTHOR_ALTNAME || "",
    author2: meta.AUTHOR2 || "",
    translator: meta.AUTHOR || "",

    nikaya: determineNikaya(meta),
    nikayaAbbrev: meta.NIKAYA_ABBREV || "",
    number: meta.NUMBER || "",
    ptsId: meta.PTS_ID || "",
    tipitakaBook: meta.TIPITAKA_BOOK || "",
    tipitakaBookAbbrev: meta.TIPITAKA_BOOK_ABBREV || "",

    contentHtml,
    summary: meta.SUMMARY || "",
    extent: meta.EXTENT || "",

    license: determineLicense(meta.LICENSE || ""),
    copyrightOwner: meta.SOURCE_COPYRIGHT_OWNER || "",
    copyrightYear: meta.SOURCE_COPYRIGHT_YEAR || "",
    derivedLicenseHtml: derivedLicense.html,
    derivedLicenseImage: derivedLicense.image,

    altTranslations,
    seeAlso: meta.SEE_ALSO ? meta.SEE_ALSO.split(",").map((s) => s.trim()).filter(Boolean) : [],
    altFormats: [],

    atiYear: meta.ATI_YEAR || "",
    source: meta.SOURCE || "",
    editorsNote: meta.EDITORS_NOTE || "",
    suttaNote: meta.SUTTA_NOTE || "",

    breadcrumbs: buildBreadcrumbs(urlPath),
    section: determineSection(originalPath),
  };

  // Parse alt formats
  if (meta.FORMAT_SUTTAREADINGS) {
    doc.altFormats.push({
      type: "audio",
      url: meta.FORMAT_SUTTAREADINGS,
      label: "Listen at SuttaReadings.net",
    });
  }

  return doc;
}

function findAllHtmlFiles(dir: string): string[] {
  const results: string[] = [];

  function walk(currentDir: string) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        // Skip certain directories
        if (["css", "js", "img", "news", "tech", "sltp"].includes(entry.name))
          continue;
        walk(fullPath);
      } else if (entry.name.endsWith(".html")) {
        results.push(fullPath);
      }
    }
  }

  walk(dir);
  return results;
}

async function main() {
  console.log("Starting content extraction...");
  console.log(`Source: ${SOURCE_DIR}`);
  console.log(`Output: ${OUTPUT_DIR}`);

  // Ensure output directories exist
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.mkdirSync(DATA_DIR, { recursive: true });

  const htmlFiles = findAllHtmlFiles(SOURCE_DIR);
  console.log(`Found ${htmlFiles.length} HTML files`);

  const documents: ATIDocument[] = [];
  const redirects: RedirectMap = {};
  let errors = 0;

  for (const filePath of htmlFiles) {
    try {
      const doc = processFile(filePath);
      if (doc && doc.contentHtml) {
        documents.push(doc);

        // Write individual document JSON
        const outPath = path.join(OUTPUT_DIR, `${doc.slug}.json`);
        fs.writeFileSync(outPath, JSON.stringify(doc, null, 2));

        // Build redirect mapping (old .html path -> new clean URL)
        const oldPath = "/" + doc.originalPath;
        if (oldPath !== doc.urlPath + ".html" && oldPath !== doc.urlPath) {
          redirects[oldPath] = doc.urlPath;
        }
      }
    } catch (err) {
      errors++;
      const rel = path.relative(SOURCE_DIR, filePath);
      console.error(`Error processing ${rel}:`, (err as Error).message);
    }
  }

  // Write manifest (metadata only, no content HTML)
  const manifestEntries: ManifestEntry[] = documents.map((doc) => ({
    slug: doc.slug,
    originalPath: doc.originalPath,
    urlPath: doc.urlPath,
    type: doc.type,
    title: doc.title,
    subtitle: doc.subtitle,
    author: doc.author,
    authorShortname: doc.authorShortname,
    nikaya: doc.nikaya,
    nikayaAbbrev: doc.nikayaAbbrev,
    number: doc.number,
    ptsId: doc.ptsId,
    license: doc.license,
    extent: doc.extent,
    summary: doc.summary,
    section: doc.section,
  }));

  const manifest: DocumentManifest = {
    documents: manifestEntries,
    totalCount: manifestEntries.length,
    generatedAt: new Date().toISOString(),
  };

  fs.writeFileSync(
    path.join(DATA_DIR, "manifest.json"),
    JSON.stringify(manifest, null, 2)
  );

  // Write redirects
  fs.writeFileSync(
    path.join(DATA_DIR, "redirects.json"),
    JSON.stringify(redirects, null, 2)
  );

  console.log(`\nExtraction complete!`);
  console.log(`  Documents: ${documents.length}`);
  console.log(`  Errors: ${errors}`);
  console.log(`  Redirects: ${Object.keys(redirects).length}`);
}

main().catch(console.error);
