'use client'

import { getCdnUrl } from "@/config/cdn";
import Breadcrumbs from "@/components/breadcrumb/page";
import BgFont from "@/components/bgFont/BgFont";
import Image from "next/image";

const REASONS = [
  {
    title: "Fast Recruitment",
    text: "Through our unique overseas network and selection process, we significantly shorten the recruitment period from posting to hiring. We can also respond to urgent staffing needs.",
    thumb: getCdnUrl("/Garments/happy-female-dressmaker-working-with-sewing-machin-2025-03-13-19-29-43-utc.avif"),
  },
  {
    title: "High-Precision Talent Selection",
    text: "We comprehensively evaluate both skills and personality to minimize mismatches and provide talent that can immediately contribute on-site.",
    thumb: getCdnUrl("/Garments/portrait-of-young-seamstress-using-sewing-machine-2025-04-04-21-11-54-utc.avif"),
  },
  {
    title: "Comprehensive Support from Entry to Employment",
    text: "We provide one-stop support including residence status, housing, living support, Japanese language learning, and settlement assistance, minimizing the burden on receiving companies.",
    thumb: getCdnUrl("/Garments/black-seamstress-adjusting-thread-on-sewing-machin-2024-12-13-19-33-28-utc.avif"),
  },
  {
    title: "On-Site Support and Guidance",
    text: "We support onboarding and training design with a deep understanding of the workplace's operations and culture.",
    thumb: getCdnUrl("/Welding/welder-2024-10-20-15-09-15-utc.avif"),
  },
  {
    title: "Clear KPI and Reporting",
    text: "We clearly define KPIs such as recruitment effectiveness, interview pass rates, and retention rates. Regular reports share improvement points.",
    thumb: getCdnUrl("/Welding/welder-with-safety-work-wear-working-in-factory-2024-12-10-03-23-59-utc.avif"),
  },
  {
    title: "Outstanding Cost Performance",
    text: "We achieve continuous talent supply at fair prices, contributing to long-term cost reduction.",
    thumb: getCdnUrl("/Welding/worker-welding-in-factory-2024-09-15-07-46-15-utc.avif"),
  },
];

const GALLERY = [
  getCdnUrl("/Delivery/delivered-on-time-directly-to-your-door-2025-04-06-11-49-28-utc.avif"),
  getCdnUrl("/Caregiver/nurse-on-home-visit-greeting-senior-man-over-shou-2024-10-19-06-33-49-utc.avif"),
  getCdnUrl("/CAD CAM/creating-architectural-designs-on-computer-screens-2025-03-08-20-48-33-utc.avif"),
  getCdnUrl("/HR Admin/people-active-lifestyle-2025-09-08-12-51-08-utc.avif"),
  getCdnUrl("/Automation/woman-client-with-auto-mechanic-at-the-car-service-2025-03-17-05-19-25-utc.avif"),
  getCdnUrl("/HR Admin/simplifying-her-tasks-with-just-one-device-2025-04-06-09-00-28-utc.avif"),
  getCdnUrl("/Food Factory/man-and-woman-working-with-ceramics-at-the-pottery-2025-03-14-19-32-06-utc.avif"),
  getCdnUrl("/Driver/man-portrait-and-outdoor-at-warehouse-with-confid-2025-04-05-23-39-51-utc.avif"),
  getCdnUrl("/Food Factory/women-working-in-apple-factory-2024-09-18-09-15-59-utc.avif"),
];

const FEATURED = getCdnUrl(
  "/HR Admin/asian-business-woman-working-using-laptop-computer-2025-02-20-08-11-05-utc.avif"
);

