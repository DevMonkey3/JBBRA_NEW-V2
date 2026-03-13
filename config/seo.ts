// SEO Configuration for Jbbra Website
import { Metadata } from 'next';

export const siteConfig = {
  name: 'Jbbra',
  description: 'Jbbra provides international recruitment, staffing, and workforce support services connecting Japan and Bangladesh.',
  url: 'https://jbbc.co.jp',
  ogImage: 'https://bbc-images.sgp1.cdn.digitaloceanspaces.com/Jbbra%20realated%20photo/JBBRA%20Logo%20SVG%20(3).svg',
  keywords: [
    '外国人材',
    '特定技能',
    '高度人材',
    'バングラデシュ',
    'IT人材',
    '人材紹介',
    '技能実習生',
    '留学生',
    'グローバル人材',
    'DX',
    'オフショア開発',
  ],
};

export const defaultMetadata: Metadata = {
  title: {
    default: 'Jbbra | Recruitment and Workforce Solutions',
    template: '%s | Jbbra',
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: 'Jbbra' }],
  creator: 'Jbbra',
  publisher: 'Jbbra',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: '@jbbra',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};

// Page-specific metadata generators
export function generatePageMetadata(
  title: string,
  description: string,
  path: string = '',
  image?: string
): Metadata {
  const url = `${siteConfig.url}${path}`;
  const ogImage = image || siteConfig.ogImage;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}
