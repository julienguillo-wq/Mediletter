#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Pipeline d'extraction des scores medicalcul.free.fr -> scores.json

- Récupère l'index alphabétique, puis chaque page de score.
- Extrait : nom, spécialité (-> catégorie app), items/variables + options,
  formule brute (JS f_Calculer), texte d'interprétation, référence biblio.
- Sortie au schéma scores.json avec "valide": false (validation manuelle requise).

Notes :
- Les pages déclarent charset=utf-8 mais sont réellement encodées cp1252.
- On ancre l'extraction sur les CLASSES CSS (score_inter, score_ref,
  scoretitle_title) plutôt que sur des mots accentués -> robuste.
- Le texte d'interprétation est capturé BRUT (_interpretation_source) ; la
  reformulation (obligatoire avant production) est une étape séparée.

Usage:
    python scrape_medicalcul.py --index          # liste l'index
    python scrape_medicalcul.py --limit 5        # extrait 5 scores -> stdout
    python scrape_medicalcul.py --all            # extrait tout -> ../data/scores.json
    python scrape_medicalcul.py --local F.html   # parse un fichier local (debug)
"""
import re, json, sys, time, os, argparse, unicodedata, urllib.request
from html import unescape

BASE = "http://medicalcul.free.fr/"
INDEX = BASE + "_indexalpha.html"

def deaccent(s):
    return "".join(c for c in unicodedata.normalize("NFD", s or "") if unicodedata.category(c) != "Mn")

# Le site est en encodage MIXTE (corps latin-1, titres/blocs UTF-8). On décode
# en latin-1 (sans perte) puis on répare les séquences UTF-8 mal interprétées.
MOJIBAKE = {
    "Ã©": "é", "Ã¨": "è", "Ã\xa0": "à", "Ã ": "à", "Ã¢": "â", "Ãª": "ê", "Ã«": "ë",
    "Ã®": "î", "Ã¯": "ï", "Ã´": "ô", "Ã¶": "ö", "Ã¹": "ù", "Ã»": "û", "Ã¼": "ü",
    "Ã§": "ç", "Ã‰": "É", "Ãˆ": "È", "Ã€": "À", "Ã‡": "Ç", "Ã”": "Ô", "Ã‚": "Â",
    "Â°": "°", "Âµ": "µ", "Â²": "²", "Â³": "³", "Â½": "½", "Â ": " ", "Â": "",
    "â‰¥": "≥", "â‰¤": "≤", "â†’": "→", "â†‘": "↑", "â†“": "↓",
    "â€™": "’", "â€˜": "‘", "â€œ": "“", "â€\x9d": "”", "â€“": "–", "â€”": "—", "â€¢": "•", "â€¦": "…",
}
def fix_mojibake(s):
    for k, v in MOJIBAKE.items():
        if k in s:
            s = s.replace(k, v)
    return s

def decode_page(raw):
    return fix_mojibake(raw.decode("latin-1"))

# Spécialité medicalcul (sans accents, minuscules) -> catégorie MedApp
CAT_MAP = {
    "geriatrie": "geriatrie",
    "nephrologie": "nephro", "urologie": "nephro",
    "cardiologie": "cardio", "cardiovasculaire": "cardio",
    "neurologie": "neuro", "psychiatrie": "neuro",
    "pneumologie": "pneumo",
    "reanimation": "rea", "anesthesie": "rea", "anesthesie-reanimation": "rea", "urgences": "rea",
    "gastro-enterologie": "gastro", "hepato-gastro-enterologie": "gastro", "hepatologie": "gastro",
    "pediatrie": "pediatrie", "neonatologie": "pediatrie",
}

CACHE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "_cache")

def fetch(url, retries=4, backoff=2.0, use_cache=True):
    """Récupère une URL avec cache local (reprise) + retries à backoff exponentiel."""
    name = url.rsplit("/", 1)[-1] or "index.html"
    cache_path = os.path.join(CACHE_DIR, name)
    if use_cache and os.path.exists(cache_path) and os.path.getsize(cache_path) > 0:
        return decode_page(open(cache_path, "rb").read())
    last = None
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "MedApp-pipeline/1.0 (usage clinique interne)"})
            with urllib.request.urlopen(req, timeout=25) as r:
                raw = r.read()
            if use_cache:
                os.makedirs(CACHE_DIR, exist_ok=True)
                with open(cache_path, "wb") as f:
                    f.write(raw)
            return decode_page(raw)
        except Exception as e:
            last = e
            time.sleep(backoff * (attempt + 1))  # 2s, 4s, 6s, 8s
    raise last

def clean(s):
    s = unescape(s or "").replace("\xa0", " ")
    s = re.sub(r"<[^>]+>", " ", s)
    return re.sub(r"[ \t\r\n]+", " ", s).strip()

def slug_cat(specialite):
    return CAT_MAP.get(deaccent((specialite or "").strip().lower()), "general")

def parse_index(html):
    out, seen = [], set()
    for m in re.finditer(r'href="([a-z0-9_]+\.html)"\s*>\s*([^<]+)', html, re.I):
        page, label = m.group(1), clean(m.group(2))
        if page.startswith("_") or page.startswith("fr_") or not label or page in seen:
            continue
        seen.add(page)
        out.append({"page": page, "label": label})
    return out

def block_class(html, cls):
    """Contenu texte d'un <p class="cls">Label: ...</p>, sans le libellé de tête."""
    m = re.search(r'<p[^>]*class="' + cls + r'"[^>]*>(.*?)</p>', html, re.S | re.I)
    if not m:
        return ""
    txt = clean(m.group(1))
    return re.sub(r"^[^:]{0,25}:\s*", "", txt)  # retire "Interprétation:" / "Références:"

