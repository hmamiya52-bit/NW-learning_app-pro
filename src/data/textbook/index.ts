import { ch01Osi } from './chapters/ch01-osi'
import type { TextbookChapter } from './types'

export type { TextbookChapter, Block, Section, Figure } from './types'

// 第2章以降は準備中（draft）。本文・図解は順次、段階的複雑化に沿って作る。
const DRAFTS: [number, string, string, string][] = [
  [2, 'tcp-udp-port', 'TCP/UDPとポート番号', 'L4の役割、TCPとUDPの違い、ポート番号と5タプルを読めるようにします。'],
  [3, 'dns-dhcp-arp', 'DNS・DHCP・ARP', '通信を始める前の準備（名前解決・IP配布・MAC解決）を整理します。'],
  [4, 'web-tls-http', 'Web通信・TLS・HTTP', 'WebアクセスをDNS→TCP→TLS→HTTPの順で追います。'],
  [5, 'l2-vlan-stp', 'L2スイッチング・VLAN・STP', '物理構成と論理構成、VLAN、ループ防止を扱います。'],
  [6, 'routing-ospf', 'IPアドレス・サブネットとルーティング', 'IPアドレス設計とサブネット計算から、経路表・OSPFまでを扱います。'],
  [7, 'internet-nat-bgp', 'インターネット接続・NAT・BGP', 'グローバル/プライベート、NAT/NAPT、AS・BGPによる外部到達性を扱います。'],
  [8, 'availability', '冗長化・可用性・更改作業', '冗長化・切替・更改の勘所を扱います。'],
  [9, 'lb-proxy-cdn', 'ロードバランサ・プロキシ・CDN', '負荷分散とコンテンツ配信の経路を扱います。'],
  [10, 'vpn-wan-sdwan', 'VPN・WAN・SD-WAN', '拠点間接続とオーバーレイを扱います。'],
  [11, 'security-fw-swg', 'セキュリティ境界・FW・SWG', '境界防御と許可条件の読み方を扱います。'],
  [12, 'auth-sso-pki', '認証・認可・SSO・PKI', '認証連携と証明書の流れを扱います。'],
  [13, 'wireless-lan', '無線LAN', 'AP・コントローラ・認証を扱います。'],
  [14, 'ipv6', 'IPv6', 'アドレス体系と近隣探索を扱います。'],
  [15, 'mail', 'メール', 'SMTP配送と送信ドメイン認証を扱います。'],
  [16, 'virtualization-cloud', '仮想化・クラウド・SDN/VXLAN/EVPN', 'オーバーレイと仮想ネットワークを扱います。'],
  [17, 'voip-qos-multicast', 'VoIP・QoS・マルチキャスト', 'QoSと音声(VoIP)、午後で問われ始めたマルチキャストを扱います。'],
  [18, 'iot-lpwa', 'IoT・LPWA（概要）', 'IoT向けの省電力通信を概要だけ押さえます（深追いしません）。'],
  [19, 'operations', '運用監視・障害切分け', '監視と切り分けの段取りを扱います。'],
  [20, 'afternoon-reading', '午後問題の読み方総合演習', '構成図と設問の読解を総合演習します。'],
]

const drafts: TextbookChapter[] = DRAFTS.map(([order, id, title, summary]) => ({
  id,
  order,
  title,
  summary,
  status: 'draft',
  estimatedMinutes: 0,
  intro: [],
  sections: [],
  takeaways: [],
}))

export const textbookChapters: TextbookChapter[] = [ch01Osi, ...drafts].sort((a, b) => a.order - b.order)

export function getTextbookChapter(chapterId: string | undefined): TextbookChapter | undefined {
  if (!chapterId) return undefined
  return textbookChapters.find((chapter) => chapter.id === chapterId)
}

export function getPublishedTextbookChapters(): TextbookChapter[] {
  return textbookChapters.filter((chapter) => chapter.status === 'published')
}
