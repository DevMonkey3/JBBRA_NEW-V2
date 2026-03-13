'use client';

import { Form, Input, Button, message } from 'antd';
import { useState } from 'react';

interface ProfileFormProps {
  adminId: string;
  defaultName: string;
}

export default function ProfileForm({ adminId, defaultName }: ProfileFormProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminId,
          name: values.name,
          password: values.password || undefined,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      message.success('Profile updated successfully');
      form.resetFields(['password']);
    } catch (error: any) {
      message.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{ name: defaultName }}
    >
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: 'Please enter your name' }]}
      >
        <Input placeholder="Admin name" />
      </Form.Item>

      <Form.Item
        label="New Password (optional)"
        name="password"
        rules={[
          { min: 8, message: 'Password must be at least 8 characters' },
        ]}
      >
        <Input.Password placeholder="Leave blank to keep current password" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Update Profile
        </Button>
      </Form.Item>
    </Form>
  );
}
