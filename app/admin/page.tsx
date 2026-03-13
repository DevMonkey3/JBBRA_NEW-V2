import { Card, Row, Col, Statistic, Table } from 'antd';
import {
    UserOutlined,
    MailOutlined,
    BookOutlined,
    CalendarOutlined,
    TeamOutlined,
    FileTextOutlined,
    BellOutlined
} from '@ant-design/icons';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import SubscribersTable from '@/components/admin/SubscribersTable';

// Cache dashboard data for 60 seconds
const getDashboardData = cache(async () => {
    const [
        totalAdmins,
        totalSubscriptions,
        activeSubscriptions,
        totalNewsletters,
        totalBlogPosts,
        totalSeminars,
        upcomingSeminars,
        totalRegistrations,
        recentRegistrations,
        totalNotifications,
        recentSubscribers
    ] = await Promise.all([
        prisma.adminUser.count(),
        prisma.subscription.count(),
        prisma.subscription.count({ where: { unsubscribedAt: null } }),
        prisma.newsletter.count(),
        prisma.blogPost.count(),
        prisma.seminar.count(),
        prisma.seminar.count({ where: { startsAt: { gte: new Date() } } }),
        prisma.seminarRegistration.count(),
        prisma.seminarRegistration.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { seminar: { select: { title: true } } }
        }),
        prisma.notification.count(),
        prisma.subscription.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            where: { unsubscribedAt: null }
        })
    ]);

    return {
        totalAdmins,
        totalSubscriptions,
        activeSubscriptions,
        totalNewsletters,
        totalBlogPosts,
        totalSeminars,
        upcomingSeminars,
        totalRegistrations,
        recentRegistrations,
        totalNotifications,
        recentSubscribers
    };
});

export const revalidate = 60; // Revalidate every 60 seconds

export default async function AdminDashboard() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        redirect('/admin/login');
    }

    // Fetch all statistics with caching
    const {
        totalAdmins,
        totalSubscriptions,
        activeSubscriptions,
        totalNewsletters,
        totalBlogPosts,
        totalSeminars,
        upcomingSeminars,
        totalRegistrations,
        recentRegistrations,
        totalNotifications,
        recentSubscribers
    } = await getDashboardData();

    // FIX: Convert dates to strings on server side to avoid passing functions to client
    // WHY: Server components can't pass render functions to client components (Ant Design Table)
    const formattedRegistrations = recentRegistrations.map(reg => ({
        ...reg,
        createdAt: new Date(reg.createdAt).toLocaleDateString()
    }));

    const formattedSubscribers = recentSubscribers.map(sub => ({
        ...sub,
        createdAt: new Date(sub.createdAt).toLocaleDateString()
    }));

    const registrationColumns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Seminar', dataIndex: ['seminar', 'title'], key: 'seminar' },
        { title: 'Date', dataIndex: 'createdAt', key: 'createdAt' }, // No render function needed now
    ];

    const subscriberColumns = [
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Subscribed', dataIndex: 'createdAt', key: 'createdAt' }, // No render function needed now
    ];

    return (
        <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>
                Dashboard
            </h1>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px' }}>
                Welcome back, {session.user?.name || session.user?.email}!
            </p>

            {/* Statistics Cards */}
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Admins"
                            value={totalAdmins}
                            prefix={<UserOutlined />}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Active Subscribers"
                            value={activeSubscriptions}
                            prefix={<MailOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                            suffix={`/ ${totalSubscriptions}`}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Blog Posts"
                            value={totalBlogPosts}
                            prefix={<BookOutlined />}
                            valueStyle={{ color: '#cf1322' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Newsletters"
                            value={totalNewsletters}
                            prefix={<FileTextOutlined />}
                            valueStyle={{ color: '#722ed1' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Seminars"
                            value={totalSeminars}
                            prefix={<CalendarOutlined />}
                            valueStyle={{ color: '#fa8c16' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Upcoming Seminars"
                            value={upcomingSeminars}
                            prefix={<CalendarOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Registrations"
                            value={totalRegistrations}
                            prefix={<TeamOutlined />}
                            valueStyle={{ color: '#13c2c2' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Notifications Sent"
                            value={totalNotifications}
                            prefix={<BellOutlined />}
                            valueStyle={{ color: '#eb2f96' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Recent Activity Tables */}
            <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
                <Col xs={24} lg={12}>
                    <Card title="Recent Seminar Registrations" bordered>
                        <Table
                            dataSource={formattedRegistrations}
                            columns={registrationColumns}
                            rowKey="id"
                            pagination={false}
                            size="small"
                        />
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card title="Recent Subscribers (Last 5)" bordered>
                        <Table
                            dataSource={formattedSubscribers}
                            columns={subscriberColumns}
                            rowKey="id"
                            pagination={false}
                            size="small"
                        />
                    </Card>
                </Col>
            </Row>

            {/* Full Subscribers Management Section */}
            <Row style={{ marginTop: '24px' }}>
                <Col xs={24}>
                    <SubscribersTable />
                </Col>
            </Row>
        </div>
    );
}