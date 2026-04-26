"""ユニークページの赤字一覧を category 単位でテキストにまとめる。"""
from __future__ import annotations
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
data = json.loads((ROOT / "note_red_index.json").read_text(encoding="utf-8"))

# 復習ノートは 3 バージョン（◆◇★）×30 ページ + 表紙等 = 85 ページ。
# 同じページの本文は 3 回出てくるため、最初に登場した順を「ユニーク」とする。
seen = set()
unique = []
for p in data:
    key = p["text"][:300]
    if key in seen:
        continue
    seen.add(key)
    unique.append(p)

# カテゴリ分類用の見出し（本文先頭近辺の文字列で判定）
# ※ 復習ノート目次より：レイヤ1〜3 / レイヤ4〜7 / FW / 無線 / ルーティング / VRRP / WAN /
#                     LB / DHCP / DNS / メール / VoIP / IPsec / SDN / セキュリティ / プロキシ /
#                     ネットワーク管理 / プロトコル試験対策（など）
out = ROOT / "note_red_summary.txt"
with out.open("w", encoding="utf-8") as f:
    f.write(f"=== 復習ノート ユニークページ赤字インデックス（{len(unique)} ページ） ===\n\n")
    for p in unique:
        first_line = p["text"].splitlines()[0] if p["text"].splitlines() else ""
        first_line = first_line.strip()[:80]
        f.write(f"--- p{p['page']:>3} | {first_line}\n")
        # 赤字一覧（重複除去）
        reds = []
        seen_r = set()
        for r in p["red_words"]:
            if r in seen_r:
                continue
            seen_r.add(r)
            reds.append(r)
        for r in reds:
            f.write(f"    [赤] {r}\n")
        f.write("\n")
print(f"wrote {out}")
