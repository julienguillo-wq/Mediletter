"""
Analyse des corrections de Martina Scattu pour amelioration du prompt readaptation.
Produit martina_analyse.md dans analysis_output/.
"""

import json
import sys
import os
import re
import statistics
from collections import Counter, defaultdict
from difflib import SequenceMatcher, unified_diff

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

BASE = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR = os.path.join(BASE, "analysis_output")

# ── Load data ────────────────────────────────────────────────────────────
with open(os.path.join(OUTPUT_DIR, "martina_corrections_bon_prompt.json"), "r", encoding="utf-8") as f:
    bon_prompt = json.load(f)

with open(os.path.join(OUTPUT_DIR, "martina_validated_only.json"), "r", encoding="utf-8") as f:
    val_only = json.load(f)

# ── Helpers ──────────────────────────────────────────────────────────────

def sim_ratio(a: str, b: str) -> float:
    if not a and not b:
        return 1.0
    if not a or not b:
        return 0.0
    return SequenceMatcher(None, a, b).ratio()


def fuzzy_match(a: str, b: str, threshold=0.7) -> bool:
    return sim_ratio(a.lower(), b.lower()) >= threshold


STOPWORDS_FR = set("""
le la les un une des de du d l en au aux et ou mais ni car que qui dont
a est sont ont fait par pour avec dans sur sans plus en ne pas ce cette
ces son sa ses leur leurs se il elle ils elles nous vous je tu on me te
lui y
""".split())


def extract_medical_terms(texts: list[str], top_n=50) -> list[tuple[str, int]]:
    counter = Counter()
    for text in texts:
        words = re.findall(r'[A-Za-zÀ-ÿ]{3,}', text)
        for w in words:
            wl = w.lower()
            if wl not in STOPWORDS_FR and len(wl) >= 4:
                counter[wl] += 1
    return counter.most_common(top_n)


def find_structural_markers(texts: list[str]) -> Counter:
    """Find recurring section headers like 'Contexte :', 'Discussion :', etc."""
    counter = Counter()
    for text in texts:
        markers = re.findall(r'^([A-ZÀ-Ÿ][A-Za-zÀ-ÿ\s/\'-]+)\s*:', text, re.MULTILINE)
        for m in markers:
            m_clean = m.strip()
            if len(m_clean) > 2 and len(m_clean) < 60:
                counter[m_clean] += 1
    return counter


# ══════════════════════════════════════════════════════════════════════════
# COUCHE 1 — Similarite quantitative
# ══════════════════════════════════════════════════════════════════════════

print("Couche 1 - Similarite quantitative...")

c1_lines = []
c1_lines.append("# Analyse des corrections de Martina Scattu (readaptation)\n")
c1_lines.append("*Genere automatiquement le 2026-04-16. Donnees factuelles uniquement.*\n")
c1_lines.append("---\n")
c1_lines.append("## Couche 1 -- Similarite quantitative\n")
c1_lines.append("*Source : `martina_corrections_bon_prompt.json` (4 lignes, 3 sessions)*\n")

# Per-pair similarity
section_sims = []
problem_sims = []
all_sims = []

c1_lines.append("\n### 1.1 Similarite par paire\n")
c1_lines.append("| # | type | probleme_name | similarite | delta chars |")
c1_lines.append("|---|------|---------------|------------|------------|")

for i, row in enumerate(bon_prompt):
    gen = row.get("generated")
    val = row.get("validated")
    typ = row.get("type", "?")
    pname = row.get("probleme_name") or "(liste de problemes)"

    if typ == "problems":
        gen_str = "\n".join(gen) if isinstance(gen, list) else str(gen or "")
        val_str = "\n".join(val) if isinstance(val, list) else str(val or "")
    else:
        gen_str = str(gen or "")
        val_str = str(val or "")

    s = sim_ratio(gen_str, val_str)
    delta = len(val_str) - len(gen_str)
    all_sims.append(s)
    if typ == "section":
        section_sims.append(s)
    else:
        problem_sims.append(s)

    pname_short = pname[:70] + "..." if len(pname) > 70 else pname
    c1_lines.append(f"| {i+1} | {typ} | {pname_short} | {s:.1%} | {delta:+d} |")

c1_lines.append("")

# Aggregated by type
c1_lines.append("### 1.2 Similarite par type\n")
c1_lines.append("| type | n | moyenne | mediane | min | max |")
c1_lines.append("|------|---|---------|---------|-----|-----|")
if section_sims:
    c1_lines.append(f"| section | {len(section_sims)} | {statistics.mean(section_sims):.1%} | {statistics.median(section_sims):.1%} | {min(section_sims):.1%} | {max(section_sims):.1%} |")
