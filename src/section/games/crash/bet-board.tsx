import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { ECrashStatus } from '@/constants/status';
import useModal from '@/hooks/use-modal';
import { useAppSelector } from '@/store/redux';
import { BetType } from '@/types';
import { ModalType } from '@/types/modal';
import { cn } from '@/utils/utils';

interface BetBoardProps {
  betData: BetType[];
  betCashout: BetType[];
  totalAmount: any;
  crashStatus: ECrashStatus;
  className?: string;
}

export default function BetBoard({
  betData,
  betCashout,
  totalAmount,
  crashStatus,
  className
}: BetBoardProps) {
  const userData = useAppSelector((store: any) => store.user.userData);

  const modal = useModal();

  const openModal = (userId: string) => {
    // modal.open(ModalType.USERINFO)
    // tempuser.save(userId)
  };

  return (
    <div
      className={`flex h-full w-full flex-col overflow-auto rounded-lg bg-[#463E7A] ${className}`}
    >
      <Card className="m-2 h-full overflow-hidden rounded-lg border-none bg-[#463E7A] text-white shadow-none">
        <CardHeader className="flex flex-row items-center justify-between rounded-t-lg border-b border-b-[#000] bg-[#191939] p-0 text-base font-semibold">
          <Table className="w-full table-fixed">
            <TableBody>
              <TableRow className="!bg-transparent px-2 uppercase">
                <TableCell className="w-2/5 text-center">User</TableCell>
                <TableCell className="w-1/5 text-center">@</TableCell>
                <TableCell className="w-1/5 text-center">Bet</TableCell>
                <TableCell className="w-1/5 text-center">Profit</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardHeader>
        <CardContent className="h-full overflow-hidden bg-[#2C2852] p-0">
          <ScrollArea className="h-full min-h-10 p-0">
            <Table className="relative table-fixed border-separate border-spacing-y-3 overflow-y-hidden">
              <TableBody>
                {betData
                  ?.sort((a, b) => b.betAmount - a.betAmount)
                  .map((player, index) => (
                    <TableRow
                      key={index}
                      className={`px-2 text-gray300 hover:bg-transparent ${userData?.username === player.username ? 'bg-[#7b3db6] hover:bg-[#7b3db6]' : ''} `}
                    >
                      <TableCell className="w-2/5">
                        <div
                          className="flex cursor-pointer items-center gap-2"
                          onClick={() => openModal(player.playerID)}
                        >
                          <span
                            className={`${
                              player.status === 2
                                ? 'text-[#14F195]'
                                : crashStatus === ECrashStatus.END
                                  ? 'text-purple'
                                  : 'text-gray300'
                            }
                        `}
                          >
                            {player.username}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="w-1/5 text-center text-[#fff]">
                        {player.status === 2 ? (
                          ((player?.stoppedAt ?? 0) / 100).toFixed(2) + 'x'
                        ) : crashStatus === ECrashStatus.END ? (
                          <span className="text-purple">failed</span>
                        ) : (
                          <span className="text-gray300">-</span>
                        )}
                      </TableCell>
                      <TableCell className="w-1/5 text-center">
                        <div className="flex w-full flex-row items-center justify-center gap-1 text-center">
                          {player.betAmount}
                        </div>
                      </TableCell>
                      <TableCell className="w-1/5 text-center">
                        {player.status === 2 ? (
                          <div className="flex flex-row items-center justify-center gap-1 text-[#14F195]">
                            {(
                              ((betCashout?.find(
                                (item) => item.playerID === player.playerID
                              )?.stoppedAt ?? 0) /
                                100 -
                                1) *
                              player.betAmount
                            ).toFixed(2)}
                          </div>
                        ) : crashStatus === ECrashStatus.END ? (
                          <span className="text-purple">failed</span>
                        ) : (
                          <span>-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardContent>
      </Card>
      <div className="flex w-full justify-between text-[12px] text-[#EEAF0E]">
        <span className="px-[18px] pb-[4px] pt-[12px]">
          Online: {betData.length}
        </span>
        <span className="px-[18px] pb-[4px] pt-[12px]">
          Playing: {betData.length}
        </span>
        <span className="px-[18px] pb-[4px] pt-[12px]">
          Betting: {totalAmount.toFixed(3) ?? '0.000'} sola
        </span>
      </div>
    </div>
  );
}
