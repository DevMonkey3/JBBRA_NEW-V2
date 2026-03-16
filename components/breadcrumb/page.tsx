// components/breadcrumb/page.tsx
'use client'

import { Breadcrumb } from 'antd';
import type { BreadcrumbProps } from 'antd';

interface BreadcrumbsProps {
  breadcrumb: BreadcrumbProps['items'];
  pageTitle: string;
  breadcrumbTitle: React.ReactNode;
}

// Removed: useState + useEffect that copied props.breadcrumb into local state.
// That pattern added an extra render cycle on every prop change with zero benefit —
// props can be used directly. Also removed unused imports: title, useState, useEffect.
export default function Breadcrumbs({ breadcrumb, pageTitle, breadcrumbTitle }: BreadcrumbsProps) {
  return (
    <div className="w-full max-w-full px-4 sm:px-6 md:px-8 py-4 md:py-6">
      <div className="flex flex-col items-start text-left">
        <span
          style={{ borderRadius: "10px 0 10px 0" }}
          className="text-xs sm:text-sm font-bold bg-[#019cd4] text-white px-2 py-1 whitespace-nowrap"
        >
          {pageTitle}
        </span>
        <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold mt-2 sm:mt-4 leading-tight">
          {breadcrumbTitle}
        </h1>
        <div className="mt-2 sm:mt-3 w-full">
          <Breadcrumb items={breadcrumb} className="text-xs sm:text-sm" />
        </div>
      </div>
    </div>
  );
}
