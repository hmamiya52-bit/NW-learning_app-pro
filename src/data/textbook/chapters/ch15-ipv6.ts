import type { AddressTableFigure, Ipv6AddressFigure, SequenceFigure, TextbookChapter, TimelineFigure } from '../types'

// 第15章 IPv6。第6章IPv4アドレス・第1章ARPとの対比で入る。枯渇の根本解決＝IPv6。
// 表記と構造（新図 ipv6-address） → ARPの代わりにNDP → SLAACとデュアルスタック。
// 構成図は変わらない（既存ノードにIPv6を重ねる＝オーバーレイ）。内部LANのIPv6は 2001:db8:10:1::/64（文書用）。

// §1 IPv4 vs IPv6（address-table＋fieldLabels）。軸は「長さ／枯渇への答え／表記の例」。
const v4v6Table: AddressTableFigure = {
  kind: 'address-table',
  id: 'ch15-v4-v6',
  title: 'IPv4とIPv6——延命策と根本解決',
  caption: 'アドレスの[[blue:数]]への答え方が、2つの世界の分かれ目です。',
  takeaway: 'IPv4は「共有してしのぐ」（NAT・第8章）、IPv6は「数そのものを増やす」。似た顔でも思想が違います。',
  fieldLabels: { carries: 'アドレスの長さ', scope: '枯渇への答え', example: '表記の例' },
  rows: [
    {
      name: 'IPv4',
      layer: '32ビット',
      carries: '約43億個——世界の機器には足りません',
      scope: 'プライベートIPとNATで共有し、延命（第8章)',
      example: '192.168.10.10',
      tone: 'blue',
    },
    {
      name: 'IPv6',
      layer: '128ビット',
      carries: 'ほぼ無限——全機器に固有の住所を配れます',
      scope: 'アドレスの総数そのものを増やす根本解決',
      example: '2001:db8:10:1::10',
      tone: 'emerald',
    },
  ],
}

// §1 表記と構造（新図）。フル→省略→前半/後半。内部LANのPCのIPv6例。
const addrFigure: Ipv6AddressFigure = {
  kind: 'ipv6-address',
  id: 'ch15-addr',
  title: 'IPv6アドレスの読み方——省略と構造',
  caption: '16進数4桁×8グループ。ステップを送ると、[[blue:省略のルール]]と[[green:前半・後半の意味]]が分かります。',
  takeaway: '表記がどれだけ縮んでも、[[green:128ビット]]という長さ自体は変わりません。省略は見た目だけの話です。',
  groups: ['2001', '0db8', '0010', '0001', '0000', '0000', '0000', '0010'],
  compressed: '2001:db8:10:1::10',
  steps: [
    {
      mode: 'full',
      explanation: 'IPv6は128ビット。16進数4桁×8グループを、コロンで区切って書きます。長い……。',
    },
    {
      mode: 'compressed',
      explanation: '各グループの先頭の0は省略。0だけのグループの連続は::に。ただし::は1か所だけです。',
    },
    {
      mode: 'structure',
      explanation: '前半64ビットがネットワーク、後半がホスト。第6章の「前半・後半」の発想のままです。',
    },
  ],
}

// §2 NDP（sequence）。第1章ARPの仕事をIPv6ではNDPが担う。
const ndpFigure: SequenceFigure = {
  kind: 'sequence',
  id: 'ch15-ndp',
  title: '相手のMACを知る——NDPの近隣要請と近隣告知',
  caption: 'IPv6でのMACアドレス解決。[[blue:第1章のARP]]と同じ仕事を、[[green:NDP]]が引き受けます。',
  takeaway: 'ARP＝IPv4／NDP＝IPv6。道具は変わっても「次に渡す相手のMACを知る」仕事は同じです。',
  actors: [
    { id: 'pc', label: 'PC', sub: '2001:db8:10:1::10', role: 'pc' },
    { id: 'r', label: 'ルータ', sub: 'デフォルトGW', role: 'router' },
  ],
  messages: [
    {
      from: 'pc',
      to: 'r',
      label: '① 近隣要請（NS）',
      style: 'broadcast',
      note: '「このIPv6アドレスの人、MACを教えて」。第1章のARP要求と同じ問いかけです。',
    },
    {
      from: 'r',
      to: 'pc',
      label: '② 近隣告知（NA）',
      note: '「私です。MACはこれ」。ARP応答にあたる返事で、以後フレームを作れます。',
    },
  ],
}

