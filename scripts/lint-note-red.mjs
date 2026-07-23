// ノートモードの赤字トークンを機械検査する
//
// docs/note-mode-rework-policy.md の「方針1: 赤字基準の明文化」に基づく検出。
// 赤字 = 「試験の解答欄に書く可能性がある語・数値」のみ、という基準に反する
// 疑いのあるトークンを洗い出す。判断が要るものは落とさず報告する方針。
//
// 使い方: node scripts/lint-note-red.mjs [--category <id>]

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const NOTES_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'notes')

// ─────────────────────────────────────────────
// データ読み込み（カテゴリファイルは純粋なオブジェクトリテラル）
// ─────────────────────────────────────────────
function loadCategory(file) {
  const raw = fs.readFileSync(path.join(NOTES_DIR, file), 'utf8')
  const body = raw
    .replace(/^import[^\n]*\n/gm, '')
    .replace(/^\/\*\*[^\n]*\n/gm, '')
    .replace(/export const [A-Za-z0-9_]+: NoteData =/, 'return')
  return new Function(body)()
}

// ─────────────────────────────────────────────
// 検査ルール
// ─────────────────────────────────────────────
const SYMBOL_RE = /[。、，．・：；「」『』（）()[\]／/,:;！？!?]/
const JP_RE = /[ぁ-んァ-ヶ一-龯]/

// 単体で赤字にすべきでない一般語（方針の N1・N3）
const GENERIC_WORDS = new Set([
  '静', '動', '先', '内', '外', '安', '高', '低', '大', '小',
  'する', 'しない', 'できる', 'できない', 'ある', 'ない',
  '簡単', '複雑', '小さい', '大きい', '短い', '長い', '速い', '遅い',
  '多い', '少ない', '高い', '低い', '全て', '待ち', '必要', '不要',
  '可能', '不可', '増加', '減少',
])

const RULES = [
  {
    id: '記号入り',
    desc: '句読点・記号を含む赤字（N4）',
    test: (t) => SYMBOL_RE.test(t),
  },
  {
    id: '1文字',
    desc: '日本語1文字の赤字。想起問題として成立しにくい（N1/N2）',
    test: (t) => t.length === 1 && JP_RE.test(t),
  },
  {
    id: '一般語',
    desc: '解答欄に書く語ではない一般語（N1/N3）',
    test: (t) => GENERIC_WORDS.has(t),
  },
  {
    id: '前後空白',
    desc: '前後に空白を含む赤字。語の切り出しが不正確',
    test: (t) => t !== t.trim() && t.trim() !== '',
  },
]

// ─────────────────────────────────────────────
// 走査
// ─────────────────────────────────────────────
function collectRedTokens(note, categoryId) {
  const found = []
  note.sections.forEach((section, si) => {
    const push = (tokens, source) => {
      tokens.forEach((tok, ti) => {
        if (tok.style === 'red') {
          found.push({ categoryId, section: section.heading, si, source, text: tok.text, ti, tokens })
        }
      })
    }
    ;(section.richItems ?? []).forEach((tokens) => push(tokens, 'richItems'))
    ;(section.navyItems ?? []).forEach((tokens) => push(tokens, 'navyItems'))
    ;(section.richProtocolTables ?? []).forEach((table) => {
      table.rows.forEach((row) => {
        if (row.nameStyle === 'red') {
          found.push({ categoryId, section: section.heading, si, source: 'protoName', text: row.name, ti: 0, tokens: [] })
        }
        push(row.portTokens ?? [], 'protoPort')
        push(row.description ?? [], 'protoDesc')
      })
    })
    ;(section.headerDiagrams ?? []).forEach((dg) => {
      dg.rows.forEach((row) => {
        row.cells.forEach((cell) => {
          if (cell.isRed) {
            found.push({ categoryId, section: section.heading, si, source: 'diagram', text: cell.label, ti: 0, tokens: [] })
          }
        })
      })
    })
  })
  return found
}

