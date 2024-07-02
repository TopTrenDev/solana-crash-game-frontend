import History from '@/components/shared/history';
import LiveChat from '@/components/shared/live-chat';
import MobileLivechat from '@/components/shared/mobile-livechat';
import { Button } from '@/components/ui/button';
import { ECrashStatus } from '@/constants/status';
import { BetType, ICrashHistoryRecord } from '@/types';
import { cn } from '@/utils/utils';
import { MessageSquareText } from 'lucide-react';
import BetBoard from './bet-board';

interface BetHistoryProps {
  selectDisplay: number;
  setSelectDisplay: React.Dispatch<React.SetStateAction<number>>;
  liveChatOpen: boolean;
  setLiveChatOpen: React.Dispatch<React.SetStateAction<boolean>>;
  crashHistoryRecords: ICrashHistoryRecord[];
  betData: BetType[];
  betCashout: BetType[];
  totalAmount: any;
  crashStatus: ECrashStatus;
}

export default function BetDisplay({
  selectDisplay,
  setSelectDisplay,
  liveChatOpen,
  setLiveChatOpen,
  crashHistoryRecords,
  betData,
  betCashout,
  totalAmount,
  crashStatus
}: BetHistoryProps) {
  return (
    <div className="flex h-full w-full flex-col rounded-lg bg-[#463E7A]">
      <div className="flex w-full flex-row items-center">
        <Button
          className={cn(
            'hidden min-h-full w-1/2 rounded-tr-lg border-none bg-[#191939] p-6 font-semibold text-[#9688CC] shadow-none hover:bg-[#191939] hover:text-white lg:flex',
            selectDisplay === 1 &&
              'rounded-lg border-none bg-[#463E7A] text-white hover:bg-[#463E7A]'
          )}
          onClick={() => setSelectDisplay(1)}
        >
          Chat
        </Button>
        <Button
          className={cn(
            'flex min-h-full w-1/2 rounded-tr-lg border-none bg-[#191939] p-6 font-semibold text-[#9688CC] shadow-none hover:bg-[#191939] hover:text-white lg:hidden',
            selectDisplay === 1 &&
              'rounded-lg border-none bg-[#463E7A] text-white hover:bg-[#463E7A]'
          )}
          onClick={() => setSelectDisplay(1)}
        >
          BetBoard
        </Button>
        <Button
          className={cn(
            'min-h-full w-1/2 rounded-tr-lg border-none bg-[#191939] p-6 font-semibold text-[#9688CC] shadow-none hover:bg-[#191939] hover:text-white',
            selectDisplay === 2 &&
              'rounded-lg border-none bg-[#463E7A] text-white hover:bg-[#463E7A]'
          )}
          onClick={() => setSelectDisplay(2)}
        >
          History
        </Button>
      </div>
      <div className="h-full w-full rounded-lg bg-[#463E7A]">
        <MobileLivechat
          livechatOpen={liveChatOpen}
          setLivechatOpen={setLiveChatOpen}
        />
        <div
          className={`flex h-full w-full translate-x-0 transform overflow-hidden rounded-lg opacity-100 transition-all duration-300 ease-in-out`}
        >
          {selectDisplay === 1 ? (
            <>
              <LiveChat className="hidden lg:flex" />
              <BetBoard
                betData={betData}
                betCashout={betCashout}
                totalAmount={totalAmount}
                crashStatus={crashStatus}
                className="flex lg:hidden"
              />
            </>
          ) : (
            <History crashHistoryRecords={crashHistoryRecords} />
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
