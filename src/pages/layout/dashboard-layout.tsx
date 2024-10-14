import { useState } from 'react';
import MobileSidebar from '../../components/shared/mobile-sidebar';
import { MenuIcon } from 'lucide-react';
import Header from './header';
export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  return (
    <div className="flex w-full justify-center bg-[#0B0B23] px-0 lg:px-[30px]">
      <MobileSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      {/* <Sidebar /> */}
      <div className="grid h-full w-full grid-rows-[auto_1fr] overflow-hidden">
        <div className="relative z-10 flex h-16 flex-shrink-0 shadow">
          <button
            className="h-full bg-dark bg-opacity-30 px-4 text-gray-300 bg-blend-multiply focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden xl:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <MenuIcon className="h-6 w-6" aria-hidden="true" />
          </button>
          <Header isApp={true} />
        </div>
        <main className="flex flex-row justify-between overflow-auto focus:outline-none">
          <div className="flex-1">{children}</div>
        </main>
      </div>
    </div>
  );
}
