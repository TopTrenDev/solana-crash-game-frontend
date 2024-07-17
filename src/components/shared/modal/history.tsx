import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import { ModalType } from '@/types/modal';
import useModal from '@/hooks/use-modal';
import useTempGame from '@/hooks/use-tempgame';
import { useAppSelector } from '@/store/redux';
import { Cross2Icon } from '@radix-ui/react-icons';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { SiNintendogamecube } from "react-icons/si";
import { useEffect, useState } from 'react';

interface Player {
  name: string,
  bet: number,
  cashout: number,
  profit: number,
  betNum: number
}

const Players: Player[] = [
  {
    name: "Muneshwara",
    bet: 2,
    cashout: 9.51,
    profit: 17.02,
    betNum: 1478352168
  },
  {
    name: "Muneshwara",
    bet: 2,
    cashout: 9.51,
    profit: 17.02,
    betNum: 1478352168
  },
  {
    name: "Muneshwara",
    bet: 2,
    cashout: 9.51,
    profit: 17.02,
    betNum: 1478352168
  },
  {
    name: "Muneshwara",
    bet: 2,
    cashout: 9.51,
    profit: 17.02,
    betNum: 1478352168
  }
]

export default function HistoryModal() {
  const { open, type } = useAppSelector((state: any) => state.modal);
  const { isGame, gameId } = useAppSelector((state: any) => state.tempgame);

  const isOpen = open && type === ModalType.HISTORY;
  const modal = useModal();
  const game = useTempGame();

  const [players, setPlayers] = useState<Player[]>(Players);

  const hanndleOpenChange = async () => {
    if (isOpen) {
      modal.close(ModalType.HISTORY);
      game.remove()
    }
  };

  const nextGame = (next: boolean) => {
    if (next) {
      game.save(gameId + 1)
    } else {
      game.save(gameId + 0)
    }
  }
  
  useEffect(() => {
    console.log("is game => ", isGame)
    if (isGame) {
      console.log("game id", gameId)
    }
  }, [isOpen])

  useEffect(() => {
    console.log("game id => ", gameId)
  }, [gameId])

  return (
    <Dialog open={isOpen} onOpenChange={hanndleOpenChange}>
      <DialogContent className="gap-0 rounded-[8px] border-2 border-none bg-[#0D0B32] p-0 text-white sm:max-w-sm lg:w-[800px] lg:!max-w-[800px]">
        <DialogHeader className="flex flex-row items-center justify-between rounded-t-[8px] bg-[#463E7A] px-[24px] py-[20px]">
          <DialogTitle className="text-center text-[24px] font-semibold uppercase">
            Game information
          </DialogTitle>
          <DialogClose className="hover:ropacity-100 !my-0 rounded-sm opacity-70 outline-none ring-offset-background transition-opacity focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:text-muted-foreground">
            <Cross2Icon className="h-7 w-7 text-white" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        <div className="rounded-b-[8px] bg-[#2C2852] py-[26px]">
          <div className="flex overflow-y-auto flex-col items-center gap-5 overflow-scroll px-[25px]">
            <div className='flex w-full justify-between'>
              <button className='flex items-center gap-2 p-2 border rounded-sm hover:bg-[#463E7A]' onClick={() => nextGame(false)}>
                <FaArrowLeft />
                Prev Game
              </button>
              <button className='flex items-center gap-2 p-2 border rounded-sm hover:bg-[#463E7A]' onClick={() => nextGame(true)}>
                Next Game
                <FaArrowRight />
              </button>
            </div>
            <div className='flex w-full items-center justify-between'>
              <div className='flex items-center gap-1 text-[20px]'>
                <SiNintendogamecube />
                Game #{10548701}
              </div>
              <div className='flex items-center gap-1'>
                <span className='uppercase'>Bsted At:</span>
                <span className='font-thin'>{10.24}x</span>
              </div>
            </div>
            <div className='flex w-full gap-1 items-center'>
              <span className='uppercase font-bold'>Date: </span>
              <span className='font-light'>Wed, 17 Jul 2024 10:11:38 GMT</span>
              <span className='text-sm font-thin'> 8 minutes ago</span>
            </div>
            {/* <div className='flex w-full gap-1 items-center'>
              <span className='uppercase font-bold'>Hash: </span>
              <span className='font-light'>Wed, 17 Jul 2024 10:11:38 GMT</span>
              <span className='text-sm font-thin'> 8 minutes ago</span>
            </div> */}
            <div className='w-full px-3 py-2 rounded-sm text-white text-sm font-thin border'>
              {gameId}
            </div>
            <div className='w-full pb-4'>
              <div className='py-4 text-2xl'>Players</div>
              <table className='w-full'>
                <thead className='w-full'>
                  <tr className='w-full p-2 bg-[#463E7A]'>
                    <td className='w-1/5 p-1 px-2'>Player</td>
                    <td className='w-1/5 p-1 px-2'>Bet</td>
                    <td className='w-1/5 p-1 px-2'>Cashed out</td>
                    <td className='w-1/5 p-1 px-2'>Profit</td>
                    <td className='w-1/5 p-1 px-2 text-center'>###</td>
                  </tr>
                </thead>
                <tbody>
                  {
                    players.map((player, index: number) => {
                      return (
                        <tr key={index} className='hover:bg-[#5e568b]'>
                          <td className='w-1/5 p-1 px-2 cursor-pointer'>{player.name}</td>
                          <td className='w-1/5 p-1 px-2'>{player.bet}</td>
                          <td className='w-1/5 p-1 px-2'>{player.cashout} <span className='font-light'>x</span></td>
                          <td className='w-1/5 p-1 px-2'>{player.profit}</td>
                          <td className='w-1/5 p-1 px-2 text-center cursor-pointer'>Bet #{player.betNum}</td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