/** 連続する赤字トークン（語が途中で割れている疑い） */
function findAdjacentReds(note, categoryId) {
  const found = []
  note.sections.forEach((section, si) => {
    const scan = (tokens) => {
      for (let i = 0; i < tokens.length - 1; i++) {
        if (tokens[i].style === 'red' && tokens[i + 1].style === 'red') {
          found.push({
            categoryId,
            section: section.heading,
            si,
            text: `${tokens[i].text}｜${tokens[i + 1].text}`,
          })
        }
      }
    }
    ;(section.richItems ?? []).forEach(scan)
    ;(section.navyItems ?? []).forEach(scan)
    ;(section.richProtocolTables ?? []).forEach((t) =>
      t.rows.forEach((r) => { scan(r.description ?? []); scan(r.portTokens ?? []) }),
    )
  })
  return found
}

// ─────────────────────────────────────────────
// 実行
// ─────────────────────────────────────────────
const onlyCategory = process.argv.includes('--category')
  ? process.argv[process.argv.indexOf('--category') + 1]
  : null

const files = fs.readdirSync(NOTES_DIR)
  .filter((f) => f.endsWith('.ts') && f !== 'index.ts' && f !== 'types.ts')
  .filter((f) => !onlyCategory || f === `${onlyCategory}.ts`)
  .sort()

let totalRed = 0
const violations = new Map(RULES.map((r) => [r.id, []]))
const adjacent = []
const perCategory = []

for (const file of files) {
  const categoryId = file.replace(/\.ts$/, '')
  const note = loadCategory(file)
  const reds = collectRedTokens(note, categoryId)
  totalRed += reds.length
  let catViolations = 0
  for (const red of reds) {
    for (const rule of RULES) {
      if (rule.test(red.text)) {
        violations.get(rule.id).push(red)
        catViolations++
      }
    }
  }
  const adj = findAdjacentReds(note, categoryId)
  adjacent.push(...adj)
  perCategory.push({ categoryId, red: reds.length, violations: catViolations, adjacent: adj.length })
}

console.log('赤字リント結果')
console.log('='.repeat(64))
console.log(`対象カテゴリ: ${files.length} / 赤字トークン合計: ${totalRed}`)
console.log('')

console.log('■ カテゴリ別')
console.log('カテゴリ           赤字   要確認   隣接赤字')
for (const c of perCategory.sort((a, b) => b.violations - a.violations)) {
  console.log(
    `${c.categoryId.padEnd(18)}${String(c.red).padStart(4)}${String(c.violations).padStart(8)}${String(c.adjacent).padStart(10)}`,
  )
}
console.log('')

for (const rule of RULES) {
  const list = violations.get(rule.id)
  console.log(`■ ${rule.id}（${list.length}件） — ${rule.desc}`)
  if (list.length === 0) { console.log('  なし'); console.log(''); continue }
  const bySample = new Map()
  for (const v of list) {
    const key = v.text
    if (!bySample.has(key)) bySample.set(key, [])
    bySample.get(key).push(v.categoryId)
  }
  for (const [text, cats] of [...bySample.entries()].sort((a, b) => b[1].length - a[1].length)) {
    const uniq = [...new Set(cats)]
    console.log(`  「${text}」 ${cats.length}件 (${uniq.slice(0, 4).join(', ')}${uniq.length > 4 ? '…' : ''})`)
  }
  console.log('')
}

console.log(`■ 隣接赤字（${adjacent.length}件） — 語が途中で割れている疑い（N2）`)
if (adjacent.length === 0) {
  console.log('  なし')
} else {
  for (const a of adjacent) console.log(`  ${a.categoryId}: 「${a.text}」 — ${a.section}`)
}
console.log('')

const totalViolations = RULES.reduce((n, r) => n + violations.get(r.id).length, 0) + adjacent.length
console.log('='.repeat(64))
console.log(`要確認 合計: ${totalViolations} 件 / 赤字 ${totalRed} 件`)
