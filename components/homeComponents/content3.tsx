// Content3.tsx
"use client";

import { List, Typography, Button } from "antd";
import { useState } from "react";

const Content3: React.FC = () => {
  const { Text, Title } = Typography;

  const [newsItems] = useState([
    {
      category: '制度に関する最新情報',
      date: '2025年07月15日',
      title: '【特定技能】特定技能関係の特定活動（「特定技能２号」への移行を希望する場合）',
      color: '#1890ff',
    },
    {
      category: '制度に関する最新情報',
      date: '2025年07月15日',
      title: '【特定技能】特定技能関係の特定活動（「特定技能２号」への移行を希望する場合）',
      color: '#faad14',
    },
    {
      category: '制度に関する最新情報',
      date: '2025年07月15日',
      title: '【特定技能】特定技能関係の特定活動（「特定技能２号」への移行を希望する場合）',
      color: '#ff4d4f',
    },
    {
      category: '制度に関する最新情報',
      date: '2025年07月15日',
      title: '【特定技能】特定技能関係の特定活動（「特定技能２号」への移行を希望する場合）',
      color: '#1890ff',
    },
  ]);

  return (
    <div className="mx-auto py-8 px-4 max-w-4xl">
      
      {/* 标题 */}
      <Title level={2} className="text-center mb-6 text-lg md:text-xl lg:text-2xl font-bold text-gray-800">
        ニュースと最新情報
      </Title>

      {/* 新闻列表 - 外层容器加 padding */}
      <div className="bg-white rounded-lg shadow-sm border-none border-gray-200 px-4 sm:px-6 py-2">
        <List
          className="border-none"
          split={false} // 我们用 border-b 控制分隔，避免 Ant Design 默认样式冲突
          dataSource={newsItems}
          renderItem={(item, index) => (
            <List.Item
              key={index}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between 
                         p-4 sm:p-5 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 
                         transition-colors duration-150 "
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full">
                {/* 分类标签 */}
                <span
                  className="inline-block px-3 py-1 rounded text-white text-sm font-medium whitespace-nowrap"
                  style={{ backgroundColor: item.color }}
                >
                  {item.category}
                </span>

                {/* 日期 + 标题 */}
                <div className="flex flex-col sm:space-y-0 space-y-1 sm:flex-row sm:items-center sm:space-x-3 w-full">
                  <Text className="text-blue-700 text-sm md:text-base whitespace-nowrap">
                    {item.date}
                  </Text>
                  <Text className="text-blue-700 text-sm md:text-base flex-1 text-left line-clamp-2">
                    {item.title}
                  </Text>
                </div>
              </div>
            </List.Item>
          )}
        />
      </div>

      {/* 查看更多按钮 */}
      <div className="text-center mt-6">
        <Button
          type="primary"
          shape="round"
          className="bg-orange-500 hover:bg-orange-600 border-none text-white font-medium px-8 py-2 text-sm sm:text-base"
          style={{ background: '#EE6629' }}
        >
          お知らせ一覧 &gt;
        </Button>
      </div>
    </div>
  );
};

export default Content3;