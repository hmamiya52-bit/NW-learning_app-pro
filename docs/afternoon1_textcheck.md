# 解説の文章の機械チェック（§6.5・§8 の確認コード）

`docs/afternoon1_authoring_rules.md` の §6.5（basis は位置参照だけ・逐語引用しない）、§6.2（字数の目安）、
§8（マークアップ）を、書いたあとに機械的に確かめるための Python スクリプト。
H26-G1-3・H27-G1-1・H27-G1-2・H27-G1-3・H28-G1-1・H28-G1-2・H28-G1-3・R1-G1-1・R1-G1-2・R1-G1-3・R3-G1-1・R3-G1-2・R3-G1-3 で使ったものをそのまま残してある。**毎回書き直さず、ここから写す。**
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
R1-G1-3 は1回目に字数の超過1件・不足2件（`reasoning` が60字に届かない）、特徴的な句3件（「DHCP スヌーピングを有効にする」）が出た。
下線の文をそのまま設問の要約（`asked`）に引くと当たりやすい。「スヌーピングをかける」のように動詞を替えて直した。
R3-G1-1 は、図表の段階で図の解説を先に測り（下の「図の解説だけを先に測る」）、90字超え3件と述語つきの一致1件（「在庫管理端末は DHCP
クライアント」17字）を直してからコミットした。行解説と詳細解説の1回目は、字数の超過3件（`knowledge`・`pitfall`・`reasoning`）と、
述語つきの一致が9件。機器名と助詞の並び（「運用管理サーバは、L2SW」13字・「RT が RT 管理コントローラ」13字）と、本文の箇条をなぞった要件の並べ方
（「フリー Wi-Fi やインターネット」16字）が多かった。最長一致を直すと、陰から「DHCP クライアントである」「店舗でフリー Wi-Fi を」が出た。
最後は節の名前・アドレス（192.168.1.0/24）・用語（L2 over IP トンネル・ブロードキャストドメイン）・図題・図の注記だけになった。
R3-G1-2 は図表の段階で、図の解説に述語つきの一致1件（「はインターネットへの静的デフォルト経路を」20字）とマークアップの空白2件。
行解説と詳細解説の1回目は、マークアップ1件（`==エリア0 から来た== Type3` の閉じの直後の空白）・字数の超過1件・述語つきの一致が十数件。
空欄の前後の文をなぞった `basis`（「Type1 の LSA は、OSPF エリア内の b」21字）と、本文の箇条をなぞった問題文の解説
（「の E 社を吸収合併することになり、E 社のネットワークを D 社」28字）が長かった。アドレスを括弧ごと引くと（「（192.168.1.0/24）、IPsec」）
括弧と読点の分だけ一致が伸びるので、括弧を外して書いた。最後は節の名前とアドレスだけになった。
R3-G1-3 は図表の段階で、図の解説の90字超えが2件（どちらも設問番号と道筋の説明を詰め込んだもの）。行解説と詳細解説の1回目は、
字数の超過が0件で、マークアップ1件（`==75%・25%== の WRR`。閉じの直前が `%` なので、英数字の例外に当たらない）と、
述語つきの一致が5件。サービスの名前（「Z 社の音声クラウドサービス」）を本文どおりに引くと、問題文の解説と overview の両方で一致した。
空欄の前後をなぞった `basis`（「を、IP ヘッダの d フィールドを」）と `asked`（「CS-ACELP のビットレート」）も一致した。
最後は節の名前（〔電話サービス導入後のネットワーク構成〕と、箇条の見出しの（レイヤ 2 マーキングによる優先制御））と、用語（PQ の正式名）だけになった。
R4-G1-1 は図表の段階で、図の注記の組み直しの説明が本文と23字一致した（「可視化サーバとキャプチャサーバを OA セグメント」。本文の箇条の
置き場所の記述と同じ並び）。行解説と詳細解説の1回目は、字数の超過1件（`pitfall` で別解の方式名を並べ過ぎた）、特徴的な句2件
（「制御サーバと操作端末のアクセスログ」を `reasoning` と `commentary` で本文どおりに引いた）、述語つきの一致が十数件。
問題文の解説の本文で、本文の書き出し（「に事務所と工場がある。事務所には」16字）と、指示の箇条の切れ目（「るようにする。(b) 測定データ」）が
一致した。「すべての一致を出す」で、同じ本文から「制御セグメントと、制御サーバ」「プロキシサーバがある。DMZ」なども見つかった。最後は節の名前（〔管理セグメントと OA セグメント間のファイルの受渡し〕・〔ネットワークの更改方針〕）だけになった。
R4-G1-3 は図表の段階で、図の解説の90字超えが2件（SRV の名前の形と Port の説明を1件に詰め込んだもの）と、述語つきの一致1件
（「る。外部 DNS サーバは、社」13字）。行解説と詳細解説の1回目は、字数の外れが6件（`knowledge`・`pitfall` の上限超え4件、`basis` の
40字未満1件、`point` の60字超え1件）と、述語つきの一致が10件、設問の言葉の一致が2件。本文の箇条をなぞった問題文の解説
（「業務サーバや営業支援サーバにも、ケルベロス」21字・「暗号化した ST にセッション鍵などを」17字）と、①〜⑧の説明をなぞった
`thinkingProcess`（「た情報の中から ST を取り出し、」15字）が長かった。設問の要約（`asked`）に引いた「その他のネットワーク情報」（12字）も
言い換えた。最後は節の名前と原図の注記の転記だけになった。
R5-G1-1 は図表の段階で、図の解説の90字超えが1件（ALPN の (d)(e) にメッセージ名まで添えたもの）と、述語つきの一致1件
（「AP サーバの動的コンテンツは、」15字）。行解説と詳細解説の1回目は、字数の超過が10件（`knowledge` 6件・`pitfall` 3件・`reasoning` 1件。
HTTP/2・TLS の英字の用語とアドレスで膨らんだ）と、述語つきの一致が十数件。本文の別の箇条にある同じ言い回し（「Web サーバは静的コンテンツを」は
新構成の箇条にあった）や、主語の並び（「サーバセグメントのサーバが」「J 社クラウドの VPC サービス」「の仮想ルータと G 社データセンターの L3SW」21字）、
「HTTP/2 は、HTTP/1.1」で始まる文（本文の2か所と16〜19字一致）が多かった。IP アドレス（172.21.10.0/24 は14字）は固有名詞と同じく残ってよいが、
助詞まで続けると（「172.21.10.0/24 を」）15字になるので、助詞の前で文を切った。最後は節の名前とアドレスだけになった。
R5-G1-2 は図表の段階で、図の解説の90字超えが3件（図2 の (a)〜(e) の流れを1件に詰め込んだもの）。行解説と詳細解説の1回目は、字数の超過が4件
（`knowledge`）、特徴的な句2件（「カメラ管理サーバの Web ページを開き」「IGMP 用に割り当てられた」）、述語つきの一致が二十数件。設問の要約（`asked`）が
設問文や空欄の前後をなぞりやすく（「マルチキャストルーティング用のプロトコルとして」24字・「IGMP 用に割り当てられた IP ウ アドレス」20字）、
問題文の解説で (a)〜(e) の説明を「(c) レシーバ11 は」の形で並べると、本文の「する。(c) レシーバ 11 は」と句点ごと一致した（「(c) では、レシーバ11 が」に直した）。
用語の「デスクトップアプリケーション方式」（16字）は、文の頭に置くと前の句点ごと17〜22字の一致になるので、文の途中に置いた。
最後は節の名前・図題と、その用語だけになった。
R5-G1-3 は図表の段階で、図の解説の90字超え1件、マークアップの前後の空白2件（`のが ==(ii)==` の開きの直前、`==DHCP リレーエージェント== が` の閉じの直後）、
述語つきの一致1件（「フロア L2SW と AP はシングル構成」17字）。記号を強調するときは `区間==(ii)==の4本` のように和文とのあいだを空けない。
行解説と詳細解説の1回目は、字数の外れ6件（`knowledge` の超過5件。PoE・IEEE802.3bz などの規格名と数値の並びで膨らんだ。`reasoning` の不足1件）と、
述語つきの一致が十数件。用語の後ろの助詞まで本文と同じ形（「WPA3-Personal で」「IEEE802.3bt を採」「ブロードキャストストームが」）と、
機器名の並び（「基幹 L3SW とサーバ L2SW」14〜16字。「・」でつなぐと切れた）が多かった。直したあとの「すべての一致を出す」で、問題文の解説の本文に
隠れていた一致がさらに5件（「Web カメラなどの IoT 機器」「全てのスイッチでループ検知」「フロア L2SW から PoE で」など）見つかった。
最後は節の名前と用語（WPA3-Personal・Dynamic Frequency Selection・ブロードキャストストームなど）だけになった。
H29-G1-1 は図表の段階で、図の解説の90字超えが4件（トンネルの道筋や FW を通る向きを1件に詰め込んだもの）と、述語つきの一致2件（「、SSL-VPN 装置の内側」13字。
本文の「SSL-VPN 装置の内側のインタフェース」と同じ並び）、用語に助詞が付いた一致2件（「の顧客システム構築ネットワーク」「顧客システム構築ネットワークと」15字。
用語だけで14字あるので、前後のどちらに1字付いても12字を超える）。行解説と詳細解説の1回目は、字数の超過2件（`knowledge`・`pitfall`）、特徴的な句0件、
述語つきの一致が数件。本文が3つの方式を「 オ ，ポートフォワーディング，L2 フォワーディング」と読点で並べるので、用語に読点が付いた形（「、ポートフォワーディング」12字）が
6か所で出た（1か所直すと、同じ文字列の別の所が次に出た）。並べる順を変えるか、句点で文を切って直した。本文の小見出し（「(2) SSL-VPN の動作方式」）を引いた `basis` と、
行解説の `pitfall` の「、DMZ のプロキシサーバ」も12字一致した。マークアップは、記号で始まる語の強調（`==/32==`）の開きの直前の空白が3件
（下の `markup_space.py` で見つけた）。最後は節の名前・用語（顧客システム構築ネットワーク）と図の注記の転記だけになった。
H29-G1-2 は図表の段階で、図の解説に述語つきの一致1件（「画面転送通信の帯域を確保」12字）。行解説と詳細解説の1回目は、字数の不足1件（`basis` 34字）、
特徴的な句0件、述語つきの一致が十数件。装置名の並びが節の名前と同じ（「SSL 可視化装置・標的型攻撃対策装置」18字）ものが3か所、設問の要約（`asked`）が
本文の名詞句をなぞったもの（「現行のアクセス回線の安全率」「のアクセス回線の契約帯域」「支店のインターネット接続回線を廃止」）、本文の箇条の主語と
述語の並び（「標的型攻撃対策装置が、ある仮想 PC の通信」20字・「クラスのパケットに対するシェーピングが」19字）が多かった。「C&C サーバの IP アドレスを」
は本文の「特定する」の前と14字一致するので、書く前に「C&C サーバのアドレス」に替えておいた。最後は節の名前だけになった。
H29-G1-3 は図表の段階で、図の解説の90字超えが6件全部（VPNa1・VPNb1 などの英字の装置名で膨らんだ）と、装置名の並びの一致1件（「、VPNa1 と VPNb1」12字）。
「2台の VPN ルータ」のように言い換えて直した。行解説と詳細解説の1回目は、字数の超過4件（`point`・`knowledge` 2件・`reasoning`。再配布のループの説明が158字）と、
述語つきの一致が二十件ほど。12字ある用語「トランスポートプロトコル」に助詞が付いた形（「はトランスポートプロトコルの」14字）が4か所、空欄の記号に続く英字の
メッセージ名（「 オ の echo request」13字）、問題文の解説で本文の箇条をなぞった並び（「L3SW に VPN セグメントを作」15字・「インターネットへの Web 閲覧など」16字）、
O さんの発言をなぞった `reasoning`（「VPNb1 側のコストを VPNa1 側」17字）が多かった。最後は節の名前と図の注記の転記だけになった。
転記メモの書き方の注意: 表の行を「特徴的な句」と【図1 のあいだに置くと、その行も句として読まれる。R5-G1-2 では表1 の「TCP / Ⅱ」の「 / 」が
句の区切りと読まれて「Ⅱ」だけの句ができ、rowKey や見出しの「Ⅱ」に当たって数件の誤検出が出た。表は【図1 より後ろ（【設問】の前）に置く。

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

