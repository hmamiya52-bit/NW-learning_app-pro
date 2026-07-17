import type { PacketFlowFigure, RecordTableFigure, TextbookChapter, Topology } from '../types'

// 第20章 午後問題の読み方・総合演習。全20章の到達点＝topology ramp の完成形。新概念なし・統合。
// 図1: 全体図（読み方の型＝境界→経路→許可→冗長。④は外側回線✕でSPOF読み）。
// 図2: 境界クローズアップ（社外→自社WebへHTTPSの1本を全章接続で追う。第10章LB図の再演＋境界ルータ・社外PC）。
// 建付けは2026-07-17にモック合意済み（2枚構成・④はSPOF）。

// §1 全体図。spine=インターネット/境界ルータ/FW/L2SW、上=社外PC・第2拠点・クラウド（leafIds で葉に）、
// 中段=DMZ（Web公開・メール）、下=内部LAN（PC・IP電話・監視サーバ）。実際の午後と同じく代表機器のみ描く。
const wholeTopology: Topology = {
  layout: 'graph',
  stack: true,
  leafIds: ['site2', 'cloud'],
  zones: [
    { id: 'ext', label: '社外', tone: 'slate' },
    { id: 'st2', label: '第2拠点', tone: 'emerald' },
    { id: 'cld', label: 'クラウド', tone: 'slate' },
    { id: 'dmz', label: 'DMZ', tone: 'amber' },
    { id: 'lan', label: '内部LAN', tone: 'sky' },
  ],
  nodes: [
    { id: 'inet', label: 'インターネット', role: 'internet' },
    { id: 'br', label: '境界ルータ', role: 'router', sub: '外側 203.0.113.1' },
    { id: 'fw', label: 'FW', role: 'firewall', sub: 'ファイアウォール' },
    { id: 'sw', label: 'L2SW', role: 'switch' },
    { id: 'extpc', label: '社外PC', role: 'pc', zoneId: 'ext', sub: '利用者' },
    { id: 'site2', label: '第2拠点', role: 'router', zoneId: 'st2', sub: '192.168.20.0/24' },
    { id: 'cloud', label: 'クラウド', role: 'cloud', zoneId: 'cld', sub: 'VPC 10.0.0.0/16' },
    { id: 'webz', label: 'Web公開', role: 'server', zoneId: 'dmz', sub: 'LB配下・2台' },
    { id: 'mail', label: 'メール', role: 'mail', zoneId: 'dmz', sub: '172.16.0.25' },
    { id: 'pc', label: 'PC', role: 'pc', zoneId: 'lan', sub: '192.168.10.10' },
    { id: 'phone', label: 'IP電話', role: 'phone', zoneId: 'lan', sub: '192.168.10.51' },
    { id: 'mon', label: '監視サーバ', role: 'monitor', zoneId: 'lan', sub: '192.168.10.200' },
  ],
  links: [
    { a: 'inet', b: 'extpc' },
    { a: 'inet', b: 'site2' },
    { a: 'inet', b: 'cloud' },
    { a: 'inet', b: 'br' },
    { a: 'br', b: 'fw' },
    { a: 'fw', b: 'webz' },
    { a: 'fw', b: 'mail' },
    { a: 'fw', b: 'sw' },
    { a: 'sw', b: 'pc' },
    { a: 'sw', b: 'phone' },
    { a: 'sw', b: 'mon' },
  ],
}

