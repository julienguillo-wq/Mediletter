#!/usr/bin/env node
/**
 * Harnais de vérification des formules NATIVES (phase C).
 *
 * Pour chaque formule de ../formulas.js : exécute le f_Calculer ORIGINAL de
 * medicalcul (référence) et l'implémentation native, sur >=100 vecteurs, et
 * compare la sortie (champ `out`). Identique partout -> validée.
 *
 * Écrit formule_native + formule_verifiee (statut recalculé par classify.py).
 * Usage: node verify_native.js [--vectors 200] [--one <id>]
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const DIR = __dirname;
const CACHE = path.join(DIR, '_cache');
const SCORES = path.join(DIR, '..', 'data', 'scores.json');
const FORMULAS = require(path.join(DIR, '..', 'formulas.js'));

const SHIMS = `
function f_GetRadioValue(id){var r=document.getElementsByName(id);for(var i=0;i<r.length;i++){if(r[i].checked)return r[i].value*1;}return 0;}
function f_GetFilename(){return '';}
`;

function attr(tag, name) { const m = tag.match(new RegExp(name + '="([^"]*)"', 'i')); return m ? m[1] : null; }

function parseInputs(html) {
  const radios = {}, checks = {}, numbers = new Set(), selects = {};
  for (const tag of html.match(/<input\b[^>]*>/gi) || []) {
    const type = (attr(tag, 'type') || '').toLowerCase(), name = attr(tag, 'name');
    if (!name) continue;
    if (type === 'radio') (radios[name] = radios[name] || []).push(parseFloat(attr(tag, 'value')) || 0);
    else if (type === 'checkbox') checks[name] = parseFloat(attr(tag, 'value')) || 0;
    else if (type === 'number') numbers.add(name);
  }
  for (const sb of html.match(/<select\b[^>]*>[\s\S]*?<\/select>/gi) || []) {
    const nm = attr(sb, 'name'); if (!nm) continue;
    const opts = [...sb.matchAll(/<option[^>]*value="([^"]*)"/gi)].map(m => parseFloat(m[1]) || 0);
    selects[nm] = opts.length ? opts : [0];
  }
  return { radios, checks, numbers: [...numbers], selects };
}

function balancedFCalc(src) {
  const m = /function\s+f_Calculer\s*\([^)]*\)\s*\{/.exec(src);
  if (!m) return null;
  let i = m.index + m[0].length, d = 1;
  while (i < src.length && d > 0) { const c = src[i]; if (c === '{') d++; else if (c === '}') d--; i++; }
  return src.slice(m.index, i);
}

function randVector(inputs) {
  const v = {};
  for (const [n, vals] of Object.entries(inputs.radios)) v[n] = vals[Math.floor(Math.random() * vals.length)];
  for (const [n, val] of Object.entries(inputs.checks)) v[n] = Math.random() < 0.5 ? 1 : 0;
  for (const n of inputs.numbers) v[n] = Math.round((Math.random() * 60 + 20) * 10) / 10; // 20..80
  for (const [n, opts] of Object.entries(inputs.selects)) v[n] = opts[Math.floor(Math.random() * opts.length)];
  return v;
}

function makeSandbox(inputs, vector) {
  const byName = {};
  const store = { Resultat: { value: '' } };
  const Form = new Proxy(store, { get: (t, p) => (typeof p === 'string' && !(p in t)) ? (t[p] = { value: '', checked: false }) : t[p] });
  for (const [n, vals] of Object.entries(inputs.radios)) {
    // RadioNodeList : tableau indexable ([i].checked) ET .value = valeur cochée
    const arr = vals.map(x => ({ value: String(x), checked: x === vector[n] }));
    const checked = arr.find(e => e.checked);
    arr.value = checked ? checked.value : '';
    arr.checked = !!checked;
    byName[n] = arr;
    Form[n] = arr;
  }
  for (const [n, val] of Object.entries(inputs.checks)) { byName[n] = [{ value: String(val), checked: !!vector[n] }]; Form[n] = byName[n][0]; }
  for (const n of inputs.numbers) { Form[n] = { value: String(vector[n]) }; byName[n] = [{ value: String(vector[n]), checked: false }]; }
  for (const [n] of Object.entries(inputs.selects)) { Form[n] = { value: String(vector[n]) }; byName[n] = [{ value: String(vector[n]), checked: false }]; }
  const stubs = {};
  const document = {
    Form,
    getElementsByName: n => byName[n] || [],
    getElementById: id => Form[id] || (byName[id] && byName[id][0]) || (stubs[id] = stubs[id] || { value: '', checked: false, style: {} }),
    write: () => {},
  };
  return { document, window: {}, Math, parseFloat, parseInt, isNaN, Number, String, Date, MSSAndroidFunction: { storeHistory: () => {} }, console: { log() {} } };
}

function refOut(inputs, vector, fcalc, out) {
  const ctx = makeSandbox(inputs, vector); vm.createContext(ctx);
  try {
    vm.runInContext(SHIMS + '\n' + fcalc + '\n; try{f_Calculer();}catch(e){}', ctx, { timeout: 500 });
    return ctx.document.Form[out] ? ctx.document.Form[out].value : undefined;
  } catch (e) { return { __error: e.message }; }
}

function verifyNative(id, spec, N) {
  const html = fs.existsSync(path.join(CACHE, id + '.html')) ? fs.readFileSync(path.join(CACHE, id + '.html'), 'latin1') : null;
  if (!html) return { ok: false, raison: 'pas de cache' };
  const fcalc = balancedFCalc(html);
  if (!fcalc) return { ok: false, raison: 'pas de f_Calculer' };
  const inputs = parseInputs(html);
  let errs = 0;
  for (let i = 0; i < N; i++) {
    const v = randVector(inputs);
    const ref = refOut(inputs, v, fcalc, spec.out);
    if (ref && ref.__error) { errs++; continue; }
    const refNum = parseFloat(ref);
    let mine;
    try { mine = spec.fn(v); } catch (e) { return { ok: false, raison: 'erreur native: ' + e.message }; }
    if (isNaN(refNum) && isNaN(mine)) continue;
    if (isNaN(refNum) || Math.abs(refNum - mine) > 1e-6) {
      return { ok: false, raison: `écart vecteur ${i} (ref=${ref}, natif=${mine})` };
    }
  }
  if (errs > N * 0.2) return { ok: false, raison: `référence en erreur (${errs}/${N})` };
  return { ok: true, raison: `identique sur ${N - errs} vecteurs` };
}

const ARGV = { vectors: 200, one: null };
for (let i = 2; i < process.argv.length; i++) {
  if (process.argv[i] === '--vectors') ARGV.vectors = parseInt(process.argv[++i]);
  if (process.argv[i] === '--one') ARGV.one = process.argv[++i];
}

function main() {
  const data = JSON.parse(fs.readFileSync(SCORES, 'utf8'));
  const byId = Object.fromEntries(data.scores.map(s => [s.id, s]));
  let ok = 0, tot = 0;
  for (const [id, spec] of Object.entries(FORMULAS)) {
    if (ARGV.one && id !== ARGV.one) continue;
    const r = verifyNative(id, spec, ARGV.vectors);
    tot++;
    console.log(`${id.padEnd(18)} ${r.ok ? 'VALIDÉE ✓' : 'ÉCHEC ✗'}  ${r.raison}`);
    if (byId[id]) { byId[id].formule_native = true; byId[id].formule_verifiee = r.ok; }
    if (r.ok) ok++;
  }
  if (!ARGV.one) {
    fs.writeFileSync(SCORES, JSON.stringify(data, null, 2));
    console.log(`\nNatives validées: ${ok}/${tot}`);
  }
}
main();
