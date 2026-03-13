'use client'

import { useState, useEffect } from 'react';
import { Table, Button, Popconfirm, message, Space, Tag, Input, Card } from 'antd';
import { DeleteOutlined, DownloadOutlined, SearchOutlined, MailOutlined } from '@ant-design/icons';

interface Subscriber {
  id: string;
  email: string;
  verifiedAt: Date | null;
  unsubscribedAt: Date | null;
  createdAt: Date;
}

interface SubscribersTableProps {
  showTitle?: boolean;
}

export default function SubscribersTable({ showTitle = true }: SubscribersTableProps) {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [filteredSubscribers, setFilteredSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [stats, setStats] = useState({ total: 0, active: 0, unsubscribed: 0 });

  useEffect(() => {
    fetchSubscribers();
  }, []);

  useEffect(() => {
    // Filter subscribers based on search text
    if (searchText) {
      const filtered = subscribers.filter(sub =>
        sub.email.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredSubscribers(filtered);
    } else {
      setFilteredSubscribers(subscribers);
    }
  }, [searchText, subscribers]);

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/subscribers');
      if (!res.ok) throw new Error('Failed to fetch subscribers');
      const data = await res.json();
      setSubscribers(data.subscribers);
      setFilteredSubscribers(data.subscribers);
      setStats({
        total: data.total,
        active: data.active,
        unsubscribed: data.unsubscribed
      });
    } catch (error) {
      message.error('Failed to load subscribers');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/subscribers?id=${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete subscriber');
      message.success('Subscriber deleted successfully');
      fetchSubscribers();
    } catch (error) {
      message.error('Failed to delete subscriber');
      console.error(error);
    }
  };

  const handleExportCSV = () => {
    const csvContent = [
      ['Email', 'Status', 'Subscribed Date', 'Unsubscribed Date'],
      ...filteredSubscribers.map(sub => [
        sub.email,
        sub.unsubscribedAt ? 'Unsubscribed' : 'Active',
        new Date(sub.createdAt).toLocaleDateString(),
        sub.unsubscribedAt ? new Date(sub.unsubscribedAt).toLocaleDateString() : 'N/A'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success('Subscribers exported to CSV');
  };

  const columns = [
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a: Subscriber, b: Subscriber) => a.email.localeCompare(b.email),
      render: (email: string) => (
        <Space>
          <MailOutlined style={{ color: '#1890ff' }} />
          <span>{email}</span>
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'unsubscribedAt',
      key: 'status',
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Unsubscribed', value: 'unsubscribed' },
      ],
      onFilter: (value: any, record: Subscriber) => {
        if (value === 'active') return !record.unsubscribedAt;
        return !!record.unsubscribedAt;
      },
      render: (unsubscribedAt: Date | null) => (
        unsubscribedAt ? (
          <Tag color="red">Unsubscribed</Tag>
        ) : (
          <Tag color="green">Active</Tag>
        )
      ),
    },
    {
      title: 'Subscribed Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a: Subscriber, b: Subscriber) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (date: Date) => new Date(date).toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }),
    },
    {
      title: 'Unsubscribed Date',
      dataIndex: 'unsubscribedAt',
      key: 'unsubscribedAt',
      render: (date: Date | null) => date ? new Date(date).toLocaleDateString('ja-JP') : '-',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Subscriber) => (
        <Popconfirm
          title="Are you sure you want to delete this subscriber?"
          onConfirm={() => handleDelete(record.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="link" danger icon={<DeleteOutlined />} size="small">
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <Card
      title={showTitle ? (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>All Subscribers ({stats.total})</span>
          <Space>
            <Tag color="green">Active: {stats.active}</Tag>
            <Tag color="red">Unsubscribed: {stats.unsubscribed}</Tag>
          </Space>
        </div>
      ) : undefined}
      bordered
      extra={
        <Space>
          <Input
            placeholder="Search by email"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
            allowClear
          />
          <Button
            icon={<DownloadOutlined />}
            onClick={handleExportCSV}
            disabled={filteredSubscribers.length === 0}
          >
            Export CSV
          </Button>
        </Space>
      }
    >
      <Table
        dataSource={filteredSubscribers}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} subscribers`,
        }}
        size="middle"
      />
    </Card>
  );
}
