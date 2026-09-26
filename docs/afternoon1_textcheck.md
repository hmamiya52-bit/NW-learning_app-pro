# 解説の文章の機械チェック（§6.5・§8 の確認コード）

`docs/afternoon1_authoring_rules.md` の §6.5（basis は位置参照だけ・逐語引用しない）、§6.2（字数の目安）、
§8（マークアップ）を、書いたあとに機械的に確かめるための Python スクリプト。
H26-G1-3・H27-G1-1 で使ったものをそのまま残してある。**毎回書き直さず、ここから写す。**

## 使い方

1. 問題 PDF を読むときに、スクラッチパッドへ**転記メモ**を作っておく（§3 Step 1。下の「転記メモの形」を守る）。
2. 下のコードを Write ツールでスクラッチパッドに `check_expl.py` として保存する
   （Git Bash のヒアドキュメントに Python を書くとバックスラッシュが崩れることがある。§10）。
3. リポジトリの直下で実行する。

```bash
PYTHONIOENCODING=utf-8 python "<スクラッチパッド>/check_expl.py" H27-G1-1 "<スクラッチパッド>/memo_h27g11.txt"
```

`explanations.ts` の対象の問と、`examFigures.ts` の対象の問（図の `points`）の文字列をすべて見る。
パスは引数で渡す（Git Bash が Windows の形に直してくれる）。`python -c "..."` の文字列の中に
`/c/Users/...` の形のパスを書くと、Python が開けない。

## 転記メモの形

スクリプトは次の2つを手掛かりにメモを切り分ける。

- `特徴的な句` を含む行の次の行から、`【図1` の直前までを「特徴的な句」として読む。
  句は ` / `（前後に半角空白）か改行で区切る。`TCP/UDP` のように空白の無い `/` では切らない
- メモの先頭から `特徴的な句` の行の手前までを「本文」として読む（最長共通部分の相手）

```
【導入】
（本文の要旨を節ごとに。原文に近い形で残してよい。スクラッチパッドにしか置かない）
【〔SSO の導入〕】
...
特徴的な句（basis で写さないこと）:
 業務の拡大傾向が続き / それぞれ個別に行っている / 利用者の利便性が低い
 ...
【図1 …】
（図の構成メモ）
【設問】
...
```

特徴的な句は、読みながら「この言い回しは写しそう」と思った原文の句を 30〜40個 拾っておく。

## 結果の読み方

| 見出し | 0 にするもの | 直し方 |
|---|---|---|
| `== markup ==` | `markup issues` | 奇数個の `==`/`__`、3ペア以上、閉じの直後の半角空白、全角 `＝` を直す（§8） |
| `== lengths (rows) ==` | 何も出ないこと | 目安の上限＋10字を超えた行が出る。長い固有名詞（ドメイン名など）を言い換えるか、一般論を削る |
| `== characteristic phrases hit ==` | `phrase hits` | 当たった句を言い換える |
| `== longest common substrings ... ==` | 固有名詞だけになること | 12字以上の一致が出る。節の名前（〔…〕）、図題、URL、機器名、用語（`UserID と Password`）なら残してよい。**述語を含む一致**（「SYN パケットが PC から届いた時点で決」など）は言い換える |

H27-G1-1 では、1回目に字数の超過14件と原文に近い言い回し6件が出た。
直したあとは、字数の超過0件・特徴的な句0件・最長一致は固有名詞だけになった。

## コード

