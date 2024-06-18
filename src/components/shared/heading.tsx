import { tabItems } from '@/constants/data';
import { cn } from '@/utils/utils';
import { usePathname } from '@/hooks';
import { Link } from 'react-router-dom';

type THeadingProps = {
  className?: string;
};

export default function Heading({ className }: THeadingProps) {
  const pathname = usePathname();
  return (
    <div className={className}>
      {tabItems.map((item, index) => (
        <Link
          key={index}
          to={item.path}
          className={cn(
            'min-h-full rounded-none border-b-2 border-b-transparent px-6 py-5 font-semibold uppercase text-gray-300 hover:bg-transparent',
            pathname === item.path && 'text-purple'
          )}
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
}
