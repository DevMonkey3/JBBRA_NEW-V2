// FIX: 'use client' MUST be first, then exports
'use client'

// FIX: Tells Next.js to skip static generation for this layout
export const dynamic = 'force-dynamic';

import { usePathname } from 'next/navigation';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    LogoutOutlined,
} from '@ant-design/icons';
import { Button, Layout, theme } from 'antd';
import AdminMenu from '@/components/admin/AdminMenu/adminMenu'
import { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { Header, Sider, Content } = Layout;
    const [collapsed, setCollapsed] = useState(false);
    const { data: session } = useSession();

    // Don't show admin layout on login page
    const isLoginPage = pathname === '/admin/login' || pathname === '/admin/test-auth';

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    // If it's the login page, render without the admin layout
    if (isLoginPage) {
        return <>{children}</>;
    }

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="demo-logo-vertical" style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)', borderRadius: 6 }} />
                <AdminMenu collapsed={collapsed} />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />
                    <div style={{ marginRight: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                        {session?.user?.email && (
                            <span style={{ fontSize: 14, color: '#666' }}>
                                {session.user.email}
                            </span>
                        )}
                        <Button
                            danger
                            icon={<LogoutOutlined />}
                            onClick={() => signOut({ callbackUrl: '/admin/login' })}
                        >
                            Logout
                        </Button>
                    </div>
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
}
