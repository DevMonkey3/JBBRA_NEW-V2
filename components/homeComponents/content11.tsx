// Content11.tsx
"use client";

import { Typography, Row, Col, Button, Image } from "antd";
import { RightOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import HeroCarousel from "@/components/hero/HeroCarousel";
import { getCdnUrl } from "@/config/cdn";

const Content11: React.FC = () => {
  const { Text, Title } = Typography;

  const [faqItems] = useState([
    { question: 'How do you solve the labor shortage?', id: 'faq1' },
    { question: 'Is the contract period fixed?', id: 'faq2' },
    { question: 'How long does it take to get introduced after requesting?', id: 'faq3' },
    { question: 'What is the market rate per person?', id: 'faq4' },
    { question: 'Can foreign staff work without time restrictions?', id: 'faq5' },
    { question: 'Is there any support or follow-up after employment?', id: 'faq6' },
  ]);

  return (
    <div className="w-full">
      {/* Company Section — no roundness */}
      <div
        className="py-10 md:py-16 px-4 md:px-6 w-11/12 md:w-4/5 mx-auto text-center mb-10 md:mb-16"
        style={{ backgroundColor: 'rgba(0,97,154,0.2)' }}
      >
        <Button
          type="primary"
          size="large"
          className="border-none mb-4 md:mb-6 !px-6 !py-2 md:!px-8 md:!py-3 !text-base md:!text-lg"
          style={{ background: '#00619A', borderRadius: 0 }}
          onClick={() => window.location.href = '/jbbc/Info'}
        >
          About Us
        </Button>
        <Title level={2} className="!text-2xl md:!text-3xl !m-0 mb-4 md:mb-6">
          Company Information
        </Title>
        <Text className="block text-base md:text-lg text-gray-700 max-w-3xl mx-auto text-left">
          Japan Bangladesh Bridge Co., Ltd. is a comprehensive human resources service company specializing in manufacturing.
          Japan is a "manufacturing" nation, and manufacturing has supported Japan's economy. Our mission is to connect the "manufacturing" sites and all the people who work there.
        </Text>
      </div>

      {/* Compliance Section */}
      <Row justify="center" className="w-11/12 md:w-4/5 mx-auto -mt-10 md:-mt-16 z-10 relative">
        <Col xs={24} md={10} className="mb-6 md:mb-0">
          <Image
            src={getCdnUrl("/home/homeImg.avif")}
            preview={false}
            className="w-full h-auto object-cover"
            style={{ borderRadius: 0 }}
            alt="Building"
          />
        </Col>
        <Col xs={24} md={12} className="px-4 md:px-0 md:pl-6 flex flex-col justify-center">
          <Title level={1} className="!text-2xl md:!text-3xl !m-0 mb-4 md:mb-6 text-left">
            Compliance Initiatives
          </Title>
          <Text className="block text-base md:text-lg text-gray-700 mb-6 md:mb-8 text-left">
            Japan Bangladesh Bridge complies with all labor-related regulations and laws related to our business, and strives to conduct corporate activities that conform to normal business practices and social ethics.
          </Text>
          <Button
            size="large"
            className="self-start border-none !px-6 !py-2 md:!px-8 md:!py-3 !text-base md:!text-lg text-white"
            style={{ background: '#00619A', borderRadius: 0 }}
            onClick={() => window.location.href = '/jbbc/Info'}
          >
            Details Here →
          </Button>
        </Col>
      </Row>

      {/* Client Examples */}
      <div className="text-center my-10 md:my-16 px-4">
        <Title level={3} className="!text-xl md:!text-2xl !m-0 mb-6">Client Examples</Title>
        <HeroCarousel />
      </div>

      {/* Problems / FAQ Section */}
      <div className="py-10 md:py-16 px-4 md:px-10" style={{ backgroundColor: 'rgba(0,97,154,0.2)' }}>
        <div className="text-center text-gray-500 text-sm md:text-base mb-6 md:mb-8">Problems</div>
        <div className="bg-white shadow-lg overflow-hidden w-11/12 md:w-4/5 mx-auto p-6 md:p-10" style={{ borderRadius: 0 }}>
          <Button
            style={{ background: '#00619A', border: 'none', color: 'white', borderRadius: 0, marginTop: '20px' }}
            className="!px-6 !py-3 md:!px-8 md:!py-4 !text-lg md:!text-xl font-bold mb-6 md:mb-0"
          >
            Frequently Asked Questions
          </Button>
          <Row gutter={[16, 16]} className="flex-col md:flex-row">
            <Col xs={24} md={12} className="p-4 md:p-10">
              <Title level={1} className="!text-2xl md:!text-3xl !m-0 mb-4 md:mb-6 text-left">
                Please tell us about your site concerns and management challenges
              </Title>
              <Text className="block text-base md:text-lg text-gray-700 mb-6 md:mb-8 text-left">
                From labor shortages to business efficiency, let's solve the challenges you're facing together.
                First, please take a look at the "Frequently Asked Questions". We'll introduce you to the solutions.
              </Text>
              <Button
                type="primary"
                size="large"
                className="border-none !px-6 !py-2 md:!px-8 md:!py-3 !text-base md:!text-lg flex items-center"
                style={{ background: '#00619A', borderRadius: 0 }}
                onClick={() => window.location.href = '/jbbc/faq'}
              >
                View Answers to Questions <RightOutlined className="ml-2" />
              </Button>
            </Col>
            <Col xs={24} md={12} className="p-4 md:p-10">
              <ul className="list-none p-0 m-0">
                {faqItems.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center mb-4 p-3 border-2"
                    style={{ borderColor: 'rgba(0,97,154,0.4)', borderRadius: 0 }}
                  >
                    <div
                      className="bg-[#00619A] text-white w-6 h-6 md:w-7 md:h-7 flex items-center justify-center text-sm md:text-base font-bold mr-3 flex-shrink-0"
                      style={{ borderRadius: 0 }}
                    >
                      ?
                    </div>
                    <span className="text-base md:text-lg text-gray-800 text-left">{item.question}</span>
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

export default Content11;