// §3 SLAAC（timeline）。RAのプレフィックス＋自作のIDで、DHCPなしに住所が決まる。
const slaacFigure: TimelineFigure = {
  kind: 'timeline',
  id: 'ch15-slaac',
  title: 'DHCPなしで住所が決まる——SLAAC',
  caption: 'PCは[[blue:ルータ広告（RA）]]を聞き、自分でアドレスを組み立てます。',
  takeaway: 'ネットワーク部はルータから、ホスト部は自分で。だから配布サーバがなくても住所が決まります。',
  items: [
    {
      badge: '①',
      label: 'ルータへの呼びかけ（RS）',
      detail: 'つないだPCが「このネットワークのルータはいますか」と尋ねます（ルータ要請）。',
      tone: 'sky',
    },
    {
      badge: '②',
      label: 'ルータ広告（RA）の受信',
      detail: 'ルータが「ここのプレフィックスは 2001:db8:10:1::/64」と教えてくれます。',
      tone: 'blue',
    },
    {
      badge: '③',
      label: '後半を自分で生成',
      detail: '教わった前半に、自分で作ったインターフェースIDをつなげて完成です。',
      tone: 'emerald',
    },
    {
      badge: '④',
      label: '重複がないかを確認',
      detail: '同じアドレスの人がいないか、近隣要請（NS）で最終チェックします。',
      tone: 'violet',
    },
  ],
}

