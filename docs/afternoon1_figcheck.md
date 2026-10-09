# 試験図の崩れ検査（§5.4 の実測コード）

`docs/afternoon1_authoring_rules.md` §5.4 の検査を、Browser pane の `javascript_tool` で回すためのコード。
H25-G1-1〜H25-G1-2 で使ったものをそのまま残してある。**毎回書き直さず、ここから貼る。**

## 使い方

1. dev サーバを開き、`localStorage['nwsp:auth']` に開発用のセッションを置く（§10。パスワードは入れない）。
2. 測るページを開く。
   - 詳細解説ページ `/afternoon1/<id>/explanation` … 図の「解説」ボタンが最初から出る。
   - 解答欄 `/afternoon1/<id>/answer` … **「答え合わせ」を押し、確認ダイアログの「はい」を押して
     checkMode に入れないと「解説」ボタンが出ない**（閉じた状態しか測れない）。下の「解答欄で測る」を使う。
3. 下の「定義」を `javascript_tool` に貼る。関数を `window` に置き、`localStorage['__figcheck_src']` にも退避する。
4. 「実行」を貼る。ページ内の全部の図について、解説を閉じた状態と開いた状態を測って返す。
5. `resize_window` で幅を変えたら（375 と 1024x800）、同じページで「実行」だけを貼り直す。
   リロードやページ移動の後は、実行の先頭の1行が `localStorage` から関数を戻す。
   **ただし 1024px から 375px に戻したときは、ページを読み込み直してから測る**（H28-G1-2）。
   読み込み直さないと、アプリが左のサイドバー（幅 56px）を出したままになり、図が本来より狭く（273px のところ 217px）なって、
   実際の 375px では出ない「詰まり気味」が報告される。`getComputedStyle(document.querySelector('main')).marginLeft` が
   `0px` なら正しい状態。解答欄は読み込み直すと checkMode が抜けるので、下の「解答欄で測る」をもう一度貼る。

Browser pane を開き直すと `localStorage` も消える。そのときは「定義」から貼り直す。

## 結果の読み方

`closed` と `open` は6つの数の並び。**6つとも 0 になるまで直す。**

| 位置 | 中身 | §5.4 |
|---|---|---|
| 0 | viewBox からはみ出した文字 | 1 |
| 1 | 親の箱（同じ `<g>` の rect）との余白が 1px 未満の文字。楕円の外に出た文字もここ | 2 |
| 2 | 文字どうしの重なり | 3 |
| 3 | あとから描いた不透明な図形（rect・ellipse・circle・polygon）が、先に描いた文字を覆っている | 4 |
| 4 | 強調の経路（`Route`）が、ノードの箱・楕円の中にも既存の線から 2.5px 以内にも無い点 | 5 |
| 5 | 余白が 1〜1.5px の文字（詰まり気味。これも 0 にしてきた） | 2 |

`routes` は検査5 の対象にした経路の本数。`answer` は解答の描き込み（`data-role="answer"`）の線の両端が
箱の中にあるか（`ok: false` があれば直す）。数が 0 でないときは `d` に中身（文字・余白・座標）が出る。

検査5 から外しているもの:
- `data-role` の付いた要素（`RangeBar` の `range`、描き込みの `answer`）
- 吹き出しの引出し線。**同じ `<g>` に `rx="3"` の rect と text がある polyline だけ**を引出し線とみなす
  （凡例の角丸に反応して、本物の経路まで外してしまわないように）

楕円（インターネット・IP-VPN など）の内側はノードとして扱う。

囲みの名前も、枠の rect と名前の text を1つの `<g>` に入れた部品（`CornerFrame` など）なら検査2 で余白を測られる。
R4-G1-1 で、下の隅に置いた名前（工場・事務所・各セグメント・DMZ の6つ）が、ベースラインを下辺の 4.5 上にしたら 375px で
すべて「詰まり気味」（余白 1.36〜1.46）に出た。下辺の 6 上にすると、375px・1024px とも 0 件になった。

## 定義

