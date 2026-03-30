// components/navbar/optimized-navbar.tsx
"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import NextLink from "next/link";
import clsx from "clsx";
import Image from "next/image";

// Static const outside component — recreating this array on every render
// allocates a new array object and 7 new item objects unnecessarily
const NAV_ITEMS = [
  { label: "Home",         href: "/"                   },
  { label: "Why Choose Us", href: "/Why"               },
  { label: "Services",     href: "/jbbra/services"      },
  { label: "Case Studies", href: "/jbbra/cases"         },
  { label: "Company",      href: "/jbbra/Info"          },
  { label: "Seminars",     href: "/seminar"            },
  { label: "Blog",         href: "/blog"               },
] as const;

export const OptimizedNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Removed: useRouter() — was only used for onClick={() => router.push(...)}
  // which bypasses Next.js prefetching. <Link> prefetches on hover automatically,
  // making navigation feel instant. router.push does not prefetch.

  return (
    <nav className="navbar-custom">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-20">

          {/* Logo — Link instead of onClick+router.push for prefetch support */}
          <div className="flex-shrink-0">
            <NextLink href="/" onClick={() => isMenuOpen && setIsMenuOpen(false)}>
              <Image
                width={90}
                height={60}
                className="cursor-pointer object-contain navbar-logo"
                src="/Jbbra images/jbbra logo.png"
                alt="JBB Recruiting Agency"
              />
            </NextLink>
          </div>

          {/* Desktop nav links */}
          <div className="hidden lg:flex gap-8 items-center">
            {NAV_ITEMS.map(item => (
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

          {/* Desktop CTA buttons — Link for prefetch, not router.push */}
          <div className="hidden lg:flex gap-3 items-center">
            <NextLink
              href="/download"
              className="!bg-[#00619a] border-2 border-[#00619a] text-white px-6 py-2 rounded-full font-semibold text-sm hover:bg-white hover:text-[#00619a] transition-all duration-300"
            >
              Download Documents
            </NextLink>
            <NextLink
              href="/jbbc/contact/inquiry"
              className="bg-white border-2 border-[#00619a] text-[#00619a] px-6 py-2 rounded-full font-semibold text-sm hover:bg-[#00619a] hover:text-white transition-all duration-300"
            >
              Inquiry
            </NextLink>
          </div>

          {/* Mobile hamburger */}
          <div className="lg:hidden pl-4">
            <button
              onClick={() => setIsMenuOpen(o => !o)}
              className="navbar-menu-toggle p-2 rounded-md hover:bg-gray-100 transition-colors"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              type="button"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="lg:hidden navbar-mobile-menu animate-slideDown">
              <div className="mx-4 flex flex-col gap-2 py-4">
                {NAV_ITEMS.map(item => (
                  <NextLink
                    key={item.href}
                    href={item.href}
                    className={clsx(
                      "w-full py-3 text-base font-semibold border-b border-gray-100 block transition-colors duration-300",
                      pathname === item.href
                        ? "text-[#00619a] font-bold"
                        : "text-gray-900 hover:text-[#00619a]"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </NextLink>
                ))}

                <div className="mt-6 flex flex-col gap-3">
                  <NextLink
                    href="/download"
                    className="w-full text-center py-3 rounded-lg bg-[#00619a] border-2 border-[#00619a] text-white font-semibold text-base block hover:bg-white hover:text-[#00619a] transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Download Documents
                  </NextLink>
                  <NextLink
                    href="/jbbc/contact/inquiry"
                    className="w-full text-center py-3 rounded-lg bg-white border-2 border-[#00619a] text-[#00619a] font-semibold text-base block hover:bg-[#00619a] hover:text-white transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Inquiry
                  </NextLink>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