if problem_sims:
    c1_lines.append(f"| problems | {len(problem_sims)} | {statistics.mean(problem_sims):.1%} | {statistics.median(problem_sims):.1%} | {min(problem_sims):.1%} | {max(problem_sims):.1%} |")
c1_lines.append(f"| **global** | {len(all_sims)} | {statistics.mean(all_sims):.1%} | {statistics.median(all_sims):.1%} | {min(all_sims):.1%} | {max(all_sims):.1%} |")
c1_lines.append("")

# Stats globales
c1_lines.append("### 1.3 Stats globales\n")
c1_lines.append(f"- Nombre de paires : {len(all_sims)}")
c1_lines.append(f"- Moyenne : {statistics.mean(all_sims):.1%}")
c1_lines.append(f"- Mediane : {statistics.median(all_sims):.1%}")
c1_lines.append(f"- Min : {min(all_sims):.1%}")
c1_lines.append(f"- Max : {max(all_sims):.1%}")
if len(all_sims) > 1:
    c1_lines.append(f"- Ecart-type : {statistics.stdev(all_sims):.1%}")
c1_lines.append("")


# ══════════════════════════════════════════════════════════════════════════
# COUCHE 2 — Analyse structurelle des changements
# ══════════════════════════════════════════════════════════════════════════

print("Couche 2 - Analyse structurelle...")

c2_lines = []
c2_lines.append("---\n")
c2_lines.append("## Couche 2 -- Analyse structurelle des changements\n")
c2_lines.append("*Source : `martina_corrections_bon_prompt.json`*\n")

all_suppressions_problems = []
all_ajouts_problems = []
all_reformulations_problems = []

for i, row in enumerate(bon_prompt):
    gen = row.get("generated")
    val = row.get("validated")
    typ = row.get("type", "?")
    pname = row.get("probleme_name") or "(liste de problemes)"

    # Check if there are actual changes
    if typ == "problems":
        if gen == val:
            continue
    else:
        if str(gen or "").strip() == str(val or "").strip():
            continue

    c2_lines.append(f"### Paire {i+1} — type={typ}\n")
    if pname:
        c2_lines.append(f"**Probleme :** {pname}\n")

    if typ == "problems":
        gen_list = gen if isinstance(gen, list) else []
        val_list = val if isinstance(val, list) else []

        gen_set = set(gen_list)
        val_set = set(val_list)

        # Exact matches
        exact_common = gen_set & val_set
        gen_only = list(gen_set - exact_common)
        val_only_items = list(val_set - exact_common)

        # Fuzzy match the remainders
        reformulated = []
        truly_removed = []
        truly_added = list(val_only_items)

        for g_item in gen_only:
            matched = False
            for v_item in truly_added:
                if fuzzy_match(g_item, v_item):
                    reformulated.append((g_item, v_item))
                    truly_added.remove(v_item)
                    matched = True
                    break
            if not matched:
                truly_removed.append(g_item)

        all_suppressions_problems.extend(truly_removed)
        all_ajouts_problems.extend(truly_added)
        all_reformulations_problems.extend(reformulated)

        c2_lines.append(f"**Generated** : {len(gen_list)} problemes | **Validated** : {len(val_list)} problemes\n")

        if truly_removed:
            c2_lines.append("**Supprimes** :")
            for item in truly_removed:
                c2_lines.append(f"- ~~{item}~~")
            c2_lines.append("")

        if truly_added:
            c2_lines.append("**Ajoutes** :")
            for item in truly_added:
                c2_lines.append(f"- **{item}**")
            c2_lines.append("")

        if reformulated:
            c2_lines.append("**Reformules** :")
            for g_item, v_item in reformulated:
                c2_lines.append(f"- `{g_item}` -> `{v_item}`")
            c2_lines.append("")

        if exact_common:
            c2_lines.append(f"**Conserves identiques** : {len(exact_common)} problemes")
            for item in sorted(exact_common):
                c2_lines.append(f"- {item}")
            c2_lines.append("")

    elif typ == "section":
        gen_str = str(gen or "")
        val_str = str(val or "")
        gen_lines = gen_str.splitlines()
        val_lines = val_str.splitlines()

        diff = list(unified_diff(gen_lines, val_lines, lineterm="", n=1))

        # Classify changes
        removed_lines = []
        added_lines = []

        for line in diff:
            if line.startswith("---") or line.startswith("+++") or line.startswith("@@"):
                continue
            if line.startswith("-"):
                removed_lines.append(line[1:])
            elif line.startswith("+"):
                added_lines.append(line[1:])

        # Match removed/added for reformulations
        reformulated_section = []
        pure_removed = []
        pure_added = list(added_lines)

        for rem in removed_lines:
            if not rem.strip():
                continue
            best_match = None
            best_sim = 0
            for j, add in enumerate(pure_added):
                s = sim_ratio(rem, add)
                if s > best_sim and s >= 0.5:
                    best_sim = s
                    best_match = j
            if best_match is not None:
                reformulated_section.append((rem, pure_added[best_match], best_sim))
                pure_added.pop(best_match)
            else:
                pure_removed.append(rem)

        # Filter empty lines from pure_added
        pure_added = [a for a in pure_added if a.strip()]

        c2_lines.append(f"Suppressions pures : {len(pure_removed)} lignes | "
                       f"Ajouts purs : {len(pure_added)} lignes | "
                       f"Reformulations : {len(reformulated_section)} lignes\n")

        if pure_removed:
            c2_lines.append("**Lignes supprimees** :")
            c2_lines.append("```")
            for line in pure_removed:
                c2_lines.append(line)
            c2_lines.append("```")
            c2_lines.append("")

        if pure_added:
            c2_lines.append("**Lignes ajoutees** :")
            c2_lines.append("```")
            for line in pure_added:
                c2_lines.append(line)
            c2_lines.append("```")
            c2_lines.append("")

        if reformulated_section:
            c2_lines.append("**Reformulations** :")
            for rem, add, s in reformulated_section:
                c2_lines.append(f"- ({s:.0%}) `{rem[:100]}` -> `{add[:100]}`")
            c2_lines.append("")

