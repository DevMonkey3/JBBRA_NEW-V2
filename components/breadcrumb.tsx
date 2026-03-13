// Breadcrumb Component
import Link from 'next/link';
import { RightOutlined } from '@ant-design/icons';

interface BreadcrumbItem {
  title: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center text-sm">
      {items.map((item, index) => (
        <div key={item.href || item.title} className="flex items-center">
          {index > 0 && (
            <RightOutlined className="mx-2 text-gray-400 text-xs" />
          )}
          {item.href && index < items.length - 1 ? (
            <Link
              href={item.href}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              {item.title}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">{item.title}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
