import type {
  AddressTableFigure,
  PacketFlowFigure,
  PriorityQueueFigure,
  SequenceFigure,
  TextbookChapter,
  Topology,
} from '../types'

// 第18章 VoIP・QoS・マルチキャスト。第3章UDP(RTP=UDP)・第5/6章の上。
// 音声は遅延・ゆらぎに弱く取りこぼしは許容→QoSで優先。一斉配信はマルチキャスト。
// 構成図の差分: 内部LANにIP電話(phone) 192.168.10.5x。新role phone。

// §2 VoIP（sequence 3者）。IP電話A｜呼制御サーバ(SIP)｜IP電話B。
// SIPはサーバ経由で呼を確立、RTPの音声は電話どうし直接（④のA→B矢印がサーバの生命線をまたぐ）。
const voipSequence: SequenceFigure = {
  kind: 'sequence',
  id: 'ch18-voip',
  title: 'IP電話がつながって音声が流れるまで',
  caption: '呼制御（SIP）は[[amber:サーバ経由]]、音声（RTP）は[[emerald:電話どうし直接]]。役割が分かれます。',
  takeaway: 'つなぐ合図（SIP）と、音声そのもの（RTP）は別の役割。音声は呼制御サーバを通らず、電話どうしで直接流れます。',
  actors: [
    { id: 'a', label: 'IP電話A', role: 'phone' },
    { id: 'sv', label: '呼制御サーバ', sub: 'SIP', role: 'server' },
    { id: 'b', label: 'IP電話B', role: 'phone' },
  ],
  messages: [
    { from: 'a', to: 'sv', label: '① SIPで発信', note: '電話Aが呼制御サーバへ「Bにかけたい」と伝えます（SIPの呼制御）。' },
    { from: 'sv', to: 'b', label: '② SIPで呼び出し', note: '呼制御サーバが、相手のIP電話Bを呼び出します。' },
    { from: 'sv', to: 'a', label: '③ つながった', note: '電話Bが応答し、呼制御サーバ経由で呼が確立します。ここまでがSIP。' },
    { from: 'a', to: 'b', label: '④ RTPで音声', note: '確立後の音声（RTP）は、サーバを通らず電話どうしで直接流れます。' },
  ],
}

// §3 QoS（priority-queue 新図）。届いた順→優先キューで仕分け→音声から送出、の3段。
const qosQueue: PriorityQueueFigure = {
  kind: 'priority-queue',
  id: 'ch18-qos',
  title: '混雑した回線で音声を先に通すQoS',
  caption: '届いた順に流すのではなく、優先度で仕分けし、[[emerald:音声]]から先に送り出します。',
  takeaway: '帯域そのものを増やすのではなく、送る順番を変えて、遅れに弱い音声を守る仕組みです。',
  arrivals: [
    { id: 'p1', label: 'データ', kind: 'data' },
    { id: 'p2', label: '音声', kind: 'voice' },
    { id: 'p3', label: 'データ', kind: 'data' },
    { id: 'p4', label: '音声', kind: 'voice' },
    { id: 'p5', label: 'データ', kind: 'data' },
  ],
  laneLabels: { priority: '優先（音声）', normal: '通常（データ）' },
  steps: [
    { stage: 'arrive', explanation: '混雑した回線に、音声とデータが混じった順で届きます。' },
    { stage: 'sort', explanation: '優先度の印（マーキング）で、音声を優先レーンに分けます。' },
    { stage: 'send', explanation: '回線が空くたび、優先レーンの音声から先に送り出します。' },
  ],
}

// §4 マルチキャスト（packet-flow graph stack 流用）。配信サーバ→ルータ→L2SW→PC。
// 送信は1本(src→rt)、分岐点(sw)で複製して参加者(PC1/PC2)へ。未参加のPC3は downNodes で灰色。
const multicastTopology: Topology = {
  layout: 'graph',
  stack: true,
  zones: [
    { id: 'ext', label: '配信元', tone: 'slate' },
    { id: 'lan', label: '内部LAN', tone: 'sky' },
  ],
  nodes: [
    { id: 'src', label: '配信サーバ', role: 'server', zoneId: 'ext', sub: '動画の配信元' },
    { id: 'rt', label: 'ルータ', role: 'router' },
    { id: 'sw', label: 'L2SW', role: 'switch' },
    { id: 'pc1', label: 'PC1', role: 'pc', zoneId: 'lan', sub: '参加' },
    { id: 'pc2', label: 'PC2', role: 'pc', zoneId: 'lan', sub: '参加' },
    { id: 'pc3', label: 'PC3', role: 'pc', zoneId: 'lan', sub: '未参加' },
  ],
  links: [
    { a: 'src', b: 'rt' },
    { a: 'rt', b: 'sw' },
    { a: 'sw', b: 'pc1' },
    { a: 'sw', b: 'pc2' },
    { a: 'sw', b: 'pc3' },
  ],
}

