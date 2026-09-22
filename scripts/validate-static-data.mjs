// 午後解説（/afternoon1）の静的データを機械検査する
//
// 解答行・配点・解説・公式設問文・図表の4者は rowKey と配列順で暗黙に結ばれていて、
// どれか1つを直し忘れると黙ってズレる。それを CI 前に落とすための検査。
//
// 使い方: npm run validate-data
// 終了コード: 0 = 問題なし / 1 = NG あり
//
// データファイルは TypeScript のまま読む（Node 22.6+ の型ストリップに任せる）。

import fs from 'node:fs'
import path from 'node:path'
import { registerHooks } from 'node:module'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const load = (rel) => import(pathToFileURL(path.join(ROOT, rel)).href)

// TS の相対 import は拡張子なし（'./r6' など）。Node の ESM 解決はそれを拾わないので、
// Vite/tsc と同じように .ts / .tsx / /index.ts を補って解決する。
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith('.') && path.extname(specifier) === '') {
      const base = new URL(specifier, context.parentURL).href
      for (const ext of ['.ts', '.tsx', '/index.ts']) {
        const url = base + ext
        if (fs.existsSync(fileURLToPath(url))) return { url, shortCircuit: true }
      }
    }
    return nextResolve(specifier, context)
  },
})

const { officialAnswers } = await load('src/data/officialAnswers.ts')
const { scoringMap } = await load('src/data/scoringMap.ts')
const { afternoon1Explanations, makeRowKey } = await load('src/data/afternoon1/explanations.ts')
const { afternoon1QuestionTexts } = await load('src/data/afternoon1/questionTexts/index.ts')
const { afternoon1ExamFigures } = await load('src/data/afternoon1/examFigures.ts')
const { AFTERNOON1_FIGURE_IDS } = await load('src/data/afternoon1/figureIds.ts')

// ─────────────────────────────────────────────
// 検査結果の集計
// ─────────────────────────────────────────────
const problems = []
const notes = []
const fail = (scope, detail) => problems.push({ scope, detail })
const note = (text) => notes.push(text)

// ─────────────────────────────────────────────
// 1. 解答行 ↔ 配点
//    scoringMap[id] は answers[] と「配列の並び順」で対応する。
//    行数がズレると以降の行の配点が全部ずれる。
// ─────────────────────────────────────────────
const MAX_SCORE = { G1: 50, G2: 100 }

for (const set of officialAnswers) {
  const rows = scoringMap[set.id]
  if (!rows) {
    fail(set.id, '配点（scoringMap）が定義されていません')
    continue
  }
  if (rows.length !== set.answers.length) {
    fail(set.id, `配点行数 ${rows.length} が解答行数 ${set.answers.length} と一致しません`)
  }
  const total = rows.reduce((sum, r) => sum + r.correct, 0)
  if (total !== MAX_SCORE[set.section]) {
    fail(set.id, `正解点の合計 ${total} が満点 ${MAX_SCORE[set.section]} と一致しません`)
  }
}

// ─────────────────────────────────────────────
// 2. rowKey の重複
//    rowKey = s|q|t。同じ問題の中で重複すると解説・設問文の引き当てが壊れる。
//    既存の officialAnswers には t ラベルの無い同一小問が並ぶ問がある（例 H29-G2-1 の
//    設問1(2) は無ラベル4行）。それらは解説を書く前に t の付け方を決める必要があるので、
//    解説・設問文を投入済みの問だけ NG にし、それ以外は要確認として出す。
// ─────────────────────────────────────────────
const rowKeysById = new Map()
const dupIds = []

for (const set of officialAnswers) {
  const keys = set.answers.map((a) => makeRowKey(a.s, a.q, a.t))
  rowKeysById.set(set.id, keys)

  const covered = !!afternoon1Explanations[set.id] || !!afternoon1QuestionTexts[set.id]
  const seen = new Set()
  const dups = new Set()
  for (const k of keys) {
    if (seen.has(k)) dups.add(k)
    seen.add(k)
  }
  if (dups.size === 0) continue

  if (covered) {
    for (const k of dups) fail(set.id, `解答行の rowKey が重複しています: ${k}`)
  } else {
    dupIds.push(`${set.id}（${[...dups].join(', ')}）`)
  }
}

if (dupIds.length > 0) {
  note(
    `rowKey が重複する問（解説を書く前に t ラベルの付け方を決める必要あり）: ${dupIds.join(' / ')}`,
  )
}

// ─────────────────────────────────────────────
// 3. マークアップの開閉均衡
//    ==赤== / __ネイビー__ は必ずペア。detail 配下も含めて全文字列を走査する。
//    全角 ＝ と === は禁止（描画が崩れる）。
// ─────────────────────────────────────────────
function* walkStrings(value, pathLabel) {
  if (typeof value === 'string') {
    yield [pathLabel, value]
    return
  }
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) yield* walkStrings(value[i], `${pathLabel}[${i}]`)
    return
  }
  if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) yield* walkStrings(v, `${pathLabel}.${k}`)
  }
}

