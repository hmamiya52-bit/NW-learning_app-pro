"""復習ノート.pdf から各ページのテキストと赤字語をまとめて出力する。
出力は scripts/note_red_index.json に保存。
"""
from __future__ import annotations
import json
import re
from pathlib import Path
import pdfplumber

PDF = Path(__file__).resolve().parent.parent / "復習ノート.pdf"
OUT = Path(__file__).resolve().parent / "note_red_index.json"


def is_red(c: dict) -> bool:
    """赤字判定: stroke 色が (R,G,B) で R≈1.0, G/B≈0 の場合"""
    color = c.get("non_stroking_color")
    if color is None:
        return False
    if isinstance(color, (list, tuple)):
        if len(color) >= 3:
            r, g, b = color[0], color[1], color[2]
            return r > 0.7 and g < 0.3 and b < 0.3
        if len(color) == 1:
            # CMYK や grayscale は黒扱い
            return False
    return False


def extract_red_runs(chars: list[dict]) -> list[str]:
    """文字単位の赤字判定から連続する赤字部分を取り出して語の配列に。"""
    runs: list[str] = []
    cur: list[str] = []
    for c in chars:
        ch = c.get("text", "")
        if is_red(c) and ch.strip():
            cur.append(ch)
        else:
            if cur:
                runs.append("".join(cur))
                cur = []
    if cur:
        runs.append("".join(cur))
    # 余白だけのものを除去
    runs = [r.strip() for r in runs if r.strip()]
    return runs


def main() -> None:
    pages = []
    with pdfplumber.open(PDF) as pdf:
        for i, page in enumerate(pdf.pages, start=1):
            text = page.extract_text() or ""
            red_words = extract_red_runs(page.chars)
            pages.append({"page": i, "text": text, "red_words": red_words})
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(pages, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"wrote {OUT}, {len(pages)} pages")


if __name__ == "__main__":
    main()
