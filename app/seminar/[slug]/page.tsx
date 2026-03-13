'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Select, Button, Checkbox, Typography, Row, Col, Divider, Spin, Modal, message } from 'antd';
import { CalendarOutlined, EnvironmentOutlined, UserOutlined, RightOutlined } from '@ant-design/icons';
import Breadcrumb from '@/components/breadcrumb';

const { Title, Text } = Typography;
const { TextArea } = Input;

const PREFECTURES = [
  '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
  '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
  '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
  '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
  '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
  '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
  '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
];

interface Seminar {
  id: string;
  title: string;
  description: string;
  location: string;
  startsAt: string;
  endsAt: string;
  excerpt?: string;
  heroImage?: string;
  speakerName?: string;
  speakerTitle?: string;
  speakerOrg?: string;
}

interface SeminarPageProps {
  params: Promise<{ slug: string }>;
}

export default function SeminarDetailPage({ params }: SeminarPageProps) {
  const { slug } = use(params);
  const router = useRouter();
  const [seminar, setSeminar] = useState<Seminar | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchSeminar = async () => {
      try {
        const res = await fetch(`/api/seminars/${slug}`);
        if (!res.ok) {
          throw new Error('Seminar not found');
        }
        const data = await res.json();
        setSeminar(data.seminar);
      } catch (error) {
        console.error('Error fetching seminar:', error);
        message.error('セミナー情報の取得に失敗しました');
        router.push('/seminar');
      } finally {
        setLoading(false);
      }
    };

    fetchSeminar();
  }, [slug, router]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSubmit = async (values: any) => {
    if (!seminar) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/seminar/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          seminarId: seminar.id,
          seminarTitle: seminar.title,
          name: values.name,
          companyName: values.companyName,
          phone: values.phone,
          prefecture: values.prefecture,
          email: values.email,
          consentPI: values.consentPI,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || '送信に失敗しました');
      }

      setSuccessModalVisible(true);
      form.resetFields();
    } catch (error: any) {
      console.error('Error submitting form:', error);
      message.error(error.message || '送信に失敗しました。もう一度お試しください。');
    } finally {
      setSubmitting(false);
    }
  };

  const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
    <span className="flex items-center">
      {children}
      <span className="bg-red-600 text-white px-2 py-0.5 ml-2 rounded text-xs">必須</span>
    </span>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!seminar) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Breadcrumb
            items={[
              { title: 'ホーム', href: '/' },
              { title: 'セミナー', href: '/seminar' },
              { title: seminar.title },
            ]}
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Title level={1} className="mb-4">{seminar.title}</Title>

          {seminar.excerpt && (
            <p className="text-lg text-gray-600 mb-6">{seminar.excerpt}</p>
          )}

          {/* Meta Information */}
          <Row gutter={[16, 16]} className="text-gray-600">
            <Col>
              <CalendarOutlined className="mr-2" />
              <Text strong>開催日時:</Text> {formatDate(seminar.startsAt)} {formatTime(seminar.startsAt)} - {formatTime(seminar.endsAt)}
            </Col>
            <Col>
              <EnvironmentOutlined className="mr-2" />
              <Text strong>開催場所:</Text> {seminar.location}
            </Col>
            {(seminar.speakerName || seminar.speakerTitle || seminar.speakerOrg) && (
              <Col>
                <UserOutlined className="mr-2" />
                <Text strong>講師:</Text> {seminar.speakerName} {seminar.speakerTitle} {seminar.speakerOrg}
              </Col>
            )}
          </Row>
        </div>

        {/* Hero Image */}
        {seminar.heroImage && (
          <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
            <img
              src={seminar.heroImage}
              alt={seminar.title}
              className="w-full h-auto max-h-[500px] object-cover"
              loading="lazy"
            />
          </div>
        )}

        <Row gutter={[32, 32]}>
          {/* Left Column - Description & Registration Form */}
          <Col xs={24} lg={14}>
            {/* Description */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <Title level={3} className="mb-4 border-b pb-2">セミナー概要</Title>
              <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                {seminar.description}
              </div>
            </div>

            {/* Registration Form */}
            <div id="registration-form" className="bg-blue-50 p-6 rounded-2xl">
              <Title level={2} className="!text-xl !mb-6 text-center">
                お申し込みフォーム
              </Title>

              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                scrollToFirstError
              >
                <Form.Item
                  label={<RequiredLabel>お名前</RequiredLabel>}
                  name="name"
                  rules={[
                    { required: true, message: 'お名前を入力してください' },
                    { min: 2, message: 'お名前は 2 文字以上で入力してください' },
                  ]}
                >
                  <Input placeholder="山田 太郎" size="large" />
                </Form.Item>

                <Form.Item
                  label={<span>会社名</span>}
                  name="companyName"
                >
                  <Input placeholder="株式会社〇〇" size="large" />
                </Form.Item>

                <Form.Item
                  label={<RequiredLabel>電話番号</RequiredLabel>}
                  name="phone"
                  rules={[
                    { required: true, message: '電話番号を入力してください' },
                    { pattern: /^[\d-]+$/, message: '有効な電話番号を入力してください' },
                  ]}
                >
                  <Input placeholder="090-1234-5678" size="large" />
                </Form.Item>

                <Form.Item
                  label={<RequiredLabel>都道府県</RequiredLabel>}
                  name="prefecture"
                  rules={[{ required: true, message: '都道府県を選択してください' }]}
                >
                  <Select placeholder="選択してください" size="large">
                    {PREFECTURES.map((pref) => (
                      <Select.Option key={pref} value={pref}>
                        {pref}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label={<RequiredLabel>メールアドレス</RequiredLabel>}
                  name="email"
                  rules={[
                    { required: true, message: 'メールアドレスを入力してください' },
                    { type: 'email', message: '有効なメールアドレスを入力してください' },
                  ]}
                >
                  <Input placeholder="example@email.com" size="large" />
                </Form.Item>

                <Form.Item>
                  <div className="text-xs text-gray-600 mb-2">
                    個人情報の取り扱いについては
                    <a href="/legal/privacy" className="text-blue-600 underline ml-1">
                      こちら
                    </a>
                    をご覧ください
                  </div>
                </Form.Item>

                <Form.Item
                  name="consentPI"
                  valuePropName="checked"
                  rules={[
                    {
                      validator: (_, value) =>
                        value
                          ? Promise.resolve()
                          : Promise.reject(new Error('個人情報の取り扱いに同意してください')),
                    },
                  ]}
                >
                  <Checkbox>個人情報の取り扱いについて同意する</Checkbox>
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    block
                    loading={submitting}
                    className="!bg-[#FF6F00] hover:!bg-[#e56300] !border-none !font-semibold"
                    icon={<RightOutlined />}
                    iconPosition="end"
                  >
                    {submitting ? '送信中...' : '申し込む'}
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Col>

          {/* Right Column - Sidebar */}
          <Col xs={24} lg={10}>
            {/* Quick Info Card */}
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <Title level={4} className="mb-4">開催情報</Title>

              <Divider className="my-3" />

              <div className="space-y-4">
                <div>
                  <Text strong className="block mb-1">開催日時</Text>
                  <Text className="text-sm">
                    {formatDate(seminar.startsAt)} {formatTime(seminar.startsAt)} - {formatTime(seminar.endsAt)}
                  </Text>
                </div>

                <Divider className="my-2" />

                <div>
                  <Text strong className="block mb-1">開催場所</Text>
                  <Text className="text-sm">{seminar.location}</Text>
                </div>

                {(seminar.speakerName || seminar.speakerTitle || seminar.speakerOrg) && (
                  <>
                    <Divider className="my-2" />
                    <div>
                      <Text strong className="block mb-1">講師</Text>
                      <Text className="text-sm">
                        {seminar.speakerName}
                        {seminar.speakerTitle && ` (${seminar.speakerTitle})`}
                        {seminar.speakerOrg && ` / ${seminar.speakerOrg}`}
                      </Text>
                    </div>
                  </>
                )}
              </div>

              <Divider className="my-3" />

              <Button
                type="primary"
                size="large"
                block
                href="#registration-form"
                icon={<RightOutlined />}
              >
                今すぐ申し込む
              </Button>
            </div>
          </Col>
        </Row>
      </div>

      {/* Success Modal */}
      <Modal
        open={successModalVisible}
        onOk={() => {
          setSuccessModalVisible(false);
          router.push('/seminar');
        }}
        onCancel={() => {
          setSuccessModalVisible(false);
          router.push('/seminar');
        }}
        footer={[
          <Button
            key="ok"
            type="primary"
            onClick={() => {
              setSuccessModalVisible(false);
              router.push('/seminar');
            }}
            className="!bg-[#1AA4DD]"
          >
            セミナー一覧に戻る
          </Button>,
        ]}
        centered
      >
        <div className="text-center py-6">
          <div className="text-6xl mb-4 text-green-500">✓</div>
          <Title level={3} className="!text-green-600 !mb-4">
            お申し込みありがとうございます
          </Title>
          <Text className="text-base">
            セミナーへのお申し込みを受け付けました。
            <br />
            ご登録いただいたメールアドレスに確認メールをお送りします。
            <br />
            <br />
            当日お会いできることを楽しみにしております。
          </Text>
        </div>
      </Modal>
    </div>
  );
}
