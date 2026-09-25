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