```js
window.__figcheck = function (svg) {
  const MARK = '#dc2626';
  const out = { overflowVB: [], overflowBox: [], tight: [], textOverlap: [], coverText: [], routeOff: [], answerEnds: [] };
  const vb = svg.viewBox.baseVal;
  // 回転した文字もあるので、画面上の bbox を viewBox の座標に戻して比べる
  const inv = svg.getScreenCTM().inverse();
  const toUser = (r) => { const p1 = new DOMPoint(r.left, r.top).matrixTransform(inv); const p2 = new DOMPoint(r.right, r.bottom).matrixTransform(inv); return { x1: Math.min(p1.x, p2.x), y1: Math.min(p1.y, p2.y), x2: Math.max(p1.x, p2.x), y2: Math.max(p1.y, p2.y) }; };
  const all = [...svg.querySelectorAll('*')].filter(e => !e.closest('defs'));
  const order = new Map(all.map((e, i) => [e, i]));
  const tb = all.filter(e => e.tagName === 'text').map(t => ({ el: t, s: t.textContent, r: toUser(t.getBoundingClientRect()) }));
  // 1. viewBox からのはみ出し
  for (const t of tb) if (t.r.x1 < vb.x || t.r.y1 < vb.y || t.r.x2 > vb.x + vb.width || t.r.y2 > vb.y + vb.height) out.overflowVB.push({ s: t.s, r: t.r });
  // 2. 親の箱（同じ <g> の rect・ellipse）からのはみ出しと余白
  for (const t of tb) {
    const g = t.el.parentElement; const cx = (t.r.x1 + t.r.x2) / 2, cy = (t.r.y1 + t.r.y2) / 2;
    const rects = [...g.children].filter(c => c.tagName === 'rect');
    const ells = [...g.children].filter(c => c.tagName === 'ellipse');
    if (t.el.closest('[data-role="answer"]') && rects.length === 0) {
      // 描き込みの文字（分割線で半分に割ったマスの中）は、線で切った半分のマスを親として測る
      const line = g.querySelector('line');
      const cand = [...svg.querySelectorAll('rect')].filter(r => !r.closest('[data-role]')).map(r => ({ u: toUser(r.getBoundingClientRect()) })).filter(o => cx > o.u.x1 && cx < o.u.x2 && cy > o.u.y1 && cy < o.u.y2);
      if (cand.length && line) { const cell = cand[cand.length - 1].u; const lx = +line.getAttribute('x1'); const half = cx < lx ? { x1: cell.x1, x2: lx, y1: cell.y1, y2: cell.y2 } : { x1: lx, x2: cell.x2, y1: cell.y1, y2: cell.y2 }; const m = Math.min(t.r.x1 - half.x1 - 0.55, t.r.y1 - half.y1 - 0.55, half.x2 - t.r.x2 - 0.7, half.y2 - t.r.y2 - 0.55); (m < 1 ? out.overflowBox : m < 1.5 ? out.tight : []).push({ s: t.s + ' (answer half)', margin: +m.toFixed(2) }); }
      continue;
    }
    for (const rect of rects) { const rr = toUser(rect.getBoundingClientRect()); if (!(cx > rr.x1 && cx < rr.x2 && cy > rr.y1 && cy < rr.y2)) continue; const sw = parseFloat(rect.getAttribute('stroke-width') || '0') / 2; const m = Math.min(t.r.x1 - rr.x1 - sw, t.r.y1 - rr.y1 - sw, rr.x2 - sw - t.r.x2, rr.y2 - sw - t.r.y2); if (m < 1) out.overflowBox.push({ s: t.s, margin: +m.toFixed(2) }); else if (m < 1.5) out.tight.push({ s: t.s, margin: +m.toFixed(2) }); }
    for (const el of ells) { const ecx = +el.getAttribute('cx'), ecy = +el.getAttribute('cy'), erx = +el.getAttribute('rx'), ery = +el.getAttribute('ry'); const corners = [[t.r.x1, t.r.y1], [t.r.x2, t.r.y1], [t.r.x1, t.r.y2], [t.r.x2, t.r.y2]]; const worst = Math.max(...corners.map(([px, py]) => ((px - ecx) / erx) ** 2 + ((py - ecy) / ery) ** 2)); if (worst > 1) out.overflowBox.push({ s: t.s + ' (ellipse)', worst: +worst.toFixed(2) }); }
  }
  // 3. 文字どうしの重なり（総当たり）
  for (let i = 0; i < tb.length; i++) for (let j = i + 1; j < tb.length; j++) { const a = tb[i].r, b = tb[j].r; const ox = Math.min(a.x2, b.x2) - Math.max(a.x1, b.x1), oy = Math.min(a.y2, b.y2) - Math.max(a.y1, b.y1); if (ox > 0 && oy > 0) out.textOverlap.push({ a: tb[i].s, b: tb[j].s, ox: +ox.toFixed(2), oy: +oy.toFixed(2) }); }
  // 4. あとから描いた不透明な図形が、先に描いた文字を覆っていないか（ツリー順で比べる）
  const shapes = all.filter(e => ['rect', 'ellipse', 'circle', 'polygon'].includes(e.tagName)).filter(e => { const f = e.getAttribute('fill'); return f && f !== 'none' && f !== 'transparent'; });
  for (const sh of shapes) { const sr = toUser(sh.getBoundingClientRect()); for (const t of tb) { if (order.get(t.el) >= order.get(sh)) continue; const ox = Math.min(sr.x2, t.r.x2) - Math.max(sr.x1, t.r.x1), oy = Math.min(sr.y2, t.r.y2) - Math.max(sr.y1, t.r.y1); if (ox > 0 && oy > 0) out.coverText.push({ shape: sh.tagName + ' ' + sh.getAttribute('fill'), text: t.s, ox: +ox.toFixed(2), oy: +oy.toFixed(2) }); } }
  // 5. 強調の経路が、既存の線（2.5px 以内）かノードの箱・楕円の上を通っているか（4px 刻みで標本化）
  const segs = [];
  for (const l of all.filter(e => (e.tagName === 'line' || e.tagName === 'polyline') && e.getAttribute('stroke') !== MARK && !e.closest('[data-role]'))) { if (l.tagName === 'line') segs.push([+l.getAttribute('x1'), +l.getAttribute('y1'), +l.getAttribute('x2'), +l.getAttribute('y2')]); else { const pts = l.getAttribute('points').trim().split(/\s+/).map(p => p.split(',').map(Number)); for (let i = 0; i + 1 < pts.length; i++) segs.push([...pts[i], ...pts[i + 1]]); } }
  const nodeRects = all.filter(e => e.tagName === 'rect' && e.getAttribute('stroke') !== MARK && e.getAttribute('fill') !== 'none' && !e.closest('[data-role]')).map(r => ({ x: +r.getAttribute('x'), y: +r.getAttribute('y'), w: +r.getAttribute('width'), h: +r.getAttribute('height') }));
  const nodeElls = all.filter(e => e.tagName === 'ellipse' && e.getAttribute('stroke') !== MARK).map(e => ({ cx: +e.getAttribute('cx'), cy: +e.getAttribute('cy'), rx: +e.getAttribute('rx'), ry: +e.getAttribute('ry') }));
  const dist = (px, py, [x1, y1, x2, y2]) => { const dx = x2 - x1, dy = y2 - y1, L = dx * dx + dy * dy; let t = L ? ((px - x1) * dx + (py - y1) * dy) / L : 0; t = Math.max(0, Math.min(1, t)); return Math.hypot(px - x1 - t * dx, py - y1 - t * dy); };
  const isLeader = (e) => { const sib = [...e.parentElement.children]; return sib.some(c => c.tagName === 'rect' && c.getAttribute('rx') === '3') && sib.some(c => c.tagName === 'text'); };
  const routes = all.filter(e => e.tagName === 'polyline' && e.getAttribute('stroke') === MARK && !e.closest('[data-role]') && !isLeader(e));
  for (const rt of routes) { const pts = rt.getAttribute('points').trim().split(/\s+/).map(p => p.split(',').map(Number)); for (let i = 0; i + 1 < pts.length; i++) { const [x1, y1] = pts[i], [x2, y2] = pts[i + 1]; const n = Math.max(1, Math.ceil(Math.hypot(x2 - x1, y2 - y1) / 4)); for (let k = 0; k <= n; k++) { const px = x1 + (x2 - x1) * k / n, py = y1 + (y2 - y1) * k / n; const inNode = nodeRects.some(r => px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h) || nodeElls.some(e => ((px - e.cx) / e.rx) ** 2 + ((py - e.cy) / e.ry) ** 2 <= 1); if (!inNode && !segs.some(s => dist(px, py, s) <= 2.5)) out.routeOff.push([+px.toFixed(1), +py.toFixed(1)]); } } }
  // 描き込み（data-role="answer"）の線は、両端が既存の箱か描き込みの箱の中にあるか
  const ansRects = [...svg.querySelectorAll('[data-role="answer"] rect')].map(r => ({ x: +r.getAttribute('x'), y: +r.getAttribute('y'), w: +r.getAttribute('width'), h: +r.getAttribute('height') }));
  for (const l of svg.querySelectorAll('[data-role="answer"] line')) { const ends = [[+l.getAttribute('x1'), +l.getAttribute('y1')], [+l.getAttribute('x2'), +l.getAttribute('y2')]]; out.answerEnds.push({ ends: JSON.stringify(ends), ok: ends.every(([px, py]) => [...nodeRects, ...ansRects].some(r => px >= r.x - 0.01 && px <= r.x + r.w + 0.01 && py >= r.y - 0.01 && py <= r.y + r.h + 0.01)) }); }
  out.counts = { texts: tb.length, routes: routes.length };
  return out;
};
window.__summ = (o) => ({ vb: o.overflowVB.length, box: o.overflowBox.length, overlap: o.textOverlap.length, cover: o.coverText.length, routeOff: o.routeOff.length, tight: o.tight.length, answerBad: o.answerEnds.filter(a => !a.ok).length, answerLines: o.answerEnds.length, texts: o.counts.texts, routes: o.counts.routes });
// ページ内の全部の図を、解説を閉じた状態と開いた状態で測る
window.__runAll = async function () {
  const tick = () => new Promise(r => { const c = new MessageChannel(); c.port1.onmessage = () => r(); c.port2.postMessage(0) });
  const y = async (n) => { for (let i = 0; i < n; i++) await tick(); };
  document.querySelectorAll('details').forEach(d => { if (d.querySelector('svg[role=img]')) d.open = true });
  await y(10);
  const res = [];
  for (const f of [...document.querySelectorAll('figure')].filter(f => f.querySelector('svg[role=img]'))) {
    const svg = () => f.querySelector('svg[role=img]');
    const btn = [...f.querySelectorAll('button')].find(b => /解説/.test(b.textContent));
    if (btn && btn.textContent.includes('閉じる')) { btn.click(); await y(6); }
    const closed = window.__figcheck(svg()); let open = null;
    if (btn) { btn.click(); await y(6); open = window.__figcheck(svg()); btn.click(); await y(6); }
    res.push({ fig: svg().getAttribute('aria-label').slice(0, 3), w: Math.round(svg().getBoundingClientRect().width), closed: window.__summ(closed), open: open && window.__summ(open), detail: { closedBox: closed.overflowBox, closedTight: closed.tight, closedOverlap: closed.textOverlap, closedCover: closed.coverText, openBox: open?.overflowBox, openTight: open?.tight, openOverlap: open?.textOverlap, openCover: open?.coverText, openVB: open?.overflowVB, closedVB: closed.overflowVB, openRouteOff: open?.routeOff.slice(0, 8), answer: open?.answerEnds } });
  }
  return res;
};
localStorage.setItem('__figcheck_src', 'window.__figcheck = ' + window.__figcheck.toString() + ';\nwindow.__summ = ' + window.__summ.toString() + ';\nwindow.__runAll = ' + window.__runAll.toString() + ';');
'ok'
```

