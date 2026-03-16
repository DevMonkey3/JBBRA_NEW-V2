// components/LikeButton.tsx
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
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    // Removed: if (liked) return — the API supports toggle (like→unlike→like)
    // Locking the button after one like meant users could never undo it,
    // which disagreed with the API's toggle behavior.
    if (loading) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/blog/${postId}/like`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed');

      const data = await res.json();
      setLiked(data.liked);
      setLikeCount(data.likeCount);
      message.success(data.liked ? '記事をいいねしました！' : 'いいねを取り消しました');
    } catch {
      message.error('いいねに失敗しました');
    } finally {
      setLoading(false);
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
        loading={loading}
        danger={liked}
        className={`
          ${liked
            ? 'bg-red-500 hover:bg-red-600 border-red-500 text-white shadow-lg shadow-red-200'
            : 'border-2 border-gray-300 hover:border-red-500 hover:text-red-500 hover:shadow-lg'
          }
          px-10 py-6 h-auto text-lg md:text-xl font-semibold rounded-full transition-all duration-300
        `}
      >
        {liked ? 'いいね済み' : 'いいね'} ({likeCount})
      </Button>
    </div>
  );
}
