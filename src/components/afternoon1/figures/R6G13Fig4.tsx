/**
 * 図4 B さんが作成した大阪支社の UTM の PAC ファイル — R6 午後Ⅰ 問3
 *
 * 原図はコードと「処理名／処理の説明文」の表を左右に並べるが、375px では横に入らないので
 * 縦に積んだ。コードの行・(a)〜(d) の破線の囲み・説明文・脚注は原図どおり。
 * コードは等幅で読ませたいので SVG ではなく HTML で組む（横スクロール可）。
 *
 * 解説を開いたときは、設問2(1)〜(4) の判定に効く行を赤で示す。
 * どの行がどの設問の答えを決めるかが、コードを追わなくても分かるようにするため。
 */

import type { ExamFigureProps } from './tokens'

/** 解説を開いたときに、その行が説明の対象だと示す */
const MARK = 'bg-red-50 text-red-700 font-bold ring-1 ring-inset ring-red-400 rounded-sm'

type Line = { t: string; mark?: boolean }

const BLOCKS: { key: string; lines: Line[] }[] = [
  {
    key: 'a',
    lines: [{ t: '// (a)' }, { t: 'var ip = dnsResolve(host);' }],
  },
  {
    key: 'b',
    lines: [
      { t: '// (b)' },
      { t: 'if (localHostOrDomainIs(host, "localhost") ||' },
      { t: '    isInNet(ip, "10.0.0.0", "255.0.0.0") ||' },
      { t: '    isInNet(ip, "127.0.0.0", "255.0.0.0") ||' },
      { t: '    isInNet(ip, "172.16.0.0", "255.240.0.0") ||', mark: true },
      { t: '    isInNet(ip, "192.168.0.0", "255.255.0.0") ||' },
      { t: '    dnsDomainIs(host, ".a-sha.jp")', mark: true },
      { t: '  ) {' },
      { t: '  return "DIRECT";', mark: true },
      { t: '}' },
    ],
  },
  {
    key: 'c',
    lines: [
      { t: '// (c)' },
      { t: 'if (' },
      { t: '  dnsDomainIs(host, "image.cdn.example") ||' },
      { t: '  shExpMatch(host, "*.c-saas.example") ) {' },
      { t: '  return "PROXY proxy.osaka.a-sha.jp:8080";' },
      { t: '}' },
    ],
  },
  {
    key: 'd',
    lines: [{ t: '// (d)' }, { t: 'return "PROXY proxy.a-sha.jp:8080";', mark: true }],
  },
]

const STEPS = [
  {
    key: '(a)',
    text: 'host を IP アドレスに変換し，変数 ip に代入する。',
  },
  {
    key: '(b)',
    text: 'host が localhost，又は(a)で宣言した ip がプライベート IP アドレスやループバックアドレス，又は host が A 社の社内利用ドメイン名に属する場合，FindProxyForURL 関数の戻り値として “DIRECT” を返す。',
  },
  {
    key: '(c)',
    text: 'host が C 社 SaaS 利用ドメイン名に属する場合，又は host が C 社 SaaS 利用ドメイン名のシェルグロブ表現に一致する場合，FindProxyForURL 関数の戻り値として “PROXY proxy.osaka.a-sha.jp:8080” を返す。',
  },
  {
    key: '(d)',
    text: '(b)，(c)どちらにも該当しない場合，FindProxyForURL 関数の戻り値として “PROXY proxy.a-sha.jp:8080” を返す。',
  },
]

const NOTES = [
  'image.cdn.example：C 社 SaaS 利用ドメイン名',
  'c-saas.example：C 社 SaaS 利用ドメイン名',
  'a-sha.jp：A 社の社内利用ドメイン名',
  'proxy.a-sha.jp：本社のプロキシサーバの FQDN',
  'proxy.osaka.a-sha.jp：大阪支社の UTM プロキシサーバの FQDN',
]

export default function R6G13Fig4({ highlight = false }: ExamFigureProps) {
  return (
    <div className="space-y-2">
      {/* コード（原図どおり (a)〜(d) を破線で囲む） */}
      <div className="overflow-x-auto rounded border border-slate-300 bg-white px-2 py-2">
        <div className="font-mono text-[9px] leading-[1.45] text-slate-700 whitespace-pre min-w-max">
          <div>function FindProxyForURL(url, host) &#123;</div>
          {BLOCKS.map((b) => (
            <div
              key={b.key}
              className="border border-dashed border-slate-400 rounded-sm my-0.5 pl-2 pr-1 py-0.5"
            >
              {b.lines.map((ln, i) => (
                <div key={i} className={highlight && ln.mark ? MARK : undefined}>
                  {ln.t}
                </div>
              ))}
            </div>
          ))}
          <div>&#125;</div>
        </div>
      </div>

      {/* 処理名と処理の説明文 */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[10.5px]">
          <thead>
            <tr>
              <th className="border border-slate-300 bg-slate-100 text-slate-700 px-1.5 py-1 font-bold whitespace-nowrap">
                処理名
              </th>
              <th className="border border-slate-300 bg-slate-100 text-slate-700 px-1.5 py-1 font-bold">
                処理の説明文
              </th>
            </tr>
          </thead>
          <tbody>
            {STEPS.map((s) => (
              <tr key={s.key}>
                <th
                  scope="row"
                  className="border border-slate-300 bg-slate-50 px-1.5 py-1 align-middle text-center font-mono font-normal text-slate-700"
                >
                  {s.key}
                </th>
                <td className="border border-slate-300 px-1.5 py-1 align-top leading-relaxed text-slate-700">
                  {s.text}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 脚注（原図の右下・左下にある注） */}
      <ul className="text-[10px] leading-relaxed text-slate-500 space-y-0.5">
        {NOTES.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>
    </div>
  )
}
