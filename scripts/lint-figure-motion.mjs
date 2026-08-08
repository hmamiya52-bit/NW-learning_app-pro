// 教科書モード「動く図」の動きリント。
//
// 各ステップが「目に見えて何かを変えているか」を判定する。変化とみなすもの:
//   move（区間を進む＝focus が link）／遮断（blockedLink）／故障（downNodes）／判定（verdict）
//   ／稼働切替（pairActive）／表（tableRows）／吹出（bubbles）／ヘッダ（status の変わる・外す）
// どれも無いノードステップ＝「場所を光らせるだけ」で、図解仕様 §3.6 が差し戻し対象と定める
// 「場所紹介だけの構成図ツアー」になっている。
//
// ALLOW に載せた例外は「機器の中の処理そのものが要点」で、図の制約（吹き出しは図の上半分しか
// 置けない・全体図では verdict チップが葉と衝突する）から見た目を変えられないもの。2026-08-08 レビュー済み。
//
// 使い方: npm run lint:figures

import { createServer } from 'vite'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

// 例外: 「その機器の中で起きること」が要点で、図では色以上の変化を出せないステップ。
const ALLOW = {
  'ch10-cdn': { steps: [6], why: 'キャッシュヒット＝エッジの中の出来事が要点。往復しないことは前後の歩で見える' },
  'ch10-lb': { steps: [3], why: 'LBがVIPで受ける beat。LBは図の下半分（y=264）で吹き出しのアンカーが効かない' },
  'ch16-map': { steps: [3, 7], why: 'メールはいったん預かって送り直す（store and forward）こと自体が章の要点' },
  'ch20-journey': { steps: [7], why: 'LBの振り分け。LBは図の下半分（y=356）で吹き出しのアンカーが効かない' },
  'ch20-site-journey': { steps: [4], why: '境界ルータが丸ごと包む＝カプセル化が要点。境界ルータは y=196 で吹き出し不可' },
  'ch20-reading': { steps: [1, 3], why: '読み方の型を示す図で、通信を流す図ではない。全体図では verdict チップが中段の葉と衝突する' },
}

// 章データは TS なので、Vite の SSR ローダーでそのまま読み込む（ビルド生成物に依存しない）。
const server = await createServer({
  root: ROOT,
  configFile: false,
  logLevel: 'silent',
  appType: 'custom',
  server: { middlewareMode: true },
})
const { textbookChapters } = await server.ssrLoadModule('/src/data/textbook/index.ts')
await server.close()

const figures = []
for (const ch of textbookChapters) {
  const collect = (blocks) => {
    for (const b of blocks ?? []) if (b.kind === 'figure' && b.figure.kind === 'packet-flow') figures.push({ ch, fig: b.figure })
  }
  collect(ch.intro)
  for (const s of ch.sections ?? []) collect(s.blocks)
}

function classify(fig, step) {
  if (step.focus.type === 'link') return 'move'
  const marks = []
  if (step.blockedLink) marks.push('遮断')
  if (step.downNodes?.length) marks.push('故障')
  if (step.verdict) marks.push('判定')
  if (step.pairActive) marks.push('稼働切替')
  if (step.tableRows) marks.push('表')
  if (step.bubbles?.length) marks.push('吹出')
  if (!fig.hideHeaders && step.status && Object.values(step.status).some((v) => v === 'change' || v === 'strip')) marks.push('ヘッダ')
  return marks.length ? marks.join('+') : null
}

const findings = []
let totalSteps = 0
for (const { ch, fig } of figures) {
  fig.steps.forEach((step, i) => {
    totalSteps++
    if (classify(fig, step)) return
    const allowed = ALLOW[fig.id]?.steps.includes(i + 1)
    findings.push({ ch: ch.order, id: fig.id, step: i + 1, node: step.focus.id, ex: step.explanation, allowed })
  })
}

const news = findings.filter((f) => !f.allowed)

console.log('動く図の動きリント')
console.log('='.repeat(64))
console.log(`対象: ${figures.length}枚 / ${totalSteps}ステップ`)
console.log(`無変化ステップ: ${findings.length}件（うちレビュー済みの例外 ${findings.length - news.length}件）`)
console.log('')

if (news.length) {
  console.log('■ 要対応 — 場所を光らせるだけのステップ')
  for (const f of news) {
    console.log(`  第${f.ch}章 ${f.id} 第${f.step}歩 [${f.node}]`)
    console.log(`    ${f.ex}`)
  }
  console.log('')
  console.log('  対処: ①その歩を「線をたどる」歩に変える（focus を link に）')
  console.log('        ②verdict / blockedLink / bubbles / tableRows で状態変化を出す')
  console.log('        ③前後の歩に説明を寄せて、その歩を削る')
  console.log('        ④どれも当てはまらないなら ALLOW に理由付きで追加する')
} else {
  console.log('■ 要対応なし')
}

if (findings.length - news.length > 0) {
  console.log('')
  console.log('■ レビュー済みの例外')
  for (const [id, v] of Object.entries(ALLOW)) console.log(`  ${id} 第${v.steps.join('・')}歩 — ${v.why}`)
}

process.exit(news.length ? 1 : 0)
