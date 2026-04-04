# NWSPフォルダ構成説明資料

## プロジェクト概要
ネットワークスペシャリスト試験対策 SPA（Single Page Application）学習アプリ。
React 19 + TypeScript + Vite 8 + Tailwind CSS v3 + vite-plugin-pwa で構築されたPWA対応アプリ。

---

## ルートディレクトリ

```
D:\Claude\NWSP\
├── src/                    ← アプリのソースコード（メイン）
├── public/                 ← 静的ファイル（アイコン等）
├── dist/                   ← ビルド出力（npm run build で生成）
├── node_modules/           ← npmパッケージ（Gitには含めない）
├── index.html              ← SPAのエントリポイントHTML
├── package.json            ← 依存パッケージ・スクリプト定義
├── package-lock.json       ← 依存ロックファイル
├── vite.config.ts          ← Vite設定（PWAプラグイン含む）
├── tailwind.config.js      ← Tailwind CSSカスタム設定
├── postcss.config.js       ← PostCSS設定（Tailwind処理用）
├── tsconfig.json           ← TypeScript基本設定
├── tsconfig.app.json       ← アプリ向けTypeScript設定
├── tsconfig.node.json      ← Node.js向けTypeScript設定
├── eslint.config.js        ← ESLintルール設定
├── requirements.md         ← 要件定義書（v1.3）
├── STRUCTURE.md            ← 本ファイル（フォルダ構成説明）
├── extracted_text.txt      ← PDFからpdfplumberで抽出したテキスト
├── 復習ノート.pdf           ← 学習コンテンツの元ソース（85ページ）
└── 令和7-8年.txt           ← 令和7-8年度試験対応の追加資料
```

---

## src/ ディレクトリ詳細

```
src/
├── main.tsx                ← Reactエントリポイント（ReactDOM.createRoot）
├── App.tsx                 ← ルーティング定義（React Router v6）
├── index.css               ← グローバルスタイル（Tailwind directives）
├── assets/                 ← 画像等の静的アセット
│   ├── hero.png
│   ├── react.svg
│   └── vite.svg
├── types/
│   └── index.ts            ← 全TypeScript型定義（7つのinterface）
├── lib/
│   └── storage.ts          ← LocalStorage CRUD操作（全データ永続化）
├── data/                   ← アプリのコンテンツデータ
│   ├── categories.ts       ← 19カテゴリの定義配列
│   ├── topics.ts           ← トピック一覧（現在はスタブ）
│   ├── questions.ts        ← 全問題データ（110問超、要拡充）
│   └── protocols.ts        ← プロトコル一覧データ（55種）
├── components/             ← 再利用可能なUIコンポーネント
│   ├── CategoryCard.tsx    ← カテゴリカード（進捗バー・正答率表示）
│   ├── StudyModeButton.tsx ← 学習モード選択ボタン（primary/secondary）
│   └── quiz/               ← クイズ画面専用コンポーネント
│       ├── ModeSelect.tsx          ← 解答モード選択（4択/記述）
│       ├── QuizQuestion.tsx        ← 問題表示（穴埋め・選択肢・テキスト入力）
│       ├── ResultMultipleChoice.tsx ← 4択結果表示（自動判定）
│       └── ResultWritten.tsx        ← 記述結果表示（自己判定）
└── pages/                  ← ページコンポーネント（ルートに対応）
    ├── Home.tsx            ← "/" トップ・ダッシュボード
    ├── Quiz.tsx            ← "/quiz" クイズオーケストレーター
    ├── QuizSummary.tsx     ← セッション終了サマリー
    ├── Protocols.tsx       ← "/protocols" プロトコル一覧
    ├── Search.tsx          ← "/search" 問題全文検索
    └── Settings.tsx        ← "/settings" 設定・統計・リセット
```

---

## 主要ファイル詳細

### `src/types/index.ts` — 型定義
| interface | 用途 |
|---|---|
| `Category` | カテゴリ（id, name, order, description） |
| `Topic` | トピック（カテゴリ内の小分類、現在未使用） |
| `Question` | 問題（id, topicId, questionText, correctAnswer, choices, isImportant, explanation, difficulty） |
| `AnswerRecord` | 解答記録（questionId, mode, isCorrect, userAnswer, answeredAt） |
| `UserProgress` | トピック別進捗（totalAttempts, correctCount, lastStudiedAt） |
| `StudySession` | 学習セッション（mode, categoryId, questionCount, correctCount） |
| `Bookmark` | ブックマーク（questionId, createdAt） |

