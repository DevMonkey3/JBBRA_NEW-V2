// app/jbbc/implementation-results/page.tsx
'use client'

import { title } from "@/components/primitives";
import { Breadcrumb } from 'antd';
import { useState, useEffect } from "react";

export default function Breadcrumbs(props: any) {
    const [breadcrumb, setBreadcrumb] = useState<any[]>([]);
    
    useEffect(() => {
        setBreadcrumb(props.breadcrumb || []);
    }, [props.breadcrumb]);

    return (
        <div className="w-full max-w-full px-4 sm:px-6 md:px-8 py-4 md:py-6 ">
            {/* Section Title */}
            <div className="flex flex-col items-start text-left">
                <span 
                    style={{
                        borderRadius: "10px 0 10px 0",
                    }} 
                    className="text-xs sm:text-sm font-bold bg-[#019cd4] text-white px-2 py-1 whitespace-nowrap"
                >
                    {props.pageTitle}
                </span>
                <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold mt-2 sm:mt-4 leading-tight">
                    {props.breadcrumbTitle}
                </h1>
                <div className="mt-2 sm:mt-3 w-full">
                    <Breadcrumb
                        items={breadcrumb}
                        className="text-xs sm:text-sm"
                    />
                </div>
            </div>
        </div>
    );
}