 "use client";
import React, { useEffect, useRef } from "react";
import styles from "./carousal.module.css";
import { getCdnUrl } from "@/config/cdn";
import { getOptimizedImgProps } from "@/lib/image-optimizer";

export default function HeroCarousel() {
  const rootRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    // Respect reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;

    // Prevent double-clone on fast HMR reloads
    if (root.dataset.animated === "true") return;

    root.dataset.animated = "true";

    // Clone once to create seamless loop
    const items = Array.from(track.children);
    items.forEach((item) => {
      const clone = item.cloneNode(true);           // <-- no TS cast in .jsx
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);
    });

    // Add a real class to kick off CSS animation
    root.classList.add(styles.animated);
  }, []);

  return (
    <div ref={rootRef} className={styles.carousel}>
      <div ref={trackRef} className={styles.carouselTrack}>
        {/* All images now served from Digital Ocean CDN with optimization */}
        <img {...getOptimizedImgProps("/Carousal/Client-Logo-3.avif", "Logo 1", 145, 85, false)} className={styles.carouselLogo} />
        <img {...getOptimizedImgProps("/Carousal/Client-Logo-4.avif", "Logo 2", 145, 85, false)} className={styles.carouselLogo} />
        <img {...getOptimizedImgProps("/Carousal/Client-Logo-6.avif", "Logo 3", 145, 85, false)} className={styles.carouselLogo} />
        <img {...getOptimizedImgProps("/Carousal/Client-Logo-7.avif", "Logo 4", 145, 85, false)} className={styles.carouselLogo} />
        <img {...getOptimizedImgProps("/Carousal/Client-Logo-8.avif", "Logo 5", 145, 85, false)} className={styles.carouselLogo} />
        <img {...getOptimizedImgProps("/Carousal/Client-Logo-9.avif", "Logo 6", 145, 85, false)} className={styles.carouselLogo} />
        <img {...getOptimizedImgProps("/Carousal/Client-Logo-10.avif", "Logo 7", 145, 85, false)} className={styles.carouselLogo} />
        <img {...getOptimizedImgProps("/Carousal/Client-Logo-11.avif", "Logo 8", 145, 85, false)} className={styles.carouselLogo} />
        <img {...getOptimizedImgProps("/Carousal/Client-Logo-12.avif", "Logo 9", 145, 85, false)} className={styles.carouselLogo} />
        <img {...getOptimizedImgProps("/Carousal/Client-Logo-DP.avif", "Logo 10", 145, 85, false)} className={styles.carouselLogo} />
        <img {...getOptimizedImgProps("/Carousal/clientlogo8_2x.webp", "Logo 11", 145, 85, false)} className={styles.carouselLogo} />
      </div>
    </div>
  );
}
