// 教科書モード「動く図」の動きリント。
//
// 各ステップが「目に見えて何かを変えているか」を判定する。変化とみなすもの:
//   move（区間を進む＝focus が link）／遮断（blockedLink）／故障（downNodes）／判定（verdict）
//   ／稼働切替（pairActive）／表（tableRows）／吹出（bubbles）／ヘッダ（status の変わる・外す）
// どれも無いノードステップ＝「場所を光らせるだけ」で、図解仕様 §3.6 が差し戻し対象と定める
// 「場所紹介だけの構成図ツアー」になっている。
//
// ALLOW に載せた例外は「機器の中の処理そのものが要点」で、見た目を変えると嘘になるもの。
// かつてここには「吹き出しが図の上半分にしか置けない」制約で動かせない3歩も入っていたが、
// v2.26 で制約を外し v2.27 で実際に吹き出しを入れたため、残るのは中身の理由だけになった。
// 2026-08-23 見直し。
//
// あわせて graph 図の**吹き出し・判定チップが他の要素を覆っていないか**を、実際の描画結果
// （SSRで出したSVG）から検査する。以前は吹き出しの y を一律クランプして重なりを避けていたが、
// v2.26 で実際の障害物との当たり判定に変えたため、その結果を機械で確かめられるようにした。
//
// 使い方: npm run lint:figures

import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

// 例外: 「その機器の中で起きること」が要点で、図では色以上の変化を出せないステップ。
const ALLOW = {
  'ch10-cdn': { steps: [6], why: 'キャッシュヒット＝エッジの中の出来事が要点。往復しないことは前後の歩で見える' },
  'ch16-map': { steps: [3, 7], why: 'メールはいったん預かって送り直す（store and forward）こと自体が章の要点' },
  'ch20-reading': { steps: [1], why: '読み方①境界＝門番のFWを見つけること自体が主題。通信を流す図ではないので verdict チップは意味が合わない（チップは「FWがこのパケットを通した」の意）' },
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
const { default: GraphTopology } = await server.ssrLoadModule('/src/components/textbook/figures/GraphTopology.tsx')
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

// 吹き出し・判定チップが覆ってはいけない要素（描画結果の data-el で見分ける）。
const COVERABLE = new Set(['node', 'zone', 'vip', 'pair-chip', 'bundle'])
const RECT_RE = /<rect data-el="([^"]+)"[^>]*?x="([-\d.]+)" y="([-\d.]+)" width="([\d.]+)" height="([\d.]+)"/g

function rectsOf(fig, step, stepIndex) {
  const html = renderToStaticMarkup(
    React.createElement(GraphTopology, {
      topology: fig.topology,
      focus: step.focus,
      packetLabel: step.packetLabel ?? '',
      stepKey: stepIndex,
      blockedLink: step.blockedLink,
      verdict: step.verdict,
      bubbles: step.bubbles,
      downNodes: step.downNodes,
      pairActive: step.pairActive,
    }),
  )
  const vb = /viewBox="0 0 (\d+) ([\d.]+)"/.exec(html)
  const out = []
  for (const m of html.matchAll(RECT_RE)) {
    out.push({ el: m[1], x: +m[2], y: +m[3], w: +m[4], h: +m[5] })
  }
  return { rects: out, vw: vb ? +vb[1] : 320, vh: vb ? +vb[2] : 0 }
}

const overlap = (a, b) =>
  a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h

const overlaps = []
for (const { ch, fig } of figures) {
  if (fig.topology?.layout !== 'graph') continue
  fig.steps.forEach((step, i) => {
    const { rects, vw, vh } = rectsOf(fig, step, i)
    const movable = rects.filter((r) => r.el === 'bubble' || r.el === 'verdict')
    const fixed = rects.filter((r) => COVERABLE.has(r.el))
    for (const m of movable) {
      for (const f of fixed) {
        if (overlap(m, f)) overlaps.push({ ch: ch.order, id: fig.id, step: i + 1, kind: m.el, over: f.el, m, f })
      }
      if (m.x < 0 || m.y < 0 || m.x + m.w > vw || m.y + m.h > vh) {
        overlaps.push({ ch: ch.order, id: fig.id, step: i + 1, kind: m.el, over: 'viewBox外', m, f: { x: 0, y: 0, w: vw, h: vh } })
      }
    }
  })
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

if (overlaps.length) {
  console.log('')
  console.log('■ 要対応 — 吹き出し／判定チップが他の要素を覆っている')
  for (const o of overlaps) {
    console.log(`  第${o.ch}章 ${o.id} 第${o.step}歩: ${o.kind} が ${o.over} に重なる`)
    console.log(`    ${o.kind} x${o.m.x} y${o.m.y} ${o.m.w}×${o.m.h} / ${o.over} x${o.f.x} y${o.f.y} ${o.f.w}×${o.f.h}`)
  }
  console.log('  対処: 覆ってはいけない要素なら graphBubbleLayout.ts の obstaclesOf に足す。')
  console.log('        置き場所が無い図なら、その歩は吹き出し／チップを使わない設計にする。')
} else {
  console.log('')
  console.log(`■ 吹き出し・判定チップの重なり0（graph図を全歩レンダリングして確認）`)
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

process.exit(news.length || overlaps.length ? 1 : 0)
