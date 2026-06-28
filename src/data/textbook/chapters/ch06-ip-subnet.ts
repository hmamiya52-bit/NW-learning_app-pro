import type { PacketFlowFigure, RecordTableFigure, SubnetCalcFigure, TextbookChapter, Topology } from '../types'

// 第6章 第1章の「ネットワーク部で同一/別を判定」を正式化。IPの構造・サブネット・CIDR・VLSM。

const subnetFigure: SubnetCalcFigure = {
  kind: 'subnet-calc',
  id: 'ch6-subnet',
  title: 'IPはネットワーク部とホスト部に分かれる',
  caption: '各ビットの重み（上段）の、1のビットを足すと左の10進値。プレフィックスを伸ばすと境界が右へ動きます。',
  takeaway: 'マスク（プレフィックス）が境界。[[green:左がネットワーク部]]・[[slate:右がホスト部]]。先頭と末尾は端末に使えません。',
  ip: '192.168.10.100',
  steps: [
    {
      prefix: 24,
      note: '先頭24ビットがネットワーク部、残り8ビットがホスト部。1つのネットワークに254台まで入ります。',
    },
    {
      prefix: 26,
      note: 'マスクを26ビットに伸ばすと、ホスト部は6ビット。192.168.10.100 は .64〜.127 のネットワークに入り、62台までと小さくなります。',
    },
    {
      prefix: 27,
      note: '27ビットにすると .96〜.127 のネットワークで30台まで。マスクを伸ばすほど、ネットワークは小さく数は多くなります。',
    },
  ],
}

// 構成図の差分: 内部LANに加え2つ目のセグメント（別フロア 192.168.30.0/24）。別セグメント間はルータ（L3）。
const segmentTopology: Topology = {
  zones: [
    { id: 'uchi', label: '内部LAN 192.168.10.0/24', tone: 'sky' },
    { id: 'floor2', label: '別フロア 192.168.30.0/24', tone: 'emerald' },
  ],
  nodes: [
    { id: 'pc1', label: '業務PC', role: 'pc', zoneId: 'uchi', sub: '192.168.10.10' },
    { id: 'router', label: 'ルータ', role: 'router', sub: 'セグメント間を中継' },
    { id: 'pc2', label: '別フロアPC', role: 'pc', zoneId: 'floor2', sub: '192.168.30.10' },
  ],
  links: [
    { a: 'pc1', b: 'router' },
    { a: 'router', b: 'pc2' },
  ],
}

const segmentFlowFigure: PacketFlowFigure = {
  kind: 'packet-flow',
  id: 'ch6-segments',
  title: '複数のセグメントをルータがつなぐ',
  caption: '別のネットワーク（セグメント）へは、[[blue:ルータ（L3）]]を通って届きます。',
  takeaway: '別セグメント宛ては、ネットワーク部が違うのでルータ経由。詳しくは第7章。',
  topology: segmentTopology,
  steps: [
    {
      focus: { type: 'link', a: 'pc1', b: 'router' },
      packetLabel: 'パケット',
      headers: { l2: '宛先MAC = ルータ', l3: '宛先IP = 192.168.30.10' },
      explanation: '業務PCから別フロアPC（192.168.30.10）へ。ネットワーク部が違うので、まずルータへ渡します。',
    },
    {
      focus: { type: 'node', id: 'router' },
      packetLabel: '中継',
      headers: { l2: 'あて先MACを付け替え', l3: '宛先IP = 192.168.30.10（そのまま）' },
      status: { l2: 'change', l3: 'same' },
      explanation: 'ルータは宛先IPのネットワーク部（192.168.30.0/24）を見て、別フロア側へ中継します。',
    },
    {
      focus: { type: 'link', a: 'router', b: 'pc2' },
      packetLabel: 'パケット',
      headers: { l2: '宛先MAC = 別フロアPC', l3: '宛先IP = 192.168.30.10' },
      explanation: '別フロアのセグメントに到着。別セグメント間は、このようにL3（ルータ）を通ります。',
    },
  ],
}

const vlsmFigure: RecordTableFigure = {
  kind: 'record-table',
  id: 'ch6-vlsm',
  title: '必要な数に合わせて割り当てる（VLSM）',
  caption: '大きい部署は大きく、点対点リンクは[[blue:/30]]で2台ぶん。ムダなく分けます。',
  takeaway: '必要ホスト数に合う最小のネットワークを割り当て。これがVLSM（可変長サブネット）。',
  rowHeader: true,
  emphasizeKey: 'prefix',
  columns: [
    { key: 'seg', label: 'セグメント' },
    { key: 'need', label: '必要ホスト' },
    { key: 'prefix', label: '割当' },
    { key: 'range', label: '範囲' },
  ],
  rows: [
    { seg: '業務（大）', need: '100台', prefix: '/25（126台）', range: '192.168.10.0 〜 .127' },
    { seg: '管理', need: '50台', prefix: '/26（62台）', range: '192.168.10.128 〜 .191' },
    { seg: '別フロア', need: '20台', prefix: '/27（30台）', range: '192.168.30.0 〜 .31' },
    { seg: '拠点間リンク', need: '2台', prefix: '/30（2台）', range: '192.168.30.32 〜 .35' },
  ],
}

