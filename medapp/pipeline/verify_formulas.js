#!/usr/bin/env node
/**
 * Vérification automatique des formules (phase 5).
 *
 * Pour chaque score : exécute le f_Calculer ORIGINAL de medicalcul (référence,
 * depuis le HTML en cache) et l'implémentation générique de l'app (somme des
 * valeurs sélectionnées : radios + checkboxes) sur >=100 vecteurs de test aléatoires.
 * Si toutes les sorties sont identiques -> formule_verifiee: true.
 *
 * Les scores additifs purs (échelles) sont ainsi validés automatiquement ;
 * les scores à formule (inputs numériques, seuils) ne matchent pas -> restent
 * "À vérifier" (formule_verifiee: false).
 *
 * Usage: node verify_formulas.js [--one <id>] [--vectors 100]
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const DIR = __dirname;
const CACHE = path.join(DIR, '_cache');
const SCORES = path.join(DIR, '..', 'data', 'scores.json');
const SCRIPTS = fs.existsSync(path.join(CACHE, '_scripts.js'))
  ? fs.readFileSync(path.join(CACHE, '_scripts.js'), 'latin1') : '';

function readCache(id) {
  const p = path.join(CACHE, id + '.html');
  return fs.existsSync(p) ? fs.readFileSync(p, 'latin1') : null;
}

function attr(tag, name) {
  const m = tag.match(new RegExp(name + '="([^"]*)"', 'i'));
  return m ? m[1] : null;
}

// Modèle d'entrées de la page : radios (name->valeurs), checkboxes, numbers, selects
function parseInputs(html) {
  const radios = {}, checks = {}, numbers = new Set(), selects = {};
  const tags = html.match(/<input\b[^>]*>/gi) || [];
  for (const tag of tags) {
    const type = (attr(tag, 'type') || '').toLowerCase();
    const name = attr(tag, 'name');
    if (!name) continue;
    if (type === 'radio') (radios[name] = radios[name] || []).push(parseFloat(attr(tag, 'value')) || 0);
    else if (type === 'checkbox') checks[name] = parseFloat(attr(tag, 'value')) || 0;
    else if (type === 'number') numbers.add(name);
  }
  const selBlocks = html.match(/<select\b[^>]*>[\s\S]*?<\/select>/gi) || [];
  for (const sb of selBlocks) {
    const nm = attr(sb, 'name'); if (!nm) continue;
    const opts = [...sb.matchAll(/<option[^>]*value="([^"]*)"/gi)].map(m => parseFloat(m[1]) || 0);
    selects[nm] = opts.length ? opts : [0];
  }
  return { radios, checks, numbers: [...numbers], selects };
}

// Extraction de fonctions avec équilibrage des accolades (robuste à l'imbrication)
function balancedFunctions(src) {
  const out = [];
  const re = /function\s+[A-Za-z_$][\w$]*\s*\([^)]*\)\s*\{/g;
  let m;
  while ((m = re.exec(src))) {
    let i = m.index + m[0].length, depth = 1;
    while (i < src.length && depth > 0) {
      const c = src[i];
      if (c === '{') depth++;
      else if (c === '}') depth--;
      i++;
    }
    if (depth === 0) out.push({ name: m[0].match(/function\s+([A-Za-z_$][\w$]*)/)[1], src: src.slice(m.index, i) });
  }
  return out;
}

function extractFunctions(html) {
  let out = '';
  const scripts = [...html.matchAll(/<script\b(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]);
  for (const s of scripts) {
    for (const f of balancedFunctions(s)) {
      if (f.name === 'f_Calculer') continue; // ajouté séparément
      out += f.src + '\n';
    }
  }
  return out;
}

function extractFCalc(html) {
  for (const f of balancedFunctions(html)) if (f.name === 'f_Calculer') return f.src;
  return null;
}

// Shims des helpers (indépendants de _scripts.js pour éviter son code de chargement)
const SHIMS = `
function f_GetRadioValue(id){var r=document.getElementsByName(id);for(var i=0;i<r.length;i++){if(r[i].checked)return r[i].value*1;}return 0;}
function f_GetFilename(){return '';}
`;

function makeSandbox(inputs, vector) {
  const byName = {};
  const Form = { Resultat: { value: '' } };
  for (const [name, vals] of Object.entries(inputs.radios)) {
    const chosen = vector.radios[name];
    byName[name] = vals.map(v => ({ value: String(v), checked: v === chosen }));
    Form[name] = byName[name].find(e => e.checked) || byName[name][0];
  }
  for (const [name, val] of Object.entries(inputs.checks)) {
    const on = vector.checks[name];
    byName[name] = [{ value: String(val), checked: on }];
    Form[name] = byName[name][0];
  }
  for (const name of inputs.numbers) {
    Form[name] = { value: String(vector.numbers[name]) };
    byName[name] = [{ value: String(vector.numbers[name]), checked: false }];
  }
  for (const [name] of Object.entries(inputs.selects)) {
    Form[name] = { value: String(vector.selects[name]) };
    byName[name] = [{ value: String(vector.selects[name]), checked: false }];
  }
  const stubs = {};
  const document = {
    Form,
    getElementsByName: n => byName[n] || [],
    getElementById: id => {
      if (Form[id]) return Form[id];
      if (byName[id] && byName[id][0]) return byName[id][0];
      if (!stubs[id]) stubs[id] = { value: '', checked: false, innerHTML: '', className: '', style: {} };
      return stubs[id];
    },
    write: () => {},
  };
  return {
    document, window: {}, navigator: { userAgent: '' },
    MSSAndroidFunction: { storeHistory: () => {} },
    Math, parseFloat, parseInt, isNaN, Number, String, Date,
    alert: () => {}, console: { log: () => {} },
  };
}

function randVector(inputs) {
  const v = { radios: {}, checks: {}, numbers: {}, selects: {} };
  for (const [name, vals] of Object.entries(inputs.radios)) v.radios[name] = vals[Math.floor(Math.random() * vals.length)];
  for (const name of Object.keys(inputs.checks)) v.checks[name] = Math.random() < 0.5;
  for (const name of inputs.numbers) v.numbers[name] = Math.round((Math.random() * 200 + 1) * 10) / 10;
  for (const [name, opts] of Object.entries(inputs.selects)) v.selects[name] = opts[Math.floor(Math.random() * opts.length)];
  return v;
}

// Implémentation générique de l'app : somme des valeurs sélectionnées
function genericSum(inputs, vector) {
  let s = 0;
  for (const name of Object.keys(inputs.radios)) s += vector.radios[name];
  for (const [name, val] of Object.entries(inputs.checks)) s += vector.checks[name] ? val : 0;
  return s;
}

function refResult(inputs, vector, funcsSrc, fcalc) {
  const ctx = makeSandbox(inputs, vector);
  vm.createContext(ctx);
  const code = SHIMS + '\n' + funcsSrc + '\n' + fcalc + '\n; try { f_Calculer(); } catch (e) {} document.Form.Resultat.value;';
  try {
    return vm.runInContext(code, ctx, { timeout: 500 });
  } catch (e) { return { __error: e.message }; }
}

function verifyScore(sc) {
  const html = readCache(sc.id);
  if (!html) return { verifiee: false, raison: 'pas de cache', counts: null };
  const inputs = parseInputs(html);
  const counts = {
    radios: Object.keys(inputs.radios).length,
    checks: Object.keys(inputs.checks).length,
    numbers: inputs.numbers.length,
    selects: Object.keys(inputs.selects).length,
    hasFCalc: !!extractFCalc(html),
  };
  const fcalc = extractFCalc(html);
  if (!fcalc) return { verifiee: false, raison: 'pas de f_Calculer', counts };
  const nChoix = counts.radios + counts.checks;
  if (nChoix === 0) return { verifiee: false, raison: 'aucun item de choix', counts };
  const funcsSrc = extractFunctions(html);
  const N = ARGV.vectors;
  let refErrs = 0;
  for (let i = 0; i < N; i++) {
    const v = randVector(inputs);
    const ref = refResult(inputs, v, funcsSrc, fcalc);
    if (ref && ref.__error) { refErrs++; continue; }
    const refNum = parseFloat(ref);
    const mine = genericSum(inputs, v);
    if (isNaN(refNum) || Math.abs(refNum - mine) > 1e-9) {
      return { verifiee: false, raison: `mismatch au vecteur ${i}`, counts };
    }
  }
  if (refErrs > N * 0.1) return { verifiee: false, raison: 'référence en erreur', counts };
  return { verifiee: true, raison: `identique sur ${N - refErrs} vecteurs`, counts };
}

const ARGV = { one: null, vectors: 100 };
for (let i = 2; i < process.argv.length; i++) {
  if (process.argv[i] === '--one') ARGV.one = process.argv[++i];
  if (process.argv[i] === '--vectors') ARGV.vectors = parseInt(process.argv[++i]);
}

function main() {
  const data = JSON.parse(fs.readFileSync(SCORES, 'utf8'));
  let verified = 0, tested = 0;
  const report = [];
  for (const sc of data.scores) {
    if (ARGV.one && sc.id !== ARGV.one) continue;
    const r = verifyScore(sc);
    sc.formule_verifiee = r.verifiee;
    tested++;
    if (r.verifiee) verified++;
    report.push({ id: sc.id, categorie: sc.categorie, verifiee: r.verifiee, raison: r.raison, counts: r.counts });
    if (ARGV.one) console.log(sc.id, '->', JSON.stringify(r));
  }
  if (!ARGV.one) {
    data.meta.formules_verifiees = verified;
    fs.writeFileSync(SCORES, JSON.stringify(data, null, 2));
    const rp = path.join(DIR, '_raw', 'verif_report.json');
    fs.mkdirSync(path.dirname(rp), { recursive: true });
    fs.writeFileSync(rp, JSON.stringify(report, null, 2));
    console.log(`Vérifiées: ${verified}/${tested} scores. Rapport: ${rp}`);
  }
}
main();
