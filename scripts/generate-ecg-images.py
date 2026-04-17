#!/usr/bin/env python3
"""Generate ECG images from PhysioNet PTB-XL dataset for MedHub Quiz."""

import os
import sys
import json
import ast
import shutil
import subprocess
from pathlib import Path
import urllib.request
import tempfile

# ---------------------------------------------------------------------------
# 1. Install dependencies
# ---------------------------------------------------------------------------
subprocess.check_call(
    [sys.executable, '-m', 'pip', 'install',
     'wfdb', 'matplotlib', 'pandas', 'numpy',
     '--break-system-packages', '-q'],
    stdout=subprocess.DEVNULL,
    stderr=subprocess.DEVNULL,
)

import numpy as np
import pandas as pd
import wfdb
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.gridspec import GridSpec
from matplotlib.ticker import MultipleLocator

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------
SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent
OUTPUT_DIR = PROJECT_ROOT / "ecg" / "images"
MANIFEST_PATH = PROJECT_ROOT / "ecg" / "generated-manifest.json"
DATA_DIR = SCRIPT_DIR / "ptbxl_data"
BASE_URL = "https://physionet.org/files/ptb-xl/1.0.3/"

SAMPLING_RATE = 500  # 500 Hz records
LEAD_NAMES = ['I', 'II', 'III', 'aVR', 'aVL', 'aVF',
              'V1', 'V2', 'V3', 'V4', 'V5', 'V6']

# Standard 12-lead layout: 3 rows x 4 columns
LEAD_LAYOUT = [
    ['I',   'aVR', 'V1', 'V4'],
    ['II',  'aVL', 'V2', 'V5'],
    ['III', 'aVF', 'V3', 'V6'],
]

# ---------------------------------------------------------------------------
# Target pathologies
# ---------------------------------------------------------------------------
TARGETS = [
    {
        "slug": "normal-sinus-rhythm",
        "scp_codes": ["NORM"],
        "count": 5,
        "category": "rythmes_normaux",
        "pathology_fr": "Rythme sinusal normal",
        "pathology_en": "Normal Sinus Rhythm",
    },
    {
        "slug": "sinus-tachycardia",
        "scp_codes": ["STACH"],
        "count": 3,
        "category": "rythmes_normaux",
        "pathology_fr": "Tachycardie sinusale",
        "pathology_en": "Sinus Tachycardia",
    },
    {
        "slug": "sinus-bradycardia",
        "scp_codes": ["SBRAD"],
        "count": 3,
        "category": "rythmes_normaux",
        "pathology_fr": "Bradycardie sinusale",
        "pathology_en": "Sinus Bradycardia",
    },
    {
        "slug": "atrial-fibrillation",
        "scp_codes": ["AFIB"],
        "count": 5,
        "category": "arythmies_sv",
        "pathology_fr": "Fibrillation auriculaire",
        "pathology_en": "Atrial Fibrillation",
    },
    {
        "slug": "atrial-flutter",
        "scp_codes": ["AFLT"],
        "count": 3,
        "category": "arythmies_sv",
        "pathology_fr": "Flutter auriculaire",
        "pathology_en": "Atrial Flutter",
    },
    {
        "slug": "svt",
        "scp_codes": ["SVARR", "SVTAC", "PSVT"],
        "count": 3,
        "category": "arythmies_sv",
        "pathology_fr": "Tachycardie supraventriculaire",
        "pathology_en": "Supraventricular Tachycardia",
    },
    {
        "slug": "first-degree-av-block",
        "scp_codes": ["1AVB"],
        "count": 3,
        "category": "blocs",
        "pathology_fr": "BAV 1er degré",
        "pathology_en": "First Degree AV Block",
    },
    {
        "slug": "second-degree-av-block",
        "scp_codes": ["2AVB"],
        "count": 3,
        "category": "blocs",
        "pathology_fr": "BAV 2ème degré",
        "pathology_en": "Second Degree AV Block",
    },
    {
        "slug": "third-degree-av-block",
        "scp_codes": ["3AVB"],
        "count": 3,
        "category": "blocs",
        "pathology_fr": "BAV 3ème degré (complet)",
        "pathology_en": "Third Degree AV Block",
    },
    {
        "slug": "lbbb",
        "scp_codes": ["CLBBB"],
        "count": 3,
        "category": "blocs",
        "pathology_fr": "BBG complet",
        "pathology_en": "Left Bundle Branch Block",
    },
    {
        "slug": "rbbb",
        "scp_codes": ["CRBBB"],
        "count": 3,
        "category": "blocs",
        "pathology_fr": "BBD complet",
        "pathology_en": "Right Bundle Branch Block",
    },
    {
        "slug": "lafb",
        "scp_codes": ["LAFB"],
        "count": 2,
        "category": "blocs",
        "pathology_fr": "Hémibloc antérieur gauche",
        "pathology_en": "Left Anterior Fascicular Block",
    },
    {
        "slug": "stemi-anterior",
        "scp_codes": ["AMI", "ALMI"],
        "count": 5,
        "category": "ischemie",
        "pathology_fr": "STEMI antérieur",
        "pathology_en": "Anterior MI / STEMI",
    },
    {
        "slug": "stemi-inferior",
        "scp_codes": ["IMI", "ILMI"],
        "count": 5,
        "category": "ischemie",
        "pathology_fr": "STEMI inférieur",
        "pathology_en": "Inferior MI / STEMI",
    },
    {
        "slug": "posterior-mi",
        "scp_codes": ["PMI"],
        "count": 2,
        "category": "ischemie",
        "pathology_fr": "Infarctus postérieur",
        "pathology_en": "Posterior MI",
    },
    {
        "slug": "lvh",
        "scp_codes": ["LVH"],
        "count": 3,
        "category": "autres",
        "pathology_fr": "Hypertrophie ventriculaire gauche",
        "pathology_en": "Left Ventricular Hypertrophy",
    },
    {
        "slug": "wpw",
        "scp_codes": ["WPW"],
        "count": 2,
        "category": "autres",
        "pathology_fr": "Wolff-Parkinson-White",
        "pathology_en": "Wolff-Parkinson-White",
    },
    {
        "slug": "pacemaker",
        "scp_codes": ["PACE"],
        "count": 2,
        "category": "autres",
        "pathology_fr": "Rythme électro-entraîné",
        "pathology_en": "Pacemaker Rhythm",
    },
]

