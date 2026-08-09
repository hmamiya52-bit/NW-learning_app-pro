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

// tree（graph の既定レイアウト）は葉を数珠つなぎに描くため、幹—葉の focus は「その葉に接する区間」に出る。
// 2つ目以降の葉を focus すると、封筒の反対端は幹ではなく1つ前の葉になる。誤りとは限らないので警告にはせず、
// 「封筒が実際にどこへ進むか」を並べて、説明文と合っているかを人が確かめられるようにする。
const SPINE_ROLES = new Set(['switch', 'router', 'firewall', 'internet', 'cloud', 'lb', 'proxy', 'ap'])

function treeLeafHops(fig) {
  const topo = fig.topology
  if (topo.layout !== 'graph') return []
  if (topo.stack || topo.pair || topo.bundle || topo.tunnel || topo.tiers) return []
  // 同じ2ノード間に2本＝ループ配置
  const seen = new Set()
  for (const l of topo.links) {
    const key = [l.a, l.b].sort().join('|')
    if (seen.has(key)) return []
    seen.add(key)
  }
  const forcedLeaf = new Set(topo.leafIds ?? [])
  const isSpine = (n) => SPINE_ROLES.has(n.role) && !forcedLeaf.has(n.id)
  const byId = new Map(topo.nodes.map((n) => [n.id, n]))
  const leavesOf = (spineId) =>
    topo.nodes.filter((n) => !isSpine(n) && topo.links.some((l) => (l.a === spineId && l.b === n.id) || (l.b === spineId && l.a === n.id)))

  const hops = []
  fig.steps.forEach((step, i) => {
    if (step.focus.type !== 'link') return
    for (const [x, y] of [
      [step.focus.a, step.focus.b],
      [step.focus.b, step.focus.a],
    ]) {
      const sp = byId.get(x)
      const lf = byId.get(y)
      if (!sp || !lf || !isSpine(sp) || isSpine(lf)) continue
      const leaves = leavesOf(sp.id)
      const idx = leaves.findIndex((n) => n.id === lf.id)
      if (idx > 0) hops.push({ step: i + 1, leaf: lf.label, neighbor: leaves[idx - 1].label, spine: sp.label, ex: step.explanation })
    }
  })
  return hops
}

const findings = []
const hops = []
let totalSteps = 0
for (const { ch, fig } of figures) {
  fig.steps.forEach((step, i) => {
    totalSteps++
    if (classify(fig, step)) return
    const allowed = ALLOW[fig.id]?.steps.includes(i + 1)
    findings.push({ ch: ch.order, id: fig.id, step: i + 1, node: step.focus.id, ex: step.explanation, allowed })
  })
  for (const h of treeLeafHops(fig)) hops.push({ ch: ch.order, id: fig.id, ...h })
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

if (hops.length) {
  console.log('')
  console.log('■ 目視で確かめる歩 — tree の2つ目以降の葉（封筒は幹まで届かない）')
  for (const h of hops) {
    console.log(`  第${h.ch}章 ${h.id} 第${h.step}歩: 封筒は ${h.leaf} ↔ ${h.neighbor} を進みます（幹の${h.spine}には接しません）`)
    console.log(`    ${h.ex}`)
  }
  console.log('  説明文と着地が食い違うなら、葉の並び（nodes 配列の順）を入れ替える。')
}

process.exit(news.length ? 1 : 0)
