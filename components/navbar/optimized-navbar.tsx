"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "antd";
import NextLink from "next/link";
import clsx from "clsx";
import Image from "next/image";

export const OptimizedNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const items = [
    { label: "Home", key: "Home", href: "/" },
    { label: "Why Choose Us", key: "inquiry", href: "/Why" },
    { label: "Services", key: "Service", href: "/jbbc/services" },
    { label: "Case Studies", key: "Track_Record", href: "/jbbc/cases" },
    { label: "Company", key: "Profile", href: "/jbbc/Info" },
    { label: "Seminars", key: "Seminar", href: "/seminar" },
    { label: "Blog", key: "Blog", href: "/blog" },
  ];

  return (
    <nav className="navbar-custom">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Image
              width={90}
              height={60}
              className="cursor-pointer object-contain navbar-logo"
              src="/Jbbra images/jbbra logo.png"
              alt="JBB Recruiting Agency"
              onClick={() => {
                router.push("/");
                if (isMenuOpen) setIsMenuOpen(false);
              }}
            />
          </div>

          {/* Desktop nav links */}
          <div className="hidden lg:flex gap-8 items-center">
            {items.map((item) => (
              <NextLink
                key={item.href}
                href={item.href}
                className={clsx(
                  "text-sm font-semibold transition-all duration-300 px-3 py-2 rounded-md",
                  pathname === item.href
                    ? "text-[#00619a] font-bold"
                    : "text-gray-900 hover:text-[#00619a]"
                )}
              >
                {item.label}
              </NextLink>
            ))}
          </div>

          {/* Desktop CTA buttons */}
          <div className="hidden lg:flex gap-3 items-center">
            <Button
              type="primary"
              size="small"
              className="!bg-[#00619a] !border-2 !border-[#00619a] !text-white !px-6 !py-2 !h-auto !rounded-full !font-semibold !text-sm hover:!bg-white hover:!text-[#00619a] transition-all duration-300"
              onClick={() => router.push("/download")}
            >
              Download Documents
            </Button>
            <Button
              size="small"
              className="!bg-white !border-2 !border-[#00619a] !text-[#00619a] !px-6 !py-2 !h-auto !rounded-full !font-semibold !text-sm hover:!bg-[#00619a] hover:!text-white transition-all duration-300"
              onClick={() => router.push("/jbbc/contact/inquiry")}
            >
              Inquiry
            </Button>
          </div>

          {/* Mobile hamburger */}
          <div className="lg:hidden pl-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="navbar-menu-toggle p-2 rounded-md hover:bg-gray-100 transition-colors"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="lg:hidden navbar-mobile-menu animate-slideDown">
            <div className="mx-4 flex flex-col gap-2 py-4">
              {items.map((item) => (
                <NextLink
                  key={item.href}
                  href={item.href}
                  className={clsx("w-full py-3 text-base font-semibold border-b border-gray-100 block transition-colors duration-300", {
                    "text-[#00619a] font-bold": pathname === item.href,
                    "text-gray-900 hover:text-[#00619a]": pathname !== item.href,
                  })}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </NextLink>
              ))}

              <div className="mt-6 flex flex-col gap-3">
                <button
                  className="w-full text-center py-3 rounded-lg !bg-[#00619a] !border-2 !border-[#00619a] !text-white font-semibold text-base block hover:!bg-white hover:!text-[#00619a] transition-all duration-300"
                  onClick={() => {
                    router.push("/download");
                    setIsMenuOpen(false);
                  }}
                >
                  Download Documents
                </button>
                <button
                  className="w-full text-center py-3 rounded-lg !bg-white !border-2 !border-[#00619a] !text-[#00619a] font-semibold text-base block hover:!bg-[#00619a] hover:!text-white transition-all duration-300"
                  onClick={() => {
                    router.push("/jbbc/contact/inquiry");
                    setIsMenuOpen(false);
                  }}
                >
                  Inquiry
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
