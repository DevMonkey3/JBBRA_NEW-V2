import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.siteUrl;

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/jbbc/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/jbbc/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/jbbc/contact/inquiry`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/jbbc/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/notices`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/seminar`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  try {
    // Dynamic newsletter pages
    const newsletters = await prisma.newsletter.findMany({
      select: { slug: true, publishedAt: true },
    });

    const newsletterPages: MetadataRoute.Sitemap = newsletters.map((newsletter) => ({
      url: `${baseUrl}/notices/${newsletter.slug}`,
      lastModified: newsletter.publishedAt,
      changeFrequency: 'weekly',
      priority: 0.6,
    }));

    // Dynamic seminar pages
    const seminars = await prisma.seminar.findMany({
      select: { slug: true, publishedAt: true },
    });

    const seminarPages: MetadataRoute.Sitemap = seminars.map((seminar) => ({
      url: `${baseUrl}/notices/${seminar.slug}`,
      lastModified: seminar.publishedAt,
      changeFrequency: 'weekly',
      priority: 0.6,
    }));

    // Dynamic announcement pages
    const announcements = await prisma.announcement.findMany({
      select: { slug: true, publishedAt: true },
    });

    const announcementPages: MetadataRoute.Sitemap = announcements.map((announcement) => ({
      url: `${baseUrl}/notices/${announcement.slug}`,
      lastModified: announcement.publishedAt,
      changeFrequency: 'weekly',
      priority: 0.6,
    }));

    return [...staticPages, ...newsletterPages, ...seminarPages, ...announcementPages];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return staticPages;
  }
}
