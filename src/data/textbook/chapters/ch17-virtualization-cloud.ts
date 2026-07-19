import type { AddressTableFigure, EncapFigure, PacketFlowFigure, TextbookChapter, Topology, VmHostFigure } from '../types'

// 第17章 仮想化・クラウド（SDN・VXLAN・EVPN）。第5章VLAN・第12章オーバーレイの発展。
// サーバ仮想化(VM/仮想スイッチ)→クラウド(VPC)→物理を意識しない論理ネット(VXLAN)→制御の集中(SDN/EVPN)。
// 第1章カプセル化・第12章トンネルの集大成。台帳の クラウドVPC 10.0.0.0/16 を追加。

// §2 サーバ仮想化の入れ子（新図 vm-host）。1台の物理サーバに複数VM＋仮想スイッチ＋ハイパーバイザ。
// 動き: VMどうしの通信（VM1→仮想スイッチ→VM2）／外への通信（VM1→仮想スイッチ→物理NW）を光らせる。
const vmHostFigure: VmHostFigure = {
  kind: 'vm-host',
  id: 'ch17-vm-host',
  title: '1台の物理サーバの上で動く複数のVM',
  caption: '1台の物理サーバの中で、3つのVMが[[emerald:仮想スイッチ]]でつながる様子です。',
  takeaway: '仮想スイッチは、物理のL2スイッチと同じ役割です。VMも特別ではなく、ふつうの端末として通信します。',
  hostLabel: '物理サーバ 1台',
  switchLabel: '仮想スイッチ',
  switchSub: 'VMどうしをつなぐ',
  hypervisorLabel: 'ハイパーバイザ',
  hypervisorSub: '1台の物理を複数のVMに分ける土台',
  uplinkLabel: '物理ネットワークへ',
  vms: [
    { id: 'vm1', label: 'VM1', sub: '10.0.0.11' },
    { id: 'vm2', label: 'VM2', sub: '10.0.0.12' },
    { id: 'vm3', label: 'VM3', sub: '10.0.0.13' },
  ],
  steps: [
    { active: [], explanation: '物理サーバ1台の上で、3つのVMが同時に動いています。' },
    { active: ['vm1', 'switch', 'vm2'], explanation: '同じサーバ内のVMどうしは、仮想スイッチを通って通信します。' },
    { active: ['vm1', 'switch', 'hv', 'uplink'], explanation: '外へ出る通信も、仮想スイッチを通って物理ネットワークへ抜けます。' },
  ],
}

// §3 VXLANの二重カプセル化（encap 前→後）。元フレーム→UDP＋VXLAN→新IP。IPsec(第12章)と同じ levels の形。
const vxlanEncap: EncapFigure = {
  kind: 'encap',
  id: 'ch17-vxlan-encap',
  title: '元フレームを包むVXLANの二重の包み',
  caption: '外側から[[violet:新IP]]→[[amber:UDP＋VXLAN]]→[[emerald:元フレーム]]と、パケットが入れ子になっています。',
  takeaway: '包んだ順の逆にたどって外せば、元のフレームに戻ります。外し方は、包んだ順と対称です。',
  dataLabel: '元のIP＋データ',
  levels: [
    { unit: '外側のIPパケット', layerLabel: '新IP', header: '新IPヘッダ', tone: 'violet' },
    { unit: 'VXLANパケット', layerLabel: 'UDP＋VXLAN', header: 'UDP＋VNI', tone: 'amber' },
    { unit: '元のイーサネットフレーム', layerLabel: 'イーサネット', header: 'MACヘッダ', tone: 'emerald' },
  ],
}

// §3 拠点→クラウドへVXLANで運ぶ旅（graph tunnel 再利用＋tunnelBandLabelでVXLAN向けに文言差し替え）。
// 拠点ルータ(VTEP)—[VXLANトンネル]—クラウド、端末は各出入口の下。外側/中身の二重IPを bubbles で段階表示。
const vxlanTunnelTopology: Topology = {
  layout: 'graph',
  tunnel: true,
  tunnelNote: 'VXLANトンネル（物理網の上）',
  tunnelBandLabel: { main: 'VXLANで包む', sub: '元フレームを丸ごと' },
  zones: [],
  nodes: [
    { id: 'site', label: '拠点ルータ', role: 'router', sub: 'VXLANの出入口' },
    { id: 'cloud', label: 'クラウド', role: 'cloud', sub: 'VPC 10.0.0.0/16' },
    { id: 'srv', label: '拠点のサーバ', role: 'server', sub: '10.0.0.20' },
    { id: 'vm', label: 'クラウドのVM', role: 'server', sub: '10.0.0.11' },
  ],
  links: [
    { a: 'srv', b: 'site' },
    { a: 'site', b: 'cloud' },
    { a: 'cloud', b: 'vm' },
  ],
}

