'use client'
import { useState } from 'react';
import { Card, Input, Button, message, Typography, Result } from 'antd';
import { MailOutlined, CheckCircleOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Title, Paragraph, Text } = Typography;
const { Search } = Input;

export default function UnsubscribePage() {
  const [loading, setLoading] = useState(false);
  const [unsubscribed, setUnsubscribed] = useState(false);

  const handleUnsubscribe = async (email: string) => {
    if (!email || !email.includes('@')) {
      message.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setUnsubscribed(true);
        message.success('Newsletter subscription has been stopped');
      } else if (res.status === 404) {
        message.warning('This email address is not registered');
      } else {
        message.error(data.error || 'Failed to stop subscription');
      }
    } catch (error) {
      message.error('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (unsubscribed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-2xl w-full">
          <Result
            status="success"
            icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            title="Unsubscription Completed"
            subTitle="Your newsletter subscription has been stopped. Thank you for using our service."
            extra={[
              <Link href="/" key="home">
                <Button type="primary" size="large">
                  Return to Home
                </Button>
              </Link>,
            ]}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full">
        <Card className="shadow-lg">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
              <MailOutlined className="text-3xl text-orange-600" />
            </div>
            <Title level={2} className="!mb-2">
              Newsletter Unsubscription
            </Title>
            <Paragraph type="secondary" className="text-base">
              To stop receiving newsletters, please enter your registered email address.
            </Paragraph>
          </div>

          <div className="max-w-md mx-auto">
            <Search
              placeholder="Please enter your email address"
              allowClear
              enterButton="Unsubscribe"
              size="large"
              onSearch={handleUnsubscribe}
              loading={loading}
              disabled={loading}
              className="mb-6"
            />

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <Text className="text-sm text-gray-700">
                <strong>Note:</strong> By unsubscribing, you will no longer receive newsletters, announcements, and seminar information from Jbbra.
              </Text>
            </div>

            <div className="text-center mt-6">
              <Link href="/" className="text-blue-600 hover:underline">
                Return to Home
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
