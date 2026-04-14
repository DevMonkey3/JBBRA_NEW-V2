// export const metadata = {
//   title: "代表ご挨拶 | Jbbra",
// };
'use client'
import Breadcrumbs from "@/components/breadcrumb/page";
import BgFont from "@/components/bgFont/BgFont";
import { useState } from "react";
import Link from 'next/link';
import { getCdnUrl } from "@/config/cdn";


export default function CompanyMessage() {

      const [breadcrumbData, setBreadcrumbData] = useState([
        {
          key: "top",
          title: <span style={{ color: "#019cd4" }}>top</span>,
          // path: '/jbbra/contact/inquiry',
        },
        {
          key: "Info",
          // title: "会社情報",
          title:<Link href="/jbbra/Info">会社情報</Link>
          // path: '/jbbra/contact/inquiry',
        },
        {
          key: "message",
          title: "代表ご挨拶",
          // path: '/jbbra/contact/inquiry',
        }
      ]);
  return (
    <main className="mx-auto max-w-6xl px-4 mb-5">
      {/* Title */}
      {/* <div className="mb-8">
        <p className="text-xs text-sky-600 font-semibold mb-2">info / 代表ご挨拶</p>
        <h1 className="text-2xl md:text-3xl font-bold">代表ご挨拶</h1>
        <div className="relative mt-6">
          <span className="pointer-events-none select-none text-[64px] md:text-[104px] font-extrabold text-sky-100 leading-none">
            Message
          </span>
        </div>
      </div> */}
      <Breadcrumbs
        breadcrumb={breadcrumbData}
        pageTitle={'Info'}
        breadcrumbTitle={breadcrumbData[breadcrumbData.length - 1].title}
      />
      <BgFont textBg={'Message'} title={'代表ご挨拶'} />

      {/* Hero block */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mt-10">
        <div>
          <h2 className="text-lg md:text-xl font-semibold mb-2">
            架け橋を築き、未来を切り拓く
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            タハミド モイズル
            <br />
            東京商⼯会議所 会員 / リーダーシップクラブ会員
            <br />
            バングラデシュ情報⼯科企業家協会員 ほか
          </p>
          <p className="text-gray-700 leading-relaxed space-y-4">
            私たちJbbraは、「人・スキル・チャンス」を“橋”で結ぶことを使命に、日本と
            バングラデシュの双方に価値をもたらす人材・技術・ビジネスの循環をつくってきました。
            現場即戦力の人材供給から、現場定着・教育・コンプライアンスまで一気通貫で支援します。
          </p>
        </div>
        <div className="rounded-2xl overflow-hidden border border-gray-200">
          <img
            src={getCdnUrl("/home/Mask-group-4-1.avif")}
            alt="本社ビル"
  width={800}
  height={600}
  className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Body */}
      <div className="mt-10 space-y-5 text-gray-700 leading-relaxed">
        <p>
          企業の“今”に本当に必要な支援を、成果から逆算してデザインする。これが私たちのやり方です。
          現場の声に寄り添い、スピードと品質を両立させた“使える支援”で、長く頼れるパートナーになります。
        </p>
        <p>
          これからもJbbraは、更なる進化を続けます。どうぞご期待ください。
        </p>
      </div>
    </main>
  );
}
