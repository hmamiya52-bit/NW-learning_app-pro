import type { Question } from '../../types'

export const dhcpQuestions: Question[] = [
  {
    id: 'q-030',
    topicId: 'dhcp',
    questionText: 'DHCPクライアントがIPアドレスを取得するまでの4段階のメッセージ交換を順番に並べると{{blank}}である。',
    correctAnswer: 'Discover → Offer → Request → Ack',
    choices: ['Discover → Offer → Request → Ack', 'Request → Offer → Discover → Ack', 'Offer → Discover → Ack → Request', 'Request → Discover → Offer → Ack'],
    isImportant: true,
    explanation: 'DORA（Discover/Offer/Request/Ack）とも呼ばれる。①Discover：ブロードキャストで探索 ②Offer：サーバが候補アドレスを提示 ③Request：クライアントが特定サーバを選択 ④Ack：サーバが確認応答してリース成立。',
    difficulty: 1,
  },
  {
    id: 'q-031',
    topicId: 'dhcp',
    questionText: 'DHCPクライアントと異なるサブネットにDHCPサーバが存在する場合、DHCP Discoverを中継する機能を持つ機器を{{blank}}という。',
    correctAnswer: 'DHCPリレーエージェント',
    choices: ['DHCPリレーエージェント', 'DHCPプロキシ', 'DHCPフォワーダ', 'DHCPブリッジ'],
    isImportant: true,
    explanation: 'DHCP DiscoverはブロードキャストのためルータをまたげないDHCPリレーエージェント（通常はルータ）が、Discoverをユニキャストに変換して別セグメントのDHCPサーバに転送する。',
    difficulty: 2,
  },
  {
    id: 'q-032',
    topicId: 'dhcp',
    questionText: '攻撃者がDHCPサーバに大量のDHCP Discoverを送り、アドレスプールを枯渇させる攻撃を{{blank}}という。',
    correctAnswer: 'DHCPスターベーション攻撃',
    choices: ['DHCPスターベーション攻撃', 'DHCPスプーフィング攻撃', 'ARPスプーフィング攻撃', 'DHCPフラッディング攻撃'],
    isImportant: false,
    explanation: 'DHCPスターベーションはアドレスプールを枯渇させて正規クライアントにIPを配布できなくするDoS攻撃。偽DHCPサーバを立て中間者攻撃に発展させることもある。対策はDHCPスヌーピング。',
    difficulty: 2,
  },
  {
    id: 'q-033',
    topicId: 'dhcp',
    questionText: 'DHCPスヌーピングとは、スイッチポートを{{blank}}ポートと{{blank}}ポートに分類してDHCPメッセージをフィルタリングする機能である。',
    correctAnswer: 'トラステッド（信頼）・アントラステッド（非信頼）',
    choices: ['トラステッド（信頼）・アントラステッド（非信頼）', 'アップリンク・ダウンリンク', 'トランク・アクセス', 'タグ付き・タグなし'],
    isImportant: false,
    explanation: 'DHCPスヌーピングはスイッチ機能で、DHCPサーバ側ポートをトラステッドに設定する。アントラステッドポートからのDHCP Offer/Ackをブロックして偽DHCPサーバを防止する。',
    difficulty: 3,
  },
]
