#!/usr/bin/env node
/**
 * Fix ECG image references in questions.js
 * Matches question image names to real filenames in ecg/images/
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const IMAGES_DIR = path.join(ROOT, 'ecg', 'images');
const QUESTIONS_FILE = path.join(ROOT, 'ecg', 'questions.js');

// 1. Read real filenames
const realFiles = fs.readdirSync(IMAGES_DIR).filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f));
console.log(`Found ${realFiles.length} image files in ecg/images/\n`);

// 2. Read questions.js
let content = fs.readFileSync(QUESTIONS_FILE, 'utf-8');

// 3. Extract all image references
const imageRegex = /image:\s*"([^"]+)"/g;
let match;
const refs = [];
while ((match = imageRegex.exec(content)) !== null) {
  refs.push(match[1]);
}
console.log(`Found ${refs.length} image references in questions.js\n`);

// 4. Build matching function
function findMatch(refName, realFiles) {
  // Exact match
  if (realFiles.includes(refName)) return refName;

  const refLower = refName.toLowerCase();
  const refBase = refLower.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '');

  // Try zero-padded numbers: -1 -> -01, -2 -> -02, etc.
  const paddedName = refBase.replace(/-(\d+)$/, (_, n) => '-' + n.padStart(2, '0'));
  for (const f of realFiles) {
    const fLower = f.toLowerCase();
    const fBase = fLower.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '');
    if (fBase === paddedName) return f;
  }

  // Try without trailing number: extract prefix and find first match
  const prefixMatch = refBase.match(/^(.+)-\d+$/);
  if (prefixMatch) {
    const prefix = prefixMatch[1];
    const matches = realFiles.filter(f => {
      const fBase = f.toLowerCase().replace(/\.(jpg|jpeg|png|gif|webp)$/i, '');
      return fBase.startsWith(prefix);
    });
    if (matches.length > 0) return matches[0];
  }

  // Fuzzy: longest common prefix
  let bestMatch = null;
  let bestLen = 0;
  for (const f of realFiles) {
    const fLower = f.toLowerCase();
    let common = 0;
    for (let i = 0; i < Math.min(refLower.length, fLower.length); i++) {
      if (refLower[i] === fLower[i]) common++;
      else break;
    }
    if (common > bestLen) {
      bestLen = common;
      bestMatch = f;
    }
  }
  // Only accept if at least 60% of the ref name matches
  if (bestMatch && bestLen >= refBase.length * 0.6) return bestMatch;

  return null;
}

// 5. Process replacements
let replacements = 0;
let notFound = [];

for (const ref of refs) {
  const matched = findMatch(ref, realFiles);
  if (matched && matched !== ref) {
    content = content.replace(`image: "${ref}"`, `image: "${matched}"`);
    console.log(`  ✓ ${ref}  →  ${matched}`);
    replacements++;
  } else if (!matched) {
    notFound.push(ref);
  }
}

// 6. Write back
if (replacements > 0) {
  fs.writeFileSync(QUESTIONS_FILE, content, 'utf-8');
  console.log(`\n${replacements} replacements written to questions.js`);
} else {
  console.log('\nNo replacements needed.');
}

if (notFound.length > 0) {
  console.log(`\n⚠ ${notFound.length} images not found on disk:`);
  notFound.forEach(f => console.log(`  ✗ ${f}`));
}
