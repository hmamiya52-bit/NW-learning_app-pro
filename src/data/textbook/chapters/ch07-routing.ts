import type { PacketFlowFigure, RecordTableFigure, TextbookChapter, Topology } from '../types'

// 第7章 ルーティング（経路制御）。第6章で設計したアドレスの間を、ルータがどう繋ぐか。
// 経路表＋ロンゲストマッチ・スタティック/ダイナミック(OSPF)・経路集約・経路選択(AD→メトリック)。

// §2 構成図: 2台目のルータ(R2)とサーバLANを追加。R1-R2は点対点リンク(/30)。
// 縦積みレイアウト（stack）で全ノードを1枚に表示。内部LAN/別フロアはR1の上、サーバLANはR2の下に枝分かれ。
const routeTableTopology: Topology = {
  layout: 'graph',
  stack: true,
  edgeLabels: [{ a: 'r1', b: 'r2', label: 'ルータ間リンク /30' }],
  zones: [
    { id: 'lan', label: '内部LAN', tone: 'sky' },
    { id: 'fl2', label: '別フロア', tone: 'emerald' },
    { id: 'srv', label: 'サーバLAN', tone: 'amber' },
  ],
  nodes: [
    { id: 'pc', label: '業務PC', role: 'pc', zoneId: 'lan', sub: '192.168.10.10' },
    { id: 'r1', label: 'R1', role: 'router', zoneId: 'lan', sub: '本社ルータ' },
    { id: 'fl2pc', label: '別フロアPC', role: 'pc', zoneId: 'fl2', sub: '192.168.30.10' },
    { id: 'r2', label: 'R2', role: 'router', zoneId: 'srv', sub: 'サーバ側', isNew: true },
    { id: 'web', label: 'Webサーバ', role: 'server', zoneId: 'srv', sub: '172.16.0.20' },
  ],
  links: [
    { a: 'pc', b: 'r1' },
    { a: 'r1', b: 'fl2pc' },
    { a: 'r1', b: 'r2' },
    { a: 'r2', b: 'web' },
  ],
}

const R1_TABLE = [
  { dst: '192.168.10.0/24', nh: '直結' },
  { dst: '192.168.30.0/24', nh: '直結' },
  { dst: '172.16.0.0/24', nh: '192.168.99.2（R2）' },
  { dst: '0.0.0.0/0', nh: '境界へ（第8章）' },
]
const R2_TABLE = [
  { dst: '172.16.0.0/24', nh: '直結' },
  { dst: '192.168.10.0/24', nh: '192.168.99.1（R1）' },
  { dst: '192.168.30.0/24', nh: '192.168.99.1（R1）' },
  { dst: '0.0.0.0/0', nh: '192.168.99.1（R1）' },
]