# ---------------------------------------------------------------------------
# Helpers – downloading
# ---------------------------------------------------------------------------

def download_file(url: str, dest: Path, retries: int = 3) -> bool:
    """Download a file from *url* to *dest*. Return True on success."""
    dest.parent.mkdir(parents=True, exist_ok=True)
    for attempt in range(retries):
        try:
            urllib.request.urlretrieve(url, str(dest))
            return True
        except Exception as exc:
            if attempt == retries - 1:
                print(f"  WARN: Failed to download {url}: {exc}")
                return False
    return False


def ensure_csv_files() -> tuple[Path, Path]:
    """Download the two metadata CSVs if not already present."""
    db_csv = DATA_DIR / "ptbxl_database.csv"
    scp_csv = DATA_DIR / "scp_statements.csv"
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    if not db_csv.exists():
        print("Downloading ptbxl_database.csv ...")
        ok = download_file(BASE_URL + "ptbxl_database.csv", db_csv)
        if not ok:
            sys.exit("ERROR: Could not download ptbxl_database.csv – aborting.")

    if not scp_csv.exists():
        print("Downloading scp_statements.csv ...")
        ok = download_file(BASE_URL + "scp_statements.csv", scp_csv)
        if not ok:
            sys.exit("ERROR: Could not download scp_statements.csv – aborting.")

    return db_csv, scp_csv


def download_record_files(record_path: str) -> bool:
    """Download the .dat and .hea for a 500Hz record.

    *record_path* is the value from the ``filename_hr`` column, e.g.
    ``records500/00000/00001_hr``.
    """
    for ext in (".dat", ".hea"):
        rel = record_path + ext
        dest = DATA_DIR / rel
        if dest.exists():
            continue
        url = BASE_URL + rel
        if not download_file(url, dest):
            return False
    return True


# ---------------------------------------------------------------------------
# Helpers – record selection
# ---------------------------------------------------------------------------

def parse_scp_codes(raw: str) -> dict:
    """Safely parse the scp_codes column."""
    try:
        return ast.literal_eval(raw)
    except Exception:
        return {}


def primary_code(codes: dict) -> str | None:
    """Return the SCP code with the highest likelihood."""
    if not codes:
        return None
    return max(codes, key=codes.get)


