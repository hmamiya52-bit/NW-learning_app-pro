# 解説の文章の機械チェック（§6.5・§8 の確認コード）

`docs/afternoon1_authoring_rules.md` の §6.5（basis は位置参照だけ・逐語引用しない）、§6.2（字数の目安）、
§8（マークアップ）を、書いたあとに機械的に確かめるための Python スクリプト。
H26-G1-3・H27-G1-1・H27-G1-2・H27-G1-3・H28-G1-1・H28-G1-2・H28-G1-3・R1-G1-1・R1-G1-2 で使ったものをそのまま残してある。**毎回書き直さず、ここから写す。**
（スクラッチパッドに前の問の `check_expl.py` が残っていても、古い版のことがある。H28-G1-3 では図の解説の字数を見ない版が残っていた。
毎回この文書のコードから写し直す。）

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
| `== lengths (figure points) ==` | 何も出ないこと | 図の解説（§5.5 の `points`、目安 40〜80字）で90字を超えたものが出る |
| `== characteristic phrases hit ==` | `phrase hits` | 当たった句を言い換える |
| `== longest common substrings ... ==` | 固有名詞だけになること | 12字以上の一致が出る。節の名前（〔…〕）、図題、URL、機器名、用語（`UserID と Password`）なら残してよい。**述語を含む一致**（「SYN パケットが PC から届いた時点で決」など）は言い換える |

H27-G1-1 では、1回目に字数の超過14件と原文に近い言い回し6件が出た。
直したあとは、字数の超過0件・特徴的な句0件・最長一致は固有名詞だけになった。

最長一致は**1つの文字列につき一番長いものだけ**を出す。直すと、同じ文字列の2番目の一致が次に出てくる
（H27-G1-3 の〔IPS の追加〕の本文は「（フォールスネガティブ）があり、」→「に、IDS と IPS の両方を」→
「、SQL インジェクション」と3回続いた）。出なくなるか、用語だけ（「（フォールスポジティブ）」）になるまで回す。
H27-G1-3 は1回目に字数の超過4件・12字以上の一致10件で、最後は用語・解答例・図題だけになった。
H28-G1-1 は英字の多い問（SMTP-AUTH・STARTTLS・アドレスブロック）で、1回目に字数の超過が17件
（行の `knowledge`・`pitfall` 16件と図の解説1件）、特徴的な句が2件出た。最後は節の名前・用語
（OP25B の正式名・STARTTLS コマンド）・図題・図の注記だけになった。
H28-G1-2 は1回目にマークアップ1件（全角の閉じ括弧「）」の後の `==` に半角空白が続いた）、字数2件、
述語つきの12字以上の一致が十数件出た。全角の括弧で終わる語を `==` で囲むときは、閉じの後に空白を置かない
（スクリプトの例外は半角の `)` だけ）。最後は節の名前・用語（L2TP over IPsec）・図題だけになった。
H28-G1-3 は1回目に図の解説の字数3件と、述語つきの12字以上の一致が6件出た。直したあと、下の「すべての一致を出す」で
用語（ステートフルインスペクション）の陰に隠れていた一致が3件見つかった。最後は節の名前・用語・解答例の引用だけになった。
R1-G1-1 は1回目に字数の超過7件（行4件・図の解説3件）と、述語つきの一致が十数件出た。問題文の解説の本文（`body`）が多く、
本文の節を順になぞると一致しやすい（「C さんは、コアルータからビル4階の L2SW までの回線」の26字など）。語順を組み替えて直し、
最後は節の名前だけになった。
R1-G1-2 は1回目に図の解説の字数4件、特徴的な句1件（「資源レコードの1行を書き換える」）、述語つきの一致が十数件出た。
設問の要約（`asked`）が設問文や本文の言い回しを引きずりやすい（「CNAME レコードを登録する方式を」など）。
正誤表で補った語句を解説で引くと、転記メモに書き添えた訂正の注記と一致して出るが、これは残してよい。

## コード

