import type { PacketFlowFigure, RecordTableFigure, TextbookChapter, Topology } from '../types'

// 第10章 ロードバランサ・プロキシ・CDN。第9章で守った公開サーバに、アクセスが集中しても捌ける形を与える。
// LB（VIPで受け複数へ分散）→ プロキシ（代理の向き）→ CDN（近くから配信）。第4章HTTP/TLS・第9章境界の上に乗る。

// §2 LB: DMZのWebが LB(VIP 172.16.0.10)＋Webサーバ×2 に育つ。graph stack で幹の最下段にLB、下にプール。
const lbTopology: Topology = {
  layout: 'graph',
  stack: true,
  zones: [{ id: 'dmz', label: 'DMZ', tone: 'amber' }],
  nodes: [
    { id: 'inet', label: 'インターネット', role: 'internet' },
    { id: 'fw', label: 'FW', role: 'firewall', sub: 'ファイアウォール' },
    { id: 'lb', label: 'LB', role: 'lb', sub: 'VIP 172.16.0.10' },
    { id: 'web1', label: 'Webサーバ1', role: 'server', zoneId: 'dmz', sub: '172.16.0.20' },
    { id: 'web2', label: 'Webサーバ2', role: 'server', zoneId: 'dmz', sub: '172.16.0.21' },
  ],
  links: [
    { a: 'inet', b: 'fw' },
    { a: 'fw', b: 'lb' },
    { a: 'lb', b: 'web1' },
    { a: 'lb', b: 'web2' },
  ],
}

