// NewsSection.tsx
'use client';
import { Typography, Button, Card, Row, Col, Skeleton } from 'antd';
import { RightOutlined, CalendarOutlined } from '@ant-design/icons';
import Link from 'next/link';
import useSWR from 'swr';

const { Title, Text } = Typography;

interface Announcement {
  id: string;
  title: string;
  excerpt: string | null;
  publishedAt: string;
  slug: string;
}

interface AnnouncementsResponse {
  announcements: Announcement[];
  total: number;
  hasMore: boolean;
}

const fetcher = async (url: string): Promise<AnnouncementsResponse> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
};

export default function NewsSection() {
  const { data, isLoading } = useSWR<AnnouncementsResponse>('/api/announcements?limit=3', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000, // Revalidate every minute
  });

  const announcements = data?.announcements || [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  if (!isLoading && announcements.length === 0) return null;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12 md:py-16">
      {/* Section wrapper — accent bg, no roundness */}
      <div className="p-6 md:p-10 shadow-sm" style={{ backgroundColor: 'rgba(0,97,154,0.2)', borderRadius: 0 }}>
        {/* Header */}
        <div className="text-center mb-8">
          <Title level={2} className="!text-2xl md:!text-3xl !font-bold !mb-2 !text-[#00619A]">
            Latest News
          </Title>
          <Text className="text-base text-gray-600">Latest information from Jbbra</Text>
        </div>

        {/* News Cards */}
        <Row gutter={[16, 16]} className="mb-6">
          {isLoading ? (
            // Skeleton loading state
            Array.from({ length: 3 }).map((_, i) => (
              <Col xs={24} md={8} key={i}>
                <Card style={{ borderRadius: 0 }}>
                  <Skeleton active paragraph={{ rows: 2 }} />
                </Card>
              </Col>
            ))
          ) : (
            announcements.map((announcement) => (
              <Col xs={24} md={8} key={announcement.id}>
                <Link href={`/notices/${announcement.slug}`}>
                  <Card
                    hoverable
                    className="h-full shadow-sm hover:shadow-md transition-shadow duration-300"
                    style={{ borderRadius: 0 }}
                    styles={{ body: { padding: '16px' } }}
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex items-center text-gray-500 text-sm mb-2">
                        <CalendarOutlined className="mr-2" />
                        <Text className="text-sm">{formatDate(announcement.publishedAt)}</Text>
                      </div>
                      <Title level={5} className="!text-base !mb-2 !font-semibold line-clamp-2 flex-grow">
                        {announcement.title}
                      </Title>
                      {announcement.excerpt && (
                        <Text className="text-sm text-gray-600 line-clamp-3">{announcement.excerpt}</Text>
                      )}
                    </div>
                  </Card>
                </Link>
              </Col>
            ))
          )}
        </Row>

        {/* View All Button */}
        <div className="text-center">
          <Link href="/notices">
            <Button
              type="primary"
              size="large"
              className="!border-none !font-semibold px-8"
              style={{ background: '#00619A', borderRadius: 0 }}
              icon={<RightOutlined />}
              iconPosition="end"
            >
              View All News
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}