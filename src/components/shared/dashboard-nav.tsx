import { cn } from '@/utils/utils';
import { NavItem, NavItemGroup } from '@/types';
import { Dispatch, SetStateAction, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '../ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { usePathname } from '@/hooks';
import { ModalType } from '@/types/modal';
import useModal from '@/hooks/use-modal';

type DashboardNavProps = {
  items: any[];
  // items: NavItemGroup[];
  setOpen?: Dispatch<SetStateAction<boolean>>;
};

type DashboardNavItemProps = {
  item: NavItem;
  setOpen?: Dispatch<SetStateAction<boolean>>;
};

type DashboardNavGroupProps = {
  item: any;
  // item: NavItemGroup;
};

const DashboardNavItem = ({ item, setOpen }: DashboardNavItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === item.href;
  return (
    <Link
      key={item.href}
      className={cn(
        'flex transform items-center rounded-[6px] bg-dark-blue px-6 py-[10.5px] text-gray300 transition-colors duration-300 hover:bg-purple hover:text-gray100',
        isActive && 'bg-purple text-white'
      )}
      to={item.href}
    >
      <img src={item.icon} className="h-5 w-5" aria-hidden="true" />
      <span className="ml-3 text-sm font-medium uppercase">{item.label}</span>
    </Link>
  );
};

// const DashboardNavGroup = ({ item }: DashboardNavGroupProps) => {
//   const [isOpen, setOpen] = useState(true);

//   const Icon = isOpen ? ChevronDown : ChevronUp;

//   return (
//     <Collapsible
//       className="w-full data-[state='closed']:!h-6"
//       open={isOpen}
//       onOpenChange={setOpen}
//     >
//       <CollapsibleTrigger asChild>
//         <div className=" flex  w-full cursor-pointer select-none items-center justify-between text-sm font-medium text-gray500">
//           <div className="text-sm font-medium uppercase">{item.title}</div>
//           <Icon className="h-4 w-4" />
//         </div>
//       </CollapsibleTrigger>
//       <CollapsibleContent className="mt-6 flex flex-col gap-2 transition-transform duration-100 ease-out">
//         {item.items.map((subitem, index) => (
//           <DashboardNavItem key={index} item={subitem} setOpen={setOpen} />
//         ))}
//       </CollapsibleContent>
//     </Collapsible>
//   );
// };

const DashboardNavGroup = ({ item }: DashboardNavGroupProps) => {
  const modal = useModal();
  const handleModalOpen = async (modalType: ModalType) => {
    modal.open(modalType);
  };

  return (
    <div
      className={
        'min-h-full cursor-pointer rounded-none border-b-2 border-b-transparent px-6 py-5 text-[14px] font-medium uppercase text-[#fff] duration-300 hover:bg-transparent hover:text-[#9E00FF]'
      }
      onClick={() => handleModalOpen(item.modal)}
    >
      {item.name}
    </div>
  );
};

export default function DashboardNav({ items, setOpen }: DashboardNavProps) {
  if (!items?.length) {
    return null;
  }

  return (
    <nav className="flex w-full flex-col gap-7">
      {items.map((item) => (
        <DashboardNavGroup key={item.title} item={item} />
      ))}
    </nav>
  );
}
