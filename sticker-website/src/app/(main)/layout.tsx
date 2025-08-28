import LeftSidebar from '@/components/layout/LeftSidebar';
import RightSidebar from '@/components/layout/RightSidebar';
import Navbar from '@/components/layout/Navbar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full justify-center bg-white dark:bg-black">
      <div className="flex w-full max-w-screen-xl">
        <LeftSidebar />
        <main className="flex-1 border-x border-gray-200 dark:border-gray-800">
          <Navbar />
          <div className="p-4">
            {children}
          </div>
        </main>
        <RightSidebar />
      </div>
    </div>
  );
}
