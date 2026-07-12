import type { EncapFigure, PacketFlowFigure, RecordTableFigure, TextbookChapter, Topology } from '../types'

// 第12章 拠点間接続・VPN・WAN・SD-WAN。第11章までは本社1拠点。ここで離れた支社をつなぐ。
// IPsec VPN（元のIPパケットを暗号化して新しいIPで包む＝第1章カプセル化の応用・二重IP）→ WANの種類 → SD-WAN。
// 台帳の第2拠点 192.168.20.0/24 を追加。支社ルータのグローバルは 203.0.113.5（本社境界 203.0.113.1 と別の点）。

// §1/§2 拠点間の旅（tunnel）。本社ルータ—[暗号トンネルの帯]—支社ルータを横に、端末は各ルータの下。
// 折り返さないSVGグラフで常に1つながり。二重IP（外側/中身）は bubbles で段階表示。
const tunnelTopology: Topology = {
  layout: 'graph',
  tunnel: true,
  tunnelNote: 'IPsec暗号トンネル（インターネット経由）',
  zones: [],
  nodes: [
    { id: 'hqrt', label: '本社ルータ', role: 'router', sub: '外側 203.0.113.1' },
    { id: 'brrt', label: '支社ルータ', role: 'router', sub: '外側 203.0.113.5' },
    { id: 'hqpc', label: '本社PC', role: 'pc', sub: '192.168.10.10' },
    { id: 'brpc', label: '支社PC', role: 'pc', sub: '192.168.20.10' },
  ],
  links: [
    { a: 'hqpc', b: 'hqrt' },
    { a: 'hqrt', b: 'brrt' },
    { a: 'brrt', b: 'brpc' },
  ],
}

const tunnelFigure: PacketFlowFigure = {
  kind: 'packet-flow',
  id: 'ch12-tunnel',
  title: '本社から支社へ渡る暗号トンネル',
  caption: '本社ルータで[[violet:包み]]、暗号トンネルを渡り、支社ルータで[[blue:開き]]ます。',
  takeaway: 'トンネルの中は[[violet:外側IP]]で運ばれ、[[blue:元の宛先]]は暗号化。第1章の「包む／外す」が拠点間で効きます。',
  topology: tunnelTopology,
  hideHeaders: true,
  steps: [
    {
      focus: { type: 'link', a: 'hqpc', b: 'hqrt' },
      bubbles: ['宛先 192.168.20.10'],
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: '本社PCから支社PC（192.168.20.10）あての通信。宛先は支社のネットワークなので、まず本社ルータへ。',
    },
    {
      focus: { type: 'node', id: 'hqrt' },
      bubbles: ['外側 203.0.113.5（新IP）', '中身 192.168.20.10（暗号）'],
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: '本社ルータが元のパケットを丸ごと暗号化し、支社ルータあて（203.0.113.5）の新しいIPで包みます。',
    },
    {
      focus: { type: 'link', a: 'hqrt', b: 'brrt' },
      bubbles: ['外側 203.0.113.5（新IP）', '中身 192.168.20.10（暗号）'],
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: '暗号トンネルを渡ります。外から見える宛先は外側のIPだけ。中身の元パケットは、誰にものぞかれません。',
    },
    {
      focus: { type: 'node', id: 'brrt' },
      bubbles: ['中身 192.168.20.10（取り出し）'],
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: '支社ルータが外側の包みを外し、暗号を解いて元のパケットを取り出します。ここがトンネルの出口です。',
    },
    {
      focus: { type: 'link', a: 'brrt', b: 'brpc' },
      bubbles: ['宛先 192.168.20.10'],
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: '元の宛先 192.168.20.10 に戻り、支社PCへ到達。戻りの通信も、同じトンネルを逆向きに通ります。',
    },
  ],
}

// §2 IPsecの二重IP（encap 再利用）。元TCP+データ → 元IP → IPsec暗号化 → 新IP。
const ipsecEncap: EncapFigure = {
  kind: 'encap',
  id: 'ch12-ipsec-encap',
  title: '元パケットを包む二重のIP（IPsec）',
  caption: '外側から[[violet:新IP]]→[[rose:IPsec]]→[[blue:元IP]]と、パケットが[[violet:入れ子]]になっています。',
  takeaway: '包んだ順の逆にたどって開けば、[[blue:元のパケット]]に戻ります。外す順は、包んだ順と対称です。',
  dataLabel: '元のTCP＋データ',
  levels: [
    { unit: 'IPsecパケット', layerLabel: '新IP', header: '新IPヘッダ（外側）', tone: 'violet' },
    { unit: '暗号化された中身', layerLabel: 'IPsec', header: 'IPsecヘッダ', trailer: 'IPsecトレーラ', tone: 'rose' },
    { unit: '元のIPパケット', layerLabel: '元IP', header: '元IPヘッダ（内側）', tone: 'blue' },
  ],
}