const multicastFigure: PacketFlowFigure = {
  kind: 'packet-flow',
  id: 'ch18-multicast',
  title: '1本で送って参加者だけに配るマルチキャスト',
  caption: '配信元からの[[blue:1本]]が、分岐点で参加者の数だけ[[emerald:枝分かれ]]します。',
  takeaway: '配信元は1本送るだけ。複製は分岐点（ルータやスイッチ）が担い、未参加の端末には流れません。',
  topology: multicastTopology,
  hideHeaders: true,
  steps: [
    {
      focus: { type: 'link', a: 'src', b: 'rt' },
      downNodes: ['pc3'],
      bubbles: ['宛先 グループ'],
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: '配信サーバは、宛先をグループにして1本だけ送り出します。',
    },
    {
      focus: { type: 'link', a: 'rt', b: 'sw' },
      downNodes: ['pc3'],
      bubbles: ['宛先 グループ'],
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: 'データが分岐点へ。ここから参加者の数だけ複製されます。',
    },
    {
      focus: { type: 'link', a: 'sw', b: 'pc1' },
      downNodes: ['pc3'],
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: '複製したデータを、参加したPC1へ届けます。',
    },
    {
      focus: { type: 'link', a: 'sw', b: 'pc2' },
      downNodes: ['pc3'],
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: '同じデータをPC2へ。未参加のPC3（灰色）には流れません。',
    },
  ],
}

// §4 3つの配信のしかた（address-table 3枚）。
const castTable: AddressTableFigure = {
  kind: 'address-table',
  id: 'ch18-cast',
  title: '3つの配信のしかた（ユニ／ブロード／マルチ）',
  caption: 'あて先の決め方で、届く範囲が変わります。マルチキャストは[[emerald:参加者だけ]]です。',
  takeaway: '1対1がユニキャスト、同一ネットワークの全員がブロードキャスト、参加グループだけがマルチキャストです。',
  fieldLabels: { carries: 'あて先の決め方', scope: '届く範囲', example: '使いどころ' },
  rows: [
    { name: 'ユニキャスト', layer: '1対1', carries: '相手を1台だけ指定', scope: '指定した1台', example: '普段のWebやメール', tone: 'blue' },
    { name: 'ブロードキャスト', layer: '1対全', carries: '同じネットワークの全員', scope: '同一セグメント全部', example: 'ARPやDHCPの探索', tone: 'amber' },
    { name: 'マルチキャスト', layer: '1対グループ', carries: '参加した端末のグループ', scope: '参加した端末だけ', example: '動画の一斉配信', tone: 'emerald' },
  ],
}