const MARKUP_PER_FIELD_LIMIT = 2

function checkMarkup(id, label, text) {
  const stripped = text.replace(/==[^=]+==/g, '').replace(/__[^_]+__/g, '')
  if (stripped.includes('==')) fail(id, `${label}: == の開閉が合っていません`)
  if (stripped.includes('__')) fail(id, `${label}: __ の開閉が合っていません`)
  if (text.includes('===')) fail(id, `${label}: === は使えません`)
  if (text.includes('＝')) fail(id, `${label}: 全角の ＝ は使えません`)

  const red = (text.match(/==[^=]+==/g) ?? []).length
  const navy = (text.match(/__[^_]+__/g) ?? []).length
  if (red > MARKUP_PER_FIELD_LIMIT) {
    fail(id, `${label}: ==赤== が ${red} 箇所（1フィールド ${MARKUP_PER_FIELD_LIMIT} 箇所まで）`)
  }
  if (navy > MARKUP_PER_FIELD_LIMIT) {
    fail(id, `${label}: __ネイビー__ が ${navy} 箇所（1フィールド ${MARKUP_PER_FIELD_LIMIT} 箇所まで）`)
  }
}

// ─────────────────────────────────────────────
// 4. 解説（afternoon1Explanations）
// ─────────────────────────────────────────────
const figureIds = new Set(AFTERNOON1_FIGURE_IDS)

/** 図表の共通検査（参照先が figureIds.ts にあるか／比較表は観点列＋3列まで） */
function checkFigures(id, figures) {
  for (const fig of figures) {
    if (fig.kind === 'exam') {
      if (!figureIds.has(fig.figureId)) {
        fail(id, `図表 figureId「${fig.figureId}」が figureIds.ts にありません`)
      }
      if (!fig.title) fail(id, `図表「${fig.figureId}」に title がありません`)
    } else if (fig.kind === 'compare') {
      if (fig.columns.length > 4) {
        fail(id, `比較表「${fig.title}」の列が ${fig.columns.length} 列（観点列＋3列まで）`)
      }
      for (const row of fig.rows) {
        if (row.cells.length !== fig.columns.length - 1) {
          fail(id, `比較表「${fig.title}」の行「${row.label}」のセル数が列見出しと合いません`)
        }
      }
    }
  }
}
const explanationIds = Object.keys(afternoon1Explanations)

for (const [id, exp] of Object.entries(afternoon1Explanations)) {
  const answerSet = officialAnswers.find((a) => a.id === id)
  if (!answerSet) {
    fail(id, '対応する公式解答データ（officialAnswers）がありません')
    continue
  }
  if (exp.id !== id) fail(id, `explanation.id「${exp.id}」がマップのキーと一致しません`)

  const expectedKeys = rowKeysById.get(id)

  // 4-1. rows[] と解答行の 1:1 突合（欠落・余剰・順序）
  const rowKeys = exp.rows.map((r) => r.rowKey)
  for (const k of expectedKeys) {
    if (!rowKeys.includes(k)) fail(id, `rows[] に行解説がありません: ${k}`)
  }
  for (const k of rowKeys) {
    if (!expectedKeys.includes(k)) fail(id, `rows[] に解答行に無い rowKey があります: ${k}`)
  }
  if (rowKeys.length === expectedKeys.length && rowKeys.some((k, i) => k !== expectedKeys[i])) {
    fail(id, 'rows[] の並び順が解答行と違います（解答欄と読む順がずれます）')
  }

  // 4-2. 記述式の行はフル3点セット、穴埋め行は point 省略可
  for (const r of exp.rows) {
    const idx = expectedKeys.indexOf(r.rowKey)
    const answer = idx >= 0 ? answerSet.answers[idx] : undefined
    if (answer?.essay && !r.point) {
      fail(id, `${r.rowKey}: 記述式の行には point が必要です`)
    }
    if (!r.basis) fail(id, `${r.rowKey}: basis がありません`)
    if (!r.reasoning) fail(id, `${r.rowKey}: reasoning がありません`)
  }

  // 4-3. 詳細解説の questionDetails も解答行と 1:1
  if (exp.detail) {
    const qdKeys = exp.detail.questionDetails.map((q) => q.rowKey)
    for (const k of expectedKeys) {
      if (!qdKeys.includes(k)) fail(id, `detail.questionDetails に設問解説がありません: ${k}`)
    }
    for (const k of qdKeys) {
      if (!expectedKeys.includes(k)) {
        fail(id, `detail.questionDetails に解答行に無い rowKey があります: ${k}`)
      }
    }
    // modelAnswer は公式解答例と一致させる（複数解答は ／ 連結）
    for (const qd of exp.detail.questionDetails) {
      const idx = expectedKeys.indexOf(qd.rowKey)
      if (idx < 0) continue
      const official = answerSet.answers[idx].a
      if (qd.modelAnswer !== official && qd.modelAnswer !== official.replace(/，/g, '／')) {
        note(`${id} ${qd.rowKey}: modelAnswer が公式解答例と一字一句は一致していません（要確認）`)
      }
    }
    if (exp.detail.keyKnowledge.length < 4 || exp.detail.keyKnowledge.length > 6) {
      note(`${id}: keyKnowledge が ${exp.detail.keyKnowledge.length} 件（目安は 4〜6 件）`)
    }
  }

  // 4-4. 解説側の図表（比較表）
  checkFigures(id, exp.detail?.figures ?? [])

  // 4-5. マークアップ
  for (const [label, text] of walkStrings(exp, 'explanation')) {
    checkMarkup(id, label, text)
  }
}

