'use client'
import Breadcrumbs from "@/components/breadcrumb/page";
import BgFont from "@/components/bgFont/BgFont";
import { useState } from "react";
import Link from 'next/link';
import { getCdnUrl } from "@/config/cdn";
export default function CompanyOverview() {
  const [breadcrumbData, setBreadcrumbData] = useState([
    {
      key: "top",
      title: <span style={{ color: "#019cd4" }}>top</span>,
      // path: '/jbbra/contact/inquiry',
    },
    {
      key: "Info",
      // title: "Company Information",
      title: <Link href="/jbbra/Info">Company Information</Link>
      // path: '/jbbra/contact/inquiry',
    },
    {
      key: "companyinfo",
      title: "Company Overview",
      // path: '/jbbra/contact/inquiry',
    }
  ]);
  return (
    <main className="mx-auto max-w-6xl px-4 mb-10">
      {/* Title */}
      {/* <div className="mb-8">
        <p className="text-xs text-sky-600 font-semibold mb-2">info / 会社概要</p>
        <h1 className="text-2xl md:text-3xl font-bold">会社概要</h1>
        <div className="relative mt-6">
          <span className="pointer-events-none select-none text-[64px] md:text-[104px] font-extrabold text-sky-100 leading-none">
            Company
          </span>
        </div>
      </div> */}
      <Breadcrumbs
        breadcrumb={breadcrumbData}
        pageTitle={'Info'}
        breadcrumbTitle={breadcrumbData[breadcrumbData.length - 1].title}
      />
      <BgFont textBg={'Message'} title={'Message from the Representative'} />

      {/* Image + table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mt-10">
        <div className=" overflow-hidden ">
          <img
            src={getCdnUrl("/home/23234.avif")}
            alt="Headquarters Building"
            className="w-full h-full object-cover"
            style={{
              borderRadius: '60px 0 60px 0',
            }}
          />
        </div>

        <dl className="divide-y divide-gray-200 border border-gray-200 rounded-xl">
          {[
            ["Company Name", "Japan Bangla Bridge Co., Ltd."],
            ["English Name", "Japan Bangla Bridge Co.,Ltd."],
            ["Common Name", "Jbbra"],
            ["Establishment", "November 10, 2010"],
            [
              "Address",
              <>
                <p className="mb-2">
                  <strong>1 Shinjuku Headquarters</strong><br />
                  7-22-39 Nishi-Shinjuku, Shinjuku-ku, Tokyo 160-0023, Japan<br />
                  TEL: 03-6279-1289 / FAX: 03-6279-1287
                </p>
                <p>
                  <strong>2 Bangladesh Local Corporation</strong><br />
                  Cemex Shimul Trishna Trade Center (Level-6), Ka-86/1, Kuril
                  Bishwa Road, Progoti Soroni, Dhaka, Bangladesh
                </p>
              </>
            ],
            ["Capital", "39,000,000 JPY (as of June 2025)"],
            ["Representative Director", "Tahamid Moizur"],
            [
              "Representative Director Vice President",
              <a
                href="https://shorturl.at/vTop3"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-600 underline"
              >
                Atsushi Miura
              </a>,
            ],
            [
              "Business Activities",
              <>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>System Development Business (including offshore development and outsourcing)</li>
                  <li>Technical Intern Training Program Support (Our Sending Agency Resident Office)</li>
                  <li>Fee-based Employment Introduction Business (License No: 13-YU-316416)</li>
                  <li>Registration Support Business</li>
                  <li>Japanese Language School Operation (Bangladesh)</li>
                  <li>International Student Support Business</li>
                  <li>Bangladesh Expansion Support Business</li>
                  <li>Job Seeker Matching Business (bhalojob.com)</li>
                </ol>
              </>
            ],
            [
              "Licenses",
              <>
                Fee-based Employment Introduction Business License No: 13-YU-316416<br />
                Registered Support Organization License No: 19-TO-000466
              </>
            ],
            [
              "Group Companies",
              <>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Japan Bangla Bridge Recruiting Agency Ltd. (Bangladesh Sending Agency)</li>
                  <li>Bhalo Ventures Ltd. (Bangladesh Corporation)</li>
                  <li>Bhalojob Japanese Language School (Bangladesh Corporation)</li>
                </ul>
              </>
            ],
            ["Number of Employees", "30 employees (including local corporation members)"],
            ["Email", "info@jbbc.co.jp"],
            [
              "Advisors",
              <>
                Shohei Sugita, Attorney (Attorney Corporation Global HR Strategy)<br />
                <a
                  href="https://www.ghrs.law/professionals/sugita-shohei/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-600 underline"
                >
                  https://www.ghrs.law/professionals/sugita-shohei/
                </a>
              </>
            ],
            [
              "Affiliated Organizations (Japan)",
              <>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Kanagawa Prefecture Small and Medium Enterprise Organization Central Association</li>
                  <li>KIP | Kanagawa Foundation for Industrial Promotion</li>
                  <li>General Foundation Corporation National Association for Supporting Foreign Talent Coexistence</li>
                  <li>Tokyo Nihonbashi Rotary Club</li>
                  <li>General Foundation Corporation National Association for Supporting Foreign Talent Coexistence (NAGOMI)</li>
                  <li>National Business Support Cooperative Federation (NBCC)</li>
                  <li>General Incorporated Association International Cooperation Promotion Association</li>
                </ul>
              </>
            ],
            [
              "Affiliated Organizations (Bangladesh)",
              <>
                <ul className="list-disc pl-5 space-y-1">
                  <li>BAIRA - Bangladesh Association of International Recruiting Agencies</li>
                  <li>BASIS - Bangladesh Association of Software and Information Services</li>
                  <li>BARVIDA - Bangladesh Association of Used Vehicle Importers and Dealers</li>
                </ul>
              </>
            ],
          ].map(([k, v]) => (
            <div key={k as string} className="grid grid-cols-3 px-4 py-3">
              <dt className="col-span-1 text-sm font-medium text-gray-500">{k}</dt>
              <dd className="col-span-2 text-sm text-gray-800">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </main>
  );
}
