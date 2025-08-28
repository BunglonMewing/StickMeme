import React from 'react';

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white/80 px-4 py-2 backdrop-blur-md dark:border-gray-800 dark:bg-black/80">
      <div>
        <h1 className="text-xl font-bold">StickerX</h1>
      </div>
      <div className="flex-1 max-w-xs">
        <input
          type="text"
          placeholder="Search stickers, categories, users..."
          className="w-full rounded-full bg-gray-100 px-4 py-2 text-sm focus:outline-none dark:bg-gray-900"
        />
      </div>
      <div>
        <button className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-900">
          {/* Dark/Light Mode Toggle Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
