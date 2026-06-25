# 教科書モード 実装引継ぎプロンプト（第5章以降）

このファイルの本文を、新しい Claude Code セッションにそのまま貼って使う。

---

あなたは、ネットワークスペシャリスト試験（ネスペ）学習アプリの「図解で学ぶ教科書（教科書モード）」を、章ごとに実装していく担当です。第1〜4章（第1部）は完成・公開済み。**あなたの仕事は第5章以降を、確立済みの品質基準で1章ずつ実装すること**です。

技術スタック: React + Vite + TypeScript + Tailwind。リポジトリは main ブランチ。作業ディレクトリ D:\Claude\NWSP。

## 最初にやること（必ず順守）
1. `git pull`（main）。**ファイルはユーザーが直接手編集することがある**ので、編集前に必ず最新を Read する。
2. 設計の「正」を読む（この5つが唯一の正。古い設計文書は削除済み）:
   - `docs/textbook-mode-requirements.md`（要件）
   - `docs/textbook-mode-basic-design-v2.md`（基本設計。§6 文体、§7 検証フロー）
   - `docs/textbook-curriculum-design.md`（全体マップ・4部構成・topology ramp）
   - `docs/textbook-chapter-designs.md`（**全20章の節レベル詳細設計**＋実装手順＋共通基盤＋アドレス台帳＋本文/用語の方針。最重要）
   - `docs/textbook-figure-spec.md`（図の確定仕様・使い分け・カタログ・領域フォーカス§3.9・章×図割当）
3. 既存の実装を雛形として読む: `src/data/textbook/chapters/ch01-osi.ts`〜`ch04-web-tls-http.ts`、`src/data/textbook/types.ts`、`src/data/textbook/index.ts`、`src/components/textbook/figures/*`。
4. メモリ（`~/.claude` の textbook 関連 feedback）も確認。

## 対象読者
応用情報合格・インフラ未経験〜1年目。ネスペ学習の最初のインプット。読み物＋図解。

## 章構成（全20章。IoTは削除済み）
1 OSI／2 DNS・DHCP／3 TCP・UDP・ポート／4 TLS・HTTP【ここまで実装済＝第1部】／**5 L2スイッチング・VLAN・STP【次はここ】**／6 IPアドレス設計とサブネット／7 ルーティング（厚い章）／8 インターネット接続・NAT・BGP／9 FW・DMZ／10 LB・プロキシ・CDN／11 冗長化・可用性／12 VPN・WAN・SD-WAN／13 認証・PKI／14 無線LAN／15 IPv6／16 メール／17 仮想化・クラウド／18 VoIP・QoS／19 運用監視・障害切り分け／20 午後総合。

## 実装済みの図コンポーネント（`src/components/textbook/figures/`）
- 共通: `FigureFrame` / `StepperControls` / `useStepper` / `useIsNarrow` / `figureTokens`(TONE・ROLE_ICON・ROLE_TONE) / `TextbookRichText`([[blue/green/amber/red/slate:語]] 装飾)
- `OsiStackFigure` / `EncapFigure` / `AddressTableFigure`
- `PacketFlowFigure` ＋ `TopologyView`（構成図＋パケット移動。座標レス・スマホ縦リフロー）
- `SequenceFigure`（ラダー図。**全メッセージを描画し現在だけ強調＝ステップしてもボタン不動**。プロトコルの往復に使う）
- `TimelineFigure`（縦の俯瞰。静的）
- `RecordTableFigure`（スマホ=1行1カード/PC=表。`rowHeader`先頭列を見出し化・`emphasizeKey`差分セル強調・`highlightRow`行強調）
- `FigureRenderer`（figure.kind で分岐）
- 型: `types.ts` の `Figure` union に kind を追加して拡張する。

## まだ作っていない図（必要章で新規に作る。figure-spec が確定仕様）
- `subnet-calc`（第6章。IPをオクテット/ビットで並べ、ネットワーク部=緑/ホスト部=グレー）
- `TopologyView` の**領域フォーカスモード**（第8章以降の複雑構成図。figure-spec §3.9。俯瞰＋現在ゾーン詳細。既存 Topology データで実装可・新フィールド不要）
- `EncapFigure` の**任意入れ子レベル一般化**（第12章 IPsec・第17章 VXLAN）
- `packet-flow` 拡張: `verdict`(pass/block, 第9章FW)・ノード`down`(第11章フェイルオーバー)
- 新ノード role: `lb`/`proxy`/`ap`/`phone`/`monitor`/`mail`（`types.ts` NodeRole ＋ `figureTokens`。推奨アイコンは chapter-designs の表）

