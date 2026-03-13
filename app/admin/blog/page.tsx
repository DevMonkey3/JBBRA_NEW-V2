// FIX: 'use client' MUST be first, then exports
'use client'

// FIX: Tells Next.js to skip static generation for this page
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Popconfirm, Space, Tag, Upload } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined, EyeOutlined } from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import type { UploadFile, UploadProps } from 'antd';

const { TextArea } = Input;

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  coverImage: string | null;
  excerpt: string | null;
  publishedAt: Date;
  likeCount: number;
}

interface BlogPostFormData {
  title: string;
  slug: string;
  content: string;
  coverImage?: string;
  excerpt: string;
}

interface GetBlogPostsResponse {
  posts: BlogPost[];
}

interface ApiError {
  error: string;
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [form] = Form.useForm<BlogPostFormData>();
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (status === 'authenticated') {
      fetchPosts();
    }
  }, [status, router]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/blog');
      if (!res.ok) throw new Error('Failed to fetch posts');
      const data: GetBlogPostsResponse = await res.json();
      setPosts(data.posts);
    } catch (error) {
      message.error('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingPost(null);
    setImageUrl('');
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setImageUrl(post.coverImage || '');
    form.setFieldsValue({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      content: post.content,
      coverImage: post.coverImage || '',
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/blog/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete post');
      message.success('Blog post deleted successfully');
      fetchPosts();
    } catch (error) {
      message.error('Failed to delete blog post');
    }
  };

  const handleUpload: UploadProps['customRequest'] = async ({ file, onSuccess, onError }) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Upload failed');
      }

      const data = await res.json();
      setImageUrl(data.url);
      form.setFieldValue('coverImage', data.url);
      message.success('Image uploaded successfully');

      // Pass only the URL string to avoid circular reference warnings
      if (onSuccess) {
        onSuccess(data.url);
      }
    } catch (error: any) {
      message.error(error.message || 'Failed to upload image');
      if (onError) {
        onError(new Error(error.message || 'Upload failed'));
      }
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (values: BlogPostFormData) => {
    setLoading(true);
    try {
      const url = editingPost
        ? `/api/admin/blog/${editingPost.id}`
        : '/api/admin/blog';
      const method = editingPost ? 'PUT' : 'POST';

      const payload = {
        ...values,
        coverImage: imageUrl || undefined,
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error: ApiError = await res.json();
        throw new Error(error.error);
      }

      message.success(editingPost ? 'Post updated successfully' : 'Post created successfully!');
      setIsModalVisible(false);
      form.resetFields();
      setImageUrl('');
      fetchPosts();
    } catch (error: any) {
      message.error(error.message || 'Failed to save post');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    if (!editingPost) {
      const slug = generateSlug(title);
      form.setFieldValue('slug', slug);
    }
  };

  const columns = [
    {
      title: 'Cover',
      dataIndex: 'coverImage',
      key: 'coverImage',
      width: 100,
      render: (coverImage: string | null) => (
        coverImage ? (
          <img
            src={coverImage}
            alt="Cover"
            width={80}
            height={50}
            className="object-cover rounded"
            loading="lazy"
          />
        ) : (
          <div className="w-20 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
            No image
          </div>
        )
      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
      render: (slug: string) => <Tag color="blue">{slug}</Tag>,
    },
    {
      title: 'Likes',
      dataIndex: 'likeCount',
      key: 'likeCount',
      width: 80,
      render: (count: number) => <Tag color="red">❤️ {count}</Tag>,
    },
    {
      title: 'Published',
      dataIndex: 'publishedAt',
      key: 'publishedAt',
      width: 120,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 180,
      render: (_: any, record: BlogPost) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            href={`/blog/${record.slug}`}
            target="_blank"
          >
            View
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this post?"
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
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Blog Posts</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Create Post
        </Button>
      </div>

      <Table
        dataSource={posts}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingPost ? 'Edit Blog Post' : 'Create Blog Post'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setImageUrl('');
        }}
        footer={null}
        width={900}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: 'Please input title!' }]}
          >
            <Input placeholder="Blog post title" onChange={handleTitleChange} />
          </Form.Item>

          <Form.Item
            label="Slug (URL-friendly)"
            name="slug"
            rules={[
              { required: true, message: 'Please input slug!' },
              { pattern: /^[a-z0-9-]+$/, message: 'Only lowercase letters, numbers, and hyphens allowed' }
            ]}
          >
            <Input placeholder="my-blog-post-2025" disabled={!!editingPost} />
          </Form.Item>

          <Form.Item label="Cover Image" name="coverImage">
            <div>
              <Upload
                customRequest={handleUpload}
                showUploadList={false}
                accept="image/*"
                disabled={uploading}
              >
                <Button icon={<UploadOutlined />} loading={uploading}>
                  {uploading ? 'Uploading...' : 'Upload Image'}
                </Button>
              </Upload>
              {imageUrl && (
                <div className="mt-3">
                  <img
                    src={imageUrl}
                    alt="Cover preview"
                    width={300}
                    height={200}
                    className="object-cover rounded"
                    loading="lazy"
                  />
                </div>
              )}
            </div>
          </Form.Item>

          <Form.Item
            label="Excerpt (Short summary)"
            name="excerpt"
          >
            <TextArea rows={2} placeholder="Brief summary for preview cards..." />
          </Form.Item>

          <Form.Item
            label="Content (HTML/Markdown supported)"
            name="content"
            rules={[{ required: true, message: 'Please input content!' }]}
          >
            <TextArea rows={12} placeholder="Blog post content..." />
          </Form.Item>

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingPost ? 'Update' : 'Create'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
