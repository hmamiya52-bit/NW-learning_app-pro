import type { NoteData } from './types'

export const proxy: NoteData = {
  summary: '復習ノート「プロキシサーバ」準拠。プロキシの目的・PACファイル・HTTPS時のCONNECT・復号処理を整理。',
  sections: [
    {
      heading: 'プロキシサーバの基礎',
      richItems: [
        [
          { text: 'プロキシサーバの目的：', style: 'plain' },
          { text: 'キャッシュ', style: 'red' },
          { text: ' によるアクセスの ', style: 'plain' },
          { text: '高速化', style: 'red' },
          { text: '／', style: 'plain' },
          { text: 'セキュリティ', style: 'red' },
          { text: ' の強化', style: 'plain' },
        ],
        [
          { text: 'プロキシサーバの設定は、PCのブラウザ設定画面から行う', style: 'plain' },
        ],
        [
          { text: 'プロキシ自動設定ファイル（', style: 'plain' },
          { text: 'PAC', style: 'red' },
          { text: ' ファイル）をWebサーバに登録する方法もある', style: 'plain' },
        ],
        [
          { text: 'PACのメリット：プログラムを書くことで柔軟な設定が可能（プロキシAがダウンしたらBに接続させる等）。PACは対応ブラウザだけが使える', style: 'plain' },
        ],
        [
          { text: 'プロキシサーバのログで取得できる情報：日時、送信元IPアドレス、接続先のURL、HTTPメソッド等', style: 'plain' },
        ],
      ],
    },
    {
      heading: 'HTTPS通信とプロキシ',
      richItems: [
        [
          { text: 'HTTPS通信において、', style: 'plain' },
          { text: 'CONNECT', style: 'red' },
          { text: ' メソッドを利用する目的：HTTPS通信であることをプロキシサーバに通知し、通信をそのまま通過させるように依頼する', style: 'plain' },
        ],
        [
          { text: '通常のプロキシサーバはHTTPS通信の暗号を ', style: 'plain' },
          { text: '復号できない', style: 'red' },
          { text: ' ⇒ 十分なセキュリティチェックが不可能（アンチウイルス、URLフィルタリング等ができない。URLも見えない＝データ部にあるため）', style: 'plain' },
        ],
        [
          { text: 'PC→プロキシサーバ→Webサーバの構成でHTTPS通信を行うとき、PCからWebサーバに向けて発出されるパケットの宛先IPアドレスは ', style: 'plain' },
          { text: 'プロキシサーバ', style: 'red' },
        ],
        [
          { text: 'プロキシサーバ経由でインターネット上のWebサーバに接続するとき、ドメインの名前解決は ', style: 'plain' },
          { text: 'プロキシサーバ', style: 'red' },
          { text: ' が行う', style: 'plain' },
        ],
      ],
    },
    {
      heading: 'プロキシサーバによる復号処理',
      richItems: [
        [
          { text: 'HTTPS通信であっても、セキュリティ対策のためプロキシサーバで復号処理をすることがある', style: 'plain' },
        ],
        [
          { text: '復号機能を持つプロキシサーバを介した通信の流れ：HTTPS通信をプロキシサーバで一旦終端する → 通信を復号してセキュリティチェックを行う → その後、再度暗号化してHTTPS通信を行う', style: 'plain' },
        ],
        [
          { text: 'PCとプロキシサーバ間でもHTTPS通信をするので、プロキシサーバに ', style: 'plain' },
          { text: 'サーバ証明書', style: 'red' },
          { text: ' が配置される。この証明書はプロキシサーバが生成する（ディジタル署名を付与するのはプロキシサーバ）', style: 'plain' },
        ],
        [
          { text: 'PCには、プロキシサーバの ', style: 'plain' },
          { text: 'ルート証明書', style: 'red' },
          { text: ' を入れる', style: 'plain' },
        ],
      ],
    },
  ],
  exam_tips: [
    'プロキシ目的：キャッシュ高速化＋セキュリティ強化',
    'CONNECTメソッド＝HTTPSトンネル要求',
    'HTTPS通信時の宛先IPは==プロキシ==、名前解決もプロキシが行う',
    'HTTPS復号のため、PCには==ルート証明書==を入れる',
  ],
}
