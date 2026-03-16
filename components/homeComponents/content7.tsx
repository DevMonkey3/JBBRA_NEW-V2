// components/homeComponents/content7.tsx
"use client";

import React from "react";
import Link from "next/link";
import styles from "./content7.module.css";

type Reason = { number: number; title: string; description: string };

// Static const — not state, never changes
const REASONS: Reason[] = [
  { number: 1, title: "Optimal Talent Introduction",               description: "Smooth introductions through a robust network of foreign job seekers and job media." },
  { number: 2, title: "Follow-up Support",                         description: "Consistent follow-up from recruitment through post-employment, including housing assistance." },
  { number: 3, title: "Specified Skills from Abroad",              description: "Hire young Vietnamese university students for up to 1 year while they study for the specified skills exam." },
  { number: 4, title: "Specified Skills from International Students", description: "Utilize international students on a trial basis through dispatch while evaluating their performance." },
  { number: 5, title: "Our Talent Quality is Different!",          description: "A 'completely customized' pre-education program — specialized terminology learned in advance before entering the country." },
];

export default function Content7() {
  return (
    <section className={`${styles.wrap} mx-auto w-full max-w-6xl px-4 py-8 md:py-10`}>
      <div className="bg-white shadow-lg ring-1 ring-black/5 px-5 py-8 md:px-10 md:py-12" style={{ borderRadius: 0 }}>
        <header className="text-center mb-8 md:mb-10" style={{ borderBottom: "1px solid rgba(0,97,154,0.2)", paddingBottom: "1.5rem" }}>
          <p className="m-0 text-base text-gray-500 mb-1" style={{ letterSpacing: "0.06em" }}>That's our</p>
          <h2 className="m-0 font-extrabold text-[#00619A] leading-tight" style={{ fontSize: "clamp(1.4rem, 3.5vw, 2.4rem)", letterSpacing: "0.04em", marginBottom: "0.5rem" }}>
            "Specified Skills &amp; Foreign Talent"
          </h2>
          <p className="text-base text-gray-600 m-0" style={{ letterSpacing: "0.05em" }}>
            The 5 reasons why our specified skills are chosen...
          </p>
        </header>

        <div style={{ border: "1px solid rgba(0,97,154,0.3)" }}>
          {REASONS.map(r => (
            <div key={r.number} className={styles.reasonRow}>
              <div className={styles.labelCol}>Reason {String(r.number).padStart(2, "0")}</div>
              <div className={styles.contentCol}>
                <span className={styles.titleText}>{r.title}</span>
                <span className={styles.descText}>{r.description}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center md:text-right">
          {/* Link instead of window.location.href */}
          <Link href="/jbbc/contact/inquiry">
            <button
              type="button"
              className="bg-[#00619A] hover:bg-[#004f7e] text-white px-8 py-3 text-base md:text-lg shadow-sm focus:outline-none"
              style={{ borderRadius: 0, fontFamily: "var(--font-serif-jp), serif", letterSpacing: "0.04em" }}
            >
              Ask Our Sales Team
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
