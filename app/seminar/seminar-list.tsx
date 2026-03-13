'use client';

import { Typography, Row, Col, Card, Button } from 'antd';
import { CalendarOutlined, EnvironmentOutlined, RightOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Title, Text } = Typography;

interface Seminar {
  id: string;
  title: string;
  description: string;
  location: string;
  startsAt: string;
  endsAt: string;
  slug: string;
  excerpt?: string;
  thumbnail?: string;
  speakerName?: string;
  speakerTitle?: string;
}

interface SeminarListProps {
  seminars: Seminar[];
}

export default function SeminarList({ seminars }: SeminarListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <Title level={1} className="!text-3xl md:!text-4xl !font-bold !mb-4">Seminars and Events</Title>
        <Text className="text-lg text-gray-600">Browse the latest seminars and event information from Jbbra.</Text>
      </div>

      {seminars.length === 0 ? (
        <div className="text-center py-20">
          <Title level={3} className="text-gray-400">No seminars are currently scheduled.</Title>
          <Text className="text-gray-500">Please check back for upcoming events.</Text>
        </div>
      ) : (
        <Row gutter={[24, 24]}>
          {seminars.map((seminar) => (
            <Col xs={24} md={12} lg={8} key={seminar.id}>
              <Card
                hoverable
                className="h-full flex flex-col shadow-md hover:shadow-xl transition-shadow duration-300"
                cover={
                  seminar.thumbnail ? (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        alt={seminar.title}
                        src={seminar.thumbnail}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="relative h-48 bg-gradient-to-br from-[#1AA4DD] to-[#0c7ba8] flex items-center justify-center">
                      <CalendarOutlined className="text-6xl text-white opacity-30" />
                    </div>
                  )
                }
              >
                <div className="flex flex-col h-full">
                  <div className="mb-3">
                    <div className="inline-block bg-[#FF6F00] text-white px-3 py-1 rounded-full text-sm font-semibold">
                      <CalendarOutlined className="mr-1" />
                      {formatDate(seminar.startsAt)}
                    </div>
                  </div>

                  <Title level={4} className="!text-lg !mb-3 line-clamp-2">{seminar.title}</Title>

                  {seminar.excerpt && (
                    <Text className="text-gray-600 mb-3 line-clamp-3 flex-grow">{seminar.excerpt}</Text>
                  )}

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <CalendarOutlined className="mr-2" />
                      <Text className="text-sm">{formatTime(seminar.startsAt)} - {formatTime(seminar.endsAt)}</Text>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <EnvironmentOutlined className="mr-2" />
                      <Text className="text-sm">{seminar.location}</Text>
                    </div>
                  </div>

                  {seminar.speakerName && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <Text strong className="block text-sm">Speaker</Text>
                      <Text className="text-sm">{seminar.speakerName}</Text>
                      {seminar.speakerTitle && (
                        <Text className="block text-xs text-gray-500">{seminar.speakerTitle}</Text>
                      )}
                    </div>
                  )}

                  <Link href={`/seminar/${seminar.slug}`}>
                    <Button
                      type="primary"
                      size="large"
                      block
                      className="!bg-[#FF6F00] hover:!bg-[#e56300] !border-none !font-semibold mt-auto"
                      icon={<RightOutlined />}
                      iconPosition="end"
                    >
                      View details and register
                    </Button>
                  </Link>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}