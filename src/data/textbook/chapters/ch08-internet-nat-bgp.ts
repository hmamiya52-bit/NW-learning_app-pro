import type { AddressTableFigure, PacketFlowFigure, RecordTableFigure, TextbookChapter, Topology } from '../types'

// 第8章 インターネット接続・NAT・BGP。第7章の経路を「外」へ。
// プライベート/グローバル → NAPT（第1章「あて先IPは基本変わらない」の例外を回収）→ AS/BGP（概要）。

// §1 全体図: インターネット境界を追加。stack 4段（上=社外・下=社内）で全ノードを1枚に表示。
const overviewTopology: Topology = {
  layout: 'graph',
  stack: true,
  edgeLabels: [
    { a: 'inet', b: 'br', label: 'グローバル 203.0.113.0/30' },
    { a: 'r1', b: 'r2', label: '192.168.99.0/30' },
  ],
  zones: [
    { id: 'lan', label: '内部LAN', tone: 'sky' },
    { id: 'fl2', label: '別フロア', tone: 'emerald' },
    { id: 'srv', label: 'サーバLAN', tone: 'amber' },
  ],
  nodes: [
    { id: 'inet', label: 'インターネット', role: 'internet' },
    { id: 'br', label: '境界ルータ', role: 'router', sub: '外側 203.0.113.1' },
    { id: 'r1', label: 'R1', role: 'router', sub: '本社ルータ' },
    { id: 'pc', label: '業務PC', role: 'pc', zoneId: 'lan', sub: '192.168.10.10' },
    { id: 'fl2pc', label: '別フロアPC', role: 'pc', zoneId: 'fl2', sub: '192.168.30.10' },
    { id: 'r2', label: 'R2', role: 'router', sub: 'サーバ側' },
    { id: 'web', label: 'Webサーバ', role: 'server', zoneId: 'srv', sub: '172.16.0.20' },
  ],
  links: [
    { a: 'inet', b: 'br' },
    { a: 'br', b: 'r1' },
    { a: 'r1', b: 'pc' },
    { a: 'r1', b: 'fl2pc' },
    { a: 'r1', b: 'r2' },
    { a: 'r2', b: 'web' },
  ],
}

