import React from 'react';

const LeftSidebar = () => {
  return (
    <aside className="sticky top-0 hidden h-screen w-64 flex-col gap-4 border-r border-gray-200 p-4 dark:border-gray-800 md:flex">
      <div className="mb-8">
        {/* Placeholder for Logo */}
        <h1 className="text-3xl font-bold">SX</h1>
      </div>
      <nav>
        <ul className="space-y-2 text-lg">
          <li>
            <a href="#" className="flex items-center gap-4 rounded-full px-4 py-2 font-bold hover:bg-gray-100 dark:hover:bg-gray-900">
              🏠<span className="hidden lg:inline">Home</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center gap-4 rounded-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-900">
              🔥<span className="hidden lg:inline">Trending</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center gap-4 rounded-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-900">
              📂<span className="hidden lg:inline">Kategori</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center gap-4 rounded-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-900">
              ⭐<span className="hidden lg:inline">Premium</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center gap-4 rounded-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-900">
              👤<span className="hidden lg:inline">Profil</span>
            </a>
          </li>
        </ul>
      </nav>
      <button className="mt-6 w-full rounded-full bg-blue-500 py-3 font-bold text-white hover:bg-blue-600">
        Upload
      </button>
    </aside>
  );
};

export default LeftSidebar;
