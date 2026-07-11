import type { PacketFlowFigure, RadioRangeFigure, RecordTableFigure, SequenceFigure, TextbookChapter, TimelineFigure, Topology } from '../types'

// 第14章 無線LAN。第5章VLAN・第13章認証(RADIUS)の上に「電波という共有媒体」を載せる。
// AP/WLC → SSID×VLAN → CSMA/CA（衝突回避・隠れ端末） → IEEE802.1X（第13章の3者が本格稼働） → ローミング。
// 構成図の差分: AP（.51/.52）・WLC 192.168.10.41 を内部LANに追加（台帳どおり）。新role 'ap'。

// §1 APとWLC（stack 3段）。上=ルータ・中=L2SW（左右にWLCと有線PC）・下=AP＋無線端末。
// 「無線はLANの末端に加わる新しい層」が上下の階層で見える。端末—AP間は wirelessLeafIds で破線＝電波。
const apTopology: Topology = {
  layout: 'graph',
  stack: true,
  leafIds: ['wlc'],
  wirelessLeafIds: ['nb', 'sp'],
  edgeLabels: [{ a: 'l2sw', b: 'ap', label: 'トランク' }],
  zones: [],
  nodes: [
    { id: 'r', label: 'ルータ', role: 'router', sub: 'デフォルトGW' },
    { id: 'l2sw', label: 'L2SW', role: 'switch', sub: '内部LAN' },
    { id: 'ap', label: 'AP', role: 'ap', sub: '192.168.10.51' },
    { id: 'wlc', label: 'WLC', role: 'ap', sub: '192.168.10.41' },
    { id: 'pc', label: 'PC', role: 'pc', sub: '192.168.10.10' },
    { id: 'nb', label: 'ノートPC', role: 'pc' },
    { id: 'sp', label: 'スマホ', role: 'pc' },
  ],
  links: [
    { a: 'r', b: 'l2sw' },
    { a: 'l2sw', b: 'wlc' },
    { a: 'l2sw', b: 'pc' },
    { a: 'l2sw', b: 'ap' },
    { a: 'ap', b: 'nb' },
    { a: 'ap', b: 'sp' },
  ],
}