const routeTableFigure: PacketFlowFigure = {
  kind: 'packet-flow',
  id: 'ch7-route-table',
  title: 'あて先IPを経路表と照合して次ホップへ',
  caption: '[[blue:ネットワーク全体を1枚で表示]]。表はいまいるルータの経路表で、あて先IPと一致した行を強調します。',
  takeaway: 'ルータはあて先IPを経路表と照合し、一致行の[[blue:次ホップ]]へ渡すだけ。次ホップは最終あて先でなく「次の1歩」。',
  topology: routeTableTopology,
  hideHeaders: true,
  sideTable: {
    title: '通過するルータの経路表',
    columns: [
      { key: 'dst', label: '宛先' },
      { key: 'nh', label: '次ホップ' },
    ],
  },
  steps: [
    {
      focus: { type: 'link', a: 'pc', b: 'r1' },
      packetLabel: '宛先 172.16.0.20',
      headers: { l2: '', l3: '' },
      tableRows: R1_TABLE,
      explanation: '業務PCは、あて先 172.16.0.20 が自分のネットワーク（192.168.10.0/24）の外と判断し、デフォルトゲートウェイのR1へ送ります。',
    },
    {
      focus: { type: 'node', id: 'r1' },
      packetLabel: '宛先 172.16.0.20',
      headers: { l2: '', l3: '' },
      tableRows: R1_TABLE,
      tableHighlightRow: 2,
      explanation: 'R1はあて先IPを経路表と照合。172.16.0.0/24 の行に一致し、次ホップは R2（192.168.99.2）と分かります。',
    },
    {
      focus: { type: 'link', a: 'r1', b: 'r2' },
      packetLabel: '宛先 172.16.0.20',
      headers: { l2: '', l3: '' },
      tableRows: R1_TABLE,
      tableHighlightRow: 2,
      explanation: 'あて先IP（172.16.0.20）はそのまま。区間ごとに付け替わるのはL2のあて名だけで、ルータ間リンク（/30）を通ってR2へ渡ります。',
    },
    {
      focus: { type: 'node', id: 'r2' },
      packetLabel: '宛先 172.16.0.20',
      headers: { l2: '', l3: '' },
      tableRows: R2_TABLE,
      tableHighlightRow: 0,
      explanation: 'R2の経路表では 172.16.0.0/24 は直結。同じサーバLANの中なので、次ホップを介さず直接Webサーバへ届けます。',
    },
    {
      focus: { type: 'link', a: 'r2', b: 'web' },
      packetLabel: '宛先 172.16.0.20',
      headers: { l2: '', l3: '' },
      tableRows: R2_TABLE,
      tableHighlightRow: 0,
      explanation: 'サーバLANのWebサーバ（172.16.0.20）へ到達。次ホップを1台ずつたどり、端から端まで届きました。',
    },
  ],
}

// §3 ロンゲストマッチ。あて先 192.168.30.10 に3行が一致し、最長プレフィックスを選ぶ。
const longestMatchFigure: RecordTableFigure = {
  kind: 'record-table',
  id: 'ch7-longest-match',
  title: 'あて先 192.168.30.10 に一致する3つの経路',
  caption: '同じあて先に複数の行が一致。最も具体的（[[blue:プレフィックスが長い]]）行を選びます。',
  takeaway: '複数一致したら[[blue:最長プレフィックス]]を選ぶ（ロンゲストマッチ）。0.0.0.0/0 は最短＝最後の砦。',
  rowHeader: true,
  emphasizeKey: 'len',
  columns: [
    { key: 'dst', label: '宛先' },
    { key: 'nh', label: '次ホップ' },
    { key: 'len', label: 'プレフィックス長' },
  ],
  rows: [
    { dst: '0.0.0.0/0', nh: '境界へ（デフォルト）', len: '/0（最短）' },
    { dst: '192.168.0.0/16', nh: '集約経路', len: '/16' },
    { dst: '192.168.30.0/24', nh: '別フロアへ（直結）', len: '/24（最長）' },
  ],
  highlightRow: 2,
}

// §4 スタティック経路（手で書く例）。
const staticRouteFigure: RecordTableFigure = {
  kind: 'record-table',
  id: 'ch7-static',
  title: 'R1に手で書いたスタティック経路',
  caption: '管理者が宛先ごとに次ホップを手で書きます。確実な反面、変化に弱い書き方です。',
  takeaway: 'スタティックは確実で読みやすい反面、構成が変わるたび[[blue:手直し]]が必要。',
  rowHeader: true,
  columns: [
    { key: 'dst', label: '宛先' },
    { key: 'nh', label: '次ホップ' },
    { key: 'kind', label: '種別' },
  ],
  rows: [
    { dst: '172.16.0.0/24', nh: '192.168.99.2（R2）', kind: 'スタティック（手動）' },
    { dst: '0.0.0.0/0', nh: '境界ルータへ', kind: 'スタティック（デフォルト）' },
  ],
}