# Summary of problem changes
c2_lines.append("### Resume des changements sur les listes de problemes\n")
c2_lines.append(f"**Total problemes supprimes : {len(all_suppressions_problems)}**\n")
for p in all_suppressions_problems:
    c2_lines.append(f"- {p}")
c2_lines.append("")
c2_lines.append(f"**Total problemes ajoutes : {len(all_ajouts_problems)}**\n")
for p in all_ajouts_problems:
    c2_lines.append(f"- {p}")
c2_lines.append("")
c2_lines.append(f"**Total reformulations : {len(all_reformulations_problems)}**\n")
for g, v in all_reformulations_problems:
    c2_lines.append(f"- `{g}` -> `{v}`")
c2_lines.append("")


# ══════════════════════════════════════════════════════════════════════════
# COUCHE 2bis — Style cible (validated_only)
# ══════════════════════════════════════════════════════════════════════════

print("Couche 2bis - Style cible...")

c2b_lines = []
c2b_lines.append("---\n")
c2b_lines.append("## Couche 2bis -- Analyse du style cible (validated uniquement)\n")
c2b_lines.append("*Source : `martina_validated_only.json` (81 lignes, 13 sessions, 19 mars - 16 avril 2026)*\n")

# Separate by type
sections_val = [r for r in val_only if r.get("type") == "section"]
problems_val = [r for r in val_only if r.get("type") == "problems"]

# ── Sections analysis ────────────────────────────────────────────────────
c2b_lines.append("### 2bis.1 Sections (type=section)\n")
c2b_lines.append(f"Nombre de sections : {len(sections_val)}\n")

section_texts = [str(r.get("validated", "")) for r in sections_val if r.get("validated")]
section_lengths_chars = [len(t) for t in section_texts]
section_lengths_lines = [len(t.splitlines()) for t in section_texts]

if section_lengths_chars:
    c2b_lines.append("#### Longueur des sections\n")
    c2b_lines.append("| Metrique | chars | lignes |")
    c2b_lines.append("|----------|-------|--------|")
    c2b_lines.append(f"| Moyenne | {statistics.mean(section_lengths_chars):.0f} | {statistics.mean(section_lengths_lines):.0f} |")
    c2b_lines.append(f"| Mediane | {statistics.median(section_lengths_chars):.0f} | {statistics.median(section_lengths_lines):.0f} |")
    c2b_lines.append(f"| Min | {min(section_lengths_chars)} | {min(section_lengths_lines)} |")
    c2b_lines.append(f"| Max | {max(section_lengths_chars)} | {max(section_lengths_lines)} |")
    c2b_lines.append("")

