// components/homeComponents/content10.tsx
"use client";

import { Typography, Button, Card } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import Link from "next/link";
import { getCdnUrl } from "@/config/cdn";
import useSWR from "swr";

const { Text, Title } = Typography;

interface BlogPost {
  id: string;
  title: string;
  excerpt: string | null;
  slug: string;
  coverImage: string | null;
}

interface BlogApiResponse {
  posts: BlogPost[];
}

const fetcher = (url: string): Promise<BlogApiResponse> =>
  fetch(url).then(r => { if (!r.ok) throw new Error("fetch failed"); return r.json(); });

// Fallback shown only if the API errors out entirely
const FALLBACK_POSTS: BlogPost[] = [{
  id: "1",
  title: "Life in Japan: A Day in the Life of a Bangladeshi Worker",
  excerpt: "From early morning commutes to clean and efficient workplaces, and enjoying Japanese food while spending a peaceful evening...",
  slug: "demo-post-1",
  coverImage: getCdnUrl("/home/blogPosts.avif"),
}];

export default function Content10() {
  const [startIndex, setStartIndex] = useState(0);

  // SWR replaces useEffect+useState fetch — automatic caching, no re-fetch on every mount
  const { data, isLoading, error } = useSWR<BlogApiResponse>(
    "/api/blog?limit=6",
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 60000 }
  );

  const allPosts = error ? FALLBACK_POSTS : (data?.posts ?? []);
  const visiblePosts = allPosts.slice(startIndex, startIndex + 3);

  const handlePrev = () => setStartIndex(i => Math.max(0, i - 1));
  const handleNext = () => setStartIndex(i => Math.min(allPosts.length - 3, i + 1));

  if (isLoading) {
    return (
      <div className="w-full px-4 py-8 md:py-10 mb-8" style={{ backgroundColor: "rgba(0,97,154,0.2)" }}>
        <div className="text-center py-10"><Text>Loading...</Text></div>
      </div>
    );
  }

  if (allPosts.length === 0) {
    return (
      <div className="w-full px-4 py-8 md:py-10 mb-8" style={{ backgroundColor: "rgba(0,97,154,0.2)" }}>
        <div className="text-center py-10"><Text>No blog posts yet</Text></div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-8 md:py-10 mb-8" style={{ backgroundColor: "rgba(0,97,154,0.2)" }}>
      <div className="flex items-center justify-center space-x-4 md:space-x-6 overflow-x-auto pb-4">
        {/* Left arrow — now functional */}
        <Button
          icon={<LeftOutlined />}
          onClick={handlePrev}
          disabled={startIndex === 0}
          className="flex-shrink-0 border-[#00619A] text-[#00619A] hover:bg-[#00619A] hover:text-white font-bold text-base w-10 h-10 md:w-12 md:h-12 flex items-center justify-center shadow-md"
          style={{ borderRadius: 0, background: "white" }}
        />

        <div className="flex space-x-4 md:space-x-6">
          {visiblePosts.map((post, index) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <Card
                hoverable
                cover={
                  <div className="relative">
                    <img
                      alt={post.title}
                      src={post.coverImage || getCdnUrl("/home/blogPosts.avif")}
                      className="w-64 md:w-80 h-48 md:h-56 object-cover"
                      style={{ borderRadius: 0 }}
                      loading={index === 0 ? "eager" : "lazy"}
                    />
                    <div
                      className="absolute top-3 left-4 bg-[#00619A] text-white py-1 px-3 text-xs md:text-sm font-medium"
                      style={{ borderRadius: 0 }}
                    >
                      Lifestyle
                    </div>
                  </div>
                }
                className="flex-shrink-0 w-64 md:w-80 overflow-hidden border border-gray-200 shadow-sm bg-white"
                style={{ borderRadius: 0 }}
              >
                <div className="p-4">
                  <Title level={4} className="!text-base md:!text-lg !m-0 mb-2 line-clamp-2">{post.title}</Title>
                  <Text className="text-sm md:text-base text-gray-600 line-clamp-3">
                    {post.excerpt || "No excerpt available"}
                  </Text>
                  <div className="mt-3 text-right">
                    <Button type="link" className="!p-0 !text-[#00619A] hover:!text-[#004f7e]">Read More</Button>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Right arrow — now functional */}
        <Button
          icon={<RightOutlined />}
          onClick={handleNext}
          disabled={startIndex >= allPosts.length - 3}
          className="flex-shrink-0 border-[#00619A] text-[#00619A] hover:bg-[#00619A] hover:text-white font-bold text-base w-10 h-10 md:w-12 md:h-12 flex items-center justify-center shadow-md"
          style={{ borderRadius: 0, background: "white" }}
        />
      </div>

      <div className="flex justify-center mt-6">
        <Link href="/blog">
          <Button
            type="primary"
            size="large"
            className="border-none !px-6 !py-2 md:!px-8 md:!py-3 !text-base md:!text-lg"
            style={{ background: "#00619A", borderRadius: 0 }}
          >
            View All Articles →
          </Button>
        </Link>
      </div>
    </div>
  );
}
