import type { PacketFlowFigure, TextbookChapter, Topology } from '../types'

// 第5章 第1章の「L2SWはMACを見て中継」の中身を開く。MAC学習・VLAN・STP。ここから構成図が横に育つ。

// MAC学習用の最小構成（PC-A — L2SW — PC-B）。
const macTopology: Topology = {
  zones: [{ id: 'lan', label: '内部LAN 192.168.10.0/24', tone: 'sky' }],
  nodes: [
    { id: 'pcA', label: 'PC-A', role: 'pc', zoneId: 'lan', sub: '192.168.10.10' },
    { id: 'l2sw', label: 'L2SW', role: 'switch', zoneId: 'lan', sub: 'L2スイッチ' },
    { id: 'pcB', label: 'PC-B', role: 'pc', zoneId: 'lan', sub: '192.168.10.11' },
  ],
  links: [
    { a: 'pcA', b: 'l2sw' },
    { a: 'l2sw', b: 'pcB' },
  ],
}

// VLAN用。VLAN10（業務）はSW1とSW2の両方に、VLAN20（管理）はSW2に。トランクで2台を接続。
// graph レイアウト: スイッチ＝幹、PC＝枝（VLAN色）。
const vlanTopology: Topology = {
  layout: 'graph',
  zones: [
    { id: 'vlan10', label: 'VLAN10（業務）', tone: 'emerald' },
    { id: 'vlan20', label: 'VLAN20（管理）', tone: 'violet' },
  ],
  nodes: [
    { id: 'pcA', label: 'PC-A', role: 'pc', zoneId: 'vlan10', sub: 'VLAN10' },
    { id: 'sw1', label: 'SW1', role: 'switch', sub: 'L2SW' },
    { id: 'sw2', label: 'SW2', role: 'switch', sub: 'L2SW' },
    { id: 'pcB', label: 'PC-B', role: 'pc', zoneId: 'vlan10', sub: 'VLAN10' },
    { id: 'mpc', label: '管理PC', role: 'pc', zoneId: 'vlan20', sub: 'VLAN20' },
  ],
  links: [
    { a: 'pcA', b: 'sw1' },
    { a: 'sw1', b: 'sw2' },
    { a: 'sw2', b: 'pcB' },
    { a: 'sw2', b: 'mpc' },
  ],
}

// STP用。SW1とSW2を冗長リンク（2本）で結ぶ＝ループ。PCがブロードキャストの起点。
const stpTopology: Topology = {
  layout: 'graph',
  zones: [{ id: 'lan', label: '内部LAN', tone: 'sky' }],
  nodes: [
    { id: 'pc', label: 'PC', role: 'pc', zoneId: 'lan', sub: '192.168.10.10' },
    { id: 'sw1', label: 'SW1', role: 'switch', zoneId: 'lan', sub: 'L2SW' },
    { id: 'sw2', label: 'SW2', role: 'switch', zoneId: 'lan', sub: 'L2SW' },
  ],
  links: [
    { a: 'pc', b: 'sw1' },
    { a: 'sw1', b: 'sw2' },
    { a: 'sw1', b: 'sw2' },
  ],
}

const MAC_A = '00-1A-2B-00-00-A1'
const MAC_B = '00-1A-2B-00-00-B2'

