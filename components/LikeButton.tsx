// Client component for blog post like functionality
'use client';

import { useState } from 'react';
import { Button, message } from 'antd';
import { HeartFilled, HeartOutlined } from '@ant-design/icons';

interface LikeButtonProps {
  postId: string;
  initialLikeCount: number;
}

export default function LikeButton({ postId, initialLikeCount }: LikeButtonProps) {
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [liked, setLiked] = useState(false);
  const [liking, setLiking] = useState(false);

  const handleLike = async () => {
    if (liked) return;

    setLiking(true);
    try {
      const res = await fetch(`/api/blog/${postId}/like`, {
        method: 'POST',
      });

      if (!res.ok) {
        throw new Error('Failed to like post');
      }

      const data = await res.json();
      setLiked(data.liked);
      setLikeCount(data.likeCount);

      if (data.liked) {
        message.success('記事をいいねしました！');
      }
    } catch (error) {
      message.error('いいねに失敗しました');
    } finally {
      setLiking(false);
    }
  };

  return (
    <div className="text-center">
      <p className="text-xl md:text-2xl text-gray-700 mb-6 font-medium">
        この記事は役に立ちましたか？
      </p>
      <Button
        type={liked ? 'primary' : 'default'}
        size="large"
        icon={liked ? <HeartFilled /> : <HeartOutlined />}
        onClick={handleLike}
        loading={liking}
        className={`
          ${liked
            ? 'bg-red-500 hover:bg-red-600 border-red-500 text-white shadow-lg shadow-red-200'
            : 'border-2 border-gray-300 hover:border-red-500 hover:text-red-500 hover:shadow-lg'
          }
          px-10 py-6 h-auto text-lg md:text-xl font-semibold rounded-full transition-all duration-300
        `}
        danger={liked}
      >
        {liked ? 'いいね済み' : 'いいね'} ({likeCount})
      </Button>
    </div>
  );
}