### `src/lib/storage.ts` — データ永続化
LocalStorageのキー一覧：
| キー | 内容 |
|---|---|
| `nwsp_answer_records` | 全解答記録（AnswerRecord[]） |
| `nwsp_progress` | トピック別進捗（UserProgress[]） |
| `nwsp_sessions` | 学習セッション（StudySession[]） |
| `nwsp_bookmarks` | ブックマーク（Bookmark[]） |

### `src/data/categories.ts` — 19カテゴリ定義
| id | 名称 | 備考 |
|---|---|---|
| layer1-3 | レイヤ1〜3基礎 | |
| routing | ルーティング | OSPF・BGP・VRRP |
| dns | DNS | |
| dhcp | DHCP | |
| http | HTTP | HTTP/2・HTTP/3・QUIC含む |
| mail | メール | SPF・DKIM・DMARC |
| ssl-tls | SSL/TLS | |
| ipsec | IPsec | |
| firewall | ファイアウォール・NAT | |
| ids-ips | IDS・IPS | WAF含む |
| wireless | 無線LAN | Wi-Fi 7含む |
| tcp-ip | TCP/IP詳細 | |
| voip | VoIP | RTP・SIP |
| wan | WAN・専用線 | MPLS・SSL-VPN |
| monitoring | ネットワーク監視 | SNMP・AIOps・ストリーミングテレメトリ |
| security-attack | セキュリティ攻撃 | DRDoS・Tempest |
| ldap-auth | 認証・LDAP | RADIUS・SAML・Kerberos |
| ipv6 | IPv6 | NDP・SLAAC・DAD |
| iot | IoT・R7-8補足 | MQTT・CoAP・LPWA・SASE・ZTNA |

### `src/data/questions.ts` — 問題データ
- **形式**: 穴埋め問題（`{{blank}}` マーカー）
- **モード切替**: 4択（choices配列を使用）/ 記述（自由記述→自己判定）
- **重要フラグ**: `isImportant: true` = 重要問題モードで出題
- **難易度**: 1=基礎, 2=標準, 3=応用
- **問題追加方法**: 下記「問題追加ガイド」参照

### `vite.config.ts` — PWA設定
- `registerType: 'autoUpdate'` → 新バージョン自動適用
- `display: 'standalone'` → スマホでアプリ風表示
- `theme_color: '#1e40af'` → ステータスバー色
- Workboxキャッシュ設定 → オフライン対応

---

## URLルーティング

| URL | コンポーネント | 機能 |
|---|---|---|
| `/` | Home | ダッシュボード・カテゴリ一覧 |
| `/quiz?mode=random` | Quiz | ランダム出題 |
| `/quiz?mode=important` | Quiz | 重要問題モード |
| `/quiz?mode=weakness` | Quiz | 弱点克服モード |
| `/quiz?mode=topic&category=<id>` | Quiz | カテゴリ別学習 |
| `/protocols` | Protocols | プロトコル一覧（55種） |
| `/search` | Search | 問題全文検索 |
| `/settings` | Settings | 設定・統計・リセット |

---

## 問題追加ガイド（`src/data/questions.ts`）

```typescript
// 末尾の ] の前に追加する
{
  id: 'q-xxx',           // 一意のID（連番推奨）
  topicId: 'routing',    // categories.tsのid値と一致させる
  questionText: '{{blank}}はOSPFで使われるデータベースである。',
  correctAnswer: 'LSDB',
  choices: ['LSDB', 'RIB', 'FIB', 'CAM'],  // 正解を必ず含める
  isImportant: true,     // 重要問題モードに含めるか
  explanation: '解説文...',
  difficulty: 2,         // 1:基礎 2:標準 3:応用
},
```

### ルール
- `id` は重複禁止（`q-001` 〜 `q-186`、`q-r7-001` 〜 `q-r8-011` 使用済み）
- `topicId` は19種のカテゴリIDのいずれか
- `choices` は必ず4つ（正解1つ + 誤答3つ）
- `questionText` の空欄は `{{blank}}` で統一

---

## 開発コマンド

```bash
# 開発サーバ起動（http://localhost:5173）
node "C:\Program Files\nodejs\node.exe" node_modules/vite/bin/vite.js

# 本番ビルド → dist/ に出力
node "C:\Program Files\nodejs\node.exe" node_modules/vite/bin/vite.js build

# 型チェックのみ
node "C:\Program Files\nodejs\node.exe" node_modules/typescript/bin/tsc --noEmit
```

> **注意**: npmコマンドが使えない環境のため、node.exeをフルパスで指定する必要がある。
