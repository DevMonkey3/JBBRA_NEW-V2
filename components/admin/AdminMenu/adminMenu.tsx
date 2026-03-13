'use client'

import React, { useMemo } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import type { MenuProps } from 'antd'
import { Menu } from 'antd'
import {
  PieChartOutlined,
  UserOutlined,
  TeamOutlined,
  ContainerOutlined,
  MailOutlined,
  BookOutlined,
  CalendarOutlined,
  NotificationOutlined,
} from '@ant-design/icons'

type MenuItem = Required<MenuProps>['items'][number]

export default function AdminMenu({ collapsed = false }: { collapsed?: boolean }) {
  const router = useRouter()
  const pathname = usePathname()

  const items: MenuItem[] = [
    { key: '/admin',           icon: <PieChartOutlined />,  label: 'Dashboard' },
    { key: '/admin/users',     icon: <TeamOutlined />,   label: 'Users' },
    { key: '/admin/profile',   icon: <UserOutlined />,   label: 'Profile' },
    { key: '/admin/newsletters', icon: <MailOutlined />, label: 'Newsletters' },
    { key: '/admin/announcements', icon: <NotificationOutlined />, label: 'Announcements' },
    { key: '/admin/blog',      icon: <BookOutlined />, label: 'Blog' },
    { key: '/admin/seminar',   icon: <CalendarOutlined />,      label: 'Seminars' },
  ]

  const selected = useMemo(() => {
    // Exact match for dashboard
    if (pathname === '/admin') {
      return ['/admin']
    }

    // Find the longest matching path (most specific route)
    const matches = items
      .filter((i): i is NonNullable<MenuItem> => typeof i?.key === 'string' && i.key !== '/admin' && pathname.startsWith(i.key as string))
      .sort((a, b) => (b?.key as string).length - (a?.key as string).length)

    return matches.length > 0 && matches[0]?.key ? [matches[0].key as string] : ['/admin']
  }, [pathname, items])

  const onSelect: MenuProps['onSelect'] = (e) => {
    router.push(e.key) // e.key is our path
  }

  return (
    <>
      <style jsx global>{`
        /* Admin menu hover effect */
        .ant-menu-dark .ant-menu-item:hover,
        .ant-menu-dark .ant-menu-item-active {
          background-color: #1890ff !important;
        }

        /* Selected menu item */
        .ant-menu-dark .ant-menu-item-selected {
          background-color: #1890ff !important;
        }

        /* Smooth transition */
        .ant-menu-dark .ant-menu-item {
          transition: background-color 0.3s ease;
        }

        /* Icon color on hover and selected */
        .ant-menu-dark .ant-menu-item:hover .anticon,
        .ant-menu-dark .ant-menu-item-selected .anticon {
          color: #ffffff !important;
        }
      `}</style>
      <Menu
        mode="inline"
        theme="dark"
        inlineCollapsed={collapsed}
        items={items}
        selectedKeys={selected}
        onSelect={onSelect}
      />
    </>
  )
}
