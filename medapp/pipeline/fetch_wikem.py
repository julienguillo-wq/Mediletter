#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Pipeline d'extraction WikEM (wikem.org) -> raw_wikem.json (matière première)

- Utilise l'API MediaWiki (action=parse / action=query), préférée au scraping.
- Récupère wikitext + sections + date de dernière révision de chaque page ciblée.
- Parse le wikitext en arbre de sections {titre, niveau, contenu[]} avec détection
  du type (texte / etapes / tableau_poso).
- Sortie BRUTE en anglais (pipeline/_raw/raw_wikem.json, gitignoré).

Étape suivante (séparée, IA) : traduction française + adaptation gériatrique/recos
françaises -> guidelines.json (schéma app), valide:false, attribution WikEM CC BY-SA.

WikEM est sous licence CC BY-SA : attribution obligatoire dans le livrable.
"""
import re, json, sys, os, time, argparse, urllib.request, urllib.parse

API = "https://wikem.org/w/api.php"
UA = "MedApp-pipeline/1.0 (usage clinique interne; contact julien.guillo@mjtransports.com)"

# Pages WikEM ciblées -> (id app, catégorie app)
TARGETS = [
    ("Delirium",                      "delirium",   "geria"),
    ("Urinary_tract_infection",       "iu",         "infec"),
    ("Community_acquired_pneumonia",  "pac",        "infec"),
    ("Syncope",                       "syncope",    "geria"),
    ("Geriatric_trauma",              "chutes_trauma", "geria"),
    ("Hyponatremia",                  "hyponatremie", "geria"),
]

def api_get(params):
    params = {**params, "format": "json"}
    url = API + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read().decode("utf-8"))

def get_page(title):
    parse = api_get({"action": "parse", "page": title, "prop": "wikitext|sections|displaytitle"})
    if "error" in parse:
        raise RuntimeError(parse["error"].get("info", "erreur API"))
    p = parse["parse"]
    wikitext = p["wikitext"]["*"]
    # date de dernière révision
    q = api_get({"action": "query", "prop": "revisions", "titles": title, "rvprop": "timestamp", "rvlimit": 1})
    pages = q["query"]["pages"]
    ts = ""
    for _, pg in pages.items():
        revs = pg.get("revisions", [])
        if revs:
            ts = revs[0]["timestamp"]
    return p.get("title", title), wikitext, ts

def strip_wikitext(s):
    s = re.sub(r"\{\{[^{}]*\}\}", "", s)                 # templates
    s = re.sub(r"\[\[([^|\]]*\|)?([^\]]+)\]\]", r"\2", s)  # [[a|b]] -> b
    s = re.sub(r"'''([^']+)'''", r"\1", s)                # gras
    s = re.sub(r"''([^']+)''", r"\1", s)                  # italique
    s = re.sub(r"<ref[^>]*>.*?</ref>", "", s, flags=re.S) # refs inline
    s = re.sub(r"<ref[^>]*/>", "", s)
    s = re.sub(r"<[^>]+>", "", s)                          # html résiduel
    s = s.replace("&nbsp;", " ")
    return s.strip()

def parse_sections(wikitext):
    """Découpe le wikitext en sections de niveau 2 avec leurs listes/contenus."""
    parts = re.split(r"^(={2,4})\s*(.+?)\s*\1\s*$", wikitext, flags=re.M)
    # parts[0] = préambule ; puis triplets (niveau, titre, corps)
    sections = []
    preamble = parts[0].strip()
    if preamble:
        sections.append({"titre": "", "niveau": 1, "type": "texte", "contenu": [strip_wikitext(preamble)]})
    for i in range(1, len(parts), 3):
        level = len(parts[i])
        titre = strip_wikitext(parts[i + 1])
        body = parts[i + 2] if i + 2 < len(parts) else ""
        lines = [l.rstrip() for l in body.splitlines()]
        # détection type
        has_table = "{|" in body
        numbered = [l for l in lines if re.match(r"^\*#|^#", l)]
        bullets = [l for l in lines if re.match(r"^\*(?!#)", l)]
        if has_table:
            typ = "tableau_poso"
        elif len(numbered) >= 2:
            typ = "etapes"
        else:
            typ = "texte"
        # contenu : items de liste (nettoyés), en gardant la profondeur légère
        contenu = []
        for l in lines:
            m = re.match(r"^(\*+#?|#+)\s*(.+)$", l)
            if m:
                depth = len(m.group(1))
                txt = strip_wikitext(m.group(2))
                if txt:
                    contenu.append(("  " * (depth - 1)) + txt)
        if not contenu:
            t = strip_wikitext(body)
            if t:
                contenu = [t]
        sections.append({"titre": titre, "niveau": level, "type": typ, "contenu": contenu})
    return sections

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default="_raw/raw_wikem.json")
    ap.add_argument("--delay", type=float, default=1.0)
    ap.add_argument("--one")
    args = ap.parse_args()

    targets = [(args.one, args.one.lower(), "geria")] if args.one else TARGETS
    out = []
    for title, aid, cat in targets:
        try:
            real_title, wikitext, ts = get_page(title)
            secs = parse_sections(wikitext)
            out.append({
                "wikem_page": title, "wikem_title": real_title,
                "id": aid, "categorie": cat,
                "wikem_url": "https://wikem.org/wiki/" + title,
                "date_revision": ts, "sections_source": secs,
            })
            print(f"[ok] {title}: {len(secs)} sections, rév. {ts[:10]}", file=sys.stderr)
        except Exception as e:
            print(f"[err] {title}: {e}", file=sys.stderr)
        time.sleep(args.delay)

    base = os.path.dirname(os.path.abspath(__file__))
    path = os.path.join(base, args.out)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    json.dump({"source": "wikem.org", "licence": "CC BY-SA", "pages": out},
              open(path, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    print(f"[out] {path} — {len(out)} pages", file=sys.stderr)

if __name__ == "__main__":
    main()