// §5 OSPF・冗長2経路。3ルータ三角形。R1→R2(サーバ側)へ、直結(1ホップ・遅い)よりR3経由(2ホップ・速い)がコスト小。
// R2はサーバ側ルータ（§2と一致）、R3は新しい中継ルータ。spine順=node配列順なので r1, r3, r2 の順に並べる。
const ospfTopology: Topology = {
  layout: 'graph',
  zones: [
    { id: 'lan', label: '内部LAN', tone: 'sky' },
    { id: 'srv', label: 'サーバLAN', tone: 'amber' },
  ],
  nodes: [
    { id: 'r1', label: 'R1', role: 'router', sub: '本社ルータ' },
    { id: 'r3', label: 'R3', role: 'router', sub: '中継ルータ' },
    { id: 'r2', label: 'R2', role: 'router', sub: 'サーバ側' },
    { id: 'pc', label: '業務PC', role: 'pc', zoneId: 'lan', sub: '192.168.10.10' },
    { id: 'web', label: 'Webサーバ', role: 'server', zoneId: 'srv', sub: '172.16.0.20' },
  ],
  links: [
    { a: 'r1', b: 'r3' },
    { a: 'r3', b: 'r2' },
    { a: 'r1', b: 'r2' },
    { a: 'pc', b: 'r1' },
    { a: 'r2', b: 'web' },
  ],
  edgeLabels: [
    { a: 'r1', b: 'r3', label: '1G・コスト10' },
    { a: 'r3', b: 'r2', label: '1G・コスト10' },
    { a: 'r1', b: 'r2', label: '100M・コスト100' },
  ],
}

const ospfFigure: PacketFlowFigure = {
  kind: 'packet-flow',
  id: 'ch7-ospf',
  title: 'OSPFはコスト（帯域）で最短を選ぶ',
  caption: '直結は1ホップでも遅く、R2経由は2ホップでも速い経路。OSPFは[[blue:コスト最小]]を選びます。',
  takeaway: 'OSPFはホップ数でなく[[blue:コスト（帯域）]]で最短を選択。主経路が切れたら自動で予備へ切替。',
  topology: ospfTopology,
  hideHeaders: true,
  steps: [
    {
      focus: { type: 'link', a: 'pc', b: 'r1' },
      packetLabel: 'パケット',
      headers: { l2: '', l3: '' },
      explanation: '業務PCがサーバ（172.16.0.20）あてを送出。R1は、サーバ側のR2へ届く2つの経路を地図から知っています。',
    },
    {
      focus: { type: 'link', a: 'r1', b: 'r3' },
      packetLabel: 'パケット',
      headers: { l2: '', l3: '' },
      explanation: 'R1はコストを比べ、速いR3経由（コスト10＋10＝20）を選択。直結（コスト100）より小さいコストです。まず1ホップ目。',
    },
    {
      focus: { type: 'link', a: 'r3', b: 'r2' },
      packetLabel: 'パケット',
      headers: { l2: '', l3: '' },
      explanation: '2ホップ目。ホップ数は多くても、帯域が太い経路の方がコストは小さく、OSPFはこちらを「近い」と見ます。',
    },
    {
      focus: { type: 'link', a: 'r2', b: 'web' },
      packetLabel: 'パケット',
      headers: { l2: '', l3: '' },
      explanation: 'R2からサーバLANのWebサーバへ到達。OSPFが選んだコスト最小の経路で届きました。',
    },
    {
      focus: { type: 'link', a: 'r1', b: 'r2' },
      packetLabel: 'パケット',
      headers: { l2: '', l3: '' },
      blockedLink: { a: 'r1', b: 'r3' },
      explanation: '速い主経路（R1–R3）が切れると、OSPFが地図を更新して再計算。直結（コスト100）が新しい最短として選ばれます。',
    },
    {
      focus: { type: 'link', a: 'r2', b: 'web' },
      packetLabel: 'パケット',
      headers: { l2: '', l3: '' },
      blockedLink: { a: 'r1', b: 'r3' },
      explanation: '切り替わった直結経路でも、Webサーバへ到達。冗長な経路があるので、1本切れても通信は止まりません。',
    },
  ],
}