const lbFigure: PacketFlowFigure = {
  kind: 'packet-flow',
  id: 'ch10-lb',
  title: '代表IP（VIP）で受けて、裏の複数サーバへ振り分け',
  caption: '利用者に見えるのは[[blue:VIP]]だけ。LBが裏の[[amber:Webサーバ]]へ[[blue:振り分け]]ます。',
  takeaway: 'ヘルスチェックで[[red:停止台]]を外し、生きた台だけへ。利用者は切り替わりに気づきません。',
  topology: lbTopology,
  hideHeaders: true,
  steps: [
    {
      focus: { type: 'link', a: 'inet', b: 'fw' },
      bubbles: ['宛先 172.16.0.10'],
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: '利用者からのリクエスト。宛先はLBの代表IP（VIP 172.16.0.10）。FWを通ってLBへ届きます。',
    },
    {
      focus: { type: 'node', id: 'lb' },
      bubbles: ['宛先 172.16.0.10'],
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: 'LBがVIPで受け、裏のWebサーバへ振り分け。利用者に見えるのはVIPだけです。',
    },
    {
      focus: { type: 'link', a: 'lb', b: 'web1' },
      bubbles: ['宛先 172.16.0.20'],
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: '1つ目のリクエストはWebサーバ1（172.16.0.20）へ取り次ぎます。',
    },
    {
      focus: { type: 'link', a: 'lb', b: 'web2' },
      bubbles: ['宛先 172.16.0.21'],
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: '次のリクエストはWebサーバ2（172.16.0.21）へ。こうして負荷を複数台へ分散します。',
    },
    {
      focus: { type: 'node', id: 'lb' },
      downNodes: ['web2'],
      blockedLink: { a: 'lb', b: 'web2' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: 'ヘルスチェックでWebサーバ2の停止を検知。LBはプールから外します。',
    },
    {
      focus: { type: 'link', a: 'lb', b: 'web1' },
      downNodes: ['web2'],
      blockedLink: { a: 'lb', b: 'web2' },
      bubbles: ['宛先 172.16.0.20'],
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: '以降のリクエストは生きているWebサーバ1へ。利用者は切り替わりに気づきません。',
    },
  ],
}

// §2 L4/L7 の対比。
const l4l7Figure: RecordTableFigure = {
  kind: 'record-table',
  id: 'ch10-l4l7',
  title: 'L4とL7、どこを見て振り分けるか',
  caption: '[[blue:L4]]はアドレスとポート、[[blue:L7]]は中身（URLなど）を見て振り分けます。',
  takeaway: 'L4は速く単純、L7は[[blue:中身]]まで見て賢い振り分け。TLS終端はL7の役目です。',
  rowHeader: true,
  columns: [
    { key: 'kind', label: '種類' },
    { key: 'see', label: '見るもの' },
    { key: 'how', label: '振り分け方' },
    { key: 'tls', label: 'TLS終端' },
  ],
  rows: [
    { kind: 'L4（トランスポート）', see: 'IPアドレスとポート', how: '接続を丸ごと1台へ', tls: '不可（中身は見ずに転送）' },
    { kind: 'L7（アプリケーション）', see: 'URL・Cookieなどの中身', how: 'URLごとに振り先を変更', tls: '可（中身を見るため）' },
  ],
}

// §3 リバース/フォワードの対比。
const proxyCompareFigure: RecordTableFigure = {
  kind: 'record-table',
  id: 'ch10-proxy-compare',
  title: 'リバースプロキシとフォワードプロキシ',
  caption: '同じ「代理」でも、[[blue:どちら側の代理か]]で役割が逆になります。',
  takeaway: '[[blue:リバース]]＝サーバ側の代理（外から受ける）、[[blue:フォワード]]＝クライアント側の代理（外へ出る）。',
  rowHeader: true,
  columns: [
    { key: 'kind', label: '種類' },
    { key: 'where', label: '置き場所' },
    { key: 'agent', label: '代理する側' },
    { key: 'dir', label: '通信の向き' },
    { key: 'use', label: '主な用途' },
  ],
  rows: [
    { kind: 'リバースプロキシ', where: 'サーバの前（DMZ）', agent: 'サーバ側', dir: '外→中（受ける）', use: 'TLS終端・キャッシュ・LBの前段' },
    { kind: 'フォワードプロキシ', where: '社内の出口', agent: 'クライアント側', dir: '中→外（出る）', use: '社員の通信の検査・制御' },
  ],
}

// §3 配置図: 中央＝外部、左＝クライアント側（フォワード）、右＝サーバ側（リバース）。chain で立ち位置の逆を見せる。
const proxyPlacementTopology: Topology = {
  zones: [
    { id: 'lan', label: '内部LAN', tone: 'sky' },
    { id: 'net', label: 'インターネット', tone: 'slate' },
    { id: 'dmz', label: 'DMZ', tone: 'amber' },
  ],
  nodes: [
    { id: 'pc', label: '業務PC', role: 'pc', zoneId: 'lan', sub: 'クライアント' },
    { id: 'fwd', label: 'フォワードプロキシ', role: 'proxy', zoneId: 'lan', sub: '社内出口' },
    { id: 'inet', label: 'インターネット', role: 'internet', zoneId: 'net' },
    { id: 'rev', label: 'リバースプロキシ', role: 'proxy', zoneId: 'dmz', sub: 'Webの前' },
    { id: 'web', label: 'Webサーバ', role: 'server', zoneId: 'dmz', sub: '172.16.0.20' },
  ],
  links: [
    { a: 'pc', b: 'fwd' },
    { a: 'fwd', b: 'inet' },
    { a: 'inet', b: 'rev' },
    { a: 'rev', b: 'web' },
  ],
}

const proxyPlacementFigure: PacketFlowFigure = {
  kind: 'packet-flow',
  id: 'ch10-proxy-placement',
  title: '代理はどちら側に立つか——配置と向き',
  caption: '[[slate:外部]]を中心に、[[blue:クライアント側]]のフォワードと[[blue:サーバ側]]のリバースが、逆向きに立ちます。',
  takeaway: '[[blue:フォワード]]は社員を代理して外へ、[[blue:リバース]]は外からの通信を受けてサーバへ。立ち位置が逆です。',
  topology: proxyPlacementTopology,
  hideHeaders: true,
  steps: [
    {
      focus: { type: 'link', a: 'pc', b: 'fwd' },
      packetLabel: '送信元 192.168.10.10',
      headers: { l2: '', l3: '' },
      explanation: '社員PCの外向き通信。社内出口のフォワードプロキシが、クライアントの代理として受けます。',
    },
    {
      focus: { type: 'link', a: 'fwd', b: 'inet' },
      packetLabel: '送信元 192.168.10.10',
      headers: { l2: '', l3: '' },
      explanation: 'フォワードプロキシが代わりに外へ接続。社員側の通信を、ここで検査・制御できます。',
    },
    {
      focus: { type: 'link', a: 'inet', b: 'rev' },
      packetLabel: '宛先 172.16.0.20',
      headers: { l2: '', l3: '' },
      explanation: '今度は外の利用者からWebへ。DMZのリバースプロキシが、サーバの代理として受けます。',
    },
    {
      focus: { type: 'link', a: 'rev', b: 'web' },
      packetLabel: '宛先 172.16.0.20',
      headers: { l2: '', l3: '' },
      explanation: 'リバースプロキシがWebサーバへ取り次ぎ。TLS終端やキャッシュも、ここで担えます。',
    },
  ],
}

// §4 CDN: 利用者—近いエッジ—遠いオリジン。chain往復でヒット/ミスを見せる。
const cdnTopology: Topology = {
  zones: [
    { id: 'lz', label: '利用者の手元', tone: 'sky' },
    { id: 'ez', label: '近くのエッジ', tone: 'violet' },
    { id: 'oz', label: '遠いオリジン（DMZ）', tone: 'amber' },
  ],
  nodes: [
    { id: 'user', label: '利用者', role: 'pc', zoneId: 'lz', sub: 'スマホ・PC' },
    { id: 'edge', label: 'CDNエッジ', role: 'cloud', zoneId: 'ez', sub: 'キャッシュ' },
    { id: 'origin', label: 'オリジン', role: 'server', zoneId: 'oz', sub: 'DMZの公開Web' },
  ],
  links: [
    { a: 'user', b: 'edge' },
    { a: 'edge', b: 'origin' },
  ],
}

const cdnFigure: PacketFlowFigure = {
  kind: 'packet-flow',
  id: 'ch10-cdn',
  title: '近くのエッジから配信（CDN）',
  caption: '[[blue:近くのエッジ]]にキャッシュがあれば即返し、無ければ[[amber:遠いオリジン]]へ取りに行きます。',
  takeaway: '距離が縮んで[[blue:速く]]、[[amber:オリジン]]の負荷も減ります。2回目以降はエッジがヒットで返します。',
  topology: cdnTopology,
  hideHeaders: true,
  steps: [
    {
      focus: { type: 'link', a: 'user', b: 'edge' },
      packetLabel: '宛先 いちばん近いエッジ',
      headers: { l2: '', l3: '' },
      explanation: '利用者は、いちばん近いCDNエッジへ。距離が短いぶん速く届きます。',
    },
    {
      focus: { type: 'node', id: 'edge' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: 'エッジにキャッシュがあれば（ヒット）、その場で返信。遠いオリジンまで行きません。',
    },
    {
      focus: { type: 'link', a: 'edge', b: 'origin' },
      packetLabel: '宛先 オリジン',
      headers: { l2: '', l3: '' },
      explanation: 'キャッシュが無ければ（ミス）、エッジが遠いオリジンへ取りに行きます。',
    },
    {
      focus: { type: 'link', a: 'origin', b: 'edge' },
      packetLabel: '応答（コンテンツ）',
      headers: { l2: '', l3: '' },
      explanation: 'オリジンからの応答を、エッジが受け取ってキャッシュします。',
    },
    {
      focus: { type: 'link', a: 'edge', b: 'user' },
      packetLabel: '応答（コンテンツ）',
      headers: { l2: '', l3: '' },
      explanation: '近くのエッジから利用者へ配信。2回目以降はヒットで、すぐ返せます。',
    },
  ],
}

export const ch10LbProxyCdn: TextbookChapter = {
  id: 'lb-proxy-cdn',
  order: 10,
  title: 'ロードバランサ・プロキシ・CDN',
  summary:
    '代表IP（VIP）で受けて複数サーバへ分散するロードバランサ、通信を代理するリバース／フォワードプロキシ、利用者の近くから配信するCDN——公開サーバへのアクセス集中を捌く仕組みを、第9章の境界の上に重ねて理解します。',
  status: 'published',
  estimatedMinutes: 16,
  intro: [
    {
      kind: 'text',
      text: '第9章で、公開サーバを守る境界（FW・DMZ）ができました。次は、その公開サーバに[[blue:アクセスが集中]]しても捌ける形にします。',
    },
    {
      kind: 'text',
      text: 'カギは3つ。負荷を複数サーバに配る[[blue:ロードバランサ（LB）]]、通信を代理する[[blue:プロキシ]]、利用者の近くから配信する[[blue:CDN]]。いずれも第4章のHTTP/TLSと第9章の境界の上に乗る仕組みです。',
    },
  ],
  sections: [
    {
      heading: 'アクセス集中をどう捌くか',
      blocks: [
        {
          kind: 'text',
          text: '公開Webへの利用者が増えると、1台のサーバでは処理しきれなくなります。かといって、利用者ごとに別のサーバの住所を教えるわけにもいきません。',
        },
        {
          kind: 'text',
          text: 'そこで、入口を1つに見せたまま裏で複数台に分ける[[blue:LB]]、通信を間で取り次ぐ[[blue:プロキシ]]、遠さを縮める[[blue:CDN]]を使います。まずはLBから見ていきましょう。',
        },
      ],
    },
    {
      heading: 'ロードバランサ——1つの入口で受けて分散する',
      blocks: [
        {
          kind: 'text',
          text: '[[blue:ロードバランサ（LB）]]は、[[blue:代表IP（VIP）]]という1つの住所で利用者を受けます。VIP＝Virtual IP、代表の住所という意味です。裏には同じ役割のWebサーバを複数台そろえ、リクエストを1台ずつに[[blue:振り分け]]ます。',
        },
        {
          kind: 'text',
          text: 'さらにLBは、各サーバが元気かを定期的に確かめる[[blue:ヘルスチェック]]を行い、止まった台を振り分け先から外します。利用者は、どの台に当たったかも、1台減ったことも気づきません。',
        },
        { kind: 'figure', figure: lbFigure },
        {
          kind: 'text',
          text: 'LBには2つの深さがあります。アドレスとポートだけを見る[[blue:L4]]と、URLなど通信の中身まで見る[[blue:L7]]。L7は中身を読むために[[blue:TLS終端]]（暗号を解く。第4章）も担います。',
        },
        { kind: 'figure', figure: l4l7Figure },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'VIPは「代表の住所」',
          body: '利用者がアクセスするのは[[blue:VIP]]という代表の住所だけ。裏のサーバが何台でも、増減しても、利用者からは1台に見えます。行きも戻りもLBを通るので、午後では「戻りの経路」もあわせて問われます。買い物カゴのように途中経過を持つ通信では、同じ利用者を同じ台へ固定する[[blue:セッション維持]]が要ることもあります（名前だけ押さえれば十分です）。',
        },
      ],
    },
    {
      heading: 'プロキシ——通信を代理する',
      blocks: [
        {
          kind: 'text',
          text: '[[blue:プロキシ]]は、通信を本人の代わりに取り次ぐ代理役です。ポイントは[[blue:どちら側の代理か]]。サーバ側に立つ[[blue:リバースプロキシ]]と、クライアント側に立つ[[blue:フォワードプロキシ]]で、役割が逆になります。',
        },
        { kind: 'figure', figure: proxyCompareFigure },
        {
          kind: 'text',
          text: '配置で見ると分かりやすくなります。[[blue:リバース]]は公開サーバの前（DMZ）に立ち、外から来る通信を受けてサーバへ。[[blue:フォワード]]は社内の出口に立ち、社員から外への通信を代理します。',
        },
        { kind: 'figure', figure: proxyPlacementFigure },
        {
          kind: 'callout',
          tone: 'tip',
          title: '「どちら側の代理か」で覚える',
          body: '[[blue:リバース]]は外から見て[[blue:サーバの前]]、[[blue:フォワード]]は[[blue:クライアントの前]]。名前ではなく「誰の代理で、どちら向きの通信か」で判断すると、午後でも迷いません。リバースはLBの前段やTLS終端を兼ねることも多いです。',
        },
      ],
    },
    {
      heading: 'CDN——近くから配信する',
      blocks: [
        {
          kind: 'text',
          text: '利用者が世界中にいると、遠いオリジン（大もとのサーバ）まで毎回取りに行くのは時間がかかります。[[blue:CDN]]は、利用者の[[blue:近くのエッジ]]にコンテンツを[[blue:キャッシュ]]し、近くから返す仕組みです。',
        },
        { kind: 'figure', figure: cdnFigure },
        {
          kind: 'callout',
          tone: 'info',
          title: 'CDNとDNSのつながり',
          body: 'どのエッジが近いかは、[[blue:DNS]]（第2章）が利用者ごとに近いエッジの住所を返して振り分けます。CDNは、第2章のDNSと第4章のHTTPキャッシュの応用でもあります。画像や動画などの大きなデータも、いまはCDNから配られることがほとんどです。',
        },
      ],
    },
    {
      heading: '午後の着眼点',
      blocks: [
        {
          kind: 'text',
          text: '午後では、LBの[[blue:VIPと戻り経路]]、TLSを[[blue:どこで終端]]するか（LBやリバースプロキシ）、[[blue:リバースとフォワードの区別]]がよく問われます。構成図で「利用者から見えるのはどれか」を追うのがコツです。',
        },
        {
          kind: 'check',
          label: '設問例',
          items: [
            {
              question:
                '利用者がVIP（172.16.0.10）のWebサイトへアクセスしたとき、処理するWebサーバが複数あるのに、利用者からは1台に見えるのはなぜか。',
              answer:
                'LBが代表IP（VIP）で受け、裏の複数サーバへ振り分けているためです。利用者に見えるのはVIPだけで、戻りの通信もLBを経由します。',
            },
          ],
        },
        {
          kind: 'text',
          text: 'ここまでの冗長化（LBによる複数台化）は、機器そのものを二重にして「止まらない」を目指す第11章の可用性へつながります。',
        },
      ],
    },
  ],
  takeaways: [
    '[[blue:ロードバランサ]]は代表IP（[[blue:VIP]]）で受け、裏の複数サーバへ振り分け。[[red:ヘルスチェック]]で停止台を外し、利用者に見えるのはVIPだけです。',
    '[[blue:L4]]はアドレスとポートで単純・高速、[[blue:L7]]はURLなど中身まで見て賢く振り分け。[[blue:TLS終端]]はL7の役目です。',
    '[[blue:リバースプロキシ]]はサーバ側の代理（外から受ける）、[[blue:フォワードプロキシ]]はクライアント側の代理（外へ出る）。立ち位置が逆です。',
    '[[blue:CDN]]は利用者の近くのエッジにキャッシュし、近くから配信。距離とオリジンの負荷を減らします。',
  ],
  checks: [
    {
      question: 'ロードバランサの「ヘルスチェック」は、何のためにあるか。',
      answer: '止まった・異常なサーバを検知して振り分け先から外し、生きているサーバだけに通信を渡すためです。',
    },
    {
      question: 'L7ロードバランサがL4にはできない振り分けをできるのは、何を見ているからか。',
      answer: 'URLやCookieなど、通信の中身（アプリケーション層）まで見ているからです。そのためにTLS終端も行います。',
    },
    {
      question: 'リバースプロキシとフォワードプロキシの、いちばんの違いは何か。',
      answer: 'どちら側の代理か、です。リバースはサーバ側の代理で外からの通信を受け、フォワードはクライアント側の代理で社内から外への通信を扱います。',
    },
  ],
}
