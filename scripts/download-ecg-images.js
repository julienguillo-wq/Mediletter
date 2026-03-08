/**
 * download-ecg-images.js
 *
 * Node.js script that downloads ECG images from LITFL pages and generates
 * an image manifest mapping each image to its pathology.
 *
 * Usage:  node scripts/download-ecg-images.js
 * No external dependencies required (uses built-in https, fs, path, url).
 */

const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const ROOT_DIR = path.resolve(__dirname, "..");
const IMAGE_DIR = path.join(ROOT_DIR, "ecg", "images");
const MANIFEST_PATH = path.join(ROOT_DIR, "ecg", "image-manifest.json");

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;
const REQUEST_TIMEOUT_MS = 30000;
const DELAY_BETWEEN_PAGES_MS = 1500; // polite crawl delay

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

// ---------------------------------------------------------------------------
// URL list + pathology mapping
// ---------------------------------------------------------------------------

const PAGES = [
  {
    url: "https://litfl.com/normal-sinus-rhythm-ecg-library/",
    pathology_en: "Normal Sinus Rhythm",
    pathology: "Rythme sinusal normal",
  },
  {
    url: "https://litfl.com/sinus-bradycardia-ecg-library/",
    pathology_en: "Sinus Bradycardia",
    pathology: "Bradycardie sinusale",
  },
  {
    url: "https://litfl.com/sinus-tachycardia-ecg-library/",
    pathology_en: "Sinus Tachycardia",
    pathology: "Tachycardie sinusale",
  },
  {
    url: "https://litfl.com/atrial-fibrillation-ecg-library/",
    pathology_en: "Atrial Fibrillation",
    pathology: "Fibrillation auriculaire",
  },
  {
    url: "https://litfl.com/atrial-flutter-ecg-library/",
    pathology_en: "Atrial Flutter",
    pathology: "Flutter auriculaire",
  },
  {
    url: "https://litfl.com/supraventricular-tachycardia-svt-ecg-library/",
    pathology_en: "Supraventricular Tachycardia (SVT)",
    pathology: "Tachycardie supraventriculaire (TSV)",
  },
  {
    url: "https://litfl.com/ventricular-tachycardia-monomorphic-ecg-library/",
    pathology_en: "Ventricular Tachycardia (Monomorphic)",
    pathology: "Tachycardie ventriculaire monomorphe",
  },
  {
    url: "https://litfl.com/polymorphic-ventricular-tachycardia-ecg-library/",
    pathology_en: "Polymorphic Ventricular Tachycardia",
    pathology: "Tachycardie ventriculaire polymorphe",
  },
  {
    url: "https://litfl.com/torsades-de-pointes-tdp/",
    pathology_en: "Torsades de Pointes",
    pathology: "Torsades de pointes",
  },
  {
    url: "https://litfl.com/ventricular-fibrillation-vf-ecg-library/",
    pathology_en: "Ventricular Fibrillation",
    pathology: "Fibrillation ventriculaire",
  },
  {
    url: "https://litfl.com/asystole-ecg-library/",
    pathology_en: "Asystole",
    pathology: "Asystolie",
  },
  {
    url: "https://litfl.com/pulseless-electrical-activity-pea/",
    pathology_en: "Pulseless Electrical Activity (PEA)",
    pathology: "Activite electrique sans pouls (AESP)",
  },
  {
    url: "https://litfl.com/first-degree-heart-block-ecg-library/",
    pathology_en: "First Degree Heart Block",
    pathology: "Bloc auriculo-ventriculaire du 1er degre",
  },
  {
    url: "https://litfl.com/av-block-2nd-degree-mobitz-type-1-wenckebach-phenomenon/",
    pathology_en: "Second Degree AV Block - Mobitz Type 1 (Wenckebach)",
    pathology: "BAV du 2e degre - Mobitz type 1 (Wenckebach)",
  },
  {
    url: "https://litfl.com/av-block-2nd-degree-mobitz-type-2/",
    pathology_en: "Second Degree AV Block - Mobitz Type 2",
    pathology: "BAV du 2e degre - Mobitz type 2",
  },
  {
    url: "https://litfl.com/av-block-3rd-degree-complete-heart-block/",
    pathology_en: "Third Degree (Complete) Heart Block",
    pathology: "BAV du 3e degre (bloc complet)",
  },
  {
    url: "https://litfl.com/right-bundle-branch-block-rbbb-ecg-library/",
    pathology_en: "Right Bundle Branch Block (RBBB)",
    pathology: "Bloc de branche droit (BBD)",
  },
  {
    url: "https://litfl.com/left-bundle-branch-block-lbbb-ecg-library/",
    pathology_en: "Left Bundle Branch Block (LBBB)",
    pathology: "Bloc de branche gauche (BBG)",
  },
  {
    url: "https://litfl.com/anterior-myocardial-infarction-ecg-library/",
    pathology_en: "Anterior Myocardial Infarction (STEMI)",
    pathology: "Infarctus du myocarde anterieur (STEMI)",
  },
  {
    url: "https://litfl.com/inferior-stemi-ecg-library/",
    pathology_en: "Inferior STEMI",
    pathology: "STEMI inferieur",
  },
  {
    url: "https://litfl.com/lateral-stemi-ecg-library/",
    pathology_en: "Lateral STEMI",
    pathology: "STEMI lateral",
  },
  {
    url: "https://litfl.com/posterior-myocardial-infarction-ecg-library/",
    pathology_en: "Posterior Myocardial Infarction",
    pathology: "Infarctus du myocarde posterieur",
  },
  {
    url: "https://litfl.com/hyperkalaemia-ecg-library/",
    pathology_en: "Hyperkalaemia",
    pathology: "Hyperkaliemie",
  },
  {
    url: "https://litfl.com/hypokalaemia-ecg-library/",
    pathology_en: "Hypokalaemia",
    pathology: "Hypokaliemie",
  },
  {
    url: "https://litfl.com/hypothermia-ecg-library/",
    pathology_en: "Hypothermia",
    pathology: "Hypothermie",
  },
  {
    url: "https://litfl.com/wolff-parkinson-white-wpw-syndrome-ecg-library/",
    pathology_en: "Wolff-Parkinson-White (WPW) Syndrome",
    pathology: "Syndrome de Wolff-Parkinson-White (WPW)",
  },
  {
    url: "https://litfl.com/brugada-syndrome-ecg-library/",
    pathology_en: "Brugada Syndrome",
    pathology: "Syndrome de Brugada",
  },
  {
    url: "https://litfl.com/pericarditis-ecg-library/",
    pathology_en: "Pericarditis",
    pathology: "Pericardite",
  },
  {
    url: "https://litfl.com/left-ventricular-hypertrophy-lvh-ecg-library/",
    pathology_en: "Left Ventricular Hypertrophy (LVH)",
    pathology: "Hypertrophie ventriculaire gauche (HVG)",
  },
  {
    url: "https://litfl.com/pulmonary-embolism-ecg-library/",
    pathology_en: "Pulmonary Embolism",
    pathology: "Embolie pulmonaire",
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fetch a URL with redirect support (up to 5 hops).
 * Returns the response body as a string (for HTML) or Buffer (for binary).
 */
function fetch(targetUrl, binary = false, redirectCount = 0) {
  return new Promise((resolve, reject) => {
    if (redirectCount > 5) {
      return reject(new Error("Too many redirects"));
    }

    const parsed = new URL(targetUrl);
    const lib = parsed.protocol === "https:" ? https : http;

    const req = lib.get(
      targetUrl,
      {
        headers: { "User-Agent": USER_AGENT },
        timeout: REQUEST_TIMEOUT_MS,
      },
      (res) => {
        // Handle redirects
        if ([301, 302, 303, 307, 308].includes(res.statusCode)) {
          const location = res.headers.location;
          if (!location) return reject(new Error("Redirect without Location header"));
          const nextUrl = new URL(location, targetUrl).href;
          return resolve(fetch(nextUrl, binary, redirectCount + 1));
        }

        if (res.statusCode !== 200) {
          res.resume(); // consume response to free memory
          return reject(new Error(`HTTP ${res.statusCode} for ${targetUrl}`));
        }

        if (binary) {
          const chunks = [];
          res.on("data", (chunk) => chunks.push(chunk));
          res.on("end", () => resolve(Buffer.concat(chunks)));
          res.on("error", reject);
        } else {
          let body = "";
          res.setEncoding("utf-8");
          res.on("data", (chunk) => (body += chunk));
          res.on("end", () => resolve(body));
          res.on("error", reject);
        }
      }
    );

    req.on("timeout", () => {
      req.destroy();
      reject(new Error(`Timeout fetching ${targetUrl}`));
    });
    req.on("error", reject);
  });
}

/**
 * Fetch with retry logic.
 */
async function fetchWithRetry(url, binary = false) {
  let lastError;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await fetch(url, binary);
    } catch (err) {
      lastError = err;
      console.warn(
        `  [!] Attempt ${attempt}/${MAX_RETRIES} failed for ${url}: ${err.message}`
      );
      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY_MS * attempt);
      }
    }
  }
  throw lastError;
}

