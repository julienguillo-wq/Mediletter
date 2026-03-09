#!/usr/bin/env node
/**
 * Download missing ECG images from LITFL
 * Reads ecg/images/ to find what's missing, then fetches from LITFL pages.
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const ROOT = path.resolve(__dirname, '..');
const IMAGES_DIR = path.join(ROOT, 'ecg', 'images');
const QUESTIONS_FILE = path.join(ROOT, 'ecg', 'questions.js');

// Mapping: image prefix → LITFL page URL
const LITFL_MAP = {
  'normal-sinus-rhythm':          'https://litfl.com/normal-sinus-rhythm-ecg-library/',
  'sinus-bradycardia':            'https://litfl.com/sinus-bradycardia-ecg-library/',
  'sinus-tachycardia':            'https://litfl.com/sinus-tachycardia-ecg-library/',
  'sinus-arrhythmia':             'https://litfl.com/sinus-arrhythmia-ecg-library/',
  'early-repolarization':         'https://litfl.com/early-repolarisation-ecg-library/',
  'atrial-fibrillation':          'https://litfl.com/atrial-fibrillation-ecg-library/',
  'atrial-flutter':               'https://litfl.com/atrial-flutter-ecg-library/',
  'avnrt':                        'https://litfl.com/supraventricular-tachycardia-svt-ecg-library/',
  'svt':                          'https://litfl.com/supraventricular-tachycardia-svt-ecg-library/',
  'multifocal-atrial-tachycardia':'https://litfl.com/multifocal-atrial-tachycardia-mat-ecg-library/',
  'premature-atrial-complex':     'https://litfl.com/premature-atrial-complex-pac/',
  'wpw':                          'https://litfl.com/wolff-parkinson-white-wpw-syndrome-ecg-library/',
  'focal-atrial-tachycardia':     'https://litfl.com/atrial-tachycardia-ecg-library/',
  'wandering-atrial-pacemaker':   'https://litfl.com/wandering-atrial-pacemaker-ecg-library/',
  'ventricular-tachycardia':      'https://litfl.com/ventricular-tachycardia-monomorphic-ecg-library/',
  'polymorphic-ventricular-tachycardia': 'https://litfl.com/polymorphic-ventricular-tachycardia-ecg-library/',
  'torsades-de-pointes':          'https://litfl.com/torsades-de-pointes-tdp/',
  'ventricular-fibrillation':     'https://litfl.com/ventricular-fibrillation-vf-ecg-library/',
  'accelerated-idioventricular':  'https://litfl.com/accelerated-idioventricular-rhythm-aivr/',
  'premature-ventricular-complex':'https://litfl.com/premature-ventricular-complex-pvc-ecg-library/',
  'ventricular-bigeminy':         'https://litfl.com/premature-ventricular-complex-pvc-ecg-library/',
  'first-degree-heart-block':     'https://litfl.com/first-degree-heart-block-ecg-library/',
  'second-degree-heart-block-type1': 'https://litfl.com/av-block-2nd-degree-mobitz-type-1-wenckebach-phenomenon/',
  'wenckebach':                   'https://litfl.com/av-block-2nd-degree-mobitz-type-1-wenckebach-phenomenon/',
  'second-degree-heart-block-type2': 'https://litfl.com/av-block-2nd-degree-mobitz-type-2/',
  'third-degree-heart-block':     'https://litfl.com/av-block-3rd-degree-complete-heart-block/',
  'right-bundle-branch-block':    'https://litfl.com/right-bundle-branch-block-rbbb-ecg-library/',
  'left-bundle-branch-block':     'https://litfl.com/left-bundle-branch-block-lbbb-ecg-library/',
  'left-anterior-fascicular':     'https://litfl.com/left-anterior-fascicular-block-lafb-ecg-library/',
  'left-posterior-fascicular':    'https://litfl.com/left-posterior-fascicular-block-lpfb-ecg-library/',
  'bifascicular-block':           'https://litfl.com/bifascicular-block-ecg-library/',
  'second-degree-heart-block-2to1': 'https://litfl.com/2-1-av-block-ecg-library/',
  'sinus-node-dysfunction':       'https://litfl.com/sinus-node-dysfunction-ecg-library/',
  'stemi-anterior':               'https://litfl.com/anterior-myocardial-infarction-ecg-library/',
  'stemi-inferior':               'https://litfl.com/inferior-stemi-ecg-library/',
  'stemi-lateral':                'https://litfl.com/lateral-stemi-ecg-library/',
  'posterior-stemi':              'https://litfl.com/posterior-myocardial-infarction-ecg-library/',
  'subendocardial-ischemia':      'https://litfl.com/st-segment-ecg-library/',
  'pathological-q-waves':         'https://litfl.com/q-wave-ecg-library/',
  'wellens-syndrome':             'https://litfl.com/wellens-syndrome-ecg-library/',
  'wellens-type-a':               'https://litfl.com/wellens-syndrome-ecg-library/',
  'de-winter':                    'https://litfl.com/de-winter-t-wave-ecg-library/',
  'prinzmetal':                   'https://litfl.com/prinzmetal-angina-coronary-vasospasm/',
  'hyperkalaemia':                'https://litfl.com/hyperkalaemia-ecg-library/',
  'hypokalaemia':                 'https://litfl.com/hypokalaemia-ecg-library/',
  'hypothermia':                  'https://litfl.com/hypothermia-ecg-library/',
  'brugada':                      'https://litfl.com/brugada-syndrome-ecg-library/',
  'pericarditis':                 'https://litfl.com/pericarditis-ecg-library/',
  's1q3t3':                       'https://litfl.com/ecg-changes-in-pulmonary-embolism/',
  'pulmonary-embolism':           'https://litfl.com/pulmonary-embolism-ecg-library/',
  'left-ventricular-hypertrophy': 'https://litfl.com/left-ventricular-hypertrophy-lvh-ecg-library/',
  'digoxin-effect':               'https://litfl.com/digoxin-effect-ecg-library/',
  'long-qt-syndrome':             'https://litfl.com/qt-interval-ecg-library/',
};

// ── Helpers ──

function fetchPage(pageUrl, redirects) {
  if (redirects === undefined) redirects = 0;
  if (redirects > 5) return Promise.reject(new Error('Too many redirects'));

  return new Promise(function(resolve, reject) {
    var parsed = new URL(pageUrl);
    var mod = parsed.protocol === 'https:' ? https : http;
    var req = mod.get(pageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MedHub-ECG-Downloader/1.0; educational use)',
        'Accept': 'text/html,application/xhtml+xml,*/*'
      },
      timeout: 15000
    }, function(res) {
      if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
        var next = new URL(res.headers.location, pageUrl).href;
        resolve(fetchPage(next, redirects + 1));
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error('HTTP ' + res.statusCode + ' for ' + pageUrl));
        return;
      }
      var chunks = [];
      res.on('data', function(c) { chunks.push(c); });
      res.on('end', function() { resolve(Buffer.concat(chunks).toString('utf-8')); });
      res.on('error', reject);
    });
    req.on('error', reject);
    req.on('timeout', function() { req.destroy(); reject(new Error('Timeout')); });
  });
}

