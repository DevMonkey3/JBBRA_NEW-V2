'use client'
import { useState, useMemo, useCallback } from 'react';
import { Card, Row, Col, Tag, Typography, Spin, Input, Select, Button } from 'antd';
import {
  MailOutlined,
  CalendarOutlined,
  NotificationOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import useSWR from 'swr';
import type { Notice } from '../api/notices/route';

const { Title, Text } = Typography;
const { Search } = Input;

interface NoticesApiResponse {
  notices: Notice[];
  total: number;
  hasMore: boolean;
}

const fetcher = async (url: string): Promise<NoticesApiResponse> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
};

export default function NoticesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const NOTICES_PER_PAGE = 12;

  // Use SWR for data fetching with automatic caching and revalidation
  const { data, isLoading, error } = useSWR<NoticesApiResponse>(
    `/api/notices?page=${currentPage}&limit=${NOTICES_PER_PAGE}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      keepPreviousData: true,
      dedupingInterval: 2000,
    }
  );

  const notices = data?.notices || [];
  const totalNotices = data?.total || 0;
  const hasMore = data?.hasMore || false;

  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const totalPages = useMemo(() => Math.ceil(totalNotices / NOTICES_PER_PAGE), [totalNotices, NOTICES_PER_PAGE]);

  // Filter notices based on search and type - memoized to prevent unnecessary recalculations
  const filteredNotices = useMemo(() => {
    let filtered = notices;

    if (typeFilter !== 'all') {
      filtered = filtered.filter(n => n.type === typeFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(n =>
        n.title.toLowerCase().includes(query) ||
        n.excerpt?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [notices, searchQuery, typeFilter]);

  // Memoize type config to prevent unnecessary re-creation of icons
  const getTypeConfig = useCallback((type: string) => {
    switch (type) {
      case 'newsletter':
        return { color: '#1890ff', label: 'Newsletter', icon: <MailOutlined /> };
      case 'seminar':
        return { color: '#52c41a', label: 'Seminar', icon: <CalendarOutlined /> };
      case 'announcement':
        return { color: '#fa8c16', label: 'Announcement', icon: <NotificationOutlined /> };
      default:
        return { color: '#8c8c8c', label: 'Unknown', icon: <NotificationOutlined /> };
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-8 lg:px-16">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Title level={1} className="!mb-2">Notices and News</Title>
          <Text type="secondary">View the latest updates, seminars, and newsletters from Jbbra.</Text>
        </div>

        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <Search
            placeholder="Search..."
            allowClear
            size="large"
            className="flex-1"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Select
            size="large"
            style={{ width: 200 }}
            value={typeFilter}
            onChange={setTypeFilter}
            options={[
              { label: 'All', value: 'all' },
              { label: 'Newsletter', value: 'newsletter' },
              { label: 'Seminar', value: 'seminar' },
              { label: 'Announcement', value: 'announcement' },
            ]}
          />
        </div>

        {isLoading && (
          <div className="text-center py-20">
            <Spin size="large" />
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <Text type="danger" className="mb-4 block">Failed to load notices</Text>
            <Button onClick={() => window.location.reload()} type="primary">
              Try Again
            </Button>
          </div>
        )}

        {!isLoading && !error && filteredNotices.length === 0 && (
          <div className="text-center py-20">
            <Text type="secondary">No matching notices were found.</Text>
          </div>
        )}

        {!isLoading && !error && filteredNotices.length > 0 && (
          <>
            <Row gutter={[16, 16]}>
              {filteredNotices.map((notice) => {
                const typeConfig = getTypeConfig(notice.type);
                const date = new Date(notice.publishedAt);

                return (
                  <Col key={notice.id} xs={24} md={12} lg={8}>
                    <Link href={`/notices/${notice.slug}`}>
                      <Card
                        hoverable
                        className="h-full"
                        bodyStyle={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <Tag icon={typeConfig.icon} color={typeConfig.color}>{typeConfig.label}</Tag>
                          <Text type="secondary" className="text-xs flex items-center gap-1">
                            <ClockCircleOutlined />
                            {date.toLocaleDateString('en-US')}
                          </Text>
                        </div>

                        <Title level={4} className="!mb-2 line-clamp-2">{notice.title}</Title>

                        {notice.excerpt && (
                          <Text type="secondary" className="line-clamp-3">{notice.excerpt}</Text>
                        )}

                        <div className="mt-auto pt-4">
                          <Text className="text-blue-600 hover:underline">Read more -&gt;</Text>
                        </div>
                      </Card>
                    </Link>
                  </Col>
                );
              })}
            </Row>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8 mb-4">
                <Button
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="px-4"
                >
                  ← Previous
                </Button>
                <span className="text-sm text-gray-600 px-4">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="px-4"
                >
                  Next →
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}