// §6a 経路集約。
const summaryFigure: RecordTableFigure = {
  kind: 'record-table',
  id: 'ch7-summary',
  title: '連続するネットワークを1行にまとめる',
  caption: '連続する複数のネットワークを1つのプレフィックスに[[blue:まとめ]]、経路表を小さく保ちます。',
  takeaway: '経路集約で経路表を小さく。まとめすぎると細かい経路が1行に隠れる点に注意。',
  rowHeader: true,
  emphasizeKey: 'net',
  columns: [
    { key: 'net', label: '範囲' },
    { key: 'note', label: '説明' },
  ],
  rows: [
    { net: '192.168.10.0/24', note: '内部LAN' },
    { net: '192.168.20.0/24', note: '第2拠点（第12章で追加）' },
    { net: '192.168.30.0/24', note: '別フロア' },
    { net: '192.168.0.0/16', note: '↑をまとめた集約経路（1行で表せる）' },
  ],
  highlightRow: 3,
}

// §6b 経路選択（AD）。
const adFigure: RecordTableFigure = {
  kind: 'record-table',
  id: 'ch7-ad',
  title: '複数の経路源は優先順位（AD）で選ぶ',
  caption: '同じあて先に複数の経路源から経路が来たら、[[blue:AD（値が小さいほど優先）]]で選びます。',
  takeaway: 'AD（小さいほど優先）→同じ経路源なら[[blue:メトリック]]で選択。AD・エリア・SPFは名前と順番だけ。',
  rowHeader: true,
  emphasizeKey: 'ad',
  columns: [
    { key: 'src', label: '経路源' },
    { key: 'ad', label: 'AD（優先度）' },
    { key: 'note', label: '説明' },
  ],
  rows: [
    { src: '直結（connected）', ad: '0', note: '自分に直接つながるネットワーク。最優先' },
    { src: 'スタティック', ad: '1', note: '手で書いた経路' },
    { src: 'OSPF', ad: '110', note: '自動で学んだ経路' },
  ],
  highlightRow: 0,
}