const macFlowFigure: PacketFlowFigure = {
  kind: 'packet-flow',
  id: 'ch5-mac-learn',
  title: 'MAC学習とユニキャスト転送',
  caption: '下の表が、ステップごとに1行ずつ埋まります。覚えた宛先には、必要なポートだけへ。',
  takeaway: 'スイッチは[[green:送信元MAC]]とポートを学習し、覚えた宛先には必要なポートだけへ送ります。',
  topology: macTopology,
  sideTable: {
    title: 'スイッチが覚えたMACアドレステーブル',
    columns: [
      { key: 'port', label: 'ポート' },
      { key: 'mac', label: '学習したMACアドレス' },
    ],
  },
  steps: [
    {
      focus: { type: 'link', a: 'pcA', b: 'l2sw' },
      packetLabel: 'フレーム',
      headers: { l2: '宛先MAC = PC-B ／ 送信元MAC = PC-A', l3: '宛先IP = 192.168.10.11' },
      tableRows: [
        { port: 'ポート1', mac: `${MAC_A}（PC-A）` },
        { port: 'ポート2', mac: '（未学習）' },
      ],
      tableHighlightRow: 0,
      explanation: 'PC-Aがフレームを送出。スイッチは、入ってきたポート1と送信元MAC（PC-A）を対応づけて記録します。',
    },
    {
      focus: { type: 'link', a: 'l2sw', b: 'pcB' },
      packetLabel: 'フレーム',
      headers: { l2: '宛先MAC = PC-B ／ 送信元MAC = PC-A', l3: '宛先IP = 192.168.10.11' },
      tableRows: [
        { port: 'ポート1', mac: `${MAC_A}（PC-A）` },
        { port: 'ポート2', mac: '（未学習）' },
      ],
      explanation: '宛先MAC（PC-B）はまだ表にないため、届いたポート以外の全ポートへ配ります（フラッディング）。PC-Bに届きます。',
    },
    {
      focus: { type: 'link', a: 'pcB', b: 'l2sw' },
      packetLabel: '返信',
      headers: { l2: '宛先MAC = PC-A ／ 送信元MAC = PC-B', l3: '宛先IP = 192.168.10.10' },
      tableRows: [
        { port: 'ポート1', mac: `${MAC_A}（PC-A）` },
        { port: 'ポート2', mac: `${MAC_B}（PC-B）` },
      ],
      tableHighlightRow: 1,
      explanation: 'PC-Bが返信。今度は送信元MAC（PC-B）をポート2として記録します。これで両方のMACを覚えました。',
    },
    {
      focus: { type: 'link', a: 'l2sw', b: 'pcA' },
      packetLabel: '返信',
      headers: { l2: '宛先MAC = PC-A ／ 送信元MAC = PC-B', l3: '宛先IP = 192.168.10.10' },
      tableRows: [
        { port: 'ポート1', mac: `${MAC_A}（PC-A）` },
        { port: 'ポート2', mac: `${MAC_B}（PC-B）` },
      ],
      explanation: '宛先MAC（PC-A）は学習済みなので、対応するポート1だけへ送ります（ユニキャスト）。',
    },
  ],
}

const vlanFlowFigure: PacketFlowFigure = {
  kind: 'packet-flow',
  id: 'ch5-vlan',
  title: 'VLANの中だけに広がるブロードキャスト',
  caption: 'ブロードキャストは同じVLANの中だけに広がり、別のVLANへは出ません。',
  takeaway: '[[blue:VLAN＝ブロードキャストドメインの論理分割]]。別のVLANには、ブロードキャストもふつうの通信も届きません。',
  topology: vlanTopology,
  steps: [
    {
      focus: { type: 'node', id: 'pcA' },
      packetLabel: 'ブロードキャスト',
      headers: { l2: '宛先MAC = 全員あて（ブロードキャスト）', l3: 'IPは省略（VLANはL2の働き）' },
      explanation: 'VLAN10（業務）のPC-Aが、全員あて（ブロードキャスト）を送出。',
    },
    {
      focus: { type: 'node', id: 'sw1' },
      packetLabel: 'ブロードキャスト',
      headers: { l2: '宛先MAC = 全員あて（ブロードキャスト）', l3: 'IPは省略（VLANはL2の働き）' },
      explanation: 'SW1が受け取り、VLAN10のフレームと判断します。',
    },
    {
      focus: { type: 'node', id: 'sw2' },
      packetLabel: 'ブロードキャスト',
      headers: { l2: '宛先MAC = 全員あて ／ VLAN10のタグ付き', l3: 'IPは省略（VLANはL2の働き）' },
      explanation: 'トランク（VLANをまとめて運ぶ線）のタグ（付箋）でVLAN10と分かり、SW2へ伝わります。',
    },
    {
      focus: { type: 'node', id: 'pcB' },
      packetLabel: 'ブロードキャスト',
      headers: { l2: '宛先MAC = 全員あて（ブロードキャスト）', l3: 'IPは省略（VLANはL2の働き）' },
      explanation: '同じVLAN10のPC-Bに到達。すぐ隣のVLAN20の管理PCには、同じSW2でも届きません（別のブロードキャストドメイン）。',
    },
  ],
}

