import type { PacketFlowFigure, RecordTableFigure, TextbookChapter, TimelineFigure, Topology } from '../types'

// 第11章 冗長化・可用性・更改作業。第10章でサーバはLBで複数台になった。次は、その手前の
// 境界ルータ・FW・LB自身が1台ずつ＝単一障害点（SPOF）を、二重化して「止まらない」構成にする。
// VRRP（仮想IPをアクティブ/スタンバイで引き継ぐ）→ LAG（リンクを束ねる）→ 無停止更改。
// 第1章のデフォルトGW（＝仮想IP、中身が切替わる）を回収する。

// §1 SPOF: 第10章までの一直線（社外→境界ルータ→FW→LB→Webプール）。1台stackで縦に並べ、故障を down 表示。
const spofTopology: Topology = {
  layout: 'graph',
  stack: true,
  zones: [{ id: 'dmz', label: 'DMZ', tone: 'amber' }],
  nodes: [
    { id: 'inet', label: 'インターネット', role: 'internet' },
    { id: 'br', label: '境界ルータ', role: 'router', sub: '外側 203.0.113.1' },
    { id: 'fw', label: 'FW', role: 'firewall', sub: 'ファイアウォール' },
    { id: 'lb', label: 'LB', role: 'lb', sub: 'VIP 172.16.0.10' },
    { id: 'web1', label: 'Webサーバ1', role: 'server', zoneId: 'dmz', sub: '172.16.0.20' },
    { id: 'web2', label: 'Webサーバ2', role: 'server', zoneId: 'dmz', sub: '172.16.0.21' },
  ],
  links: [
    { a: 'inet', b: 'br' },
    { a: 'br', b: 'fw' },
    { a: 'fw', b: 'lb' },
    { a: 'lb', b: 'web1' },
    { a: 'lb', b: 'web2' },
  ],
}

