import { useState } from 'react';
import MobileSidebar from '../../components/shared/mobile-sidebar';
export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  return (
    <div className="flex h-screen bg-[#0B0B23] px-[80px]">
      <MobileSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className="flex w-0 flex-1 flex-col overflow-hidden">
        <main className="flex flex-row justify-between focus:outline-none">
          <div className="flex-1">{children}</div>
        </main>
      </div>
    </div>
  );
}
