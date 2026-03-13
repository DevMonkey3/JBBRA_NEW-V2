// Content6.tsx
"use client";

import React from "react";
import { getCdnUrl } from "@/config/cdn";

export default function Content6() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-4 md:py-6 mb-6 md:mb-8">
      <div className="relative">
        {/* Background overlay title */}
        <h2
          aria-hidden="true"
          className="pointer-events-none select-none absolute inset-x-0 -top-5 md:-top-6 text-center
                     font-bold text-white/75
                     text-[clamp(2rem,8vw,4.5rem)]
                     drop-shadow-[1px_1px_2px_rgba(0,0,0,0.25)]
                     tracking-wide z-0"
        >
          Support
        </h2>

        {/* Images — no roundness */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          <div className="relative h-[220px] md:h-[260px] lg:h-[300px] overflow-hidden">
            <img
              src={getCdnUrl("/home/content6Img1.avif")}
              alt="Team 1"
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="relative h-[220px] md:h-[260px] lg:h-[300px] overflow-hidden">
            <img
              src={getCdnUrl("/home/content6Img2.avif")}
              alt="Team 2"
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}