"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import NextLink from "next/link";
import clsx from "clsx";
import { Image } from "@heroui/image";

export const Navbar = () => {
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
    <HeroUINavbar
      maxWidth="xl"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      className="navbar-custom"
    >
      {/* Logo */}
      <NavbarContent justify="start" className="basis-auto">
        <Image
          radius="none"
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
      </NavbarContent>

      {/* Desktop nav links */}
      <NavbarContent className="hidden lg:flex gap-8" justify="center">
        {items.map((item) => (
          <NavbarItem key={item.href}>
            <NextLink
              href={item.href}
              className={clsx(
                "nav-link text-sm font-semibold transition-all duration-300",
                pathname === item.href
                  ? "text-primary font-bold"
                  : "text-gray-900 hover:text-primary"
              )}
            >
              {item.label}
            </NextLink>
          </NavbarItem>
        ))}
      </NavbarContent>

      {/* Desktop CTA buttons */}
      <NavbarContent className="hidden lg:flex basis-auto" justify="end">
        <NavbarItem className="flex gap-3 items-center">
          <Button
            as={NextLink}
            href="/download"
            size="sm"
            className="btn-primary navbar-btn"
          >
            Download Documents
          </Button>
          <Button
            as={NextLink}
            href="/jbbc/contact/inquiry"
            size="sm"
            className="btn-secondary navbar-btn"
          >
            Inquiry
          </Button>
        </NavbarItem>
      </NavbarContent>

      {/* Mobile hamburger */}
      <NavbarContent className="lg:hidden basis-1 pl-4" justify="end">
        <NavbarMenuToggle 
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="navbar-menu-toggle"
        />
      </NavbarContent>

      {/* Mobile menu */}
      <NavbarMenu className="bg-white pt-4 navbar-mobile-menu">
        <div className="mx-4 flex flex-col gap-2">
          {items.map((item) => (
            <NavbarMenuItem key={item.href}>
              <NextLink
                href={item.href}
                className={clsx("w-full py-3 text-base font-semibold border-b border-gray-100 block transition-colors duration-300", {
                  "text-primary font-bold": pathname === item.href,
                  "text-gray-900 hover:text-primary": pathname !== item.href,
                })}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </NextLink>
            </NavbarMenuItem>
          ))}

          <NavbarMenuItem className="mt-4 flex flex-col gap-3">
            <NextLink
              href="/download"
              className="w-full text-center py-3 rounded-lg btn-primary text-white font-semibold text-base block"
              onClick={() => setIsMenuOpen(false)}
            >
              Download Documents
            </NextLink>
            <NextLink
              href="/jbbc/contact/inquiry"
              className="w-full text-center py-3 rounded-lg btn-secondary text-primary font-semibold text-base border-2 border-primary block"
              onClick={() => setIsMenuOpen(false)}
            >
              Inquiry
            </NextLink>
          </NavbarMenuItem>
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