## 実行

```js
(async () => {
  if (!window.__runAll) (0, eval)(localStorage.getItem('__figcheck_src'));
  const r = await window.__runAll();
  const v = (o) => o && [o.vb, o.box, o.overlap, o.cover, o.routeOff, o.tight];
  const bad = (o) => o && (o.vb + o.box + o.overlap + o.cover + o.routeOff + o.tight + o.answerBad);
  return { vw: innerWidth, scrollW: document.documentElement.scrollWidth, res: r.map(x => ({ fig: x.fig, w: x.w, closed: v(x.closed), open: v(x.open), routes: x.open?.routes, d: (bad(x.closed) || bad(x.open)) ? x.detail : undefined })) };
})()
```

`w` は図の実際の幅。解答欄の 375px で 273、詳細解説ページの 375px で 283、1024px ではどちらも 408 になる。
`scrollW` が `vw` を超えていたら、ページに横スクロールが出ている。

## 解答欄で測る

「答え合わせ」→「はい」を押してから測る。

```js
(async () => {
  const w = (ms) => new Promise(r => setTimeout(r, ms));
  [...document.querySelectorAll('button')].find(b => b.textContent.trim() === '答え合わせ')?.click();
  await w(300);
  [...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'はい')?.click();
  await w(500);
  return document.body.innerText.includes('答え合わせ中');
})()
```

