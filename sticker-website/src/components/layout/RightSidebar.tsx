import React from 'react';

const RightSidebar = () => {
  return (
    <aside className="sticky top-0 hidden h-screen w-80 flex-col gap-6 border-l border-gray-200 p-4 dark:border-gray-800 lg:flex">
      <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-900/50">
        <h2 className="mb-4 font-bold">Sticker Trending</h2>
        {/* Placeholder for trending stickers */}
        <ul className="space-y-2 text-sm">
          <li>#MemeLucu</li>
          <li>#AnimeVibes</li>
          <li>#KucingOren</li>
        </ul>
      </div>
      <div className="mt-6 rounded-xl bg-gray-50 p-4 dark:bg-gray-900/50">
        <h2 className="mb-4 font-bold">Rekomendasi untuk Anda</h2>
        {/* Placeholder for user recommendations */}
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-700"></div>
            <div>
                <p className="font-semibold">User1</p>
                <p className="text-sm text-gray-500">@user1_handle</p>
            </div>
          </div>
          <button className="rounded-full bg-black px-3 py-1 text-sm font-bold text-white dark:bg-white dark:text-black">
            Follow
          </button>
        </div>
         <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-700"></div>
            <div>
                <p className="font-semibold">User2</p>
                <p className="text-sm text-gray-500">@user2_cool</p>
            </div>
          </div>
          <button className="rounded-full bg-black px-3 py-1 text-sm font-bold text-white dark:bg-white dark:text-black">
            Follow
          </button>
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;
