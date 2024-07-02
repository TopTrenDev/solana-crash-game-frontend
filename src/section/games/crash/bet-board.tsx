import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { ECrashStatus } from '@/constants/status';
import { BetType } from '@/types';
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
  return (
    <div
      className={`flex h-full w-full flex-col rounded-lg bg-[#463E7A] ${className}`}
    >
      <div className="hidden w-full flex-row items-center justify-center lg:flex">
        <Button
          className={cn(
            'min-h-full w-1/2 rounded-lg rounded-tr-lg bg-[#463E7A] p-6 font-semibold text-white shadow-none hover:bg-transparent'
          )}
        >
          Bet board
        </Button>
      </div>
      <Card className="m-2 overflow-hidden rounded-lg border-none bg-[#463E7A] text-white shadow-none">
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
          <ScrollArea className="h-full p-0">
            <Table className="relative table-fixed border-separate border-spacing-y-3 overflow-y-hidden">
              <TableBody>
                {betData
                  ?.sort((a, b) => b.betAmount - a.betAmount)
                  .map((player, index) => (
                    <TableRow
                      key={index}
                      className="px-2 text-gray300 hover:bg-transparent"
                    >
                      <TableCell className="w-2/5">
                        <div className="flex items-center gap-2">
                          <span className="text-[#14F195]">
                            {player.username}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="w-1/5 text-center">
                        {(betCashout?.find(
                          (item) => item.playerID === player.playerID
                        )?.stoppedAt &&
                          (
                            (betCashout?.find(
                              (item) => item.playerID === player.playerID
                            )?.stoppedAt ?? 0) / 100
                          ).toFixed(2) + 'x') ||
                          (crashStatus === ECrashStatus.END ? (
                            <span className="text-purple">failed</span>
                          ) : (
                            <span>betting</span>
                          ))}
                      </TableCell>
                      <TableCell className="w-1/5 text-center">
                        <div className="flex w-full flex-row items-center justify-center gap-1 text-center">
                          {player.betAmount}
                        </div>
                      </TableCell>
                      <TableCell className="w-1/5 text-center">
                        {betCashout?.find(
                          (item) => item.playerID === player.playerID
                        )?.stoppedAt ? (
                          <div className="flex flex-row items-center justify-center gap-1 text-[#14F195]">
                            {(
                              ((betCashout?.find(
                                (item) => item.playerID === player.playerID
                              )?.stoppedAt ?? 0) /
                                100) *
                              player.betAmount
                            ).toFixed(2)}
                          </div>
                        ) : crashStatus === ECrashStatus.END ? (
                          <span className="text-purple">failed</span>
                        ) : (
                          <span>betting</span>
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
