// 作成者目線の表現を、フィールド全文つきで洗い出す（1件ずつ文脈判断するため）。
// 使い方: node author-voice.cjs [章ファイル名の一部]
const fs = require('fs')
const D = 'src/data/textbook/chapters'
const filter = process.argv[2] || ''
const strip = (s) => s.replace(/\[\[[a-z]+:([^\]]*)\]\]/g, '$1')
const MARK =
  /(この章では|この章で|本章|ここでは|扱います|扱う|見ていきます|見ていきましょう|追いかけます|読み解きます|一望します|整理します|理解します|紹介します|説明します|押さえれば十分|押さえて|押さえます|目標にします|ゴールは|確かめましょう|しましょう|ください|まずは|いよいよ|見ておきます|次の表で|下の図|上の図|下の表)/g

for (const f of fs.readdirSync(D).filter((x) => x.endsWith('.ts') && x.includes(filter))) {
  const s = fs.readFileSync(`${D}/${f}`, 'utf8')
  const hits = []
  for (const m of s.matchAll(/(summary|text|body|caption|takeaway|note|explanation|answer|detail):\s*\n?\s*'([^']*)'/g)) {
    const t = strip(m[2])
    const found = [...t.matchAll(MARK)].map((x) => x[1])
    if (found.length) hits.push({ field: m[1], marks: [...new Set(found)], t })
  }
  if (!hits.length) continue
  console.log(`\n════════ ${f}  （${hits.length}件）`)
  hits.forEach((h, i) => {
    console.log(`\n[${i + 1}] ${h.field} 〈${h.marks.join('・')}〉`)
    console.log(`    ${h.t}`)
  })
}
