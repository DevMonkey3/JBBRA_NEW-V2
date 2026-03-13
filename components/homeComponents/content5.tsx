// Content5.tsx
"use client";

import { Image, Typography, Button, Row, Col } from "antd";
import { useState } from "react";
import HeroCarousel from "../hero/HeroCarousel";
import { getCdnUrl } from "@/config/cdn";

const Content5: React.FC = () => {
  const { Text, Title } = Typography;

  const [achievements] = useState([
    {
      image: getCdnUrl('/home/solve.avif'),
      industryText: 'Industry',
      industry: 'Major motorcycle manufacturing company',
      departmentText: 'Department/Position',
      department: 'Welding in motorcycle manufacturing process',
      employeesText: 'Employees',
      employees: '1,000+',
    },
    {
      image: getCdnUrl('/Garments/dressmaker-woman-sews-clothes-on-sewing-machine-in-2025-03-18-20-17-44-utc.avif'),
       industryText: 'Industry',
  industry: 'Apparel/Manufacturing',
  departmentText: 'Department/Position',
  department: 'Sewing in clothing manufacturing process',
  employeesText: 'Employees',
  employees: '500+',
    },
    {
      image: getCdnUrl('/home/Mask-group-4.avif'),
      industryText: 'Industry',
  industry: 'Construction',
  departmentText: 'Department/Position',
  department: 'Welding in construction projects',
  employeesText: 'Employees',
  employees: '1,000+',
    },
  ]);

  const [points] = useState([
    'Foreign workers with residence and work history in Japan',
    'Comprehensive support from hiring to post-employment',
    'Specified skilled worker recruitment from internships',
    'Specified skilled worker recruitment from student dispatch',
    'Customized talent recruitment',
    'Reliable compliance',
  ]);

  return (
    <div>
      
    <div className="mx-auto py-10 px-4 max-w-7xl">
      
      {/* First part: Achievements */}
      <Title level={2} className="text-center text-xl md:text-2xl font-bold text-gray-800 mb-4">
        Our Achievements
      </Title>
      <Text className="text-center block text-gray-600 mb-8 text-sm md:text-base max-w-3xl mx-auto leading-relaxed">
        Foreign talent utilization has become essential for Japans manufacturing industry. We can dispatch diverse global talent from over 60 countries. To enable long-term dispatch, we have prepared a comprehensive support system.
      </Text>

      {/* 实绩卡片网格 */}
      <div className="bg-blue-50 rounded-xl p-6 mb-10">
        <Row gutter={[16, 24]} justify="center">
          {achievements.map((item, index) => (
            <Col xs={24} sm={12} md={8} key={index}>
              <div className="bg-white rounded-lg shadow-sm p-4 text-left">
                <Image
                  src={item.image}
                  alt="Achievement"
                  preview={false}
                  width="100%"
                  height={160}
                  className="rounded-lg object-cover mb-4"
                />
                <Text className="block text-sm md:text-base mb-2">
                  <span className="font-semibold text-blue-600">{item.industryText}</span>{' '}
                  {item.industry}
                </Text>
                <Text className="block text-sm md:text-base mb-2">
                  <span className="font-semibold text-blue-600">{item.departmentText}</span>{' '}
                  {item.department}
                </Text>
                <Text className="block text-sm md:text-base">
                  <span className="font-semibold text-blue-600">{item.employeesText}</span>{' '}
                  {item.employees}
                </Text>
              </div>
            </Col>
          ))}
        </Row>

        {/* View More Button */}
        <div className="text-center mt-6">
          <Button
            type="primary"
            shape="round"
            className="bg-orange-500 hover:bg-orange-600 border-none text-white font-medium px-8 py-2"
            style={{ background: '#EE6629' }}
            onClick={() => window.location.href = '/jbbc/cases'}
          >
            View All Services 
          </Button>
        </div>
      </div>

       {/* Second part: Client Examples */}
      <Title level={2} className="text-center text-xl md:text-2xl font-bold text-gray-800 mb-6">
        Client Examples
      </Title>
      <div className="relative w-full overflow-hidden mb-8 bg-white py-4 shadow-sm">
        <div
          className="flex whitespace-nowrap"
          style={{
            animation: 'marqueeScroll 25s linear infinite',
            willChange: 'transform',
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden'
          }}
        >
          {/* Duplicate 3 times for seamless infinite scroll */}
          {[...Array(3)].map((_, index) => (
            <div key={`logo-${index}`} className="flex-shrink-0 w-full">
              <Image
                src={getCdnUrl("/home/logo.avif")}
                alt="企業ロゴ"
                preview={false}
                width={0}
                height={0}
                className="w-full h-auto object-contain block"
                style={{ minWidth: '100vw' }}
              />
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        @keyframes marqueeScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
      `}</style>

      {/* 6 Points */}
      <div className="bg-blue-50/60 rounded-xl p-6 md:p-8">
        <Row gutter={[24, 24]} align="middle">
          {/* Left image */}
          <Col xs={24} md={8}>
            <Image
              src={getCdnUrl("/home/leftside.avif")}
              alt="Points illustration"
              preview={false}
              width="100%"
              height={350}
              className="rounded-lg object-cover"
            />
          </Col>

          {/* Right text + list */}
          <Col xs={24} md={16}>
            <Row align="middle" className="mb-6">
              <Col>
                <span
                  className="text-5xl md:text-6xl font-bold text-orange-500 mr-3"
                  style={{ fontFamily: 'sans-serif' }}
                >
                  6
                </span>
              </Col>
              <Col>
                <Title level={3} className="text-orange-500 m-0 text-lg md:text-xl">
                  Specified Skills & Foreign Talent
                </Title>
                <Title level={2} className="m-0 text-2xl md:text-3xl font-bold">
                  Points
                </Title>
              </Col>
            </Row>

            {/* 优势列表 */}
            <ul className="space-y-3 pl-5 md:pl-8">
              {points.map((point, index) => (
                <li key={index} className="flex items-start">
                  <span
                    className="inline-flex items-center justify-center w-6 h-6 bg-orange-500 text-white text-sm font-bold rounded-full mr-3 mt-0.5 flex-shrink-0"
                  >
                    ✓
                  </span>
                  <Text className="text-gray-700 text-sm md:text-base leading-relaxed">
                    {point}
                  </Text>
                </li>
              ))}
            </ul>
          </Col>
        </Row>
      </div>
    </div>
    </div>
  );
};

export default Content5;
