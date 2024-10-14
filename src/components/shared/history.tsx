import { Card, CardContent, CardHeader } from '../ui/card';
import { Table, TableBody, TableCell, TableRow } from '../ui/table';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import useModal from '@/hooks/use-modal';
import { ModalType } from '@/types/modal';
import { useGame } from '@/contexts';

export default function History() {
  const modal = useModal();
  const { gameHistories, setGameId } = useGame();

  const openHistoryModal = (gameId: number) => {
    modal.open(ModalType.HISTORY);
    setGameId(gameId);
  };

  return (
    <Card className="m-2 w-full rounded-lg border-none bg-[#463E7A] text-white shadow-none">
      <CardHeader className="flex flex-row items-center justify-between rounded-t-lg bg-[#191939] p-0 py-[12px] text-base font-semibold">
        <Table className="w-full table-fixed">
          <TableBody>
            <TableRow className="!bg-transparent">
              <TableCell className="w-1/5 p-0 text-center">Crash</TableCell>
              <TableCell className="w-1/5 p-0 text-center">@</TableCell>
              <TableCell className="w-1/5 p-0 text-center">Bet</TableCell>
              <TableCell className="w-1/5 p-0 text-center">Profit</TableCell>
              <TableCell className="w-1/5 p-0 text-center">Hash</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardHeader>
      <CardContent className="rounded-b-lg bg-[#2C2852] px-2 py-0">
        <ScrollArea className="max-h-60 min-h-10 overflow-scroll p-0">
          <Table className="relative max-h-[250px] table-fixed border-separate border-spacing-y-3 overflow-y-scroll">
            <TableBody className="h-full overflow-y-scroll">
              {gameHistories.map((history, index) => (
                <TableRow
                  key={index}
                  className="cursor-pointer text-[#fff]"
                  onClick={() => openHistoryModal(index)}
                >
                  <TableCell
                    className={`w-1/5 text-center ${history.crashPoint > 170 ? 'text-[#14F195]' : 'text-[#E83035]'}`}
                  >
                    {(history.crashPoint / 100).toFixed(2)}x
                  </TableCell>
                  <TableCell className="w-1/5 text-center">-</TableCell>
                  <TableCell className="w-1/5 text-center">-</TableCell>
                  <TableCell className="w-1/5 text-center">-</TableCell>
                  <TableCell className="w-1/5 text-center">
                    {history.privateHash}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
