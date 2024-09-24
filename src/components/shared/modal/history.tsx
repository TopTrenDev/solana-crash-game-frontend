import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import { ModalType } from '@/types/modal';
import useModal from '@/hooks/use-modal';
import { useAppSelector } from '@/store/redux';
import { Cross2Icon } from '@radix-ui/react-icons';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { SiNintendogamecube } from 'react-icons/si';
import { useGame } from '@/contexts';
import { shortenHash } from '@/utils/utils';

export default function HistoryModal() {
  const { open, type } = useAppSelector((state: any) => state.modal);
  const { gameHistories, currentGame, setGameId } = useGame();
  const isOpen = open && type === ModalType.HISTORY;
  const modal = useModal();

  if (!currentGame) return;
  else {
    const handleOpenChange = async () => {
      if (isOpen) {
        modal.close(ModalType.HISTORY);
        setGameId(-1);
      }
    };

    const prevGame = () => {
      setGameId((prev) => (prev - 1 <= 0 ? 0 : prev - 1));
    };

    const nextGame = () => {
      setGameId((prev) =>
        prev + 1 > gameHistories.length ? gameHistories.length : prev + 1
      );
    };

    const formatDate = (input: string | Date) => {
      // Parse the input date string
      let date;
      if (!input) {
        date = new Date();
      } else if (typeof input === 'string') {
        date = new Date(input);
      } else {
        date = input;
      }

      console.log('🚀 ~ formatDate ~ date:', date);

      // Define options for formatting the date
      const options = {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'GMT',
        timeZoneName: 'short'
      };

      // Format the date using the specified options
      //@ts-ignore
      let formattedDate = new Intl.DateTimeFormat('en-US', options).format(
        date
      );
      formattedDate = formattedDate.replace(/,/g, '');

      // Calculate the time difference in minutes
      const now = new Date();
      //@ts-ignore
      const diffMs = now - date;
      const diffMinutes = Math.round(diffMs / 60000);
      let timeAgo;
      if (diffMinutes < 60) {
        timeAgo = `${diffMinutes} minutes ago`;
      } else if (diffMinutes < 1440) {
        const diffHours = Math.round(diffMinutes / 60);
        timeAgo = `${diffHours} hours ago`;
      } else {
        const diffDays = Math.round(diffMinutes / 1440);
        timeAgo = `${diffDays} days ago`;
      }

      return { formattedDate, timeAgo };
    };

    return (
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="gap-0 rounded-[8px] border-2 border-none bg-[#0D0B32] p-0 text-white sm:max-w-sm lg:w-[800px] lg:!max-w-[800px]">
          <DialogHeader className="flex flex-row items-center justify-between rounded-t-[8px] bg-[#463E7A] px-[24px] py-[20px]">
            <DialogTitle className="text-center text-[24px] font-semibold uppercase">
              Game information
            </DialogTitle>
            <DialogClose className="!my-0 rounded-sm opacity-70 outline-none ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:text-muted-foreground">
              <Cross2Icon className="h-7 w-7 text-white" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogHeader>
          <div className="rounded-b-[8px] bg-[#2C2852] py-[26px]">
            <div className="flex flex-col items-center gap-5 overflow-scroll overflow-y-auto px-[25px]">
              <div className="flex w-full justify-between">
                <button
                  className="flex items-center gap-2 rounded-sm border p-2 hover:bg-[#463E7A]"
                  onClick={() => prevGame()}
                >
                  <FaArrowLeft />
                  Prev Game
                </button>
                <button
                  className="flex items-center gap-2 rounded-sm border p-2 hover:bg-[#463E7A]"
                  onClick={() => nextGame()}
                >
                  Next Game
                  <FaArrowRight />
                </button>
              </div>
              <div className="flex w-full flex-col items-center justify-between lg:flex-row">
                <div className="flex flex-col items-center gap-1 text-[20px] lg:flex-row">
                  <SiNintendogamecube />
                  Game # <span className="font-thin">{currentGame._id}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="uppercase">Crashed At:</span>
                  <span className="font-thin">
                    {(currentGame.crashPoint / 100).toFixed(2)}x
                  </span>
                </div>
              </div>
              <div className="flex w-full items-center gap-1">
                <span className="font-bold uppercase">Date: </span>
                <span className="font-light">
                  {formatDate(currentGame.created).formattedDate}
                </span>
                <span className="text-sm font-thin">
                  {' '}
                  {formatDate(currentGame.created).timeAgo}
                </span>
              </div>
              <div className="hidden w-full rounded-sm border px-3 py-2 text-sm font-thin text-white lg:block">
                {currentGame.privateHash}
              </div>
              <div className="block w-full rounded-sm border px-3 py-2 text-sm font-thin text-white lg:hidden">
                {shortenHash(currentGame.privateHash || '')}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
}
