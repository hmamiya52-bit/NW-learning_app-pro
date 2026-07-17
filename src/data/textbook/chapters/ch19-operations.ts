import type { PacketFlowFigure, RecordTableFigure, TextbookChapter, TimelineFigure, Topology } from '../types'

// 第19章 運用監視・障害切り分け。全章を「運用」視点で束ねる第4部の入口。
// 監視(SNMP/syslog/フロー)で異常に気づき、障害は第1章の層分け＋近い順で絞る（第7章ICMP/TTLの実務活用）。
// 構成図の差分: 内部LANに監視サーバ(monitor) 192.168.10.200。新role monitor。

// §1 監視（packet-flow graph stack）。上=インターネット／境界ルータ／FW／L2SW、葉=Web(DMZ)・監視サーバ・PC(内部)。
// ポーリング（監視サーバから上りの矢印）→回線障害（✕）→トラップ（機器から下りの矢印）と向きの対比で見せる。
const watchTopology: Topology = {
  layout: 'graph',
  stack: true,
  zones: [
    { id: 'dmz', label: 'DMZ', tone: 'amber' },
    { id: 'lan', label: '内部LAN', tone: 'sky' },
  ],
  nodes: [
    { id: 'inet', label: 'インターネット', role: 'internet' },
    { id: 'br', label: '境界ルータ', role: 'router', sub: '外側 203.0.113.1' },
    { id: 'fw', label: 'FW', role: 'firewall', sub: 'ファイアウォール' },
    { id: 'sw', label: 'L2SW', role: 'switch' },
    { id: 'web', label: 'Webサーバ', role: 'server', zoneId: 'dmz', sub: '172.16.0.20' },
    { id: 'mon', label: '監視サーバ', role: 'monitor', zoneId: 'lan', sub: '192.168.10.200' },
    { id: 'pc', label: 'PC', role: 'pc', zoneId: 'lan', sub: '192.168.10.10' },
  ],
  links: [
    { a: 'inet', b: 'br' },
    { a: 'br', b: 'fw' },
    { a: 'fw', b: 'sw' },
    { a: 'fw', b: 'web' },
    { a: 'sw', b: 'mon' },
    { a: 'sw', b: 'pc' },
  ],
}

