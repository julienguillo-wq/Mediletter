import re, json, os
from collections import Counter

base = os.path.dirname(os.path.abspath(__file__))
h = open(os.path.join(base, '..', 'index.html'), encoding='utf-8').read()
body = re.search(r'const CALCS = \[(.*?)\];', h, re.S).group(1)
entries = []
# id et cat sans apostrophe ; name best-effort sur la même ligne
for m in re.finditer(r"\{id:'([^']+)',[^\n]*?cat:'([^']+)'", body):
    nm = re.search(r"name:'([^']*)'", m.group(0))
    entries.append({"id": m.group(1), "nom": (nm.group(1) if nm else m.group(1)), "categorie": m.group(2)})
print("historiques:", len(entries), "| par cat:", dict(Counter(e["categorie"] for e in entries)))
os.makedirs(os.path.join(base, '_raw'), exist_ok=True)
json.dump(entries, open(os.path.join(base, '_raw', 'historiques.json'), 'w', encoding='utf-8'),
          ensure_ascii=False, indent=2)
