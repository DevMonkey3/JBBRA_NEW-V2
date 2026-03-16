"use client";

import { useState } from "react";
import { Typography, Row, Col, Button, Image as AntImage, Input, message } from "antd";
import Link from "next/link";
import Image from "next/image";
import { getCdnUrl } from "@/config/cdn";
import { getOptimizedImageProps } from "@/lib/image-optimizer";
// Removed: preloadCriticalImages — imported but never used anywhere in this file

// Evaluated once at module load — stable, no side effects on re-render
const CURRENT_YEAR = new Date().getFullYear();

const allImages = [
  "/HR Admin/business-people-2024-10-22-15-30-01-utc.avif",
  "/HR Admin/proud-of-everything-weve-achieved-portrait-of-a-g-2025-04-06-10-55-08-utc.avif",
  "/Garments/portrait-of-young-seamstress-using-sewing-machine-2025-04-04-21-11-54-utc.avif",
  "/Construction Worker/professional-technician-engineer-with-safety-hard-2024-12-06-13-12-06-utc.avif",
  "/Food Factory/staff-in-uniform-2025-03-14-11-07-34-utc.avif",
  "/Delivery/express-delivery-service-courier-delivering-packa-2024-11-01-23-11-21-utc.avif",
];

// Moved outside component — these are static arrays, no reason to recreate per render
const SERVICE_LINKS = [
  ["Skilled Workers", "/jbbc/services"],
  ["Highly Skilled Talent", "/jbbc/services"],
  ["Technical Interns", "/jbbc/services"],
  ["Other Solutions", "/jbbc/services"],
] as const;

const COMPANY_LINKS = [
  ["Company Profile", "/jbbc/Info"],
  ["Case Studies", "/jbbc/cases"],
  ["About Jbbra", "/jbbc/about"],
  ["Careers", "/jbbc/Info"],
] as const;

const RESOURCE_LINKS = [
  ["Seminars and Events", "/seminar"],
  ["Downloads", "/download"],
  ["FAQ", "/jbbc/faq"],
  ["Contact", "/jbbc/contact/inquiry"],
  ["Privacy Policy", "/legal/privacy"],
] as const;

const BOTTOM_LINKS = [
  ["Privacy Policy", "/legal/privacy"],
  ["Terms of Use", "/legal/terms"],
  ["Contact", "/jbbc/contact/inquiry"],
] as const;

const Footer: React.FC = () => {
  const { Title } = Typography;
  const { Search } = Input;
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = async (email: string) => {
    if (!email || !email.includes("@")) {
      message.error("Please enter a valid email address.");
      return;
    }
    setSubscribing(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        message.success("Newsletter subscription completed.");
      } else if (res.status === 409) {
        message.warning("This email is already subscribed.");
      } else {
        message.error(data.error || "Subscription failed.");
      }
    } catch {
      message.error("A network error occurred.");
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <footer className="footer-custom">
      {/* Image banner grid */}
      <div className="relative w-full py-12 bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-8">
            {allImages.map((src, i) => (
              <div key={i} className="aspect-video">
                <Image
                  {...getOptimizedImageProps(src, `Footer image ${i + 1}`, 320, 180, false)}
                  loading="lazy"
                  className="rounded-xl shadow-lg w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
          <p className="text-blue-600 text-base md:text-lg mb-2 opacity-90 font-semibold">Features</p>
          <p className="text-blue-800 text-xl md:text-2xl lg:text-3xl mb-6 max-w-4xl mx-auto font-bold">
            Hire skilled global talent faster and with less complexity.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-2">
            <Link href="/download">
              <Button shape="round" size="large" className="btn-primary text-white hover:bg-blue-700">
                Download Resources
              </Button>
            </Link>
            <Link href="/jbbc/contact/inquiry">
              <Button shape="round" size="large" className="btn-secondary hover:bg-blue-600 hover:text-white">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Newsletter bar */}
      <div className="py-12 px-4 md:px-10 lg:px-20 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white rounded-xl px-8 py-8 shadow-lg border-l-4 border-blue-600">
            <div className="flex flex-col gap-2 text-left">
              <span className="text-xs font-semibold uppercase tracking-widest text-blue-600">Stay Updated</span>
              <h2 className="text-xl font-bold text-gray-800 m-0">Newsletter Registration</h2>
              <p className="text-sm text-gray-600 m-0">Always check Jbbra's latest recruitment information</p>
            </div>
            <div className="w-full md:w-96 flex-shrink-0">
              <Search
                placeholder="Enter your email address"
                allowClear
                enterButton="Send"
                size="large"
                className="w-full"
                onSearch={handleSubscribe}
                loading={subscribing}
                disabled={subscribing}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main footer columns */}
      <div className="footer-section">
        <div className="max-w-7xl mx-auto">
          <Row gutter={[32, 48]}>
            <Col xs={24} sm={24} md={12} lg={8}>
              <div className="space-y-6">
                <AntImage src="/Jbbra images/JBBRA.png" alt="Jbbra Logo" width={120} height={120} preview={false} />
                <p className="text-sm leading-relaxed text-blue-100">
                  <span className="font-bold text-base block mb-2 text-white">Jbbra</span>
                  We connect companies in Japan with qualified international talent and provide end-to-end workforce support.
                </p>
                <div className="space-y-2 text-sm text-blue-100">
                  <div>TEL: 03-6279-1289</div>
                  <div>Email: info@jbbc.co.jp</div>
                  <div>Address: 1-1-1 Marunouchi, Chiyoda-ku, Tokyo 100-0005</div>
                </div>
              </div>
            </Col>

            <Col xs={12} sm={12} md={6} lg={5}>
              <h3 className="footer-heading">Services</h3>
              <ul className="space-y-3">
                {SERVICE_LINKS.map(([label, href]) => (
                  <li key={label}><Link href={href} className="footer-link">{label}</Link></li>
                ))}
              </ul>
            </Col>

            <Col xs={12} sm={12} md={6} lg={5}>
              <h3 className="footer-heading">Company</h3>
              <ul className="space-y-3">
                {COMPANY_LINKS.map(([label, href]) => (
                  <li key={label}><Link href={href} className="footer-link">{label}</Link></li>
                ))}
              </ul>
            </Col>

            <Col xs={12} sm={12} md={6} lg={4}>
              <h3 className="footer-heading">Resources</h3>
              <ul className="space-y-3">
                {RESOURCE_LINKS.map(([label, href]) => (
                  <li key={label}><Link href={href} className="footer-link">{label}</Link></li>
                ))}
              </ul>
            </Col>
          </Row>

          <div className="footer-divider" />
          <div className="footer-bottom">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex flex-wrap justify-center md:justify-start gap-6">
                {BOTTOM_LINKS.map(([label, href]) => (
                  <Link key={label} href={href} className="footer-link text-blue-200 hover:text-white">{label}</Link>
                ))}
              </div>
              <div className="flex items-center gap-4">
                <a
                  href="https://www.facebook.com/JBBRAbd/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-200 hover:text-white transition-colors"
                  aria-label="Follow us on Facebook"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <p className="footer-bottom-text">
                  Copyright © {CURRENT_YEAR} Jbbra. All Rights Reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
