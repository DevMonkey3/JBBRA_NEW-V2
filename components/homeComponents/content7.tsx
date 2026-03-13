// Content7.tsx
"use client";

import React from "react";

type Reason = { number: number; title: string; description: string };

const reasons: Reason[] = [
  { number: 1, title: "Optimal Talent Introduction", description: "Smooth introductions are possible through recruitment using a robust network of foreign job seekers and job media" },
  { number: 2, title: "Follow-up Support", description: "Direct employment with consistent follow-up support from recruitment through post-employment, including housing assistance. We also handle report preparation" },
  { number: 3, title: "Specified Skills from Abroad", description: "Hire young, excellent Vietnamese university students for up to 1 year while they study for the specified skills exam during the period" },
  { number: 4, title: "Specified Skills from International Students", description: "Utilize international students on a trial basis through dispatch while evaluating their performance during the period" },
  { number: 5, title: "Our Talent Quality is Different!", description: "For introduced talent from overseas, we provide a 'completely customized' pre-education program. They learn specialized terminology in advance before entering the country, enabling immediate on-site performance." },
];

export default function Content7() {
  return (
    <>
      <style>{`
        .content7-wrap * {
          font-family: var(--font-serif-jp), serif !important;
        }
        .content7-reason-row {
          display: flex;
          border-bottom: 1px solid rgba(0,97,154,0.25);
        }
        .content7-reason-row:first-child {
          border-top: 1px solid rgba(0,97,154,0.25);
        }
        .content7-label-col {
          width: 110px;
          min-width: 110px;
          background: #00619A;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 14px 8px;
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          flex-shrink: 0;
        }
        .content7-content-col {
          padding: 14px 20px;
          background: #fff;
          flex: 1;
        }
        .content7-title-text {
          font-size: 1rem;
          font-weight: 700;
          color: #1a1a1a;
          display: block;
          margin-bottom: 4px;
        }
        .content7-desc-text {
          font-size: 0.85rem;
          color: #444;
          line-height: 1.75;
          display: block;
        }
      `}</style>

      <section className="content7-wrap mx-auto w-full max-w-6xl px-4 py-8 md:py-10">
        <div className="bg-white shadow-lg ring-1 ring-black/5 px-5 py-8 md:px-10 md:py-12" style={{ borderRadius: 0 }}>

          {/* Header */}
          <header className="text-center mb-8 md:mb-10" style={{ borderBottom: '1px solid rgba(0,97,154,0.2)', paddingBottom: '1.5rem' }}>
            <p className="m-0 text-base text-gray-500 mb-1" style={{ letterSpacing: '0.06em' }}>
              That's our
            </p>
            <h2
              className="m-0 font-extrabold text-[#00619A] leading-tight"
              style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2.4rem)', letterSpacing: '0.04em', marginBottom: '0.5rem' }}
            >
              "Specified Skills & Foreign Talent"
            </h2>
            <p className="text-base text-gray-600 m-0" style={{ letterSpacing: '0.05em' }}>
              The 5 reasons why our specified skills are chosen...
            </p>
          </header>

          {/* Table-style reasons */}
          <div style={{ border: '1px solid rgba(0,97,154,0.3)' }}>
            {reasons.map((r) => (
              <div key={r.number} className="content7-reason-row">
                <div className="content7-label-col">
                  Reason {String(r.number).padStart(2, '0')}
                </div>
                <div className="content7-content-col">
                  <span className="content7-title-text">{r.title}</span>
                  <span className="content7-desc-text">{r.description}</span>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-8 text-center md:text-right">
            <button
              type="button"
              className="bg-[#00619A] hover:bg-[#004f7e] text-white px-8 py-3 text-base md:text-lg shadow-sm focus:outline-none"
              style={{ borderRadius: 0, fontFamily: "var(--font-serif-jp), serif", letterSpacing: '0.04em' }}
              onClick={() => window.location.href = '/jbbc/contact/inquiry'}
            >
              Ask Our Sales Team
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