const apFigure: PacketFlowFigure = {
  kind: 'packet-flow',
  id: 'ch14-ap-wlc',
  title: 'APとWLC——LANの末端に加わる無線の層',
  caption: '上ほど[[blue:これまでの有線LAN]]、いちばん下が新しい無線の層。[[green:破線]]＝電波です。',
  takeaway: '電波なのは端末とAPの間だけ。APから上は、これまでの有線LANがそのまま働きます。',
  topology: apTopology,
  hideHeaders: true,
  steps: [
    {
      focus: { type: 'node', id: 'ap' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: '新顔のAP。電波と有線を変換する、無線LANの出入口です。',
    },
    {
      focus: { type: 'node', id: 'wlc' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: 'もう1つの新顔WLC。多数のAPの設定や電波を、まとめて管理する役です。',
    },
    {
      focus: { type: 'link', a: 'ap', b: 'nb' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: 'ノートPCの通信は、電波でAPへ。破線の区間だけが無線です。',
    },
    {
      focus: { type: 'link', a: 'l2sw', b: 'ap' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: 'APで有線に乗り、トランクでL2SWへ。上の有線LANは、今までと同じ世界です。',
    },
  ],
}

// §1 SSID×VLAN の対応表。第5章の VLAN10（業務）を再利用し、来客用に VLAN30 を新設。
const ssidVlanTable: RecordTableFigure = {
  kind: 'record-table',
  id: 'ch14-ssid-vlan',
  title: 'SSIDとVLANの対応',
  caption: '1台のAPが[[blue:複数のSSID]]の電波を同時に出し、それぞれ別の[[blue:VLAN]]へつなぎます。',
  takeaway: 'SSIDを選んだ時点で、入る区画が決まります。複数のVLANを1本で運ぶため、APとL2SWの間は[[green:トランク]]です。',
  rowHeader: true,
  emphasizeKey: 'vlan',
  columns: [
    { key: 'ssid', label: 'SSID（電波の名前）' },
    { key: 'vlan', label: 'つながるVLAN' },
    { key: 'who', label: '使う人' },
  ],
  rows: [
    { ssid: 'office', vlan: 'VLAN10（業務）', who: '社員の業務端末' },
    { ssid: 'guest', vlan: 'VLAN30（来客用）', who: '来客の持ち込み端末。社内には通さず、インターネットだけ' },
  ],
}

// §2 隠れ端末（radio-range・新設）。円＝電波の届く範囲。空間の問題なので文章でなく図で見せる。
const hiddenNodeFigure: RadioRangeFigure = {
  kind: 'radio-range',
  id: 'ch14-hidden-node',
  title: '隠れ端末——APには届くのに、互いには届かない',
  caption: '[[blue:円]]＝その端末の電波が届く範囲。2つの円の重なりに、APだけがいます。',
  takeaway: '譲り合い（CSMA/CA）は「相手の電波が聞こえる」ことが前提。聞こえない相手とは衝突が起きます。',
  leftLabel: '端末A',
  rightLabel: '端末B',
  apLabel: 'AP',
  steps: [
    { show: 'left', explanation: '端末Aの電波はAPに届きます。しかし、離れた端末Bまでは届きません。' },
    { show: 'both', explanation: '端末Bも同じ。APとは話せるのに、お互いの電波は聞こえません。' },
    { show: 'both', collide: true, explanation: '互いに「空いている」と誤解して同時に送信——APのところで衝突します。' },
  ],
}

// §2 CSMA/CA（timeline）。キャリアセンスは「自分が聞く」動作で矢印にならないため、
// 会話のsequenceではなく送信前の手順の俯瞰として描く（figure-spec §2 の使い分け）。
const csmaFigure: TimelineFigure = {
  kind: 'timeline',
  id: 'ch14-csma-ca',
  title: '送る前に避ける——CSMA/CAの手順',
  caption: '無線は[[red:衝突を検出できない]]ため、送る前に避け、最後にACKで確かめます。',
  takeaway: '有線の古い規格は衝突を[[blue:検出]]（CSMA/CD）、無線は[[green:回避]]（CSMA/CA）。半二重ゆえの違いです。',
  items: [
    {
      badge: '①',
      label: '電波が空いているかを確認',
      detail: '誰かが送信中なら、終わるまで待ちます（キャリアセンス）。',
      tone: 'blue',
    },
    {
      badge: '②',
      label: 'ランダムな時間だけ追加で待機',
      detail: '待っていた全員が一斉に送り出して衝突しないよう、間をずらします。',
      tone: 'violet',
    },
    {
      badge: '③',
      label: 'データを送信',
      detail: '無線は半二重。送信中は受信できず、衝突が起きても気づけません。',
      tone: 'amber',
    },
    {
      badge: '④',
      label: 'ACKで受け取りを確認',
      detail: 'ACKが返らなければ失敗とみなし、時間を置いて送り直します。',
      tone: 'emerald',
    },
  ],
}

// §3 IEEE802.1X（sequence 3者）。第13章 RADIUS 図の再演＋役割名（サプリカント/オーセンティケータ）。
const dot1xFigure: SequenceFigure = {
  kind: 'sequence',
  id: 'ch14-dot1x',
  title: '無線LANの認証——IEEE802.1X',
  caption: '端末・取り次ぎ・認証サーバの3者に、それぞれ[[blue:役割の名前]]が付きます。',
  takeaway: 'サプリカント＝端末、オーセンティケータ＝取り次ぐAP。この[[blue:名前と機器の対応]]が午後の得点源です。',
  actors: [
    { id: 'nb', label: 'ノートPC', sub: 'サプリカント', role: 'pc' },
    { id: 'ap', label: 'AP', sub: 'オーセンティケータ', role: 'ap' },
    { id: 'auth', label: '認証サーバ', sub: 'RADIUS', role: 'server' },
  ],
  messages: [
    {
      from: 'nb',
      to: 'ap',
      label: '① 接続と認証情報',
      note: '端末が利用者の証明（IDや電子証明書）を差し出します。このやり取りの決まりがEAPです。',
    },
    {
      from: 'ap',
      to: 'auth',
      label: '② RADIUSへ取り次ぎ',
      note: 'APの仕事は、第13章のL2SWと同じ取り次ぎ。中身は確かめません。',
    },
    {
      from: 'auth',
      to: 'ap',
      label: '③ 認証OK＋所属VLAN',
      note: '認証サーバが照合し、OKと合わせて所属VLANの指示も返せます。',
    },
    {
      from: 'ap',
      to: 'nb',
      label: '④ 接続許可',
      note: '認証に通った端末だけが、指示されたVLANの一員になれます。',
    },
  ],
}

// §4 ローミング（pair 流用）。上=L2SW・中=AP1/AP2・下=端末。「接続中」チップがAP1→AP2へ移る。
const roamTopology: Topology = {
  layout: 'graph',
  pair: true,
  pairChipLabels: { active: '接続中', standby: '' },
  wirelessLeafIds: ['nb'],
  zones: [],
  nodes: [
    { id: 'l2sw', label: 'L2SW', role: 'switch', sub: '有線LANへ' },
    { id: 'ap1', label: 'AP1', role: 'ap', sub: '192.168.10.51' },
    { id: 'ap2', label: 'AP2', role: 'ap', sub: '192.168.10.52' },
    { id: 'nb', label: 'ノートPC', role: 'pc', sub: '移動する端末' },
  ],
  links: [
    { a: 'l2sw', b: 'ap1' },
    { a: 'l2sw', b: 'ap2' },
    { a: 'ap1', b: 'nb' },
    { a: 'ap2', b: 'nb' },
  ],
}

const roamFigure: PacketFlowFigure = {
  kind: 'packet-flow',
  id: 'ch14-roaming',
  title: 'APからAPへ——ローミング',
  caption: '[[blue:接続中]]チップの移り先に注目。端末が動いても通信が続く仕組みです。',
  takeaway: '接続するAPが替わっても[[blue:SSIDは同じまま]]。だから利用者は、切り替えに気づきません。',
  topology: roamTopology,
  hideHeaders: true,
  steps: [
    {
      focus: { type: 'link', a: 'ap1', b: 'nb' },
      pairActive: 'ap1',
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: 'ノートPCはAP1に接続中。通信はAP1を通って有線LANへ流れます。',
    },
    {
      focus: { type: 'node', id: 'nb' },
      pairActive: 'ap1',
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: '利用者がノートPCを持って移動。AP1の電波がだんだん弱くなります。',
    },
    {
      focus: { type: 'link', a: 'ap2', b: 'nb' },
      pairActive: 'ap2',
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: 'AP2の電波が強い場所へ。接続先がAP2に切り替わります。これがローミングです。',
    },
    {
      focus: { type: 'link', a: 'l2sw', b: 'ap2' },
      pairActive: 'ap2',
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: '以後の通信はAP2経由。WLCが引き継ぎを整えるので、通信は途切れません。',
    },
  ],
}

export const ch14WirelessLan: TextbookChapter = {
  id: 'wireless-lan',
  order: 14,
  title: '無線LAN',
  summary:
    '電波と有線を橋渡しするAPとWLC、SSIDとVLANの対応づけ、衝突を検出できないからこそ送る前に避けるCSMA/CA、第13章のRADIUSが本格稼働するIEEE802.1X認証、そして移動しても切れないローミング——ケーブルのないLANを支える仕組みを一望します。',
  status: 'published',
  estimatedMinutes: 18,
  intro: [
    {
      kind: 'text',
      text: 'ここまでの構成図は、すべて[[blue:ケーブル]]の世界でした。この章で登場するのは[[blue:電波]]。配線がないだけ、と思いきや——電波は壁を越えて誰にでも届き、同時に話せるのは1人だけ。前提がまるで違います。',
    },
    {
      kind: 'text',
      text: 'その違いを支えるのが、電波と有線を橋渡しする[[blue:AP]]、多数のAPを束ねる[[blue:WLC]]、譲り合いの[[blue:CSMA/CA]]、そして入口で本人を確かめる[[blue:IEEE802.1X]]。第13章の認証サーバは、ここからが出番です。',
    },
  ],
  sections: [
    {
      heading: 'APとWLC——電波の入口を束ねる2台',
      blocks: [
        {
          kind: 'text',
          text: '無線端末の通信を最初に受け止めるのが[[blue:AP]]（アクセスポイント）。電波を有線の信号に変換して、LANへ橋渡しします。1台では電波が届く範囲に限りがあるため、オフィスではAPを複数置いて面をカバーします。',
        },
        {
          kind: 'text',
          text: 'APが増えると、1台ずつの設定は手に負えません。そこで[[blue:WLC]]（無線LANコントローラ）が、全APの設定・電波の調整・切り替えをまとめて受け持ちます。構成図には、APとWLC 192.168.10.41 が加わります。',
        },
        { kind: 'figure', figure: apFigure },
        {
          kind: 'text',
          text: '無線のネットワークには[[blue:SSID]]という名前を付けます。スマホのWi-Fi設定で並ぶ、あの一覧の名前です。そしてAPの中で、SSIDは[[blue:VLAN]]（第5章）に対応づけられます。無線を有線側の設計に載せる、いちばんの要です。',
        },
        { kind: 'figure', figure: ssidVlanTable },
      ],
    },
    {
      heading: '電波は譲り合い——CSMA/CA',
      blocks: [
        {
          kind: 'text',
          text: '電波は1つの通り道を全員で共有し、同時に話せるのは1人だけ（[[blue:半二重]]）。しかも送信中は、自分の電波が大声すぎて他人の電波を聞き取れず、[[red:衝突が起きても検出できません]]。昔の有線LANの「衝突を検出してやり直す[[blue:CSMA/CD]]」は、無線では成り立たないのです。',
        },
        {
          kind: 'text',
          text: 'そこで無線は発想を変えます。検出できないなら、[[green:送る前に避ける]]——これが[[blue:CSMA/CA]]（衝突回避）です。',
        },
        { kind: 'figure', figure: csmaFigure },
        {
          kind: 'text',
          text: 'ただし、この譲り合いには弱点があります。譲るには相手の電波が聞こえることが前提——では、[[red:聞こえない位置]]に相手がいたら？',
        },
        { kind: 'figure', figure: hiddenNodeFigure },
        {
          kind: 'callout',
          tone: 'info',
          title: '対策の名前——RTS/CTS',
          body: '隠れ端末どうしの衝突を減らすには、送る前にAPへ「送ってよいか」と確認し、APが「どうぞ」と全員に応える[[blue:RTS/CTS]]という手順を使います。互いに聞こえない端末どうしでも、[[blue:APの声はどちらにも届く]]ことを利用した工夫です。',
        },
      ],
    },
    {
      heading: 'つなぐ前に確かめる——IEEE802.1X',
      blocks: [
        {
          kind: 'text',
          text: '電波はオフィスの外にも漏れます。ケーブルと違って「挿せる人＝社内の人」とは限らないので、[[blue:つなぐ前の本人確認]]が欠かせません。家庭では全員が同じ合言葉（[[blue:PSK]]＝事前共有鍵）を使いますが、会社で主流なのは1人ずつ確かめる[[blue:IEEE802.1X]]です。',
        },
        {
          kind: 'text',
          text: '登場する3者は、第13章のRADIUSの図とまったく同じ形。端末を[[blue:サプリカント]]、取り次ぐAPを[[blue:オーセンティケータ]]と呼びます。',
        },
        { kind: 'figure', figure: dot1xFigure },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'PSKと802.1Xの分かれ目',
          body: 'PSKは手軽ですが、合言葉が1つなので[[red:漏れたら全員分を変更]]、誰がつないだかも分かりません。802.1Xなら退職者のIDだけを無効化でき、記録も残ります。なお通信の暗号化は[[blue:WPA2/WPA3]]という規格の仕事——こちらは規格名を知っていれば足ります。',
        },
      ],
    },
    {
      heading: '移動しても切れない——ローミング',
      blocks: [
        {
          kind: 'text',
          text: 'ノートPCを持って会議室へ移動すると、途中でAP1の電波が弱まり、AP2の圏内に入ります。接続先のAPが自動で切り替わり、通信はそのまま続く——これが[[blue:ローミング]]です。',
        },
        { kind: 'figure', figure: roamFigure },
      ],
    },
    {
      heading: '午後の着眼点——無線設計の読みどころ',
      blocks: [
        {
          kind: 'text',
          text: '無線の午後は、[[blue:設計の妥当性]]を問うのが定番です。SSIDとVLANの対応、認証方式の選択（802.1XかPSKか）、そしてAPの配置と電波の設計が題材になります。',
        },
        {
          kind: 'callout',
          tone: 'info',
          title: 'チャネル——電波の通り道を分ける',
          body: '電波にはいくつかの通り道（[[blue:チャネル]]）があります。隣り合うAPが同じチャネルだと[[red:干渉]]して速度が落ちるため、隣どうしには違うチャネルを割り当てるのが設計の定石です。',
        },
        {
          kind: 'check',
          label: '設問例',
          items: [
            {
              question:
                '利用者が802.1X認証で無線LANに接続すると、認証サーバの応答に基づいて接続の可否と所属VLANが決まります。この流れの中で、APが果たす役割は何か。',
              answer:
                'オーセンティケータ（取り次ぎ役）です。端末（サプリカント）の認証情報をRADIUSサーバへ中継し、返ってきた応答に従って、接続の許可と所属VLANの割り当てを適用します。認証の中身を確かめるのは、APではなく認証サーバです。',
            },
          ],
        },
        {
          kind: 'text',
          text: 'トラブル系では「つながらない」の切り分けが頻出。電波の問題（圏外・干渉）か、[[blue:認証]]の問題（RADIUSに届かない・証明書切れ＝第13章）か、その先のLAN（VLAN・DHCP）か——層で順に絞る型は、第19章の障害切り分けでも活躍します。',
        },
      ],
    },
  ],
  takeaways: [
    '[[blue:AP]]は電波と有線の変換、[[blue:WLC]]は多数のAPの集中管理。この2台が無線LANの土台です。',
    '[[blue:SSID]]は無線ネットワークの名前。[[blue:VLAN]]に対応づけて、無線を有線側の設計に載せます。',
    '無線は衝突を検出できないため、[[blue:CSMA/CA]]で送る前に避け、ACKで届いたかを確かめます。',
    '[[blue:IEEE802.1X]]は端末（サプリカント）｜AP（オーセンティケータ）｜認証サーバの3者。第13章の形がそのまま働きます。',
    '[[blue:ローミング]]はAPからAPへの引き継ぎ。WLCが支え、SSIDは同じまま通信が続きます。',
  ],
  checks: [
    {
      question: '昔の有線LANは衝突を検出してやり直す方式（CSMA/CD）でした。無線LANが「送る前に避ける」CSMA/CAを使うのはなぜか。',
      answer:
        '無線は半二重で、送信中に他人の電波を受信できず、衝突を検出できないからです。そのため送る前に空きを確かめて避け、届いたかどうかはACKで確認します。',
    },
    {
      question: 'SSIDとVLANは、それぞれ何の名前で、どのように関係づけて使うか。',
      answer:
        'SSIDは無線ネットワークの名前、VLANは有線側の論理的な区画です。APがSSIDをVLANに対応づけることで、無線端末を有線と同じネットワーク設計に収容できます。',
    },
    {
      question: 'ノートPCを持って移動しても、無線LANの通信が途切れないのは、何がどのように働いているからか。',
      answer:
        'ローミングです。電波の強いAPへ接続先が自動で切り替わり、WLCがAP間の引き継ぎを管理するため、SSIDも通信も途切れません。',
    },
  ],
}
