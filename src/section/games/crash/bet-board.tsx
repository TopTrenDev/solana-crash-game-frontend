import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { boardMode } from '@/constants/data';
import { ECrashStatus } from '@/constants/status';
import { BetType } from '@/types';
import { cn } from '@/utils/utils';

interface BetBoardProps {
  betData: BetType[];
  betCashout: BetType[];
  totalAmount: any;
  crashStatus: ECrashStatus;
  selectBoard: string;
  setSelectBoard: React.Dispatch<React.SetStateAction<string>>;
}

export default function BetBoard({
  betData,
  betCashout,
  totalAmount,
  crashStatus,
  selectBoard,
  setSelectBoard
}: BetBoardProps) {
  return (
    <div className="flex h-full w-full flex-col rounded-lg bg-[#463E7A]">
      <div className="flex w-full flex-row items-center">
        {boardMode.map((item, index) => (
          <Button
            className={cn(
              'min-h-full w-1/2 rounded-tr-lg border-none bg-[#191939] p-6 font-semibold text-[#9688CC] shadow-none hover:bg-[#191939] hover:text-white',
              selectBoard === item &&
                'rounded-lg border-none bg-[#463E7A] text-white hover:bg-[#463E7A]'
            )}
            key={index}
            onClick={() => setSelectBoard(item)}
          >
            {item}
          </Button>
        ))}
      </div>
      <Card className="m-2 rounded-lg border-none bg-[#463E7A] text-white shadow-none">
        <CardHeader className="flex flex-row items-center justify-between rounded-t-lg border-b border-b-[#000] bg-[#191939] px-7 py-2 text-base font-semibold">
          <Table className="w-full table-fixed">
            <TableBody>
              <TableRow className="!bg-transparent">
                <TableCell className="w-6/12 text-start">User</TableCell>
                <TableCell className="w-1/6">@</TableCell>
                <TableCell className="w-1/6 text-center">Bet</TableCell>
                <TableCell className="w-1/6 text-center">Profit</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardHeader>
        <CardContent className="bg-[#2C2852] px-2 py-0">
          <ScrollArea className="px-5 py-3 lg:h-[295px]">
            <Table className="relative table-fixed border-separate border-spacing-y-3 overflow-y-hidden ">
              <TableBody>
                {betData
                  ?.sort((a, b) => b.betAmount - a.betAmount)
                  .map((player, index) => (
                    <TableRow
                      key={index}
                      className="text-gray300 [&_td:first-child]:rounded-l-md [&_td:first-child]:border-l [&_td:first-child]:border-l-purple-0.5 [&_td:last-child]:rounded-r-md [&_td:last-child]:border-r [&_td:last-child]:border-r-purple-0.5 [&_td]:border-b [&_td]:border-t [&_td]:border-b-purple-0.5 [&_td]:border-t-purple-0.5 [&_td]:bg-dark-blue"
                    >
                      <TableCell className="w-1/2">
                        <div className="flex items-center gap-2">
                          <img
                            src="/assets/icons/avatar.png"
                            alt="User"
                            className="h-6 w-6 rounded-full"
                          />
                          <span>{player.username}</span>
                        </div>
                      </TableCell>
                      <TableCell className="w-1/6 text-center">
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
                      <TableCell className="w-1/6 text-center">
                        <div className="flex w-full flex-row items-center justify-center gap-1 text-center">
                          <img
                            src={`/assets/tokens/${player.denom}.png`}
                            alt="Multiplier"
                            className="h-4 w-4"
                          />
                          {player.betAmount}
                        </div>
                      </TableCell>
                      <TableCell className="w-1/6 text-center">
                        {betCashout?.find(
                          (item) => item.playerID === player.playerID
                        )?.stoppedAt ? (
                          <div className="flex flex-row items-center justify-center gap-1">
                            <img
                              src={`/assets/tokens/${betCashout.find((item) => item.playerID === player.playerID)?.denom}.png`}
                              alt="Multiplier"
                              className="h-4 w-4"
                            />
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
          Playing: {totalAmount?.usk.toFixed(3) ?? '0.000'}
        </span>
        <span className="px-[18px] pb-[4px] pt-[12px]">
          Betting: {totalAmount?.usk.toFixed(3) ?? '0.000'} bits
        </span>
      </div>
    </div>
  );
}
