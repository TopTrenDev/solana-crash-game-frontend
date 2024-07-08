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

export default function StatsModal() {
  const { open, type } = useAppSelector((state: any) => state.modal);
  const isOpen = open && type === ModalType.STATS;
  const modal = useModal();

  const hanndleOpenChange = async () => {
    if (isOpen) {
      modal.close(ModalType.STATS);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={hanndleOpenChange}>
      <DialogContent className="gap-0 rounded-[8px] border-2 border-none bg-[#0D0B32] p-0 text-white sm:max-w-sm lg:w-[800px] lg:!max-w-[800px]">
        <DialogHeader className="flex flex-row items-center justify-between rounded-t-[8px] bg-[#463E7A] px-[24px] py-[20px]">
          <DialogTitle className="text-center text-[24px] font-semibold uppercase">
            Statistics
          </DialogTitle>
          <DialogClose className="hover:ropacity-100 !my-0 rounded-sm opacity-70 outline-none ring-offset-background transition-opacity focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:text-muted-foreground">
            <Cross2Icon className="h-7 w-7 text-white" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        <div className="rounded-b-[8px] bg-[#2C2852] py-[36px]">
          <div className="flex max-h-[300px] flex-col items-center gap-10 overflow-scroll px-[25px] lg:px-[128px]">
            <div className="flex w-full flex-col gap-6">
              <div className="flex w-full justify-between">
                <h3 className="w-1/3 text-[16px] font-normal">Users</h3>
                <h3 className="text-[16px] font-semibold">152,678</h3>
              </div>
              <div className="flex w-full justify-between">
                <h3 className="w-1/3 text-[16px] font-normal">Bets</h3>
                <h3 className="text-[16px] font-semibold">152,678</h3>
              </div>
              <div className="flex w-full justify-between">
                <h3 className="w-1/3 text-[16px] font-normal">Bankroll</h3>
                <h3 className="text-[16px] font-semibold">152,678</h3>
              </div>
              <div className="flex w-full justify-between">
                <h3 className="w-1/3 text-[16px] font-normal">Wagered</h3>
                <h3 className="text-[16px] font-normal text-[#9688CC]">100%</h3>
                <h3 className="text-[16px] font-semibold">152,678</h3>
              </div>
              <div className="flex w-full justify-between">
                <h3 className="w-1/3 text-[16px] font-normal">
                  Wagered (V2 Only)
                </h3>
                <h3 className="text-[16px] font-normal text-[#9688CC]">100%</h3>
                <h3 className="text-[16px] font-semibold">152,678</h3>
              </div>
              <div className="flex w-full justify-between">
                <h3 className="w-1/3 text-[16px] font-normal">
                  Return to Player (V2 Only){' '}
                </h3>
                <h3 className="text-[16px] font-normal text-[#9688CC]">100%</h3>
                <h3 className="text-[16px] font-semibold">152,678</h3>
              </div>
              <div className="flex w-full justify-between">
                <h3 className="w-1/3 text-[16px] font-normal">
                  Investor's profit
                </h3>
                <h3 className="text-[16px] font-normal text-[#9688CC]">100%</h3>
                <h3 className="text-[16px] font-semibold">152,678</h3>
              </div>
              <div className="flex w-full justify-between">
                <h3 className="w-1/3 text-[16px] font-normal">
                  Investor's all-time high profit
                </h3>
                <h3 className="text-[16px] font-normal text-[#9688CC]">100%</h3>
                <h3 className="text-[16px] font-semibold">152,678</h3>
              </div>
              <div className="flex w-full justify-between">
                <h3 className="w-1/3 text-[16px] font-normal">Commission</h3>
                <h3 className="text-[16px] font-normal text-[#9688CC]">100%</h3>
                <h3 className="text-[16px] font-semibold">152,678</h3>
              </div>
            </div>
            <div className="text-[16px] font-normal">
              Interested in participating in the bankroll? Click{' '}
              <a href="" className="text-[#9945FF]">
                here
              </a>{' '}
              to invest!
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
