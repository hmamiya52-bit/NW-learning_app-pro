import type { Question } from '../../types'

export const voipQuestions: Question[] = [
  {
    id: 'q-120',
    topicId: 'voip',
    questionText: 'VoIPで音声データをリアルタイム転送するために使われるプロトコルを{{blank}}という。',
    correctAnswer: 'RTP（Real-time Transport Protocol）',
    choices: ['RTP（Real-time Transport Protocol）', 'SIP', 'H.323', 'RTSP'],
    isImportant: true,
    explanation: 'RTPはUDP上で音声・映像をリアルタイム転送するプロトコル。シーケンス番号とタイムスタンプを持ち、受信側での並び替えとジッタ補正を可能にする。',
    difficulty: 2,
  },
  {
    id: 'q-121',
    topicId: 'voip',
    questionText: 'VoIPのシグナリングに使われるプロトコルで、セッション確立・変更・切断を制御するものを{{blank}}という。',
    correctAnswer: 'SIP（Session Initiation Protocol）',
    choices: ['SIP（Session Initiation Protocol）', 'RTP', 'MGCP', 'MEGACO'],
    isImportant: true,
    explanation: 'SIPはHTTPライクなテキストプロトコルでVoIPセッションを制御する。INVITEでセッション確立、BYEで切断を行う。メディアデータ自体はRTPで転送する。',
    difficulty: 2,
  },
  {
    id: 'q-122',
    topicId: 'voip',
    questionText: '音声パケットの到着間隔のばらつきを{{blank}}という。これを吸収するバッファを{{blank}}という。',
    correctAnswer: 'ジッタ・ジッタバッファ',
    choices: ['ジッタ・ジッタバッファ', '遅延・遅延バッファ', 'パケットロス・再送バッファ', 'レイテンシ・QoSバッファ'],
    isImportant: false,
    explanation: 'ジッタはネットワーク輻輳等でパケット到着間隔が不均一になる現象。ジッタバッファは一定量のパケットを蓄積してから再生し、音声品質を改善する。バッファが大きいほど遅延は増加する。',
    difficulty: 2,
  },
  {
    id: 'q-123',
    topicId: 'voip',
    questionText: 'VoIPでQoSを確保するためにIPヘッダのTOSフィールドを使ってトラフィックを分類するマーキング方式を{{blank}}という。',
    correctAnswer: 'DSCP（Differentiated Services Code Point）',
    choices: ['DSCP（Differentiated Services Code Point）', 'VLAN優先度（CoS）', 'ToS IP Precedence', 'MPLS EXP'],
    isImportant: false,
    explanation: 'DSCPはIPヘッダのTOSフィールド上位6ビットを使いトラフィッククラスを識別する。VoIPには通常EF（Expedited Forwarding）クラスが割り当てられ低遅延・低ジッタが保証される。',
    difficulty: 3,
  },
]
