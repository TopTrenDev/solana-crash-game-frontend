import { Card, CardContent, CardHeader } from '../ui/card';
import { Table, TableBody, TableCell, TableRow } from '../ui/table';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import { ICrashHistoryRecord } from '@/types';
import useModal from '@/hooks/use-modal';
import useTempGame from '@/hooks/use-tempgame';
import { ModalType } from '@/types/modal';
import { useEffect } from 'react';

interface HistoryProps {
  crashHistoryRecords: ICrashHistoryRecord[];
}

export default function History({ crashHistoryRecords }: HistoryProps) {
  const modal = useModal();
  const game = useTempGame();

  useEffect(() => {
    console.log("creash history records => ", crashHistoryRecords)
  }, [])

  const openHistoryModal = (gameh: ICrashHistoryRecord) => {
    modal.open(ModalType.HISTORY)
    game.save(gameh)
  }

  return (
    <Card className="m-2 w-full rounded-lg border-none bg-[#463E7A] text-white shadow-none">
      <CardHeader className="flex flex-row items-center justify-between rounded-t-lg bg-[#191939] p-0 py-[12px] text-base font-semibold">
        <Table className="w-full table-fixed">
          <TableBody>
            <TableRow className="!bg-transparent">
              <TableCell className="w-1/5 p-0 text-center">Bust</TableCell>
              <TableCell className="w-1/5 p-0 text-center">@</TableCell>
              <TableCell className="w-1/5 p-0 text-center">Bet</TableCell>
              <TableCell className="w-1/5 p-0 text-center">Profit</TableCell>
              <TableCell className="w-1/5 p-0 text-center">Hash</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardHeader>
      <CardContent className="rounded-b-lg bg-[#2C2852] px-2 py-0">
        <ScrollArea className="max-h-60 min-h-10 p-0">
          <Table className="relative table-fixed border-separate border-spacing-y-3 overflow-y-auto max-h-[250px]">
            <TableBody>
              {crashHistoryRecords.map((history, index) => (
                <TableRow key={index} className="text-[#fff] cursor-pointer" onClick={() => openHistoryModal(history)}>
                  <TableCell
                    className={`w-1/5 text-center ${history.bust > 1.7 ? 'text-[#14F195]' : 'text-[#E83035]'}`}
                  >
                    {history.bust}x
                  </TableCell>
                  <TableCell className="w-1/5 text-center">-</TableCell>
                  <TableCell className="w-1/5 text-center">-</TableCell>
                  <TableCell className="w-1/5 text-center">-</TableCell>
                  <TableCell className="w-1/5 text-center">
                    {history.hash}
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
