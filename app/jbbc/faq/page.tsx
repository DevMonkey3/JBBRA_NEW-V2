// app/jbbc/implementation-results/page.tsx
'use client'

import { useState, memo } from "react"; // I fixed this
import Breadcrumbs from "@/components/breadcrumb/page";
import BgFont from "@/components/bgFont/BgFont";
import { Button } from "antd";
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { PlusOutlined ,MinusOutlined,QuestionOutlined} from '@ant-design/icons';
import { getCdnUrl } from "@/config/cdn";
export default function Faq() {
  const [breadcrumbData, setBreadcrumbData] = useState<any>([
    {
      key: "top",
      title: <span style={{ color: "#019cd4" }}>top</span>,
      path: '/jbbc/faq',
    },
    {
      key: "service",
      title: "よくある質問",
      path: '/jbbc/faq',
    }
  ]);

// -------------------- STATIC DATA (moved out to avoid re-creation) --------------------
// I have added it.
const posts: Array<{ id: string; tag: string; title: string; excerpt: string; image: string; href: string; }> = [
  {
    id: "1",
    tag: "特定技能",
    title: "即戦力を2週間で確保！",
    excerpt: "定着率90％を実現した外国人採用支援",
    image: getCdnUrl("/home/Japan1.avif"),
    href: "/blog/1",
  },
  {
    id: "2",
    tag: "国際的な仕事",
    title: "独自ルートで外国籍人材を採用。",
    excerpt: "新たな採用チャネルとしてのインターン制度導入",
    image: getCdnUrl("/home/Mt-Fuji-and-Cherry-Blossom-at-lake-Kawaguchiko.avif"),
    href: "/blog/2",
  },
  {
    id: "3",
    tag: "日本留学",
    title: "人が定着しない現場を変えた。 2割を占める“家族のX”を理解して採用を成功に！",
    excerpt: "チーム派遣と常駐管理で実現した出勤率100%",
    image: getCdnUrl("/home/Japan-travel-tips-photographer-flytographer-21-2846066585.avif"),
    href: "/blog/3",
  },
];

// I have added it.
const faqsService = [
  { question: "特定技能人材と技能実習生の違いは何ですか？", answer: "技能実習生は「技能移転」を目的とした制度で、実習終了後は帰国が前提です。一方、特定技能は「人手不足分野での就労」を目的としており、日本語力・技能試験合格により在留資格を得て、長期的な就労・在留が可能です。" },
  { question: "特定技能の在留期間は最長どれくらいですか？", answer: "特定技能1号は最長5年間の在留が可能です。特定技能2号に移行すれば在留期間の更新制限がなく、家族帯同も認められます。" },
  { question: "技能実習生が特定技能に移行することは可能ですか？", answer: "はい、可能です。技能実習を修了した後、分野に応じた特定技能評価試験に合格すれば、特定技能への移行が認められます。" },
  { question: "登録支援機関の主な役割は何ですか？", answer: "特定技能人材に対する生活支援・相談窓口の設置・行政手続きの補助など、全11項目の支援業務を行うことが義務付けられています。" },
  { question: "管理組合と登録支援機関はどのように連携すべきですか？", answer: "管理組合は技能実習生の監理、登録支援機関は特定技能人材の支援を担います。双方で情報共有を密にし、受入企業や人材が安心して働ける体制を構築することが重要です。" },
  { question: "特定技能人材の受入れにかかる費用はどれくらいですか？", answer: "分野や受入人数によって異なりますが、主に渡航費用、ビザ申請費用、登録支援機関への支援委託費などがかかります。技能実習に比べると初期費用は抑えられるケースが多いです。" },
  { question: "日本語能力はどの程度必要ですか？", answer: "原則として特定技能1号は「日本語能力試験（JLPT）N4以上」または「国際交流基金のJFT-Basic合格」が必要です。技能実習生からの移行の場合は、試験免除になるケースもあります。" },
  { question: "特定技能人材が途中で辞めた場合、どうなりますか？", answer: "受入企業での雇用が終了した場合、他の受入企業へ転職が可能です。ただし、在留資格の範囲内で同じ分野に限られます。登録支援機関は新しい就職先探しを支援します。" },
  { question: "技能実習と特定技能、どちらを導入すべきですか？", answer: "短期的に人材を確保しつつ母国への技能移転を重視する場合は「技能実習」。長期的に人手不足解消を図りたい場合は「特定技能」が適しています。企業のニーズに合わせて選択することが大切です。" },
  { question: "受入企業が不適切な対応をした場合の対応は？", answer: "技能実習の場合は監理組合が是正指導し、必要に応じて行政に報告します。特定技能の場合は登録支援機関が生活支援・相談窓口として介入し、重大な場合は出入国在留管理庁に報告します。" },
];

// I have added it.
const faqsTalent = [
  { question: "バングラデシュ人材の強みは何ですか？", answer: "勤勉で学習意欲が高く、日本語習得への関心も強いです。親日的で宗教的にも勤勉・誠実さを重んじる文化を持ち、技能習得や長期就労への適性が高いと評価されています。" },
  { question: "バングラデシュ人技能実習生を採用するメリットは？", answer: "若年層人口が多く、安定した人材供給が可能です。母国での基礎教育水準も高く、現場での指導理解が早いのも特徴です。" },
  { question: "特定技能で採用できる分野は何ですか？", answer: "現在、日本で認められている14分野（介護・外食・宿泊・建設・農業・製造業等）が対象です。バングラデシュ政府も特定技能送り出しに積極的で、今後さらに増える見込みです。" },
  { question: "高度人材とはどのような人材ですか？", answer: "大学卒業以上や専門スキルを有する人材で、エンジニア、IT技術者、研究者、経営管理職などが該当します。日本での就労ビザや「高度専門職」資格での受入れが可能です。" },
  { question: "日本語レベルはどの程度期待できますか？", answer: "技能実習生・特定技能ではN5〜N3レベルが多いですが、現地日本語学校での学習を経て渡航します。高度人材はN2〜N1レベル保持者も増えており、英語も堪能な人材が多いです。" },
  { question: "宗教（イスラム教）への配慮は必要ですか？", answer: "はい。食事（ハラール対応）、礼拝（休憩時間内での対応）、ラマダン期間の労務管理などへの理解があると人材定着に効果的です。多くの企業で問題なく受入れています。" },
  { question: "バングラデシュ人材は長期就労に向いていますか？", answer: "技能実習は原則3〜5年で帰国が前提ですが、特定技能・高度人材は更新や永住申請が可能です。日本でキャリアを積みたい意欲の強い人材が多く、長期雇用にも適しています。" },
  { question: "採用コストはどれくらいかかりますか？", answer: "技能実習生は監理団体経由の費用、特定技能は渡航費＋支援委託費、高度人材は通常の採用コスト（リクルート費用＋ビザ手続き）です。全体的にフィリピン・ベトナムより費用が抑えられる場合があります。" },
  { question: "他国人材と比べた特徴は？", answer: "バングラデシュ人材は 英語力が高い（公用語レベル）、適応力がある（多文化環境に強い）、定着率が高い（母国出稼ぎ需要が安定）といった特徴があります。" },
  { question: "採用後のフォローはどうすべきですか？", answer: "日本語教育の継続支援、生活サポート、宗教・文化的配慮を行うことで離職を防げます。登録支援機関や現地パートナーと連携することで、定着率を大幅に高められます。" },
];

// -------------------- PRESENTATIONAL SUBCOMPONENTS --------------------

// I have added it.
const PostCard = memo(function PostCard({ post }: { post: (typeof posts)[number] }) {
  return (
    <article className="overflow-hidden bg-white rounded-lg shadow-sm">
      <div className="relative h-44 md:h-48"> {/* I fixed this */}
        <img
          src={post.image}
          alt={post.title}
          className="absolute inset-0 w-full h-full object-cover rounded-lg"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 text-left">
          {post.title}
        </h3>
        <p className="text-1xl text-[#929292] line-clamp-2 mb-2 text-left">{post.excerpt}</p>
      </div>
    </article>
  );
});

// I have added it.
const AccordionItem = memo(function AccordionItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="flex justify-between items-center w-full bg-white rounded-xl border border-blue-200 p-5 sm:p-2 shadow-sm hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-300"
        aria-expanded={isOpen}
        style={{ borderRadius: '50px' }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-[#019cd4]">
            <QuestionOutlined  style={{ color: 'white', fontSize: '14px' }} />
            {/* 如果用 Heroicons：
              <PlusIcon className="w-4 h-4 text-white" />
            */}
          </div>
          <span className="text-gray-800 text-base sm:text-lg font-medium leading-tight truncate">
            {question}
          </span>
        </div>

        <div
        className="mr-2"
          // className={`transform transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-45' : 'rotate-0'}`}
          aria-hidden="true"
        >
          {isOpen ? <MinusOutlined style={{ color:"#0193ca",fontWeight:'bold'}} /> : <PlusOutlined style={{ color:"#0193ca",fontWeight:'bold'}} />}
          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 sm:h-6 sm:w-6 text-[#019cd4]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M12 6v6m0 0v6m0-6h6m-6 0H6"}
            />
          </svg> */}
        </div>
      </button>

      {isOpen && (
        <div className="bg-gray-50 p-4 sm:p-5 rounded-xl mt-2 animate-fadeIn">
          <div className="flex items-start gap-2">
            <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-[#019cd4] text-white text-sm font-bold">
              A
            </span>
            <span className="text-gray-700 text-base sm:text-lg leading-relaxed break-words">
              {answer}
            </span>
          </div>
        </div>
      )}
    </div>
  );
});

// -------------------- PAGE --------------------

// export default function Faq() {
  // I fixed this
  // const [breadcrumbData] = useState<Array<{ key: string; title: React.ReactNode; path: string }>>([
  //   {
  //     key: "top",
  //     title: <span style={{ color: "#019cd4" }}>top</span>,
  //     path: "/jbbc/faq",
  //   },
  //   {
  //     key: "service",
  //     title: "よくある質問",
  //     path: "/jbbc/faq",
  //   },
  // ]);

  return (
    <div className="container text-center">
      <Breadcrumbs
        breadcrumb={breadcrumbData}
        pageTitle={"FAQ"}
        breadcrumbTitle={breadcrumbData[breadcrumbData.length - 1].title}
      />
      <BgFont textBg={"FAQ"} title={"よくある質問"} />
      <div>クリックすると該当の質問へ移動できます</div>

      <div className="items-center space-x-2">
        <Button shape="round" color="primary" variant="outlined">特定技能</Button>
        <Button shape="round" color="primary" variant="outlined">高度人材</Button>
        <Button shape="round" color="primary" variant="outlined">技能実習生</Button>
        <Button shape="round" color="primary" variant="outlined">日本へ留学</Button>
        <Button shape="round" color="primary" variant="outlined">人材紹介について</Button>
      </div>

      <div className="mt-10">
        <div className="text-center text-3xl font-bold m-5">サービスについて</div>
        {faqsService.map((faq, index) => (
          <AccordionItem key={`svc-${index}`} {...faq} />
        ))}

        <div className="text-center text-3xl font-bold m-5">採用人材について</div>
        {faqsTalent.map((faq, index) => (
          <AccordionItem key={`tal-${index}`} {...faq} />
        ))}
      </div>

      <>
        <div className="text-center text-xl mt-5">Document</div>
        <div className="text-center text-3xl font-bold mt-5">お役立ち資料</div>
        <div className="p-4 sm:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      </>
    </div>
  );
}
