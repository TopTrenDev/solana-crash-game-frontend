import { ScrollArea } from '@/components/ui/scroll-area';
import { useEffect, useRef, useState } from 'react';
import { Socket, io } from 'socket.io-client';
import { BetType, FormattedPlayerBetType, ICrashHistoryRecord } from '@/types';
import {
  ECrashSocketEvent,
  ICrashClientToServerEvents,
  ICrashServerToClientEvents,
  ITick
} from '@/types/crash';
import { ECrashStatus } from '@/constants/status';
import { getAccessToken } from '@/utils/axios';
import useToast from '@/hooks/use-toast';
import { tokens, IToken, betMode, displayMode } from '@/constants/data';
import Header from '@/pages/layout/header';
import GraphicDisplay from '@/section/games/crash/graphic-display';
import BetBoard from './bet-board';
import BetAction from './bet-action';
import BetDisplay from './bet-display';

export default function CrashGameSection() {
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  const crashBgVideoPlayer = useRef<HTMLVideoElement>(null);

  const toast = useToast();
  const [selectMode, setSelectMode] = useState<string>(betMode[0]);
  const [selectDisplay, setSelectDisplay] = useState<string>(displayMode[0]);
  const [selectedToken, setSelectedToken] = useState<IToken>(tokens[0]);
  const [betData, setBetData] = useState<BetType[]>([]);
  const [betAmount, setBetAmount] = useState<number>(0);
  const [autoCashoutPoint, setAutoCashoutPoint] = useState<number>(1.05);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [betCashout, setBetCashout] = useState<BetType[]>([]);
  const [avaliableBet, setAvaliableBet] = useState<boolean>(false);
  const [autoBet, setAutoBet] = useState<boolean>(true);
  const [autoCashoutAmount, setAutoCashoutAmount] = useState<number>(1);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [avaliableAutoCashout, setAvaliableAutoCashout] =
    useState<boolean>(false);

  const [crTick, setCrTick] = useState<ITick>({ prev: 1, cur: 1 });
  const [crBust, setCrBust] = useState<number>(1);
  const [prepareTime, setPrepareTime] = useState<number>(0);
  const [crashStatus, setCrashStatus] = useState<ECrashStatus>(
    ECrashStatus.NONE
  );
  const [downIntervalId, setDownIntervalId] = useState(0);
  const [crashHistoryRecords, setCrashHistoryRecords] = useState<
    ICrashHistoryRecord[]
  >([]);

  const [liveChatOpen, setLiveChatOpen] = useState<boolean>(false);

  const updatePrepareCountDown = () => {
    setPrepareTime((prev) => prev - 100);
  };

  const playCrashBgVideo = () => {
    crashBgVideoPlayer?.current?.play();
  };

  const stopCrashBgVideo = () => {
    crashBgVideoPlayer?.current?.pause();
  };

  useEffect(() => {
    if (socket) {
      socket.emit('auth', getAccessToken());
    }
  }, [getAccessToken()]);

  useEffect(() => {
    const handleJoinSuccess = (data) => {
      toast.success(data);
      if (data === 'Autobet has been canceled.') {
        setAutoBet(true);
      } else {
        setAutoBet(false);
      }
    };
    socket?.on('auto-crashgame-join-success', handleJoinSuccess);
    return () => {
      socket?.off('auto-crashgame-join-success', handleJoinSuccess);
    };
  }, [socket, toast]);

  useEffect(() => {
    const crashSocket: Socket<
      ICrashServerToClientEvents,
      ICrashClientToServerEvents
    > = io(`${SERVER_URL}/crash`);

    crashSocket.emit(ECrashSocketEvent.PREVIOUS_CRASHGAME_HISTORY, 15 as any);

    crashSocket.on(
      ECrashSocketEvent.PREVIOUS_CRASHGAME_HISTORY_RESPONSE,
      (historyData: any) => {
        console.log('history', historyData);
        historyData.map((h) => {
          setCrashHistoryRecords((prev) => [
            ...prev,
            {
              bust: h.crashPoint / 100,
              payout: 0,
              bet: 0,
              profit: 0,
              hash: h.privateHash!
            }
          ]);
        });
      }
    );

    crashSocket.on(ECrashSocketEvent.GAME_TICK, (tick) => {
      setCrashStatus(ECrashStatus.PROGRESS);
      setCrTick((prev) => ({
        prev: prev.cur,
        cur: tick
      }));
    });

    crashSocket.on(ECrashSocketEvent.GAME_STARTING, (data) => {
      setCrashStatus(ECrashStatus.PREPARE);
      setPrepareTime(data.timeUntilStart ?? 0);
      stopCrashBgVideo();
      setBetData([]);
      setBetCashout([]);
      setTotalAmount(0);
    });

    crashSocket.on(ECrashSocketEvent.GAME_START, (data) => {
      setCrashStatus(ECrashStatus.PROGRESS);
      setCrTick({ prev: 1, cur: 1 });
      playCrashBgVideo();
    });

    crashSocket.on(ECrashSocketEvent.GAME_END, (data) => {
      setCrashHistoryRecords((prev) => [
        {
          bust: data.game.crashPoint!,
          payout: 0,
          bet: 0,
          profit: 0,
          hash: data.game.privateHash!
        },
        ...prev
      ]);
      setCrBust(data.game.crashPoint!);
      setCrashStatus(ECrashStatus.END);
      stopCrashBgVideo();
      setAvaliableBet(false);
    });

    const calculateTotals = (bets) => {
      let totals = 0;
      bets.forEach((bet) => {
        totals += bet.betAmount;
      });
      return totals;
    };

    crashSocket.on(ECrashSocketEvent.GAME_STATUS, (data) => {
      setBetData(data.players);
      const totals = calculateTotals(data.players);
      setTotalAmount((prev) => prev + totals);
    });

    crashSocket.on(
      ECrashSocketEvent.GAME_BETS,
      (bets: FormattedPlayerBetType[]) => {
        setBetData((prev: BetType[]) => [...bets, ...prev]);
        const totals = calculateTotals(bets);
        setTotalAmount((prev) => prev + totals);
      }
    );

    crashSocket.on(ECrashSocketEvent.GAME_JOIN_ERROR, (data) => {
      toast.error(data);
      setAutoBet(true);
    });

    crashSocket.on(ECrashSocketEvent.CRASHGAME_JOIN_SUCCESS, () => {
      setAvaliableBet(true);
    });

    crashSocket.on(ECrashSocketEvent.BET_CASHOUT, (data) => {
      setBetCashout((prev) => [...prev, data?.userdata]);
    });

    crashSocket.emit('auth', getAccessToken());

    setSocket(crashSocket);
    return () => {
      crashSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (crashStatus === ECrashStatus.PREPARE) {
      const intervalId = window.setInterval(updatePrepareCountDown, 100);
      setDownIntervalId(intervalId);
    } else {
      clearInterval(downIntervalId);
    }
  }, [crashStatus]);

  return (
    <ScrollArea className="h-full">
      <div className="flex h-screen flex-col items-stretch">
        <div className="relative z-10 flex h-16 flex-shrink-0 shadow">
          {/* <button
            className="h-full bg-dark bg-opacity-30 px-4 text-gray-300 bg-blend-multiply focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 xl:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <MenuIcon className="h-6 w-6" aria-hidden="true" />\
          </button> */}
          <Header isApp={true} />
        </div>
        <div className="flex h-full w-full px-[80px] py-[44px]">
          <div className="flex h-full w-3/4 flex-col justify-between gap-6">
            <div className="flex h-1/2 w-full">
              <div className="m-[5px] flex h-full w-1/3 flex-col justify-between rounded-lg bg-[#463E7A]">
                <BetAction
                  selectMode={selectMode}
                  setSelectMode={setSelectMode}
                  selectedToken={selectedToken}
                  setSelectedToken={setSelectedToken}
                  betAmount={betAmount}
                  setBetAmount={setBetAmount}
                  autoBet={autoBet}
                  setAutoBet={setAutoBet}
                  crashStatus={crashStatus}
                  setCrashStatus={setCrashStatus}
                  avaliableBet={avaliableBet}
                  setAvaliableBet={setAvaliableBet}
                  autoCashoutPoint={autoCashoutPoint}
                  setAutoCashoutPoint={setAutoCashoutPoint}
                  autoCashoutAmount={autoCashoutAmount}
                  setAutoCashoutAmount={setAutoCashoutAmount}
                  avaliableAutoCashout={avaliableAutoCashout}
                  setAvaliableAutoCashout={setAvaliableAutoCashout}
                  socket={socket!}
                />
              </div>
              <div className="relative m-[5px] h-full w-2/3 rounded-md">
                <GraphicDisplay
                  crashStatus={crashStatus}
                  crTick={crTick}
                  crBust={crBust}
                  prepareTime={prepareTime}
                  crashHistoryRecords={crashHistoryRecords}
                />
              </div>
            </div>
            <div className="flex h-1/2 w-full">
              <BetDisplay
                selectDisplay={selectDisplay}
                setSelectDisplay={setSelectDisplay}
                liveChatOpen={liveChatOpen}
                setLiveChatOpen={setLiveChatOpen}
                crashHistoryRecords={crashHistoryRecords}
              />
            </div>
          </div>
          <div className="flex h-full w-1/4 flex-col p-[5px]">
            <BetBoard
              betData={betData}
              betCashout={betCashout}
              totalAmount={totalAmount}
              crashStatus={crashStatus}
            />
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