```python
"""解説の機械チェック。使い方: python check_expl.py <問題id> <転記メモのパス>

- マークアップ（== / __ のペア数・閉じの直後の空白・全角＝）
- rows の各フィールドの字数（§6.2 の目安）
- 図の解説（examFigures の points）の字数（90字を超えたもの）
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

print('== lengths (figure points) ==')
for s in arr.findall(fblock):
    plain = s.replace('==', '').replace('__', '')
    if len(plain) > 90:
        print(f'  point {len(plain)} (目安 40-80) {plain[:30]}')

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

## すべての一致を出す（仕上げに1回）

H28-G1-3 で追加。上のスクリプトは、1つの文字列につき一番長い一致しか出さない。一番長いものが用語だと、
その陰の述語つきの一致が見えない。次のスクリプトは、一致を1つ見つけたら伏せ字にして探し直し、12字以上の一致を全部出す。
解答例（`modelAnswer`）・図題（`title`）・見出し（`heading`）は、原文と同じで当然なので外してある。
`lcs_all.py` としてスクラッチパッドに保存し、`check_expl.py` と同じ引数で実行する。

```python
"""すべての 12 字以上の一致を列挙する（1つ見つけたら伏せ字にして繰り返す）。
使い方: python lcs_all.py <問題id> <転記メモ>
"""
import re
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
PID, MEMO = sys.argv[1], sys.argv[2]
src = open('src/data/afternoon1/explanations.ts', encoding='utf-8').read()
i = src.find(f"'{PID}': {{")
j = src.find("\n  '", i + 10)
block = src[i:j]
fig = open('src/data/afternoon1/examFigures.ts', encoding='utf-8').read()
fi = fig.find(f"'{PID}': [")
fj = fig.find('// ───', fi)
fblock = fig[fi:fj if fj > 0 else len(fig)]
pat = re.compile(r"(\w+):\s*'((?:[^'\\]|\\.)*)'")
arr = re.compile(r"^\s*'((?:[^'\\]|\\.)*)',?\s*$", re.M)
strings = pat.findall(block) + [('arr', s) for s in arr.findall(block)]
strings += [('figpoint', s) for s in arr.findall(fblock)] + pat.findall(fblock)
memo = open(MEMO, encoding='utf-8').read()
body = memo[:memo.find('【図1')]
body_text = body[:body.find('特徴的な句')]
norm = lambda x: re.sub(r'\s+', '', x.replace('，', '、').replace('．', '。').replace('==', '').replace('__', ''))
nb = norm(body_text)


def lcs(a, b):
    best = (0, '')
    prev = [0] * (len(b) + 1)
    for x in range(1, len(a) + 1):
        cur = [0] * (len(b) + 1)
        for y in range(1, len(b) + 1):
            if a[x - 1] == b[y - 1] and a[x - 1] != '\0':
                cur[y] = prev[y - 1] + 1
                if cur[y] > best[0]:
                    best = (cur[y], a[x - cur[y]:x])
        prev = cur
    return best


skip = ('modelAnswer', 'title', 'heading')
for k, s in strings:
    if k in skip:
        continue
    a = norm(s)
    while True:
        n, sub = lcs(a, nb)
        if n < 12:
            break
        print(f'  {n} {k}: {sub}')
        a = a.replace(sub, '\0' * len(sub), 1)
```

上のスクリプトと違い、マークアップ（`==`・`__`）を外してから比べる（強調で一致が切れて見逃すのを防ぐ）。

## 直し方

文言を大量に直すときは、Edit ツールで1件ずつ直すか、置換の組をスクラッチパッドの Python に並べて
`open(p, encoding='utf-8', newline='')` で読み書きする（CRLF を保つ。§10）。置換のたびに
「1か所だけ当たったか」を数えて、当たらなかった組を表示させる。
スクリプトでファイルを丸ごと書き直すと Vite の HMR が壊れるので、そのあとで実機を見るときは
dev サーバを起動し直す。コンソールに残る古いエラーの見分け方は §10。
