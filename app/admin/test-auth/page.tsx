/**
 * FIX: Added dynamic export to prevent SSR pre-rendering errors
 * WHY: This page uses useSession() which can't be pre-rendered during build
 * CHANGE: 'use client' must be FIRST, then exports
 */
'use client'

// FIX: Tells Next.js to skip static generation for this page
export const dynamic = 'force-dynamic';

import { useSession } from 'next-auth/react';
import { Button, Card, Descriptions } from 'antd';
import { useRouter } from 'next/navigation';

export default function TestAuthPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <Card title="Authentication Debug Info">
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Session Status">
              {status}
            </Descriptions.Item>
            <Descriptions.Item label="Session Data">
              <pre className="text-xs overflow-auto">
                {JSON.stringify(session, null, 2)}
              </pre>
            </Descriptions.Item>
            <Descriptions.Item label="User Email">
              {session?.user?.email || 'Not logged in'}
            </Descriptions.Item>
            <Descriptions.Item label="User Name">
              {session?.user?.name || 'Not logged in'}
            </Descriptions.Item>
          </Descriptions>

          <div className="mt-4 space-x-2">
            <Button onClick={() => router.push('/admin/login')}>
              Go to Login
            </Button>
            <Button type="primary" onClick={() => router.push('/admin')}>
              Go to Dashboard
            </Button>
            <Button onClick={() => window.location.reload()}>
              Reload Page
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
