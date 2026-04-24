import { Link } from 'react-router-dom'

export default function Column() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
      <div className="max-w-2xl mx-auto px-4 pb-16 pt-4 space-y-5">

        {/* Header */}
        <section>
          <div className="rounded-xl bg-amber-600 text-white px-4 py-3 shadow-md flex items-center justify-between gap-4">
            <div>
              <h1 className="text-base font-black leading-snug">コラム：間宮塾勉強論</h1>
              <p className="text-xs text-amber-200 mt-0.5">ネスペ合格への道筋と心構え</p>
            </div>
            <Link
              to="/"
              className="text-[11px] text-amber-300 hover:text-white transition-colors flex-shrink-0"
            >
              ← ホーム
            </Link>
          </div>
        </section>

        {/* 対象読者注記 */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
          ※実務未経験or微経験者向けだと思ってください。
        </div>

        {/* 【前提】必要なもの */}
        <section className="bg-white rounded-xl border border-slate-200 px-5 py-4 space-y-4">
          <h2 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-2">
            【前提】必要なもの
          </h2>

          <ul className="space-y-2">
            {[
              '応用情報のネットワーク分野午後が余裕に感じる基礎知識',
              '過去問解説書への課金力',
              '自分を追い込む覚悟',
              '本番１～２点足りなくてもしょげない心',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-[11px] font-black flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <span className="text-sm text-slate-700">{item}</span>
              </li>
            ))}
          </ul>

          {/* ①の説明 */}
          <div className="space-y-3 pt-1">
            <div className="flex gap-2">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-[11px] font-black flex items-center justify-center mt-0.5">①</span>
              <p className="text-sm text-slate-700 leading-relaxed">
                はネスペの勉強をしていれば勝手に基礎知識が付いていくので、どの問題もだいたい10～15分ぐらいで8～9割取れるようになる。<br />
                応用情報の問題で躓くようであれば、応用情報の午後問題で基礎固めしてください。
              </p>
            </div>

            {/* ②の説明 */}
            <div className="flex gap-2">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-[11px] font-black flex items-center justify-center mt-0.5">②</span>
              <p className="text-sm text-slate-700 leading-relaxed">
                午後の過去問解説書は、左門先生の過去問解説書（ネスペ〇〇シリーズ）を集めてください。<br />
                １冊で１年分なので、結構お金がかかります。<br />
                しかし、この著者以外の本は非常に難解なので、ケチらない方がいいです。<br />
                最低でも直近５年分（できればそれ以上）は買っておきたいので、１５０００円ぐらいかかると思ってください。<br /><br />
                午前Ⅱに関しては、過去問道場で十分です。
              </p>
            </div>

            {/* ③の説明 */}
            <div className="flex gap-2">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-[11px] font-black flex items-center justify-center mt-0.5">③</span>
              <div className="text-sm text-slate-700 leading-relaxed space-y-2">
                <p>が一番重要です。</p>
                <p>択一問題だけの試験と違って、１問１問がマジで重いです。<br />
                午後Ⅱは１問解こうと思ったら、慣れないうちは２時間かかります。解説を読んだらその倍以上かかるので、１問だけでトータル５時間かかると思ってください。<br />
                まぁ、基本的に平日に午後Ⅱを解くのはキツイっす。（最終的には解くことになる）<br />
                午後Ⅱは土日に解くのが基本となりますが、１日１問だと、７年分解くとしたら、１４日間かかります。だいたい１回目は３０点ぐらいでボロボロになると思うので、２周３周することになります。<br />
                休みを潰さずにネスペに合格できるのは、実務経験が豊富な人か、一部の天才だけです。<br />
                私は未経験の凡人だったので、膨大な勉強時間を捧げました。<br />
                じゃあ、時間がたくさんある人は、たくさんやれば合格できるかというと、それも違います。<br />
                「時間があるから」なんて理由でしんどい勉強を何時間何十時間何日間も人ってできるもんじゃないっすよ。（よほど楽しければともかく…。）</p>
                <p>というわけで、合格するためには、何が必要か。<br />
                「経験」でもない、「才能」でもない、「暇な時間」でもない。<br />
                ズバリそれは、<span className="font-black text-amber-700">【戦う理由】</span>、覚悟なのです。</p>
                <p>何のために資格を取るのか明確にして、他のことよりも優先順位を一時的に引き上げてでも、必ず合格するという意志をもって勉強に臨んでください。<br />
                それが無理だなって思ったら、んー、無理しない方がいいと思います。<br />
                心と身体の健康が第一。これは絶対。</p>
              </div>
            </div>

            {/* ④の説明 */}
            <div className="flex gap-2">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-[11px] font-black flex items-center justify-center mt-0.5">④</span>
              <p className="text-sm text-slate-700 leading-relaxed">
                最後に、それだけ覚悟ガン決まりにして頑張ったとしても、本番のコンディションや問題との相性の悪さ、運で落ちます。<br />
                まぁ合格率１５％とかなんで…。<br />
                私は、１回目の試験で手を抜いたつもりは無いですが、午後５８点で落ちました。<br />
                合格発表を見た後、しばらく引きずって、情報処理から逃げて、ＦＰ受けたり、簿記受けたりしてました（笑）。<br />
                まぁ、そこから立て直して受かったので、万が一落ちても、挫けずに他で頑張ればいいと思います。<br />
                勉強したことは絶対に無駄にならないと思いますし、来年のIPAはプロフェッショナルデジタルスキル試験？が始まるんで、そこで活かせると思います。<br />
                （名前はネットワークスペシャリストの方が好きですけど…）
              </p>
            </div>
          </div>
        </section>

        {/* 区切り */}
        <p className="text-center text-sm text-slate-400">前提が長くなったけど、本題。</p>

        {/* 【勉強法】 */}
        <section className="bg-white rounded-xl border border-slate-200 px-5 py-4 space-y-5">
          <h2 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-2">
            【勉強法】
          </h2>

          {/* 全体的な流れ */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-slate-600 flex items-center gap-1.5">
              <span className="w-1 h-3.5 rounded-full bg-amber-400 inline-block" />
              全体的な流れ
            </h3>
            <p className="text-xs text-slate-400">あくまでも間宮流。何が正解かは人による。午前Ⅰがある人はもっと大変。</p>
            <ul className="space-y-2">
              {[
                '午前Ⅱ、応用情報午後問題ネットワーク＆セキュリティ復習　１か月',
                '午後Ⅰ演習＆基礎知識の叩き込み　１か月',
                '午後Ⅰ演習＆午後Ⅱ演習　たくさん',
                '午後総復習＆午前Ⅱ復習　１か月',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-black flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-sm text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 使用教材 */}
          <div className="space-y-2">
            <h3 className="text-xs font-black text-slate-600 flex items-center gap-1.5">
              <span className="w-1 h-3.5 rounded-full bg-amber-400 inline-block" />
              使用教材
            </h3>
            <ul className="space-y-1.5">
              {[
                'ＮＷ過去問道場（午前Ⅱ用）',
                '間宮製学習アプリ',
                '左門 至峰「本物のネットワークスペシャリストになるための最も詳しい過去問解説」※５～１０年度分',
                'さらに基礎知識を固めたい人は「マスタリングTCP/IP―入門編―(第6版)」※必須ではない。',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="text-amber-400 flex-shrink-0 mt-0.5">・</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* 詳細 */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-600 flex items-center gap-1.5">
              <span className="w-1 h-3.5 rounded-full bg-amber-400 inline-block" />
              詳細
            </h3>

            {/* ①詳細 */}
            <div className="flex gap-2">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-black flex items-center justify-center mt-0.5">①</span>
              <div className="text-sm text-slate-700 leading-relaxed space-y-2">
                <p>はウォーミングアップ。<br />
                ＦＥやＡＰで過去問道場を使った人に説明は不要かと思う。使い方は同じ。<br />
                高度試験の過去問道場は課金しないと使えない。まずは１か月だけ課金する。<br />
                課金したからにはやろう。１か月で全問解く勢いは欲しい。（問題数は４００問と、そこまで多くない。）<br />
                このフェーズでは、問題が解ける解けないというより、ネスペで問われる知識を集めるために、午前問を解いて解説を読むことを重視する。<br />
                正答率を高めて仕上げるのは、最後の１か月でいい。<br />
                午前問で問われた語句とかが、午後で記述になったりするので、できるだけ正確に覚えていきたいところ。とはいえ、完璧である必要は無い。<br />
                あわせて、応用情報の午後問を復習する。<br />
                応用情報の午後問(ネットワーク分野)が20分以内で6割解けなければ、ネスペの午後問は無理。<br />
                15分で8割解けるぐらいになってから、ネスペの午後問に入ると、心が折れにくいと思う。</p>
              </div>
            </div>

            {/* ②詳細 */}
            <div className="flex gap-2">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-black flex items-center justify-center mt-0.5">②</span>
              <div className="text-sm text-slate-700 leading-relaxed space-y-2">
                <p>午後問を解き始める。<br />
                おそらく最初は、１０点～２０点ぐらいしか取れない。何なら１桁もありえる。<br />
                分からなくてもいいので、とりあえず、一通り読んで考えてみて、左門先生の解説書読んでください。<br />
                左門先生の本のコラムとかに、勉強の仕方とか考え方とか、色々書いてあるので息抜きに読んでみるといいと思います。<br />
                家で落ち着いて勉強できる時間は午後問を解いて、それ以外は私のアプリの「ノートモード」やカテゴリ別の出題モードを使って、隙間時間に基礎知識をつけることをおすすめします。午後問題を解くための重要知識を、厳選してまとめているので、短時間で必要な知識をつけられると思います。基礎的な知識ばかりですが、ネスペは何よりも基礎知識が重要な試験です。基礎知識を固めたら後は国語なんで・・・<br />
                あと、合格者は結構「マスタリングTCP/IP―入門編―(第6版)」を読んでる人が多いイメージです。<br />
                私も買いましたが、過去問の方が優先かなって思いました。<br />
                読書が好きな人にはおすすめです。</p>
              </div>
            </div>

            {/* ③詳細 */}
            <div className="flex gap-2">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-black flex items-center justify-center mt-0.5">③</span>
              <div className="text-sm text-slate-700 leading-relaxed space-y-2">
                <p>午後Ⅰの問題文量を読み切れるようになってきたら（点数が取れているかどうかに関わらず）、午後Ⅱも並行してチャレンジしてください。<br />
                平日夜は午後Ⅰ、土日は午後Ⅱをやるイメージ。<br />
                つらいけど頑張るしかない。<br />
                一つの問題は１回やるだけじゃ意味無いです。一つの問題を解いたら、数日おいて、再チャレンジして、８～９割理解できるように繰り返してください。<br />
                苦手を放置すると、私みたいに足元掬われますよ。<br />
                苦手は徹底的に潰してください。<br />
                IPv6とかBGPとかSDNとかも・・・<br />
                解説は基本的に、左門先生の本。<br />
                左門先生の本を読んでもまだ分からない部分があると感じたら、私かAIに聞いてください。私が聞かれたらClaudeに聞いておきます（笑）</p>
              </div>
            </div>

            {/* ④詳細 */}
            <div className="flex gap-2">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-black flex items-center justify-center mt-0.5">④</span>
              <div className="text-sm text-slate-700 leading-relaxed space-y-2">
                <p>午前Ⅱ、午後Ⅰ、午後Ⅱ、余すことなく総復習しましょう。<br />
                特に、午前Ⅱは８～９割必ず取れるようにするとともに、語句も正確に覚えましょう。<br />
                必死に午後対策したのに、午前落ちたら目も当てられないので、本番の昼休みに「あー午前余裕だったー、よし、午後に向けて復習するぞー」ってメンタルになれるぐらいやっときましょう。<br />
                午後問題演習は時間の許す限り詰め込む。<br />
                同じ問題を３回ぐらい解いていれば、解答スピードも上がっていくので、平日夜でも午後Ⅱを解くなり、午後Ⅰを複数解くなりしましょう。<br />
                もう後は後悔しないようにひたすら頑張るだけのフェーズ。</p>
              </div>
            </div>
          </div>
        </section>

        {/* 締め */}
        <div className="bg-amber-600 rounded-xl px-5 py-4 text-center">
          <p className="text-white font-black text-sm">是非、合格目指して頑張ってください。</p>
        </div>

      </div>
    </div>
  )
}
