# 教科書モード 実装引継ぎプロンプト（第7章 ルーティング）

このファイルの本文を、新しい Claude Code セッションにそのまま貼って使う。

---

あなたは、ネットワークスペシャリスト試験（ネスペ）学習アプリの「図解で学ぶ教科書（教科書モード）」を、章ごとに実装していく担当です。**第1〜6章（第1部＋第2部前半）は完成・公開済み。あなたの仕事は第7章「ルーティング（経路制御）」を実装すること**です。

**ルーティングはネスペ午後の最重要テーマの一つで、最も厚い章です。いきなり実装に入らず、まず詳細設計（節構成・各図の見せ方・データ・構成図の育て方）を入念に行い、必要なら show_widget のモックでユーザーと方向合意してから実装してください。** これは明確な依頼です。

技術スタック: React + Vite + TypeScript + Tailwind。リポジトリは main ブランチ。作業ディレクトリ D:\Claude\NWSP。

## 最初にやること（必ず順守）
1. `git pull`（main）。**ファイルはユーザーが直接手編集することがある**ので、編集前に必ず最新を Read する。
2. 設計の「正」を読む（この5つが唯一の正。古い設計文書は削除済み）:
   - `docs/textbook-mode-requirements.md`（要件）
   - `docs/textbook-mode-basic-design-v2.md`（基本設計。§6 文体、§7 検証フロー）
   - `docs/textbook-curriculum-design.md`（全体マップ・4部構成・topology ramp）
   - `docs/textbook-chapter-designs.md`（**全20章の節レベル詳細設計**＋実装手順＋共通基盤＋アドレス台帳＋本文/用語の方針。最重要。第7章は §第7章 を正とする）
   - `docs/textbook-figure-spec.md`（図の確定仕様・使い分け・カタログ・領域フォーカス§3.9・章×図割当）
3. 既存の実装を雛形として読む: `src/data/textbook/chapters/ch01-osi.ts`〜`ch06-ip-subnet.ts`、`src/data/textbook/types.ts`、`src/data/textbook/index.ts`、`src/components/textbook/figures/*`。**特に ch05（VLAN/STP・graph レイアウト）と ch06（subnet-calc・segment-map）は新図の使い方の見本。**
4. メモリ（`~/.claude` の textbook 関連 feedback。MEMORY.md に索引）も確認。とくに `textbook-topology-graph-layout`（図の作り方の教訓）・`textbook-writing-style`・`textbook-network-terminology` は必読。

## 対象読者
応用情報合格・インフラ未経験〜1年目。ネスペ学習の最初のインプット。読み物＋図解。

## 章構成（全20章）
1 OSI／2 DNS・DHCP／3 TCP・UDP・ポート／4 TLS・HTTP／**5 L2・VLAN・STP／6 IPアドレス設計とサブネット【ここまで実装済】**／**7 ルーティング【次はここ】**／8 インターネット接続・NAT・BGP／9 FW・DMZ／10 LB・プロキシ・CDN／11 冗長化・可用性／12 VPN・WAN・SD-WAN／13 認証・PKI／14 無線LAN／15 IPv6／16 メール／17 仮想化・クラウド／18 VoIP・QoS／19 運用監視・障害切り分け／20 午後総合。

