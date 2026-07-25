// 章の可視テキストを「読む順」に出す（音読点検用）。使い方: node read-ch.cjs ch01-osi.ts
const fs = require('fs')
const path = require('path')
const file = process.argv[2]
const src = fs.readFileSync(path.join('src/data/textbook/chapters', file), 'utf8')
const strip = (s) => s.replace(/\[\[[a-z]+:([^\]]*)\]\]/g, '$1')

// 図の定義を name -> {title,caption,takeaway,steps,cells}
const figs = {}
const figRe = /const (\w+): \w+Figure = \{([\s\S]*?)\n\}\n/g
let fm
while ((fm = figRe.exec(src))) {
  const b = fm[2]
  const g = (k) => {
    const x = b.match(new RegExp(k + ": '([^']*)'"))
    return x ? strip(x[1]) : null
  }
  figs[fm[1]] = {
    title: g('title'),
    caption: g('caption'),
    takeaway: g('takeaway'),
    steps: [...b.matchAll(/(?:explanation|note): '([^']*)'/g)].map((x) => strip(x[1])),
    cells: [...b.matchAll(/(?:label|detail): '([^']*)'/g)].map((x) => strip(x[1])),
  }
}

const chap = src.slice(src.indexOf('export const'))
const out = []
const one = (k) => {
  const x = chap.match(new RegExp('^  ' + k + ":\\s*\\n?\\s*'([^']*)'", 'm'))
  return x ? strip(x[1]) : null
}
out.push('■ ' + one('title'))
out.push('■ summary: ' + one('summary'))

// 出現順に走査（1つずつ個別に検索して位置順に並べる）
const hits = []
const push = (idx, txt) => hits.push({ idx, txt })
let r
r = /heading: '([^']*)'/g
let x
while ((x = r.exec(chap))) push(x.index, '\n【節】' + strip(x[1]))
r = /kind: 'text',\s*\n\s*text:\s*\n?\s*'([^']*)'/g
while ((x = r.exec(chap))) push(x.index, '  ' + strip(x[1]))
r = /title: '([^']*)',\s*\n\s*body: '([^']*)'/g
while ((x = r.exec(chap))) push(x.index, '  〔補足・' + strip(x[1]) + '〕' + strip(x[2]))
r = /figure: (\w+) \}/g
while ((x = r.exec(chap))) {
  const f = figs[x[1]]
  if (!f) continue
  const l = ['  《図》' + f.title]
  if (f.caption) l.push('     cap: ' + f.caption)
  f.steps.forEach((s, i) => l.push('     ' + (i + 1) + ') ' + s))
  if (f.cells.length) l.push('     項目: ' + f.cells.join(' ／ '))
  if (f.takeaway) l.push('     tw: ' + f.takeaway)
  push(x.index, l.join('\n'))
}
r = /question:\s*\n?\s*'([^']*)',\s*\n\s*answer:\s*\n?\s*'([^']*)'/g
while ((x = r.exec(chap))) push(x.index, '  ❓' + strip(x[1]) + '\n    →' + strip(x[2]))

hits.sort((a, b) => a.idx - b.idx)
out.push(...hits.map((h) => h.txt))

const tw = chap.match(/takeaways: \[([\s\S]*?)\n  \]/)
if (tw) {
  out.push('\n【持ち帰る考え方】')
  ;[...tw[1].matchAll(/'([^']*)'/g)].forEach((y) => out.push('  ・' + strip(y[1])))
}
console.log(out.join('\n'))