const watchFigure: PacketFlowFigure = {
  kind: 'packet-flow',
  id: 'ch19-watch',
  title: '監視サーバが全機器を見張る仕組み',
  caption: 'ポーリングとトラップで[[blue:矢印の向き]]が逆になる様子を、障害の発生まで通して追います。',
  takeaway: 'トラップがあるおかげで、次のポーリングを待たずに異常に気づけます。2つは補い合う関係です。',
  topology: watchTopology,
  hideHeaders: true,
  steps: [
    {
      focus: { type: 'node', id: 'mon' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: '内部LANに監視サーバが加わり、全機器の状態をここに集めます。',
    },
    {
      focus: { type: 'link', a: 'mon', b: 'sw' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: '監視サーバが定期的にL2SWへ状態を尋ねます。これがポーリング。',
    },
    {
      focus: { type: 'link', a: 'fw', b: 'br' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: '境界ルータのような遠くの機器にも尋ね、応答で使用率などを集めます。',
    },
    {
      focus: { type: 'node', id: 'br' },
      blockedLink: { a: 'br', b: 'inet' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: 'インターネット側の回線に障害が発生。境界ルータ自身が気づきます。',
    },
    {
      focus: { type: 'link', a: 'br', b: 'fw' },
      blockedLink: { a: 'br', b: 'inet' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: '境界ルータは自分からトラップを送り、内側の監視サーバへ知らせます。',
    },
    {
      focus: { type: 'link', a: 'sw', b: 'mon' },
      blockedLink: { a: 'br', b: 'inet' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: 'トラップは監視サーバに届き、管理者がすぐ対応を始められます。',
    },
  ],
}

// §1 三本柱の対比（record-table）。状態=SNMP／ログ=syslog／通信量=フロー。収集先は監視サーバに一本化。
const pillarsTable: RecordTableFigure = {
  kind: 'record-table',
  id: 'ch19-pillars',
  title: '監視の三本柱（SNMP・syslog・フロー）',
  caption: '[[blue:集めるもの]]の列で3つの違いを、[[blue:集め方]]の列で向きの違いを見比べます。',
  takeaway: 'フローで見るのは中身ではなく[[emerald:量の内訳]]。3つは役割が違うので、置き換えではなく併用します。',
  rowHeader: true,
  columns: [
    { key: 'name', label: '仕組み' },
    { key: 'what', label: '集めるもの' },
    { key: 'how', label: '集め方' },
  ],
  rows: [
    {
      name: 'SNMP',
      what: '機器の状態（CPUや回線の使用率）',
      how: '監視サーバから定期的に取得（ポーリング）。異常時は機器から通知（トラップ）',
    },
    {
      name: 'syslog',
      what: '機器のログ（いつ・何が起きたかの記録）',
      how: '機器から監視サーバへその都度送信',
    },
    {
      name: 'NetFlow／sFlow',
      what: '通信量（どこからどこへ・どれだけ）',
      how: 'ルータなどが通信の内訳を集計して送信',
    },
  ],
}

// §2 切り分けの段取り（timeline）。近い順・層の順。toneは層の色（L2=emerald/L3=blue/上位=amber）に合わせる。
const isolateTimeline: TimelineFigure = {
  kind: 'timeline',
  id: 'ch19-isolate',
  title: '通信できないときの切り分けの段取り',
  caption: '①から⑤へ進むほど、疑う場所が[[blue:自分から遠く]]・[[blue:層の上]]へ移っていきます。',
  takeaway: 'いきなり直そうとせず、まず「[[blue:どこまでは無事か]]」の線引き。線の先だけを調べれば済みます。',
  items: [
    {
      badge: '①',
      label: 'ランプと配線の確認（物理層）',
      detail: 'ポートのランプが消えていれば、まずケーブルや電源を疑います。',
      tone: 'slate',
    },
    {
      badge: '②',
      label: '一番近いGWへping',
      detail: '届けば、自分の設定から同一セグメントまでは無事だと分かります。',
      tone: 'emerald',
    },
    {
      badge: '③',
      label: '宛先のIPへping（経路）',
      detail: '届かなければ原因は途中の経路。tracerouteで、どこまで進めるかを調べます。',
      tone: 'blue',
    },
    {
      badge: '④',
      label: '名前でも届くかを確認（DNS）',
      detail: 'IPアドレスなら届くのに名前で失敗するなら、原因は名前解決です。',
      tone: 'violet',
    },
    {
      badge: '⑤',
      label: 'ポートと設定の点検（上位層）',
      detail: '経路に問題がなければ、残るはサーバの待ち受けポートや設定です。',
      tone: 'amber',
    },
  ],
}

export const ch19Operations: TextbookChapter = {
  id: 'operations',
  order: 19,
  title: '運用監視・障害切り分け',
  summary:
    'できあがったネットワークを、止めずに動かし続けるのが運用です。この章では、機器の状態・ログ・通信量を集めて異常に気づく監視と、障害の原因を順序立てて絞り込む切り分けの段取りを扱います。第1章の層分けと第7章のICMP・TTLが、ここで現場の道具になります。',
  status: 'published',
  estimatedMinutes: 15,
  intro: [
    {
      kind: 'text',
      text: 'ここまでの18章は、ネットワークを[[blue:作る]]話でした。この章からは、作ったものを[[blue:守る]]話に入ります。守るための仕事は2つ。異常が起きたことに[[blue:気づく]]ことと、気づいたら原因の場所を[[blue:切り分ける]]ことです。',
    },
    {
      kind: 'text',
      text: '構成図の差分は、内部LANに加わる[[rose:監視サーバ]]の1台だけ。代わりにこの章では、これまで登場した全機器が「監視される側」としてそろって顔を出します。',
    },
  ],
  sections: [
    {
      heading: '異常に気づく監視の三本柱',
      blocks: [
        {
          kind: 'text',
          text: '「つながらない」という利用者からの連絡で障害を知るのでは、対応がどうしても後手に回ります。そこで、機器の状態をふだんから集めて、異常にいち早く気づく仕組みが[[blue:監視]]です。',
        },
        {
          kind: 'text',
          text: 'その中心が[[blue:SNMP]]です。監視サーバから定期的に状態を尋ねる[[blue:ポーリング]]と、異常が起きた機器の側から知らせる[[amber:トラップ]]という、向きの違う2つを組み合わせます。定期的に測る[[blue:健康診断]]と、急変を伝える[[amber:救急の通報]]の関係で、どちらか片方だけでは取りこぼしが出ます。',
        },
        { kind: 'figure', figure: watchFigure },
        {
          kind: 'callout',
          tone: 'info',
          title: 'MIBは「測れる項目」の台帳',
          body: 'SNMPで取得できる項目（CPU使用率、ポートの状態など）の一覧が[[blue:MIB]]です。細部まで問われることは少ないので、名前だけ押さえれば十分です。',
        },
        {
          kind: 'text',
          text: 'ただし、SNMPで分かるのは主に「いまの数値」です。そこを、ログを集める[[violet:syslog]]と、通信量を集める[[emerald:フロー]]（NetFlow／sFlow）が補います。3つの違いを表で整理します。',
        },
        { kind: 'figure', figure: pillarsTable },
      ],
    },
    {
      heading: '切り分けは近い順に層で絞る',
      blocks: [
        {
          kind: 'text',
          text: '監視で異常に気づいたら、次は原因探しです。闇雲に機器を再起動するのではなく、第1章の[[blue:層の見方]]を段取りに使い、[[blue:物理→L2→L3→上位]]の順、そして自分に[[blue:近い順]]に確かめます。家電が動かないとき、コンセント→ブレーカー→本体の順に見るのと同じ発想です。',
        },
        { kind: 'figure', figure: isolateTimeline },
        {
          kind: 'text',
          text: 'この段取りを支えるのが、第7章で名前だけ登場した[[blue:ping]]と[[blue:traceroute]]です。どちらも[[blue:ICMP]]という仕組みを使い、pingは「相手まで届くか」を、tracerouteは「途中のどこまで進めるか」を確かめます。',
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'tracerouteはTTLを逆手に取る',
          body: '第7章の通り、パケットはルータを1台越えるたびに[[blue:TTL]]が1減り、0になると捨てられます。tracerouteは、TTLを1、2、3…と増やしながら送り、「ここで捨てた」というルータからの返答を順に並べて、通り道を1ホップずつ明らかにします。',
        },
      ],
    },
    {
      heading: '午後は切り分けの根拠を言葉にする',
      blocks: [
        {
          kind: 'text',
          text: '午後では、障害の状況から[[blue:どの層のどこが原因か]]を絞らせる問題、監視で[[blue:何を集めておくべきか]]を選ばせる問題、そして[[blue:ログ]]から発生時刻や順序を読み取る問題が定番です。',
        },
        {
          kind: 'check',
          label: '設問例',
          items: [
            {
              question:
                '内部のPCから、社外のWebサイトが名前で開けなくなりました。IPアドレスを直接指定すると表示できます。最初に疑うべき仕組みは何か。',
              answer:
                '名前解決（DNS）です。IPアドレスでは届いている、つまり経路や下の層は正常なので、名前をIPアドレスに変える段階だけが疑わしいと絞れます。PCが参照するDNSサーバの設定や、DNSサーバ自体の稼働を確かめます。',
            },
          ],
        },
        {
          kind: 'text',
          text: '答案は「pingがGWまで届くので足元は正常、その先で失敗するので原因は経路」のように、[[blue:確かめた事実]]と[[blue:残った範囲]]の組で書きます。この書き方は、次の第20章の総合演習でそのまま使います。',
        },
      ],
    },
  ],
  takeaways: [
    '監視は[[blue:SNMP]]（状態）・[[violet:syslog]]（ログ）・[[emerald:フロー]]（通信量）の三本柱。集めるものが違います。',
    '[[blue:SNMP]]には、監視サーバから尋ねる[[blue:ポーリング]]と、機器から知らせる[[amber:トラップ]]の2つの向きがあります。',
    '切り分けは[[blue:層の順]]・[[blue:近い順]]。無事な範囲を順に消して、原因のありかを狭めます。',
    '[[blue:ping]]は到達、[[blue:traceroute]]は経路。第7章のICMPとTTLの、実務での使いどころです。',
  ],
  checks: [
    {
      question: 'SNMPのポーリングとトラップは、それぞれ誰が起点で、どう違うか。',
      answer:
        'ポーリングは監視サーバが起点で、機器へ定期的に状態を尋ねます。トラップは機器が起点で、異常が起きたときに自分から監視サーバへ知らせます。定期の確認と緊急の通報の関係で、組み合わせて使います。',
    },
    {
      question: '監視で使うSNMP・syslog・フロー（NetFlow／sFlow）は、それぞれ何を集める道具か。',
      answer:
        'SNMPは機器の状態（CPUや回線の使用率といった、いまの数値）、syslogは機器のログ（いつ・何が起きたかの記録）、フローは通信量（どこからどこへ・どれだけ流れたか）を集めます。',
    },
    {
      question: '障害の切り分けで、最初に自分のデフォルトゲートウェイへpingを打つのはなぜか。',
      answer:
        'いちばん近い相手から確かめるためです。GWへ届けば、自分の設定・配線・同一セグメントまでは無事と分かり、原因を「GWより先」に絞り込めます。届かなければ、原因は自分の足元にあります。',
    },
  ],
}
