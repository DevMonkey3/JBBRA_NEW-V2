// Content8.tsx
"use client";

import { Typography, Row, Col, Button, Image } from "antd";
import React, { useState } from "react";
import { getCdnUrl } from "@/config/cdn";

const Content8: React.FC = () => {
  const { Text, Title } = Typography;

  const [reasons2] = useState([
    { title: 'Trust and Track Record', description: 'We provide reliable support based on extensive experience between Japan and Bangladesh.' },
    { title: 'Ultra-Fast Talent Supply', description: 'Immediate response to urgent needs. We introduce talent with speed and precision.' },
    { title: 'Secure Foreign Talent Introduction Support', description: 'Dedicated team supports productivity improvement. We thoroughly manage on-site management and training to achieve stable talent utilization.' },
    { title: 'Secure Committed Young Talent', description: 'We support the acceptance of foreign students. We carefully support from recruitment to settlement.' },
    { title: 'Safety First, Responsibility for the Future', description: 'We uphold "Safety First," thoroughly manage on-site risk management, and provide a safe working environment for all staff.' },
    { title: 'Accurate Matching', description: 'We carefully select candidates who match the required skills and personality.' },
  ]);

  return (
    <>
      <style>{`
        .content8-wrap * {
          font-family: var(--font-serif-jp), serif !important;
        }
        .content8-reason-row {
          display: flex;
          border-bottom: 1px solid rgba(0,97,154,0.25);
        }
        .content8-reason-row:first-child {
          border-top: 1px solid rgba(0,97,154,0.25);
        }
        .content8-label-col {
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
          writing-mode: horizontal-tb;
          flex-shrink: 0;
        }
        .content8-content-col {
          padding: 14px 20px;
          background: #fff;
          flex: 1;
        }
        .content8-title-text {
          font-size: 1rem;
          font-weight: 700;
          color: #1a1a1a;
          display: block;
          margin-bottom: 4px;
        }
        .content8-desc-text {
          font-size: 0.85rem;
          color: #444;
          line-height: 1.75;
          display: block;
        }
      `}</style>

      <div
        className="content8-wrap w-full px-4 md:px-10 lg:px-20 py-8 md:py-12"
        style={{ backgroundColor: 'rgba(0,97,154,0.2)' }}
      >
        {/* Section title — styled like the right image */}
        <div className="text-center mb-8 md:mb-10">
          <Title
            level={2}
            style={{
              fontFamily: "var(--font-serif-jp), serif",
              fontSize: 'clamp(1.3rem, 3vw, 2rem)',
              fontWeight: 900,
              color: '#1a1a1a',
              letterSpacing: '0.06em',
              marginBottom: '0.25rem',
            }}
          >
            Features of Japan Bangladesh Bridge
          </Title>
          <div
            style={{
              fontFamily: "var(--font-serif-jp), serif",
              fontSize: '1rem',
              color: '#00619A',
              fontWeight: 700,
              letterSpacing: '0.05em',
            }}
          >
            6 Reasons for Repeat Business
          </div>
        </div>

        <Row justify="center" align="top" gutter={[32, 24]}>
          {/* Left: table-style reasons list */}
          <Col xs={24} lg={14}>
            <div style={{ border: '1px solid rgba(0,97,154,0.3)' }}>
              {reasons2.map((item, index) => (
                <div key={index} className="content8-reason-row">
                  <div className="content8-label-col">
                    Reason {String(index + 1).padStart(2, '0')}
                  </div>
                  <div className="content8-content-col">
                    <span className="content8-title-text">{item.title}</span>
                    <span className="content8-desc-text">{item.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </Col>

          {/* Right: large "Reason" watermark + image */}
          <Col xs={24} lg={10} className="flex flex-col items-start">
            <div
              style={{
                fontFamily: "var(--font-serif-jp), serif",
                fontSize: 'clamp(60px, 10vw, 130px)',
                fontWeight: 900,
                color: 'rgba(255,255,255,0.85)',
                lineHeight: 1,
                marginBottom: '8px',
                letterSpacing: '-0.02em',
                userSelect: 'none',
              }}
            >
              Reason
            </div>
            <Image
              src={getCdnUrl("/home/Home_page_content8_personImage.avif")}
              alt="Person"
              preview={false}
              className="w-full shadow-lg object-cover h-auto"
              style={{ borderRadius: 0 }}
            />
          </Col>
        </Row>

        {/* Description text below the table */}
        <div className="mt-6 max-w-2xl">
          <Text style={{ fontFamily: "var(--font-serif-jp), serif", fontSize: '0.9rem', color: '#333', lineHeight: 1.8 }}>
            We are not just a staffing agency. We are a reliable partner to help you build a successful life in Japan.
            With proven support systems, individualized responses, and reliable problem-solving capabilities, Jbbra is the place where your "dreams in Japan" become reality.
          </Text>
        </div>

        <div className="text-center mt-8">
          <Button
            type="primary"
            size="large"
            className="border-none !px-6 !py-2 md:!px-8 md:!py-3 !text-base md:!text-lg"
            style={{
              background: '#00619A',
              borderRadius: 0,
              fontFamily: "var(--font-serif-jp), serif",
              letterSpacing: '0.04em',
            }}
            onClick={() => window.location.href = '/Why'}
          >
            View Detailed List of 6 Reasons →
          </Button>
        </div>
      </div>
    </>
  );
};

export default Content8;