```python
"""解説の機械チェック。使い方: python check_expl.py <問題id> <転記メモのパス>

- マークアップ（== / __ のペア数・閉じの直後の空白・全角＝）
- rows の各フィールドの字数（§6.2 の目安）
- 転記メモの「特徴的な句」との一致
- 転記メモの本文との最長共通部分（12字以上を表示）
リポジトリの直下で実行する。
"""
import re
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

PID, MEMO = sys.argv[1], sys.argv[2]
SRC = 'src/data/afternoon1/explanations.ts'
FIG = 'src/data/afternoon1/examFigures.ts'

src = open(SRC, encoding='utf-8').read()
i = src.find(f"'{PID}': {{")
j = src.find("\n  '", i + 10)
block = src[i:j]

fig = open(FIG, encoding='utf-8').read()
fi = fig.find(f"'{PID}': [")
fj = fig.find('// ───', fi)
fblock = fig[fi:fj if fj > 0 else len(fig)]

pat = re.compile(r"(\w+):\s*'((?:[^'\\]|\\.)*)'")
arr = re.compile(r"^\s*'((?:[^'\\]|\\.)*)',?\s*$", re.M)
strings = pat.findall(block) + [('arr', s) for s in arr.findall(block)]
strings += [('figpoint', s) for s in arr.findall(fblock)] + pat.findall(fblock)

print('== markup ==')
bad = 0
for k, s in strings:
    for mk in ('==', '__'):
        n = s.count(mk)
        if n % 2:
            print('  odd', mk, k, s[:40]); bad += 1
        if n // 2 > 2:
            print('  >2 pairs', mk, k, s[:40]); bad += 1
        pos = [m.start() for m in re.finditer(re.escape(mk), s)]
        for c in pos[1::2]:
            if s[c + 2:c + 3] == ' ' and not re.match(r'[A-Za-z0-9)]', s[c - 1]):
                print('  space after close', mk, k, s[max(0, c - 10):c + 8]); bad += 1
    if '＝' in s or '===' in s:
        print('  zenkaku/triple =', k); bad += 1
print('  markup issues:', bad)

print('== lengths (rows) ==')
LIM = {'point': (30, 60), 'basis': (40, 90), 'knowledge': (40, 80), 'reasoning': (60, 120), 'pitfall': (40, 80)}
rows_part = block[block.find('rows: ['):block.find('detail: {')]
for k, s in pat.findall(rows_part):
    if k in LIM:
        plain = s.replace('==', '').replace('__', '')
        lo, hi = LIM[k]
        if len(plain) < lo or len(plain) > hi + 10:
            print(f'  {k} {len(plain)} (目安 {lo}-{hi}) {plain[:30]}')

memo = open(MEMO, encoding='utf-8').read()
body = memo[:memo.find('【図1')]
ps = body.find('特徴的な句')
phrases = [p.strip() for p in re.split(r' / |\n', body[ps:].split('\n', 1)[1]) if p.strip()]
body_text = body[:ps]
norm = lambda x: re.sub(r'\s+', '', x.replace('，', '、').replace('．', '。'))

print('== characteristic phrases hit ==')
hits = 0
for k, s in strings:
    for p in phrases:
        if norm(p) and norm(p) in norm(s):
            print('  HIT', repr(p), 'in', k, s[:40]); hits += 1
print('  phrase hits:', hits, '/ phrases', len(phrases))


def lcs(a, b):
    best = (0, '')
    prev = [0] * (len(b) + 1)
    for x in range(1, len(a) + 1):
        cur = [0] * (len(b) + 1)
        for y in range(1, len(b) + 1):
            if a[x - 1] == b[y - 1]:
                cur[y] = prev[y - 1] + 1
                if cur[y] > best[0]:
                    best = (cur[y], a[x - cur[y]:x])
        prev = cur
    return best

print('== longest common substrings with memo body (>=12) ==')
nb = norm(body_text)
for k, s in strings:
    n, sub = lcs(norm(s), nb)
    if n >= 12:
        print(f'  {n} {k}: {sub}')
```

文言を大量に直すときは、Edit ツールで1件ずつ直すか、置換の組をスクラッチパッドの Python に並べて
`open(p, encoding='utf-8', newline='')` で読み書きする（CRLF を保つ。§10）。置換のたびに
「1か所だけ当たったか」を数えて、当たらなかった組を表示させる。