export const ch06IpSubnet: TextbookChapter = {
  id: 'ip-subnet',
  order: 6,
  title: 'IPアドレス設計とサブネット',
  summary: 'IPの構造・サブネット計算・CIDR・VLSMで、アドレス設計を読めるようにします。',
  status: 'published',
  estimatedMinutes: 20,
  intro: [
    {
      kind: 'text',
      text: '第1章で、PCは相手のIPの「ネットワーク部」を見て、同じネットワークか別かを判定する、と説明しました。その「ネットワーク部」の正体を、ここで正式に扱います。',
    },
    {
      kind: 'text',
      text: 'IPアドレスは32ビット。前半の[[green:ネットワーク部]]と後半の[[slate:ホスト部]]に分かれ、どこで分かれるかをサブネットマスク（プレフィックス）が決めます。計算そのものより、アドレス設計を「読める」ことを目標にします。',
    },
  ],
  sections: [
    {
      heading: 'IPアドレスはネットワーク部とホスト部に分かれる',
      blocks: [
        {
          kind: 'text',
          text: 'IPアドレスは、8ビットずつ4つに区切って10進で書きます（例 192.168.10.100）。コンピュータの中では、これは32個の0と1です。各ビットには重み（128・64・32…）があり、1のビットを足すとその10進値になります（192＝128＋64）。',
        },
        {
          kind: 'text',
          text: 'この32ビットの前半が[[green:ネットワーク部]]、後半が[[slate:ホスト部]]。/24 は「先頭24ビットがネットワーク部」という意味で、10進では 255.255.255.0。[[green:ネットワーク部が同じ]]なら、同じネットワーク（同じセグメント）です。',
        },
        { kind: 'figure', figure: subnetFigure },
        {
          kind: 'callout',
          tone: 'warn',
          title: '端末に使えない2つのアドレス',
          body: 'ネットワークの先頭（ネットワークアドレス）と末尾（ブロードキャストアドレス）は、端末には割り当てられません。そのため /24（256個）で使えるのは254台、/26（64個）なら62台、というように「全体から2つ引いた数」が使えるホスト数になります。',
        },
      ],
    },
    {
      heading: '複数のセグメントに分けてつなぐ',
      blocks: [
        {
          kind: 'text',
          text: 'ネットワークは、用途やフロアごとに複数のセグメント（小さなネットワーク）に分けて設計します。これまでの内部LAN（192.168.10.0/24）に加え、ここでは別フロア（192.168.30.0/24）が増えました。',
        },
        {
          kind: 'text',
          text: 'セグメントが違うと[[green:ネットワーク部]]が違います。だから別セグメントの相手へは直接は届かず、いったん[[blue:ルータ（L3）]]を通ります——第1章でデフォルトゲートウェイに渡したのと同じ理屈です。',
        },
        { kind: 'figure', figure: segmentFlowFigure },
      ],
    },
    {
      heading: '必要な数に合わせて割り当てる（CIDR・VLSM）',
      blocks: [
        {
          kind: 'text',
          text: 'かつてはアドレスをクラス（A・B・C）という固定の大きさで配っていました。今は必要な大きさに合わせて[[blue:プレフィックスで自由に区切ります]]（CIDR）。クラスは由来として名前だけ押さえれば十分です。',
        },
        {
          kind: 'text',
          text: '部署や拠点で必要な台数は違います。大きい部署には大きく、ルータ同士をつなぐだけの点対点リンクには2台ぶんの[[blue:/30]]、と必要数に合う最小のネットワークを割り当てます（VLSM）。先ほどの内部LAN（192.168.10.0/24）も、用途ごとに分けるとこう設計できます。',
        },
        { kind: 'figure', figure: vlsmFigure },
        {
          kind: 'callout',
          tone: 'tip',
          title: '点対点リンクは/30',
          body: 'ルータ同士を1本でつなぐリンクは、両端の2台ぶんだけあれば足ります。そこに大きなネットワークを割り当てるのはムダなので、2台だけ使える/30にします。こうして割り当てたアドレスの間を、次の第7章でルータがつなぎます。',
        },
      ],
    },
    {
      heading: '午後問題では「アドレス設計を読む」',
      blocks: [
        {
          kind: 'text',
          text: 'ネスペ午後では、サブネットの計算が頻出です。与えられたアドレスとマスクから、ネットワークアドレス・ブロードキャスト・使えるホスト範囲を求めたり、必要台数からプレフィックスを選んだりします。',
        },
        {
          kind: 'text',
          text: '暗算で全部解く必要はありません。「ネットワーク部はどこまでか」「この範囲に何台入るか」を、図のように区切って読めれば十分です。',
        },
        {
          kind: 'callout',
          tone: 'info',
          title: '第7章ルーティングへの橋渡し',
          body: 'アドレス設計ができると、次は「分けたネットワークの間をどうつなぐか」。その役目がルーティングです。経路表はネットワークアドレス（プレフィックス）の一覧で、ロンゲストマッチもこのプレフィックスの長さで決まります。第7章で扱います。',
        },
      ],
    },
  ],
  takeaways: [
    'IPアドレスは32ビット。[[green:前半＝ネットワーク部]]・[[slate:後半＝ホスト部]]に分かれます。各ビットの重みを足すと10進値。',
    'サブネットマスク（プレフィックス）が境界。/24なら先頭24ビットがネットワーク部。',
    '先頭（ネットワークアドレス）と末尾（ブロードキャスト）は端末に使えません。使えるのは「全体から2つ引いた数」。',
    'セグメントが違えばネットワーク部が違い、[[blue:別セグメント間はルータ（L3）経由]]（第7章へ）。',
    'クラスではなくプレフィックスで区切るのがCIDR、必要数に合わせて割り当てるのがVLSM。点対点リンクは/30。',
  ],
}