const overviewFigure: PacketFlowFigure = {
  kind: 'packet-flow',
  id: 'ch8-overview',
  title: 'インターネットとの境界が加わった全体図',
  caption: '[[blue:上が社外・下が社内]]。第7章までの構成の上に、境界ルータとインターネットが加わりました。',
  takeaway: '社内から外へ出る通信は、どこ発でも最後は[[blue:境界ルータ]]を通る構造。R1のデフォルトルートの行き先もここ。',
  topology: overviewTopology,
  hideHeaders: true,
  steps: [
    {
      focus: { type: 'node', id: 'r1' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: '第7章までの世界。R1とR2が、内部LAN・別フロア・サーバLANの3つのセグメントを結んでいます。',
    },
    {
      focus: { type: 'node', id: 'br' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: '今回加わったのが境界ルータ。R1の経路表の 0.0.0.0/0（デフォルトルート）の行き先は、ここです。',
    },
    {
      focus: { type: 'link', a: 'br', b: 'inet' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: '境界ルータの外側はグローバルIP（203.0.113.1）。この線から先は、世界で通用する住所だけが使えます。',
    },
    {
      focus: { type: 'node', id: 'inet' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: 'その先がインターネット。ISPを経由して世界中へつながります。雲の中身は、この章の後半で開きます。',
    },
  ],
}

// §2 プライベート/グローバルの対比。
const ipTypeFigure: AddressTableFigure = {
  kind: 'address-table',
  id: 'ch8-private-global',
  title: 'プライベートIPとグローバルIP',
  caption: '同じ「IPアドレス」でも、[[blue:通用する範囲]]がまったく違います。',
  takeaway: 'プライベートの[[blue:3つの範囲]]は暗記必須。アドレスを見て境界の内か外かを見分けるのが第一歩です。',
  rows: [
    {
      name: 'プライベートIP',
      layer: '組織の中',
      carries: 'どの組織でも自由に使ってよい社内用の住所',
      scope: 'その組織の中だけ。世界中で同じ番号が使われるため、インターネットでは通用しません',
      example: '10.0.0.0/8・172.16.0.0/12・192.168.0.0/16',
      tone: 'sky',
    },
    {
      name: 'グローバルIP',
      layer: '世界',
      carries: '世界で1つだけの住所。割当てを受けて使います',
      scope: 'インターネット全体で通用します',
      example: '203.0.113.1（うちの境界ルータの外側）',
      tone: 'amber',
    },
  ],
}

// §3 NAPT の往復。chain＋変換表（2行固定でボタン不動。値を段階的に埋める）。
const NAT_EMPTY = [
  { in: '—', out: '—' },
  { in: '—', out: '—' },
]
const NAT_ONE = [
  { in: '192.168.10.10:51000', out: '203.0.113.1:62000' },
  { in: '—', out: '—' },
]
const NAT_TWO = [
  { in: '192.168.10.10:51000', out: '203.0.113.1:62000' },
  { in: '192.168.30.10:49500', out: '203.0.113.1:62001' },
]

const naptTopology: Topology = {
  zones: [
    { id: 'lan', label: '内部LAN 192.168.10.0/24', tone: 'sky' },
    { id: 'edge', label: 'インターネット境界', tone: 'violet' },
    { id: 'inet', label: 'インターネット', tone: 'slate' },
  ],
  nodes: [
    { id: 'pc', label: '業務PC', role: 'pc', zoneId: 'lan', sub: '192.168.10.10' },
    { id: 'r1', label: 'R1', role: 'router', zoneId: 'lan', sub: '本社ルータ' },
    { id: 'br', label: '境界ルータ', role: 'router', zoneId: 'edge', sub: '外側 203.0.113.1' },
    { id: 'extweb', label: '社外Webサーバ', role: 'server', zoneId: 'inet', sub: '198.51.100.100' },
  ],
  links: [
    { a: 'pc', b: 'r1' },
    { a: 'r1', b: 'br' },
    { a: 'br', b: 'extweb' },
  ],
}

const naptFigure: PacketFlowFigure = {
  kind: 'packet-flow',
  id: 'ch8-napt',
  title: '境界ルータのNAPTを通って世界と往復する',
  caption: 'パケットの[[blue:送信元IP:ポート]]と、下の[[blue:変換表]]がどう連動するかを追います。',
  takeaway: '行きで記録した変換表が、戻りのあて先を書き戻す鍵。[[blue:ポートの違い]]で多数のPCが1つのグローバルIPを共有します。',
  topology: naptTopology,
  hideHeaders: true,
  sideTable: {
    title: '境界ルータのNAPT変換表',
    columns: [
      { key: 'in', label: '社内側（変換前）' },
      { key: 'out', label: '変換後（グローバル）' },
    ],
  },
  steps: [
    {
      focus: { type: 'link', a: 'pc', b: 'r1' },
      packetLabel: '送信元 192.168.10.10:51000',
      headers: { l2: '', l3: '' },
      tableRows: NAT_EMPTY,
      explanation: '社外のWebサイト（198.51.100.100）あての通信。自分のネットワークの外なので、まずR1へ送ります。',
    },
    {
      focus: { type: 'node', id: 'r1' },
      packetLabel: '送信元 192.168.10.10:51000',
      headers: { l2: '', l3: '' },
      tableRows: NAT_EMPTY,
      explanation: 'R1の経路表に一致する行はなく、最後の砦 0.0.0.0/0（第7章）に一致。次ホップは境界ルータです。',
    },
    {
      focus: { type: 'link', a: 'r1', b: 'br' },
      packetLabel: '送信元 192.168.10.10:51000',
      headers: { l2: '', l3: '' },
      tableRows: NAT_EMPTY,
      explanation: '送信元はまだプライベートIPのまま。この住所は世界では通用しないので、境界で書き換えが要ります。',
    },
    {
      focus: { type: 'node', id: 'br' },
      packetLabel: '送信元 203.0.113.1:62000',
      headers: { l2: '', l3: '' },
      tableRows: NAT_ONE,
      tableHighlightRow: 0,
      explanation: '境界ルータが送信元を 203.0.113.1:62000 へ書き換え（NAPT）、元との対応を変換表に記録します。',
    },
    {
      focus: { type: 'node', id: 'br' },
      packetLabel: '送信元 203.0.113.1:62000',
      headers: { l2: '', l3: '' },
      tableRows: NAT_TWO,
      tableHighlightRow: 1,
      explanation: '同じころ、別フロアPC（192.168.30.10）の通信も外へ。ポートを変えて、同じ 203.0.113.1 を共有します。',
    },
    {
      focus: { type: 'link', a: 'br', b: 'extweb' },
      packetLabel: '送信元 203.0.113.1:62000',
      headers: { l2: '', l3: '' },
      tableRows: NAT_TWO,
      explanation: 'グローバルの送信元でインターネットを渡ります。あて先（198.51.100.100:443）は出発時から不変。',
    },
    {
      focus: { type: 'link', a: 'extweb', b: 'br' },
      packetLabel: '宛先 203.0.113.1:62000',
      headers: { l2: '', l3: '' },
      tableRows: NAT_TWO,
      explanation: 'サーバは 203.0.113.1:62000 あてに応答。相手から見えるのは、境界ルータの外側の住所だけです。',
    },
    {
      focus: { type: 'node', id: 'br' },
      packetLabel: '宛先 192.168.10.10:51000',
      headers: { l2: '', l3: '' },
      tableRows: NAT_TWO,
      tableHighlightRow: 0,
      explanation: '変換表で 62000 は業務PCの通信と判明。あて先を 192.168.10.10:51000 へ書き戻します（62001なら別フロアPC）。',
    },
    {
      focus: { type: 'link', a: 'r1', b: 'pc' },
      packetLabel: '宛先 192.168.10.10:51000',
      headers: { l2: '', l3: '' },
      tableRows: NAT_TWO,
      explanation: '社内の住所に戻った応答が、行きと逆の道で業務PCへ。NAPTの変換表が、往復を1本につなぎました。',
    },
  ],
}

// §4 BGP。AS3つの三角形（cloud=spine）＋自社境界ルータ（leafIds で葉に）・相手サーバ。
// AS番号は文書用（RFC 5398）の例示。
const bgpTopology: Topology = {
  layout: 'graph',
  leafIds: ['br'],
  zones: [
    { id: 'own', label: '自社', tone: 'sky' },
    { id: 'site', label: '相手先', tone: 'amber' },
  ],
  nodes: [
    { id: 'ispa', label: '契約ISP', role: 'cloud', sub: 'AS 64500' },
    { id: 'target', label: '相手の組織', role: 'cloud', sub: 'AS 64510' },
    { id: 'ispb', label: '別のISP', role: 'cloud', sub: 'AS 64501' },
    { id: 'br', label: '境界ルータ', role: 'router', zoneId: 'own', sub: '自社 203.0.113.1' },
    { id: 'extweb', label: '社外Webサーバ', role: 'server', zoneId: 'site', sub: '198.51.100.100' },
  ],
  links: [
    { a: 'ispa', b: 'target' },
    { a: 'target', b: 'ispb' },
    { a: 'ispa', b: 'ispb' },
    { a: 'br', b: 'ispa' },
    { a: 'target', b: 'extweb' },
  ],
  edgeLabels: [
    { a: 'ispa', b: 'target', label: 'BGP' },
    { a: 'target', b: 'ispb', label: 'BGP' },
    { a: 'ispa', b: 'ispb', label: 'BGP' },
  ],
}

const bgpFigure: PacketFlowFigure = {
  kind: 'packet-flow',
  id: 'ch8-bgp',
  title: 'ASどうしの経路交換（BGP）で世界に届く',
  caption: 'インターネットの雲の中身は[[blue:ASのつながり]]。自社は契約ISPのASにつなぐだけです。',
  takeaway: '[[blue:BGP]]がAS間で経路を教え合うから、道が1本切れても別のASを回って届きます。',
  topology: bgpTopology,
  hideHeaders: true,
  steps: [
    {
      focus: { type: 'link', a: 'br', b: 'ispa' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: '自社が直接つながるのは契約ISPだけ。境界ルータは、外あてをすべてISPへ出します（デフォルトルート）。',
    },
    {
      focus: { type: 'node', id: 'ispa' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: 'ISPや大きな組織のネットワークのかたまりがAS。AS同士は「どのネットワークへ届くか」をBGPで教え合います。',
    },
    {
      focus: { type: 'link', a: 'ispa', b: 'target' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: '契約ISPは、BGPで学んだ経路で相手の組織のASへ中継します。',
    },
    {
      focus: { type: 'link', a: 'target', b: 'extweb' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: '相手の組織の中のWebサーバへ到達。ASからASへのリレーで、世界中に届きます。',
    },
    {
      focus: { type: 'link', a: 'ispa', b: 'ispb' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      blockedLink: { a: 'ispa', b: 'target' },
      explanation: 'AS間の道が切れても、BGPが代わりの経路を広め直します。通信は別のISPのASへ。',
    },
    {
      focus: { type: 'link', a: 'ispb', b: 'target' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      blockedLink: { a: 'ispa', b: 'target' },
      explanation: '迂回して到達。第7章のOSPFと同じ考え方が、AS単位・世界規模で動いています。',
    },
  ],
}

// §5 行き/戻りの対称表（午後の変換表読解の道具）。
const natDirectionFigure: RecordTableFigure = {
  kind: 'record-table',
  id: 'ch8-nat-direction',
  title: 'NAPTの行きと戻りで、何が変わるか',
  caption: '変換表の問題では、まず[[blue:どちら向きの通信か]]を確認。変わるものが行きと戻りで逆になります。',
  takeaway: '行きは[[blue:送信元]]・戻りは[[blue:あて先]]が書き換わり、反対側はそのまま。',
  rowHeader: true,
  columns: [
    { key: 'dir', label: '向き' },
    { key: 'chg', label: '変わるもの' },
    { key: 'keep', label: '変わらないもの' },
  ],
  rows: [
    { dir: '行き（社内→社外）', chg: '送信元IPとポート（プライベート→グローバル）', keep: '宛先IPとポート' },
    { dir: '戻り（社外→社内）', chg: '宛先IPとポート（グローバル→プライベート）', keep: '送信元IPとポート' },
  ],
}

export const ch08InternetNatBgp: TextbookChapter = {
  id: 'internet-nat-bgp',
  order: 8,
  title: 'インターネット接続・NAT・BGP',
  summary: '社内のプライベートIPと世界のグローバルIP、境界ルータでのNAPT変換、AS・BGPによる世界規模の経路交換まで、構成図をインターネットまで広げて理解します。',
  status: 'published',
  estimatedMinutes: 20,
  intro: [
    {
      kind: 'text',
      text: '第7章まで、パケットの旅はすべて社内で完結していました。この章ではいよいよ社外のインターネットへ出ます。',
    },
    {
      kind: 'text',
      text: '必要になるのは、[[blue:世界で通用する住所]]（グローバルIP）、社内の住所との[[blue:橋渡し]]（NAT）、そして世界規模の[[blue:道案内]]（BGP）の3つ。第1章の「あて先IPは基本変わらない」に残されていた例外も、この章で回収します。',
    },
  ],
  sections: [
    {
      heading: '構成図に、インターネットとの境界が加わる',
      blocks: [
        {
          kind: 'text',
          text: '第7章のR1の経路表に、どの行にも一致しないときの最後の砦、[[blue:0.0.0.0/0（デフォルトルート）]]がありました。その行き先の正体が、今回構成図に加わる[[blue:境界ルータ]]。社内とインターネットの境目に立つルータです。',
        },
        {
          kind: 'text',
          text: '境界ルータの外側には、世界で通用する[[blue:グローバルIP]]（203.0.113.1）が付きます。その先はISP（接続事業者）の網を経て、世界中のネットワークへ。まずは全体図で、境界の位置を確かめましょう。',
        },
        { kind: 'figure', figure: overviewFigure },
        {
          kind: 'callout',
          tone: 'info',
          title: '境界は、これから主役になる場所',
          body: '社内と社外の境目は、ネスペ午後で最もよく問われる場所。第9章ではこの境界にファイアウォールが入り、内部/DMZ/外部の三層になります。いまは「社内の出口は境界ルータ」とだけ押さえれば十分です。',
        },
      ],
    },
    {
      heading: 'プライベートIPとグローバルIP',
      blocks: [
        {
          kind: 'text',
          text: 'IPアドレスには2種類あります。組織の中で自由に使ってよい[[blue:プライベートIP]]と、世界で1つだけの[[blue:グローバルIP]]。プライベートに使える範囲は、次の3つに決まっています。',
        },
        { kind: 'figure', figure: ipTypeFigure },
        {
          kind: 'text',
          text: 'ポイントは、プライベートIPが「どの組織でも同じ番号を使ってよい」こと。世界中に 192.168.10.10 は無数にあるので、この住所のままインターネットに出ても、応答は帰ってこられません。',
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: '実は、第1章からずっとプライベートIP',
          body: '内部LAN（192.168.10.0/24）もサーバLAN（172.16.0.0/24）も、プライベートの範囲内。IPv4の住所は全部で約43億個と足りないため、社内はプライベートでまかない、外に出るときだけ橋渡しするのが定石です。その橋渡しが次のNAT。住所を根本から増やす解決策は、第15章のIPv6で扱います。',
        },
      ],
    },
    {
      heading: '境界で送信元を書き換えるNAT・NAPT',
      blocks: [
        {
          kind: 'text',
          text: 'プライベートIPのまま、外には出られません。そこで[[blue:境界ルータ]]が、出ていく通信の[[blue:送信元IPとポート番号]]を、自分のグローバルIPと空きポートに書き換えます。IPだけを1対1で変換する仕組みが[[blue:NAT]]、ポートも使って多数の通信を1つのグローバルIPで共有させる方式が[[blue:NAPT]]（IPマスカレードとも呼びます）です。',
        },
        {
          kind: 'text',
          text: '書き換えた対応は[[blue:変換表]]に記録します。戻ってきた応答は変換表を引き、あて先を元の社内IP:ポートへ[[blue:書き戻し]]。この往復の対応づけがNAPTの心臓部です。なお図では 192.168.10.10:51000 のように、IPアドレスとポート番号をコロンでつないで書きます。',
        },
        { kind: 'figure', figure: naptFigure },
        {
          kind: 'text',
          text: 'そして、これが第1章からの伏線「あて先IPは基本変わらない」の[[blue:例外]]です。境界のNATだけは、IPアドレスそのものを書き換えます。',
        },
        {
          kind: 'callout',
          tone: 'warn',
          title: '外から始まる通信は、そのままでは入れない',
          body: '変換表の行は、社内から出た通信が作ります。外から勝手に始まる通信は対応する行が無く、境界で行き止まり。公開サーバのように外から受けたい場合は、固定の対応をあらかじめ書く[[blue:静的NAT]]（ポートフォワーディング）を使います。いまは名前だけ押さえて、第9章の公開サーバ（DMZ）で本格的に扱います。',
        },
      ],
    },
    {
      heading: 'ASどうしをBGPでつなぐインターネット',
      blocks: [
        {
          kind: 'text',
          text: 'ここまで「インターネット」とひとつの雲で描いてきましたが、その中身は[[blue:AS（自律システム）]]の集まり。ASは、ISPや大きな組織といった「1つの組織のネットワークのかたまり」です。',
        },
        {
          kind: 'text',
          text: 'AS同士は、「このネットワークあてなら、うちを通れば届く」という経路情報を[[blue:BGP]]で教え合います。第7章のOSPFが社内の地図を作ったように、BGPは世界の地図を作る仕組み。自社はというと、境界ルータを契約ISPのASにつなぎ、外あてを全部任せるだけです。',
        },
        { kind: 'figure', figure: bgpFigure },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'AS番号・BGPは「名前だけ」',
          body: '図のAS 64500などの番号は例示で、暗記は不要。「インターネットはASの集まり」「AS間の経路交換がBGP」「自社は契約ISPのASにつなぐ」。午後の読解には、この3点で十分です。',
        },
      ],
    },
    {
      heading: '午後問題では「変換表を読んで通信を追う」',
      blocks: [
        {
          kind: 'text',
          text: '午後の定番は、NAPTの[[blue:変換表を読ませる問題]]。ある通信の送信元/あて先が、境界の前後でどう変わるかを追います。ここで効くのが、行きと戻りの対称性です。',
        },
        { kind: 'figure', figure: natDirectionFigure },
        {
          kind: 'text',
          text: '外から公開サーバあての通信（静的NATの出番）では、[[blue:戻り経路]]、つまり応答がどの経路で・どの住所で帰るかも問われます。公開サーバの置き場所（DMZ）とあわせて、第9章で完成させます。',
        },
        {
          kind: 'check',
          label: '設問例',
          items: [
            {
              question: 'NAPTの変換表に「192.168.10.10:51000 → 203.0.113.1:62000」の行があるとき、社外Webサーバが受信したパケットの送信元IPアドレスとポート番号は何か。',
              answer: '203.0.113.1:62000。行き（社内→社外）では送信元が書き換わり、相手に見えるのは境界ルータの外側の住所だけです。',
            },
          ],
        },
      ],
    },
  ],
  takeaways: [
    '社内で使うのは[[blue:プライベートIP]]（10.0.0.0/8・172.16.0.0/12・192.168.0.0/16）、世界で通用するのは[[blue:グローバルIP]]。プライベートのままでは外に出られません。',
    '[[blue:NAPT]]は境界で送信元IP:ポートをグローバルへ書き換え、[[blue:変換表]]で戻りのあて先を書き戻します。ポートの違いで、多数のPCが1つのグローバルIPを共有。',
    '第1章の「あて先IPは基本変わらない」の例外が[[blue:NAT]]。行きは送信元・戻りはあて先が書き換わります（午後頻出）。',
    'インターネットは[[blue:AS]]（組織ごとのネットワークのかたまり）の集まりで、AS間の経路交換が[[blue:BGP]]。名前と役割だけで十分です。',
    '外から始まる通信は変換表に無く、そのままでは入れません。公開サーバに使う[[blue:静的NAT]]は、第9章のDMZとセットで扱います。',
  ],
  checks: [
    {
      question: 'プライベートIPの3つの範囲は？',
      answer: '10.0.0.0/8・172.16.0.0/12・192.168.0.0/16。',
    },
    {
      question: 'NAPTで、多数のPCが1つのグローバルIPを共有できる鍵は何か。',
      answer: 'ポート番号。境界ルータが通信ごとに別のポートへ書き換え、変換表で対応づけます。',
    },
    {
      question: '社外から始まる通信が、NAPTの境界をそのままでは越えられないのはなぜか。',
      answer: '変換表に対応する行が無いから。外から受けたい公開サーバには静的NATを使います（第9章）。',
    },
  ],
}