def select_records(df: pd.DataFrame) -> list[dict]:
    """Return a flat list of {target, row} dicts for records to generate."""
    selections: list[dict] = []
    used_ids: set[int] = set()

    for target in TARGETS:
        want = target["count"]
        codes_wanted = set(target["scp_codes"])

        # Candidates: primary SCP code is one of the wanted codes
        candidates = df[df["_primary_code"].isin(codes_wanted)].copy()

        # Fallback: if no primary matches, include records that CONTAIN
        # any wanted code (even with likelihood 0, e.g. SBRAD, SVARR)
        if candidates.empty:
            def _has_code(scp_dict):
                return bool(codes_wanted & set(scp_dict.keys()))
            candidates = df[df["_scp_dict"].apply(_has_code)].copy()

        # Sort: prefer high likelihood of the target code, then primary
        def _target_likelihood(scp_dict):
            return max((scp_dict.get(c, 0) for c in codes_wanted), default=0)
        candidates["_target_lh"] = candidates["_scp_dict"].apply(_target_likelihood)
        candidates = candidates.sort_values(
            ["_target_lh", "_primary_likelihood"], ascending=[False, False]
        )

        # Prefer validated_by_human if column exists
        if "validated_by_human" in candidates.columns:
            candidates = candidates.sort_values(
                ["validated_by_human", "_target_lh", "_primary_likelihood"],
                ascending=[False, False, False],
            )

        picked = 0
        for _, row in candidates.iterrows():
            if picked >= want:
                break
            rid = int(row["ecg_id"])
            if rid in used_ids:
                continue
            used_ids.add(rid)
            selections.append({"target": target, "row": row})
            picked += 1

        if picked == 0:
            print(f"  SKIP: No records found for {target['slug']}")
        elif picked < want:
            print(f"  NOTE: Only {picked}/{want} records for {target['slug']}")

    return selections


# ---------------------------------------------------------------------------
# ECG image generation
# ---------------------------------------------------------------------------

