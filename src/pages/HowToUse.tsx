import { Link } from 'react-router-dom'

/**
 * アプリの使い方（独立ページ）
 *  - 学習メニューのボタンから遷移
 *  - 3セクション構成：ノートモード／問題演習／午後問題演習補助ツール
 */
export default function HowToUse() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
      <div className="max-w-3xl mx-auto px-4 pt-6 pb-16">
        {/* ヘッダ */}
        <div className="flex items-center gap-3 mb-6">
          <span
            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
            style={{ backgroundColor: '#dbeafe', color: '#1d4ed8' }}
            aria-hidden="true"
          >
            📘
          </span>
          <div>
            <h1 className="text-xl font-black text-slate-800 leading-tight">アプリの使い方</h1>
            <p className="text-xs text-slate-400 mt-0.5">3つのモードを使い分けて効率的に学習しましょう</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-5 py-5 space-y-6 text-sm text-slate-700 leading-relaxed">
          {/* ===== ① ノートモード ===== */}
          <section>
            <h2 className="text-base font-bold text-slate-800 mb-2 flex items-center gap-2">
              <span
                className="inline-block w-7 h-7 rounded-md text-center leading-7 text-sm font-bold"
                style={{ backgroundColor: '#ccfbf1', color: '#0f766e' }}
              >
                📖
              </span>
              ① ノートモード
            </h2>
            <p className="text-[13px] text-slate-600">
              各分野の重要知識を 1 ページで一気に確認できる暗記ノートです。著者の
              <strong className="text-slate-800">復習ノート</strong>に準拠した内容を整理しています。
            </p>
            <ul className="mt-3 ml-5 space-y-1.5 text-[13px] text-slate-600 list-disc">
              <li>
                <strong className="text-red-600">赤字</strong>は重要キーワード。画面下の「
                <strong>赤字を隠す</strong>」ボタンで一括マスクし、暗記テストとして使えます。
              </li>
              <li>
                マスク中は<strong className="text-slate-800">赤いブロックをタップ</strong>すると一時的に表示。
                もう一度タップで再び隠れます。
              </li>
              <li>
                <strong style={{ color: '#1a3a5c' }}>ネイビーの太字</strong>は復習ノートに無い補足情報
                （試験対策プラスα）です。隠れません。
              </li>
              <li>
                ノート一覧の上部にある<strong>検索ボックス</strong>からセクション見出しを直接ジャンプできます。
              </li>
              <li>
                問題演習の解答モード選択画面から、該当カテゴリのノートに
                <strong>ワンタップで遷移</strong>できます（解く前の確認に活用）。
              </li>
            </ul>
          </section>

          {/* ===== ② 問題演習 ===== */}
          <section>
            <h2 className="text-base font-bold text-slate-800 mb-2 flex items-center gap-2">
              <span
                className="inline-block w-7 h-7 rounded-md text-center leading-7 text-sm font-bold"
                style={{ backgroundColor: '#dbeafe', color: '#1d4ed8' }}
              >
                ✍
              </span>
              ② 問題演習
            </h2>
            <p className="text-[13px] text-slate-600">
              穴埋め形式の問題を 4 択 ／ 記述の 2 モードで解けます。同じ問題データを両モードで利用するため、
              4 択で慣れたら記述に挑戦できます。
            </p>
            <ul className="mt-3 ml-5 space-y-1.5 text-[13px] text-slate-600 list-disc">
              <li>
                <strong>4 択モード</strong>：選択肢から選ぶだけ、即時に正誤判定。最初はこちら。
              </li>
              <li>
                <strong>記述モード</strong>：自分でタイプして正解と見比べ、◯／✕ を自己採点。
                入力が完全一致した場合は自動で正解になります。
              </li>
              <li>
                正答率と回答数は<strong>4 択／記述で別々に集計</strong>されます。ホーム画面の進捗ゲージは
                全体・各カテゴリで 2 本ずつ表示。
              </li>
              <li>
                解答モード選択画面で<strong>「重要問題のみを出題」</strong>のチェックボックスを ON にすると、
                重要マークが付いた問題のみに絞り込まれます。
              </li>
              <li>
                <strong>弱点克服モード</strong>では誤答した問題から優先的に出題されます。
                <strong>ランダム出題</strong>は学習進捗パネル右上のボタンから利用できます。
              </li>
              <li>
                解いた問題はバッジ・経験値（XP）にも反映され、継続学習でレベルアップやバッジ獲得が狙えます。
              </li>
            </ul>
          </section>

          {/* ===== ③ 午後問題演習補助ツール ===== */}
          <section>
            <h2 className="text-base font-bold text-slate-800 mb-2 flex items-center gap-2">
              <span
                className="inline-block w-7 h-7 rounded-md text-center leading-7 text-sm font-bold"
                style={{ backgroundColor: '#ede9fe', color: '#6d28d9' }}
              >
                📝
              </span>
              ③ 午後問題演習補助ツール
            </h2>
            <p className="text-[13px] text-slate-600">
              ネスペ午後（大問形式）の演習をサポートするツール群です。
              市販過去問集と組み合わせて使うことを想定しています。
            </p>
            <ul className="mt-3 ml-5 space-y-1.5 text-[13px] text-slate-600 list-disc">
              <li>
                <strong>過去問の解答記録</strong>：自分の解答を入力／保存し、模範解答と並べて確認できます。
              </li>
              <li>
                <strong>解説の閲覧</strong>：問題ごとに解説ページが用意されています（収録済みのもの）。
              </li>
              <li>
                ホーム画面の「<strong>午後問題演習補助</strong>」ボタンから各種機能にアクセスできます。
              </li>
              <li>
                まずは午前演習で基礎力を固め、その後この補助ツールで午後対策を進める流れがおすすめです。
              </li>
            </ul>
          </section>

          {/* 補足注記 */}
          <p className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-100 pt-4">
            ※ ご不明点・不具合は、LINE でお知らせください。
          </p>
        </div>

        {/* ホームへ戻る */}
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 hover:border-blue-400 hover:text-blue-700 transition-colors"
          >
            ← ホームへ戻る
          </Link>
        </div>
      </div>
    </div>
  )
}