export const ch07Routing: TextbookChapter = {
  id: 'routing',
  order: 7,
  title: 'ルーティング（経路制御）',
  summary: '経路表とロンゲストマッチで次ホップを選ぶ仕組み、スタティック/ダイナミック(OSPF)、経路集約と経路選択を、構成図の上で動かしながら理解します。',
  status: 'published',
  estimatedMinutes: 20,
  intro: [
    {
      kind: 'text',
      text: '第1章で、ルータは「あて先IPを見て、次にどの機器へ渡すかを決める機器」として登場しました。この章では、その「どうやって道を選ぶか」の中身を開きます。',
    },
    {
      kind: 'text',
      text: 'ルータが見るのは[[blue:あて先IP]]、決めるのは[[blue:次にどの機器へ渡すか（次ホップ）]]。その判断材料が[[blue:経路表]]です。第5章の「別VLAN間はL3」、第6章の「別セグメント間はルータ経由」が、ここで「では、どう中継するのか」につながります。',
    },
  ],
  sections: [
    {
      heading: 'ルータは経路表を引いて次ホップを決める',
      blocks: [
        {
          kind: 'text',
          text: 'ルータは、あて先のネットワークごとに「どこへ渡せばよいか」をまとめた表を持ちます。これが[[blue:経路表]]（ルーティングテーブル）。出口インタフェースや種別も並びますが、読み解きの中心は[[blue:宛先プレフィックス]]と[[blue:次ホップ]]です。',
        },
        {
          kind: 'text',
          text: 'パケットが届くと、ルータはあて先IPを経路表と照らし、一致した行の[[blue:次ホップ]]へ渡します。ここで大事なのは、次ホップは最終あて先ではなく「次の1歩」だけ、という点です。',
        },
        {
          kind: 'text',
          text: '構成図は第6章から育ち、2台目のルータ（R2）とサーバLAN（172.16.0.0/24）が加わりました。第6章まで「ルータ」と呼んでいた本社のルータは、区別のため以後[[blue:R1]]と呼びます。R1とR2は、第6章で学んだ点対点リンク（/30。ここでは 192.168.99.0/30）でつながります。',
        },
        { kind: 'figure', figure: routeTableFigure },
        {
          kind: 'callout',
          tone: 'warn',
          title: '次ホップは「次の1歩」',
          body: '1台のルータが決めるのは「次にどの機器へ渡すか」だけで、最終あて先までの全経路ではありません。あて先IPは基本そのままで、区間ごとに付け替わるのはL2のあて名（MAC）だけ——第1章で見たとおりです。各ルータの「次の1歩」が積み重なって、端から端まで届きます。',
        },
      ],
    },
    {
      heading: '複数が一致したら最長を選ぶ（ロンゲストマッチ）',
      blocks: [
        {
          kind: 'text',
          text: '経路表では、同じあて先に複数の行が一致することがあります。広い範囲をまとめた経路と、狭い範囲を指す経路が、両方ある場合です。',
        },
        {
          kind: 'text',
          text: 'このときルータは、最も具体的な——[[blue:プレフィックスが長い]]——行を選びます。これが[[blue:ロンゲストマッチ]]。プレフィックスが長いほど、宛先をピンポイントで指す経路です。',
        },
        { kind: 'figure', figure: longestMatchFigure },
        {
          kind: 'callout',
          tone: 'info',
          title: 'デフォルトルートは最後の砦',
          body: '0.0.0.0/0 は「どの行にも一致しないとき」の行き先で、プレフィックスが一番短いので、他に一致があれば必ず負けます。第1章のデフォルトゲートウェイは、経路表ではこの 0.0.0.0/0 として書かれていました。その先（インターネット境界）は第8章で扱います。',
        },
      ],
    },
    {
      heading: '経路の作り方①スタティック（手で書く）',
      blocks: [
        {
          kind: 'text',
          text: '経路表の行は、どう作るのでしょうか。1つ目は、管理者が手で1本ずつ書く[[blue:スタティックルート]]（静的経路）です。',
        },
        {
          kind: 'text',
          text: '確実で動きが読みやすい反面、ネットワークが増えたり構成が変わったりするたびに、手で直す必要があります。台数や拠点が増えると、この手作業が追いつかなくなります。',
        },
        { kind: 'figure', figure: staticRouteFigure },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'フローティングスタティックは名前だけ',
          body: '普段は使わない予備の経路に、わざと大きな距離（メトリック）を付けておき、主経路が消えたときだけ使う書き方を、フローティングスタティックと呼びます。名前だけ押さえておけば、先へ進めます。',
        },
      ],
    },
    {
      heading: '経路の作り方②ダイナミック（OSPFが自動で学ぶ）',
      blocks: [
        {
          kind: 'text',
          text: '2つ目は、ルータどうしが経路情報を交換し、構成の変化に自動で追従する[[blue:ダイナミックルーティング]]。その代表が[[blue:OSPF]]です。',
        },
        {
          kind: 'text',
          text: 'OSPFはリンクステート型——各ルータが「どこと、どれだけの太さ（帯域）でつながっているか」を配り合い、全員が同じ全体地図を持ちます。その地図から、[[blue:コスト（帯域から決まる距離）が最小]]の経路を、各自が計算します。',
        },
        {
          kind: 'text',
          text: 'ここで効くのが「コストは帯域で決まる」という点。太い回線ほどコストが小さく「近い」とみなされます。だから、[[blue:ホップ数が多くても、帯域が太い経路の方が選ばれる]]ことがあります。',
        },
        { kind: 'figure', figure: ospfFigure },
        {
          kind: 'callout',
          tone: 'tip',
          title: '使い分けと、エリアは名前だけ',
          body: '手動のスタティックは小規模で確実、自動のOSPFは変化に強い反面、設計が要ります。なお大きなOSPFでは、地図を「エリア」という単位で区切って配り、計算を軽くします。SPF計算やエリアといった細部は、名前と役割だけ押さえれば十分です。',
        },
      ],
    },
    {
      heading: '連続する経路を1行にまとめる（経路集約）',
      blocks: [
        {
          kind: 'text',
          text: '経路表は、放っておくと行が増えます。連続する複数のネットワークは、1つのプレフィックスに[[blue:まとめて]]（経路集約）、経路表を小さく保ちます。',
        },
        { kind: 'figure', figure: summaryFigure },
        {
          kind: 'text',
          text: 'ただし、まとめすぎると、その範囲の細かい経路が1行に隠れてしまいます。実在しないネットワークまで含めてしまう点には、注意が要ります。',
        },
      ],
    },
    {
      heading: '複数の経路源からは優先度で選ぶ（AD）',
      blocks: [
        {
          kind: 'text',
          text: '経路表には、同じあて先が複数の経路源（直結・スタティック・OSPF）から届くこともあります。このときは、まず[[blue:AD（アドミニストレーティブディスタンス）]]——経路源の信頼度＝優先順位——で選び、同じ経路源どうしなら[[blue:メトリック]]（距離）で選びます。',
        },
        { kind: 'figure', figure: adFigure },
      ],
    },
    {
      heading: '午後問題では「経路表を読んで次ホップを追う」',
      blocks: [
        {
          kind: 'text',
          text: 'ネスペ午後で最も多いのが、経路表を読んで「この通信は、どのルータのどの行に一致し、次ホップはどこか」を追う問題です。本章の図と同じ読み方で解けます。',
        },
        {
          kind: 'text',
          text: 'あわせて、ロンゲストマッチでの一致行の選択、冗長経路の切替（主経路がダウンしたらどこを通るか）、経路集約の読みも、午後で頻出です。',
        },
        {
          kind: 'callout',
          tone: 'info',
          title: 'TTLと、ping・traceroute',
          body: 'ルータを1台越えるたび、パケットのTTL（生存時間）が1ずつ減り、0になると破棄されます。経路がループしても、無限に回り続けないための仕組みです。到達確認のping、経路を1ホップずつ調べるtracerouteは、ICMPという仕組みを使います。障害切り分けでの活用は第19章で扱います。社外（インターネット）との経路交換を担うBGPは第8章です。',
        },
        {
          kind: 'check',
          label: '設問例',
          items: [
            {
              question: 'R1の経路表に 0.0.0.0/0、192.168.0.0/16、192.168.30.0/24 の3行があります。宛先 192.168.30.10 のパケットは、どの行に従うか。',
              answer: '192.168.30.0/24 の行。複数が一致したら、最長プレフィックス（ロンゲストマッチ）で決まります。',
            },
          ],
        },
      ],
    },
  ],
  takeaways: [
    'ルータは[[blue:経路表＋ロンゲストマッチ]]で次ホップ（次の1歩）を選びます。あて先IPは基本そのまま、区間ごとに付け替わるのはL2のあて名だけ。',
    '経路の作り方は[[blue:スタティック（手動・確実）]]と[[blue:ダイナミック/OSPF（自動・変化に追従）]]の2つ。',
    'OSPFはリンクステート＝全員が同じ地図を持ち、[[blue:コスト（帯域）で最短]]を選びます。ホップ数ではなく帯域。エリアは名前だけ。',
    '冗長な2経路があれば、主経路が切れても[[blue:自動で予備へ切替]]（午後頻出）。',
    '[[blue:経路集約]]で経路表を小さく、複数経路源は[[blue:AD→メトリック]]で選びます。デフォルトルート 0.0.0.0/0 ＝第1章のデフォルトゲートウェイ（最後の砦）。',
  ],
  checks: [
    {
      question: '経路表の「次ホップ」は、最終あて先のことか。',
      answer: '違います。次に渡す相手＝[[blue:次の1歩]]だけ。各ルータの1歩の積み重ねで端まで届きます。',
    },
    {
      question: 'OSPFが「最短」を選ぶ基準は何か。',
      answer: 'コスト（帯域から決まる距離）。ホップ数ではないので、太い回線の遠回りが選ばれることもあります。',
    },
    {
      question: '同じあて先を直結・スタティック・OSPFが知らせてきたら、どれを採用するか。',
      answer: 'AD（優先順位）が最小の直結。同じ経路源どうしなら、メトリックで選びます。',
    },
  ],
}
