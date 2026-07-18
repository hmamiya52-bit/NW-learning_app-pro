import type { PacketFlowFigure, RecordTableFigure, TextbookChapter, TimelineFigure, Topology } from '../types'

// 第20章 午後問題の読み方・総合演習。全20章の到達点＝topology ramp の完成形。新概念なし・統合。
// 図1: 全体図（読み方の型＝境界→経路→許可→冗長。④は外側回線✕でSPOF読み）。
// 図2: 境界クローズアップ（社外→自社WebへHTTPSの1本を全章接続で追う。第10章LB図の再演＋境界ルータ・社外PC）。
// 図3: 全体図を再利用した2本目の旅（内部PC→第2拠点＝宛先プライベートのままトンネルで包む・第12章再演）。
// 答案の段取りtimeline＋設問例3問（SPOF/宛先の書き換え回数/FW設計）で演習章のボリュームに（2026-07-18増量合意）。
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
    { id: 'site2', label: '支社ルータ', role: 'router', zoneId: 'st2', sub: '192.168.20.0/24' },
    { id: 'cloud', label: 'VPC', role: 'cloud', zoneId: 'cld', sub: '10.0.0.0/16' },
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
  takeaway: '④は「止まると全体に響く場所」探し。1本しかない線・1台しかない機器に目を留めます。',
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
// 社外からの宛先は公開用グローバルIP 203.0.113.2（台帳追加済み）→境界ルータでVIPへ変換（2026-07-18レビューで合意）。
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
  takeaway: '通信は途中を飛ばして届きません。設問で迷ったら、この図のように端から順にたどり直します。',
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
      bubbles: ['宛先 203.0.113.2:443'],
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: 'HTTPSの443番へ、まずTCPで接続。宛先は公開グローバルIP（第3章）。',
    },
    {
      focus: { type: 'link', a: 'inet', b: 'br' },
      bubbles: ['宛先 203.0.113.2:443'],
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: 'インターネットを越えて自社の境界へ。ISP間の経路はBGPの世界（第8章）。',
    },
    {
      focus: { type: 'node', id: 'br' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: '境界ルータが宛先をグローバルIPからVIPへ変換します（第9章の静的NAT）。',
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
      explanation: '境界を抜けてLBへ。VIPは外から見えない内側の代表IPです（第10章）。',
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

// §3 2本目の旅（packet-flow・全体図を再利用）。内部PC→第2拠点の支社PC。
// 外→内（静的NATで変換）との対比＝拠点間は宛先プライベートのままトンネルで包む（第12章の総合再演）。
// 吹き出しはs5（br—inet・クランプ内）のみ、ch12と同じ「外側/中身」の二重IP（graph左脇吹き出しは
// 最大120px幅のため（新IP）（暗号）の注釈は付けない＝viewBoxはみ出しの実測で確定）。
const siteJourneyFigure: PacketFlowFigure = {
  kind: 'packet-flow',
  id: 'ch20-site-journey',
  title: '内部から第2拠点へ、もう1本追う',
  caption: '同じ全体図で今度は[[blue:内から外]]へ。境界の越え方が、さっきの旅と違います。',
  takeaway: '拠点間の宛先は[[blue:プライベートのまま]]。トンネルが包んで運ぶ、この例外が設問の狙い目です。',
  topology: wholeTopology,
  hideHeaders: true,
  steps: [
    {
      focus: { type: 'node', id: 'pc' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: '支社のPC 192.168.20.10 あて。別ネットワークなので、まずGWへ（第1・6章）。',
    },
    {
      focus: { type: 'link', a: 'sw', b: 'fw' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: 'L2SWを経てFWへ。ここまでは社内のいつもの道のりです。',
    },
    {
      focus: { type: 'node', id: 'fw' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: '拠点間も社内どうしの通信として、FWのルールで許可されます（第9章）。',
    },
    {
      focus: { type: 'node', id: 'br' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: '境界ルータが丸ごとトンネルに。宛先はプライベートのまま（第12章）。',
    },
    {
      focus: { type: 'link', a: 'br', b: 'inet' },
      bubbles: ['外側 203.0.113.5', '中身 192.168.20.10'],
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: '暗号のトンネルがインターネットを渡ります。中身はのぞかれません。',
    },
    {
      focus: { type: 'link', a: 'inet', b: 'site2' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: '支社ルータがトンネルを開き、中身は支社のPCへ。2拠点が1つの社内に。',
    },
  ],
}

// §4 答案の段取り（timeline）。設問文→区間→層→絞り込み（第19章）→答案化。
const answerStepsTimeline: TimelineFigure = {
  kind: 'timeline',
  id: 'ch20-answer-steps',
  title: '設問に答えるまでの段取り',
  caption: '型どおりに進めば、初見の問題でも[[blue:書き始めるまで]]が速くなります。',
  takeaway: '④は第19章の切り分けそのもの。過去問のたびに、この5段階をなぞります。',
  items: [
    {
      badge: '①',
      label: '設問文から通信を特定',
      detail: '「誰から誰へ、何の通信か」を設問文から拾い出します。',
      tone: 'blue',
    },
    {
      badge: '②',
      label: '両端と経由機器を図で確認',
      detail: 'その通信の区間を、構成図の上で端から端までなぞります。',
      tone: 'violet',
    },
    {
      badge: '③',
      label: '機器が見るものを層で整理',
      detail: 'その機器がどの層の情報で動くかを思い出します（第1章）。',
      tone: 'emerald',
    },
    {
      badge: '④',
      label: '正常な範囲の消し込み（第19章）',
      detail: '切り分けの段取りで、原因の候補区間を狭めます。',
      tone: 'amber',
    },
    {
      badge: '⑤',
      label: '根拠から結論の順で答案化',
      detail: '「図のここがこうだから、こうなる」の形なら部分点も狙えます。',
      tone: 'blue',
    },
  ],
}

// §4 答案の型（record-table）。設問3タイプ×見る場所×答え方。
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
    '最終章は総合演習です。これまでの構成図を、午後相当の1枚として読み切ります。読む順は境界→経路→許可→冗長。外→内と内→外の2本の通信を端から端まで追い、層と境界で根拠を書く答案の型まで仕上げます。新しい技術は登場しません。全19章が道具です。',
  status: 'published',
  estimatedMinutes: 20,
  intro: [
    {
      kind: 'text',
      text: '第1章の構成図は、PCとルータとサーバだけの小さな1枚でした。それが19章分の積み上げで、拠点もクラウドも冗長も監視も含む、午後の問題文と同じスケールの図に育っています。',
    },
    {
      kind: 'text',
      text: 'この章では、まず図の[[blue:読む順]]を型として身につけ、次に[[blue:2本の通信]]で各章の知識をつなぎ、最後に[[blue:答案の組み立て]]へ落とし込みます。',
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
          kind: 'check',
          label: '設問例',
          items: [
            {
              question: '図1の構成で、故障すると社外とのすべての通信が止まる箇所はどこか。またその備えは何か。',
              answer:
                '外側回線・境界ルータ・FWのどれが故障しても、社外との通信はすべて止まります（単一障害点）。備えは第11章の冗長化です。機器はVRRPなどの二重化、回線は複数回線の契約で、1つの故障に耐えます。',
            },
          ],
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
          kind: 'callout',
          tone: 'tip',
          title: '公開用の住所は境界で変換する',
          body: 'プライベートIPのままではインターネットを通れないので（第8章）、公開サーバには外向けの[[blue:グローバルIP]]（203.0.113.2）を用意し、境界で内側のVIPへ変換します。第9章で学んだ[[blue:静的NAT]]の、総仕上げでの再演です。',
        },
        {
          kind: 'check',
          label: '設問例',
          items: [
            {
              question: '図2で、社外の利用者が送ったパケットの宛先IPアドレスは、Webサーバ1に届くまでに何回書き換わるか。',
              answer:
                '2回です。まず境界の静的NATが公開用グローバルIP（203.0.113.2）をVIP（172.16.0.10）へ、次にLBがVIPをWebサーバ1（172.16.0.20）へ書き換えます。どこで書き換わるかを、場所とセットで答えられることが大切です。',
            },
          ],
        },
        {
          kind: 'text',
          text: '午後の問題も、実はこの「抜き出し」をやっています。大きな図から設問に関係する区間だけを頭の中で抜き出し、そこで何が起きるかを考えます。図2は、その抜き出しの練習そのものです。',
        },
      ],
    },
    {
      heading: '向きを変えてもう1本追う',
      blocks: [
        {
          kind: 'text',
          text: '今度は[[blue:内から外]]へ。内部のPCから、VPNでつながった第2拠点の支社PCへの1本です。全体図の上段で出番を待っていた[[emerald:支社ルータ]]が、ここで主役になります。',
        },
        { kind: 'figure', figure: siteJourneyFigure },
        {
          kind: 'text',
          text: 'これで、境界の越え方が3通り出そろいました。外→内は[[blue:静的NATで変換]]、内→社外は[[blue:NAPT]]（第8章）、拠点間は変換せず[[blue:トンネルで包む]]。目の前の通信がどれに当たるかを見極められれば、境界読みは仕上がりです。',
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
          kind: 'text',
          text: 'タイプが分かったら、あとは共通の段取りです。書き始める前の手順を、時系列で押さえます。',
        },
        { kind: 'figure', figure: answerStepsTimeline },
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
          text: '第1章で、PC・ルータ・サーバだけの図から始めました。DNSとDHCPが加わり、VLANで分かれ、境界ができ、冗長になり、無線と電話とクラウドが乗り、最後に監視が付きました。午後の構成図は、この20章分の部品でできています。',
        },
        {
          kind: 'text',
          text: 'ここから先は、過去問そのものが教材です。初見の図でも読む順は変わりません。設問が来たら、どの区間の話かを見極めて、層と境界で根拠を組み立てます。この教科書で身につけた読み方が、そのまま午後の得点力です。',
        },
      ],
    },
  ],
  takeaways: [
    '午後の構成図は[[blue:境界→経路→許可→冗長]]の順で読みます。型があれば初見の図にも同じ手が使えます。',
    '[[blue:1本の通信]]に全章の知識が乗ります。どの区間の話かを見極めれば、使う道具が決まります。',
    '境界の越え方は[[blue:変換（静的NAT）]]・[[blue:NAPT]]・[[blue:トンネル]]の3通り。どれに当たるかで、設問の狙いが読めます。',
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
      question: '「外→公開Web」「内→社外サイト」「内→第2拠点」の3つの通信は、境界の越え方がどう違うか。',
      answer:
        '外→公開Webは、静的NATで宛先が公開用グローバルIPからVIPへ変換されます。内→社外は、NAPTで送信元がグローバルIPに変換されます。拠点間は、どちらも変換せずトンネルで包んで運びます。境界で何が起きるかが、それぞれ違います。',
    },
    {
      question: '「内部のPCから社外サイトにつながらない」という設問で、答案の根拠はどう組み立てるか。',
      answer:
        '「どこまでは正常か」を近い順に示します。GWへのpingが通れば足元は正常、と範囲を絞り、失敗が始まる区間とその機器が見るもの（経路・ルール・名前解決）を理由に挙げます。第19章の切り分けが、そのまま答案の骨組みです。',
    },
  ],
}
