import { ch01Osi } from './chapters/ch01-osi'
import { ch02DnsDhcp } from './chapters/ch02-dns-dhcp'
import { ch03TcpUdpPort } from './chapters/ch03-tcp-udp-port'
import type { TextbookChapter } from './types'

export type { TextbookChapter, Block, Section, Figure } from './types'

// 第2章以降は準備中（draft）。docs/textbook-curriculum-design.md のマップ（4部構成・
// 構成図の段階的成長）に沿って順に作る。順序＝学習の積み上げ＋構成図が育つ順。
const DRAFTS: [number, string, string, string][] = [
  // 第1部 まず1つの通信を最後まで（最小構成のままズーム）
  [4, 'web-tls-http', 'Web通信の中身（TLS・HTTP）', 'HTTPSの443の中で起きるTLSハンドシェイクと証明書、HTTPの要求応答を追います。'],
  // 第2部 ネットワークの土台を組む（構成図を育てる）
  [5, 'l2-vlan-stp', 'L2スイッチング・VLAN・STP', 'MAC学習・VLAN・タグVLAN・STPで、L2の広がりとループ防止を扱います。'],
  [6, 'ip-subnet', 'IPアドレス設計とサブネット', 'IPの構造・サブネット計算・CIDR・VLSMで、アドレス設計を読めるようにします。'],
  [7, 'routing', 'ルーティング（経路制御）', '経路表・ロンゲストマッチ・スタティック/ダイナミック(OSPF)・経路集約・経路選択を厚く扱います。'],
  [8, 'internet-nat-bgp', 'インターネット接続・NAT・BGP', 'プライベート/グローバル、NAPT、AS・BGPによる外部到達性を扱います。'],
  // 第3部 現実の構成へ（境界・拡張・冗長：午後スケール）
  [9, 'security-fw-dmz', 'セキュリティ境界・ファイアウォール・DMZ', 'FWの許可条件とステートフル、DMZによる三層境界の読み方を扱います。'],
  [10, 'lb-proxy-cdn', 'ロードバランサ・プロキシ・CDN', 'L4/L7負荷分散、リバース/フォワードプロキシ、CDNの配信経路を扱います。'],
  [11, 'availability', '冗長化・可用性・更改作業', '機器・経路・リンクの冗長、VRRP、フェイルオーバーと無停止更改を扱います。'],
  [12, 'vpn-wan-sdwan', '拠点間接続・VPN・WAN・SD-WAN', 'IPsec拠点間VPN、WAN、SD-WANのオーバーレイで複数拠点をつなぎます。'],
  [13, 'auth-sso-pki', '認証・認可・SSO・PKI', '認証と認可の違い、RADIUS、SSO、証明書チェーンとPKIを扱います。'],
  [14, 'wireless-lan', '無線LAN', 'AP・WLC・SSID・IEEE802.1X認証・ローミングを扱います。'],
  [15, 'ipv6', 'IPv6', 'IPv6アドレス、NDP、SLAAC、デュアルスタックでの移行を扱います。'],
  [16, 'mail', 'メール', 'SMTPの配送経路と、SPF・DKIM・DMARCの送信ドメイン認証を扱います。'],
  [17, 'virtualization-cloud', '仮想化・クラウド（SDN・VXLAN・EVPN）', 'サーバ仮想化、VPC、SDN、VXLAN/EVPNのオーバーレイを扱います。'],
  [18, 'voip-qos-multicast', 'VoIP・QoS・マルチキャスト', '音声(VoIP)、QoSの優先制御、マルチキャストを扱います。'],
  // 第4部 運用と総合
  [19, 'operations', '運用監視・障害切り分け', '監視(SNMP/syslog/フロー)と、障害切り分けの段取りを扱います。'],
  [20, 'afternoon-reading', '午後問題の読み方・総合演習', '積み上げた全体図と設問を使い、午後の構成図読解を総合演習します。'],
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

export const textbookChapters: TextbookChapter[] = [ch01Osi, ch02DnsDhcp, ch03TcpUdpPort, ...drafts].sort((a, b) => a.order - b.order)

export function getTextbookChapter(chapterId: string | undefined): TextbookChapter | undefined {
  if (!chapterId) return undefined
  return textbookChapters.find((chapter) => chapter.id === chapterId)
}

export function getPublishedTextbookChapters(): TextbookChapter[] {
  return textbookChapters.filter((chapter) => chapter.status === 'published')
}
