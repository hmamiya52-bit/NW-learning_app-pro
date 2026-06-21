# 教科書モード 基本設計書（v2・再設計）

作成日: 2026-06-21

本書は `docs/textbook-mode-requirements.md`（再定義版）に基づく基本設計である。codex 版の `docs/textbook-mode-basic-design.md` ほか先行設計は破棄し、本書で置き換える。

## 0. 設計の核心（codex 失敗の是正）

codex 版の図解は、各ノードに **ピクセル座標** を直書きし、SVG に `min-width:760px` を与えて横スクロール前提にしていた。これがスマホ NG の技術的根本原因。

本設計の原則:

- **図データは座標を持たない論理データにする。** トポロジ（ノード・リンク・ゾーン）と、見せる順（ステップ）だけを持つ。
- **レイアウトはコンポーネントが画面幅に応じて算出する。** 広い画面は横並び、狭い画面は縦並び／領域フォーカスへ自動で切り替える。
- **固定 px 幅・`min-width` を禁止。** 図は常に `width:100%` に収め、文字は縮小せず読める大きさを保つ（スケールダウンで文字が潰れる方式は採らない）。

## 1. モジュール構成

### 1.1 流用するもの（画面の器）

- ルーティング（`/textbook`, `/textbook/:chapterId`）
- 章一覧ページ `src/pages/Textbook.tsx`（必要に応じ調整）
- 章詳細ページ `src/pages/TextbookChapter.tsx`（新データ構造に合わせ調整）
- 既読管理 `src/lib/textbookReadState.ts`
- 入口導線（ホーム／サイドバー）

### 1.2 破棄するもの

- `src/data/textbookDiagramChapters.ts`（生成版・本文ゼロ）
- `src/data/textbookChapterOne.ts`（本文も図も作り直し）
- `src/components/textbook/TextbookDiagram.tsx` の座標直書き系ビュー（exam-network 等）

### 1.3 新規に作るもの

```text
src/data/textbook/
  types.ts              … 章・節・図データの型
  chapters/
    index.ts            … 章の集約（公開順・状態）
    ch01-osi.ts         … 第1章データ（本文＋図＋ステップ）
    （章ごとに1ファイル。生成しない）
src/components/textbook/
  figures/
    FigureFrame.tsx     … 図の共通枠（タイトル／本文への橋渡し／1画面制御）
    Stepper.tsx         … 戻る/再生/次へ＋ステップドット（共通操作UI）
    PacketFlowFigure.tsx… 動くパケット図（全体構成図＋ホップ＋PT感）
    TopologyView.tsx    … トポロジを画面幅に応じて描く（座標を持たない）
    OsiStackFigure.tsx  … OSI 7層（段階ハイライト）
    EncapFigure.tsx     … カプセル化（ヘッダが順に付く動き）
    AddressTableFigure.tsx … MAC/IP/ポート対応（縦リフロー可）
    ArpFigure.tsx       … ARP（要求/応答の動き・同一/別NW比較）
    …（章で必要になり次第追加。2章以上で安定したら共通化）
```

章ごとに 1 データファイルを **手で書く**（codex の機械生成はやめる）。

## 2. データ設計

### 2.1 章・節

```ts
type ChapterStatus = 'published' | 'draft'

interface TextbookChapter {
  id: string
  order: number
  title: string
  summary: string            // 一覧用の短い説明
  status: ChapterStatus
  estimatedMinutes: number
  intro: Block[]             // 導入
  sections: Section[]
  takeaways: string[]        // この章で持ち帰る考え方
}

interface Section {
  heading: string
  blocks: Block[]            // 本文と図を、読む順に並べる
}

// 本文と図を同じ並びに置けるようにする（図＝1理解単位の差し込み）
type Block =
  | { kind: 'text'; text: string }      // 短い本文（[[色:語]] 装飾可）
  | { kind: 'figure'; figure: Figure }  // 図（多くはステップ式＝動く）
  | { kind: 'callout'; tone: CalloutTone; title: string; body: string }
```

方針: 節は「短い本文 → 図（動き）→ 短い本文」の交互。長文の段落を積まない（淡々さ・AI 臭の回避）。

### 2.2 図（Figure）共通

```ts
interface FigureBase {
  id: string
  title: string
  caption: string            // 「この図で何を見るか」1行
  takeaway?: string          // 「ここを誤解しない」1行
}
```

すべての図は **座標を持たない**。表示はコンポーネントが算出する。

### 2.3 動くパケット図（中核）