# Structural markers
markers = find_structural_markers(section_texts)
if markers:
    c2b_lines.append("#### Marqueurs structurels recurrents\n")
    c2b_lines.append("| Marqueur | Occurrences |")
    c2b_lines.append("|----------|-------------|")
    for marker, count in markers.most_common(25):
        c2b_lines.append(f"| {marker} | {count} |")
    c2b_lines.append("")

# Paragraph beginnings
para_starts = Counter()
for text in section_texts:
    for line in text.splitlines():
        line = line.strip()
        if len(line) > 10:
            # Get first 5 words
            words = line.split()[:5]
            start = " ".join(words)
            para_starts[start] += 1

recurring_starts = [(s, c) for s, c in para_starts.most_common(30) if c >= 2]
if recurring_starts:
    c2b_lines.append("#### Debuts de paragraphe recurrents (>= 2 occurrences)\n")
    c2b_lines.append("| Debut | Occurrences |")
    c2b_lines.append("|-------|-------------|")
    for start, count in recurring_starts:
        c2b_lines.append(f"| {start} | {count} |")
    c2b_lines.append("")

# Medical vocabulary
terms = extract_medical_terms(section_texts, top_n=50)
if terms:
    c2b_lines.append("#### Top 50 termes medicaux/techniques\n")
    c2b_lines.append("| Rang | Terme | Freq |")
    c2b_lines.append("|------|-------|------|")
    for rank, (term, freq) in enumerate(terms, 1):
        c2b_lines.append(f"| {rank} | {term} | {freq} |")
    c2b_lines.append("")

# Prose vs list usage
list_count = 0
prose_count = 0
for text in section_texts:
    for line in text.splitlines():
        stripped = line.strip()
        if stripped.startswith("- ") or stripped.startswith("* ") or re.match(r'^\d+[\.\)]\s', stripped):
            list_count += 1
        elif len(stripped) > 20:
            prose_count += 1

c2b_lines.append("#### Prose vs listes\n")
c2b_lines.append(f"- Lignes de prose (>20 chars, sans puce) : {prose_count}")
c2b_lines.append(f"- Lignes de liste (avec tiret/puce/numero) : {list_count}")
c2b_lines.append(f"- Ratio prose/liste : {prose_count/max(list_count,1):.1f}:1")
c2b_lines.append("")

# ── Problems analysis ────────────────────────────────────────────────────
c2b_lines.append("### 2bis.2 Problemes (type=problems)\n")
c2b_lines.append(f"Nombre de listes de problemes : {len(problems_val)}\n")

problem_lists = [r.get("validated", []) for r in problems_val if isinstance(r.get("validated"), list)]
problem_counts = [len(pl) for pl in problem_lists]

if problem_counts:
    c2b_lines.append("#### Distribution du nombre de problemes par liste\n")
    c2b_lines.append("| Metrique | Valeur |")
    c2b_lines.append("|----------|--------|")
    c2b_lines.append(f"| Moyenne | {statistics.mean(problem_counts):.1f} |")
    c2b_lines.append(f"| Mediane | {statistics.median(problem_counts):.0f} |")
    c2b_lines.append(f"| Min | {min(problem_counts)} |")
    c2b_lines.append(f"| Max | {max(problem_counts)} |")
    c2b_lines.append("")

    # Distribution
    count_dist = Counter(problem_counts)
    c2b_lines.append("| Nb problemes | Nb sessions |")
    c2b_lines.append("|-------------|-------------|")
    for n in sorted(count_dist.keys()):
        c2b_lines.append(f"| {n} | {count_dist[n]} |")
    c2b_lines.append("")

# Most frequent problem labels
all_problem_labels = []
for pl in problem_lists:
    all_problem_labels.extend(pl)

label_freq = Counter(all_problem_labels)
c2b_lines.append("#### Libelles de problemes les plus frequents\n")
c2b_lines.append("| Libelle | Freq |")
c2b_lines.append("|---------|------|")
for label, freq in label_freq.most_common(30):
    label_display = label[:90] + "..." if len(label) > 90 else label
    c2b_lines.append(f"| {label_display} | {freq} |")
c2b_lines.append("")