const vxlanTunnelFigure: PacketFlowFigure = {
  kind: 'packet-flow',
  id: 'ch17-vxlan-tunnel',
  title: '拠点からクラウドへVXLANで運ぶ',
  caption: '拠点で[[violet:包み]]、物理網を渡り、クラウドで[[blue:開き]]ます。外側と中身を見分けます。',
  takeaway: '外側は出入口どうしの住所、中身が元のフレーム。第12章のIPsecが暗号で守るなら、VXLANは論理L2を延ばすカプセル化です。',
  topology: vxlanTunnelTopology,
  hideHeaders: true,
  steps: [
    {
      focus: { type: 'link', a: 'srv', b: 'site' },
      bubbles: ['宛先 クラウドVM 10.0.0.11'],
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: '拠点のサーバが、同じ論理ネットのクラウドのVMあてにフレームを送ります。',
    },
    {
      focus: { type: 'node', id: 'site' },
      bubbles: ['外側 クラウドの出入口あて', '中身 元フレーム（VMあて）'],
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: '拠点ルータが元フレームをVXLANで包み、外側IPで送り出します。',
    },
    {
      focus: { type: 'link', a: 'site', b: 'cloud' },
      bubbles: ['外側 クラウドの出入口あて', '中身 元フレーム（VMあて）'],
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: '物理網（アンダーレイ）を渡ります。中の元フレームは外側IPに隠れています。',
    },
    {
      focus: { type: 'node', id: 'cloud' },
      bubbles: ['中身 元フレーム（取り出し）'],
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: 'クラウドの出入口が外側の包みを外し、中の元フレームを取り出します。',
    },
    {
      focus: { type: 'link', a: 'cloud', b: 'vm' },
      bubbles: ['宛先 クラウドVM 10.0.0.11'],
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: 'クラウドのVMへ元フレームが到達。離れていても同じLANのように届きます。',
    },
  ],
}

// §4 SDN: 従来 vs SDN の対比（address-table 再利用・fieldLabelsで制御/転送/設定変更に差し替え）。
const sdnTable: AddressTableFigure = {
  kind: 'address-table',
  id: 'ch17-sdn',
  title: '従来のネットワークとSDNのちがい',
  caption: '[[blue:制御]]（決める役）と[[blue:転送]]（送る役）を分け、制御を集中させる考え方の対比です。',
  takeaway: '従来は各機器がばらばらに判断していました。SDNはコントローラが集中して決め、変更を一気に反映できます。',
  fieldLabels: { carries: '制御（経路を決める）', scope: '転送（実際に送る）', example: '設定変更のしやすさ' },
  rows: [
    { name: '従来のネットワーク', layer: '分散', carries: '各機器が自分で判断', scope: '各機器が自分で転送', example: '台数が増えると手間', tone: 'slate' },
    { name: 'SDN', layer: '集中', carries: 'コントローラが集中して決定', scope: '機器は指示どおり転送', example: 'まとめて素早く変更', tone: 'blue' },
  ],
}

