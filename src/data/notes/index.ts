// ノートモードのデータ集約
//
// カテゴリごとに 1 ファイル。段階的な改訂とレビューをしやすくするため、
// もとは NoteDetail.tsx に直書きされていた NOTE_DB をここへ分割している。

import type { NoteData } from './types'
import { layer1_3 } from './layer1-3'
import { layer4_7 } from './layer4-7'
import { firewall } from './firewall'
import { wireless } from './wireless'
import { routing } from './routing'
import { vrrp } from './vrrp'
import { wan } from './wan'
import { load_balancer } from './load-balancer'
import { dhcp } from './dhcp'
import { dns } from './dns'
import { mail } from './mail'
import { voip } from './voip'
import { ipsec } from './ipsec'
import { sdn } from './sdn'
import { security } from './security'
import { proxy } from './proxy'
import { network_mgmt } from './network-mgmt'
import { protocol_review } from './protocol-review'
import { iot } from './iot'
import { ssl_tls } from './ssl-tls'
import { threat } from './threat'
import { ipv6 } from './ipv6'

export * from './types'

// NOTE_DB に存在するカテゴリIDの順序リスト（前後ナビ用 / Notes 一覧フィルタ用）
export const NOTE_CATEGORY_IDS = [
  'layer1-3', 'layer4-7', 'firewall', 'wireless', 'routing',
  'vrrp', 'wan', 'load-balancer', 'dhcp', 'dns',
  'mail', 'voip', 'ipsec', 'sdn', 'ssl-tls',
  'security', 'threat', 'ipv6',
  'proxy', 'network-mgmt', 'protocol-review', 'iot',
]

export const NOTE_DB: Record<string, NoteData> = {
  'layer1-3': layer1_3,
  'layer4-7': layer4_7,
  'firewall': firewall,
  'wireless': wireless,
  'routing': routing,
  'vrrp': vrrp,
  'wan': wan,
  'load-balancer': load_balancer,
  'dhcp': dhcp,
  'dns': dns,
  'mail': mail,
  'voip': voip,
  'ipsec': ipsec,
  'sdn': sdn,
  'security': security,
  'proxy': proxy,
  'network-mgmt': network_mgmt,
  'protocol-review': protocol_review,
  'iot': iot,
  'ssl-tls': ssl_tls,
  'threat': threat,
  'ipv6': ipv6,
}

// ─────────────────────────────────────────────
// セクション見出しインデックス（Notes 一覧の検索機能で使用）
// ─────────────────────────────────────────────
export interface NoteSectionIndexEntry {
  categoryId: string
  sectionIndex: number
  heading: string
}

export const NOTE_SECTION_INDEX: NoteSectionIndexEntry[] = NOTE_CATEGORY_IDS.flatMap(
  (categoryId) => {
    const note = NOTE_DB[categoryId]
    if (!note) return []
    return note.sections.map((section, sectionIndex) => ({
      categoryId,
      sectionIndex,
      heading: section.heading,
    }))
  },
)
