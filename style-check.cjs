// 教科書の文体チェック（全フィールド・全文を対象）。使い方: node style-check.cjs
const fs = require('fs')
const D = 'src/data/textbook/chapters'
const strip = (s) => s.replace(/\[\[[a-z]+:([^\]]*)\]\]/g, '$1')

// 常体（動詞終止形＋。）。です/ます・体言止め・名詞末尾は除外。
const verbEnd = /(?:[ぁ-んァ-ヶ一-龥])(?:う|く|ぐ|す|ず|つ|ぬ|ふ|ぶ|む|る)。$/
const okTail = /(?:ます|ません|ましょう|ください|です|でしょう|ですか|ますか|ますが)。$/
const nounExempt =
  /(区別|工夫|判断|注目|活用|運用|利用|信頼|保証|共有|通過|遮断|変換|暗号|接続|認証|認可|冗長|優先|監視|設定|構成|一員|以上|以外|同士|両方|全部|意味|理由|目的|方法|手間|事故|方式|形式|番号|住所|経路|通信|状態|区画|範囲|順番|部品|仕組み|働き|出口|入口|中身|外側|内側|地図|関係|時間|負担|記録|応答|要求|問題|対策|条件|単位|素地|土台|前提|基本|一つ|1つ)。$/
// 助詞で終わる文（電文調）。「こと。」「もの。」等の名詞止めは正当なので除外。
const particleEnd = /[にへでをがはとやも]。$/
const nounTail = /(こと|もの|ため|はず|わけ|ところ|とき|もと|ほど|かたち|うち|まま|つもり|ばかり|とおり)。$/
// 括弧の中に句点
const parenPeriod = /（[^）]*。[^）]*）/

const found = { 常体: [], 助詞止め: [], 括弧内句点: [] }
for (const f of fs.readdirSync(D).filter((x) => x.endsWith('.ts'))) {
  const s = fs.readFileSync(`${D}/${f}`, 'utf8')
  for (const m of s.matchAll(
    /(explanation|note|caption|takeaway|text|body|answer|question|label|detail|summary): '([^']*)'/g,
  )) {
    const field = m[1]
    const t = strip(m[2])
    if (parenPeriod.test(t)) found.括弧内句点.push([f, field, (t.match(parenPeriod) || [''])[0]])
    // 文単位（句点を残して分割）
    for (const raw of t.split(/(?<=。)/)) {
      const x = raw.trim()
      if (!x || !x.endsWith('。')) continue
      if (particleEnd.test(x) && !nounTail.test(x)) found.助詞止め.push([f, field, x.slice(-26)])
      if (okTail.test(x) || nounExempt.test(x)) continue
      if (verbEnd.test(x)) found.常体.push([f, field, x.slice(-26)])
    }
  }
}
// 常体はルール違反（0件が必須）。助詞止め・括弧内句点は目視で判断する参考情報
// （「〜へ。まず境界のFWを通ります。」のように述語が自明で次文が続く形は正当）。
for (const [k, list] of Object.entries(found)) {
  const tag = k === '常体' ? '【違反】' : '【要目視】'
  console.log(`\n■ ${tag} ${k}: ${list.length}件`)
  for (const [f, field, x] of list) console.log(`  ${f} (${field})  …${x}`)
}
process.exit(found.常体.length ? 1 : 0)
