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

export default function BacktestingModal() {
  const { open, type } = useAppSelector((state: any) => state.modal);
  const isOpen = open && type === ModalType.BACKTESTING;
  const modal = useModal();

  const hanndleOpenChange = async () => {
    if (isOpen) {
      modal.close(ModalType.BACKTESTING);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={hanndleOpenChange}>
      <DialogContent className="w-[1200px] !max-w-[1200px] gap-0 rounded-[8px] border-2 border-none bg-[#0D0B32] p-0 text-white sm:max-w-sm">
        <DialogHeader className="flex flex-row items-center justify-between rounded-t-[8px] bg-[#463E7A] px-[24px] py-[20px]">
          <DialogTitle className="text-center text-[24px] font-semibold uppercase">
            Banktesting
          </DialogTitle>
          <DialogClose className="hover:ropacity-100 !my-0 rounded-sm opacity-70 outline-none ring-offset-background transition-opacity focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:text-muted-foreground">
            <Cross2Icon className="h-7 w-7 text-white" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        <div className="flex w-full items-center gap-10 rounded-b-[8px] bg-[#2C2852] px-[40px] py-[36px]">
          <div className="w-1/1 flex flex-col gap-4">
            <span>
              Backtesting can help gauge the effectiveness of a strategy without
              risking real money.
            </span>
            <span>
              First choose how to generate games (either historical or based on
              an arbitrary hash) and select the script you want to test. Click
              "Run Script" and wait for the simulation to complete or click
              "Stop Script" at any time to stop it. When the simulation stops,
              CSV reports will be available for download.
            </span>
            <span>
              Note that historical games are generated using bustabit's current
              hash-chain. If you are interested in the technical details of our
              provably fair system, have a look at this thread on the Bitcoin
              forums and at this illustrative demo.
            </span>
            <span>
              Be aware that while backtesting helps interpreting how a strategy
              behaves, it can't predict future performance.
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