// §3 WAN回線の種類（record-table 再利用）。
const wanTable: RecordTableFigure = {
  kind: 'record-table',
  id: 'ch12-wan',
  title: '拠点間をつなぐWAN回線の種類',
  caption: '[[blue:品質・コスト・暗号の要否]]で、拠点間の回線を選びます。',
  takeaway: 'インターネットVPNは安いぶん、[[rose:自分で暗号化]]（IPsec）が必須。専用線・IP-VPNは回線側で守られます。',
  rowHeader: true,
  emphasizeKey: 'enc',
  columns: [
    { key: 'type', label: '種類' },
    { key: 'line', label: 'どんな回線か' },
    { key: 'cost', label: 'コスト' },
    { key: 'enc', label: '暗号化' },
  ],
  rows: [
    { type: '専用線', line: '自社だけの物理回線', cost: '高', enc: '任意（回線が専用）' },
    { type: 'IP-VPN', line: '通信事業者の閉域網を利用', cost: '中', enc: '任意（網内で分離）' },
    { type: 'インターネットVPN', line: 'インターネットを経由', cost: '低', enc: '必須（IPsecで暗号化）' },
  ],
}

// §4 午後: トンネルの外側と内側（record-table 再利用）。
const insideOutsideTable: RecordTableFigure = {
  kind: 'record-table',
  id: 'ch12-inout',
  title: 'トンネルの外側と内側で、何が違うか',
  caption: 'IPsec VPNの問題は、[[violet:外側]]と[[blue:内側]]のどちらを問われているかを見分けます。',
  takeaway: '外側は[[violet:拠点間の住所]]、内側が[[blue:本来の通信]]。暗号化されて隠れるのは、内側です。',
  rowHeader: true,
  columns: [
    { key: 'item', label: '項目' },
    { key: 'out', label: '外側（新IP）' },
    { key: 'in', label: '内側（元IP）' },
  ],
  rows: [
    { item: '宛先IP', out: '支社ルータ 203.0.113.5', in: '支社PC 192.168.20.10' },
    { item: '通る区間', out: 'インターネット全体', in: 'トンネルの中だけ' },
    { item: '見え方', out: 'なし（丸見え）', in: 'あり（秘匿）' },
  ],
}

