// components/homeComponents/content4.tsx
"use client";

import { Button } from "antd";
import Link from "next/link";
import { getCdnUrl } from "@/config/cdn";
import NextImage from "next/image";
import styles from "./content4.module.css";

// Static data — plain const, not useState
const SERVICES = [
  { image: getCdnUrl("/home/introduce.avif"),                                                                         title: "Specified Skilled Worker Introduction" },
  { image: getCdnUrl("/Automation/indian-car-mechanic-standing-and-working-in-servic-2025-03-15-20-56-19-utc.avif"), title: "Highly Skilled Talent Introduction" },
  { image: getCdnUrl("/Aviation/closeup-shot-of-a-white-airplane-landed-in-the-air-2025-02-09-06-46-58-utc.avif"),   title: "Technical Intern Training Support" },
  { image: getCdnUrl("/Software Engineer/young-programmer-working-on-desktop-pc-in-office-o-2025-03-25-12-53-58-utc.avif"), title: "International Student Support" },
] as const;

const Content4: React.FC = () => (
  <div className={`${styles.wrap} mx-auto py-10 px-4 md:px-8`} style={{ backgroundColor: "rgba(0,97,154,0.2)" }}>
    <div className="text-center mb-8" style={{ borderBottom: "1px solid rgba(0,97,154,0.2)", paddingBottom: "1.25rem" }}>
      <h2 className="font-extrabold text-[#00619A] m-0 mb-2" style={{ fontSize: "clamp(1.2rem, 3vw, 2rem)", letterSpacing: "0.06em" }}>
        Service Introduction
      </h2>
      <p className="text-gray-600 m-0 text-sm md:text-base max-w-2xl mx-auto" style={{ letterSpacing: "0.04em", lineHeight: 1.8 }}>
        We introduce the features, solutions, and details of each service.
      </p>
    </div>

    <div className={`max-w-6xl mx-auto ${styles.table}`}>
      <div className={styles.headerRow}>
        {SERVICES.map(s => <div key={s.title} className={styles.headerCell}>{s.title}</div>)}
      </div>
      <div className={styles.imageRow}>
        {SERVICES.map((s, i) => (
          <div key={s.title} className={styles.imageCell}>
            <NextImage src={s.image} alt={s.title} width={640} height={320} sizes="(max-width: 1024px) 50vw, 25vw" priority={i === 0} />
          </div>
        ))}
      </div>
    </div>

    <div className="text-center mt-8">
      <Link href="/jbbc/services">
        <Button
          type="primary" size="large"
          className="border-none text-white font-medium"
          style={{ background: "#00619A", borderRadius: 0, letterSpacing: "0.04em", fontFamily: "var(--font-serif-jp), serif" }}
        >
          View All Services
        </Button>
      </Link>
    </div>
  </div>
);

export default Content4;
