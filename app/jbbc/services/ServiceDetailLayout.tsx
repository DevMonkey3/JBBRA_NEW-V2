'use client'
import { useRouter } from "next/navigation";
import Breadcrumbs from "@/components/breadcrumb/page";

type Subsection = {
  title: string;
  items: { heading: string; points: string[] }[];
};

type Section = {
  title: string;
  body: string;
  bullets?: string[];
  subsections?: Subsection[];
};

type Props = {
  slug: string;
  breadcrumb: any[];
  tag: string;
  heroImage: string;
  heroTitle: string;
  heroBody: string;
  sections: Section[];
};

export default function ServiceDetailLayout({ slug, breadcrumb, tag, heroImage, heroTitle, heroBody, sections }: Props) {
  const router = useRouter();

  return (
    <>
      <style>{`
        .sdl-wrap * { font-family: var(--font-serif-jp), serif !important; }

        .sdl-section { border-left: 4px solid #00619A; padding-left: 16px; margin-bottom: 32px; }
        .sdl-section-title { font-size: 1.15rem; font-weight: 800; color: #1a1a1a; margin-bottom: 8px; letter-spacing: 0.04em; }
        .sdl-body { font-size: 0.88rem; color: #444; line-height: 1.9; letter-spacing: 0.03em; margin-bottom: 10px; }
        .sdl-bullets { padding-left: 0; list-style: none; margin: 0; }
        .sdl-bullets li { font-size: 0.85rem; color: #444; line-height: 1.8; padding: 4px 0; padding-left: 18px; position: relative; }
        .sdl-bullets li::before { content: '・'; position: absolute; left: 0; color: #00619A; font-weight: 700; }

        .sdl-sub-heading { font-size: 0.9rem; font-weight: 700; color: #00619A; margin: 14px 0 6px; letter-spacing: 0.03em; }

        .sdl-back-btn {
          display: inline-flex; align-items: center; gap: 6px;
          background: #00619A; color: #fff;
          border: none; cursor: pointer;
          padding: 10px 22px; font-size: 0.85rem; font-weight: 700;
          letter-spacing: 0.05em; transition: background 0.2s;
        }
        .sdl-back-btn:hover { background: #004f7e; }

        .sdl-contact-btn {
          display: inline-flex; align-items: center; gap: 6px;
          background: #fff; color: #00619A;
          border: 2px solid #00619A; cursor: pointer;
          padding: 10px 22px; font-size: 0.85rem; font-weight: 700;
          letter-spacing: 0.05em; transition: all 0.2s;
        }
        .sdl-contact-btn:hover { background: #00619A; color: #fff; }
      `}</style>

      <div className="sdl-wrap bg-white min-h-screen">
        {/* Breadcrumb */}
        <div className="container mx-auto">
          <Breadcrumbs breadcrumb={breadcrumb} pageTitle="service" breadcrumbTitle={breadcrumb[breadcrumb.length - 1].title} />
        </div>

        {/* Tag + Page title */}
        <div className="container mx-auto px-6 pt-2 pb-6">
          <span style={{
            display: 'inline-block', background: '#00619A', color: '#fff',
            fontSize: '0.72rem', fontWeight: 700, padding: '3px 12px',
            letterSpacing: '0.06em', marginBottom: 10,
          }}>
            {tag}
          </span>
          <h1 style={{
            fontSize: 'clamp(1.5rem, 4vw, 2.4rem)', fontWeight: 900,
            color: '#1a1a1a', letterSpacing: '0.04em', lineHeight: 1.3, margin: 0,
          }}>
            {heroTitle}
          </h1>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid rgba(0,97,154,0.2)', marginBottom: 0 }} />

        {/* Hero — image left, intro text right */}
        <div className="container mx-auto px-6 py-8">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'start' }}>
            <img
              src={heroImage} alt={heroTitle}
              style={{ width: '100%', height: 260, objectFit: 'cover', display: 'block' }}
            />
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1a1a1a', marginBottom: 14, letterSpacing: '0.04em', lineHeight: 1.5 }}>
                {heroTitle}
              </h2>
              <p style={{ fontSize: '0.88rem', color: '#444', lineHeight: 1.95, letterSpacing: '0.03em', margin: 0 }}>
                {heroBody}
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid rgba(0,97,154,0.15)', margin: '0 24px' }} />

        {/* Content sections */}
        <div className="container mx-auto px-6 py-10">
          {sections.map((sec, si) => (
            <div key={si} className="sdl-section">
              <div className="sdl-section-title">{sec.title}</div>
              {sec.body && <p className="sdl-body">{sec.body}</p>}

              {sec.bullets && (
                <ul className="sdl-bullets">
                  {sec.bullets.map((b, bi) => <li key={bi}>{b}</li>)}
                </ul>
              )}

              {sec.subsections?.map((sub, subi) => (
                <div key={subi} style={{ marginTop: 12 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#333', marginBottom: 8, letterSpacing: '0.03em' }}>
                    {sub.title}
                  </div>
                  {sub.items.map((item, ii) => (
                    <div key={ii} style={{ marginBottom: 12, paddingLeft: 16 }}>
                      <div className="sdl-sub-heading">{item.heading}</div>
                      <ul className="sdl-bullets">
                        {item.points.map((p, pi) => <li key={pi}>{p}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}

          {/* CTA row */}
          <div style={{ borderTop: '1px solid rgba(0,97,154,0.2)', paddingTop: 28, marginTop: 8, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button className="sdl-back-btn" onClick={() => router.push('/jbbc/services/service-introduction')}>
  ← Back to Services
</button>
            <button
    className="sdl-contact-btn"
    onClick={() => router.push('/jbbc/contact/inquiry')}
  >
    Inquire About This Service →
  </button>
          </div>
        </div>
      </div>
    </>
  );
}