```ts
interface PacketFlowFigure extends FigureBase {
  kind: 'packet-flow'
  topology: Topology         // 全体構成図（常時表示）
  steps: PacketStep[]
}

interface Topology {
  nodes: TopoNode[]          // 論理ノード（座標なし）
  links: TopoLink[]          // 隣接（経路）
  zones: TopoZone[]          // 境界（内部LAN / サーバLAN 等）
}
interface TopoNode { id: string; label: string; role: NodeRole; zoneId?: string; sub?: string }
interface TopoLink { a: string; b: string }
interface TopoZone { id: string; label: string; tone: Tone }

interface PacketStep {
  focus: { type: 'link'; a: string; b: string } | { type: 'node'; id: string }
  packetLabel: string        // 例: 'TCP SYN' / 'ARP要求' / '付け替え'
  headers: { l2: string; l3: string; l4?: string }  // 区間の見え方
  concept?: { l2?: string; l3?: string; l4?: string } // 「区間ごとに変わる」等のタグ
  explanation: string        // 1〜2文
}
```

レンダリング要件（`PacketFlowFigure.tsx` / `TopologyView.tsx`）:

- **全体構成図を常時表示**し、`focus` の区間/ノードを光らせる。
- パケットを **実経路上で動かす**（パケットトレーサー感）。`prefers-reduced-motion` 時は移動を抑え、ハイライトのみ。
- 区間ごとに L2/L3/L4 と概念タグ（宛先 MAC は区間ごとに変わる／宛先 IP は最終宛先のまま）を表示。
- 操作は共通 `Stepper`（戻る/再生/次へ＋ドット）。説明とハイライトは常に一致。
- **スマホ1画面**: 全体図（小）＋現在区間の詳細＋説明＋操作 が縦に収まる。

### 2.4 静的・段階図

OSI スタック、カプセル化、フレーム入れ子、アドレス表、ARP、VLAN など。可能な限り **ステップ式（動き）** にする（例: カプセル化はヘッダが 1 つずつ付く、ARP は要求→応答が動く、VLAN はブロードキャストが同一 VLAN 内に広がる）。共通 `Stepper` を流用。

## 3. レイアウト規則（スマホ最優先・1画面・横スクロール禁止）

### 3.1 ブレークポイント

- mobile: 〜480px（基準。375/390 を必ず確認）
- tablet: 〜1024px
- desktop: 1025px〜

### 3.2 トポロジの自動レイアウト（`TopologyView`）

座標を持たないノードを、次の規則で配置する。

- **desktop / tablet**: ゾーンを左→右に並べ、ノードを横並び。リンクは水平。
- **mobile**: 既定で **縦並び**（ゾーンを上→下、ノードを縦）。リンクは垂直。パケットは縦に流す。
  - これにより、ノードが増えても横にはみ出さない（縦に伸びる）。
- **ノード数が多い章（段階的複雑化の後半）**: mobile では **領域フォーカス**を使う。全体図はゾーン単位の俯瞰（小）にし、現在ステップが属するゾーンだけ詳細表示。全体は常に俯瞰で見える。
- いずれも `width:100%`、固定 px 幅・`min-width` 禁止。文字は最小 12px 程度を維持（縮小に頼らない）。

### 3.3 1画面に収める指針

- 図1つ＋その説明＋操作で、mobile のビューポート高に概ね収める。
- 収まらない場合は、図を分割（1図＝1理解単位）するか、ステップ式にして 1 ステップを 1 画面にする。
- 本文は要点を短く。詳細は図の中／ステップ説明に逃がす。

### 3.4 静的図のリフロー

- 横並びの表・カードは mobile で縦積みに切り替える（`flex-wrap` / `grid` の列数を画面幅で変える）。
- 横スクロールが必要な表は作らない。列が多い場合は行持ち（縦持ち）へ変換。

## 4. 章テンプレート（情報設計＝読み物＋1画面図解ユニット）

各章の標準構成:

1. 導入（短く・つかみ）: この章で何ができるようになるか
2. まずイメージ（図・できれば動き）
3. 全体像（その章のネットワーク構成図／動くパケット図）
4. 仕組みを順に（短い本文 ↔ 図の交互、図は動き多め）
5. 実務での見え方（短く）
6. ネスペ午後での問われ方（短く）
7. つまずきやすい点（callout）
8. まとめ（持ち帰る考え方）

各節は「短い本文 → 図 → 1行の見どころ」を基本リズムにする。

## 5. 段階的複雑化（章を貫く設計）

- 構成図の複雑さを章で段階的に上げる。目安:
  - 第1章: 最小（PC—L2SW—L3SW—Webサーバ、ゾーン2つ）
  - 中盤: ゾーン増・冗長化・複数経路・DMZ 等を少しずつ
  - 終盤（午後総合）: ネスペ午後相当の構成図
