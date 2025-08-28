import React from 'react';
import Avatar from './Avatar';
import Button from './Button';

interface StickerPostProps {
  user: {
    name: string;
    handle: string;
    avatarUrl: string | null;
  };
  sticker: {
    imageUrl: string;
    title: string;
    isPremium: boolean;
  };
  stats: {
    likes: number;
    comments: number;
    downloads: number;
  };
}

const StickerPost: React.FC<StickerPostProps> = ({ user, sticker, stats }) => {
  return (
    <div className="border-b border-gray-200 p-4 dark:border-gray-800 flex gap-4">
      <div>
        <Avatar src={user.avatarUrl} alt={`${user.name}'s avatar`} />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-bold hover:underline cursor-pointer">{user.name}</p>
          <p className="text-sm text-gray-500">@{user.handle}</p>
        </div>
        <p className="mt-1">{sticker.title}</p>
        <div className="relative mt-4 aspect-square w-full max-w-sm rounded-lg border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-900/50">
          {sticker.isPremium && (
            <div className="absolute right-2 top-2 rounded-full bg-yellow-500 px-2 py-1 text-xs font-bold text-white">
              ⭐ Premium
            </div>
          )}
          {/* Using a placeholder image for now */}
          <img src="https://via.placeholder.com/400" alt={sticker.title} className="h-full w-full object-contain" />
        </div>
        <div className="mt-4 flex justify-between text-gray-500 max-w-sm">
          <Button variant="ghost" className="flex items-center gap-2">
            <span>❤️</span>
            <span className="text-sm">{stats.likes}</span>
          </Button>
          <Button variant="ghost" className="flex items-center gap-2">
            <span>💬</span>
            <span className="text-sm">{stats.comments}</span>
          </Button>
          <Button variant="ghost" className="flex items-center gap-2">
            <span>🔗</span>
            <span className="text-sm">Share</span>
          </Button>
          <Button variant="ghost" className="flex items-center gap-2">
            <span>⬇️</span>
            <span className="text-sm">{stats.downloads}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StickerPost;