const stormFigure: PacketFlowFigure = {
  kind: 'packet-flow',
  id: 'ch5-storm',
  title: 'STPがないとループでストームが起きる',
  caption: 'SW1とSW2は2本のケーブルでつないでいます（冗長）。1回のブロードキャストが回り続けます。',
  takeaway: 'ループがあると、1回のブロードキャストが[[red:増え続けて]]ネットワークを埋め尽くします（ブロードキャストストーム）。',
  topology: stpTopology,
  steps: [
    {
      focus: { type: 'link', a: 'pc', b: 'sw1' },
      packetLabel: 'ブロードキャスト',
      headers: { l2: '宛先MAC = 全員あて（ブロードキャスト）', l3: 'IPは省略（L2に注目）' },
      explanation: 'PCが全員あて（ブロードキャスト）を1回だけ送出。まずSW1へ。',
    },
    {
      focus: { type: 'link', a: 'sw1', b: 'sw2' },
      packetLabel: 'ブロードキャスト',
      headers: { l2: '宛先MAC = 全員あて（ブロードキャスト）', l3: 'IPは省略（L2に注目）' },
      explanation: 'SW1は全ポートへ配るので、SW2へ転送します。',
    },
    {
      focus: { type: 'link', a: 'sw2', b: 'sw1' },
      packetLabel: 'ブロードキャスト',
      headers: { l2: '宛先MAC = 全員あて（ブロードキャスト）', l3: 'IPは省略（L2に注目）' },
      explanation: 'SW1とSW2は2本でつながっているため、フレームはもう1本を通ってSW1へ戻ってきます。',
    },
    {
      focus: { type: 'link', a: 'sw1', b: 'sw2' },
      packetLabel: 'ブロードキャスト',
      headers: { l2: '宛先MAC = 全員あて（ブロードキャスト）', l3: 'IPは省略（L2に注目）' },
      explanation: 'SW1はまたSW2へ転送……。同じフレームが回り続け、際限なく増えていきます（ブロードキャストストーム）。',
    },
  ],
}

const stpFigure: PacketFlowFigure = {
  kind: 'packet-flow',
  id: 'ch5-stp',
  title: 'STPが片方を止めて1本道にする',
  caption: 'STPが片方のポートをブロックし、ループのない1本道に整えます。',
  takeaway: '物理的に2本でも、STPが片方を止めて[[blue:論理的に1本]]に。だからループが起きません。',
  topology: stpTopology,
  steps: [
    {
      focus: { type: 'link', a: 'pc', b: 'sw1' },
      packetLabel: 'ブロードキャスト',
      headers: { l2: '宛先MAC = 全員あて（ブロードキャスト）', l3: 'IPは省略（L2に注目）' },
      blockedLink: { a: 'sw1', b: 'sw2' },
      explanation: 'STPを有効にすると、SW1とSW2の間の片方のポートがブロック（通信を止めた状態）になります。PCがブロードキャストを送出。',
    },
    {
      focus: { type: 'link', a: 'sw1', b: 'sw2' },
      packetLabel: 'ブロードキャスト',
      headers: { l2: '宛先MAC = 全員あて（ブロードキャスト）', l3: 'IPは省略（L2に注目）' },
      blockedLink: { a: 'sw1', b: 'sw2' },
      explanation: 'いまは1本だけが有効。SW1からSW2へ、1回だけ届きます。',
    },
    {
      focus: { type: 'node', id: 'sw2' },
      packetLabel: 'ブロードキャスト',
      headers: { l2: '宛先MAC = 全員あて（ブロードキャスト）', l3: 'IPは省略（L2に注目）' },
      blockedLink: { a: 'sw1', b: 'sw2' },
      explanation: 'もう片方はブロックされているため、フレームは戻ってきません。全員に1回ずつ届いて終わり。物理的には2本でも、論理的には1本です。',
    },
  ],
}

