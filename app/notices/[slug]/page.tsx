/**
 * FIX: Changed to client component to fix React Error #130
 * WHY: Ant Design icons are client-side components that cannot be rendered in server components
 * ERROR: "Element type is invalid" occurred because icons like <MailOutlined /> were undefined in server context
 * SOLUTION: Convert to client component and fetch data client-side instead of server-side
 */
'use client'

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Tag, Typography, Divider, Spin } from 'antd';
import {
  MailOutlined,
  CalendarOutlined,
  NotificationOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import Link from 'next/link';

const { Title, Paragraph, Text } = Typography;

// SEO: Type definitions for content
interface BaseContent {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  publishedAt: string;
}

interface Newsletter extends BaseContent {
  body: string;
}

interface Seminar extends BaseContent {
  description: string;
  startsAt: string;
  endsAt: string;
  location: string;
  speakerName?: string | null;
  speakerTitle?: string | null;
  speakerOrg?: string | null;
  registrationUrl?: string | null;
}

interface Announcement extends BaseContent {
  body: string;
}

type ContentType = 'newsletter' | 'seminar' | 'announcement';

interface NoticeData {
  content: Newsletter | Seminar | Announcement;
  type: ContentType;
}

export default function NoticeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [data, setData] = useState<NoticeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const fetchNotice = async () => {
      try {
        // SEO: Fetch notice data from API
        const res = await fetch(`/api/notices/${slug}`);

        if (!res.ok) {
          if (res.status === 404) {
            setNotFound(true);
          }
          throw new Error('Failed to fetch notice');
        }

        const result: NoticeData = await res.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching notice:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchNotice();
  }, [slug]);

  /**
   * SEO: Type configuration for visual indicators
   * Returns icon, color, and label for each content type
   */
  const getTypeConfig = (type: ContentType) => {
    switch (type) {
      case 'newsletter':
        return {
          color: '#1890ff',
          label: 'ニュースレター',
          icon: <MailOutlined />,
        };
      case 'seminar':
        return {
          color: '#52c41a',
          label: 'セミナー',
          icon: <CalendarOutlined />,
        };
      case 'announcement':
        return {
          color: '#fa8c16',
          label: 'お知らせ',
          icon: <NotificationOutlined />,
        };
      default:
        return {
          color: '#8c8c8c',
          label: '不明',
          icon: <NotificationOutlined />,
        };
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  // 404 state
  if (notFound || !data) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-8 lg:px-16">
        <div className="max-w-4xl mx-auto text-center">
          <Title level={1}>お知らせが見つかりません</Title>
          <Paragraph>
            お探しのページは存在しないか、削除された可能性があります。
          </Paragraph>
          <Link href="/notices" className="text-blue-600 hover:underline">
            ← お知らせ一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  const { content, type } = data;
  const typeConfig = getTypeConfig(type);
  const date = new Date(content.publishedAt);

  // Type guards for content type - fixed to properly narrow types
  const seminarContent = type === 'seminar' ? (content as Seminar) : null;
  const announcementContent = type === 'announcement' ? (content as Announcement) : null;
  const newsletterContent = type === 'newsletter' ? (content as Newsletter) : null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-8 lg:px-16">
      <div className="max-w-4xl mx-auto">
        {/* SEO: Breadcrumb navigation */}
        <Link href="/notices" className="text-blue-600 hover:underline mb-4 inline-block">
          ← お知らせ一覧に戻る
        </Link>

        <Card>
          {/* Header */}
          <div className="mb-6">
            <div className="mb-3 flex items-center gap-3">
              {/* SEO: Visual type indicator with icon */}
              <Tag icon={typeConfig.icon} color={typeConfig.color} className="text-sm py-1 px-3">
                {typeConfig.label}
              </Tag>
              {/* SEO: Semantic time element for published date */}
              <Text type="secondary" className="flex items-center gap-1">
                <ClockCircleOutlined />
                <time dateTime={content.publishedAt}>
                  {date.toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </Text>
            </div>

            {/* SEO: Main heading (h1) for page title */}
            <Title level={1} className="!mb-4">
              {content.title}
            </Title>

            {/* SEO: Excerpt as lead paragraph */}
            {content.excerpt && (
              <Paragraph className="text-lg text-gray-600 mb-0">
                {content.excerpt}
              </Paragraph>
            )}
          </div>

          <Divider />

          {/* Seminar-specific info */}
          {seminarContent && (
            <div className="mb-6 p-4 bg-green-50 rounded-lg">
              <Title level={4} className="!mb-3">
                セミナー情報
              </Title>
              <div className="space-y-2">
                {/* SEO: Structured seminar date/time information */}
                <div className="flex items-start gap-2">
                  <CalendarOutlined className="mt-1 text-green-600" />
                  <div>
                    <Text strong>開催日時:</Text>
                    <br />
                    <Text>
                      <time dateTime={seminarContent.startsAt}>
                        {new Date(seminarContent.startsAt).toLocaleString('ja-JP', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </time>
                      {' 〜 '}
                      <time dateTime={seminarContent.endsAt}>
                        {new Date(seminarContent.endsAt).toLocaleString('ja-JP', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </time>
                    </Text>
                  </div>
                </div>

                {/* SEO: Location information */}
                <div className="flex items-start gap-2">
                  <EnvironmentOutlined className="mt-1 text-green-600" />
                  <div>
                    <Text strong>場所:</Text>
                    <br />
                    <Text>{seminarContent.location}</Text>
                  </div>
                </div>

                {/* SEO: Speaker information */}
                {seminarContent.speakerName && (
                  <div className="flex items-start gap-2">
                    <span className="mt-1 text-green-600">👤</span>
                    <div>
                      <Text strong>講師:</Text>
                      <br />
                      <Text>
                        {seminarContent.speakerName}
                        {seminarContent.speakerTitle && ` (${seminarContent.speakerTitle})`}
                        {seminarContent.speakerOrg && ` - ${seminarContent.speakerOrg}`}
                      </Text>
                    </div>
                  </div>
                )}

                {/* SEO: Call-to-action for seminar registration */}
                {seminarContent.registrationUrl && (
                  <div className="mt-4">
                    <a
                      href={seminarContent.registrationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
                    >
                      セミナーに申し込む →
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SEO: Main content body with semantic article structure */}
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{
              __html: seminarContent
                ? seminarContent.description
                : announcementContent
                ? announcementContent.body
                : newsletterContent
                ? newsletterContent.body
                : '',
            }}
          />
        </Card>

        {/* SEO: Navigation back to listings */}
        <div className="mt-8 text-center">
          <Link href="/notices" className="text-blue-600 hover:underline">
            ← すべてのお知らせを見る
          </Link>
        </div>
      </div>
    </div>
  );
}
