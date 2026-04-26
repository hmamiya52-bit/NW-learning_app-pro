"""復習ノートの赤字 vs NOTE_DB の `style: 'red'` トークン比較レポート。
  - PDF からは note_red_index.json の red_words を利用
  - NOTE_DB は src/pages/NoteDetail.tsx を簡易パース（{ text: '...', style: 'red' } のみ拾う）
"""
from __future__ import annotations
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
NOTE_TSX = ROOT / "src/pages/NoteDetail.tsx"
PDF_JSON = ROOT / "scripts/note_red_index.json"
OUT = ROOT / "scripts/red_diff_report.txt"

# ── PDF 側 ──
data = json.loads(PDF_JSON.read_text(encoding="utf-8"))
seen = set()
unique_pages = []
for p in data:
    key = p["text"][:300]
    if key in seen:
        continue
    seen.add(key)
    unique_pages.append(p)

# ── NOTE_DB 側 ──
src = NOTE_TSX.read_text(encoding="utf-8")

# NOTE_DB の開始位置と終了位置を特定
m_begin = re.search(r"const NOTE_DB:\s*Record<[^=]+>\s*=\s*\{", src)
note_db_start = m_begin.end() if m_begin else 0
# NOTE_SECTION_INDEX が後ろにあるのでそこまでで十分
m_end = re.search(r"export const NOTE_SECTION_INDEX", src)
note_db_end = m_end.start() if m_end else len(src)
note_db_src = src[note_db_start:note_db_end]

# 各カテゴリの境界を探す
CATEGORY_KEYS = [
    "layer1-3", "layer4-7", "firewall", "wireless", "routing",
    "vrrp", "wan", "load-balancer", "dhcp", "dns",
    "mail", "voip", "ipsec", "sdn", "ssl-tls",
    "security", "threat", "ipv6",
    "proxy", "network-mgmt", "protocol-review", "iot",
]
# (name, start) を収集
boundaries: list[tuple[str, int]] = []
for k in CATEGORY_KEYS:
    pat = re.compile(rf"['\"]?{re.escape(k)}['\"]?\s*:\s*\{{", re.MULTILINE)
    m = pat.search(note_db_src)
    if m:
        boundaries.append((k, m.start()))
boundaries.sort(key=lambda x: x[1])

cat_ranges: dict[str, tuple[int, int]] = {}
for i, (k, s) in enumerate(boundaries):
    e = boundaries[i + 1][1] if i + 1 < len(boundaries) else len(note_db_src)
    cat_ranges[k] = (s, e)

# 各カテゴリで `style: 'red'` のテキストを抽出
RED_TOKEN = re.compile(r"\{\s*text:\s*'((?:[^'\\]|\\.)*)'\s*,\s*style:\s*'red'\s*\}")
def red_words_in(s: str) -> list[str]:
    return [m.group(1) for m in RED_TOKEN.finditer(s)]

# カテゴリ → 赤字集合
note_red_by_cat: dict[str, set[str]] = {}
for k, (s, e) in cat_ranges.items():
    chunk = note_db_src[s:e]
    note_red_by_cat[k] = set(red_words_in(chunk))

# ── ページ → カテゴリ手動マッピング（復習ノートの章構成より）──
PAGE_TO_CAT = {
    1:  ["layer1-3"],
    2:  ["layer1-3", "ipv6"],
    3:  ["layer1-3"],
    4:  ["layer1-3", "threat", "layer4-7"],
    5:  ["layer4-7", "threat"],
    6:  ["layer4-7"],
    7:  ["firewall"],
    8:  ["firewall", "layer4-7", "wireless"],
    9:  ["wireless"],
    10: ["wireless"],
    11: ["wireless", "routing"],
    12: ["routing"],
    13: ["routing"],
    14: ["vrrp", "wan"],
    15: ["wan", "load-balancer"],
    16: ["dhcp"],
    17: ["dhcp", "dns"],
    18: ["dns"],
    19: ["mail"],
    20: ["mail", "voip"],
    21: ["voip", "ipsec"],
    22: ["ipsec"],
    23: ["ipsec", "sdn"],
    24: ["sdn", "security", "threat"],
    25: ["security", "ssl-tls"],
    26: ["ssl-tls", "proxy"],
    27: ["proxy", "network-mgmt"],
    28: ["network-mgmt", "protocol-review"],
    29: ["protocol-review"],
    30: ["protocol-review"],
}

# ── PDF からの赤字を全て集める（カテゴリ別に）──
pdf_red_by_cat: dict[str, set[str]] = {k: set() for k in CATEGORY_KEYS}
for p in unique_pages:
    page = p["page"]
    cats = PAGE_TO_CAT.get(page)
    if not cats:
        continue
    for r in p["red_words"]:
        # 空・1文字の助詞っぽいものはスキップ
        if not r.strip() or r in {"の", "を", "で", "に", "は", "が", "と"}:
            continue
        for c in cats:
            pdf_red_by_cat[c].add(r)

# ── 比較レポート ──
def normalize(s: str) -> str:
    """単純なゆらぎ正規化"""
    return s.replace("（", "(").replace("）", ")").replace("：", ":").strip()

with OUT.open("w", encoding="utf-8") as f:
    f.write("=== 赤字カバレッジ差分レポート（PDF → NOTE_DB） ===\n\n")
    for k in CATEGORY_KEYS:
        pdf_set = pdf_red_by_cat.get(k, set())
        note_set = note_red_by_cat.get(k, set())
        if not pdf_set:
            continue  # PDFマッピング無しのカテゴリ（ssl-tls等は別途扱う）
        # 正規化集合
        norm_note = {normalize(s) for s in note_set}
        # PDF にあって NOTE に無いもの
        missing = []
        for r in sorted(pdf_set):
            nr = normalize(r)
            # 部分一致（NOTE_DB側のいずれかの赤字に含まれていればOK）
            ok = any(nr in nn or nn in nr for nn in norm_note if nr and nn)
            if not ok:
                missing.append(r)
        f.write(f"--- {k} (PDF赤字 {len(pdf_set)} / NOTE赤字 {len(note_set)}) ---\n")
        if missing:
            for r in missing:
                f.write(f"  [PDFのみ] {r}\n")
        else:
            f.write(f"  ✓ PDFの赤字は全てNOTEに反映済み\n")
        f.write("\n")

print(f"wrote {OUT}")