def generate_ecg_image(
    signal: np.ndarray,
    lead_names: list[str],
    output_path: Path,
):
    """Render a clinical-style 12-lead ECG image.

    Parameters
    ----------
    signal : ndarray, shape (n_samples, 12)
        ECG signal in physical units (mV) at 500 Hz.
    lead_names : list[str]
        Names of the 12 leads in column order.
    output_path : Path
        Where to write the PNG.
    """
    n_samples = signal.shape[0]
    duration = n_samples / SAMPLING_RATE  # total seconds

    # We show 2.5s per cell
    cell_seconds = 2.5
    cell_samples = int(cell_seconds * SAMPLING_RATE)  # 1250

    # Rhythm strip: 10s
    rhythm_seconds = min(10.0, duration)
    rhythm_samples = int(rhythm_seconds * SAMPLING_RATE)

    # Build lead-name → column-index map (case-insensitive: PTB-XL uses AVR/AVL/AVF)
    lead_idx = {name.upper(): i for i, name in enumerate(lead_names)}

    fig = plt.figure(figsize=(12, 8), dpi=100, facecolor='white')
    gs = GridSpec(
        4, 4,
        figure=fig,
        height_ratios=[1, 1, 1, 0.8],
        hspace=0.0,
        wspace=0.0,
    )

    def _setup_ax(ax, x_seconds, y_range=(-1.5, 1.5)):
        """Apply ECG paper styling to an axes."""
        ax.set_facecolor('white')
        ax.xaxis.set_minor_locator(MultipleLocator(0.04))
        ax.yaxis.set_minor_locator(MultipleLocator(0.1))
        ax.xaxis.set_major_locator(MultipleLocator(0.2))
        ax.yaxis.set_major_locator(MultipleLocator(0.5))
        ax.grid(which='minor', color='#FFC0C0', linewidth=0.3)
        ax.grid(which='major', color='#FF9090', linewidth=0.6)
        ax.set_xlim(0, x_seconds)
        ax.set_ylim(y_range[0], y_range[1])
        ax.tick_params(
            which='both', bottom=False, left=False,
            labelbottom=False, labelleft=False,
        )
        for spine in ax.spines.values():
            spine.set_visible(False)

    # Determine a global y-range based on the signal (clamp between ±1.5 and ±3)
    sig_max = np.nanmax(np.abs(signal[:rhythm_samples, :]))
    y_half = max(1.5, min(3.0, sig_max * 1.1))
    y_range = (-y_half, y_half)

    # --- 3 × 4 grid of leads ---
    for row_i, row_leads in enumerate(LEAD_LAYOUT):
        for col_j, lead_name in enumerate(row_leads):
            ax = fig.add_subplot(gs[row_i, col_j])
            _setup_ax(ax, cell_seconds, y_range)

            idx = lead_idx.get(lead_name.upper())
            if idx is not None:
                # Time offset: each column shows a consecutive 2.5s chunk
                start = col_j * cell_samples
                end = min(start + cell_samples, n_samples)
                if start < n_samples:
                    seg = signal[start:end, idx]
                    t = np.arange(len(seg)) / SAMPLING_RATE
                    ax.plot(t, seg, color='black', linewidth=0.8)

            # Lead label
            ax.text(
                0.04, y_range[1] - 0.15,
                lead_name,
                fontsize=8, color='#555555',
                va='top', ha='left',
                transform=ax.transData,
                fontfamily='sans-serif',
            )

    # --- Rhythm strip (Lead II, full width) ---
    ax_rhythm = fig.add_subplot(gs[3, :])
    _setup_ax(ax_rhythm, rhythm_seconds, y_range)

    idx_ii = lead_idx.get('II', 1)  # II is already uppercase, OK
    seg = signal[:rhythm_samples, idx_ii]
    t = np.arange(len(seg)) / SAMPLING_RATE
    ax_rhythm.plot(t, seg, color='black', linewidth=0.8)
    ax_rhythm.text(
        0.04, y_range[1] - 0.15,
        'II',
        fontsize=8, color='#555555',
        va='top', ha='left',
        transform=ax_rhythm.transData,
        fontfamily='sans-serif',
    )

    output_path.parent.mkdir(parents=True, exist_ok=True)
    fig.savefig(
        str(output_path),
        dpi=100,
        bbox_inches='tight',
        facecolor='white',
        pad_inches=0.1,
    )
    plt.close(fig)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    print("=" * 60)
    print("  ECG Image Generator — PhysioNet PTB-XL")
    print("=" * 60)

    # 1. Ensure metadata CSVs are available
    db_csv, scp_csv = ensure_csv_files()

    # 2. Load & parse metadata
    print("Loading ptbxl_database.csv ...")
    df = pd.read_csv(db_csv, index_col=None)
    df["_scp_dict"] = df["scp_codes"].apply(parse_scp_codes)
    df["_primary_code"] = df["_scp_dict"].apply(primary_code)
    df["_primary_likelihood"] = df["_scp_dict"].apply(
        lambda d: max(d.values()) if d else 0
    )

    # 3. Select records
    print("Selecting records for target pathologies ...")
    selections = select_records(df)
    total = len(selections)
    if total == 0:
        sys.exit("ERROR: No matching records found — nothing to generate.")
    print(f"  → {total} records selected\n")

    # 4. Clean output directory
    if OUTPUT_DIR.exists():
        shutil.rmtree(OUTPUT_DIR)
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # 5. Generate images
    manifest: list[dict] = []
    success = 0
    counters: dict[str, int] = {}  # slug → running index

    for i, sel in enumerate(selections, 1):
        target = sel["target"]
        row = sel["row"]
        slug = target["slug"]
        ecg_id = int(row["ecg_id"])
        scp_dict = row["_scp_dict"]
        record_path = row["filename_hr"]  # e.g. records500/00000/00001_hr

        # Build output filename
        counters.setdefault(slug, 0)
        counters[slug] += 1
        idx = counters[slug]
        out_name = f"{slug}-{idx:02d}.png"

        print(f"[{i}/{total}] Generating {out_name} (ecg_id={ecg_id}) ...")

        # Download record files
        if not download_record_files(record_path):
            print(f"  WARN: Could not download record files – skipping.")
            continue

        # Read record with wfdb
        try:
            rec_full_path = str(DATA_DIR / record_path)
            record = wfdb.rdrecord(rec_full_path)
            signal = record.p_signal  # (n_samples, 12)
            sig_names = record.sig_name
        except Exception as exc:
            print(f"  WARN: Failed to read record: {exc} – skipping.")
            continue

        # Generate image
        try:
            out_path = OUTPUT_DIR / out_name
            generate_ecg_image(signal, sig_names, out_path)
        except Exception as exc:
            print(f"  WARN: Failed to generate image: {exc} – skipping.")
            continue

        manifest.append({
            "filename": out_name,
            "ptbxl_id": ecg_id,
            "scp_codes": scp_dict,
            "pathology_fr": target["pathology_fr"],
            "pathology_en": target["pathology_en"],
            "category": target["category"],
        })
        success += 1

    # 6. Write manifest
    MANIFEST_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(MANIFEST_PATH, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)

    # 7. Summary
    print()
    print("=" * 60)
    print(f"  Generated {success}/{total} images successfully")
    print(f"  Output dir : {OUTPUT_DIR}")
    print(f"  Manifest   : {MANIFEST_PATH}")
    print("=" * 60)

    # Per-category breakdown
    cats: dict[str, int] = {}
    for m in manifest:
        cats.setdefault(m["category"], 0)
        cats[m["category"]] += 1
    for cat, cnt in sorted(cats.items()):
        print(f"    {cat}: {cnt} images")


if __name__ == "__main__":
    main()