const readingFigure: PacketFlowFigure = {
  kind: 'packet-flow',
  id: 'ch20-reading',
  title: '午後の構成図を読む4つの順番',
  caption: '①から④へ、図の上で[[blue:読む順]]を実際になぞっていきます。',
  takeaway: '最後の④は、止まると困る場所探し。予備が無ければ、そこがこの構成の弱点です。',
  topology: wholeTopology,
  hideHeaders: true,
  steps: [
    {
      focus: { type: 'node', id: 'fw' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: '読み方①境界。内側と外側の区切りと、門番のFWをまず探します。',
    },
    {
      focus: { type: 'link', a: 'inet', b: 'br' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: '読み方②経路。通信が通る線を、機器から機器へ順にたどります（第7章）。',
    },
    {
      focus: { type: 'node', id: 'webz' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: '読み方③許可。外から入れる行き先は、FWが許すDMZの公開側だけ（第9章）。',
    },
    {
      focus: { type: 'node', id: 'br' },
      blockedLink: { a: 'inet', b: 'br' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: '読み方④冗長。外側回線に予備は無く、切れると全社が孤立（第11章）。',
    },
  ],
}

// §2 境界クローズアップ。spine=インターネット/境界ルータ/FW/LB、上=社外PC、下=Webプール。
// 第10章LB図の骨格に境界ルータと社外PCを足した再演。吹き出しは上半分のステップのみ（下半分は説明文で）。
const journeyTopology: Topology = {
  layout: 'graph',
  stack: true,
  zones: [
    { id: 'ext', label: '社外', tone: 'slate' },
    { id: 'dmz', label: 'DMZ', tone: 'amber' },
  ],
  nodes: [
    { id: 'inet', label: 'インターネット', role: 'internet' },
    { id: 'br', label: '境界ルータ', role: 'router', sub: '外側 203.0.113.1' },
    { id: 'fw', label: 'FW', role: 'firewall', sub: 'ファイアウォール' },
    { id: 'lb', label: 'LB', role: 'lb', sub: 'VIP 172.16.0.10' },
    { id: 'extpc', label: '社外PC', role: 'pc', zoneId: 'ext', sub: '利用者' },
    { id: 'web1', label: 'Webサーバ1', role: 'server', zoneId: 'dmz', sub: '172.16.0.20' },
    { id: 'web2', label: 'Webサーバ2', role: 'server', zoneId: 'dmz', sub: '172.16.0.21' },
  ],
  links: [
    { a: 'inet', b: 'extpc' },
    { a: 'inet', b: 'br' },
    { a: 'br', b: 'fw' },
    { a: 'fw', b: 'lb' },
    { a: 'lb', b: 'web1' },
    { a: 'lb', b: 'web2' },
  ],
}

const journeyFigure: PacketFlowFigure = {
  kind: 'packet-flow',
  id: 'ch20-journey',
  title: '社外から自社Webへ、1本の通信を追う',
  caption: '全体図から[[blue:境界の区間]]だけを抜き出した拡大図で、通信を1歩ずつ進めます。',
  takeaway: '設問も結局はこの1本のどこか。どの区間の話かが決まれば、使う知識も決まります。',
  topology: journeyTopology,
  hideHeaders: true,
  steps: [
    {
      focus: { type: 'node', id: 'extpc' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: '社外の利用者がサイト名でアクセス。まずDNSで宛先IPを解決します（第2章）。',
    },
    {
      focus: { type: 'link', a: 'extpc', b: 'inet' },
      bubbles: ['宛先 172.16.0.10:443'],
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: 'HTTPSなので宛先はVIPの443番。TCPの接続から始まります（第3章）。',
    },
    {
      focus: { type: 'link', a: 'inet', b: 'br' },
      bubbles: ['宛先 172.16.0.10:443'],
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: 'インターネットを越えて自社の境界へ。ISP間の経路はBGPの世界（第8章）。',
    },
    {
      focus: { type: 'node', id: 'fw' },
      verdict: 'pass',
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: 'FWがルールと照合。「外からDMZの443番」は許可されて通過（第9章）。',
    },
    {
      focus: { type: 'link', a: 'fw', b: 'lb' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: '境界を抜けてLBへ。利用者が知るのは代表IP（VIP）だけです（第10章）。',
    },
    {
      focus: { type: 'node', id: 'lb' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: 'LBがVIPで受け、空いているWebサーバ1へ振り分けます。',
    },
    {
      focus: { type: 'link', a: 'lb', b: 'web1' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: 'Webサーバ1に到着。中身は第4章のTLSで暗号化されています。',
    },
  ],
}

// §3 答案の型（record-table）。設問3タイプ×見る場所×答え方。
const answerTable: RecordTableFigure = {
  kind: 'record-table',
  id: 'ch20-answer',
  title: '設問のタイプ別に見る場所と答え方',
  caption: '午後の設問は大きく3タイプ。[[blue:どこを見て]]、[[blue:何を根拠に]]書くかの対応表です。',
  takeaway: 'どのタイプも根拠は図の中。「図のこの場所がこうだから」と指させれば、答案になります。',
  rowHeader: true,
  columns: [
    { key: 'type', label: '設問のタイプ' },
    { key: 'where', label: '図のどこを見るか' },
    { key: 'how', label: '答え方の型' },
  ],
  rows: [
    {
      type: 'なぜ通信できないか',
      where: '経路上の機器（近い順）',
      how: '「どこまでは正常か」を先に示し、残った区間を指摘',
    },
    {
      type: 'この機器は何を見るか',
      where: 'その機器が属する層（第1章）',
      how: 'L2SWはMAC、ルータは宛先IP、FWはルール、LBはVIP',
    },
    {
      type: 'なぜこの構成か',
      where: '境界・冗長・サーバの置き場所',
      how: '守る（境界）・止めない（冗長）・捌く（分散）の目的とセットで説明',
    },
  ],
}

export const ch20AfternoonReading: TextbookChapter = {
  id: 'afternoon-reading',
  order: 20,
  title: '午後問題の読み方・総合演習',
  summary:
    '最終章は総合演習です。これまでの構成図を、午後相当の1枚として読み切ります。読む順は境界→経路→許可→冗長。1本の通信を端から端まで追い、層と境界で根拠を書く答案の型まで仕上げます。新しい技術は登場しません。全19章が道具です。',
  status: 'published',
  estimatedMinutes: 15,
  intro: [
    {
      kind: 'text',
      text: '第1章の構成図は、PCとルータとサーバだけの小さな1枚でした。それが19章分の積み上げで、拠点もクラウドも冗長も監視も含む、午後の問題文と同じスケールの図に育っています。',
    },
    {
      kind: 'text',
      text: 'この章では、まず図の[[blue:読む順]]を型として身につけ、次に[[blue:1本の通信]]で各章の知識をつなぎ、最後に[[blue:答案の組み立て]]へ落とし込みます。',
    },
  ],
  sections: [
    {
      heading: '構成図は境界→経路→許可→冗長で読む',
      blocks: [
        {
          kind: 'text',
          text: '午後の構成図は情報量が多く、眺めているだけでは頭に入りません。そこで、見る順番を決めておきます。まず[[blue:境界]]（内と外の区切り）、次に[[blue:経路]]（どこを通るか）、そのうえで[[blue:許可]]（何が通れるか）、最後に[[blue:冗長]]（止まったらどうなるか）。前が分からないと次が読めない、依存関係の順です。',
        },
        { kind: 'figure', figure: readingFigure },
        {
          kind: 'text',
          text: '④のように冗長を確かめると、[[red:単一障害点]]（第11章のSPOF）が浮かび上がります。午後では「この構成の弱点はどこか」という形でよく問われます。',
        },
        {
          kind: 'callout',
          tone: 'info',
          title: '図に無い機器は問われない合図',
          body: '本物の午後の構成図も、その問題に関係する機器だけを描きます。この章の全体図で無線APや認証サーバを省いたのも同じ理屈。図に無い機器を無理に心配する必要はありません。',
        },
      ],
    },
    {
      heading: '1本の通信に全章を乗せて追う',
      blocks: [
        {
          kind: 'text',
          text: '型で全体を掴んだら、今度は通信を端から端まで追います。題材は午後の定番、社外の利用者から自社の公開Webサイトへの[[blue:HTTPS]]。名前解決から負荷分散まで、この1本に各章の主役が順に登場します。',
        },
        { kind: 'figure', figure: journeyFigure },
        {
          kind: 'text',
          text: '午後の問題も、実はこの「抜き出し」をやっています。大きな図から設問に関係する区間だけを頭の中で切り出し、そこで何が起きるかを考えます。図2は、その切り出しの練習そのものです。',
        },
      ],
    },
    {
      heading: '答案は層と境界で根拠を書く',
      blocks: [
        {
          kind: 'text',
          text: '仕上げは答案です。午後の設問は、大きく「なぜ通信できないか」「この機器は何を見るか」「なぜこの構成か」の3タイプに寄せられます。それぞれ、図のどこを見て何を書くかを型にします。',
        },
        { kind: 'figure', figure: answerTable },
        {
          kind: 'check',
          label: '設問例',
          items: [
            {
              question:
                '図1の構成で、社外の利用者から公開Webサイトへは通信できるのに、社外から内部LANのPCへ直接はつながりません。この違いは、どの機器のどのような設計によるものか。',
              answer:
                'FW（ファイアウォール）の許可ルールによるものです。外からはDMZの公開サーバ（443番など）への通信だけを許可し、外から内部LANへの通信は許可していません。公開するものだけをDMZに置き、内部と分けて守る、第9章の三層構成の動きです。',
            },
          ],
        },
      ],
    },
    {
      heading: '育ててきた図で午後に挑む',
      blocks: [
        {
          kind: 'text',
          text: '第1章で、PC・ルータ・サーバだけの図から始めました。DNSとDHCPが加わり、VLANで分かれ、境界ができ、冗長になり、無線と電話とクラウドが乗り、最後に監視が付きました。午後の構成図は、この20章分の積み重ねと同じ順序でできています。',
        },
        {
          kind: 'text',
          text: 'ここから先は、過去問そのものが教材です。初見の図でも読む順は変わりません。設問が来たら、どの区間の話かを見極めて、層と境界で根拠を組み立てます。この教科書で育てた読み方が、そのまま午後の得点力です。',
        },
      ],
    },
  ],
  takeaways: [
    '午後の構成図は[[blue:境界→経路→許可→冗長]]の順で読みます。型があれば初見の図にも同じ手が使えます。',
    '[[blue:1本の通信]]に全章の知識が乗ります。どの区間の話かを見極めれば、使う道具が決まります。',
    '答案は[[blue:層と境界]]で根拠化。「この機器はこれを見る」「ここまでは正常」で組み立てます。',
    '構成図は第1章から育ててきた1枚の到達点。図が読めることが、午後の最大の武器です。',
  ],
  checks: [
    {
      question: '午後の構成図を読み始めるとき、最初に確かめるものは何か。',
      answer:
        '境界です。内部・DMZ・社外（さらに拠点やクラウド）の区切りと、間に立つFWをまず見つけます。区切りが分かると、どの通信が境界を越えるかが見え、経路・許可・冗長の確認へ進めます。',
    },
    {
      question: '社外の利用者が公開Webサイトへアクセスするとき、宛先にするIPアドレスはWebサーバ本体のものか。',
      answer:
        '違います。LBの代表IP（VIP 172.16.0.10）です。LBがVIPで受けて、裏のWebサーバ1・2（172.16.0.20・21）へ振り分けます。利用者からサーバ本体のIPは見えません。',
    },
    {
      question: '「内部のPCから社外サイトにつながらない」という設問で、答案の根拠はどう組み立てるか。',
      answer:
        '「どこまでは正常か」を近い順に示します。GWへのpingが通れば足元は正常、と範囲を絞り、失敗が始まる区間とその機器が見るもの（経路・ルール・名前解決）を理由に挙げます。第19章の切り分けが、そのまま答案の骨組みです。',
    },
  ],
}