/**
 * Extract ECG image URLs from HTML.
 * Looks for <img> tags inside article/main content with:
 *   - src containing "wp-content/uploads"
 *   - width attribute > 400  OR  no width attribute (likely full-size)
 * Also skips icons, logos, avatars, and tiny images.
 */
function extractEcgImageUrls(html, pageUrl) {
  const images = [];

  // Try to isolate article content to avoid nav/sidebar images
  const articleMatch =
    html.match(/<article[\s\S]*?<\/article>/i) ||
    html.match(/<main[\s\S]*?<\/main>/i) ||
    html.match(/<div[^>]*class="[^"]*entry-content[^"]*"[\s\S]*?<\/div>/i) ||
    html.match(/<div[^>]*class="[^"]*post-content[^"]*"[\s\S]*?<\/div>/i);

  const searchZone = articleMatch ? articleMatch[0] : html;

  // Match all <img> tags
  const imgRegex = /<img\s[^>]*>/gi;
  let match;
  while ((match = imgRegex.exec(searchZone)) !== null) {
    const tag = match[0];

    // Extract src (try srcset first for higher quality, fall back to src)
    let src = null;
    const srcMatch = tag.match(/\bsrc=["']([^"']+)["']/i);
    if (srcMatch) src = srcMatch[1];
    if (!src) continue;

    // Skip non-content images
    if (/logo|icon|avatar|gravatar|emoji|advertisement|banner/i.test(src)) continue;
    if (/\.(svg|gif)$/i.test(src)) continue;

    // Filter: must be a wp-content/uploads image OR have ECG-related path
    const isWpUpload = /wp-content\/uploads/i.test(src);
    const isEcgRelated = /ecg|ekg|rhythm|strip|tracing|12.lead/i.test(src);
    if (!isWpUpload && !isEcgRelated) continue;

    // Check width — skip small images (thumbnails, icons)
    const widthMatch = tag.match(/\bwidth=["']?(\d+)/i);
    if (widthMatch) {
      const w = parseInt(widthMatch[1], 10);
      if (w < 400) continue; // skip small thumbnails
    }

    // Check for explicit thumbnail sizes in filename
    if (/\-\d{2,3}x\d{2,3}\./i.test(src)) continue;

    // Resolve relative URLs
    const absoluteUrl = new URL(src, pageUrl).href;

    // Avoid duplicates
    if (!images.includes(absoluteUrl)) {
      images.push(absoluteUrl);
    }
  }

  return images;
}

/**
 * Sanitize a string for use as a filename.
 */
function sanitize(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Download a single image to disk. Returns the local filename.
 */
async function downloadImage(imageUrl, pathologySlug, index) {
  const parsed = new URL(imageUrl);
  const ext = path.extname(parsed.pathname).split("?")[0] || ".jpg";
  const filename = `${pathologySlug}-${String(index + 1).padStart(2, "0")}${ext}`;
  const filePath = path.join(IMAGE_DIR, filename);

  // Skip if already downloaded
  if (fs.existsSync(filePath)) {
    console.log(`  [=] Already exists: ${filename}`);
    return filename;
  }

  const buffer = await fetchWithRetry(imageUrl, true);
  fs.writeFileSync(filePath, buffer);
  console.log(`  [+] Downloaded: ${filename} (${(buffer.length / 1024).toFixed(1)} KB)`);
  return filename;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("=== ECG Image Downloader ===\n");

  // Ensure output directories exist
  fs.mkdirSync(IMAGE_DIR, { recursive: true });
  console.log(`Output directory: ${IMAGE_DIR}`);
  console.log(`Manifest path:    ${MANIFEST_PATH}\n`);

  const manifest = [];
  let totalImages = 0;
  let totalErrors = 0;

  for (let i = 0; i < PAGES.length; i++) {
    const page = PAGES[i];
    const slug = sanitize(page.pathology_en);
    console.log(
      `[${i + 1}/${PAGES.length}] ${page.pathology_en} — ${page.url}`
    );

    let html;
    try {
      html = await fetchWithRetry(page.url);
    } catch (err) {
      console.error(`  [X] Failed to fetch page: ${err.message}`);
      console.error(
        `  [!] FALLBACK: Could not scrape this page. You may need to manually download ECG images for "${page.pathology_en}" from ${page.url}`
      );
      totalErrors++;
      continue;
    }

    const imageUrls = extractEcgImageUrls(html, page.url);
    if (imageUrls.length === 0) {
      console.warn(`  [!] No ECG images found on this page.`);
      console.warn(
        `  [!] FALLBACK: The page structure may have changed. Please visit ${page.url} manually to verify and download ECG images for "${page.pathology_en}".`
      );
      continue;
    }

    console.log(`  Found ${imageUrls.length} image(s)`);

    for (let j = 0; j < imageUrls.length; j++) {
      try {
        const filename = await downloadImage(imageUrls[j], slug, j);
        manifest.push({
          id: `${slug}-${String(j + 1).padStart(2, "0")}`,
          filename,
          pathology: page.pathology,
          pathology_en: page.pathology_en,
          source: "LITFL ECG Library",
          source_url: page.url,
        });
        totalImages++;
      } catch (err) {
        console.error(`  [X] Failed to download image: ${err.message}`);
        console.error(
          `  [!] FALLBACK: Could not download image from ${imageUrls[j]}. You may need to download it manually.`
        );
        totalErrors++;
      }
    }

    // Polite delay between pages
    if (i < PAGES.length - 1) {
      await sleep(DELAY_BETWEEN_PAGES_MS);
    }
  }

  // Write manifest
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf-8");
  console.log(`\n=== Done ===`);
  console.log(`Total images downloaded: ${totalImages}`);
  console.log(`Total errors: ${totalErrors}`);
  console.log(`Manifest written to: ${MANIFEST_PATH}`);

  if (totalErrors > 0) {
    console.log(
      `\n[!] Some downloads failed. Re-run the script to retry, or download the missing images manually.`
    );
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
