// Content4.tsx
"use client";

import { Button } from "antd";
import { useState } from "react";
import { getCdnUrl } from "@/config/cdn";
import NextImage from "next/image";

const Content4: React.FC = () => {
  const [services] = useState([
    { image: getCdnUrl("/home/introduce.avif"), title: "Specified Skilled Worker Introduction" },
    { image: getCdnUrl("/Automation/indian-car-mechanic-standing-and-working-in-servic-2025-03-15-20-56-19-utc.avif"), title: "Highly Skilled Talent Introduction" },
    { image: getCdnUrl("/Aviation/closeup-shot-of-a-white-airplane-landed-in-the-air-2025-02-09-06-46-58-utc.avif"), title: "Technical Intern Training Support" },
    { image: getCdnUrl("/Software Engineer/young-programmer-working-on-desktop-pc-in-office-o-2025-03-25-12-53-58-utc.avif"), title: "International Student Support" },
  ]);

  return (
    <>
      <style>{`
        .content4-wrap * {
          font-family: var(--font-serif-jp), serif !important;
        }
        .content4-table {
          width: 100%;
          border: 1px solid rgba(0,97,154,0.3);
          border-collapse: collapse;
        }
        .content4-header-row {
          display: flex;
          border-bottom: 1px solid rgba(0,97,154,0.25);
        }
        .content4-header-cell {
          flex: 1;
          background: #00619A;
          color: #fff;
          text-align: center;
          padding: 10px 8px;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          border-right: 1px solid rgba(255,255,255,0.2);
        }
        .content4-header-cell:last-child { border-right: none; }
        .content4-image-row {
          display: flex;
          border-bottom: 1px solid rgba(0,97,154,0.25);
        }
        .content4-image-cell {
          flex: 1;
          border-right: 1px solid rgba(0,97,154,0.2);
          overflow: hidden;
        }
        .content4-image-cell:last-child { border-right: none; }
        .content4-image-cell img {
          width: 100%;
          height: 160px;
          object-fit: cover;
          display: block;
        }
      `}</style>

      <div className="content4-wrap mx-auto py-10 px-4 md:px-8" style={{ backgroundColor: 'rgba(0,97,154,0.2)' }}>

        {/* Section heading */}
        <div className="text-center mb-8" style={{ borderBottom: '1px solid rgba(0,97,154,0.2)', paddingBottom: '1.25rem' }}>
          <h2
            className="font-extrabold text-[#00619A] m-0 mb-2"
            style={{ fontSize: 'clamp(1.2rem, 3vw, 2rem)', letterSpacing: '0.06em' }}
          >
            Service Introduction
          </h2>
          <p className="text-gray-600 m-0 text-sm md:text-base max-w-2xl mx-auto" style={{ letterSpacing: '0.04em', lineHeight: 1.8 }}>
            We introduce the features, solutions, and details of each service to help you understand our offerings.
          </p>
        </div>

        {/* Table-style service grid */}
        <div className="max-w-6xl mx-auto" style={{ border: '1px solid rgba(0,97,154,0.3)' }}>

          {/* Header row — titles */}
          <div className="content4-header-row">
            {services.map((s, i) => (
              <div key={i} className="content4-header-cell">{s.title}</div>
            ))}
          </div>

          {/* Image row */}
          <div className="content4-image-row">
            {services.map((s, i) => (
              <div key={i} className="content4-image-cell">
                <NextImage
                  src={s.image}
                  alt={s.title}
                  width={640}
                  height={320}
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  priority={i === 0}
                />
              </div>
            ))}
          </div>

        </div>

        <div className="text-center mt-8">
          <Button
            type="primary"
            size="large"
            className="border-none text-white font-medium"
            style={{ background: '#00619A', borderRadius: 0, letterSpacing: '0.04em', fontFamily: "var(--font-serif-jp), serif" }}
            onClick={() => window.location.href = '/jbbc/services'}
          >
            View All Services
          </Button>
        </div>
      </div>
    </>
  );
};

export default Content4;
