import type { PacketFlowFigure, RecordTableFigure, TextbookChapter, Topology } from '../types'

// 第9章 セキュリティ境界・ファイアウォール・DMZ。第8章で外とつながった次は「誰を通し誰を止めるか」。
// FWの許可条件（5つの情報＝第3章）→ ステートフル → DMZ。ネスペ科目Bの最重要構造＝境界。
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

// §1 全体図: 三層の位置関係を「通信の向き」で見せる。内→外は通り、外→内は通らない。
// その非対称があるからこそ、外に見せるものだけを置く中間の区画＝DMZが要る、という順で並べる。
// §4のDMZ図（外→DMZ可／外→内部不可／DMZ→内部不可）とは切り口を分ける。
const overviewFigure: PacketFlowFigure = {
  kind: 'packet-flow',
  id: 'ch9-overview',
  title: '境界にファイアウォールが加わった三層の全体図',
  caption: '上が外部・下が内部の三層。[[blue:3つの向き]]を1本ずつ通して、[[blue:FW]]の仕切りを確かめます。',
  takeaway: '内から外へは通れても、外から内へは通れません。[[blue:向き]]で扱いが変わるのが境界の基本。外に見せるものだけ[[amber:DMZ]]へ置きます。',
  topology: boundaryTopology,
  hideHeaders: true,
  steps: [
    {
      focus: { type: 'link', a: 'pc', b: 'fw' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: '内部LANの業務PCから外へ。まず境界のFWを通ります。',
    },
    {
      focus: { type: 'link', a: 'br', b: 'inet' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: '境界ルータを抜けてインターネットへ。内から外へは通れます。',
    },
    {
      focus: { type: 'link', a: 'inet', b: 'br' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: '今度は外からの通信。境界ルータを通ってFWへ届きます。',
    },
    {
      focus: { type: 'link', a: 'fw', b: 'web' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: 'FWが通すのはDMZ行きだけ。外に見せるための区画がDMZ。',
    },
    {
      focus: { type: 'node', id: 'fw' },
      verdict: 'block',
      blockedLink: { a: 'fw', b: 'pc' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: '同じ外からでも内部LANへは通しません。向きで扱いが変わります。',
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
      bubbles: ['宛先 203.0.113.2:443'],
      explanation: '社外から公開Webあての通信。あて先は公開用のグローバルIPです。',
    },
    {
      focus: { type: 'node', id: 'br' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      bubbles: ['宛先 172.16.0.20:443'],
      explanation: '境界ルータが静的NATで、あて先をDMZの172.16.0.20へ変換します。',
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
      bubbles: ['宛先 203.0.113.2:22'],
      explanation: '次は同じ公開IPの22番（SSH）あて。変換までは同じで、FWへ向かいます。',
    },
    {
      focus: { type: 'node', id: 'fw' },
      verdict: 'block',
      blockedLink: { a: 'fw', b: 'web' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      bubbles: ['宛先 172.16.0.20:22'],
      explanation: '22番を許すルールは無く、既定の拒否で遮断。開けた穴以外は通れません。',
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
      bubbles: ['送信元 203.0.113.1', '宛先 198.51.100.100'],
      explanation: '境界のNAPTで送信元はグローバルIPに変わり、社外サイトへ届きます（第8章）。',
    },
    {
      focus: { type: 'link', a: 'inet', b: 'br' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      bubbles: ['送信元 198.51.100.100', '宛先 203.0.113.1'],
      explanation: '応答のあて先は境界の203.0.113.1。NAPTが業務PCあてへ書き戻します。',
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
      bubbles: ['宛先 203.0.113.2:443'],
      explanation: '社外からWebあての通信。あて先の変換を経て、FWへ向かいます。',
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
      explanation: '外から内部PCへは、公開IPが無く名指しできません。FWも遮断します。',
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

// §5 通信可否の根拠表（科目Bの道具）。可否を強調、通信を見出しに。
const reachabilityFigure: RecordTableFigure = {
  kind: 'record-table',
  id: 'ch9-reachability',
  title: '通信可否の読み方（科目Bの道具）',
  caption: '科目Bの[[blue:通信可否]]は、まず[[blue:向き]]を見て、根拠のルールを探します。',
  takeaway: '[[green:可]]は根拠ルール、[[red:不可]]は既定の拒否。[[blue:理由]]まで言えると得点になります。',
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

// §5 FW／IDS／IPS／WAF の守備範囲。「どこを見るか」と「止めるか」の2軸だけで並べる。
const guardTable: RecordTableFigure = {
  kind: 'record-table',
  id: 'ch9-guards',
  title: 'FW・IDS・IPS・WAFの守備範囲',
  caption: '同じ「守る機器」でも、[[blue:見る場所]]と[[blue:できること]]が違います。',
  takeaway: '[[blue:FW]]はアドレスとポートで通す/止める、[[blue:WAF]]はWebの中身で判断。[[blue:IDS]]は知らせるだけ、[[blue:IPS]]は止めます。',
  rowHeader: true,
  emphasizeKey: 'act',
  columns: [
    { key: 'kind', label: '機器' },
    { key: 'see', label: '見るもの' },
    { key: 'act', label: 'できること' },
    { key: 'where', label: '置き場所' },
  ],
  rows: [
    { kind: 'FW', see: '送信元／あて先のIPとポート', act: '許可と拒否', where: '内部・DMZ・外部の境界' },
    { kind: 'IDS', see: '通信の中身の特徴', act: '検知して管理者へ知らせる', where: '監視したい区間' },
    { kind: 'IPS', see: '通信の中身の特徴', act: '検知してその場で遮断する', where: '通信が通る経路の上' },
    { kind: 'WAF', see: 'HTTPの中身（URLや入力値）', act: 'Webへの攻撃を遮断する', where: '公開Webサーバの前（DMZ）' },
  ],
}

export const ch09SecurityFwDmz: TextbookChapter = {
  id: 'security-fw-dmz',
  order: 9,
  title: 'セキュリティ境界・ファイアウォール・DMZ',
  summary:
    '外とつながると、望まない通信も入ってこようとします。通す通信と止める通信を仕分けるのがファイアウォール、公開サーバを内部から切り離して置く区画がDMZ。科目Bで最も問われる「境界」が、ここで立ち上がります。',
  status: 'published',
  estimatedMinutes: 20,
  intro: [
    {
      kind: 'text',
      text: '第8章で、社内はインターネットとつながりました。世界と往復できる便利さの一方で、外からは望まない通信も入り込もうとします。',
    },
    {
      kind: 'text',
      text: 'そこで境界に置くのが[[blue:ファイアウォール（FW）]]。「[[blue:誰を通し、誰を止めるか]]」を見張る関所です。FWが許可を決める[[blue:ルール]]（第3章の[[blue:通信を見分ける情報]]が効きます）、行きを覚えて戻りを通す[[blue:ステートフル]]、公開サーバを隔離する[[blue:DMZ]]。ネスペ科目Bで最も問われる[[blue:境界]]は、この3つでできています。',
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
          text: 'そこで社内と社外の境目に[[blue:FW]]を置き、あらかじめ決めた通信だけを通します。第8章の[[amber:サーバLAN]]も、この章からは公開用の区画＝[[amber:DMZ]]としてFWの配下に置かれます。新しい全体図を見ると、どの向きなら通れるのかがはっきりします。',
        },
        { kind: 'figure', figure: overviewFigure },
        {
          kind: 'callout',
          tone: 'info',
          title: 'サーバLANは、ここでDMZになります',
          body: '第1章から登場していた[[amber:サーバLAN（172.16.0.0/24）]]は、外に公開するWebサーバやメールサーバの区画。矛盾ではなく、第1章では見えていなかった境界が、いまFWとDMZとして図に現れた形です。',
        },
      ],
    },
    {
      heading: 'FWは何で許して、何で止めるか',
      blocks: [
        {
          kind: 'text',
          text: 'FWは[[blue:ルール]]の一覧を上から順に見て、通信が最初に一致した行の「許可／拒否」に従います。ルールの条件に使うのが、第3章で学んだ[[blue:通信を見分ける5つの情報]]（送信元IP・あて先IP・プロトコル・送信元ポート・あて先ポート）です。実際のルールは主に[[blue:あて先ポート]]（サービスの種類）で許可し、[[blue:送信元ポート]]は通常anyとします。',
        },
        { kind: 'figure', figure: fwRuleFigure },
        {
          kind: 'text',
          text: '肝心なのは、どのルールにも一致しなかった通信の扱い。FWは最後に[[red:「すべて拒否」（デフォルトdeny）]]を置き、[[blue:許可すると決めた通信だけ]]を通します。必要な穴だけを開ける考え方です。',
        },
        { kind: 'figure', figure: verdictFigure },
        {
          kind: 'text',
          text: '最初のステップのあて先[[blue:203.0.113.2]]は、境界の公開用[[blue:グローバルIP]]。プライベートIPは外からあて先にできないので、境界ルータの[[blue:静的NAT]]（第8章で名前だけ出た固定の変換）が、DMZの172.16.0.20へ届けます。',
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: '上から順・最後は拒否',
          body: 'ルールは上から順に照合し、[[blue:最初に一致した行]]で決まります。一致が無ければ最後の[[red:デフォルトdeny]]。科目Bでは「どのルールで通ったか／なぜ止まったか」を、根拠づけて答えます。',
        },
      ],
    },
    {
      heading: 'ステートフルなら戻りの許可はいらない',
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
      heading: 'DMZで公開サーバを内部から隔離する',
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
          tone: 'tip',
          title: 'DMZは名前どおりの緩衝地帯',
          body: '[[amber:DMZ]]（非武装地帯）は、外部と内部のあいだの[[blue:緩衝地帯]]。公開に必要な通信だけを外から受け、内部とは切り離します。なお最近は、通信の中身まで見る[[blue:次世代FW（NGFW）]]や、機能を1台にまとめた[[blue:UTM]]もあります。どちらも名前だけで足ります。',
        },
      ],
    },
    {
      heading: '中身まで見る機器を足す',
      blocks: [
        {
          kind: 'text',
          text: 'FWが見ているのは、送信元・あて先・ポートまででした。ところが公開Webサーバの443番は、そもそも[[green:許可した穴]]です。その許可した穴を通って攻撃が来たら、FWには止められません。',
        },
        {
          kind: 'text',
          text: 'そこで、通信の[[blue:中身]]まで見る機器を足します。おかしな中身を見つけて知らせるのが[[blue:IDS]]、見つけてその場で止めるのが[[blue:IPS]]。とくにWebへの攻撃に絞って中身を読むのが[[blue:WAF]]で、公開Webサーバの前に置きます。',
        },
        { kind: 'figure', figure: guardTable },
        {
          kind: 'callout',
          tone: 'tip',
          title: '「どこを見るか」で並べて覚える',
          body: '[[blue:FW]]はアドレスとポート、[[blue:IDS／IPS]]は通信の中身の特徴、[[blue:WAF]]はHTTPの中身。層が上がるほど細かく見られる代わりに、負荷も高くなります。IDSとIPSの違いは[[blue:止めるかどうか]]の一点だけ。科目Bでは、この対応がそのまま答えになる設問が出ます。',
        },
      ],
    },
    {
      heading: '科目Bは「通信可否の根拠」を問う',
      blocks: [
        {
          kind: 'text',
          text: '科目Bでは、構成図とFWのルールを見て「この通信は通るか、通らないか」を[[blue:根拠つき]]で答えさせます。ネスペ科目Bで最も多い問われ方の一つです。',
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
                '遮断されます。ルール1〜3のどれにも一致せず、最後の既定（拒否）に該当するためです。そもそも内部PCには外向けの公開IPが無く、外から直接はあて先にできません。これも理由の1つです。',
            },
          ],
        },
        {
          kind: 'text',
          text: '公開サーバへのアクセス集中を捌く[[blue:ロードバランサ]]は第10章、通信の暗号化に使う証明書と[[blue:PKI]]は第13章です。境界の考え方は、その土台になります。',
        },
      ],
    },
  ],
  takeaways: [
    'FWは[[blue:5つの情報]]（送信元/あて先IP・プロトコル・送信元/あて先ポート）のルールで判断。原則[[red:デフォルトdeny]]で、必要な通信だけを[[green:許可]]します。',
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