## 次の第5章（chapter-designs の第5章を正とする）
- 構成図差分: 内部LANを **L2SW×2＋VLAN（VLAN10=業務/VLAN20=管理）＋冗長リンク1本** に展開。
- 節: ①導入 ②MAC学習（`record-table` MAC→ポート ＋ `packet-flow` 学習→ユニキャスト転送）③VLAN（`packet-flow` でブロードキャストが**同色ノードを順に1つずつ有限ステップで光る**／別VLANに出ない）④STP（`topology` の**2状態**: ループ発生→片ポートblock）⑤午後 ⑥まとめ。
- **⚠ ブロードキャスト拡散もSTPストームも「無限アニメ禁止」。有限ステップで表現すること**（過去に無限SMILアニメでスクショ不能になった経緯あり）。
- 別VLAN間=L3 は第7章へ接続。

## 章をまたぐ一貫アドレス（chapter-designs の台帳に従う）
本社内部LAN 192.168.10.0/24（PC .10 / GW(ルータ) .1 / DNS .53 / DHCP .67 / RADIUS .40 / WLC .41）／第2セグメント 192.168.30.0/24（6章）／DMZ 172.16.0.0/24（Web .20 / Mail .25 / LB-VIP .10。7章まで「サーバLAN」8章でDMZ明示）／グローバル 203.0.113.0/30（.1）／第2拠点 192.168.20.0/24（12章）／クラウドVPC 10.0.0.0/16（17章）。

## 1章を起こす手順
1. `chapters/chNN-xxx.ts` を作成（ch01/ch04 を雛形に）。本文の要点・図・構成図差分をデータで記述。`estimatedMinutes` も設定。
2. `index.ts` で該当 draft（`[N, 'id', ...]`）を DRAFTS から外し、`chNNxxx` を import → `textbookChapters` 配列に追加（published 化）。
3. 新 kind/role が要れば types→FigureRenderer→component、figureTokens を追加。
4. 検証（下記）→ 細かい単位でコミット＆プッシュ。

## 文体・用語ルール（ユーザーは非常に厳しい。最重要）
- **敬体＋体言止め。常体（〜する。/〜だ。/〜である。/〜ない。で終わる文）は絶対に使わない**。本文だけでなく**図のキャプション・takeaway・notes・表のセル・タイムライン項目・カード見出し**も全部対象。
- **ネスペ・応用情報に出ない用語は使わない**（例:「5タプル」は不可→「通信を見分ける5つの情報」）。迷ったら過去問の語彙。
- 専門用語は初出で平易な言い換え（TLD＝.comの担当 等）。「名前のみ」の語は「名前だけ押さえればよい」と明示。
- 過不足なく（蛇足の念押しを足さない）。第1章へ繰り返し接続（伏線回収）。
- 前方参照（サブネット=6章・他章の用語）は「詳しくは第N章」と一言だけ添える。
- 1章に詰め込みすぎない。理解の主役は図と動き。

## 検証フロー（スクショは使えない。DOM計測が主）
- dev起動: `preview_start`（name "nwsp-dev"、port 5173）。**サーバはしばしば停止するので都度再起動**。
- ログインゲート回避（origin localhost:5173 で）:
  `localStorage.setItem('nwsp:auth', JSON.stringify({userId:'review',loggedInAt:new Date().toISOString(),expiresAt:new Date(Date.now()+30*864e5).toISOString()}))`
- 章URL: `/textbook/<id>`（例 `/textbook/l2-vlan-stp`）。
- **⚠ この環境の preview_screenshot はページ全体を縮小して返し、スマホ表示が読めない**。基本設計§7の通り **`preview_eval` の DOM 計測を一次検証**にする:
  - 横スクロール: `document.documentElement.scrollWidth - clientWidth === 0`、幅超過要素0 を **375 / 360 / 1280px** で確認。
  - 動く図: 全ステップを「次へ」で送り、**操作ボタンの top がステップ間で一定**（=ボタン不動）を確認。図の高さ一定も。
  - 図の構造（要素数・位置・色）を DOM で確認。
  - コンソールエラー無し（`preview_console_logs` level error）。
  - **ナビゲートと計測は別の eval に分ける**（location.href 後の同一 eval は無効化される）。
- `tsc --noEmit` 0。
- 目視が要る所は「`/textbook/<id>` で直接確認してください」とユーザーに委ねる（スクショ取得を無理に粘らない）。

## 品質バー（過去の差し戻し理由＝再発させない）
スマホ横スクロール／AI臭・常体敬体混在／動く文字が線・文字を隠す／死にスペース・右余り／無限アニメ／図がスマホ1画面に収まらない／非ネスペ用語。**第1〜4章と同水準**で。

## Git
- 章ごとに「細かい単位でコミット＆プッシュ」（main）。コミットメッセージは日本語。末尾に必ず:
  `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`
- 無関係な未追跡ファイル（`afternoon-scoring-proposal-v2.md` / `pc-mobile-sync-requirements.md` / `user-review-findings-ai-readable.yml`）は**コミットしない**。

## 進め方
第5章を chapter-designs と figure-spec に従って実装 → 第1章水準で検証 → コミット＆プッシュ → ユーザーへ要点報告（実装内容・検証結果・直接確認URL）。レビュー指摘が来たら反映。大きな方針変更はユーザー確認。以降、第6章→…と1章ずつ進める。