`true` が返ったら「実行」を貼る。幅を変えても checkMode はそのまま残る（リロードすると戻る）。

## HTML の図表（表・ゾーンファイル）の横のはみ出し

R1-G1-2 で追加。上の検査は SVG の図だけを見る。HTML で組んだ表や設定ファイルの図は、入れ物の `scrollWidth` が
`clientWidth` を超えていないか（横スクロールが出ていないか）を、解説を閉じた状態と開いた状態の両方で測る
（解説を開くと空欄の下に解答例が出て、列が広がることがある。H28-G1-1 表1）。

```js
(async () => {
  const w = (ms) => new Promise((r) => setTimeout(r, ms));
  // マスの中の行数の最大（3 以上なら、語の途中で割れていないかを見る）
  const lines = (t) => Math.max(0, ...[...t.querySelectorAll('th,td')].map((c) => { const rg = document.createRange(); rg.selectNodeContents(c); return new Set([...rg.getClientRects()].map((x) => Math.round(x.top))).size; }));
  const res = [];
  for (const f of document.querySelectorAll('figure')) {
    if (f.querySelector('svg[role=img]')) continue;
    // 幅で出し分ける表（hidden sm:table と sm:hidden の2つ）は、見えている方だけを測る
    const tbl = [...f.querySelectorAll('table')].find((t) => t.offsetParent !== null);
    const box = tbl?.parentElement || f.querySelector('.font-mono')?.parentElement;
    if (!box) continue;
    const btn = [...f.querySelectorAll('button')].find((b) => /解説/.test(b.textContent));
    const m = () => ({ sw: box.scrollWidth, cw: box.clientWidth, maxLines: tbl ? lines(tbl) : undefined });
    const closed = m(); let open = null;
    if (btn) { btn.click(); await w(150); open = m(); btn.click(); await w(150); }
    res.push({ head: box.textContent.slice(0, 12), closed, open });
  }
  return res;
})()
```

