export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Jbbra",
  description: "Jbbra provides international recruitment, staffing, and workforce support services connecting Japan and Bangladesh.",
  keywords: "Jbbra, recruitment, staffing, skilled workers, international talent, Bangladesh, Japan, workforce support",
  author: "Jbbra",
  siteUrl: process.env.NEXTAUTH_URL || "https://jbbc.co.jp",
  ogImage: "https://bbc-images.sgp1.cdn.digitaloceanspaces.com/Jbbra%20realated%20photo/JBBRA%20Logo%20SVG%20(3).svg",
  twitterHandle: "@jbbc_official",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Docs",
      href: "/docs",
    },
    {
      label: "Pricing",
      href: "/pricing",
    },
    {
      label: "Blog",
      href: "/blog",
    },
    {
      label: "About",
      href: "/about",
    },
  ],
  navMenuItems: [
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Projects",
      href: "/projects",
    },
    {
      label: "Team",
      href: "/team",
    },
    {
      label: "Calendar",
      href: "/calendar",
    },
    {
      label: "Settings",
      href: "/settings",
    },
    {
      label: "Help & Feedback",
      href: "/help-feedback",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
  links: {
    github: "https://github.com/heroui-inc/heroui",
    twitter: "https://twitter.com/hero_ui",
    docs: "https://heroui.com",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
