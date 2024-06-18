import Heading from './heading';
import UserNav from './user-nav';
import { MessageSquareMore } from 'lucide-react';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import authBtn from '/assets/auth-btn.svg';
import useModal from '@/hooks/use-modal';
import { ModalType } from '@/types/modal';
import { useOpen } from '@/provider/chat-provider';
import { useAppSelector } from '@/store/redux';

export default function Header() {
  const modal = useModal();
  const { open, setOpen } = useOpen();
  const userData = useAppSelector((store: any) => store.user.userData);
  const handleSignIn = async () => {
    modal.open(ModalType.LOGIN);
  };

  return (
    <div className="flex flex-1 items-center justify-between bg-dark bg-opacity-30 bg-blend-multiply">
      <Heading />
      <div className="ml-4 mr-8 flex items-center gap-10 md:ml-6">
        {userData?.username !== '' ? (
          <div className="flex items-center gap-4">
            <Button
              className="hidden bg-transparent px-0 hover:bg-transparent lg:block"
              onClick={() => setOpen(!open)}
            >
              <MessageSquareMore
                className={`text-${open ? 'purple' : 'white'}`}
              />
            </Button>
            <Separator orientation={'vertical'} className="h-6" />
            <UserNav />
          </div>
        ) : (
          <Button
            className="gap-2 rounded-lg bg-[#049DD9] text-white hover:bg-[#049DD9]"
            onClick={handleSignIn}
          >
            <img src={authBtn} />
            <span className="uppercase">Sign In</span>
          </Button>
        )}
      </div>
    </div>
  );
}