`sw` と `cw` が同じなら収まっている。`maxLines` はマスの中の行数の最大で、3 以上なら、そのマスが語の途中で割れていないかを
画面で見る（長い文の列は3行以上に折れてよい）。
**空欄の箱（`inline-block` の太枠）があるマスは、1行でも `maxLines` が2と出る**（H29-G1-1 表1 の カ・ク・ケ。箱の外枠と中の字で `getClientRects` の
top が違うため）。解説を開いて解答例を箱の下に出すと3になる。空欄のある表は、行数の数字ではなく、どのマスが何行かを出して画面と見比べる。
R4-G1-3 で、幅によって表を出し分ける図（図4・図5。640px 未満は欄を縦に並べた表）が入った。2つの表のうち隠れた方を
`f.querySelector('table')` で拾うと、幅 0 どうしの比較になって素通りするので、見えている表（`offsetParent` が null でない表）だけを測るようにした。
詳細解説ページの比較表（図解で整理）も、試験図と同じ `Afternoon1FigureView` が描くので `figure` の中にある（R5-G1-1 で確かめた。
以前ここに「figure の中に無い」と書いていたのは誤り）。上のスニペットを詳細解説ページで貼れば、表1 などと一緒に比較表の `maxLines` も出る
（比較表は §5.7 のとおり、各マス2行以内にしてきた）。