export const ch15Ipv6: TextbookChapter = {
  id: 'ipv6',
  order: 15,
  title: 'IPv6',
  summary:
    'IPv4の枯渇をNATで延命してきた世界に対する根本解決——それがアドレスを128ビットに増やしたIPv6です。16進8グループの表記と::の省略ルール、前半・後半の構造、ARPの仕事を引き継ぐNDP、DHCPなしの自動設定SLAAC、そして現実的な移行方法のデュアルスタックまでを読み解きます。',
  status: 'published',
  estimatedMinutes: 12,
  intro: [
    {
      kind: 'text',
      text: 'IPv4のアドレスは[[blue:32ビット＝約43億個]]。世界の人口より少なく、スマホもサーバもセンサも数えれば、とうに足りません。第8章では[[blue:NAT]]とプライベートIPで「共有してしのぐ」延命策を見ました。',
    },
    {
      kind: 'text',
      text: 'この章はその先——アドレスそのものを増やした[[green:IPv6]]です。長いアドレスの読み方、ARPに代わる[[green:NDP]]、DHCPなしの自動設定[[green:SLAAC]]、そして現実的な移行のかたち（[[blue:デュアルスタック]]）まで。見た目は大きく変わりますが、発想の芯は今までと同じです。',
    },
  ],
  sections: [
    {
      heading: 'IPv6アドレスの形——長いが、発想は同じ',
      blocks: [
        {
          kind: 'text',
          text: 'まず、IPv4との違いを一望します。ポイントは、枯渇という同じ問題への[[blue:答え方の違い]]です。',
        },
        { kind: 'figure', figure: v4v6Table },
        {
          kind: 'text',
          text: '次に、あの長いアドレスの読み方です。内部LANのPCに [[green:2001:db8:10:1::10]] というIPv6アドレスが付いたとして、フル表記から順に見ていきます。',
        },
        { kind: 'figure', figure: addrFigure },
        {
          kind: 'callout',
          tone: 'tip',
          title: '::が1か所だけの理由',
          body: 'もし::を2か所に使うと、それぞれに0のグループが何個入るのか復元できなくなります。だから[[green:::は1つのアドレスに1回だけ]]。省略を戻す問題は午後の定番です。',
        },
      ],
    },
    {
      heading: 'ARPの代わりにNDP',
      blocks: [
        {
          kind: 'text',
          text: 'IPv6の世界に[[blue:ARP]]はありません。同じLANの相手にフレームを届けるため「IPからMACを知る」仕事（第1章）は、[[green:NDP]]（近隣探索）が引き継ぎます。ICMPv6のメッセージとして動く仕組みです。',
        },
        { kind: 'figure', figure: ndpFigure },
        {
          kind: 'callout',
          tone: 'info',
          title: 'NDPの道具は4つ',
          body: 'MAC解決の[[green:近隣要請（NS）]]・[[green:近隣告知（NA）]]に加えて、[[blue:ルータ要請（RS）]]・[[blue:ルータ広告（RA）]]もNDPの仲間。RS/RAは、次の自動設定（SLAAC）で主役になります。',
        },
      ],
    },
    {
      heading: 'SLAACとデュアルスタック——自動設定と移行',
      blocks: [
        {
          kind: 'text',
          text: 'IPv6にはもう1つ特技があります。[[green:SLAAC]]——DHCPサーバがいなくても、PCが自分で住所を組み立てられる自動設定です。',
        },
        { kind: 'figure', figure: slaacFigure },
        {
          kind: 'text',
          text: 'では、世界は明日からIPv6に切り替わるのか——実際は長い併存期間が続きます。その現実解が[[blue:デュアルスタック]]。1台の機器にIPv4とIPv6の[[blue:両方の住所]]を持たせ、相手に合わせて使い分けます。',
        },
        {
          kind: 'callout',
          tone: 'info',
          title: '構成図は変わりません',
          body: 'デュアルスタックにしても、機器と配線はそのまま。内部LAN（192.168.10.0/24）の面々に、[[green:IPv6の住所]]がもう1つ重なるだけです。相手がIPv6ならIPv6で、IPv4だけの相手にはIPv4で話します。',
        },
      ],
    },
    {
      heading: '午後の着眼点——表記と移行',
      blocks: [
        {
          kind: 'text',
          text: 'IPv6の午後は、①[[green:表記]]（::の省略と展開）、②[[blue:移行構成]]（デュアルスタックの読み取り）、③[[blue:ARP↔NDP]]の対応、の3点が定番です。まずは表記の手を動かしましょう。',
        },
        {
          kind: 'check',
          label: '設問例',
          items: [
            {
              question: '2001:db8:0:0:0:0:0:100 というIPv6アドレスは、::を使ってどのように短く表記できるか。',
              answer:
                '2001:db8::100 です。0だけのグループの連続を::で1回だけ省略できます。逆に::を見たら、全体が8グループになるように0のグループを補って読みます。',
            },
          ],
        },
        {
          kind: 'text',
          text: 'もう1つ、IPv6だけの端末とIPv4だけの相手をつなぐ変換の仕組みとして[[blue:NAT64]]という名前があります。移行期の道具として、名前だけ押さえておけば大丈夫です。',
        },
      ],
    },
  ],
  takeaways: [
    '[[green:IPv6]]は128ビット。NATによる延命ではなく、アドレスの数そのものを増やす根本解決です。',
    '表記は16進8グループ。先頭の0は省略でき、0の連続は[[green:::]]に1か所だけ。前半ネットワーク・後半ホストは第6章の発想のままです。',
    '[[blue:ARP]]の仕事は、IPv6では[[green:NDP]]の近隣要請（NS）・近隣告知（NA）が引き継ぎます。',
    '[[green:SLAAC]]はRAで教わった前半＋自作の後半で住所が決まる自動設定。移行の現実解は[[blue:デュアルスタック]]です。',
  ],
  checks: [
    {
      question: 'NATによるIPv4の延命と比べて、IPv6が「根本解決」と呼ばれるのはなぜか。',
      answer:
        'NATは限られたアドレスを共有してしのぐ工夫ですが、IPv6は128ビットでアドレスの総数そのものを増やします。共有や変換に頼らず、全機器に固有のアドレスを配れるからです。',
    },
    {
      question: 'IPv4のARPが担っていた仕事は、IPv6では何がどのように引き継ぐか。',
      answer:
        'NDP（近隣探索）です。近隣要請（NS）で「このIPv6アドレスの人は？」と尋ね、相手が近隣告知（NA）でMACアドレスを返します。',
    },
    {
      question: 'SLAACでは、DHCPサーバがいないのにPCのアドレスが決まります。前半と後半は、それぞれどこから来るか。',
      answer:
        '前半（プレフィックス）はルータ広告（RA）から教わり、後半（インターフェースID）はPCが自分で生成します。最後に、重複がないかを近隣要請（NS）で確かめます。',
    },
  ],
}