export const ch18VoipQosMulticast: TextbookChapter = {
  id: 'voip-qos-multicast',
  order: 18,
  title: 'VoIP・QoS・マルチキャスト',
  summary:
    '音声や映像は、遅れやゆらぎに弱く、取りこぼしは許容するという、これまでのデータ通信とは違う性質を持ちます。この章では、音声をRTP/UDPで運びSIPで呼び出すVoIP、混雑時に大事な通信を優先するQoS、同じデータを参加者だけへ一斉に配るマルチキャストを扱います。第3章のUDPが、ここで生きてきます。',
  status: 'published',
  estimatedMinutes: 15,
  intro: [
    {
      kind: 'text',
      text: '第3章で、[[blue:UDP]]は「確認しない代わりに軽くて速い運び方」だと学びました。その割り切りが本当に効くのが、音声や映像の通信です。少しの遅れやゆらぎが会話を途切れさせる一方、1つ2つの取りこぼしは聞き流せるからです。',
    },
    {
      kind: 'text',
      text: '順に、IP電話の[[blue:VoIP]]、混雑時の[[blue:QoS]]、一斉配信の[[blue:マルチキャスト]]を見ていきます。構成図の内部LANには、新しく[[emerald:IP電話]]が加わります。',
    },
  ],
  sections: [
    {
      heading: 'VoIPは音声をパケットにして運ぶ',
      blocks: [
        {
          kind: 'text',
          text: '[[blue:VoIP]]は、音声をデジタルのパケットにして、データと同じIPネットワークで運ぶ技術です。電話専用の回線を引かずに、いまあるネットワークで通話ができます。',
        },
        {
          kind: 'text',
          text: '通話には2つの役割があります。1つは[[amber:SIP]]で、電話をつなぐ・切るといった[[amber:呼制御]]（呼び出しの合図）。もう1つは[[emerald:RTP]]で、[[emerald:音声そのもの]]を運びます。RTPは第3章の[[blue:UDP]]の上で動き、速さを優先します。',
        },
        { kind: 'figure', figure: voipSequence },
        {
          kind: 'callout',
          tone: 'warn',
          title: '音声はやり直しがきかない',
          body: 'RTPは[[blue:UDP]]を使うので、届かなかった音声を[[red:送り直しません]]。会話では、遅れて届いた音声より、少し欠けても今の音声のほうが大切だからです。だからこそ、次のQoSで遅れを防ぐ工夫が要ります。',
        },
      ],
    },
    {
      heading: 'QoSは混雑時に大事な通信を優先する',
      blocks: [
        {
          kind: 'text',
          text: '回線が混雑すると、パケットは順番待ちになります。このとき、届いた順にそのまま流すと、遅れに弱い音声も後回しにされてしまいます。そこで、通信に優先度を付けて、大事なものから先に通すのが[[blue:QoS]]です。渋滞した道路でも救急車が先に通れるように、混雑した回線でも音声を先に通します。',
        },
        { kind: 'figure', figure: qosQueue },
        {
          kind: 'callout',
          tone: 'tip',
          title: '優先度を表す印がDSCP',
          body: 'パケットに優先度の印（[[blue:DSCP]]）を付けると、混雑した機器はそれを見て[[blue:優先キュー]]から先に送り出します。どの通信を優先するかは、設計で決めます。',
        },
      ],
    },
    {
      heading: '同じデータを参加者だけへ配るマルチキャスト',
      blocks: [
        {
          kind: 'text',
          text: '動画の一斉配信のように、同じデータを多数へ同時に届けたい場面があります。全員へ1つずつ個別に送る（[[blue:ユニキャスト]]）と、送る数だけ回線が混みます。かといって全員へばらまく（[[amber:ブロードキャスト]]）と、必要のない端末にも届いてしまいます。',
        },
        {
          kind: 'text',
          text: 'そこで[[emerald:マルチキャスト]]は、受け取りたい端末だけを「[[emerald:グループ]]」にまとめます。配信元は[[emerald:1本]]だけ送り、途中の分岐点で必要な数だけ複製して、参加者へ配ります。',
        },
        { kind: 'figure', figure: multicastFigure },
        {
          kind: 'callout',
          tone: 'info',
          title: '参加の申し込みはIGMP',
          body: 'どの端末がどのグループに参加するかは、[[blue:IGMP]]という仕組みで申し込みます。この参加と脱退の管理があるからこそ、配信を必要な端末にだけ絞れます。ユニキャスト・ブロードキャストとの違いを、次の表で整理します。',
        },
        { kind: 'figure', figure: castTable },
      ],
    },
    {
      heading: '午後はQoS設計とマルチキャストを問う',
      blocks: [
        {
          kind: 'text',
          text: '午後では、VoIPの[[blue:遅延や帯域]]の見積もり、混雑時の[[blue:QoS設計]]（何を優先するか）、マルチキャストの[[blue:参加（IGMP）]]と配信範囲が問われます。音声はUDPで送り直しがきかないぶん、遅延やゆらぎを抑える設計が要点です。',
        },
        {
          kind: 'check',
          label: '設問例',
          items: [
            {
              question:
                '混雑した回線で、IP電話の音声が途切れやすくなっています。帯域を増やさずに音声の品質を保つには、どのような仕組みが有効か。',
              answer:
                'QoS（優先制御）です。音声のパケットに優先度の印（DSCP）を付け、優先キューで先に送り出すことで、混雑時も音声を遅れにくくします。帯域そのものを増やすのではなく、送る順番を変えて、遅れに弱い音声を守ります。',
            },
          ],
        },
        {
          kind: 'text',
          text: '「通話が時々途切れる」「配信が一部の端末に届かない」といった切り分けでは、QoSの優先設定、マルチキャストの[[blue:IGMP]]参加や対応機器の設定を、順に確かめます。',
        },
      ],
    },
  ],
  takeaways: [
    '[[blue:VoIP]]は音声をパケットにして運びます。つなぐ合図が[[amber:SIP]]、音声そのものが[[emerald:RTP]]で、RTPは第3章のUDPの上で動きます。',
    '音声は送り直しがきかず、遅れやゆらぎに弱いぶん、[[blue:優先制御]]が要ります。',
    '[[blue:QoS]]は、帯域を増やすのではなく[[blue:優先度]]を付けて、大事な通信（音声など）を先に通します。',
    '[[emerald:マルチキャスト]]は、配信元が1本だけ送り、分岐点で複製して[[emerald:参加者だけ]]へ配ります。参加の申し込みは[[blue:IGMP]]です。',
    '配信のしかたは、1対1の[[blue:ユニキャスト]]、全員への[[amber:ブロードキャスト]]、参加グループへの[[emerald:マルチキャスト]]の3つです。',
  ],
  checks: [
    {
      question: 'VoIPで使うSIPとRTPは、それぞれ何の役割か。',
      answer:
        'SIPは呼制御で、電話をつなぐ・切るといった呼び出しの合図を担います。RTPは音声そのものを運ぶ役割で、UDPの上で速さを優先します。SIPは呼制御サーバを経由しますが、音声（RTP）は電話どうしで直接やり取りします。',
    },
    {
      question: 'QoSは、混雑した回線でどうやって音声を守るか。帯域を増やすのとは何が違うか。',
      answer:
        '音声のパケットに優先度の印（DSCP）を付け、優先キューで先に送り出します。帯域そのものを増やすのではなく、限られた回線の中で送る順番を変えて、遅れに弱い音声を先に通します。',
    },
    {
      question: 'マルチキャストは、ユニキャストやブロードキャストと何が違うか。',
      answer:
        'ユニキャストは相手1台を指定して送り、ブロードキャストは同じネットワークの全員へ送ります。マルチキャストは、参加した端末のグループにだけ届けます。配信元は1本だけ送り、途中の分岐点で複製されるので、回線のむだが少なくなります。',
    },
  ],
}
