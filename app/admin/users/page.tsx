// FIX: 'use client' MUST be first, then exports
'use client'

// FIX: Tells Next.js to skip static generation for this page
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Popconfirm, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import type {
    AdminUserSafe,
    CreateAdminUserFormData,
    EditAdminUserFormData,
    GetAdminUsersResponse,
    CreateAdminUserResponse,
    UpdateAdminUserResponse,
    ApiError
} from '@/types';

export default function UsersManagement() {
    const [users, setUsers] = useState<AdminUserSafe[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState<AdminUserSafe | null>(null);
    const [form] = Form.useForm<CreateAdminUserFormData | EditAdminUserFormData>();
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/admin/login');
        } else if (status === 'authenticated') {
            fetchUsers();
        }
    }, [status, router]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/users');
            if (!res.ok) throw new Error('Failed to fetch users');
            const data: GetAdminUsersResponse = await res.json();
            setUsers(data.users);
        } catch (error) {
            message.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingUser(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (user: AdminUserSafe) => {
        setEditingUser(user);
        form.setFieldsValue({
            email: user.email,
            name: user.name || '',
        });
        setIsModalVisible(true);
    };

    const handleDelete = async (userId: string) => {
        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('Failed to delete user');
            message.success('User deleted successfully');
            fetchUsers();
        } catch (error) {
            message.error('Failed to delete user');
        }
    };

    const handleSubmit = async (values: CreateAdminUserFormData | EditAdminUserFormData) => {
        setLoading(true);
        try {
            const url = editingUser
                ? `/api/admin/users/${editingUser.id}`
                : '/api/admin/users';
            const method = editingUser ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });

            if (!res.ok) {
                const error: ApiError = await res.json();
                throw new Error(error.error);
            }

            message.success(`User ${editingUser ? 'updated' : 'created'} successfully`);
            setIsModalVisible(false);
            form.resetFields();
            fetchUsers();
        } catch (error: any) {
            message.error(error.message || 'Failed to save user');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (name: string | null) => name || '-',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: AdminUserSafe) => (
                <Space>
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Are you sure you want to delete this user?"
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
                <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Admin Users Management</h1>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                    Add User
                </Button>
            </div>

            <Table
                dataSource={users}
                columns={columns}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
            />

            <Modal
                title={editingUser ? 'Edit Admin User' : 'Add Admin User'}
                open={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false);
                    form.resetFields();
                }}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Please input email!' },
                            { type: 'email', message: 'Please enter a valid email!' },
                        ]}
                    >
                        <Input placeholder="admin@example.com" disabled={!!editingUser} />
                    </Form.Item>

                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please input name!' }]}
                    >
                        <Input placeholder="Admin Name" />
                    </Form.Item>

                    {!editingUser && (
                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                { required: true, message: 'Please input password!' },
                                { min: 8, message: 'Password must be at least 8 characters!' },
                            ]}
                        >
                            <Input.Password placeholder="Minimum 8 characters" />
                        </Form.Item>
                    )}

                    {editingUser && (
                        <Form.Item
                            label="New Password (optional)"
                            name="password"
                            help="Leave empty to keep current password"
                        >
                            <Input.Password placeholder="Minimum 8 characters" />
                        </Form.Item>
                    )}

                    <Form.Item>
                        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                            <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                {editingUser ? 'Update' : 'Create'}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
