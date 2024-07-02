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
import { TITLE } from '@/config';

export default function BankrollModal() {
  const { open, type } = useAppSelector((state: any) => state.modal);
  const isOpen = open && type === ModalType.BANKROLL;
  const modal = useModal();

  const hanndleOpenChange = async () => {
    if (isOpen) {
      modal.close(ModalType.BANKROLL);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={hanndleOpenChange}>
      <DialogContent className="w-full gap-0 rounded-[8px] border-2 border-none bg-[#0D0B32] p-0 text-white sm:max-w-sm lg:w-[800px] lg:!max-w-[800px]">
        <DialogHeader className="flex flex-row items-center justify-between rounded-t-[8px] bg-[#463E7A] px-[24px] py-[20px]">
          <DialogTitle className="text-center text-[24px] font-semibold uppercase">
            Bankroll
          </DialogTitle>
          <DialogClose className="hover:ropacity-100 !my-0 rounded-sm opacity-70 outline-none ring-offset-background transition-opacity focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:text-muted-foreground">
            <Cross2Icon className="h-7 w-7 text-white" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        <div className="flex flex-col items-center gap-10 rounded-b-[8px] bg-[#2C2852] px-[15px] py-[36px] lg:px-[128px]">
          <div className="flex w-full flex-col gap-6">
            <div className="flex w-full flex-col justify-between lg:flex-row">
              <h3 className="w-full text-[16px] font-normal text-gray-500 lg:w-1/3">
                {TITLE}'s bankroll:
              </h3>
              <h3 className="text-[16px] font-semibold">$841.47784094</h3>
            </div>
            <div className="flex w-full flex-col justify-between lg:flex-row">
              <h3 className="w-full text-[16px] font-normal text-gray-500 lg:w-1/3">
                Investor' total profit:
              </h3>
              <h3 className="text-[16px] font-semibold">$7,207.44493580</h3>
            </div>
            <div className="flex w-full flex-col justify-between lg:flex-row">
              <h3 className="w-full text-[16px] font-normal text-gray-500 lg:w-1/3">
                Commission rate:
              </h3>
              <h3 className="text-[16px] font-semibold">
                68.5% (zero for the next $8){' '}
              </h3>
            </div>
          </div>
          <div className="text-[16px] font-normal">
            <div className="text-center lg:flex-row">
              If you want to learn more about the bankroll, click
              <a href="" className="ml-2 cursor-pointer text-[#9945FF]">
                here
              </a>
              .
            </div>
            <div className="flex justify-center">
              <span className="mx-1 cursor-pointer text-[#9945FF]">Login</span>{' '}
              or{' '}
              <span className="mx-1 cursor-pointer text-[#9945FF]">
                Register
              </span>{' '}
              to invest.
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
