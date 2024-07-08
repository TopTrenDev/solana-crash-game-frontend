import { useEffect, useState } from 'react';
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
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { leaderboardActions } from '@/store/redux/actions';

export default function LeaderboardModal() {
  const dispatch = useAppDispatch();
  const { open, type } = useAppSelector((state: any) => state.modal);
  const leaderboardState = useAppSelector((state: any) => state.leaderboard);
  const isOpen = open && type === ModalType.LEADERBOARD;
  const modal = useModal();
  const [loading, setLoading] = useState<boolean>(true);

  const hanndleOpenChange = async () => {
    if (isOpen) {
      modal.close(ModalType.LEADERBOARD);
    }
  };

  useEffect(() => {
    if (leaderboardState.leaderboardHistory) {
      setLoading(false);
    }
    dispatch(leaderboardActions.subscribeLeaderboardServer());
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={hanndleOpenChange}>
      <DialogContent className="gap-0 rounded-[8px] border-2 border-none bg-[#0D0B32] p-0 text-white sm:max-w-sm lg:w-[800px] lg:!max-w-[800px]">
        <DialogHeader className="flex flex-row items-center justify-between rounded-t-[8px] bg-[#463E7A] px-[24px] py-[20px]">
          <DialogTitle className="text-center text-[24px] font-semibold uppercase">
            Leaderboard
          </DialogTitle>
          <DialogClose className="hover:ropacity-100 !my-0 rounded-sm opacity-70 outline-none ring-offset-background transition-opacity focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:text-muted-foreground">
            <Cross2Icon className="h-7 w-7 text-white" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        <div className="flex flex-col items-center gap-10 rounded-b-[8px] bg-[#2C2852] px-[20px] py-[36px]">
          <div className="flex w-full justify-between">
            <h2 className="">All-Time Leaderboard</h2>
          </div>
          <Card className="m-2 rounded-lg border-none bg-[#463E7A] text-white shadow-none">
            <CardHeader className="flex flex-row items-center justify-between rounded-t-lg border-b border-b-[#000] bg-[#191939] px-0 py-2 text-base font-semibold">
              <Table className="w-full table-fixed">
                <TableBody>
                  <TableRow className="!bg-transparent">
                    <TableCell className="w-6/12 text-start">User</TableCell>
                    <TableCell className="w-1/6">Wagered</TableCell>
                    <TableCell className="w-1/6 text-center">Profit</TableCell>
                    <TableCell className="w-1/6 text-center">Bet</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardHeader>
            <CardContent className="bg-[#2C2852] px-0 py-0">
              <ScrollArea className="px-0 py-0 lg:h-[295px]">
                <Table className="relative table-fixed border-separate border-spacing-y-0 overflow-y-hidden ">
                  <TableBody>
                    {leaderboardState?.leaderboardHistory?.crash?.map(
                      (player, index) => (
                        <TableRow
                          key={index}
                          className="text-gray300 [&_td:first-child]:rounded-l-md [&_td:first-child]:border-l [&_td:first-child]:border-l-purple-0.5 [&_td:last-child]:rounded-r-md [&_td:last-child]:border-r [&_td:last-child]:border-r-purple-0.5 [&_td]:border-b [&_td]:border-t [&_td]:border-b-purple-0.5 [&_td]:border-t-purple-0.5 [&_td]:bg-dark-blue"
                        >
                          <TableCell className="w-1/2">
                            <div className="flex items-center gap-2">
                              <span>{player.username}</span>
                            </div>
                          </TableCell>
                          <TableCell className="w-1/6 text-center">
                            <div className="flex items-center gap-2">
                              <span>
                                {player.leaderboard?.crash?.betAmount}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="w-1/6 text-center">
                            <div className="flex items-center gap-2">
                              <span>
                                {player.leaderboard?.crash?.winAmount}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="w-1/6 text-center">
                            <div className="flex items-center gap-2">
                              <span>
                                {(() => {
                                  const winAmount =
                                    (player.leaderboard?.crash?.winAmount ??
                                      0) +
                                    (player.leaderboard?.crash?.winAmount ?? 0);

                                  const betAmount =
                                    (player.leaderboard?.crash?.betAmount ??
                                      0) +
                                    (player.leaderboard?.crash?.betAmount ?? 0);

                                  const profit = (
                                    winAmount - betAmount
                                  ).toFixed(2);
                                  return (
                                    <span
                                      className={
                                        Number(profit) >= 0
                                          ? 'text-white'
                                          : 'text-purple'
                                      }
                                    >
                                      {profit}
                                    </span>
                                  );
                                })()}
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