## 実装済みの図コンポーネント（`src/components/textbook/figures/`）
- 共通: `FigureFrame` / `StepperControls` / `useStepper` / `useIsNarrow` / `figureTokens`(TONE・ROLE_ICON・ROLE_TONE) / `TextbookRichText`（`[[blue/green/amber/red/slate:語]]` 装飾。**text/callout body/caption/takeaway/chapter takeaways でのみ有効。figure title・explanation・note・record-table セル・timeline ラベルは素のテキスト**）
- `OsiStackFigure` / `EncapFigure`（`levels` は任意段数。HTTPSの TCP⊃TLS⊃HTTP 入れ子にも流用可）/ `AddressTableFigure`（対比カード）
- `PacketFlowFigure` ＋ `TopologyView`（**chain レイアウト**＝座標レスの一直線・スマホ縦リフロー）。拡張あり↓
- `SequenceFigure`（ラダー図。全メッセージ描画で現在だけ強調＝ボタン不動）
- `TimelineFigure`（縦の俯瞰）
- `RecordTableFigure`（スマホ=1行1カード/PC=表。`rowHeader`見出し列・`emphasizeKey`差分セル強調・`highlightRow`行強調）
- `SubnetCalcFigure`（`subnet-calc`）: IPを10進＋2進、ビットの重み(128…1)行、ネットワーク部=緑/ホスト部=グレー、`ip`＋`steps[{prefix,note}]`で /24→/26 と境界が動く。算出は ip+prefix から自動。
- `GraphTopology`（`Topology.layout:'graph'` で有効・SVG）: スイッチ/ルータ=幹、PC等=枝。**tree**（幹を横一列・端末を下に縦積み）/**loop**（同一2ノード間の links を2本書くと冗長＝縦並び＋曲線2本）。`PacketStep.blockedLink` で片アークを破線＋✕（STP）。動きは「アクティブな線・アークの強調＋進行方向の矢印（▼▲）」。**ノードを覆う移動吹き出しは使わない（過去に差し戻し）。**
- `SegmentMapFigure`（`segment-map`・SVG）: ルータが2セグメントをつなぐ縦構成。`segments[{label,tone,nodeLabel,host,network,gw}]`＋`steps[{note,networks,gateways,highlight}]`。ホストIPからネットワークアドレスを段階で図中に「？→値」と書き込み、ルータ両端IP(GW)も接続線上に明記。
- `PacketFlowFigure` の拡張: `sideTable{title,columns}`＋`PacketStep.tableRows`/`tableHighlightRow`（**ステップ連動で埋まる表**。MAC学習で使用。**経路表をホップごとに一致行強調する用途に最適**）／`hideHeaders`（L2/L3ヘッダ表を隠す）。`PacketStep.blockedLink`。
- `FigureRenderer`（figure.kind で分岐）。型は `types.ts` の `Figure` union に kind 追加で拡張。
- 既読遷移バグ修正済み: `TextbookChapter` は章切替時にページ先頭へ戻る。

## まだ作っていない図・拡張（必要章で）
- `TopologyView`/`GraphTopology` の**領域フォーカスモード**（第8章以降の大規模構成図。figure-spec §3.9。俯瞰＋現在ゾーン詳細）。第7章でルータ・セグメントが増えるので、**ここで縦リフロー/graph で破綻しないか要検討**（破綻するなら領域フォーカスの先行導入を設計段階で相談）。
- `packet-flow` の `verdict`(pass/block, 第9章FW)・ノード`down`(第11章フェイルオーバー)。
- 新ノード role: `lb`/`proxy`/`ap`/`phone`/`monitor`/`mail`（`types.ts` NodeRole ＋ `figureTokens`）。

## 第7章の詳細設計（chapter-designs §第7章 を正とする・要拡張）
**ねらい/接続**: 第6章で設計したアドレスの間を、ルータがどう繋ぐか。第1章「ルータはあて先IPで道を選ぶ」を本格化。第5章の別VLAN間=L3、第6章のネットワークアドレス/プレフィックスがそのまま効く。
**構成図の差分**: 2台目のルータを追加し、複数セグメント（192.168.10.0/24・192.168.30.0/24・サーバLAN 172.16.0.0/24）を相互接続。経路の冗長（2経路）も用意し、OSPF/経路選択の題材に。
**節構成（案。詳細化して実装すること）**:
1. 導入: 第1章「あて先IPで道を選ぶ」の中身。ルータは何を見て、どこへ送るか。
2. 経路表の読み方: `record-table`（宛先プレフィックス→次ホップ→出口IF→メトリック）＋ `packet-flow`（宛先IPと照合し次ホップへ。第1章の付け替えと接続）。「次ホップ」は最終宛先でなく"次の1歩"。
3. ロンゲストマッチ: `record-table`（同じ宛先に 0.0.0.0/0・192.168.0.0/16・192.168.30.0/24 が並び、**最長一致行を `highlightRow` で強調**）。デフォルトルート0.0.0.0/0=第1章GW。
4. スタティック: `record-table`。手で1本ずつ。フローティングスタティックは軽く。
5. ダイナミック(OSPF): `topology`（2ルータが隣接→経路を学び合い最短をハイライト）。リンクステート＝各自が全体地図、コスト(帯域)で最短SPF、エリアで階層化(概要)。
6. 経路集約と経路選択: `record-table`（集約前後／経路源と優先度=AD→メトリック）。
7. 午後: 経路表から通信経路と次ホップ、ロンゲストマッチ、冗長経路の切替、経路集約（いずれも午後頻出）。
8. まとめ。
**takeaways**: 経路表＋ロンゲストマッチで次ホップ／スタティック(手動)とダイナミック/OSPF(自動)／OSPFはコストで最短／集約で経路表を小さく・AD→メトリックで選ぶ／デフォルトルート=第1章GW。
**技術メモ/午後**: 経路表(connected/static/OSPF)、ロンゲストマッチ、AD/メトリック、OSPF(リンクステート/コスト/エリア)、経路集約、デフォルトルート。**ルータを越えるたびTTLが1減る(ループ防止)。ping/tracerouteはICMPを使う(第19章で活用)**。BGPは第8章。新規 figure kind なし（record-table/topology/segment-map/graph を再利用）。

**設計時に詰めること（重要）**:
- **経路表と構成図の連動**が肝。おすすめは `packet-flow`＋`sideTable`（経路表）で、ホップごとに参照した経路表の行を `tableHighlightRow` で光らせ、次ホップへ進む見せ方（MAC学習の生きた表と同じ仕組み・再利用可）。ロンゲストマッチも「複数一致→最長行を強調」で同パターン。
- **複数ルータ・複数セグメント・冗長2経路**の構成図を、スマホ縦で破綻させない方法（graph レイアウト拡張／領域フォーカスの要否）を先に決める。図が増えるので、1枚に詰め込まず節ごとに分割。
- IPアドレス・次ホップは**図の中に明記**（説明文任せにしない）。第6章 segment-map の「両端IP・ネットワークアドレスを図中に書く」方針を踏襲。
- OSPF/AD/エリアは深入りせず「名前と役割だけ」。コスト=帯域ベースで最短、という直感に絞る。

## 章をまたぐ一貫アドレス（chapter-designs の台帳に従う）
本社内部LAN 192.168.10.0/24（PC .10 / GW(ルータ) .1 / DNS .53 / DHCP .67）／第2セグメント 192.168.30.0/24（6章。GW .1）／サーバLAN（DMZ）172.16.0.0/24（Web .20 / Mail .25 / LB-VIP .10。7章まで「サーバLAN」、8章でDMZ明示）／グローバル 203.0.113.0/30（.1）／第2拠点 192.168.20.0/24（12章）／クラウドVPC 10.0.0.0/16（17章）。点対点リンクは/30。

## 1章を起こす手順
1. `chapters/chNN-xxx.ts` を作成（ch01/ch04/ch06 を雛形に）。本文の要点・図・構成図差分をデータで記述。`estimatedMinutes` も設定。
2. `index.ts` で該当 draft（`[N,'id',…]`）を DRAFTS から外し、`chNNxxx` を import → `textbookChapters` 配列に追加（published 化）。
3. 新 kind/role が要れば types→FigureRenderer→component、figureTokens を追加。
4. 検証（下記）→ 細かい単位でコミット＆プッシュ。

## 文体・用語ルール（ユーザーは非常に厳しい。最重要）
- **敬体＋体言止め。常体（〜する。/〜だ。/〜である。/〜ない。/〜い。で終わる文）は絶対に使わない**。本文だけでなく**図のキャプション・takeaway・notes・explanation・表のセル・タイムライン項目・カード見出し**も全部対象。章を書いたら `grep` で常体終止と非ネスペ用語を点検してから検証へ。
- **ネスペ・応用情報に出ない用語は使わない**（例:「5タプル」不可→「通信を見分ける5つの情報」）。迷ったら過去問の語彙。
- 専門用語は初出で平易な言い換え。「名前のみ」の語は「名前だけ押さえればよい」と明示（OSPFのエリア、AD等はここ）。
- 過不足なく（同じことを caption/本文/callout で繰り返さない＝冗長は差し戻し対象）。第1章へ繰り返し接続（伏線回収）。前方参照は「詳しくは第N章」と一言。
- 1章に詰め込みすぎない。理解の主役は図と動き。

## 検証フロー（スクショは使えない。DOM計測が主）
- dev起動: `preview_start`（name "nwsp-dev"、port 5173）。サーバはしばしば停止するので都度再起動。HMRの中間状態で古いエラーがバッファに残ることがある→疑わしければサーバ再起動でクリア。
- ログインゲート回避（origin localhost:5173 で）: `localStorage.setItem('nwsp:auth', JSON.stringify({userId:'review',loggedInAt:new Date().toISOString(),expiresAt:new Date(Date.now()+30*864e5).toISOString()}))`
- 章URL: `/textbook/<id>`（例 `/textbook/routing`）。
- **⚠ この環境の `preview_screenshot` はタイムアウトして使えない。** 一次検証は `preview_eval` の DOM 計測:
  - 横スクロール: `scrollWidth - clientWidth === 0`・幅超過要素0 を **375 / 360 / 1280px** で（resize 後に計測。再起動直後は viewport 未設定なので必ず resize してから測る）。
  - 動く図: 全ステップを「次へ」で送り、**操作ボタンの top がステップ間で一定**＝ボタン不動。図の高さ一定も。
  - 図の構造（要素数・色・座標・テキスト）を DOM で確認。`preview_console_logs` level error/warn が無いこと。
  - ナビゲートと計測は別の eval に分ける。`.click()` の効果は同一 eval 内では反映されない（Reactの非同期再描画）→「計測→クリック」を別evalで繰り返す。
- **見た目の品質確認**: スクショが使えないので、図を作ったら**実装と同じ座標・色で `show_widget` に再現してユーザーに見せる**と的確に確認をもらえる（今セッションで有効だった）。
- `tsc --noEmit` 0。目視が要る所は「`/textbook/<id>` で直接確認を」とユーザーに委ねる。

## 品質バー（今セッションで実際に差し戻された理由＝再発させない）
- スマホ横スクロール／AI臭・常体敬体混在／非ネスペ用語。
- **図は汎用フォーマットに無理に寄せない。各図で「一番見やすい・分かりやすい形」を優先**（ループは曲線で描く＝一直線NG。一度合意した見せ方を共通化のために崩さない）。
- **ノードやラベルを覆う要素を作らない**（移動吹き出しがノードを覆ったのが差し戻し）。動きは強調＋方向矢印・段階表示で。
- **スカスカで意味の薄い図は載せない**（2層だけのカプセル図など）。図を足すなら密度と意味を確認。
- **説明は「すでに図に出ている値を本文で繰り返す」循環を避け、与件から導く流れに**（ホスト→ネットワークアドレスを導く等）。**必要な情報（IP・次ホップ等）は説明文任せにせず図の中に書き込む。**
- デスクトップの小型ノードカード(約84px)に長文を入れると折返して崩れる→ノードの sub は短く、長い情報は説明文や専用図へ。
- 無限アニメ禁止（有限ステップ）。第1〜6章と同水準で。

## Git
- 章ごとに細かくコミット＆プッシュ（main）。メッセージは日本語、末尾に必ず `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`。
- 無関係な未追跡ファイル（`afternoon-scoring-proposal-v2.md` / `pc-mobile-sync-requirements.md` / `user-review-findings-ai-readable.yml`）はコミットしない。

## 進め方
1. まず**第7章の詳細設計**を作る（節構成を確定し、各節の図＝種類・何を見せ何を図中に書くか・データ構造・構成図の成長・スマホ縦での収め方）。経路表↔構成図の連動（packet-flow＋sideTable で一致行強調）と、複数ルータ/冗長2経路/OSPF最短の見せ方を具体化。
2. 新しい見せ方が要る図は **show_widget でモックを作りユーザーに提示→合意**（ルーティングは最重要なので、ここを丁寧に）。
3. 合意後に実装 → 第1章水準で検証（375/360/1280横スクロール0・全ステップ送りでボタン不動・tsc 0・コンソール無）→ コミット＆プッシュ → ユーザーへ要点報告（実装内容・検証結果・直接確認URL）。
4. 指摘が来たら反映。大きな方針変更はユーザー確認。以降 第8章→…と1章ずつ。