検査2 の余白は、枠の線の太さの半分を内側から引いて測る。R5-G1-1 図3 の太枠（線の太さ 2）の空欄 d は、高さ 15 だと size 7.5 の1字との余白が 0.14 で、
高さ 18 にして通った（線の太さ 1.2 の普通の箱なら、1行は高さ 18 で足りる）。

検査2 は、文字と同じ `<g>` の rect・ellipse を親の箱として測る。R5-G1-3 で、区間の点線の楕円（(i)〜(v)）を `<svg>` の直下に置いたら、
図の直下に置いた文字（区間の記号・凡例）が全部その楕円で測られて、86 件の誤検出になった。楕円は `<g>` に包む。傾けた楕円（`transform="rotate(...)"`）は
検査2 が傾きを考えずに測るので、文字を楕円の中に収めたいときは置く前に計算で確かめる（`docs/afternoon1_authoring_rules.md` §5.3）。

## 図を拡大して見る（線と文字のすき間を目で確かめる）

R5-G1-3 で追加。Browser pane の `computer` の `zoom` は使えない（全体のスクリーンショットが返る）。細部を見たいときは、図の SVG を複製して
画面の左上に 1000px の幅で重ねてから `screenshot` を撮る。下の方を見るときは `top` を負の値にずらす。見終えたら消す（リロードでも消える）。

