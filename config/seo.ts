// SEO Configuration for Jbbra Website
import { Metadata } from 'next';

export const siteConfig = {
  name: 'Japan Bangla Bridge Recruiting Agency (Jbbra)',
  description: 'JBBRA connects Bangladesh talent with jobs in Japan. Expert recruitment, training, and workforce solutions for companies and job seekers.',
  url: 'https://jbbc.co.jp',
  ogImage: 'https://bbc-images.sgp1.cdn.digitaloceanspaces.com/Jbbra%20realated%20photo/JBBRA%20Logo%20SVG%20(3).svg',
   keywords: "Jbbra, recruitment, staffing, skilled workers, international talent, Bangladesh, Japan, workforce support",
};

export const defaultMetadata: Metadata = {
  title: {
    default: 'JBBRA | Japan Bangladesh Recruiting Agency | Skilled Workers & Job Placement Services',
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
