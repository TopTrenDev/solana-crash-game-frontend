import History from '@/components/shared/history';
import LiveChat from '@/components/shared/live-chat';
import MobileLivechat from '@/components/shared/mobile-livechat';
import { Button } from '@/components/ui/button';
import { displayMode } from '@/constants/data';
import { ICrashHistoryRecord } from '@/types';
import { cn } from '@/utils/utils';
import { MessageSquareText } from 'lucide-react';

interface BetHistoryProps {
  open: boolean;
  selectDisplay: string;
  setSelectDisplay: React.Dispatch<React.SetStateAction<string>>;
  liveChatOpen: boolean;
  setLiveChatOpen: React.Dispatch<React.SetStateAction<boolean>>;
  crashHistoryRecords: ICrashHistoryRecord[];
}

export default function BetDisplay({
  open,
  selectDisplay,
  setSelectDisplay,
  liveChatOpen,
  setLiveChatOpen,
  crashHistoryRecords
}: BetHistoryProps) {
  return (
    <div className="flex h-full w-full flex-col rounded-lg bg-[#463E7A]">
      <div className="flex w-full flex-row items-center">
        {displayMode.map((item, index) => (
          <Button
            className={cn(
              'min-h-full w-1/2 rounded-tr-lg border-none bg-[#191939] p-6 font-semibold text-[#9688CC] shadow-none hover:bg-[#191939] hover:text-white',
              selectDisplay === item &&
                'rounded-lg border-none bg-[#463E7A] text-white hover:bg-[#463E7A]'
            )}
            key={index}
            onClick={() => setSelectDisplay(item)}
          >
            {item}
          </Button>
        ))}
      </div>
      <div className="w-full rounded-lg bg-[#463E7A]">
        <MobileLivechat
          livechatOpen={liveChatOpen}
          setLivechatOpen={setLiveChatOpen}
        />
        <div
          className={`hidden h-full transform rounded-lg transition-all duration-300 ease-in-out lg:flex ${open ? 'w-full translate-x-0 opacity-100' : 'w-0 translate-x-full opacity-0'}`}
        >
          {selectDisplay === displayMode[0] ? (
            <History crashHistoryRecords={crashHistoryRecords} />
          ) : (
            <LiveChat />
          )}
        </div>
        <MessageSquareText
          className="fixed bottom-8 right-8 z-50 block h-14 w-14 cursor-pointer rounded-full bg-gray50 bg-opacity-15 p-3 text-lg text-gray50 bg-blend-multiply shadow-lg lg:hidden "
          onClick={() => setLiveChatOpen(true)}
        />
      </div>
    </div>
  );
}
