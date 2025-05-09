import DashboardNav from '@/components/shared/dashboard-nav';
import { Sheet, SheetContent } from '@/components/ui/sheet';
// import { navItems } from '@/constants/data';
import { Dispatch, SetStateAction } from 'react';
import { Link } from 'react-router-dom';
import Logo from '/assets/logo.svg';
// import { NavItemGroup } from '@/types';
import { tabItems } from '@/constants/data';

type TMobileSidebarProps = {
  className?: string;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
  sidebarOpen: boolean;
};
export default function MobileSidebar({
  setSidebarOpen,
  sidebarOpen
}: TMobileSidebarProps) {
  return (
    <>
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-72 border-none bg-dark !px-0">
          <div className="flex w-full flex-col items-center gap-8 p-5 ">
            <Link to="/" className="py-2 text-2xl font-bold text-white ">
              <img src={Logo} alt="Logo" className="h-32 w-36" />
            </Link>
            <div className="w-full space-y-1 px-2">
              <DashboardNav items={tabItems} setOpen={setSidebarOpen} />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
