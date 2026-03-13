Here’s a polished README-style description you can drop straight into your repo:

---

# JBBC Website

A bilingual corporate website for Japan Bangla Bridge Corporation (JBBC), built with **Next.js 14** and **HeroUI v2**.
The site showcases services, company news, seminars, and downloadable resources. Visitors can request materials via a simple form, with submissions stored in Google Sheets for easy admin access. An admin dashboard manages newsletters, announcements, and seminars.

## Technologies

* [Next.js 14 (App Router)](https://nextjs.org/docs/getting-started)
* [HeroUI v2](https://heroui.com/)
* [Tailwind CSS](https://tailwindcss.com/)
* [Framer Motion](https://www.framer.com/motion/)
* [Google Sheets API](https://developers.google.com/sheets) for data collection
* [Resend](https://resend.com/) (optional) for transactional email delivery

## Getting Started

Clone the repo and install dependencies:

```bash
git clone https://github.com/yourname/jbbc-website.git
cd jbbc-website

# install
npm install

# run dev server
npm run dev

# build for production
npm run build

# run production
npm run start
```

If using **pnpm** instead of npm, add this to `.npmrc`:

```bash
public-hoist-pattern[]=*@heroui/*
```

then run:

```bash
pnpm install
```