- 複雑化しても §3.2 の自動レイアウト＋領域フォーカスで mobile 横スクロールなしを維持。
- `TopologyView` は単純〜複雑トポロジを同じデータ形で扱えること（段階的複雑化に耐える）。

## 6. 文章・トーン（AI 臭の排除・淡々の回避）

- 人が隣で教えるような自然体。語りかけは過剰にしない。
- 避ける: 「〜することができます」「〜になります」の連発、無意味な前置き、箇条書きだけで終える節、冗長な敬語の重ね。
- 好む: 短く言い切る、具体例から入る、つまずきポイントを先回りで一言、図へ橋渡しする 1 行。
- 1 節の本文は短く。理解の主役は図と動き。

## 7. スマホ描画の検証フロー（盲目作業の再発防止）

前回 `preview_screenshot` が dev/preview サーバで常時タイムアウトした。原因の有力候補は PWA Service Worker と HMR による network-busy。

対応:

1. 実装着手前に原因を特定する（`vite.config` の PWA `devOptions`、SW 登録の有無）。
2. 検証用に **SW/PWA を無効化したプレビュー** を用意するか、SW を unregister した状態で確認する。
3. 一次検証は **`preview_eval` の DOM 計測**（確実）:
   - `maxScrollX === 0`（横スクロールなし）を 375/390/768/1280 で確認
   - 各図ユニットの高さがビューポート高に収まるか計測
   - 要素の重なり検出（バウンディングボックス）
4. スクリーンショットが撮れる状態を確保し、最終的に目視確認する。
5. 上記をチェックリスト化し、章ごとに実施。

## 8. 既存への影響・非機能

- 教科書モード外へ影響を出さない（型・データ・コンポーネントは textbook 配下に閉じる）。
- 既読は専用 localStorage キーのまま。同期・XP・活動履歴に出さない。
- 画像ファイルを追加しない。`lucide-react`（既存）でアイコン。
- バンドル肥大に注意（章データは静的 import で可、必要なら遅延読み込みは後続検討）。

## 9. 実装順

- フェーズ0: スマホ描画の検証フロー確立（§7）。
- フェーズ1: 型（§2）＋共通コンポーネント（`Stepper` / `FigureFrame` / `TopologyView` / `PacketFlowFigure`）＋第1章データ（最小構成・自然な本文・動き多め）。一覧/章ページを新データ構造へ接続。
- フェーズ1レビュー: 第1章でトーン・図・スマホ表示の型を確定。
- フェーズ2以降: 段階的複雑化に沿って後続章を 1 章ずつ。2章以上で安定した図は共通化。

## 10. 第1章（最小構成）の図・動きの目安

- 動くパケット図: PC→L2SW→L3SW→Webサーバ（ゾーン=内部LAN/サーバLAN）。ホップ単位＋全体図常時表示＋PT感（モックアップ確定済みの方向）。
- OSI 7層（段階ハイライト）／カプセル化（ヘッダが順に付く動き）／フレーム・パケット・セグメント入れ子／MAC・IP・ポート対応（縦リフロー）／ARP（要求→応答の動き）。
- いずれもスマホ1画面・横スクロールなしで成立させる。

## 11. 実装状況

- 2026-06-21 フェーズ0完了: スクショ不能の原因は codex 図の `repeatCount="indefinite"`（無限SMILアニメ）と判明。新コンポーネントは**無限アニメ禁止・ステップ連動の有限トランジションのみ**とし、スクショ＋DOM計測の両方で検証可能にした。
- 2026-06-21 フェーズ1完了（第1章）: 型（`src/data/textbook/types.ts`）＋共通図解（`src/components/textbook/figures/`：Stepper/FigureFrame/TopologyView/PacketFlowFigure/OsiStack/Encap/AddressTable）＋第1章データ（`chapters/ch01-osi.ts`）を実装。`TopologyView` は座標レスで、広い画面=横並び・スマホ=縦リフロー。旧 codex 図解一式（textbookDiagramChapters / textbookChapterOne / TextbookDiagram / PacketFlowVisualizer 等）は削除。
- 検証: `npm run build` 成功・新ファイル lint 指摘なし。375px で `maxScrollX=0`・はみ出し要素0。動くパケット図のステップ送り・区間ハイライト・ヘッダ連動・縦リフロー・スクショをブラウザで確認。
- 次: 第1章のレビュー反映 → §5.4 の段階的複雑化に沿って第2章以降へ展開。
