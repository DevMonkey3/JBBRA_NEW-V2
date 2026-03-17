'use client'
import { useState } from "react";
import Breadcrumbs from "@/components/breadcrumb/page";
import { Button } from "antd";
import { getCdnUrl } from "@/config/cdn";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

const relatedPosts = [
  { id: "1", tag: "Specified Skills",   title: "Japanese × Foreign national hybrid team dispatch", excerpt: "24-hour shift operations made possible through dispatch",             image: getCdnUrl("/home/Japan1.avif") },
  { id: "2", tag: "International Work", title: "99%+ attendance achieved — solving night shift shortages",  excerpt: "Resolving chronic understaffing in overnight operations",                image: getCdnUrl("/home/Mt-Fuji-and-Cherry-Blossom-at-lake-Kawaguchiko.avif") },
  { id: "3", tag: "Study in Japan",     title: "Securing repeat talent every season with buffer shift management", excerpt: "Our resident staff ensured zero coverage gaps",         image: getCdnUrl("/home/Japan-travel-tips-photographer-flytographer-21-2846066585.avif") },
];

function RelatedCard({ post }: { post: typeof relatedPosts[0] }) {
  return (
    <Link href={`/jbbc/cases/caseDetail?title=${encodeURIComponent(post.title + post.excerpt)}`}>
      <article style={{ border: '1px solid rgba(0,97,154,0.2)', background: '#fff', borderRadius: 0, cursor: 'pointer' }}
        className="overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <img src={post.image} alt={post.title}
            style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block', transition: 'transform 0.3s' }}
            className="hover:scale-105" loading="lazy" />
          <span style={{
            position: 'absolute', top: 10, left: 10,
            background: '#00619A', color: '#fff',
            fontSize: '0.7rem', fontWeight: 700,
            padding: '3px 10px', letterSpacing: '0.04em', borderRadius: 0,
          }}>
            {post.tag}
          </span>
        </div>
        <div style={{ padding: '12px 14px', borderTop: '3px solid #00619A' }}>
          <h3 style={{ fontWeight: 800, fontSize: '0.85rem', color: '#1a1a1a', marginBottom: 4, lineHeight: 1.55 }}
            className="line-clamp-2">{post.title}</h3>
          <p style={{ fontSize: '0.75rem', color: '#555', lineHeight: 1.6 }}
            className="line-clamp-2">{post.excerpt}</p>
          <div style={{ borderTop: '1px solid rgba(0,97,154,0.15)', paddingTop: 6, marginTop: 8 }}>
            <span style={{ fontSize: '0.7rem', color: '#00619A', fontWeight: 700 }}>Industry: Plastics Manufacturing →</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function CasesDetail() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const title = searchParams.get('title');

  const breadcrumbData = [
    { key: "top",        title: <span style={{ color: "#019cd4" }}>Top</span> },
    { key: "cases",      title: <Link href="/jbbc/cases" style={{ color: '#019cd4' }}>Implementation Results</Link> },
    { key: "caseDetail", title: "Case Detail" },
  ];

  return (
    <>
      <style>{`
        .cd-wrap * { font-family: var(--font-serif-jp), serif !important; }
        .cd-wrap .ant-btn { border-radius: 0 !important; }

        .cd-section { margin-bottom: 32px; }
        .cd-section-tag {
          display: inline-block;
          background: #00619A; color: #fff;
          font-size: 0.72rem; font-weight: 700;
          padding: 3px 14px; letter-spacing: 0.06em;
          margin-bottom: 10px; border-radius: 0;
        }
        .cd-section-title {
          font-size: clamp(1.1rem, 2.5vw, 1.5rem);
          font-weight: 900; color: #1a1a1a;
          letter-spacing: 0.04em; margin-bottom: 6px; line-height: 1.4;
        }
        .cd-section-subtitle {
          font-size: 0.9rem; font-weight: 700;
          color: #00619A; margin-bottom: 10px; letter-spacing: 0.03em;
        }
        .cd-section-body {
          font-size: 0.85rem; color: #444;
          line-height: 1.95; letter-spacing: 0.03em;
        }

        /* Profile table */
        .cd-profile-row {
          display: flex; border-bottom: 1px solid rgba(0,97,154,0.2);
        }
        .cd-profile-row:first-child { border-top: 1px solid rgba(0,97,154,0.2); }
        .cd-profile-label {
          width: 160px; min-width: 160px;
          background: rgba(0,97,154,0.1);
          border-right: 1px solid rgba(0,97,154,0.2);
          padding: 10px 14px;
          font-size: 0.82rem; font-weight: 700;
          color: #1a1a1a; letter-spacing: 0.03em; flex-shrink: 0;
        }
        .cd-profile-value {
          flex: 1; padding: 10px 14px; background: #fff;
          font-size: 0.82rem; color: #444; line-height: 1.7;
        }
      `}</style>

      <div className="cd-wrap bg-white">
        <div className="container mx-auto">
          <Breadcrumbs breadcrumb={breadcrumbData} pageTitle="solution"
            breadcrumbTitle="People Who Don't Stay — Transformed. 100% Attendance via Team Dispatch." />
        </div>

        {/* Hero: image + profile table side by side */}
        <div className="container mx-auto px-6 py-8">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'start' }}>

            {/* Image */}
            <img
              src={getCdnUrl("/home/Japan1.avif")}
              alt="Case Study"
              style={{ width: '100%', height: 280, objectFit: 'cover', display: 'block' }}
              loading="eager"
            />

            {/* Profile table */}
            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#1a1a1a', marginBottom: 14, letterSpacing: '0.04em' }}>
                Client Profile
              </h2>
              <div style={{ border: '1px solid rgba(0,97,154,0.25)', borderRadius: 0 }}>
                {[
                  { label: "Industry",          value: "Food Logistics" },
                  { label: "Department / Role", value: "Warehouse Operations" },
                  { label: "Employees",         value: "100" },
                  { label: "Work Hours",        value: "14:00–21:30 / 22:00–05:00" },
                  { label: "Lead Time",         value: "2 Weeks" },
                ].map((row, i) => (
                  <div key={i} className="cd-profile-row">
                    <div className="cd-profile-label">{row.label}</div>
                    <div className="cd-profile-value">{row.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid rgba(0,97,154,0.15)', margin: '0 24px 0' }} />

        {/* Main content */}
        <div className="container mx-auto px-6 py-10" style={{ backgroundColor: 'rgba(0,97,154,0.05)' }}>

          {/* Challenge */}
          <div className="cd-section">
            <span className="cd-section-tag">Challenge</span>
            <div className="cd-section-title">Client's Challenge</div>
            <div className="cd-section-subtitle">High Turnover Workplace — Overtime That Never Stopped</div>
            <p className="cd-section-body">
              Despite using spot dispatch job boards, applications were scarce and securing staff at each branch remained extremely difficult.
              Due to the cold working environment and physically demanding nature of the work, short-term turnover was high — staff rotated before gaining any proficiency,
              increasing the burden on the existing workforce. Existing employees were working 2–3 hours of overtime daily, normalizing long working hours.
              Even day-shift recruitment focused on student workers and part-time women saw low retention, while nighttime shifts were dominated by one-off spot dispatch.
              Furthermore, existing staffing agencies often had poor follow-up — "placing people and walking away" — making stable workforce deployment impossible.
            </p>
          </div>

          {/* Proposal */}
          <div className="cd-section">
            <span className="cd-section-tag">Our Proposal</span>
            <div className="cd-section-title">Proposal from Our Team</div>
            <div className="cd-section-subtitle">Team Dispatch with On-Site Management — A Differentiated Approach</div>
            <p className="cd-section-body">
              Prioritizing retention and cultural integration, we proposed a team dispatch of 7 Nepali international students.
              An English-speaking account manager was stationed on-site to handle all operations: workflow management, training, attendance,
              interpretation, and transportation — all under one roof. We used a thorough intake sheet and clear contract documentation.
              Work hours, departments, production details, and tasks were all confirmed in advance, allowing talent sourcing to begin at the proposal stage.
              This led to a rapid turnaround of just 2 weeks — earning strong client praise and enabling a smooth deployment.
            </p>
          </div>

          {/* Result */}
          <div className="cd-section" style={{ marginBottom: 0 }}>
            <span className="cd-section-tag">Result</span>
            <div className="cd-section-title">Outcome & Impact</div>
            <div className="cd-section-subtitle">100% Attendance, Expanded to 3 Departments — Team Dispatch Builds Trust</div>
            <p className="cd-section-body">
              The initial order started with 4 staff per day, but within one month the client increased the team to 12 based on strong performance.
              Operations expanded from 1 department to 3, with team dispatch adopted company-wide. For a client new to foreign national dispatch,
              the ability to directly train team members in the field created a sense of security. The Nepali students' sense of responsibility,
              leadership, and dedication earned high praise, leading to full trust delegation. Our resident manager handled day-shift supervision,
              attendance, and off-hours follow-up — achieving 100% attendance and eliminating employee overtime. The fully managed, all-in-one service was
              consistently described as "reassuring to hand over" — a clear differentiator from competitors.
            </p>
          </div>
        </div>

        {/* Related cases */}
        <div className="container mx-auto px-6 py-10">
          <div style={{ borderBottom: '1px solid rgba(0,97,154,0.2)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '0.78rem', color: '#888', letterSpacing: '0.08em', marginBottom: 4 }}>RELATED</p>
            <h2 style={{ fontSize: 'clamp(1rem, 2vw, 1.4rem)', fontWeight: 800, color: '#1a1a1a', margin: 0, letterSpacing: '0.04em' }}>
              Others Also Viewed These Cases
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {relatedPosts.map((p) => <RelatedCard key={p.id} post={p} />)}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 32 }}>
            <Button
              type="primary"
              style={{ background: '#00619A', borderRadius: 0, letterSpacing: '0.04em', fontFamily: "var(--font-serif-jp), serif" }}
              onClick={() => router.push('/Why')}
            >
              View Why We Are Chosen →
            </Button>
            <Button
              style={{ borderRadius: 0, borderColor: '#00619A', color: '#00619A', letterSpacing: '0.04em' }}
              onClick={() => router.push('/jbbc/cases')}
            >
              ← Back to All Cases
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
