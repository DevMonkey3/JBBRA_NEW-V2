// Content9.tsx
"use client";

import { Typography, Row, Col, Button, Card } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons"; // 引入图标
import React, { useState } from "react";
import { getCdnUrl } from "@/config/cdn";

const Content9: React.FC = () => {
  const { Text, Title } = Typography;

  const [industries] = useState([
    {
      title: 'Construction Industry',
      description: 'You can quickly and easily hire foreign workers who are immediately productive on construction sites at approximately half the market price.',
      image: getCdnUrl('/home/industries.avif'),
    },
    {
      title: 'Nagano Consultation Room',
      description: 'Free inheritance consultations are available from your home. Please feel free to use our services.',
      image: getCdnUrl('/Driver/happy-professional-truck-driver-driving-his-truck-2025-03-17-11-28-31-utc.avif'),
    },
    {
      title: 'Nagano Consultation Room',
      description: 'Free inheritance consultations are available from your home. Please feel free to use our services.',
      image: getCdnUrl('/HR Admin/business-gets-done-in-the-boardroom-2025-04-06-07-25-21-utc.avif'),
    },
  ]);

  return (
    <div className="w-full px-4 md:px-10 lg:px-20 py-8 md:py-12">
      {/* 主要内容区域 - 带边框和阴影的卡片 */}
      <div className="border border-gray-300 rounded-lg p-4 md:p-6 mb-10 bg-white">
        <Row gutter={[16, 16]} className="flex-col lg:flex-row">
          {/* Left text and buttons */}
          <Col xs={24} lg={8} className="p-4 md:p-5">
            <Text className="block mb-1 text-base">By Industry</Text>
            <Title level={3} className="!text-[#1AA4DD] !m-0 !text-xl md:!text-2xl text-left mb-3">
              Learn How to Utilize
            </Title>
            <Text className="block mb-4 text-sm md:text-base">
              We operate Japan's largest recruitment platform, directly connecting companies seeking technical intern trainees, specified skilled workers, and highly skilled talent with job seekers.
            </Text>
            {/* 箭头按钮 */}
            <div className="flex justify-start space-x-4 mt-4">
              <Button
                shape="circle"
                icon={<LeftOutlined />}
                className="bg-[#EE6629] border-[#EE6629] text-[#EDF8FC] hover:bg-[#d95a20] hover:border-[#d95a20] hover:text-white font-bold text-base w-10 h-10 md:w-12 md:h-12 flex items-center justify-center"
              />
              <Button
                shape="circle"
                icon={<RightOutlined />}
                className="bg-[#EE6629] border-[#EE6629] text-[#EDF8FC] hover:bg-[#d95a20] hover:border-[#d95a20] hover:text-white font-bold text-base w-10 h-10 md:w-12 md:h-12 flex items-center justify-center"
              />
            </div>
          </Col>

          {/* 右侧卡片网格 */}
          <Col xs={24} lg={16}>
            <Row gutter={[16, 16]}>
              {industries.map((industry, index) => (
                <Col key={index} xs={24} sm={12} md={8}>
                  <Card
                    cover={
                      <img
                        alt={industry.title}
                        src={industry.image}
                        className="w-full h-40 md:h-48 object-cover rounded-t-lg" // 图片样式
                        loading="lazy"
                      />
                    }
                    className="w-full rounded-lg overflow-hidden border-none shadow-md" // 卡片整体样式
                  >
                    {/* 自定义标题区域 */}
                    <div className="bg-[#1AA4DD] text-white py-2 px-4 text-center text-base md:text-lg font-bold">
                      {industry.title}
                    </div>
                    {/* 自定义描述区域 */}
                    <div className="bg-[#eef7fb] p-3 md:p-4 min-h-[100px]"> {/* 设置最小高度以保持一致性 */}
                      <Text className="text-sm md:text-base text-gray-700">
                        {industry.description}
                      </Text>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </div>

      {/* Blog title area */}
      <Row justify="center" className="mb-8">
        <Col span={24} className="text-center">
          <Text className="block mb-1 text-base md:text-lg">Various Blogs</Text>
          <Title level={3} className="!m-0 !text-xl md:!text-2xl mb-1">Trust Us for Foreign Talent</Title>
          <Title level={3} className="!text-[#1AA4DD] !m-0 !text-xl md:!text-2xl mb-3">
            Highly Skilled Talent & Specified Skilled Worker Journal
          </Title>
          <Text className="block text-sm md:text-base max-w-3xl mx-auto">
            "Dispatch Journal" provides the latest information and trends related to staffing. We publish beneficial information for those interested in staffing services.
          </Text>
        </Col>
      </Row>
    </div>
  );
};

export default Content9;