export default function WhyPage() {
  const breadcrumbData = [
    { key: "top", title: <span style={{ color: "#019cd4" }}>Top</span> },
    { key: "why", title: "Why Choose Us" },
  ];

  return (
    <>
      <style>{`
        .why-wrap * { font-family: var(--font-serif-jp), serif !important; }

        /* Reasons table */
        .why-reason-row {
          display: flex;
          border-bottom: 1px solid rgba(0,97,154,0.2);
        }
        .why-reason-row:first-child { border-top: 1px solid rgba(0,97,154,0.2); }
        .why-reason-num {
          width: 48px; min-width: 48px;
          background: #00619A; color: #fff;
          display: flex; align-items: center; justify-content: center;
          font-size: 1rem; font-weight: 900; flex-shrink: 0;
          letter-spacing: 0.02em;
        }
        .why-reason-img {
          width: 130px; min-width: 130px; flex-shrink: 0;
          border-right: 1px solid rgba(0,97,154,0.15);
          overflow: hidden;
        }
        .why-reason-img img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          transition: transform 0.3s;
        }
        .why-reason-row:hover .why-reason-img img { transform: scale(1.04); }
        .why-reason-content {
          flex: 1; padding: 16px 20px; background: #fff;
        }
        .why-reason-title {
          font-size: 0.95rem; font-weight: 800;
          color: #00619A; margin-bottom: 6px; letter-spacing: 0.04em;
        }
        .why-reason-text {
          font-size: 0.82rem; color: #444; line-height: 1.9; letter-spacing: 0.03em;
        }

        /* Gallery */
        .why-gallery { display: grid; grid-template-columns: repeat(3, 1fr); gap: 3px; }
        .why-gallery-cell { overflow: hidden; aspect-ratio: 4/3; }
        .why-gallery-cell img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          transition: transform 0.3s;
        }
        .why-gallery-cell:hover img { transform: scale(1.05); }

        /* Newsletter */
        .why-newsletter-input {
          flex: 1; border: 1px solid #b0cdd9; border-right: none;
          padding: 10px 16px; font-size: 0.85rem; outline: none;
          font-family: var(--font-serif-jp), serif !important;
        }
        .why-newsletter-btn {
          background: #00619A; color: #fff; border: none; cursor: pointer;
          padding: 10px 22px; font-size: 0.85rem; font-weight: 700;
          letter-spacing: 0.04em; transition: background 0.2s;
          font-family: var(--font-serif-jp), serif !important;
        }
        .why-newsletter-btn:hover { background: #004f7e; }
      `}</style>

      <main className="why-wrap bg-white">
        <div className="container mx-auto">
          <Breadcrumbs
            breadcrumb={breadcrumbData}
            pageTitle="why"
            breadcrumbTitle={breadcrumbData[breadcrumbData.length - 1].title}
          />
          <BgFont textBg="why" title="Why Choose Us" />
        </div>

        {/* Hero banner */}
        <div className="container mx-auto px-6 pb-10">
          <div style={{ position: 'relative', width: '100%', height: 340, overflow: 'hidden' }}>
            <Image
              src={FEATURED}
              alt="Why Choose Us"
              fill
              priority
              sizes="(max-width: 1200px) 100vw, 1200px"
              style={{ objectFit: 'cover', objectPosition: 'center top' }}
            />
            {/* Overlay text */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(90deg, rgba(0,97,154,0.72) 0%, rgba(0,97,154,0.1) 60%, transparent 100%)',
              display: 'flex', alignItems: 'center', paddingLeft: 40,
            }}>
              <div>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem', letterSpacing: '0.1em', marginBottom: 8 }}>
                  6 REASONS TO CHOOSE US
                </p>
                <h1 style={{ color: '#fff', fontWeight: 900, fontSize: 'clamp(1.4rem, 4vw, 2.4rem)', lineHeight: 1.3, margin: 0, letterSpacing: '0.04em' }}>
                  Why Japan Bangladesh<br />Bridge is Chosen
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Section header */}
        <div className="container mx-auto px-6 pb-6">
          <div style={{ borderBottom: '1px solid rgba(0,97,154,0.2)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '0.8rem', color: '#888', letterSpacing: '0.08em', marginBottom: 4 }}>OUR STRENGTHS</p>
            <h2 style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)', fontWeight: 900, color: '#00619A', margin: 0, letterSpacing: '0.05em' }}>
              6 Reasons for Repeat Business
            </h2>
          </div>

          {/* Reasons table */}
          <div style={{ border: '1px solid rgba(0,97,154,0.25)' }}>
            {REASONS.map((r, idx) => (
              <div key={r.title} className="why-reason-row">
                <div className="why-reason-num">0{idx + 1}</div>
                <div className="why-reason-img">
                  <Image
                    src={r.thumb}
                    alt={r.title}
                    width={260}
                    height={160}
                    sizes="130px"
                    priority={idx === 0}
                  />
                </div>
                <div className="why-reason-content">
                  <div className="why-reason-title">{r.title}</div>
                  <p className="why-reason-text">{r.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gallery */}
        <div className="container mx-auto px-6 pb-10">
          <div style={{ borderBottom: '1px solid rgba(0,97,154,0.2)', paddingBottom: '1rem', marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.8rem', color: '#888', letterSpacing: '0.08em', marginBottom: 4 }}>WORK SCENES</p>
            <h2 style={{ fontSize: 'clamp(1rem, 2vw, 1.4rem)', fontWeight: 800, color: '#1a1a1a', margin: 0, letterSpacing: '0.05em' }}>
              Our People at Work
            </h2>
          </div>
          <div className="why-gallery">
            {GALLERY.map((src, i) => (
              <div key={i} className="why-gallery-cell">
                <Image
                  src={src}
                  alt={`work scene ${i + 1}`}
                  width={480}
                  height={360}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        
      </main>
    </>
  );
}