// ─────────────────────────────────────────────
// 4-6. 試験図表（examFigures）
//      参照先の id が登録済みか／未使用の id が残っていないかを見る。
// ─────────────────────────────────────────────
const usedFigureIds = new Set()

for (const [id, figures] of Object.entries(afternoon1ExamFigures)) {
  if (!officialAnswers.some((a) => a.id === id)) {
    fail(id, '対応する公式解答データ（officialAnswers）がありません')
    continue
  }
  checkFigures(id, figures)
  for (const fig of figures) {
    if (fig.kind === 'exam') usedFigureIds.add(fig.figureId)
  }
  for (const [label, text] of walkStrings(figures, 'examFigures')) {
    checkMarkup(id, label, text)
  }
}

for (const figId of AFTERNOON1_FIGURE_IDS) {
  if (!usedFigureIds.has(figId)) {
    note(`図表 id「${figId}」がどの問題からも参照されていません`)
  }
}

// ─────────────────────────────────────────────
// 5. 公式設問文（IPA 原文）
//    解答行と rowKey で 1:1。転記漏れ・余剰を突合する。
// ─────────────────────────────────────────────
for (const [id, texts] of Object.entries(afternoon1QuestionTexts)) {
  const expectedKeys = rowKeysById.get(id)
  if (!expectedKeys) {
    fail(id, '対応する公式解答データ（officialAnswers）がありません')
    continue
  }
  const keys = texts.map((t) => t.rowKey)
  for (const k of expectedKeys) {
    if (!keys.includes(k)) fail(id, `公式設問文が未転記の行があります: ${k}`)
  }
  for (const k of keys) {
    if (!expectedKeys.includes(k)) fail(id, `公式設問文に解答行に無い rowKey があります: ${k}`)
  }
  const seen = new Set()
  for (const t of texts) {
    if (seen.has(t.rowKey)) fail(id, `公式設問文の rowKey が重複しています: ${t.rowKey}`)
    seen.add(t.rowKey)
    if (!t.text) fail(id, `${t.rowKey}: 設問文が空です`)
    if (!t.heading) fail(id, `${t.rowKey}: heading がありません`)
    // 原文転記なので強調マークアップは入れない
    for (const field of ['heading', 'lead', 'text']) {
      if (t[field] && /==|__/.test(t[field])) {
        fail(id, `${t.rowKey}: 公式設問文（${field}）に強調マークアップは入れません`)
      }
    }
    if (/＝/.test(t.text)) fail(id, `${t.rowKey}: 設問文に全角の ＝ が入っています`)
  }
}

// ─────────────────────────────────────────────
// 6. 解説があるのに公式設問文が無い（逆も）
// ─────────────────────────────────────────────
for (const id of explanationIds) {
  if (!afternoon1QuestionTexts[id]) {
    note(`${id}: 解説はあるが公式設問文が未転記（解答欄に設問が出ません）`)
  }
}

// ─────────────────────────────────────────────
// 出力
// ─────────────────────────────────────────────
console.log('='.repeat(64))
console.log('午後解説（/afternoon1）静的データ検証')
console.log('='.repeat(64))
console.log(`公式解答データ: ${officialAnswers.length} 問`)
console.log(`解説投入済み  : ${explanationIds.length} 問${explanationIds.length ? `（${explanationIds.join(', ')}）` : ''}`)
console.log(`設問文転記済み: ${Object.keys(afternoon1QuestionTexts).length} 問`)
console.log(`図表 id       : ${AFTERNOON1_FIGURE_IDS.length} 件（参照 ${usedFigureIds.size} 件）`)
console.log('')

if (notes.length > 0) {
  console.log(`■ 要確認（${notes.length}件）`)
  for (const n of notes) console.log(`  - ${n}`)
  console.log('')
}

if (problems.length === 0) {
  console.log('■ NG: 0 件')
  process.exit(0)
}

console.log(`■ NG: ${problems.length} 件`)
for (const p of problems) console.log(`  [${p.scope}] ${p.detail}`)
process.exit(1)
