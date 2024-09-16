import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import { ModalType } from '@/types/modal';
import useModal from '@/hooks/use-modal';
import { useAppDispatch, useAppSelector } from '@/store/redux';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';
import { leaderboardActions } from '@/store/redux/actions';
import LoadingIcon from '../loading-icon';

export default function StatsModal() {
  const modal = useModal();
  const dispatch = useAppDispatch();
  const { open, type } = useAppSelector((state: any) => state.modal);
  const isOpen = open && type === ModalType.STATS;
  const leaderboardState = useAppSelector((state: any) => state.leaderboard);
  const [loading, setLoading] = useState<boolean>(true);

  const hanndleOpenChange = async () => {
    if (isOpen) {
      modal.close(ModalType.STATS);
    }
  };

  useEffect(() => {
    if (leaderboardState?.stats) {
      setLoading(false);
    } else dispatch(leaderboardActions.subscribeLeaderboardServer());
  }, [leaderboardState]);

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
          {loading ? (
            <div className="flex w-full justify-center">
              <LoadingIcon />
            </div>
          ) : (
            <div className="flex max-h-[300px] flex-col items-center gap-10 overflow-scroll px-[25px] lg:px-[128px]">
              <div className="flex w-full flex-col gap-6">
                <div className="flex w-full justify-between">
                  <h3 className="w-1/3 text-[16px] font-normal">Users</h3>
                  <h3 className="text-[16px] font-semibold">
                    {(
                      leaderboardState?.stats?.totalUsers || 0
                    ).toLocaleString()}
                  </h3>
                </div>
                <div className="flex w-full justify-between">
                  <h3 className="w-1/3 text-[16px] font-normal">Bankroll</h3>
                  <h3 className="text-[16px] font-semibold">
                    {(leaderboardState?.stats?.bankroll || 0).toLocaleString()}{' '}
                    SOL
                  </h3>
                </div>
                <div className="flex w-full justify-between">
                  <h3 className="w-1/3 text-[16px] font-normal">Wagered</h3>
                  <h3 className="text-[16px] font-normal text-[#9688CC]">
                    100%
                  </h3>
                  <h3 className="text-[16px] font-semibold">
                    {(
                      leaderboardState?.stats?.totalWageredAmount || 0
                    ).toLocaleString()}{' '}
                    SOLA
                  </h3>
                </div>
              </div>
              {/* <div className="text-[16px] font-normal">
              Interested in participating in the bankroll? Click{' '}
              <a href="" className="text-[#9945FF]">
                here
              </a>{' '}
              to invest!
            </div> */}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
