// FIX: 'use client' MUST be first, then exports
'use client'

// FIX: Tells Next.js to skip static generation for this page
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Popconfirm, Space, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SendOutlined } from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import type { Newsletter, NewsletterFormData, GetNewslettersResponse, ApiError } from '@/types';

const { TextArea } = Input;

export default function NewslettersPage() {
    const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingNewsletter, setEditingNewsletter]:any = useState<Newsletter | null>(null);
    const [form] = Form.useForm<NewsletterFormData>();
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/admin/login');
        } else if (status === 'authenticated') {
            fetchNewsletters();
        }
    }, [status, router]);

    const fetchNewsletters = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/newsletters');
            if (!res.ok) throw new Error('Failed to fetch newsletters');
            const data: GetNewslettersResponse = await res.json();
            setNewsletters(data.newsletters);
        } catch (error) {
            message.error('Failed to load newsletters');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingNewsletter(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (newsletter: Newsletter) => {
        setEditingNewsletter(newsletter);
        form.setFieldsValue({
            title: newsletter.title,
            slug: newsletter.slug,
            excerpt: newsletter.excerpt || '',
            body: newsletter.body,
        });
        setIsModalVisible(true);
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/newsletters/${id}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('Failed to delete newsletter');
            message.success('Newsletter deleted successfully');
            fetchNewsletters();
        } catch (error) {
            message.error('Failed to delete newsletter');
        }
    };

    const handleSubmit = async (values: NewsletterFormData) => {
        setLoading(true);
        try {
            const url = editingNewsletter
                ? `/api/admin/newsletters/${editingNewsletter.id}`
                : '/api/admin/newsletters';
            const method = editingNewsletter ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });

            if (!res.ok) {
                const error: ApiError = await res.json();
                throw new Error(error.error);
            }

            if (!editingNewsletter) {
                message.success('Newsletter created and sent to subscribers!');
            } else {
                message.success('Newsletter updated successfully');
            }

            setIsModalVisible(false);
            form.resetFields();
            fetchNewsletters();

        } catch (error: any) {
            message.error(error.message || 'Failed to save newsletter');
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async (id: NewsletterFormData) => {

        setLoading(true);
        try {
            const url = `/api/admin/newsletters/${id}/send`

            console.log(id, "handleSend", url);

            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: id }),
            });

            if (!res.ok) {
                const error: ApiError = await res.json();
                throw new Error(error.error);
            }

            // if (!editingNewsletter) {
            //     message.success('Newsletter didnt sended to subscribers!');
            // } else {
            //     message.success('Newsletter sended to subscribers!');
            // }

            alert('Newsletter sended to subscribers!');

        } catch (error: any) {
            message.error(error.message || 'Failed to save newsletter');
        } finally {
            setLoading(false);
        }
    }

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
            render: (_: any, record: any) => (
                <Space>
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    >
                        Edit
                    </Button>
                     <Popconfirm
                        title="Are you sure you want to send this newsletter?"
                        onConfirm={() =>handleSend(record.id) }
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="link"  icon={<SendOutlined />}>
                            Send
                        </Button>
                    </Popconfirm>
                    <Popconfirm
                        title="Are you sure you want to delete this newsletter?"
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
                <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Newsletters</h1>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                    Create Newsletter
                </Button>
            </div>

            <Table
                dataSource={newsletters}
                columns={columns}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
            />

            <Modal
                title={editingNewsletter ? 'Edit Newsletter' : 'Create Newsletter'}
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
                        <Input placeholder="Newsletter title" />
                    </Form.Item>

                    <Form.Item
                        label="Slug (URL-friendly)"
                        name="slug"
                        rules={[
                            { required: true, message: 'Please input slug!' },
                            { pattern: /^[a-z0-9-]+$/, message: 'Only lowercase letters, numbers, and hyphens allowed' }
                        ]}
                    >
                        <Input placeholder="my-newsletter-2025" disabled={!!editingNewsletter} />
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
                        <TextArea rows={10} placeholder="Newsletter content..." />
                    </Form.Item>

                    {!editingNewsletter && (
                        <div className="mb-4 p-3 bg-blue-50 rounded border border-blue-200">
                            <Space direction="vertical" size="small">
                                <div className="flex items-center gap-2">
                                    <SendOutlined className="text-blue-600" />
                                    <strong>Email Notification</strong>
                                </div>
                                <div className="text-sm text-gray-600">
                                    This newsletter will be automatically sent to all subscribers when created.
                                </div>
                            </Space>
                        </div>
                    )}

                    <Form.Item>
                        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                            <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
                            <Button type="primary" htmlType="submit" loading={loading} icon={!editingNewsletter ? <SendOutlined /> : undefined}>
                                {editingNewsletter ? 'Update' : 'Create'}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}