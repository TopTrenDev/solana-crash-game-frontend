import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Dispatch, SetStateAction } from 'react';
import LiveChat from './live-chat';

type TMobileLivechatProps = {
  className?: string;
  setLivechatOpen: Dispatch<SetStateAction<boolean>>;
  livechatOpen: boolean;
};
export default function MobileLivechat({
  setLivechatOpen,
  livechatOpen
}: TMobileLivechatProps) {
  return (
    <>
      <Sheet open={livechatOpen} onOpenChange={setLivechatOpen} >
        <SheetContent
          side="right"
          className="w-auto border-none bg-dark p-0 pt-16 shadow-lg shadow-purple-0.15"
        >
          <LiveChat />
        </SheetContent>
      </Sheet>
    </>
  );
}
