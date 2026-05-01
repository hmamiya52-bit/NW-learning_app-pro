import { Link } from 'react-router-dom'

interface GuideStep {
  label: string
  title: string
  body: string
  to: string
  linkLabel: string
}

interface ScreenshotGuide {
  title: string
  image: string
  alt: string
  points: string[]
}

const QUICK_STEPS: GuideStep[] = [
  {
    label: 'STEP 1',
    title: 'まずはカテゴリを選ぶ',
    body: 'トップページのカテゴリ一覧から、学習したい分野を開きます。迷ったらノートモードで確認してから問題演習に進みます。',
    to: '/',
    linkLabel: 'トップページへ',
  },
  {
    label: 'STEP 2',
    title: '4択で慣れて、記述で仕上げる',
    body: '同じ問題を4択と記述で解けます。最初は4択、定着確認は記述、苦手な分野は弱点克服モードで戻ります。',
    to: '/quiz?mode=random',
    linkLabel: 'ランダム出題へ',
  },
  {
    label: 'STEP 3',
    title: '午後問題は点数を残す',
    body: '午後問題演習補助では、年度・問・テーマ・最高点・実施日を一覧で確認できます。解答欄モードで練習し、点数を記録します。',
    to: '/afternoon',
    linkLabel: '午後問題演習へ',
  },
  {
    label: 'STEP 4',
    title: '履歴と同期で継続する',
    body: '学習履歴、経験値、勲章で進み具合を確認します。PCとスマホを併用する場合は、まとまった学習後に同期します。',
    to: '/history',
    linkLabel: '学習履歴へ',
  },
]

const SCREENSHOT_GUIDES: ScreenshotGuide[] = [
  {
    title: 'トップページ',
    image: '/how-to-use/home-desktop.png',
    alt: 'トップページの学習メニューとカテゴリ一覧',
    points: [
      'カテゴリ一覧から分野別の問題演習を開始します。',
      '学習メニューからノート、コラム、午後問題演習補助へ移動できます。',
      '学習履歴で最近の取り組みを確認できます。',
    ],
  },
  {
    title: 'ノートモード',
    image: '/how-to-use/notes-desktop.png',
    alt: 'ノートモードのカテゴリ一覧',
    points: [
      '分野ごとの重要知識をまとめて確認します。',
      '検索欄から見たい項目を探せます。',
      '理解度メモは自分の確認用として使います。',
    ],
  },
  {
    title: '問題演習の開始画面',
    image: '/how-to-use/quiz-mode-desktop.png',
    alt: '問題演習のモード選択画面',
    points: [
      '4択モードは最初の確認に向いています。',
      '記述モードは用語を自力で出せるか確認できます。',
      '重要問題のみの出題に切り替えられます。',
    ],
  },
  {
    title: '問題演習中の画面',
    image: '/how-to-use/quiz-question-mobile.png',
    alt: 'スマホ版の問題演習画面',
    points: [
      'スマホでも片手で選択肢を押しやすい配置です。',
      '解答後に正誤と解説を確認します。',
      '正解や継続学習は経験値と勲章に反映されます。',
    ],
  },
  {
    title: '午後問題演習補助',
    image: '/how-to-use/afternoon-desktop.png',
    alt: '午後問題演習補助の問題一覧',
    points: [
      '年度、問、テーマ、最高点、実施日を一覧で確認します。',
      '行を選ぶと、点数記録や解答欄モードへ進めます。',
      '午後問題は点数の推移を見ながら周回します。',
    ],
  },
  {
    title: 'スマホのメニュー',
    image: '/how-to-use/mobile-menu.png',
    alt: 'スマホ版のサイドメニュー',
    points: [
      '左上のメニューボタンから各ページへ移動します。',
      '勲章コレクション、PC・スマホ同期、設定もここから開けます。',
      'PCとスマホの学習状況は同期ページで統合します。',
    ],
  },
]

function ArrowIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M7.5 4.5L12.5 10L7.5 15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function BackIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M12.5 4.5L7.5 10L12.5 15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function StepLink({ step }: { step: GuideStep }) {
  return (
    <Link
      to={step.to}
      className="group flex h-full flex-col rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      <span className="text-[11px] font-black tracking-wide text-blue-700">{step.label}</span>
      <h2 className="mt-2 text-base font-black leading-snug text-slate-900">{step.title}</h2>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{step.body}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-blue-700 group-hover:text-blue-900">
        {step.linkLabel}
        <ArrowIcon />
      </span>
    </Link>
  )
}

function ScreenshotSection({ guide, index }: { guide: ScreenshotGuide; index: number }) {
  return (
    <section className="border-t border-slate-200 py-8">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(260px,0.7fr)] lg:items-start">
        <figure className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <img
            src={guide.image}
            alt={guide.alt}
            loading="lazy"
            className="block w-full bg-slate-100"
          />
        </figure>
        <div>
          <p className="text-[11px] font-black tracking-wide text-blue-700">PAGE {index + 1}</p>
          <h2 className="mt-1 text-xl font-black text-slate-900">{guide.title}</h2>
          <ul className="mt-4 space-y-3">
            {guide.points.map((point) => (
              <li key={point} className="flex gap-3 text-sm leading-relaxed text-slate-700">
                <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue-700" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default function HowToUse() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-6 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-slate-200 bg-white px-5 py-6 shadow-sm sm:px-7">
          <div className="max-w-3xl">
            <p className="text-xs font-black tracking-wide text-blue-700">GUIDE</p>
            <h1 className="mt-2 text-2xl font-black leading-tight text-slate-900 sm:text-3xl">
              アプリの使い方
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
              このアプリは、ネットワークスペシャリスト試験の知識整理、問題演習、午後問題の点数管理をまとめて行うための学習アプリです。まずはトップページから分野を選び、ノートで確認し、問題演習で定着させます。
            </p>
          </div>
        </div>

        <section className="mt-6">
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-black tracking-wide text-slate-500">START</p>
              <h2 className="text-lg font-black text-slate-900">基本の進め方</h2>
            </div>
            <Link
              to="/"
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 shadow-sm hover:border-blue-300 hover:text-blue-800"
            >
              <BackIcon />
              ホーム
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {QUICK_STEPS.map((step) => (
              <StepLink key={step.label} step={step} />
            ))}
          </div>
        </section>

        <div className="mt-8 rounded-lg border border-slate-200 bg-white px-5 shadow-sm sm:px-7">
          {SCREENSHOT_GUIDES.map((guide, index) => (
            <ScreenshotSection key={guide.title} guide={guide} index={index} />
          ))}
        </div>

        <section className="mt-6 rounded-lg border border-blue-100 bg-blue-50 px-5 py-5">
          <h2 className="text-base font-black text-slate-900">迷ったときの使い分け</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div>
              <p className="text-sm font-bold text-slate-900">知識があいまい</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">ノートモードで用語と流れを確認します。</p>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">用語を覚えたい</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">4択から始め、慣れたら記述モードで確認します。</p>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">午後問題を伸ばしたい</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">解答欄モードで書き、点数記録で周回状況を残します。</p>
            </div>
          </div>
        </section>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-slate-800"
          >
            <BackIcon />
            ホームへ戻る
          </Link>
          <Link
            to="/sync"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm hover:border-blue-300 hover:text-blue-800"
          >
            PC・スマホ同期へ
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </div>
  )
}