const spofFigure: PacketFlowFigure = {
  kind: 'packet-flow',
  id: 'ch11-spof',
  title: '単一障害点——1台の故障で全体が停止',
  caption: '機器を1台[[red:止める]]と、その先がまとめて届かなくなる様子です。',
  takeaway: 'そこが1個だと全体が止まる箇所が[[red:単一障害点（SPOF）]]。これを1つずつ無くすのがこの章です。',
  topology: spofTopology,
  hideHeaders: true,
  steps: [
    {
      focus: { type: 'link', a: 'inet', b: 'br' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: '第10章までの構成です。社外からWebへは、境界ルータ・FW・LBを1台ずつ通ります。',
    },
    {
      focus: { type: 'node', id: 'fw' },
      downNodes: ['fw'],
      blockedLink: { a: 'br', b: 'fw' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: 'この中のFWが1台壊れると、通信はここで止まり、背後のLBやWebサーバにも届きません。',
    },
    {
      focus: { type: 'node', id: 'br' },
      downNodes: ['br'],
      blockedLink: { a: 'inet', b: 'br' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: '境界ルータでも同じです。1台しかない機器はどれも、単一障害点（SPOF）になります。',
    },
  ],
}

// §2 VRRP: 内部LANの出口（デフォルトGW）を2台ペアに。仮想IP 192.168.10.1 を共有し、故障でスタンバイが引き継ぐ。
const vrrpTopology: Topology = {
  layout: 'graph',
  pair: true,
  vip: '192.168.10.1',
  zones: [{ id: 'lan', label: '内部LAN', tone: 'sky' }],
  nodes: [
    { id: 'inet', label: 'インターネット', role: 'internet' },
    { id: 'r1', label: 'ルータ1', role: 'router', sub: '実IP .2' },
    { id: 'r2', label: 'ルータ2', role: 'router', sub: '実IP .3' },
    { id: 'pc', label: '業務PC', role: 'pc', zoneId: 'lan', sub: 'GW＝仮想IP' },
  ],
  links: [
    { a: 'inet', b: 'r1' },
    { a: 'inet', b: 'r2' },
    { a: 'r1', b: 'pc' },
    { a: 'r2', b: 'pc' },
  ],
}

const vrrpFigure: PacketFlowFigure = {
  kind: 'packet-flow',
  id: 'ch11-vrrp',
  title: '仮想IPを引き継ぐ2台構成（VRRP）',
  caption: '稼働側の[[red:故障]]で、共有する[[blue:仮想IP]]が待機側へ移る様子です。',
  takeaway: '大事なのは、端末のGWが[[blue:仮想IPのまま]]という点。中身が切替わっても、PCは何も変えません。',
  topology: vrrpTopology,
  hideHeaders: true,
  steps: [
    {
      focus: { type: 'node', id: 'r1' },
      pairActive: 'r1',
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: '出口のルータを2台に。ふだんは稼働側のルータ1が、仮想IP 192.168.10.1 を受け持ちます。',
    },
    {
      focus: { type: 'link', a: 'pc', b: 'r1' },
      pairActive: 'r1',
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: '業務PCはGWの仮想IPあてに送るだけ。通信は稼働側のルータ1を通って外へ出ます。',
    },
    {
      focus: { type: 'node', id: 'r2' },
      downNodes: ['r1'],
      pairActive: 'r2',
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: 'ルータ1が故障。待機のルータ2が同じ仮想IPを引き継ぎ、稼働側に切替わります。',
    },
    {
      focus: { type: 'link', a: 'pc', b: 'r2' },
      downNodes: ['r1'],
      pairActive: 'r2',
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: 'PCのGWは仮想IPのまま。中身のルータが替わるだけで、設定変更なしに通信を続けられます。',
    },
  ],
}

// §3 LAG: L2SWと上位ルータ間の2リンクを束ねて1本の論理リンクに。片方故障でも残りが運ぶ。
const lagTopology: Topology = {
  layout: 'graph',
  bundle: true,
  bundleNote: '束ねて1本の論理リンク',
  bundleBandwidth: { full: '帯域 1G×2＝2Gビット/秒', reduced: '帯域 1Gビット/秒（半分）' },
  zones: [],
  nodes: [
    { id: 'sw', label: 'L2SW', role: 'switch' },
    { id: 'rt', label: 'ルータ', role: 'router' },
  ],
  links: [
    { a: 'sw', b: 'rt' },
    { a: 'sw', b: 'rt' },
  ],
}

const lagFigure: PacketFlowFigure = {
  kind: 'packet-flow',
  id: 'ch11-lag',
  title: '2本を束ねた1本の論理リンク（LAG）',
  caption: '束ねた[[blue:2本]]のうち[[red:1本]]が切れても、残りで通信が続く様子です。',
  takeaway: '束ねると[[blue:帯域が増え]]、[[red:1本故障]]でも継続。ただし帯域は半分になります。',
  topology: lagTopology,
  hideHeaders: true,
  steps: [
    {
      focus: { type: 'link', a: 'sw', b: 'rt' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: 'L2SWと上位ルータの間を2本のリンクで結び、束ねて1本の論理リンクにします。',
    },
    {
      focus: { type: 'link', a: 'sw', b: 'rt' },
      blockedLink: { a: 'sw', b: 'rt' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: '片方のリンクが切れても、残る1本がそのまま通信を運び続けます。',
    },
  ],
}

// §4 無停止更改: 冗長があるから片系ずつ切離→更改→戻す。全項目を俯瞰する timeline。
const updateFigure: TimelineFigure = {
  kind: 'timeline',
  id: 'ch11-update',
  title: '片系ずつ入れ替える無停止更改',
  caption: '冗長ペアなら、[[blue:片系ずつ]]切り離して交換し、[[blue:止めずに]]機器を入れ替えられます。',
  takeaway: '手順は[[blue:切り離し→更改→戻す]]を、2台に順番に。サービスは動いたままです。',
  items: [
    { badge: '①', label: '待機側の切り離し', detail: '冗長ペアの待機側（スタンバイ）を通信から外します。稼働側だけで運用を続けます。' },
    { badge: '②', label: '機器の更改', detail: '外した機器を交換・設定更新します。この間も、もう片方が通信を継続。' },
    { badge: '③', label: '戻して正常確認', detail: '更改した機器を戻し、正しく動くかを確認します。' },
    { badge: '④', label: 'もう片側の更改', detail: '稼働と待機を入れ替え、もう片方も同じ手順で更改。両系がそろって完了です。' },
  ],
}

// §5 午後: どこを・どう冗長化するかの一覧。対策列を強調。
const summaryTable: RecordTableFigure = {
  kind: 'record-table',
  id: 'ch11-summary',
  title: 'どこを・どう冗長化するか',
  caption: '主要な箇所ごとに、[[red:単一だと止まる]]理由と、[[blue:冗長化の方法]]を対応させます。',
  takeaway: '午後では、まず[[red:SPOF]]を指摘し、[[blue:VRRP・LAG・複数経路・LB]]のどれで守るかを答えます。',
  rowHeader: true,
  emphasizeKey: 'how',
  columns: [
    { key: 'part', label: '対象' },
    { key: 'spof', label: '単一だと（SPOF）' },
    { key: 'how', label: '冗長化の方法' },
  ],
  rows: [
    { part: '境界ルータ・GWルータ', spof: '壊れると外部との往復が停止', how: '2台ペア＋VRRP（仮想IPの引継ぎ）' },
    { part: '機器間のリンク', spof: '1本切れると経路が断絶', how: 'LAGで複数リンクを集約' },
    { part: 'ルータ間の経路', spof: '片経路が切れると迂回不可', how: 'OSPFで複数経路（第7章）' },
    { part: '公開サーバ', spof: '1台落ちるとサービス停止', how: 'LBで複数台に分散（第10章）' },
  ],
}

export const ch11Availability: TextbookChapter = {
  id: 'availability',
  order: 11,
  title: '冗長化・可用性・更改作業',
  summary:
    '1台壊れたら止まる構成を、二重化で止まらなくします。単一障害点（SPOF）を無くすVRRP（仮想IPをアクティブ／スタンバイで引き継ぐ）、リンクを束ねるLAG、そして冗長があるから止めずに機器を入れ替えられる無停止更改を扱います。',
  status: 'published',
  estimatedMinutes: 16,
  intro: [
    {
      kind: 'text',
      text: '第10章で、公開サーバは[[blue:LB]]によって複数台になりました。これはサーバの冗長化の一種です。ところが、その手前にある[[blue:境界ルータ・FW・LB]]自身が1台ずつなら、そこが壊れると全体が止まってしまいます。',
    },
    {
      kind: 'text',
      text: 'この章では「1台壊れたら止まる」構成を、[[blue:二重化]]して「止まらない」にします。機器を冗長ペアにする[[blue:VRRP]]、リンクを束ねる[[blue:LAG]]、そして止めずに機器を入れ替える[[blue:無停止更改]]を、順に見ていきます。',
    },
  ],
  sections: [
    {
      heading: '単一障害点（SPOF）とは',
      blocks: [
        {
          kind: 'text',
          text: 'ここまでの構成は、境界ルータ・FW・LBが[[blue:1台ずつ]]の一本道でした。便利に動いている間は問題ありません。ただ、どれか1台が壊れた瞬間に、その先へは通信がまったく届かなくなります。',
        },
        { kind: 'figure', figure: spofFigure },
        {
          kind: 'callout',
          tone: 'warn',
          title: 'そこが1個だと全体が止まる箇所',
          body: 'このように、[[red:1台だけ]]しかなく、壊れると全体が止まってしまう箇所を[[red:単一障害点（SPOF：Single Point Of Failure）]]と呼びます。可用性を上げる基本は、このSPOFを1つずつ見つけて[[blue:二重化]]し、無くしていくことです。',
        },
      ],
    },
    {
      heading: '機器の冗長化とVRRP',
      blocks: [
        {
          kind: 'text',
          text: 'まずはルータやFWのような機器の二重化です。同じ役割の機器を[[blue:2台]]用意し、ふだんは片方を[[blue:アクティブ（稼働中）]]、もう片方を[[blue:スタンバイ（待機）]]にします。',
        },
        {
          kind: 'text',
          text: 'ここで問題になるのが、端末が向ける[[blue:あて先]]です。端末はデフォルトゲートウェイに固定のIPを設定しています。2台のどちらか一方の実IPを書いてしまうと、その機器が壊れたときに通信できません。',
        },
        {
          kind: 'text',
          text: 'そこで使うのが[[blue:VRRP]]です。2台で[[blue:仮想IP（VIP）]]という共通のIPを1つ持ち合い、稼働側がその仮想IPを受け持ちます。端末は、この[[blue:仮想IP]]をデフォルトゲートウェイに設定します。',
        },
        { kind: 'figure', figure: vrrpFigure },
        {
          kind: 'callout',
          tone: 'tip',
          title: '端末のGWは「仮想IP」のまま',
          body: '端末のデフォルトゲートウェイは、故障しても[[blue:仮想IPのまま]]。設定を変えずにすみます。第1章で設定した「デフォルトゲートウェイ＝外への出口」の正体が、この[[blue:中身が切替わる仮想IP]]です。似た仕組みに[[blue:HSRP]]もあります。名前だけ押さえれば十分です。',
        },
      ],
    },
    {
      heading: 'リンクの冗長化とLAG',
      blocks: [
        {
          kind: 'text',
          text: '機器を2台にしても、機器と機器をつなぐ[[blue:リンク（ケーブル）]]が1本だけなら、そこが切れると通信できません。リンクも冗長にします。',
        },
        {
          kind: 'text',
          text: '使うのが[[blue:LAG（リンクアグリゲーション）]]です。複数の物理リンクを[[blue:束ねて1本の論理リンク]]として扱います。ふだんは全部のリンクで運ぶので[[blue:帯域]]が増え、1本切れても残りが運ぶので[[blue:冗長]]にもなります。束ねる取り決めには[[blue:LACP]]を使います。',
        },
        { kind: 'figure', figure: lagFigure },
        {
          kind: 'callout',
          tone: 'info',
          title: '第5章のSTPとの違い',
          body: '第5章では、2本の冗長リンクをそのままつなぐとループになるため、[[blue:STP]]で片方を止めて1本にしました。[[blue:LAG]]は、複数リンクを[[blue:1本の論理リンク]]として束ねるので、ループにならずに[[blue:両方を同時に使えます]]。片方を止めるSTPに対し、両方を活かすのがLAGです。',
        },
        {
          kind: 'text',
          text: 'リンクだけでなく、[[blue:経路]]も冗長にできます。第7章で見たように、ルータ間に複数の経路があれば、片方が切れてももう片方へ[[blue:迂回（OSPF）]]します。リンクを束ねるのがLAG、経路を選び直すのがルーティングの冗長です。',
        },
      ],
    },
    {
      heading: '無停止で機器を入れ替える更改作業',
      blocks: [
        {
          kind: 'text',
          text: '冗長化には、もう1つ大きな利点があります。機器が2台あるので、[[blue:片方ずつ]]なら、サービスを[[blue:止めずに]]機器を交換・更新できます。これを[[blue:無停止更改]]と呼びます。',
        },
        { kind: 'figure', figure: updateFigure },
        {
          kind: 'callout',
          tone: 'warn',
          title: '更改中は冗長が一時的に無い',
          body: '片系を切り離している間は、稼働しているのが1台だけ＝[[red:冗長が一時的に無い状態]]です。ここでもう片方が壊れると止まってしまいます。この[[red:リスクの時間]]を短く、確実に済ませることが、更改作業のコツです。',
        },
      ],
    },
    {
      heading: '午後の着眼点——SPOFと切替',
      blocks: [
        {
          kind: 'text',
          text: '午後では、構成図を見て「どこが[[red:単一障害点]]か」を指摘させたり、「故障時にどう[[blue:切替わる]]か（VRRPの仕組み）」「切替にかかる[[blue:時間]]」を問うたりします。まずSPOFを探し、その対策を対応づけるのがコツです。',
        },
        { kind: 'figure', figure: summaryTable },
        {
          kind: 'check',
          label: '設問例',
          items: [
            {
              question:
                '業務PCのデフォルトゲートウェイ（192.168.10.1）を受け持つルータが1台故障したとき、通信を継続できるのはなぜか。また、PC側の設定変更は必要か。',
              answer:
                'スタンバイのルータがVRRPで同じ仮想IP（192.168.10.1）を引き継いでアクティブになるため、通信を継続できます。PCのデフォルトゲートウェイは仮想IPのままで、設定変更は不要です。',
            },
          ],
        },
        {
          kind: 'text',
          text: '離れた拠点を安全につなぐ[[blue:VPN・WAN]]は第12章、「誰が・何をしてよいか」を確かめる[[blue:認証・PKI]]は第13章で扱います。止まらない構成の考え方は、その土台になります。',
        },
      ],
    },
  ],
  takeaways: [
    '冗長化は[[red:単一障害点（SPOF）]]——そこが1個だと全体が止まる箇所——を無くすことです。',
    '[[blue:VRRP]]は仮想IPをアクティブ／スタンバイの2台で引き継ぐ仕組み。端末のGWは[[blue:仮想IP]]のままで、中身のルータが切替わります（第1章のデフォルトGW）。',
    '[[blue:LAG]]は複数の物理リンクを束ねて1本の論理リンクに。帯域を増やしつつ、冗長も確保します。',
    '冗長があれば、片系ずつ[[blue:無停止で更改]]（機器の交換・更新）ができます。',
  ],
  checks: [
    {
      question: '単一障害点（SPOF）とは、どのような箇所か。',
      answer: 'そこが1つだけで、壊れると全体が止まってしまう箇所のことです。冗長化は、このSPOFを無くすために行います。',
    },
    {
      question: 'VRRPで、アクティブなルータが故障したとき、端末のデフォルトゲートウェイの設定を変える必要があるか。',
      answer: '変える必要はありません。スタンバイが同じ仮想IPを引き継ぐため、端末は仮想IPをGWに指したままで通信を続けられます。',
    },
    {
      question: 'LAGでリンクを2本束ねているとき、そのうち1本が故障するとどうなるか。',
      answer: '残る1本が通信を運び続けます。帯域は半分になりますが、通信そのものは止まりません。',
    },
  ],
}