export const ch17VirtualizationCloud: TextbookChapter = {
  id: 'virtualization-cloud',
  order: 17,
  title: '仮想化・クラウド（SDN・VXLAN・EVPN）',
  summary:
    'サーバの仮想化で1台の物理サーバに複数のVMを動かし、クラウドではVPCという専用の仮想ネットワークを使います。物理網の上に論理ネットワークを重ねるVXLANは、元のイーサネットフレームをUDP/IPで包んで運ぶオーバーレイで、第5章のVLANを大きく広げ、第12章のトンネルの発展形にあたります。制御を集中させるSDNまで、仮想化とクラウドの土台を一望します。',
  status: 'published',
  estimatedMinutes: 16,
  intro: [
    {
      kind: 'text',
      text: 'ここまで見てきた構成図は、どれも物理の機器を1つずつ置いたものでした。この章で扱うのは、サーバもネットワークも[[blue:ソフトウェアで作る]]世界です。物理の台数や配線に縛られず、必要な機器やネットワークを、必要なだけ論理的に用意できます。',
    },
    {
      kind: 'text',
      text: '登場するのは、サーバ仮想化とクラウド（[[emerald:VPC]]）、物理を意識しない論理ネットワークを作る[[blue:VXLAN]]、そしてまとめて制御する[[blue:SDN]]です。第1章の[[blue:カプセル化]]、第5章の[[blue:VLAN]]、第12章の[[blue:トンネル]]が、ここで一気に効いてきます。',
    },
  ],
  sections: [
    {
      heading: '1台の物理サーバに複数の仮想マシンを動かす',
      blocks: [
        {
          kind: 'text',
          text: 'サーバの仮想化とは、1台の物理サーバの上で複数の[[blue:仮想マシン（VM）]]を同時に動かす技術です。1棟の建物をいくつもの部屋に区切って別々の世帯が暮らすように、土台の[[blue:ハイパーバイザ]]が物理サーバのCPUやメモリを分け合い、それぞれのVMが独立した1台のサーバのようにふるまいます。',
        },
        {
          kind: 'text',
          text: 'VMどうしは、物理サーバの中の[[emerald:仮想スイッチ]]でつながります。ここが大事な点で、VMも物理PCと同じく自分のIPアドレスとMACアドレスを持つ、1つの[[blue:端末]]です。',
        },
        { kind: 'figure', figure: vmHostFigure },
        {
          kind: 'text',
          text: 'この仮想化を通信事業者が大規模に提供するのが[[blue:クラウド]]です。利用者ごとに区切られた専用の仮想ネットワークを[[emerald:VPC]]（Virtual Private Cloud）と呼びます。自社専用に、好きなアドレス（ここでは[[emerald:10.0.0.0/16]]）で仮想的なネットワークを組めます。',
        },
        {
          kind: 'callout',
          tone: 'info',
          title: '構成図にクラウドのVPCが加わります',
          body: 'これまで社内とインターネットだけだった構成図に、[[emerald:クラウドのVPC（10.0.0.0/16）]]が加わります。VPCの中では、いま見たVMが動いています。次は、この離れたVPCと拠点を、物理を意識せずにつなぐ方法を見ていきます。',
        },
      ],
    },
    {
      heading: '物理網の上に論理ネットワークを重ねるVXLAN',
      blocks: [
        {
          kind: 'text',
          text: '離れた拠点とクラウドを、まるで同じ社内LANのようにつなぎたいとき、使うのが[[blue:VXLAN]]です。物理的なIPネットワーク（[[slate:アンダーレイ]]）の上に、論理的なネットワーク（[[violet:オーバーレイ]]）を重ねる技術です。',
        },
        {
          kind: 'text',
          text: 'やり方は第1章の[[blue:カプセル化]]の応用です。元の[[emerald:イーサネットフレーム]]を丸ごと、[[amber:UDP]]（4789番）と新しい[[violet:IP]]で包んで運びます。第12章のIPsecが「IPパケットを暗号で包む」なら、VXLANは「イーサネットフレームをUDPで包む」ものです。',
        },
        { kind: 'figure', figure: vxlanEncap },
        {
          kind: 'text',
          text: '包んだパケットは、拠点とクラウドの[[blue:出入口]]（VTEPと呼びます）の間を、物理網の上の普通の通信として流れます。受け取った側が包みを外せば、中から元のフレームが出てきて、同じLANのように相手へ届きます。',
        },
        { kind: 'figure', figure: vxlanTunnelFigure },
        {
          kind: 'text',
          text: 'このしくみの利点は、離れた拠点とクラウドを、1つのネットワークのように扱えることです。[[emerald:拠点のサーバ]]（10.0.0.20）と[[emerald:クラウドのVM]]（10.0.0.11）は、物理的に離れていても、同じアドレス帯（10.0.0.0/16）の仲間として直接やり取りできます。物理の配線を引き直さずに、ネットワークをソフトウェアで広げられます。',
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'VXLANはVLANの大きな拡張版',
          body: '第5章の[[blue:VLAN]]は12ビットの番号で、区別できるのは約4千まででした。VXLANは[[blue:VNI]]という24ビットの番号を使い、約[[blue:1600万]]の論理ネットワークを区別できます。大規模なクラウドでも足りるように、けた違いに増やしたものです。なお、VXLAN自体は暗号化しません。秘匿が必要なら、第12章の[[rose:IPsec]]と組み合わせます。',
        },
      ],
    },
    {
      heading: 'SDNは制御と転送を分けて集中管理する',
      blocks: [
        {
          kind: 'text',
          text: 'ネットワークが大きくなると、機器を1台ずつ設定するのは大変です。そこで、通信の[[blue:制御]]（どの経路へ送るかを決めること）と[[blue:転送]]（実際にパケットを送ること）を分け、制御を1か所に集める考え方が[[blue:SDN]]（Software Defined Networking）です。',
        },
        {
          kind: 'text',
          text: '[[blue:コントローラ]]と呼ばれる中心が、オーケストラの指揮者のように経路の方針をまとめて決め、各機器へ配ります。機器は、受け取った指示どおりに転送するだけです。設定の変更を、まとめて素早く行えます。',
        },
        { kind: 'figure', figure: sdnTable },
        {
          kind: 'callout',
          tone: 'info',
          title: 'EVPNは名前だけ押さえれば十分です',
          body: 'VXLANで「どのMACアドレスがどの出入口の先にいるか」を配る制御の仕組みを[[blue:EVPN]]と呼びます。VXLANが「運ぶ」役、EVPNが「居場所を配る」役という分担です。細かい中身まで覚える必要はなく、名前と役割だけ押さえれば十分です。',
        },
      ],
    },
    {
      heading: '午後はクラウド接続とオーバーレイを問う',
      blocks: [
        {
          kind: 'text',
          text: '午後では、拠点と[[blue:クラウドの接続]]、[[violet:オーバーレイ]]（VXLAN）で何がどう運ばれるか、[[emerald:VPC]]と拠点のアドレス設計が問われます。とくに、VXLANで運ばれるとき「外側のIPは出入口どうし、中身は元のフレーム」という二重の構造を読み解けるかが要点です。',
        },
        {
          kind: 'check',
          label: '設問例',
          items: [
            {
              question:
                '拠点のサーバが、VXLANでつないだクラウドのVM（10.0.0.11）あてに通信します。物理網（アンダーレイ）を流れているとき、パケットの外側の宛先IPアドレスは、何を指すか。',
              answer:
                'クラウド側の出入口（VTEP）のIPアドレスです。元の宛先である10.0.0.11は、VXLANで包まれた内側にあり、アンダーレイ上では外側の出入口どうしのIPだけが見えます。第12章のIPsecと同じく、外側と内側を分けて読むことが大切です。',
            },
          ],
        },
        {
          kind: 'text',
          text: '「クラウドのサーバにつながらない」の切り分けでは、拠点とクラウドの[[blue:出入口]]の間（アンダーレイ）が通じているか、VXLANの[[blue:VNI]]が両側で一致しているか、[[emerald:VPC]]側のアドレスやルートが正しいか。物理と論理を分けて、順にたどることが近道です。',
        },
      ],
    },
  ],
  takeaways: [
    'サーバ仮想化は、1台の物理サーバの上で複数の[[blue:VM]]を動かす技術。VMも物理PCと同じくIP・MACを持つ端末です。',
    'クラウドの[[emerald:VPC]]は、利用者ごとに区切られた専用の仮想ネットワークです。',
    '[[blue:VXLAN]]は物理網（アンダーレイ）の上に論理ネットワークを重ね、元のイーサネットフレームをUDP/IPで[[violet:包んで運ぶ]]オーバーレイです。',
    'VXLANは[[blue:VNI]]（24ビット・約1600万）でVLAN（約4千）を大きく広げます。暗号化はしないので、秘匿には第12章の[[rose:IPsec]]を併用します。',
    '[[blue:SDN]]は制御（決める）と転送（送る）を分け、コントローラが集中して管理する考え方。EVPNはVXLANの居場所を配る制御で、名前だけ押さえれば十分です。',
  ],
  checks: [
    {
      question: 'VXLANは、元のイーサネットフレームをどのように運ぶか。VLANと比べて何が大きく違うか。',
      answer:
        '元のイーサネットフレームを丸ごとUDPと新しいIPで包み、物理網の上を普通の通信として運びます。VLANが12ビットで約4千しか区別できないのに対し、VXLANはVNI（24ビット）で約1600万を区別でき、大規模なクラウドに対応します。',
    },
    {
      question: 'クラウドのVPCとは何か。',
      answer:
        'クラウドの中に、利用者ごとに区切って割り当てられる専用の仮想ネットワークです。自社専用のアドレス（例：10.0.0.0/16）で、物理を意識せずにサーバ（VM）を並べられます。',
    },
    {
      question: 'SDNの「制御と転送の分離」とは、どういうことか。',
      answer:
        '経路を決める制御を各機器から切り離し、コントローラが集中して受け持つことです。機器は指示どおりに転送するだけになり、設定変更をまとめて素早く行えます。',
    },
  ],
}