# Diagnostic principals
diag_principals = [r.get("diagnostic_principal", "") for r in val_only if r.get("diagnostic_principal")]
diag_freq = Counter(diag_principals)
c2b_lines.append("#### Diagnostics principaux\n")
c2b_lines.append("| Diagnostic principal | Freq |")
c2b_lines.append("|---------------------|------|")
for d, f in diag_freq.most_common(20):
    d_display = d[:90] + "..." if len(d) > 90 else d
    c2b_lines.append(f"| {d_display} | {f} |")
c2b_lines.append("")

# Per-probleme_name distribution for sections
pname_counter = Counter()
for r in sections_val:
    pn = r.get("probleme_name", "N/A") or "N/A"
    pname_counter[pn] += 1

c2b_lines.append("#### Sections par probleme_name\n")
c2b_lines.append("| probleme_name | Nb sections |")
c2b_lines.append("|---------------|-------------|")
for pn, cnt in pname_counter.most_common(30):
    pn_display = pn[:85] + "..." if len(pn) > 85 else pn
    c2b_lines.append(f"| {pn_display} | {cnt} |")
c2b_lines.append("")


# ══════════════════════════════════════════════════════════════════════════
# COUCHE 3 — Preparation pour analyse qualitative
# ══════════════════════════════════════════════════════════════════════════

print("Couche 3 - Preparation qualitative...")

c3_lines = []
c3_lines.append("---\n")
c3_lines.append("## Couche 3 -- Echantillons pour analyse qualitative\n")

# ── 3.1 Most corrected pairs from bon_prompt ─────────────────────────────
c3_lines.append("### 3.1 Paires les plus corrigees (martina_corrections_bon_prompt.json)\n")
c3_lines.append("*Triees par effort de correction decroissant (similarite croissante)*\n")

# Compute similarity for all pairs and sort
pairs_with_sim = []
for i, row in enumerate(bon_prompt):
    gen = row.get("generated")
    val = row.get("validated")
    typ = row.get("type", "?")

    if typ == "problems":
        gen_str = "\n".join(gen) if isinstance(gen, list) else str(gen or "")
        val_str = "\n".join(val) if isinstance(val, list) else str(val or "")
    else:
        gen_str = str(gen or "")
        val_str = str(val or "")

    s = sim_ratio(gen_str, val_str)
    pairs_with_sim.append((s, i, row))

pairs_with_sim.sort(key=lambda x: x[0])  # most corrected first

# Take top 5 (or all 4 if fewer)
top_corrected = pairs_with_sim[:5]

for rank, (s, idx, row) in enumerate(top_corrected, 1):
    gen = row.get("generated")
    val = row.get("validated")
    typ = row.get("type", "?")
    pname = row.get("probleme_name") or "(liste de problemes)"
    diag = row.get("diagnostic_principal", "N/A")
    ts = row.get("timestamp", "N/A")

    c3_lines.append(f"#### Paire {rank} (similarite {s:.1%}, type={typ})\n")
    c3_lines.append(f"- **probleme_name** : {pname}")
    c3_lines.append(f"- **diagnostic_principal** : {diag}")
    c3_lines.append(f"- **timestamp** : {ts}")
    c3_lines.append("")

    if typ == "problems":
        c3_lines.append("**Generated** :")
        c3_lines.append("```")
        if isinstance(gen, list):
            for item in gen:
                c3_lines.append(f"- {item}")
        else:
            c3_lines.append(str(gen))
        c3_lines.append("```")
        c3_lines.append("")
        c3_lines.append("**Validated** :")
        c3_lines.append("```")
        if isinstance(val, list):
            for item in val:
                c3_lines.append(f"- {item}")
        else:
            c3_lines.append(str(val))
        c3_lines.append("```")
    else:
        c3_lines.append("**Generated** :")
        c3_lines.append("```")
        c3_lines.append(str(gen or ""))
        c3_lines.append("```")
        c3_lines.append("")
        c3_lines.append("**Validated** :")
        c3_lines.append("```")
        c3_lines.append(str(val or ""))
        c3_lines.append("```")

    c3_lines.append("")

# ── 3.2 Representative validated samples ────────────────────────────────
c3_lines.append("### 3.2 Echantillons representatifs (martina_validated_only.json)\n")
c3_lines.append("*10 echantillons couvrant differents types et probleme_name*\n")

# Select diverse samples
# Group by (type, probleme_name)
by_type_pname = defaultdict(list)
for r in val_only:
    key = (r.get("type", "?"), r.get("probleme_name") or "N/A")
    by_type_pname[key].append(r)

# Pick samples to maximize coverage
selected = []
# First, pick all problems type (usually fewer)
for key in sorted(by_type_pname.keys()):
    if key[0] == "problems" and len(selected) < 3:
        selected.append(by_type_pname[key][0])