function downloadFile(fileUrl, dest, redirects) {
  if (redirects === undefined) redirects = 0;
  if (redirects > 5) return Promise.reject(new Error('Too many redirects'));

  return new Promise(function(resolve, reject) {
    var parsed = new URL(fileUrl);
    var mod = parsed.protocol === 'https:' ? https : http;
    var req = mod.get(fileUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MedHub-ECG-Downloader/1.0)' },
      timeout: 30000
    }, function(res) {
      if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
        var next = new URL(res.headers.location, fileUrl).href;
        resolve(downloadFile(next, dest, redirects + 1));
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error('HTTP ' + res.statusCode));
        return;
      }
      var stream = fs.createWriteStream(dest);
      res.pipe(stream);
      stream.on('finish', function() { stream.close(); resolve(dest); });
      stream.on('error', function(e) { fs.unlink(dest, function(){}); reject(e); });
    });
    req.on('error', reject);
    req.on('timeout', function() { req.destroy(); reject(new Error('Timeout')); });
  });
}

function extractECGImages(html) {
  // Find all <img> tags in article/main content
  var imgs = [];
  var imgRegex = /<img[^>]+src\s*=\s*["']([^"']+)["'][^>]*>/gi;
  var match;
  while ((match = imgRegex.exec(html)) !== null) {
    var src = match[0];
    var imgUrl = match[1];

    // Must be from wp-content/uploads (real content images)
    if (!imgUrl.includes('wp-content/uploads')) continue;
    // Skip tiny images (logos, icons)
    var widthMatch = src.match(/width\s*=\s*["']?(\d+)/i);
    if (widthMatch && parseInt(widthMatch[1]) < 300) continue;
    // Skip known non-ECG patterns
    if (/logo|icon|avatar|banner|ad-|advertisement|thumbnail.*150x/i.test(imgUrl)) continue;
    // Skip very small thumbnails by filename pattern
    if (/-\d+x\d+\.(jpg|png)/i.test(imgUrl)) {
      var dims = imgUrl.match(/-(\d+)x(\d+)\./);
      if (dims && parseInt(dims[1]) < 300) continue;
    }

    // Prefer full-size: strip dimension suffixes like -1024x512
    var fullUrl = imgUrl.replace(/-\d+x\d+(\.(jpg|jpeg|png|gif|webp))/i, '$1');
    imgs.push(fullUrl);
  }
  return imgs;
}

function sleep(ms) {
  return new Promise(function(resolve) { setTimeout(resolve, ms); });
}

// ── Main ──

async function main() {
  // 1. Get all image refs from questions.js
  var questionsContent = fs.readFileSync(QUESTIONS_FILE, 'utf-8');
  var imageRegex = /image:\s*"([^"]+)"/g;
  var match;
  var neededImages = [];
  while ((match = imageRegex.exec(questionsContent)) !== null) {
    neededImages.push(match[1]);
  }

  // 2. Get existing files
  var existingFiles = fs.readdirSync(IMAGES_DIR).filter(function(f) {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(f);
  });
  var existingSet = new Set(existingFiles.map(function(f) { return f.toLowerCase(); }));

  // 3. Find missing
  var missing = neededImages.filter(function(img) {
    return !existingSet.has(img.toLowerCase());
  });

  console.log('Total images needed: ' + neededImages.length);
  console.log('Already have: ' + (neededImages.length - missing.length));
  console.log('Missing: ' + missing.length);

  if (missing.length === 0) {
    console.log('\nAll images present!');
    return;
  }

  console.log('\nMissing images:');
  missing.forEach(function(m) { console.log('  - ' + m); });

  // 4. For each missing image, find the right LITFL page and download
  var downloaded = 0;
  var failed = [];
  // Cache pages we already fetched
  var pageCache = {};

  for (var i = 0; i < missing.length; i++) {
    var imgName = missing[i];
    var baseName = imgName.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '').replace(/-\d+$/, '');

    // Find matching LITFL page
    var litflUrl = null;
    // Try exact match first, then prefix match (longest first)
    var keys = Object.keys(LITFL_MAP).sort(function(a, b) { return b.length - a.length; });
    for (var k = 0; k < keys.length; k++) {
      if (baseName.includes(keys[k]) || baseName.startsWith(keys[k])) {
        litflUrl = LITFL_MAP[keys[k]];
        break;
      }
    }

    if (!litflUrl) {
      console.log('\n✗ No LITFL mapping for: ' + imgName);
      failed.push(imgName);
      continue;
    }

    console.log('\n[' + (i + 1) + '/' + missing.length + '] ' + imgName);
    console.log('  Page: ' + litflUrl);

    try {
      // Fetch page (with cache)
      var html;
      if (pageCache[litflUrl]) {
        html = pageCache[litflUrl];
      } else {
        await sleep(1500); // polite delay
        html = await fetchPage(litflUrl);
        pageCache[litflUrl] = html;
      }

      // Extract ECG images
      var ecgImages = extractECGImages(html);
      if (ecgImages.length === 0) {
        console.log('  ✗ No ECG images found on page');
        failed.push(imgName);
        continue;
      }

      console.log('  Found ' + ecgImages.length + ' ECG image(s) on page');

      // Pick which image to download (first one, or specific index for numbered files)
      var numMatch = imgName.match(/-(\d+)\.\w+$/);
      var imgIndex = numMatch ? parseInt(numMatch[1]) - 1 : 0;
      if (imgIndex >= ecgImages.length) imgIndex = 0;
      var imgUrl = ecgImages[imgIndex];

      // Make absolute URL
      if (imgUrl.startsWith('//')) imgUrl = 'https:' + imgUrl;
      else if (imgUrl.startsWith('/')) imgUrl = 'https://litfl.com' + imgUrl;
      else if (!imgUrl.startsWith('http')) imgUrl = 'https://litfl.com/' + imgUrl;

      // Determine file extension from URL
      var extMatch = imgUrl.match(/\.(jpg|jpeg|png|gif|webp)/i);
      var ext = extMatch ? extMatch[1].toLowerCase() : 'jpg';

      // Use the expected filename (keep the name from questions.js)
      var destName = imgName;
      // If extension doesn't match, fix it
      if (!destName.toLowerCase().endsWith('.' + ext)) {
        destName = destName.replace(/\.\w+$/, '.' + ext);
      }

      var destPath = path.join(IMAGES_DIR, destName);
      console.log('  Downloading: ' + imgUrl.substring(0, 80) + '...');

      await downloadFile(imgUrl, destPath);

      // Check file size
      var stat = fs.statSync(destPath);
      if (stat.size < 5000) {
        console.log('  ✗ File too small (' + stat.size + ' bytes), likely not a real image');
        fs.unlinkSync(destPath);
        failed.push(imgName);
      } else {
        console.log('  ✓ Saved: ' + destName + ' (' + Math.round(stat.size / 1024) + ' KB)');
        downloaded++;

        // If we saved with different extension, update questions.js
        if (destName !== imgName) {
          questionsContent = questionsContent.replace(
            'image: "' + imgName + '"',
            'image: "' + destName + '"'
          );
        }
      }
    } catch (err) {
      console.log('  ✗ Error: ' + err.message);
      failed.push(imgName);
    }
  }

  // 5. Write updated questions.js if any extension changes
  fs.writeFileSync(QUESTIONS_FILE, questionsContent, 'utf-8');

  // 6. Summary
  console.log('\n' + '═'.repeat(50));
  console.log('Downloaded: ' + downloaded + '/' + missing.length);
  if (failed.length > 0) {
    console.log('Failed (' + failed.length + '):');
    failed.forEach(function(f) { console.log('  ✗ ' + f); });
  }
  console.log('═'.repeat(50));
}

main().catch(function(err) {
  console.error('Fatal error:', err);
  process.exit(1);
});
