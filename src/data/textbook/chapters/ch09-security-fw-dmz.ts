import type { PacketFlowFigure, RecordTableFigure, TextbookChapter, Topology } from '../types'

// 第9章 セキュリティ境界・ファイアウォール・DMZ。第8章で外とつながった次は「誰を通し誰を止めるか」。
// FWの許可条件（5つの情報＝第3章）→ ステートフル → DMZ。ネスペ午後の最重要構造＝境界。
// 三層トポロジ（内部/DMZ/外部）を章全体で使い回し、節ごとに通す/止める通信を旅させる。

// 章全体で共有する三層構成図（三方向FW）。上=外部・下=内部。列は zone 初出順に 左=DMZ・右=内部LAN。
const boundaryTopology: Topology = {
  layout: 'graph',
  tiers: true,
  zones: [
    { id: 'lan', label: '内部LAN', tone: 'sky' },
    { id: 'dmz', label: 'DMZ', tone: 'amber' },
  ],
  nodes: [
    { id: 'inet', label: 'インターネット', role: 'internet' },
    { id: 'br', label: '境界ルータ', role: 'router', sub: '外側 203.0.113.1' },
    { id: 'fw', label: 'FW', role: 'firewall', sub: 'ファイアウォール' },
    { id: 'web', label: 'Webサーバ', role: 'server', zoneId: 'dmz', sub: '172.16.0.20' },
    { id: 'mail', label: 'メールサーバ', role: 'server', zoneId: 'dmz', sub: '172.16.0.25' },
    { id: 'pc', label: '業務PC', role: 'pc', zoneId: 'lan', sub: '192.168.10.10' },
  ],
  links: [
    { a: 'inet', b: 'br' },
    { a: 'br', b: 'fw' },
    { a: 'fw', b: 'web' },
    { a: 'fw', b: 'mail' },
    { a: 'fw', b: 'pc' },
  ],
}

// ステートフル図は宛先の実体（社外サイト）を図中に示すため、インターネットに社外サイトのIPを添える。
const statefulTopology: Topology = {
  ...boundaryTopology,
  nodes: boundaryTopology.nodes.map((n) => (n.id === 'inet' ? { ...n, sub: '社外サイト' } : n)),
}