## 図の解説だけを先に測る（段階2で）

R3-G1-1 で追加。設問文と図表の段階（行解説を書く前）では、`explanations.ts` にその問のブロックがまだ無いので、
上の2つのスクリプトは使えない（ブロックの切り出しがずれる）。図表の段階のコミットの前に、`examFigures.ts` の
`points` と `note` だけを、字数（90字まで）・マークアップ・特徴的な句・12字以上の一致の4つで測る。
`fig_check.py` としてスクラッチパッドに保存し、同じ引数で実行する。

```python
"""図の解説（examFigures の points・note）だけを転記メモと突き合わせる（解説の投入前に使う）。
使い方: python fig_check.py <問題id> <転記メモ>
"""
import re
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
PID, MEMO = sys.argv[1], sys.argv[2]
fig = open('src/data/afternoon1/examFigures.ts', encoding='utf-8').read()
fi = fig.find(f"'{PID}': [")
fj = fig.find('// ───', fi)
fblock = fig[fi:fj]
pat = re.compile(r"(\w+):\s*'((?:[^'\\]|\\.)*)'")
arr = re.compile(r"^\s*'((?:[^'\\]|\\.)*)',?\s*$", re.M)
strings = [('figpoint', s) for s in arr.findall(fblock)] + pat.findall(fblock)
memo = open(MEMO, encoding='utf-8').read()
body = memo[:memo.find('【図1')]
ps = body.find('特徴的な句')
phrases = [p.strip() for p in re.split(r' / |\n', body[ps:].split('\n', 1)[1]) if p.strip()]
norm = lambda x: re.sub(r'\s+', '', x.replace('，', '、').replace('．', '。').replace('==', '').replace('__', ''))
nb = norm(body[:ps])

print('strings:', len(strings))
for k, s in strings:
    plain = s.replace('==', '').replace('__', '')
    if k == 'figpoint' and len(plain) > 90:
        print('  long', len(plain), plain[:30])
    for mk in ('==', '__'):
        if s.count(mk) % 2 or s.count(mk) // 2 > 2:
            print('  markup', mk, s[:30])
        pos = [m.start() for m in re.finditer(re.escape(mk), s)]
        for c in pos[1::2]:
            if s[c + 2:c + 3] == ' ' and not re.match(r'[A-Za-z0-9)]', s[c - 1]):
                print('  space after close', mk, s[max(0, c - 10):c + 8])
        for c in pos[0::2]:
            if c > 1 and s[c - 1] == ' ' and not re.match(r'[A-Za-z0-9(]', s[c - 2]) and not re.match(r'[A-Za-z0-9]', s[c + 2:c + 3]):
                print('  space before open', mk, s[max(0, c - 10):c + 8])
    if '＝' in s or '===' in s:
        print('  zenkaku/triple =', s[:30])
    for p in phrases:
        if norm(p) and norm(p) in norm(s):
            print('  HIT', p, '|', s[:30])


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


for k, s in strings:
    if k in ('title', 'figureId', 'kind'):
        continue
    a = norm(s)
    while True:
        n, sub = lcs(a, nb)
        if n < 12:
            break
        print(f'  {n} {k}: {sub}')
        a = a.replace(sub, '\0' * len(sub), 1)
print('done')
```