def attr(tag, name):
    m = re.search(name + r'="([^"]*)"', tag, re.I)
    return m.group(1) if m else None

def parse_score(page, html):
    sid = page[:-5]
    mt = re.search(r"<title>\s*Medicalcul\s*-\s*(.*?)\s*(?:~\s*(.*?))?\s*</title>", html, re.I | re.S)
    nom = clean(mt.group(1)) if mt else sid
    # nom canonique : préférer le titre du bloc score s'il existe
    bt = re.search(r'<[^>]*class="scoretitle_title"[^>]*>(.*?)<', html, re.S | re.I)
    if bt and clean(bt.group(1)):
        nom = clean(bt.group(1))
    specialite = clean(mt.group(2)) if (mt and mt.group(2)) else ""
    categorie = slug_cat(specialite)

    # Questions = <td colspan="2" ... font-weight: bold ...>Label</td>
    questions = [(m.start(), clean(m.group(1)))
                 for m in re.finditer(r'<td[^>]*colspan="2"[^>]*font-weight:\s*bold[^>]*>(.*?)</td>', html, re.S | re.I)]
    def question_for(pos):
        lab = ""
        for qp, qt in questions:
            if qp < pos:
                lab = qt
            else:
                break
        return lab

    def label_after(pos, span=300):
        seg = html[pos:pos + span]
        lm = re.search(r"<label[^>]*>(.*?)</label>", seg, re.S | re.I)
        return clean(lm.group(1)) if lm else ""

    radios, numeric, checks = {}, [], []
    for m in re.finditer(r"<input\b[^>]*>", html, re.I):
        tag = m.group(0)
        typ = (attr(tag, "type") or "").lower()
        name = attr(tag, "name")
        if not name:
            continue
        if typ == "radio":
            radios.setdefault(name, {"pos": m.start(), "options": []})["options"].append(
                {"label": label_after(m.end()), "valeur": attr(tag, "value") or ""})
        elif typ == "checkbox":
            lab = label_after(m.end()) or question_for(m.start())
            checks.append({"pos": m.start(), "name": name, "label": lab, "valeur": attr(tag, "value") or "1"})
        elif typ == "number":
            before = html[max(0, m.start() - 260):m.start()]
            chunks = [clean(c) for c in re.findall(r">([^<>]{2,70})<", before) if clean(c)]
            numeric.append({"pos": m.start(), "name": name, "label": chunks[-1] if chunks else name})

    # Selects (listes déroulantes)
    selects = []
    for m in re.finditer(r"<select\b[^>]*>(.*?)</select>", html, re.S | re.I):
        nm = attr(m.group(0), "name")
        if not nm:
            continue
        opts = [{"label": clean(o.group(2)), "valeur": o.group(1)}
                for o in re.finditer(r'<option[^>]*value="([^"]*)"[^>]*>(.*?)</option>', m.group(1), re.S | re.I)]
        before = html[max(0, m.start() - 260):m.start()]
        chunks = [clean(c) for c in re.findall(r">([^<>]{2,70})<", before) if clean(c)]
        lab = question_for(m.start()) or (chunks[-1] if chunks else nm)
        selects.append({"pos": m.start(), "name": nm, "label": lab, "options": opts})

    all_items = []
    for name, d in radios.items():
        all_items.append((d["pos"], {"type": "choix", "variable": name, "label": question_for(d["pos"]), "options": d["options"]}))
    for c in checks:
        all_items.append((c["pos"], {"type": "case", "variable": c["name"], "label": c["label"], "valeur": c["valeur"]}))
    for n in numeric:
        all_items.append((n["pos"], {"type": "nombre", "variable": n["name"], "label": n["label"]}))
    for s in selects:
        all_items.append((s["pos"], {"type": "liste", "variable": s["name"], "label": s["label"], "options": s["options"]}))
    items = [it for _, it in sorted(all_items, key=lambda x: x[0])]

    interp = block_class(html, "score_inter")
    reference = block_class(html, "score_ref")
    fm = re.search(r"function\s+f_Calculer\s*\([^)]*\)\s*\{(.*?)\n\s*\}", html, re.S | re.I)
    formule_raw = fm.group(1).strip() if fm else ""

    return {
        "id": sid,
        "nom": nom,
        "categorie": categorie,
        "specialite_source": specialite,
        "description": "",
        "items": items,
        "formule": "",                    # à dériver/valider depuis _formule_source
        "interpretation": [],             # à structurer {min,max,texte,severite} à la validation
        "reference": reference,
        "valide": False,
        "reformule": False,
        "source_url": BASE + page,
        "_interpretation_source": interp,
        "_formule_source": formule_raw,
    }

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--index", action="store_true")
    ap.add_argument("--limit", type=int, default=0)
    ap.add_argument("--all", action="store_true")
    ap.add_argument("--local")
    ap.add_argument("--out", default="../data/scores.json")
    ap.add_argument("--delay", type=float, default=0.4)
    args = ap.parse_args()

    if args.local:
        html = decode_page(open(args.local, "rb").read())
        page = os.path.basename(args.local).lstrip("_")
        print(json.dumps(parse_score(page, html), ensure_ascii=False, indent=2))
        return

    idx = parse_index(fetch(INDEX))
    print(f"[index] {len(idx)} scores", file=sys.stderr)
    if args.index:
        print(json.dumps(idx, ensure_ascii=False, indent=2))
        return

    subset = idx[:args.limit] if args.limit else idx
    scores, errors = [], []
    for i, it in enumerate(subset, 1):
        try:
            scores.append(parse_score(it["page"], fetch(BASE + it["page"])))
        except Exception as e:
            errors.append({"page": it["page"], "error": str(e)})
        if i % 25 == 0:
            print(f"  … {i}/{len(subset)}", file=sys.stderr)
        time.sleep(args.delay)

    out = {
        "meta": {
            "source": "medicalcul.free.fr",
            "genere_par": "pipeline/scrape_medicalcul.py",
            "total": len(scores),
            "avertissement": "Scores importés en valide:false. Formule et interprétation à "
                             "valider manuellement ; textes à reformuler avant mise en production.",
        },
        "scores": scores,
    }
    if args.all or not args.limit:
        path = os.path.join(os.path.dirname(os.path.abspath(__file__)), args.out)
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "w", encoding="utf-8") as f:
            json.dump(out, f, ensure_ascii=False, indent=2)
        print(f"[out] {path} — {len(scores)} scores, {len(errors)} erreurs", file=sys.stderr)
    else:
        print(json.dumps(out, ensure_ascii=False, indent=2))
    if errors:
        print(f"[errors] {len(errors)}: {errors[:5]}", file=sys.stderr)

if __name__ == "__main__":
    main()
