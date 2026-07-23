import type { NoteData } from './types'

export const routing: NoteData = {
  summary: '復習ノート「ルーティング」準拠。RIP（距離ベクトル型）・OSPF（リンクステート型）・BGP（パスベクトル型）を整理。',
  sections: [
    {
      heading: 'ルーティングの分類',
      richItems: [
        [
          { text: '静', style: 'red' },
          { text: ' 的ルーティング：ルータに「手動」で記載する', style: 'plain' },
        ],
        [
          { text: '動', style: 'red' },
          { text: ' 的ルーティング：ルータ同士で経路情報を交換する', style: 'plain' },
        ],
        [
          { text: '動的のメリット：', style: 'plain' },
          { text: '自動で最適なルート選択', style: 'red' },
          { text: ' が可能／', style: 'plain' },
          { text: '障害時に自動で経路変更', style: 'red' },
          { text: ' が可能／設定が ', style: 'plain' },
          { text: '簡単', style: 'red' },
          { text: ' になる', style: 'plain' },
        ],
        [
          { text: 'ルーティングループ：2つの機器間でデフォルトルートが互いを向いていたらループが発生する（構成変更の問題でありがち）', style: 'plain' },
        ],
        [
          { text: 'ポリシーベース', style: 'red' },
          { text: ' ルーティング：特定のポート、IPアドレスを識別してルーティング', style: 'plain' },
        ],
      ],
    },
    {
      heading: 'RIP',
      richItems: [
        [
          { text: '距離ベクトル型アルゴリズムを用いたルーティング', style: 'plain' },
        ],
        [
          { text: '距離は通過するルータの数である ', style: 'plain' },
          { text: 'ホップ数', style: 'red' },
          { text: ' で表す', style: 'plain' },
        ],
        [
          { text: '問題点①：', style: 'plain' },
          { text: '経路変更に時間がかかる', style: 'red' },
          { text: '（経路集束に最大3分）', style: 'plain' },
        ],
        [
          { text: '問題点②：ホップ数だけで判断するので、ネットワークの ', style: 'plain' },
          { text: '回線速', style: 'red' },
          { text: '度', style: 'red' },
          { text: ' を考慮できない（最適な経路を選べない）', style: 'plain' },
        ],
        [
          { text: 'RIPのルーティング情報の更新方式に使うフレームの種類：', style: 'plain' },
          { text: 'ブ', style: 'red' },
          { text: 'ロード', style: 'red' },
          { text: 'キャスト', style: 'plain' },
        ],
      ],
    },
    {
      heading: 'OSPF',
      richItems: [
        [
          { text: 'Open Shortest Path First — ', style: 'plain' },
          { text: 'リンクステート', style: 'red' },
          { text: ' 型アルゴリズムを使用', style: 'plain' },
        ],
        [
          { text: '経路選択において、回線速度を考慮するために、', style: 'plain' },
          { text: 'コスト', style: 'red' },
          { text: ' という概念を導入', style: 'plain' },
        ],
        [
          { text: 'OSPFではネットワークをエリアと呼ぶ単位に分割する。目的：', style: 'plain' },
          { text: 'ルータ負荷を軽減', style: 'red' },
          { text: ' する', style: 'plain' },
        ],
        [
          { text: '必ず存在する必要があるエリア：', style: 'plain' },
          { text: 'バックボーン', style: 'red' },
          { text: 'エリア（エリア番号：', style: 'plain' },
          { text: '0', style: 'red' },
          { text: '）', style: 'plain' },
        ],
        [
          { text: 'エリア0とその他のエリアを相互接続するルータを ', style: 'plain' },
          { text: 'エ', style: 'red' },
          { text: 'リア境界ルータ', style: 'red' },
          { text: '（', style: 'plain' },
          { text: 'ABR', style: 'red' },
          { text: '）という。ABRではエリア内の経路情報を ', style: 'plain' },
          { text: '集約', style: 'red' },
          { text: ' して他のエリアに送る（ルータの負荷軽減・集束時間短縮）', style: 'plain' },
        ],
        [
          { text: '大規模NWではセグメント内に複数ルータが存在することもあり、全ルータが経路交換するのは無駄。セグメント内で経路情報の交換を行うルータを ', style: 'plain' },
          { text: '代表ルータ（DR）', style: 'red' },
          { text: ' および ', style: 'plain' },
          { text: 'バックアップ代表', style: 'red' },
          { text: ' ', style: 'plain' },
          { text: 'ルータ（BDR）', style: 'red' },
          { text: ' として定める', style: 'plain' },
        ],
        [
          { text: '選出方法：OSPFの ', style: 'plain' },
          { text: 'プライオリティ', style: 'red' },
          { text: ' が高いルータからDR、BDRになる。選出されたくない場合は ', style: 'plain' },
          { text: '0', style: 'red' },
          { text: ' にする', style: 'plain' },
        ],
        [
          { text: 'OSPFのルーティング情報の更新方式に使うフレームの種類：', style: 'plain' },
          { text: 'マルチ', style: 'red' },
          { text: ' キャスト', style: 'plain' },
        ],
        [
          { text: 'OSPFルータは、', style: 'plain' },
          { text: '隣接', style: 'red' },
          { text: ' するルータ同士で ', style: 'plain' },
          { text: 'リンクステートアドバ', style: 'red' },
          { text: 'タイズメント', style: 'red' },
          { text: '（', style: 'plain' },
          { text: 'LSA', style: 'red' },
          { text: '）と呼ばれる情報を交換し、NW内のリンク情報を集めてLSDB（Link State Data Base）を構築', style: 'plain' },
        ],
        [
          { text: 'OSPFの各ルータは、集めたLSAを基に ', style: 'plain' },
          { text: 'ダイクストラ', style: 'red' },
          { text: ' アルゴリズムを用いた最短経路計算を行い、ルーティングテーブルを動的に作成', style: 'plain' },
        ],
        [
          { text: 'ループバックインタフェース：仮想的なインタフェース。複数の物理インタフェースに付与して ', style: 'plain' },
          { text: '物理冗長', style: 'red' },
          { text: ' を図る（OSPFが一緒に動作されることが多い）', style: 'plain' },
        ],
      ],
    },
    {
      heading: 'OSPF — LSAタイプ',
      richItems: [
        [
          { text: 'Type1 ルータLSA：', style: 'plain' },
          { text: '全ルータ', style: 'red' },
          { text: ' が生成。ルータ自身に関する情報（接続情報やコスト）を他のルータに伝達', style: 'plain' },
        ],
        [
          { text: 'Type2 ネットワークLSA：', style: 'plain' },
          { text: 'DR（代表', style: 'red' },
          { text: ' ルータ）が生成。', style: 'plain' },
          { text: 'エリア内', style: 'red' },
          { text: ' ルータの接続情報をエリア内のルータに伝達', style: 'plain' },
        ],
        [
          { text: 'Type3 サマリーLSA：', style: 'plain' },
          { text: 'ABR（境界', style: 'red' },
          { text: ' ルータ）が生成。各エリアの経路情報を他のエリアに伝達', style: 'plain' },
        ],
        [
          { text: 'Type4 ASBRサマリーLSA：', style: 'plain' },
          { text: 'ABR', style: 'red' },
          { text: ' が生成。', style: 'plain' },
          { text: 'ASBR', style: 'red' },
          { text: ' から受信した経路情報を他のエリアに伝達', style: 'plain' },
        ],
        [
          { text: 'Type5 外部LSA：', style: 'plain' },
          { text: 'ASBR（再', style: 'red' },
          { text: ' 配布するルータ）が生成。', style: 'plain' },
          { text: '外部NW', style: 'red' },
          { text: '（BGP等）から受信した経路情報を他のルータに伝達', style: 'plain' },
        ],
      ],
    },
    {
      heading: 'BGP',
      richItems: [
        [
          { text: 'Border Gateway Protocol — BGPにおいて単一のルーティングポリシによって管理されるネットワーク ⇒ ', style: 'plain' },
          { text: 'AS', style: 'red' },
          { text: '（自律システム）', style: 'plain' },
        ],
        [
          { text: 'AS間のルーティング：EGP（BGP等）／AS内のルーティング：IGP（OSPF, RIP等）', style: 'plain' },
        ],
        [
          { text: 'BGPは ', style: 'plain' },
          { text: 'パスベクトル', style: 'red' },
          { text: ' 型アルゴリズムを使用', style: 'plain' },
        ],
        [
          { text: 'AS', style: 'red' },
          { text: 'パス（', style: 'plain' },
          { text: 'PATH', style: 'red' },
          { text: '）の情報によって経路情報を決定。ASパスには通過したAS番号が書き込まれ、自身のAS番号が含まれていたら ', style: 'plain' },
          { text: 'ループ', style: 'red' },
          { text: ' していると判断し経路情報を ', style: 'plain' },
          { text: '破棄', style: 'red' },
        ],
        [
          { text: 'BGP接続を行うルータ間の経路情報交換：', style: 'plain' },
          { text: 'BGPピア', style: 'red' },
          { text: '（ポート番号：', style: 'plain' },
          { text: 'TCP', style: 'red' },
          { text: '/', style: 'plain' },
          { text: '179', style: 'red' },
          { text: '）', style: 'plain' },
        ],
        [
          { text: '異なるルーティングプロトコルでは経路交換ができない。OSPFで学習した経路情報をBGPが動作するNWに通知する方法 ⇒ ', style: 'plain' },
          { text: '再配布', style: 'red' },
          { text: '。再配布された経路を再配布するとループが発生するので、基本的に再々配布は ', style: 'plain' },
          { text: 'しない', style: 'red' },
          { text: ' 設定にする', style: 'plain' },
        ],
        [
          { text: '1つのルータが複数の経路情報を受け取ったときは、ルーティングプロトコルの ', style: 'plain' },
          { text: 'アドミニストレーティブディスタンス', style: 'red' },
          { text: ' 値が ', style: 'plain' },
          { text: '小さい', style: 'red' },
          { text: ' 方が優先される（優先度高 ', style: 'plain' },
          { text: 'BGP', style: 'red' },
          { text: ' < ', style: 'plain' },
          { text: 'OSPF', style: 'red' },
          { text: ' < RIP 優先度低）', style: 'plain' },
        ],
        [
          { text: 'BGPで設定する優先度：MEDとLOCAL_PREF。前者はeBGP（外部）、後者は', style: 'plain' },
          { text: 'i', style: 'red' },
          { text: 'BGP（内部）に通知', style: 'plain' },
        ],
        [
          { text: '最適経路選択をする際、ASパスの長さが最も ', style: 'plain' },
          { text: '短い', style: 'red' },
          { text: ' 経路が優先され、同じ場合、MEDの値が小さい経路が優先される', style: 'plain' },
        ],
        [
          { text: 'BGPにおいて、同じコストの経路を複数設定することで経路の負荷分散を行う技術：', style: 'plain' },
          { text: 'BGPマルチパス', style: 'red' },
        ],
        [
          { text: 'BGPでは、', style: 'plain' },
          { text: 'KEEPALIVEメッセージ', style: 'red' },
          { text: ' を定期的に送信する。受信しなくなることでピアリングが切断され、AS内の各機器は経路情報をクリア・更新する', style: 'plain' },
        ],
        [
          { text: 'iBGP — 同一AS内のBGP。ネクストホップを自身のIPアドレスに書き換える／別のルータに経路をアドバタイズしない（ループ防止）／通常フルメッシュ構成にする', style: 'plain' },
        ],
        [
          { text: 'ルートリフレクタ：iBGPで経路情報を他のルータに反射 ⇒ iBGPの ', style: 'plain' },
          { text: 'ピア', style: 'red' },
          { text: ' を減らせる。ループ防止のため ', style: 'plain' },
          { text: 'クラスター', style: 'red' },
          { text: 'IDを設定し、自分のクラスターIDが含まれた経路広告は破棄する', style: 'plain' },
        ],
        [
          { text: 'プライベートAS：プライベートIPのAS版。組織が自由に使える', style: 'plain' },
        ],
      ],
    },
  ],
  exam_tips: [
    'RIPは==ホップ数==／OSPFは==コスト==／BGPは==ASパス==',
    'OSPFの経路集束は ABR で ==集約== することで高速化',
    'OSPFのDR/BDRはマルチキャストで効率化（==224.0.0.5/6==）',
    'BGPは==TCP/179==。LSDB・LSAタイプはOSPFの典型出題',
    '優先度高 ==BGP < OSPF < RIP== 低',
  ],
}
