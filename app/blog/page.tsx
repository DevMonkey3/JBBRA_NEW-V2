'use client'
import React, { useMemo, useCallback, useState } from 'react';
import { Button } from "@heroui/button";
import { Image } from '@heroui/image';
import Breadcrumbs from "@/components/breadcrumb/page";
import BgFont from "@/components/bgFont/BgFont";
import Link from "next/link";
import { Spin } from "antd";
import { getCdnUrl } from "@/config/cdn";
import useSWR from 'swr';

// FIX: Removed export const dynamic = 'force-dynamic'
// This was forcing SSR on every request for a 'use client' component,
// which gains nothing and prevents any caching. Client components fetch
// data in the browser via SWR — the server never needs to rerender this.

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  publishedAt: Date | string;
  likeCount: number;
}

interface BlogApiResponse {
  posts: BlogPost[];
  total: number;
  hasMore: boolean;
}

// Fetcher function for SWR
const fetcher = async (url: string): Promise<BlogApiResponse> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
};

const categories = [
  "All",
  "Lifestyle",
  "Initiatives",
  "Residence Status",
  "Foreign Talent Recruitment",
  "Results / Know-how",
];

function CategoryPills() {
  return (
    <ul className="flex flex-wrap gap-2">
      {categories.map((c) => (
        <li key={c}>
          <Button
            variant="bordered"
            className="px-3 py-1 rounded-full border-[#01ccea] bg-white hover:text-white hover:bg-[#01ccea] text-gray-800 text-xs md:text-sm font-medium"
          >
            {c}
          </Button>
        </li>
      ))}
    </ul>
  );
}

const PostCard = React.memo(function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      {/* SEO: Using <article> semantic HTML tag for blog posts - helps search engines understand content structure */}
      <article className="rounded-lg border border-gray-200 shadow-sm overflow-hidden bg-white hover:shadow-lg transition-shadow cursor-pointer">
        <div className="relative aspect-video">
          {/* SEO: Added descriptive alt text for images - helps with image search and accessibility */}
          <Image
            src={post.coverImage || getCdnUrl('/home/blogPosts.avif')}
            alt={`${post.title} - Blog post cover image`}
            className="w-full h-full object-cover"
            width={400}
            height={225}
            loading="lazy"
          />
          <span className="absolute left-3 top-3 inline-block bg-sky-500 text-gray-900 text-xs px-2 py-1 rounded font-semibold">
            Lifestyle
          </span>
          <span className="absolute right-3 bottom-3 inline-block bg-red-500 text-gray-900 text-xs px-2 py-1 rounded font-semibold">
            ❤️ {post.likeCount}
          </span>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
            {post.title}
          </h3>
          <p className="text-sm text-gray-700 line-clamp-3 mb-2">
            {post.excerpt || 'No excerpt available'}
          </p>
          <div className="flex justify-between items-center">
            {/* SEO: Using <time> semantic tag with dateTime attribute - helps search engines understand publish dates */}
            <time className="text-xs text-gray-600" dateTime={new Date(post.publishedAt).toISOString()}>
              {new Date(post.publishedAt).toLocaleDateString('en-US')}
            </time>
            <span className="text-sky-600 hover:text-sky-700 text-xs font-medium">
              Read more →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
});

const POSTS_PER_PAGE = 12;

export default function BlogPage() {
  const [currentPage, setCurrentPage] = useState(1);

  // FIX: Static value — no need for useState, it never changes
  const breadcrumbData = [
    {
      key: "top",
      title: <span style={{ color: "#019cd4" }}>top</span>,
    },
    {
      key: "blog",
      title: "Blog",
    },
  ];

  // Use SWR for data fetching with automatic caching and revalidation
  const { data, isLoading, error } = useSWR<BlogApiResponse>(
    `/api/blog?page=${currentPage}&limit=${POSTS_PER_PAGE}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      keepPreviousData: true,
      dedupingInterval: 2000,
    }
  );

  const posts = data?.posts || [];
  const totalPosts = data?.total || 0;
  const hasMore = data?.hasMore || false;

  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const totalPages = useMemo(() => Math.ceil(totalPosts / POSTS_PER_PAGE), [totalPosts, POSTS_PER_PAGE]);

  return (
    /* SEO: <main> tag identifies primary content - helps search engines and screen readers */
    <main className="mx-auto max-w-6xl px-4 py-5">
      {/* SEO: Breadcrumb navigation helps search engines understand site structure */}
      <Breadcrumbs
        breadcrumb={breadcrumbData}
        pageTitle={'blog'}
        breadcrumbTitle={breadcrumbData[breadcrumbData.length - 1].title}
      />
      <BgFont textBg={'blog'} title={'Blog'} />

      {/* Category Pills */}
      <div className="mb-5 mt-5">
        <CategoryPills />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-20">
          <Spin size="large" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-20">
          <p className="text-red-600 mb-4">Failed to load blog posts</p>
          <Button onClick={() => window.location.reload()} color="primary">
            Try Again
          </Button>
        </div>
      )}

      {/* No Posts */}
      {!isLoading && !error && posts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500">No blog posts yet</p>
        </div>
      )}

      {/* Grid */}
      {!isLoading && !error && posts.length > 0 && (
        <>
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" aria-label="Blog posts list">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </section>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8 mb-4">
              <Button
                isDisabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-4 py-2"
                variant="bordered"
              >
                ← Previous
              </Button>
              <span className="text-sm text-gray-600 px-4">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                isDisabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-4 py-2"
                variant="bordered"
              >
                Next →
              </Button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
