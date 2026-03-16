// components/homeComponents/content8.tsx
"use client";

import { Typography, Row, Col, Button, Image } from "antd";
import React from "react";
import Link from "next/link";
import { getCdnUrl } from "@/config/cdn";
// Reuses content7's CSS module — the table styles are identical
import styles from "./content7.module.css";

const { Text, Title } = Typography;

// Static data — plain const, not useState
const REASONS = [
  { title: "Trust and Track Record",                     description: "We provide reliable support based on extensive experience between Japan and Bangladesh." },
  { title: "Ultra-Fast Talent Supply",                   description: "Immediate response to urgent needs. We introduce talent with speed and precision." },
  { title: "Secure Foreign Talent Introduction Support", description: "Dedicated team supports productivity improvement with stable talent utilization." },
  { title: "Secure Committed Young Talent",              description: "We support the acceptance of foreign students from recruitment to settlement." },
  { title: "Safety First, Responsibility for the Future", description: "We uphold 'Safety First' and thoroughly manage on-site risk management." },
  { title: "Accurate Matching",                          description: "We carefully select candidates who match the required skills and personality." },
] as const;

const Content8: React.FC = () => (
  <div
    className={`${styles.wrap} w-full px-4 md:px-10 lg:px-20 py-8 md:py-12`}
    style={{ backgroundColor: "rgba(0,97,154,0.2)" }}
  >
    <div className="text-center mb-8 md:mb-10">
      <Title level={2} style={{ fontFamily: "var(--font-serif-jp), serif", fontSize: "clamp(1.3rem, 3vw, 2rem)", fontWeight: 900, color: "#1a1a1a", letterSpacing: "0.06em", marginBottom: "0.25rem" }}>
        Features of Japan Bangladesh Bridge
      </Title>
      <div style={{ fontFamily: "var(--font-serif-jp), serif", fontSize: "1rem", color: "#00619A", fontWeight: 700, letterSpacing: "0.05em" }}>
        6 Reasons for Repeat Business
      </div>
    </div>

    <Row justify="center" align="top" gutter={[32, 24]}>
      <Col xs={24} lg={14}>
        <div style={{ border: "1px solid rgba(0,97,154,0.3)" }}>
          {REASONS.map((item, index) => (
            <div key={item.title} className={styles.reasonRow}>
              <div className={styles.labelCol}>Reason {String(index + 1).padStart(2, "0")}</div>
              <div className={styles.contentCol}>
                <span className={styles.titleText}>{item.title}</span>
                <span className={styles.descText}>{item.description}</span>
              </div>
            </div>
          ))}
        </div>
      </Col>

      <Col xs={24} lg={10} className="flex flex-col items-start">
        <div style={{ fontFamily: "var(--font-serif-jp), serif", fontSize: "clamp(60px, 10vw, 130px)", fontWeight: 900, color: "rgba(255,255,255,0.85)", lineHeight: 1, marginBottom: "8px", letterSpacing: "-0.02em", userSelect: "none" }}>
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

    <div className="mt-6 max-w-2xl">
      <Text style={{ fontFamily: "var(--font-serif-jp), serif", fontSize: "0.9rem", color: "#333", lineHeight: 1.8 }}>
        We are not just a staffing agency. We are a reliable partner to help you build a successful life in Japan.
      </Text>
    </div>

    <div className="text-center mt-8">
      {/* Link instead of window.location.href — no full page reload */}
      <Link href="/Why">
        <Button
          type="primary" size="large"
          className="border-none !px-6 !py-2 md:!px-8 md:!py-3 !text-base md:!text-lg"
          style={{ background: "#00619A", borderRadius: 0, fontFamily: "var(--font-serif-jp), serif", letterSpacing: "0.04em" }}
        >
          View Detailed List of 6 Reasons →
        </Button>
      </Link>
    </div>
  </div>
);

export default Content8;
