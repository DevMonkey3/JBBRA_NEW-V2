'use client'
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CategoryCom } from "@/components/servicesComponents/category";
import Breadcrumbs from "@/components/breadcrumb/page";
import { getCdnUrl } from "@/config/cdn";

const services = [
  { image: getCdnUrl("/services/1. SSW.avif"), title: "Specified Skills Talent Introduction", slug: "ssw" },
  { image: getCdnUrl("/services/2.international hiring.avif"), title: "Highly Skilled Talent Introduction", slug: "highly-skilled" },
  { image: getCdnUrl("/services/3.TITP.avif"), title: "Technical Intern Training Program Support", slug: "titp" },
  { image: getCdnUrl("/services/4.overseas study.avif"), title: "International Student Support", slug: "student-support" },
  { image: getCdnUrl("/services/5.IT engineer.avif"), title: "IT Development Experience", slug: "it-development" },
  { image: getCdnUrl("/services/6.overseas consulting.avif"), title: "Overseas Expansion Support", slug: "overseas-expansion" },
];

export default function Page() {
  const router = useRouter();
  const [categoryVal] = useState<any>(null);

  const breadcrumbData = [
    { key: "top", title: <span style={{ color: "#019cd4" }}>Top</span> },
    { key: "service", title: "Service Introduction" },
  ];

  return (
    <>
      <style>{`
        .svc-wrap * { font-family: var(--font-serif-jp), serif !important; }
        .svc-table { width: 100%; border: 1px solid rgba(0,97,154,0.3); }
        .svc-header-row { display: grid; grid-template-columns: repeat(3, 1fr); border-bottom: 1px solid rgba(0,97,154,0.25); }
        .svc-header-cell {
          background: #00619A; color: #fff;
          text-align: center; padding: 10px 8px;
          font-size: 0.8rem; font-weight: 700; letter-spacing: 0.04em;
          border-right: 1px solid rgba(255,255,255,0.2);
        }
        .svc-header-cell:last-child { border-right: none; }
        .svc-image-row { display: grid; grid-template-columns: repeat(3, 1fr); }
        .svc-image-cell {
          border-right: 1px solid rgba(0,97,154,0.2);
          overflow: hidden; position: relative; cursor: pointer;
        }
        .svc-image-cell:last-child { border-right: none; }
        .svc-image-cell img { width: 100%; height: 180px; object-fit: cover; display: block; transition: transform 0.3s; }
        .svc-image-cell:hover img { transform: scale(1.04); }
        .svc-image-cell:hover .svc-hover-overlay { opacity: 1; }
        .svc-hover-overlay {
          position: absolute; inset: 0;
          background: rgba(0,97,154,0.55);
          display: flex; align-items: center; justify-content: center;
          opacity: 0; transition: opacity 0.25s;
        }
        .svc-hover-overlay span {
          color: #fff; font-size: 0.85rem; font-weight: 700;
          letter-spacing: 0.06em; border: 2px solid #fff;
          padding: 6px 18px;
        }
        .svc-divider { border-bottom: 1px solid rgba(0,97,154,0.25); }
      `}</style>

      <div className="svc-wrap bg-white">
        <div className="container mx-auto">
          <Breadcrumbs breadcrumb={breadcrumbData} pageTitle="service" breadcrumbTitle={breadcrumbData[1].title} />
        </div>

        {!categoryVal ? (
          <div className="container mx-auto px-6 py-8">
            <div className="text-center pb-6 mb-6" style={{ borderBottom: "1px solid rgba(0,97,154,0.2)" }}>
              <h2
                className="font-extrabold text-[#00619A] m-0 mb-3"
                style={{ fontSize: "clamp(1.3rem, 3vw, 2rem)", letterSpacing: "0.06em" }}
              >
                Comprehensive Services to Meet All Your Needs
              </h2>
              <p
                className="text-gray-600 m-0 max-w-xl mx-auto"
                style={{ fontSize: "0.9rem", lineHeight: 1.85, letterSpacing: "0.04em" }}
              >
                Customized proposals for each customer. Our accumulated diverse on-site expertise
                solves the challenge of labor shortages.
              </p>
            </div>
          </div>
        ) : (
          <CategoryCom categoryVal={categoryVal} />
        )}

        <div className="container mx-auto px-6 pb-12">
          <div className="svc-table">
            {[services.slice(0, 3), services.slice(3, 6)].map((row, ri) => (
              <div key={ri}>
                <div className="svc-header-row">
                  {row.map((s, i) => (
                    <div key={i} className="svc-header-cell">{s.title}</div>
                  ))}
                </div>
                <div className={`svc-image-row ${ri === 0 ? "svc-divider" : ""}`}>
                  {row.map((s, i) => (
                    <div
                      key={i}
                      className="svc-image-cell"
                      onClick={() => router.push(`/jbbc/services/service-introduction/${s.slug}`)}
                    >
                      <Image
                        src={s.image}
                        alt={s.title}
                        width={640}
                        height={360}
                        sizes="(max-width: 1024px) 50vw, 33vw"
                        priority={ri === 0 && i === 0}
                      />
                      <div className="svc-hover-overlay"><span>View Details -&gt;</span></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: "0.78rem", color: "#888", marginTop: 8, letterSpacing: "0.03em" }}>
            Click any service image to view details
          </p>
        </div>
      </div>
    </>
  );
}
