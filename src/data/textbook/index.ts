import { ch01Osi } from './chapters/ch01-osi'
import { ch02DnsDhcp } from './chapters/ch02-dns-dhcp'
import { ch03TcpUdpPort } from './chapters/ch03-tcp-udp-port'
import { ch04WebTlsHttp } from './chapters/ch04-web-tls-http'
import { ch05L2VlanStp } from './chapters/ch05-l2-vlan-stp'
import { ch06IpSubnet } from './chapters/ch06-ip-subnet'
import { ch07Routing } from './chapters/ch07-routing'
import { ch08InternetNatBgp } from './chapters/ch08-internet-nat-bgp'
import { ch09SecurityFwDmz } from './chapters/ch09-security-fw-dmz'
import { ch10LbProxyCdn } from './chapters/ch10-lb-proxy-cdn'
import { ch11Availability } from './chapters/ch11-availability'
import type { TextbookChapter } from './types'

export type { TextbookChapter, Block, Section, Figure } from './types'

// 第2章以降は準備中（draft）。docs/textbook-curriculum-design.md のマップ（4部構成・
// 構成図の段階的成長）に沿って順に作る。順序＝学習の積み上げ＋構成図が育つ順。
const DRAFTS: [number, string, string, string][] = [
  // 第3部 現実の構成へ（境界・拡張・冗長：午後スケール）
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

export const textbookChapters: TextbookChapter[] = [ch01Osi, ch02DnsDhcp, ch03TcpUdpPort, ch04WebTlsHttp, ch05L2VlanStp, ch06IpSubnet, ch07Routing, ch08InternetNatBgp, ch09SecurityFwDmz, ch10LbProxyCdn, ch11Availability, ...drafts].sort((a, b) => a.order - b.order)

export function getTextbookChapter(chapterId: string | undefined): TextbookChapter | undefined {
  if (!chapterId) return undefined
  return textbookChapters.find((chapter) => chapter.id === chapterId)
}

export function getPublishedTextbookChapters(): TextbookChapter[] {
  return textbookChapters.filter((chapter) => chapter.status === 'published')
}
