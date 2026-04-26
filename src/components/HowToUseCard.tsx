import { useState } from 'react'

/**
 * 学習メニュー最上部に表示する「アプリの使い方」読み物。
 * デフォルトは折り畳み状態。タイトルクリックで展開する。
 *
 * セクション構成（要件定義より）：
 *   1. ノートモード
 *   2. 問題演習
 *   3. 午後問題演習補助ツール
 */
export default function HowToUseCard() {
  const [open, setOpen] = useState(false)

  return (
    <section aria-labelledby="how-to-use-heading" className="mb-3">
      <div
        className={`bg-white rounded-xl border ${
          open ? 'border-blue-300 shadow-sm' : 'border-slate-200'
        } overflow-hidden transition-all`}
      >
        {/* ヘッダ（クリックで開閉） */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="how-to-use-body"
          className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <span
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-base"
            style={{ backgroundColor: '#dbeafe', color: '#1d4ed8' }}
            aria-hidden="true"
          >
            📘
          </span>
          <div className="flex-1 min-w-0">
            <h2 id="how-to-use-heading" className="text-sm font-bold text-slate-800 leading-tight">
              アプリの使い方
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {open ? 'タップで閉じる' : 'タップで展開：3つのモードの活用方法'}
            </p>
          </div>
          <span
            className={`flex-shrink-0 text-slate-400 transition-transform ${
              open ? 'rotate-180' : ''
            }`}
            aria-hidden="true"
          >
            ▾
          </span>
        </button>

        {/* 展開時の本文 */}
        {open && (
          <div
            id="how-to-use-body"
            className="px-4 pb-4 pt-1 space-y-4 text-sm text-slate-700 leading-relaxed border-t border-slate-100"
          >
            {/* ===== ① ノートモード ===== */}
            <div>
              <h3 className="text-sm font-bold text-slate-800 mb-1.5 flex items-center gap-2">
                <span
                  className="inline-block w-6 h-6 rounded-md text-center leading-6 text-[11px] font-bold"
                  style={{ backgroundColor: '#ccfbf1', color: '#0f766e' }}
                >
                  📖
                </span>
                ① ノートモード
              </h3>
              <p className="text-[13px] text-slate-600">
                各分野の重要知識を 1 ページで一気に確認できる暗記ノートです。著者の
                <strong className="text-slate-800">復習ノート</strong>に準拠した内容を整理しています。
              </p>
              <ul className="mt-2 ml-4 space-y-1 text-[13px] text-slate-600 list-disc">
                <li>
                  <strong className="text-red-600">赤字</strong>は重要キーワード。画面下の
                  「<strong>赤字を隠す</strong>」ボタンで一括マスクし、暗記テストとして使えます。
                </li>
                <li>
                  マスク中は<strong className="text-slate-800">赤いブロックをタップ</strong>すると一時的に表示。
                  もう一度タップで再び隠れます。
                </li>
                <li>
                  <strong style={{ color: '#1a3a5c' }}>ネイビーの太字</strong>は復習ノートに無い
                  補足情報（試験対策プラスα）です。隠れません。
                </li>
                <li>
                  ノート一覧の上部にある<strong>検索ボックス</strong>からセクション見出しを直接ジャンプできます。
                </li>
                <li>
                  問題演習の解答モード選択画面（4択／記述）から、該当カテゴリのノートに
                  <strong>ワンタップで遷移</strong>できます（解く前の確認に活用）。
                </li>
              </ul>
            </div>

            {/* ===== ② 問題演習 ===== */}
            <div>
              <h3 className="text-sm font-bold text-slate-800 mb-1.5 flex items-center gap-2">
                <span
                  className="inline-block w-6 h-6 rounded-md text-center leading-6 text-[11px] font-bold"
                  style={{ backgroundColor: '#dbeafe', color: '#1d4ed8' }}
                >
                  ✍
                </span>
                ② 問題演習
              </h3>
              <p className="text-[13px] text-slate-600">
                穴埋め形式の問題を 4 択 ／ 記述の 2 モードで解けます。同じ問題データを
                両モードで利用するため、4 択で慣れたら記述に挑戦できます。
              </p>
              <ul className="mt-2 ml-4 space-y-1 text-[13px] text-slate-600 list-disc">
                <li>
                  <strong>4 択モード</strong>：選択肢から選ぶだけ、即時に正誤判定。最初はこちら。
                </li>
                <li>
                  <strong>記述モード</strong>：自分でタイプして正解と見比べ、◯／✕ を自己採点。
                  入力が完全一致した場合は自動で正解になります。
                </li>
                <li>
                  正答率と回答数は<strong>4 択／記述で別々に集計</strong>されます。
                  ホーム画面の進捗ゲージは全体・各カテゴリで 2 本ずつ表示。
                </li>
                <li>
                  学習メニューには <strong>カテゴリ別／重要問題／弱点復習／ランダム</strong>
                  の4種類があります。「弱点復習」は誤答した問題から優先的に出題されます。
                </li>
                <li>
                  間違えた問題はバッジ・経験値（XP）にも反映され、
                  継続学習でレベルアップやバッジ獲得が狙えます。
                </li>
              </ul>
            </div>

            {/* ===== ③ 午後問題演習補助ツール ===== */}
            <div>
              <h3 className="text-sm font-bold text-slate-800 mb-1.5 flex items-center gap-2">
                <span
                  className="inline-block w-6 h-6 rounded-md text-center leading-6 text-[11px] font-bold"
                  style={{ backgroundColor: '#ede9fe', color: '#6d28d9' }}
                >
                  📝
                </span>
                ③ 午後問題演習補助ツール
              </h3>
              <p className="text-[13px] text-slate-600">
                ネスペ午後（大問形式）の演習をサポートするツール群です。
                市販過去問集と組み合わせて使うことを想定しています。
              </p>
              <ul className="mt-2 ml-4 space-y-1 text-[13px] text-slate-600 list-disc">
                <li>
                  <strong>過去問の解答記録</strong>：自分の解答を入力／保存し、模範解答と並べて確認できます。
                </li>
                <li>
                  <strong>解説の閲覧</strong>：問題ごとに解説ページが用意されています（収録済みのもの）。
                </li>
                <li>
                  サイドバーの「<strong>午後問題</strong>」から各種機能にアクセスできます。
                </li>
                <li>
                  まずは午前演習で基礎力を固め、その後この補助ツールで午後対策を進める流れがおすすめです。
                </li>
              </ul>
            </div>

            {/* 補足注記 */}
            <p className="text-[11px] text-slate-400 mt-3 leading-relaxed border-t border-slate-100 pt-3">
              ※ ご不明点・不具合は、ページ最下部の案内から LINE でお知らせください。
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