# Then pick sections with different probleme_name
seen_pnames = set()
for key in sorted(by_type_pname.keys(), key=lambda k: -len(by_type_pname[k])):
    if key[0] == "section" and key[1] not in seen_pnames and len(selected) < 10:
        # Pick the one with longest validated text (most representative)
        candidates = by_type_pname[key]
        best = max(candidates, key=lambda r: len(str(r.get("validated", ""))))
        selected.append(best)
        seen_pnames.add(key[1])

for rank, row in enumerate(selected, 1):
    val = row.get("validated")
    typ = row.get("type", "?")
    pname = row.get("probleme_name") or "(liste de problemes)"
    diag = row.get("diagnostic_principal", "N/A")
    ts = row.get("timestamp", "N/A")
    sid = row.get("session_id", "N/A")

    c3_lines.append(f"#### Echantillon {rank} (type={typ})\n")
    c3_lines.append(f"- **session_id** : {sid}")
    c3_lines.append(f"- **probleme_name** : {pname}")
    c3_lines.append(f"- **diagnostic_principal** : {diag}")
    c3_lines.append(f"- **timestamp** : {ts}")
    c3_lines.append("")

    c3_lines.append("**Validated** :")
    c3_lines.append("```")
    if isinstance(val, list):
        for item in val:
            c3_lines.append(f"- {item}")
    else:
        c3_lines.append(str(val or ""))
    c3_lines.append("```")
    c3_lines.append("")


# ── 3.3 Aggregated patterns ─────────────────────────────────────────────
c3_lines.append("### 3.3 Agregats des changements les plus frequents\n")

# Suppressions
c3_lines.append(f"#### Suppressions de problemes ({len(all_suppressions_problems)} total)\n")
if all_suppressions_problems:
    # Group similar ones
    supp_counter = Counter()
    for p in all_suppressions_problems:
        # Normalize: lowercase first few words
        key_words = " ".join(p.lower().split()[:4])
        supp_counter[key_words] += 1

    c3_lines.append("**Categories de problemes systematiquement supprimes** :\n")
    c3_lines.append("| Categorie (premiers mots) | Freq | Exemples |")
    c3_lines.append("|---------------------------|------|----------|")

    # Group suppressions by keyword category
    categories = defaultdict(list)
    for p in all_suppressions_problems:
        key = " ".join(p.lower().split()[:3])
        categories[key].append(p)

    for key in sorted(categories.keys(), key=lambda k: -len(categories[k])):
        examples = categories[key]
        example_text = examples[0][:70]
        c3_lines.append(f"| {key} | {len(examples)} | {example_text} |")
    c3_lines.append("")

    c3_lines.append("**Liste complete des problemes supprimes** :\n")
    for p in all_suppressions_problems:
        c3_lines.append(f"- {p}")
    c3_lines.append("")
else:
    c3_lines.append("Aucune suppression.\n")

# Reformulations
c3_lines.append(f"#### Reformulations de problemes ({len(all_reformulations_problems)} total)\n")
if all_reformulations_problems:
    for g, v in all_reformulations_problems:
        c3_lines.append(f"- `{g}` -> `{v}`")
    c3_lines.append("")
else:
    c3_lines.append("Aucune reformulation detectee.\n")

# Ajouts
c3_lines.append(f"#### Ajouts de problemes ({len(all_ajouts_problems)} total)\n")
if all_ajouts_problems:
    for p in all_ajouts_problems:
        c3_lines.append(f"- {p}")
    c3_lines.append("")
else:
    c3_lines.append("Aucun ajout.\n")


# ══════════════════════════════════════════════════════════════════════════
# Write output
# ══════════════════════════════════════════════════════════════════════════

all_lines = c1_lines + c2_lines + c2b_lines + c3_lines
content = "\n".join(all_lines)

output_path = os.path.join(OUTPUT_DIR, "martina_analyse.md")
with open(output_path, "w", encoding="utf-8") as f:
    f.write(content)

size_kb = os.path.getsize(output_path) / 1024
print(f"\nRapport genere : {output_path}")
print(f"Taille : {size_kb:.1f} KB")
print(f"Sections : Couche 1 ({len(c1_lines)} lignes), Couche 2 ({len(c2_lines)} lignes), "
      f"Couche 2bis ({len(c2b_lines)} lignes), Couche 3 ({len(c3_lines)} lignes)")
