'use client'
import { useState } from "react";
import Breadcrumbs from "@/components/breadcrumb/page";
import BgFont from "@/components/bgFont/BgFont";
import { Button } from "antd";
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { getCdnUrl } from "@/config/cdn";
import Link from "next/link";

const posts = [
  { id: "1", tag: "Specified Skills",        title: "Ready-to-work talent secured in 2 weeks!",                                    excerpt: "Foreign talent recruitment achieving 90% retention rate",           image: getCdnUrl("/home/Japan1.avif") },
  { id: "2", tag: "International Work",      title: "Foreign talent hired through our unique channel.",                             excerpt: "Introduction of an internship program as a new recruitment route", image: getCdnUrl("/home/Mt-Fuji-and-Cherry-Blossom-at-lake-Kawaguchiko.avif") },
  { id: "3", tag: "Study in Japan",          title: "Transformed a high-turnover workplace. Achieved 100% attendance rate.",       excerpt: "Team dispatch and on-site management made the difference",          image: getCdnUrl("/home/Japan-travel-tips-photographer-flytographer-21-2846066585.avif") },
  { id: "4", tag: "Specified Skills",        title: "Ready-to-work talent secured in 2 weeks!",                                    excerpt: "Foreign talent recruitment achieving 90% retention rate",           image: getCdnUrl("/home/IMG_4102-1024x683.avif") },
  { id: "5", tag: "International Work",      title: "Foreign talent hired through our unique channel.",                             excerpt: "Introduction of an internship program as a new recruitment route", image: getCdnUrl("/home/20-The-Ultimate-Travel-Itinerary-Japan-body.avif") },
  { id: "6", tag: "Study in Japan",          title: "Transformed a high-turnover workplace.",                                      excerpt: "Team dispatch and on-site management — 100% attendance achieved",    image: getCdnUrl("/home/shutterstock_1830039815.avif") },
  { id: "7", tag: "Specified Skills",        title: "Ready-to-work talent secured in 2 weeks!",                                    excerpt: "Foreign talent recruitment achieving 90% retention rate",           image: getCdnUrl("/home/japan-tourism.avif") },
  { id: "8", tag: "Lifestyle",               title: "Foreign talent hired through our unique channel.",                             excerpt: "Introduction of an internship program as a new recruitment route", image: getCdnUrl("/home/blogPosts.avif") },
  { id: "9", tag: "Study in Japan",          title: "Transformed a high-turnover workplace.",                                      excerpt: "Team dispatch and on-site management — 100% attendance achieved",    image: getCdnUrl("/home/20-The-Ultimate-Travel-Itinerary-Japan-body.avif") },
];

function PostCard({ post }: { post: typeof posts[0] }) {
  return (
    <Link href={`/jbbc/cases/caseDetail?title=${encodeURIComponent(post.title + post.excerpt)}`}>
      <article style={{ border: '1px solid rgba(0,97,154,0.2)', background: '#fff', cursor: 'pointer', borderRadius: 0 }}
        className="overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <img src={post.image} alt={post.title}
            style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block', transition: 'transform 0.3s' }}
            className="hover:scale-105"
            loading="lazy" />
          <span style={{
            position: 'absolute', top: 10, left: 10,
            background: '#00619A', color: '#fff',
            fontSize: '0.7rem', fontWeight: 700,
            padding: '3px 10px', letterSpacing: '0.04em', borderRadius: 0,
          }}>
            {post.tag}
          </span>
        </div>
        <div style={{ padding: '14px 16px', borderTop: '3px solid #00619A' }}>
          <h3 style={{ fontWeight: 800, fontSize: '0.88rem', color: '#1a1a1a', marginBottom: 6, lineHeight: 1.55, letterSpacing: '0.03em' }}
            className="line-clamp-2">
            {post.title}
          </h3>
          <p style={{ fontSize: '0.78rem', color: '#555', lineHeight: 1.7, marginBottom: 10 }}
            className="line-clamp-2">
            {post.excerpt}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(0,97,154,0.15)', paddingTop: 8 }}>
            <span style={{ fontSize: '0.72rem', color: '#00619A', fontWeight: 700, letterSpacing: '0.04em' }}>
              Industry: Plastics Manufacturing
            </span>
            <span style={{ fontSize: '0.72rem', color: '#00619A', fontWeight: 700 }}>→</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function Cases() {
  const breadcrumbData = [
    { key: "top",     title: <span style={{ color: "#019cd4" }}>Top</span> },
    { key: "cases",   title: "Implementation Results" },
  ];

  return (
    <>
      <style>{`
        .cases-wrap * { font-family: var(--font-serif-jp), serif !important; }
        .cases-wrap .ant-btn { border-radius: 0 !important; }
      `}</style>

      <div className="cases-wrap bg-white">
        <div className="container mx-auto">
          <Breadcrumbs breadcrumb={breadcrumbData} pageTitle="solution"
            breadcrumbTitle={breadcrumbData[breadcrumbData.length - 1].title} />
          <BgFont textBg="solution" title="Implementation Results List" />
        </div>

        {/* Intro */}
        <div className="container mx-auto px-6 pb-6">
          <div style={{ borderBottom: '1px solid rgba(0,97,154,0.2)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '0.88rem', color: '#444', lineHeight: 1.9, letterSpacing: '0.03em', maxWidth: 720 }}>
              We conduct thorough consultations to understand our clients' challenges and provide optimal proposals
              for the implementation of various services. Detailed information about the results and effects of
              our proposals is also provided — please take a look.
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="container mx-auto px-6 pb-14">
          <div style={{ backgroundColor: 'rgba(0,97,154,0.1)', padding: '24px' }}>

            {/* Section label row */}
            <div style={{
              background: '#00619A', color: '#fff',
              padding: '8px 16px', marginBottom: 20,
              display: 'inline-block', fontSize: '0.78rem',
              fontWeight: 700, letterSpacing: '0.08em',
            }}>
              ALL CASES — {posts.length} Results
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}
              className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => <PostCard key={p.id} post={p} />)}
            </div>

            {/* Pagination */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 28 }}>
              <Button
                icon={<LeftOutlined style={{ fontWeight: 'bold' }} />}
                style={{ borderRadius: 0, borderColor: '#00619A', color: '#00619A' }}
              />
              <Button
                icon={<RightOutlined style={{ fontWeight: 'bold' }} />}
                style={{ borderRadius: 0, borderColor: '#00619A', color: '#00619A' }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