```js
(() => {
  const svg = [...document.querySelectorAll('figure svg[role=img]')][0];   // 何枚目の図か
  const c = svg.cloneNode(true);
  // 模様（網掛け）と矢頭の id を付け替える。付け替えないと、複製が元の図の模様を参照し、
  // 元の図が閉じた details の中にあると模様が描かれない（H29-G1-3 で網掛けが写らなかった）
  c.querySelectorAll('[id]').forEach((el) => {
    const old = el.id; el.id = old + '-z';
    c.querySelectorAll('*').forEach((n) => { for (const a of ['fill', 'marker-start', 'marker-end']) if (n.getAttribute(a) === `url(#${old})`) n.setAttribute(a, `url(#${old}-z)`); });
  });
  c.setAttribute('style', 'position:fixed;left:0;top:0;width:1000px;height:auto;max-width:none;background:#fff;z-index:99999');
  c.id = '__zoomfig';
  document.body.appendChild(c);
  return 'ok';
})()
// 下の方を見る: document.getElementById('__zoomfig').style.top = '-450px'
// 消す:         document.getElementById('__zoomfig').remove()
```

解説を開いた状態を見るときは、先に図の「解説」ボタンを押してから複製する（複製は押した時点の絵になる）。スクリーンショットは
「page did not finish rendering」で失敗することがあるが、同じ呼び出しをもう一度送れば撮れる。

解説を開いた状態と閉じた状態を何枚も見比べるときは、ボタンを押してから複製するまでを1つの関数にしておくと早い（H30-G1-1 で使った）。

```js
window.__zoom = async (idx, open, top) => {
  const w = (ms) => new Promise((r) => setTimeout(r, ms));
  document.getElementById('__zoomfig')?.remove();
  const f = [...document.querySelectorAll('figure')].filter((f) => f.querySelector('svg[role=img]'))[idx];
  const btn = [...f.querySelectorAll('button')].find((b) => /解説/.test(b.textContent));
  const isOpen = btn && btn.textContent.includes('閉じる');
  if (btn && open !== isOpen) { btn.click(); await w(400); }
  const c = f.querySelector('svg[role=img]').cloneNode(true);
  c.querySelectorAll('[id]').forEach((el) => {
    const old = el.id; el.id = old + '-z';
    c.querySelectorAll('*').forEach((n) => { for (const a of ['fill', 'marker-start', 'marker-end']) if (n.getAttribute(a) === `url(#${old})`) n.setAttribute(a, `url(#${old}-z)`); });
  });
  c.setAttribute('style', `position:fixed;left:0;top:${top}px;width:1000px;height:auto;max-width:none;background:#fff;z-index:99999`);
  c.id = '__zoomfig';
  document.body.appendChild(c);
  return 'ok';
};
// 使い方: await window.__zoom(0, true, 0)   … 1枚目の図を、解説を開いた状態で写す（3つ目は top）
```

1000px の幅の複製は、375px の画面では左の端しか写らない。幅を 1024x800 にしてから撮り、測り直すときは 375px に戻して読み込み直す（上の「使い方」の 5）。

## 札と線・箱のすき間を測る（線の脇に札が多い図で）

H30-G1-2 で追加。上の検査は、文字と線のすき間を測らない（文字と箱の余白・文字どうし・覆いだけ）。ポート名や VLAN の札を線の脇に置く図では、
置く前の計算（文字の箱をフォントの大きさから見積もる）より実際の文字の箱が広く、線から 0.35 しか離れていない札があった。箱の中の文字と「⋯」を除く全部の
`<text>` について、`line`・`polyline` の線分と、塗りのある `rect` との間合いを測り、1.5 未満を返す。白の縁取りで線の上に重ねた札（`halo: true`）は、
その線と 0 になるのが正しいので、結果から外して読む。

```js
window.__textline = function (svg) {
  const MARK = '#dc2626';
  const inv = svg.getScreenCTM().inverse();
  const toUser = (r) => { const p1 = new DOMPoint(r.left, r.top).matrixTransform(inv); const p2 = new DOMPoint(r.right, r.bottom).matrixTransform(inv); return { x1: Math.min(p1.x, p2.x), y1: Math.min(p1.y, p2.y), x2: Math.max(p1.x, p2.x), y2: Math.max(p1.y, p2.y) }; };
  const all = [...svg.querySelectorAll('*')].filter(e => !e.closest('defs'));
  const texts = all.filter(e => e.tagName === 'text' && ![...e.parentElement.children].some(c => (c.tagName === 'rect' || c.tagName === 'ellipse') && c !== e) && e.textContent.trim() !== '⋯').map(t => ({ s: t.textContent, halo: t.getAttribute('stroke') === '#ffffff', r: toUser(t.getBoundingClientRect()) }));
  const segs = [];
  for (const l of all.filter(e => (e.tagName === 'line' || e.tagName === 'polyline') && e.getAttribute('stroke') !== MARK && !e.closest('[data-role]'))) {
    if (l.tagName === 'line') segs.push([+l.getAttribute('x1'), +l.getAttribute('y1'), +l.getAttribute('x2'), +l.getAttribute('y2')]);
    else { const pts = l.getAttribute('points').trim().split(/\s+/).map(p => p.split(',').map(Number)); for (let i = 0; i + 1 < pts.length; i++) segs.push([...pts[i], ...pts[i + 1]]); }
  }
  const boxes = all.filter(e => e.tagName === 'rect' && e.getAttribute('fill') && e.getAttribute('fill') !== 'none' && e.getAttribute('stroke') !== MARK && !e.closest('[data-role]')).map(r => toUser(r.getBoundingClientRect()));
  const dPtSeg = (px, py, [x1, y1, x2, y2]) => { const dx = x2 - x1, dy = y2 - y1, L = dx * dx + dy * dy; let t = L ? ((px - x1) * dx + (py - y1) * dy) / L : 0; t = Math.max(0, Math.min(1, t)); return Math.hypot(px - x1 - t * dx, py - y1 - t * dy); };
  const segHitsRect = ([x1, y1, x2, y2], r) => { const n = Math.max(2, Math.ceil(Math.hypot(x2 - x1, y2 - y1) / 0.5)); for (let k = 0; k <= n; k++) { const px = x1 + (x2 - x1) * k / n, py = y1 + (y2 - y1) * k / n; if (px >= r.x1 && px <= r.x2 && py >= r.y1 && py <= r.y2) return true; } return false; };
  const dSegRect = (s, r) => { if (segHitsRect(s, r)) return 0; const corners = [[r.x1, r.y1], [r.x2, r.y1], [r.x1, r.y2], [r.x2, r.y2]]; const ds = corners.map(([px, py]) => dPtSeg(px, py, s)); const [x1, y1, x2, y2] = s; const dr = (px, py) => Math.hypot(Math.max(r.x1 - px, 0, px - r.x2), Math.max(r.y1 - py, 0, py - r.y2)); return Math.min(...ds, dr(x1, y1), dr(x2, y2)); };
  const near = [];
  for (const t of texts) {
    for (const s of segs) { const d = dSegRect(s, t.r); if (d < 1.5) near.push({ text: t.s, halo: t.halo, seg: s.map(v => +v.toFixed(1)).join(','), d: +d.toFixed(2) }); }
    for (const b of boxes) { const gx = Math.max(b.x1 - t.r.x2, t.r.x1 - b.x2), gy = Math.max(b.y1 - t.r.y2, t.r.y1 - b.y2); const g = Math.max(gx, gy); if (g < 1.5) near.push({ text: t.s, box: [b.x1, b.y1, b.x2, b.y2].map(v => +v.toFixed(1)).join(','), gap: +g.toFixed(2) }); }
  }
  return near;
};
localStorage.setItem('__textline_src', 'window.__textline = ' + window.__textline.toString() + ';');
'ok'
```

実行は「実行」のあとに、`[...document.querySelectorAll('figure svg[role=img]')].map(s => window.__textline(s).filter(n => !n.halo))` を貼る。
H30-G1-2 では、375px で7件（VLAN100 の札と線が 0.35、p4・p2 の札と線が 1.28〜1.5、p4 の札と箱が 1.0）、直したあと 1024px で1件（p4 の札と線が 1.33。375px では
通っていた）が出た。上の6つの数と同じく、**375px と 1024px の両方で 0 件**にする。塗りのある `rect` には、白で塗った囲み（重ねた拠点の手前の枠など）も入る。
その囲みの中に置いた札は、中にあるだけで拾われる（`gap` が負になる）ので、その行は読み飛ばす。

## 文字の幅を測る（吹き出し・箱の幅を決める前に）

H28-G1-3 で追加。吹き出しや箱に入れる文言の候補を並べ、図と同じ大きさ・太さで実際の幅（viewBox の単位）を測る。
`estimateWidth` の見積もりは英字・数字・全角の括弧で外れる（「MGW2 だけ（正常時）」は見積もり 80、実測 93.9）。
吹き出しの `w` は**実測の幅＋10**、箱は余白が左右とも 1.5 を超える幅にする。

```js
(() => {
  const svg = document.querySelector('figure svg[role=img]');
  const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  t.setAttribute('font-size', String(7.5 * 1.2));   // size 7.5 × FONT_SCALE
  t.setAttribute('font-weight', '700');
  svg.appendChild(t);
  const m = (s) => { t.textContent = s; return +t.getBBox().width.toFixed(1); };
  const r = Object.fromEntries(['新MSV1', 'MGW2 だけ（正常時）', '正常時 MGW2 だけ'].map((s) => [s, m(s)]));
  t.remove();
  return r;
})()
```

候補の配列だけを書き換えて使う。どの図の `svg` で測っても同じ値になる（文字の大きさは viewBox の単位で決まる）。
新しい問の図は、ほかの問の図があるページ（例えば前の問の詳細解説ページ）を開いて、**箱に入れる語を全部まとめて**測ってから座標を決める
（R3-G1-1 で、組み直すかどうかの判断と箱の幅の両方に使った。太字の漢字は 1 字 9〜10 あり、`estimateWidth` の見積もりより広い）。
ここで測った幅は「画面の倍率が 1 のとき」の値で、実際の 375px・1024px の画面では、文字の箱が数％広く測られることがある
（R3-G1-3 の「ファイル」は 7% 広かった）。箱の幅は**測った幅＋7 以上**を目安にし、置いたあとは必ず「実行」で両方の幅を測る。
凡例や注記の文（`Cap`。太字でなく、大きさは 7 のことが多い）を測るときは、`font-size` を `7 * 1.2`、`font-weight` を `400` に
書き換える（R1-G1-1 で、凡例の見本の記号を文の直後に置くために使った）。
