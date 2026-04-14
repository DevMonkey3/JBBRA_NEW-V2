'use client'
import Link from "next/link";
import Breadcrumbs from "@/components/breadcrumb/page";
import BgFont from "@/components/bgFont/BgFont";
import { getCdnUrl } from "@/config/cdn";

const sections = [
  { title: "Message from the Representative", img: getCdnUrl("/home/Mask-group-4-1.avif"), href: "/jbbra/Info/company/PersonInfo" },
  { title: "Company Overview",                img: getCdnUrl("/home/homeImg.avif"),         href: "/jbbra/Info/company/companyinfo" },
];

const breadcrumbData = [
  { key: "top",  title: <span className="text-[#019cd4]">Top</span> },
  { key: "Info", title: "Company Information" },
];

export default function CompanyPage() {
  return (
    <main className="bg-white" style={{ fontFamily: "'Noto Serif JP', serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;600;700;900&display=swap');`}</style>

      <div className="container mx-auto">
        <Breadcrumbs breadcrumb={breadcrumbData} pageTitle="Info" breadcrumbTitle={breadcrumbData[1].title} />
        <BgFont textBg="Info" title="Company Information" />
      </div>

      <div className="container mx-auto px-6 pb-14">
        {/* Intro */}
        <div className="border-b border-[rgba(0,97,154,0.2)] pb-5 mb-8">
          <p className="text-sm text-gray-600 leading-relaxed tracking-wide max-w-2xl">
            Japan Bangla Bridge Corporation (Jbbra) is a comprehensive human resources company established
            with the aim of becoming a bridge between Japan and Bangladesh for talent, technology, and business.
            We provide diversified services ranging from on-site support centered on manufacturing to
            local corporation establishment consulting and IT solution development.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sections.map((s, i) => (
            <Link key={i} href={s.href} className="group block border border-[rgba(0,97,154,0.2)] overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <div className="overflow-hidden">
                <img
                  src={s.img} alt={s.title}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                  loading={i === 0 ? "eager" : "lazy"}
                />
              </div>
              <div className="bg-[#00619A] text-white text-center py-3 px-4 text-sm font-bold tracking-widest">
                {s.title}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
