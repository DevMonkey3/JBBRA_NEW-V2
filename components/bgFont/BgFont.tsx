// app/jbbc/implementation-results/page.tsx
'use client'

import { title } from "@/components/primitives";
import { Breadcrumb } from 'antd';
import { useState, useEffect } from "react";

export default function BgFont(props: any) {
    return (
        <div className="container mx-auto text-center relative">
            {/* 背景大字：在移动端缩小 */}
            <div className="
                text-[80px] xs:text-[100px] sm:text-[140px] md:text-[200px] 
                font-bold text-[#f3f3f3] 
                leading-none
            ">
                {props.textBg}
            </div>

            {/* 前景标题：居中叠加，移动端缩小 */}
            <div className="
                text-[24px] xs:text-[32px] sm:text-[40px] md:text-[60px] 
                text-[#4E4E4E] font-bold 
                absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                leading-tight px-2 w-full text-center
            ">
                {props.title}
            </div>
        </div>
    );
}