export const ch05L2VlanStp: TextbookChapter = {
  id: 'l2-vlan-stp',
  order: 5,
  title: 'L2スイッチング・VLAN・STP',
  summary: 'L2スイッチのMAC学習、VLANによる分割、STPによるループ防止を、構成図の上で動かしながら理解します。',
  status: 'published',
  estimatedMinutes: 15,
  intro: [
    {
      kind: 'text',
      text: '第1章で、L2スイッチ（L2SW）は「MACアドレスを見て中継する機器」として登場しました。ただ、その中身までは開けていません。',
    },
    {
      kind: 'text',
      text: 'この章では、そのL2スイッチを分解します。「どのポートの先に誰がいるか」を覚える[[green:MAC学習]]、1台のスイッチを複数のネットワークに分ける[[blue:VLAN]]、そして二重化したケーブルが生むループとその対策（STP）。ここから、構成図が横へ広がっていきます。',
    },
  ],
  sections: [
    {
      heading: 'スイッチは「どのポートの先に誰がいるか」を覚える',
      blocks: [
        {
          kind: 'text',
          text: 'L2スイッチの仕事は、宛先MACを見て正しいポートへ中継すること。では、どのポートへ送ればよいと、どうやって分かるのでしょうか。',
        },
        {
          kind: 'text',
          text: 'スイッチは、フレームが届くたびに[[green:送信元MAC]]と「入ってきたポート」の対応を表に記録します。これがMAC学習です。次に同じMACあてのフレームが来たら、その表を見て、対応する1つのポートだけへ送ります。',
        },
        { kind: 'figure', figure: macFlowFigure },
        {
          kind: 'callout',
          tone: 'warn',
          title: '最初はフラッディング、覚えたらユニキャスト',
          body: '宛先MACをまだ学習していないうちは、どのポートの先にいるか分からないので、スイッチは届いたポート以外の全ポートへ配ります（フラッディング）。相手が一度でも応答すれば送信元MACを覚えるため、次からは該当ポートだけへ送る形（ユニキャスト）に変わります。',
        },
      ],
    },
    {
      heading: 'VLANで1台のスイッチを分ける',
      blocks: [
        {
          kind: 'text',
          text: 'スイッチをそのまま使うと、つないだ機器は全員が同じネットワークになり、全員あての通信（ブロードキャスト）も全員に届きます。この「ブロードキャストが届く範囲」を、[[blue:ブロードキャストドメイン]]と呼びます。',
        },
        {
          kind: 'text',
          text: 'ところが実際には、業務用と管理用のように、同じスイッチでもネットワークを分けたい場面があります。そこで使うのがVLANです。[[blue:VLAN＝ブロードキャストドメインを論理的に分ける]]仕組みで、1台のスイッチを複数のネットワークとして扱えます。',
        },
        {
          kind: 'text',
          text: '各ポートには「このポートはVLAN10」のようにVLANを割り当てます（アクセスポート）。スイッチをまたぐときは、1本の線に複数のVLANをまとめて流す[[amber:トランク]]を使い、どのVLANのフレームかを[[amber:タグ（付箋）]]で見分けます（タグVLAN、IEEE802.1Q）。タグを付けずに運ぶ特別扱い（ネイティブVLAN）もありますが、名前だけで十分です。',
        },
        { kind: 'figure', figure: vlanFlowFigure },
        {
          kind: 'callout',
          tone: 'warn',
          title: 'VLANをまたぐ通信にはL3が必要',
          body: 'VLANで分けると、別のVLANへはブロードキャストもふつうの通信も届きません。別のVLANと通信するには、いったんL3（IPでのルーティング）を通す必要があります。その役目はルータ（またはL3スイッチ）が担います。詳しくは第7章で扱います。',
        },
      ],
    },
    {
      heading: 'ケーブルの二重化が生むループと、STP',
      blocks: [
        {
          kind: 'text',
          text: 'スイッチは、1本のケーブルが切れても通信が止まらないよう、スイッチどうしを2本のケーブルでつなぐことがあります（冗長化）。ところが、そのままだと思わぬ問題が起きます。',
        },
        {
          kind: 'text',
          text: 'ブロードキャストは「届いたポート以外の全ポートへ配る」ルールでした。スイッチが2本でつながっていると、配ったフレームがもう1本を通って戻り、また配られ……と[[red:ぐるぐる回り続けます]]。これがブロードキャストストームです。',
        },
        { kind: 'figure', figure: stormFigure },
        {
          kind: 'text',
          text: 'この事故を防ぐ仕組みがSTP（スパニングツリープロトコル）です。STPはスイッチどうしが情報を交換し、ループになる経路の片方のポートを、自動でブロック（通信を止めた状態）にします。',
        },
        { kind: 'figure', figure: stpFigure },
        {
          kind: 'callout',
          tone: 'warn',
          title: '物理は2本、論理は1本',
          body: 'STPは、ケーブルを抜くわけではありません。2本のうち片方を「ふだんは使わない予備」として待機させ、ループのない1本道に整えます。1本目が切れたら、予備のポートを使い始めて通信を保ちます。',
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'ルートブリッジとBPDUは名前だけ',
          body: 'STPでは、まず中心となるスイッチ（ルートブリッジ）を1台決め、そこからの距離をもとに、止めるポートを選びます。やり取りに使う制御フレームをBPDUと呼びます。切り替えを速くした後継のRSTPもありますが、ここでは名前だけ押さえれば十分です。',
        },
      ],
    },
    {
      heading: '午後問題では「VLAN設計」と「ループ事故」を読む',
      blocks: [
        {
          kind: 'text',
          text: 'ネスペ午後では、VLANで業務と管理を分ける設計や、トランクでVLANをまとめて運ぶ構成がよく問われます。「この通信はどのVLANか」「別のVLANへ行くにはどこを通るか」を読み解く形です。',
        },
        {
          kind: 'text',
          text: 'もう一つの定番が、ループ事故です。冗長化したつもりが、STPの設定漏れや配線ミスでループになり、ブロードキャストストームでネットワーク全体が止まります。その原因と対策（STP）が、午後でも問われます。',
        },
        {
          kind: 'callout',
          tone: 'info',
          title: '第7章への橋渡し',
          body: '別のVLANどうしの通信は、L3（IPでのルーティング）を通る必要があります。「VLANで分けた先を、どうつなぎ直すか」は、次の第6章（アドレス設計）と第7章（ルーティング）で扱います。L2で分け、L3でつなぐという役割分担が、午後の構成図を読む土台になります。',
        },
        {
          kind: 'check',
          label: '設問例',
          items: [
            {
              question: 'L2スイッチが、宛先MACアドレスをまだ学習していないフレームを受け取ったときの動作は何か。',
              answer: 'フラッディングします。届いたポート以外の全ポートへ配り、相手が応答すれば学習して、次からはユニキャストです。',
            },
          ],
        },
      ],
    },
  ],
  takeaways: [
    'スイッチは[[green:送信元MAC]]とポートを学習し、覚えた宛先には必要なポートだけへ送ります。',
    '宛先MACを覚える前は全ポートへ配り（フラッディング）、覚えたら該当ポートだけへ（ユニキャスト）。',
    '[[blue:VLAN＝ブロードキャストドメインの論理分割]]。別のVLANへはブロードキャストもふつうの通信も届きません。',
    'スイッチをまたいでVLANを運ぶ線がトランク、どのVLANかを見分ける付箋がタグ（IEEE802.1Q）。',
    'STPは冗長リンクのループを[[blue:論理的に1本]]に整え、ブロードキャストストームを防ぎます。',
    '別のVLANどうしはL3でつなぎます（第7章へ）。「L2で分け、L3でつなぐ」が午後の土台。',
  ],
  checks: [
    {
      question: 'MACアドレステーブルは、何と何の対応を覚える表か。',
      answer: '送信元MACアドレスと、フレームが入ってきたポート。',
    },
    {
      question: 'VLANが論理的に分割する「ドメイン」とは何か。',
      answer: 'ブロードキャストドメイン。別のVLANへは、ブロードキャストもふつうの通信も届きません。',
    },
    {
      question: 'STPは、二重化したケーブルが生むループをどうやって防ぐか。',
      answer: '片方のポートをブロックして、論理的に1本道へ。物理は2本、論理は1本。',
    },
  ],
}