// §1 全体図: 境界にFWが加わり、サーバLANがDMZに。三層の位置関係を orient（verdictなし）。
const overviewFigure: PacketFlowFigure = {
  kind: 'packet-flow',
  id: 'ch9-overview',
  title: '境界にファイアウォールが加わった三層の全体図',
  caption: '公開サーバの区画＝[[amber:DMZ]]を挟んだ、[[blue:内部]]・[[amber:DMZ]]・[[slate:外部]]の三層。上が外部・下が内部です。',
  takeaway: '第8章の[[amber:サーバLAN]]が、FW配下の[[amber:DMZ]]に。境界の[[blue:FW]]が、通す通信と止める通信を仕分けます。',
  topology: boundaryTopology,
  hideHeaders: true,
  steps: [
    {
      focus: { type: 'node', id: 'fw' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: '第8章までの構成の境目に、ファイアウォール（FW）が加わりました。社内と社外の間で通信を選別します。',
    },
    {
      focus: { type: 'node', id: 'web' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: '第8章のサーバLANは、公開用の区画＝DMZへ。WebサーバとメールサーバがFWの配下に並びます。',
    },
    {
      focus: { type: 'node', id: 'pc' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: '内部LANは、社員の業務PCが並ぶ守るべき区画。外から直接は触れさせません。',
    },
    {
      focus: { type: 'node', id: 'inet' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: '向きは上が外部・下が内部。FWが内部・DMZ・外部の三層を仕切る関所です。',
    },
  ],
}

// §2 FWルール（許可リスト）。番号=見出し、動作を強調、最後の既定deny行を強調。
const fwRuleFigure: RecordTableFigure = {
  kind: 'record-table',
  id: 'ch9-fw-rules',
  title: 'ファイアウォールのルール（許可リスト）',
  caption: 'FWの[[blue:ルール]]は、番号順に「[[blue:誰から・誰へ・どのポート]]」で許可/拒否を決めます。',
  takeaway: '上から順に照合し、最後の[[red:既定＝拒否]]（デフォルトdeny）で、ルールに無い通信はすべて止めます。',
  rowHeader: true,
  emphasizeKey: 'act',
  highlightRow: 3,
  columns: [
    { key: 'rule', label: 'ルール' },
    { key: 'src', label: '送信元' },
    { key: 'dst', label: '宛先' },
    { key: 'port', label: 'ポート' },
    { key: 'act', label: '動作' },
  ],
  rows: [
    { rule: 'ルール1', src: '内部LAN', dst: 'インターネット', port: 'すべて', act: '許可' },
    { rule: 'ルール2', src: 'インターネット', dst: 'DMZ Webサーバ', port: 'TCP 443', act: '許可' },
    { rule: 'ルール3', src: 'インターネット', dst: 'DMZ メールサーバ', port: 'TCP 25', act: '許可' },
    { rule: '既定', src: 'すべて', dst: 'すべて', port: 'すべて', act: '拒否' },
  ],
}

// §2 通過/遮断（verdict）。許可される通信（外→Web:443）と遮断される通信（外→内部PC）の2例。
const verdictFigure: PacketFlowFigure = {
  kind: 'packet-flow',
  id: 'ch9-verdict',
  title: 'ファイアウォールが通す通信・止める通信',
  caption: 'FWは[[blue:上から順]]にルールを照合。一致すれば[[green:通過]]、無ければ最後の[[red:拒否]]です。',
  takeaway: '[[green:許可]]は必要な通信だけ。ルールに無い通信は既定の[[red:拒否]]で[[red:遮断]]されます。',
  topology: boundaryTopology,
  hideHeaders: true,
  steps: [
    {
      focus: { type: 'link', a: 'inet', b: 'br' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      bubbles: ['宛先 172.16.0.20:443'],
      explanation: '社外から公開Webサーバ 172.16.0.20:443 あての通信。まず境界のFWへ届きます。',
    },
    {
      focus: { type: 'node', id: 'fw' },
      verdict: 'pass',
      packetLabel: '',
      headers: { l2: '', l3: '' },
      bubbles: ['宛先 172.16.0.20:443'],
      explanation: 'FWがルールを上から照合し、ルール2（外部→Web:443＝許可）に一致。通過します。',
    },
    {
      focus: { type: 'link', a: 'fw', b: 'web' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      bubbles: ['宛先 172.16.0.20:443'],
      explanation: '許可された通信は、DMZのWebサーバへ到達。公開サービスは、こうして社外から使えます。',
    },
    {
      focus: { type: 'link', a: 'inet', b: 'br' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      bubbles: ['宛先 192.168.10.10'],
      explanation: '次は社外から内部の業務PC 192.168.10.10 あて。同じようにFWまで届きます。',
    },
    {
      focus: { type: 'node', id: 'fw' },
      verdict: 'block',
      blockedLink: { a: 'fw', b: 'pc' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      bubbles: ['宛先 192.168.10.10'],
      explanation: '一致するルールがなく、最後の既定（拒否）に該当。ここで遮断し、内部へは入れません。',
    },
  ],
}

// §3 ステートフル。行き＝ルールで通過、戻り＝状態で自動通過（戻り用ルール不要）。
const statefulFigure: PacketFlowFigure = {
  kind: 'packet-flow',
  id: 'ch9-stateful',
  title: '行きを許せば、戻りは状態で自動通過',
  caption: '行きを許可した通信の[[blue:戻り]]は、FWが[[blue:状態（コネクション）]]で覚えて自動で通します。',
  takeaway: '[[green:戻り用のルールは不要]]。第3章のコネクションの状態を、FWがここで活用します。',
  topology: statefulTopology,
  hideHeaders: true,
  steps: [
    {
      focus: { type: 'link', a: 'pc', b: 'fw' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      bubbles: ['送信元 192.168.10.10', '宛先 198.51.100.100'],
      explanation: '業務PCが社外のWebサイトへ接続を開始。社内からFWへ向かいます。',
    },
    {
      focus: { type: 'node', id: 'fw' },
      verdict: 'pass',
      packetLabel: '',
      headers: { l2: '', l3: '' },
      bubbles: ['送信元 192.168.10.10', '宛先 198.51.100.100'],
      explanation: 'ルール1（内部→外部＝許可）に一致し、通過。行きは、こうしてルールで通ります。',
    },
    {
      focus: { type: 'link', a: 'br', b: 'inet' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      bubbles: ['送信元 192.168.10.10', '宛先 198.51.100.100'],
      explanation: 'FWを抜けた通信は、境界ルータからインターネットへ。社外サイトに要求が届きます。',
    },
    {
      focus: { type: 'link', a: 'inet', b: 'br' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      bubbles: ['送信元 198.51.100.100', '宛先 192.168.10.10'],
      explanation: '社外サイトからの応答が戻ってきます。あて先は業務PC。境界を越えてFWまで到達。',
    },
    {
      focus: { type: 'node', id: 'fw' },
      verdict: 'pass',
      packetLabel: '',
      headers: { l2: '', l3: '' },
      bubbles: ['送信元 198.51.100.100', '宛先 192.168.10.10'],
      explanation: '戻りに一致するルールはありません。でもFWは行きを覚えており、状態で自動的に通過。',
    },
    {
      focus: { type: 'link', a: 'fw', b: 'pc' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      bubbles: ['送信元 198.51.100.100', '宛先 192.168.10.10'],
      explanation: '戻り用のルールを書かなくても、応答は業務PCへ。これがステートフルの働きです。',
    },
  ],
}

// §4 DMZ隔離。外→DMZ可 / 外→内部不可 / DMZ→内部不可（被害の波及防止）。
const dmzFigure: PacketFlowFigure = {
  kind: 'packet-flow',
  id: 'ch9-dmz',
  title: '公開サーバを隔離するDMZの働き',
  caption: '外→[[amber:DMZ]]は可、外→[[blue:内部]]は不可。さらに[[amber:DMZ]]→[[blue:内部]]も不可です。',
  takeaway: '公開サーバを[[amber:DMZ]]に隔離すれば、万一破られても[[blue:内部]]は守られます。三層に分ける理由です。',
  topology: boundaryTopology,
  hideHeaders: true,
  steps: [
    {
      focus: { type: 'link', a: 'inet', b: 'br' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      bubbles: ['宛先 172.16.0.20:443'],
      explanation: '社外から、まずDMZのWebサーバあての通信がFWへ届きます。',
    },
    {
      focus: { type: 'node', id: 'fw' },
      verdict: 'pass',
      packetLabel: '',
      headers: { l2: '', l3: '' },
      bubbles: ['宛先 172.16.0.20:443'],
      explanation: '公開が目的の通信なので、FWは通します（外→DMZ＝可）。',
    },
    {
      focus: { type: 'link', a: 'fw', b: 'web' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      bubbles: ['宛先 172.16.0.20:443'],
      explanation: '通信はDMZのWebサーバへ到達。ここは外から使われる前提の区画です。',
    },
    {
      focus: { type: 'node', id: 'fw' },
      verdict: 'block',
      blockedLink: { a: 'fw', b: 'pc' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      bubbles: ['宛先 192.168.10.10'],
      explanation: '同じ社外から内部の業務PCあては、許可ルールが無く既定の拒否で遮断（外→内部＝不可）。',
    },
    {
      focus: { type: 'link', a: 'web', b: 'fw' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      bubbles: ['宛先 192.168.10.10'],
      explanation: 'もしDMZのWebサーバが乗っ取られ、内部の業務PCを狙っても……',
    },
    {
      focus: { type: 'node', id: 'fw' },
      verdict: 'block',
      blockedLink: { a: 'fw', b: 'pc' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      bubbles: ['宛先 192.168.10.10'],
      explanation: 'FWがDMZ→内部を遮断。公開サーバの被害を、内部へ波及させません。',
    },
  ],
}

// §5 通信可否の根拠表（午後の道具）。可否を強調、通信を見出しに。
const reachabilityFigure: RecordTableFigure = {
  kind: 'record-table',
  id: 'ch9-reachability',
  title: '通信可否の読み方（午後の道具）',
  caption: '午後の[[blue:通信可否]]は、まず[[blue:向き]]を見て、根拠のルールを探します。',
  takeaway: '[[green:可]]は根拠ルール、[[red:不可]]は既定の拒否——[[blue:理由]]まで言えると得点になります。',
  rowHeader: true,
  emphasizeKey: 'ok',
  columns: [
    { key: 'comm', label: '通信' },
    { key: 'ok', label: '可否' },
    { key: 'why', label: '根拠' },
  ],
  rows: [
    { comm: '内部→インターネット', ok: '可', why: 'ルール1で許可。戻りは状態で自動通過' },
    { comm: '社外→DMZ Webサーバ:443', ok: '可', why: 'ルール2で許可（公開サービス）' },
    { comm: '社外→内部の業務PC', ok: '不可', why: '一致ルール無し。既定の拒否で遮断' },
    { comm: 'DMZ→内部', ok: '不可', why: '内部への侵入を防ぐため、許可対象外' },
  ],
}

export const ch09SecurityFwDmz: TextbookChapter = {
  id: 'security-fw-dmz',
  order: 9,
  title: 'セキュリティ境界・ファイアウォール・DMZ',
  summary:
    'ファイアウォールの許可ルールとデフォルトdeny、行きを覚えて戻りを通すステートフル、公開サーバを隔離するDMZ——ネスペ午後で最も問われる「境界」を、三層の構成図で読み解きます。',
  status: 'published',
  estimatedMinutes: 18,
  intro: [
    {
      kind: 'text',
      text: '第8章で、社内はインターネットとつながりました。世界と往復できる便利さの一方で、外からは望まない通信も入り込もうとします。',
    },
    {
      kind: 'text',
      text: 'そこで境界に置くのが[[blue:ファイアウォール（FW）]]。「[[blue:誰を通し、誰を止めるか]]」を見張る関所です。この章では、FWが許可を決める[[blue:ルール]]（第3章の[[blue:通信を見分ける情報]]が効きます）、行きを覚えて戻りを通す[[blue:ステートフル]]、公開サーバを隔離する[[blue:DMZ]]——ネスペ午後で最も問われる[[blue:境界]]を読み解きます。',
    },
  ],
  sections: [
    {
      heading: 'つながった次は「守る」',
      blocks: [
        {
          kind: 'text',
          text: '第8章までで、パケットは社内から社外まで往復できるようになりました。ただ、全部を素通しにすると、外から内部のPCやサーバへ自由に入られてしまいます。',
        },
        {
          kind: 'text',
          text: 'そこで社内と社外の境目に[[blue:FW]]を置き、あらかじめ決めた通信だけを通します。第8章の[[amber:サーバLAN]]も、この章で公開用の区画＝[[amber:DMZ]]としてFWの配下に置き直します。まずは新しい全体図で、三層の位置関係を確かめましょう。',
        },
        { kind: 'figure', figure: overviewFigure },
        {
          kind: 'callout',
          tone: 'info',
          title: 'サーバLANは、ここでDMZになります',
          body: '第1章から登場していた[[amber:サーバLAN（172.16.0.0/24）]]は、外に公開するWebサーバやメールサーバの区画。矛盾ではなく、第1章で省いていた境界を、いまFWとDMZとして描き足しただけです。',
        },
      ],
    },
    {
      heading: 'FWは何で許して、何で止めるか',
      blocks: [
        {
          kind: 'text',
          text: 'FWは[[blue:ルール]]の一覧を上から順に見て、通信が最初に一致した行の「許可／拒否」に従います。ルールの条件に使うのが、第3章で学んだ[[blue:通信を見分ける5つの情報]]（送信元IP・宛先IP・プロトコル・送信元ポート・宛先ポート）です。実際のルールは主に[[blue:宛先ポート]]（サービスの種類）で許可し、[[blue:送信元ポート]]は通常anyとします。',
        },
        { kind: 'figure', figure: fwRuleFigure },
        {
          kind: 'text',
          text: '肝心なのは、どのルールにも一致しなかった通信の扱い。FWは最後に[[red:「すべて拒否」（デフォルトdeny）]]を置き、[[blue:許可すると決めた通信だけ]]を通します。必要な穴だけを開ける考え方です。',
        },
        { kind: 'figure', figure: verdictFigure },
        {
          kind: 'callout',
          tone: 'tip',
          title: '上から順・最後は拒否',
          body: 'ルールは上から順に照合し、[[blue:最初に一致した行]]で決まります。一致が無ければ最後の[[red:デフォルトdeny]]。午後では「どのルールで通ったか／なぜ止まったか」を、根拠づけて答えます。',
        },
      ],
    },
    {
      heading: 'ステートフル——行きを許せば戻りは自動',
      blocks: [
        {
          kind: 'text',
          text: '社内から社外のWebサイトを見るとき、行きの通信をルール1で許可します。では、その[[blue:応答（戻り）]]はどう通すのでしょうか。戻りごとにルールを書くのは大変です。',
        },
        {
          kind: 'text',
          text: 'いまのFWは[[blue:ステートフル]]。行きの通信の[[blue:状態（コネクション）]]を覚えておき、その戻りだと分かる通信を自動で通します。第3章のコネクションという考え方が、ここで効いてきます。',
        },
        { kind: 'figure', figure: statefulFigure },
        {
          kind: 'callout',
          tone: 'info',
          title: '戻り用のルールは書かない',
          body: 'ステートフルなFWでは、[[green:許可した行きの戻りは自動で通過]]。だからルールは「行き」の分だけを書けば足ります。第3章のESTABLISHEDなどの状態が、この自動通過の正体です。',
        },
      ],
    },
    {
      heading: 'DMZ——公開サーバを内部から隔離する',
      blocks: [
        {
          kind: 'text',
          text: 'Webサーバやメールサーバは、社外に公開するのが仕事。外からの通信を受けます。もしこれを[[blue:内部LAN]]に置くと、公開サーバを足がかりに内部まで入られる危険があります。',
        },
        {
          kind: 'text',
          text: 'そこで公開サーバは、内部とは別の区画＝[[amber:DMZ]]に置きます。FWは「外→[[amber:DMZ]]は可、外→[[blue:内部]]は不可」に加えて「[[amber:DMZ]]→[[blue:内部]]も不可」に設定。DMZが破られても、内部への侵入をFWで止めます。',
        },
        { kind: 'figure', figure: dmzFigure },
        {
          kind: 'callout',
          tone: 'info',
          title: '外からDMZへ届く宛先は、実はグローバルIP',
          body: '外から見た公開サーバの宛先は、境界の[[blue:グローバルIP]]。境界の[[blue:静的NAT]]（第8章で予告した、外から受けるための固定の変換）で、DMZの172.16.0.20へ変換されて届きます。図では、FWの許可判断に集中するため、変換後の[[amber:DMZ内部IP]]で宛先を表記しています。',
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'DMZは名前どおりの緩衝地帯',
          body: '[[amber:DMZ]]（非武装地帯）は、外部と内部のあいだの[[blue:緩衝地帯]]。公開に必要な通信だけを外から受け、内部とは切り離します。なお最近は、通信の中身まで見る[[blue:次世代FW（NGFW）]]や、機能を1台にまとめた[[blue:UTM]]もあります。名前だけ押さえれば十分です。',
        },
      ],
    },
    {
      heading: '午後は「通信可否の根拠」を問う',
      blocks: [
        {
          kind: 'text',
          text: '午後問題では、構成図とFWのルールを見て「この通信は通るか、通らないか」を[[blue:根拠つき]]で答えさせます。ネスペ午後で最も多い問われ方の一つです。',
        },
        {
          kind: 'text',
          text: 'コツは、まず[[blue:通信の向き]]（誰から誰へ）を確かめ、次に一致する[[blue:許可ルール]]を探すこと。見つからなければ、答えは[[red:デフォルトdenyで遮断]]です。',
        },
        { kind: 'figure', figure: reachabilityFigure },
        {
          kind: 'check',
          label: '設問例',
          items: [
            {
              question:
                '社外から内部の業務PC（192.168.10.10）へTCP445の通信を試みたとき、FWのルール（本文の表）ではどうなるか。',
              answer:
                '遮断されます。ルール1〜3のどれにも一致せず、最後の既定（拒否）に該当するためです。内部へ直接入る通信は、原則として許可しません。',
            },
          ],
        },
        {
          kind: 'text',
          text: '公開サーバへのアクセス集中を捌く[[blue:ロードバランサ]]は第10章、通信の暗号化に使う証明書と[[blue:PKI]]は第13章で扱います。境界の考え方は、その土台になります。',
        },
      ],
    },
  ],
  takeaways: [
    'FWは[[blue:5つの情報]]（送信元/宛先IP・プロトコル・送信元/宛先ポート）のルールで判断。原則[[red:デフォルトdeny]]で、必要な通信だけを[[green:許可]]します。',
    'ルールは[[blue:上から順]]に照合し、最初に一致した動作を採用。どれにも合わなければ、最後の拒否で[[red:遮断]]。',
    '[[blue:ステートフル]]なら、許可した行きの[[blue:戻り]]は状態で自動通過。[[green:戻り用のルールは不要]]（第3章のコネクション）。',
    '公開サーバを[[amber:DMZ]]に隔離し、外→DMZは可・外→内部は不可・[[amber:DMZ]]→[[blue:内部]]も不可。破られても内部を守る[[blue:三層境界]]です。',
  ],
  checks: [
    {
      question: 'FWの原則「デフォルトdeny」とは、どういう考え方か。',
      answer: 'ルールで明示的に許可した通信以外は、すべて拒否する考え方。必要な通信だけを許可で開けます。',
    },
    {
      question: 'ステートフルなFWで、戻りの通信に専用の許可ルールが要らないのはなぜか。',
      answer: '行きの通信の状態（コネクション）を覚えていて、その戻りだと分かる通信を自動で通すためです。',
    },
    {
      question: '公開Webサーバを内部LANではなくDMZに置くのは、なぜか。',
      answer: '万一乗っ取られても、DMZ→内部の通信をFWが遮断するため、内部への被害の波及を防げるためです。',
    },
  ],
}
