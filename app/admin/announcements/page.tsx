// FIX: 'use client' MUST be first, then exports
'use client'

// FIX: Tells Next.js to skip static generation for this page
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Popconfirm, Space, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SendOutlined } from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const { TextArea } = Input;

interface Announcement {
  id: string;
  title: string;
  body: string;
  excerpt: string | null;
  slug: string;
  publishedAt: Date;
}

interface AnnouncementFormData {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
}

interface GetAnnouncementsResponse {
  announcements: Announcement[];
}

interface ApiError {
  error: string;
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [form] = Form.useForm<AnnouncementFormData>();
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (status === 'authenticated') {
      fetchAnnouncements();
    }
  }, [status, router]);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/announcements');
      if (!res.ok) throw new Error('Failed to fetch announcements');
      const data: GetAnnouncementsResponse = await res.json();
      setAnnouncements(data.announcements);
    } catch (error) {
      message.error('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingAnnouncement(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    form.setFieldsValue({
      title: announcement.title,
      slug: announcement.slug,
      excerpt: announcement.excerpt || '',
      body: announcement.body,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/announcements/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete announcement');
      message.success('Announcement deleted successfully');
      fetchAnnouncements();
    } catch (error) {
      message.error('Failed to delete announcement');
    }
  };

  const handleSubmit = async (values: AnnouncementFormData) => {
    setLoading(true);
    try {
      const url = editingAnnouncement
        ? `/api/admin/announcements/${editingAnnouncement.id}`
        : '/api/admin/announcements';
      const method = editingAnnouncement ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const error: ApiError = await res.json();
        throw new Error(error.error);
      }

      if (!editingAnnouncement) {
        message.success('Announcement created and sent to subscribers!');
      } else {
        message.success('Announcement updated successfully');
      }

      setIsModalVisible(false);
      form.resetFields();
      fetchAnnouncements();
    } catch (error: any) {
      message.error(error.message || 'Failed to save announcement');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
      render: (slug: string) => <Tag>{slug}</Tag>,
    },
    {
      title: 'Published',
      dataIndex: 'publishedAt',
      key: 'publishedAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Announcement) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this announcement?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (status === 'loading') {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Announcements</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Create Announcement
        </Button>
      </div>

      <Table
        dataSource={announcements}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingAnnouncement ? 'Edit Announcement' : 'Create Announcement'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: 'Please input title!' }]}
          >
            <Input placeholder="Announcement title" />
          </Form.Item>

          <Form.Item
            label="Slug (URL-friendly)"
            name="slug"
            rules={[
              { required: true, message: 'Please input slug!' },
              { pattern: /^[a-z0-9-]+$/, message: 'Only lowercase letters, numbers, and hyphens allowed' }
            ]}
          >
            <Input placeholder="my-announcement-2025" disabled={!!editingAnnouncement} />
          </Form.Item>

          <Form.Item
            label="Excerpt (Short summary)"
            name="excerpt"
          >
            <TextArea rows={2} placeholder="Brief summary..." />
          </Form.Item>

          <Form.Item
            label="Body (HTML/Markdown supported)"
            name="body"
            rules={[{ required: true, message: 'Please input body!' }]}
          >
            <TextArea rows={10} placeholder="Announcement content..." />
          </Form.Item>

          {!editingAnnouncement && (
            <div className="mb-4 p-3 bg-orange-50 rounded border border-orange-200">
              <Space direction="vertical" size="small">
                <div className="flex items-center gap-2">
                  <SendOutlined className="text-orange-600" />
                  <strong>Email Notification</strong>
                </div>
                <div className="text-sm text-gray-600">
                  This announcement will be automatically sent to all subscribers when created.
                </div>
              </Space>
            </div>
          )}

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={loading} icon={!editingAnnouncement ? <SendOutlined /> : undefined}>
                {editingAnnouncement ? 'Update' : 'Create & Send'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