export const ch12VpnWanSdwan: TextbookChapter = {
  id: 'vpn-wan-sdwan',
  order: 12,
  title: '拠点間接続・VPN・WAN・SD-WAN',
  summary:
    '離れた本社と支社を安全につなぐIPsec VPN、つまり元のパケットを暗号化して新しいIPで包む二重のトンネルを軸に、拠点間をつなぐWAN回線の種類と、複数回線を束ねて使い分けるSD-WANを理解します。第1章のカプセル化が「パケットをパケットで包む」として効きます。',
  status: 'published',
  estimatedMinutes: 16,
  intro: [
    {
      kind: 'text',
      text: 'ここまでの構成図は本社の1拠点だけでした。実際の企業では、[[blue:支社]]や工場など離れた拠点をつなぐ必要があります。',
    },
    {
      kind: 'text',
      text: '拠点ごとに専用線を引くのは高くつきます。そこで、安いインターネットを経由しながら安全につなぐのが[[blue:VPN]]。この章では、拠点間を暗号トンネルでつなぐ[[blue:IPsec VPN]]、回線の種類（[[blue:WAN]]）、複数回線を束ねる[[blue:SD-WAN]]を扱います。',
    },
  ],
  sections: [
    {
      heading: '拠点間をつなぐという課題',
      blocks: [
        {
          kind: 'text',
          text: '本社（192.168.10.0/24）と支社（192.168.20.0/24）は、離れた場所にあります。両者をつなぐ道は[[blue:インターネット]]ですが、そのまま社内の通信を流すと、途中で[[red:のぞき見]]される恐れがあります。',
        },
        {
          kind: 'text',
          text: 'かといって、プライベートIP（第8章）のままではインターネットを越えられません。この2つの課題を一度に解くのが、次のIPsec VPNです。',
        },
        {
          kind: 'callout',
          tone: 'info',
          title: '構成図に、2つ目の拠点が加わります',
          body: 'これまで本社だけだった構成図に、[[emerald:支社（192.168.20.0/24）]]が加わります。本社ルータと支社ルータを、インターネット越しの[[blue:暗号トンネル]]で結ぶこと。これが拠点間接続の基本形です。',
        },
      ],
    },
    {
      heading: 'IPsec VPNはパケットを包む暗号トンネル',
      blocks: [
        {
          kind: 'text',
          text: '[[blue:IPsec VPN]]は、拠点間に[[blue:暗号トンネル]]を作ります。本社ルータが、元のIPパケットを丸ごと[[rose:暗号化]]し、あて先を支社ルータにした[[violet:新しいIPヘッダ]]で包んで送ります。受け取った支社ルータは、包みを外して元のパケットに戻します。',
        },
        { kind: 'figure', figure: tunnelFigure },
        {
          kind: 'text',
          text: 'このとき、パケットは[[violet:IPが二重]]になります。外側は「拠点間を運ぶための住所」、内側は「本来の通信」。第1章で見た[[blue:カプセル化]]（パケットをヘッダで包む）が、ここでは「パケットをまるごとパケットで包む」として効いています。',
        },
        { kind: 'figure', figure: ipsecEncap },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'トンネルの中は、もう1枚IPがある',
          body: '外から見えるのは[[violet:外側のIP]]（本社ルータ→支社ルータ）だけ。中身の[[blue:元のIP]]（本社PC→支社PC）は暗号化され、途中では読めません。暗号化のESPや、鍵を交換するIKEといった言葉もありますが、[[blue:名前だけ]]押さえれば十分です。',
        },
      ],
    },
    {
      heading: 'WANとSD-WAN',
      blocks: [
        {
          kind: 'text',
          text: '拠点間をつなぐ広域回線を[[blue:WAN]]と呼びます。代表的なのは、自社専用の[[blue:専用線]]、通信事業者の閉域網を使う[[blue:IP-VPN]]、そして安価な[[blue:インターネットVPN]]の3つ。品質・コスト・暗号の要否で選びます。',
        },
        { kind: 'figure', figure: wanTable },
        {
          kind: 'text',
          text: '近ごろは、これら複数の回線を1つにまとめて賢く使う[[blue:SD-WAN]]が広がっています。通信の種類（重要な業務か、一般の通信か）や回線の品質を見て、ソフトウェアが[[blue:最適な回線を自動で選び分け]]ます。1本が混雑・故障しても、別の回線へ自動で切り替わります。',
        },
        {
          kind: 'callout',
          tone: 'info',
          title: '第11章のLAGとの違い',
          body: '第11章の[[blue:LAG]]は、同じ2台の機器の間の複数リンクを束ねて[[blue:1本の論理リンク]]にする仕組みでした。[[blue:SD-WAN]]は、拠点間の複数のWAN回線を束ね、通信ごとに[[blue:使い分け]]るオーバーレイ。どちらも「複数を束ねて冗長・最適化」しますが、束ねる対象と使い方が違います。',
        },
      ],
    },
    {
      heading: '午後は暗号区間と両端を問う',
      blocks: [
        {
          kind: 'text',
          text: '午後では、VPNの[[blue:トンネルの両端]]（どのルータからどのルータまでか）、[[blue:暗号化される区間]]、そして送信元・あて先が外側と内側でどうなるかが問われます。ここで効くのが、外側と内側の区別です。',
        },
        { kind: 'figure', figure: insideOutsideTable },
        {
          kind: 'text',
          text: 'トンネルはFW（第9章）の内側から張ることが多く、[[blue:VPNの通信をFWで許可]]する設定もあわせて問われます。戻りの通信が同じトンネルを逆向きに通る点も、あわせて押さえます。',
        },
        {
          kind: 'check',
          label: '設問例',
          items: [
            {
              question:
                '本社PC（192.168.10.10）から支社PC（192.168.20.10）へのIPsec VPN通信で、インターネットを流れているパケットの外側のあて先IPアドレスは何か。',
              answer:
                '支社ルータのグローバルIP（203.0.113.5）です。元のあて先（192.168.20.10）は暗号化された内側にあり、インターネット上では外側のIPだけが見えます。',
            },
          ],
        },
        {
          kind: 'text',
          text: '物理を意識しない論理ネットワークをさらに広げる[[blue:VXLAN]]（クラウドとの接続）は第17章で扱います。「包んで運ぶ」という考え方は、そこでも土台になります。',
        },
      ],
    },
  ],
  takeaways: [
    '[[blue:IPsec VPN]]は、元のパケットを暗号化して新しいIPで包む[[violet:暗号トンネル]]。拠点間を安全につなぎます。',
    'トンネルの中はIPが[[violet:二重]]。外側は拠点間の住所、内側が本来の通信で、内側は暗号化されて見えません（第1章のカプセル化）。',
    '[[blue:WAN]]は拠点間の広域回線（専用線・IP-VPN・インターネットVPN）。インターネットVPNは[[rose:自分で暗号化]]が必須です。',
    '[[blue:SD-WAN]]は複数のWAN回線を束ね、通信ごとに最適な回線を自動で使い分けるオーバーレイです。',
  ],
  checks: [
    {
      question: 'IPsec VPNで、インターネットを渡るパケットのIPが「二重」になるのはなぜか。',
      answer: '元のIPパケットを丸ごと暗号化し、拠点間を運ぶための新しいIPヘッダで包むためです。外側が拠点間の住所、内側が本来の通信になります。',
    },
    {
      question: 'インターネットVPNで、専用線と違って暗号化（IPsec）が欠かせないのはなぜか。',
      answer: '不特定多数が通るインターネットを経由するため、暗号化しないと中身をのぞき見される恐れがあるからです。専用線やIP-VPNは回線側で分離・保護されます。',
    },
    {
      question: 'SD-WANは、複数のWAN回線をどう扱う仕組みか。',
      answer: '複数の回線を束ね、通信の種類や品質・コストに応じて最適な回線をソフトウェアが自動で選び分けます。1本が故障しても別の回線へ切り替わります。',
    },
  ],
}