`long` と `HIT` と `markup`・`space after close`・`space before open` が0件、12字以上の一致が用語・図の注記（原図の注記の転記）だけになったら、
図表の段階をコミットしてよい。R3-G1-2 で、マークアップの直後の半角空白（`==ルータ== が`・`==Null0（捨てる）== へ`）を見ない版だったため
画面で気づいた。閉じの直後の空白と、和文に挟まれた開きの直前の空白（`つながる ==ルータ==`）も見るようにした。

## マークアップの前後の空白をブロック全体で調べる（段階3で）

H29-G1-1 で追加。上の `check_expl.py` は閉じの直後の空白しか見ず、開きの直前の空白（`長を ==/32== にする`）は、図の解説を見る `fig_check.py` だけが
見ていた。行解説と詳細解説のブロック全体で、開きの直前と閉じの直後の空白、全角の `＝` を調べる。`markup_space.py` としてスクラッチパッドに保存し、
問の id と、`explanations.ts` でその次に並ぶ問の id を渡す（ブロックの終わりの目印にする）。

```bash
PYTHONIOENCODING=utf-8 python "<スクラッチパッド>/markup_space.py" H29-G1-1 R1-G1-1
```

```python
"""1問ぶんの解説ブロックで、マークアップの開きの直前・閉じの直後の空白を調べる。
使い方: python markup_space.py <問題id> <次の問題id>
"""
import io
import re
import sys

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
PID, NEXT = sys.argv[1], sys.argv[2]
s = open('src/data/afternoon1/explanations.ts', encoding='utf-8').read()
i = s.find(f"  '{PID}': {{")
j = s.find(f"  '{NEXT}': {{")
blk = s[i:j]
strs = re.findall(r"'((?:[^'\\]|\\.)*)'", blk)
n = 0
for t in strs:
    for mk in ('==', '__'):
        pos = [m.start() for m in re.finditer(re.escape(mk), t)]
        for c in pos[0::2]:
            if c > 1 and t[c - 1] == ' ' and not re.match(r'[A-Za-z0-9(]', t[c - 2]) and not re.match(r'[A-Za-z0-9]', t[c + 2:c + 3]):
                print('space before open:', t[max(0, c - 12):c + 10])
                n += 1
        for c in pos[1::2]:
            if t[c + 2:c + 3] == ' ' and not re.match(r'[A-Za-z0-9)]', t[c - 1]):
                print('space after close:', t[max(0, c - 12):c + 10])
                n += 1
    if '＝' in t:
        print('zenkaku =', t[:20])
        n += 1
print('issues', n)
```

`issues 0` になるまで直す。英数字で始まる語（`まで ==TLS（TCP/443）==を`）の前の空白と、英数字・半角の `)` で終わる語の後ろの空白は、§8 のとおり
置いてよいので数えない。`/32` のように記号で始まる語は、強調を別の語に移す（ルール §6.5）。

## 直し方

文言を大量に直すときは、Edit ツールで1件ずつ直すか、置換の組をスクラッチパッドの Python に並べて
`open(p, encoding='utf-8', newline='')` で読み書きする（CRLF を保つ。§10）。置換のたびに
「1か所だけ当たったか」を数えて、当たらなかった組を表示させる。
置換の組に `\n`（段落の区切り）を含めるときは、ヒアドキュメントに書かずに .py のファイルにする。R5-G1-1 で、ヒアドキュメントの Python に
`\\n` と書いたら本物の改行になり、`'…'` の文字列が途中で切れた（§10 のバックスラッシュの崩れと同じ）。直したら `npm run build` で確かめる。
スクリプトでファイルを丸ごと書き直すと Vite の HMR が壊れるので、そのあとで実機を見るときは
dev サーバを起動し直す。コンソールに残る古いエラーの見分け方は §10。
