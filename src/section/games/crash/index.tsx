import { ScrollArea } from '@/components/ui/scroll-area';
import { useEffect, useRef, useState } from 'react';
import { Socket, io } from 'socket.io-client';
import customParser from 'socket.io-msgpack-parser';
import { BetType, FormattedPlayerBetType } from '@/types';
import {
  ECrashSocketEvent,
  ICrashClientToServerEvents,
  ICrashServerToClientEvents,
  ITick
} from '@/types/crash';
import { ECrashStatus } from '@/constants/status';
import { getAccessToken } from '@/utils/axios';
import useToast from '@/hooks/use-toast';
import { tokens, IToken, betMode } from '@/constants/data';
import GraphicDisplay from '@/section/games/crash/graphic-display';
import BetBoard from './bet-board';
import BetAction from './bet-action';
import BetDisplay from './bet-display';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/store/redux';
import { userActions } from '@/store/redux/actions';
import { useGame } from '@/contexts';
import Graphic from './graphic';

export default function CrashGameSection() {
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  const crashBgVideoPlayer = useRef<HTMLVideoElement>(null);
  const dispatch = useDispatch();
  const { setGameHistories } = useGame();
  const userData = useAppSelector((store: any) => store.user.userData);

  const toast = useToast();
  const [selectMode, setSelectMode] = useState<string>(betMode[0]);
  const [autoBet, setAutoBet] = useState<boolean>(true);
  const [isBetted, setIsBetted] = useState<boolean>(false);
  const [availableFirstBet, setAvailableFirstBet] = useState<boolean>(false);
  const [selectDisplay, setSelectDisplay] = useState<number>(1);
  const [selectedToken, setSelectedToken] = useState<IToken>(tokens[0]);
  const [betData, setBetData] = useState<BetType[]>([]);
  const [betAmount, setBetAmount] = useState<number>(10);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [betCashout, setBetCashout] = useState<BetType[]>([]);
  const [availableBet, setAvailableBet] = useState<boolean>(false);
  const [autoCashoutAmount, setAutoCashoutAmount] = useState<number>(1);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [avaliableAutoCashout, setAvaliableAutoCashout] =
    useState<boolean>(false);

  const [crTick, setCrTick] = useState<ITick>({
    prev: 1,
    cur: 1.01
  });
  const [crElapsed, setCrElapsed] = useState<number>(0);
  const [crBust, setCrBust] = useState<number>(100);
  const [prepareTime, setPrepareTime] = useState<number>(0);
  const [crashStatus, setCrashStatus] = useState<ECrashStatus>(
    ECrashStatus.NONE
  );
  const [downIntervalId, setDownIntervalId] = useState(0);
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
    const crashSocket: Socket<
      ICrashServerToClientEvents,
      ICrashClientToServerEvents
    > = io(
      `${SERVER_URL}/crash`
      // { parser: customParser }
    );

    crashSocket.emit(ECrashSocketEvent.PREVIOUS_CRASHGAME_HISTORY, 15 as any);

    crashSocket.on(
      ECrashSocketEvent.PREVIOUS_CRASHGAME_HISTORY,
      (historyData: any) => {
        console.log('history', historyData);
        setGameHistories(historyData);
      }
    );

    crashSocket.on(
      ECrashSocketEvent.GAME_TICK,
      (tick: { e: number; p: number }) => {
        setCrashStatus(ECrashStatus.PROGRESS);
        setCrTick((prev) => ({
          prev: prev.cur,
          cur: tick.p
        }));
        setCrElapsed(tick.e);
      }
    );

    crashSocket.on(ECrashSocketEvent.GAME_STARTING, (data) => {
      setCrashStatus(ECrashStatus.PREPARE);
      setPrepareTime(data.timeUntilStart ?? 0);
      stopCrashBgVideo();
      setBetData([]);
      setBetCashout([]);
      setTotalAmount(0);
      setIsBetted(false);
    });

    crashSocket.on(ECrashSocketEvent.GAME_START, (data) => {
      setCrashStatus(ECrashStatus.PROGRESS);
      setCrTick({ prev: 1.0, cur: 1.0 });
      playCrashBgVideo();
      setAvailableFirstBet(false);
    });

    crashSocket.on(ECrashSocketEvent.BET_CASHOUT_SUCCESS, (data) => {
      setAvailableFirstBet(false);
      if (!isBetted) setAvailableBet(false);
    });

    crashSocket.on(ECrashSocketEvent.GAME_END, (data) => {
      console.log('game end data => ', data);
      setGameHistories((prev) => [data.game, ...prev]);
      setCrBust(data.game.crashPoint!);
      setCrElapsed(0);
      setCrashStatus(ECrashStatus.END);
      stopCrashBgVideo();
      setAvailableBet(false);
      setAvailableFirstBet(false);
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
    });

    crashSocket.on(ECrashSocketEvent.CRASHGAME_JOIN_SUCCESS, () => {
      if (!isBetted) setAvailableBet(true);
    });

    crashSocket.on(ECrashSocketEvent.BET_CASHOUT, (data) => {
      setBetCashout((prev) => [...prev, data?.userdata]);
    });

    crashSocket.on(ECrashSocketEvent.NEXT_ROUND_JOIN_SUCCESS, () => {
      setIsBetted(true);
    });

    crashSocket.on(ECrashSocketEvent.NEXT_ROUND_JOIN_CANCEL, () => {
      setIsBetted(false);
    });

    crashSocket.on(
      ECrashSocketEvent.CREDIT_BALANCE,
      (data: { username: string; credit: number }) => {
        if (userData?.username === data.username) {
          dispatch(
            userActions.userData({
              ...userData,
              credit: data.credit
            })
          );
        }
      }
    );

    crashSocket.emit('auth', getAccessToken());

    setSocket(crashSocket);
    return () => {
      crashSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (crashStatus === ECrashStatus.PREPARE) {
      if (isBetted) setAvailableFirstBet(true);

      setCrTick({ prev: 1, cur: 1.01 });
      const intervalId = window.setInterval(updatePrepareCountDown, 100);
      setDownIntervalId(intervalId);
    } else {
      clearInterval(downIntervalId);
    }
  }, [crashStatus]);

  return (
    <ScrollArea className="h-full">
      <div className="flex h-screen w-full flex-col items-stretch">
        <div className="flex h-full w-full gap-2 px-[20px] py-[44px] lg:p-[40px]">
          <div className="flex h-full w-full flex-col justify-between gap-6 lg:w-3/4">
            <div className="flex h-full w-full gap-6 max-lg:flex-col-reverse lg:h-1/2">
              {/* <div className="m-0 flex h-full w-full flex-col justify-between rounded-lg bg-[#463E7A] lg:w-1/3">
                <BetAction
                  selectMode={selectMode}
                  setSelectMode={setSelectMode}
                  autoBet={autoBet}
                  setAutoBet={setAutoBet}
                  selectedToken={selectedToken}
                  setSelectedToken={setSelectedToken}
                  betAmount={betAmount}
                  setBetAmount={setBetAmount}
                  crashStatus={crashStatus}
                  setCrashStatus={setCrashStatus}
                  availableBet={availableBet}
                  setAvailableBet={setAvailableBet}
                  autoCashoutAmount={autoCashoutAmount}
                  setAutoCashoutAmount={setAutoCashoutAmount}
                  avaliableAutoCashout={avaliableAutoCashout}
                  setAvaliableAutoCashout={setAvaliableAutoCashout}
                  isBetted={isBetted}
                  setIsBetted={setIsBetted}
                  availableFirstBet={availableFirstBet}
                  setAvailableFirstBet={setAvailableFirstBet}
                  crTick={crTick}
                  socket={socket!}
                />
              </div> */}
              <div className="w-3/3 relative m-0 h-full rounded-md lg:m-[5px] lg:w-2/3">
                <GraphicDisplay
                  crashStatus={crashStatus}
                  crTick={crTick}
                  crBust={crBust}
                  crElapsed={crElapsed}
                  prepareTime={prepareTime}
                />
                <Graphic
                  crashStatus={crashStatus}
                  crTick={crTick}
                  crBust={crBust}
                  crElapsed={crElapsed}
                  prepareTime={prepareTime}
                />
              </div>
            </div>
            {/* <div className="flex h-1/2 w-full">
              <BetDisplay
                selectDisplay={selectDisplay}
                setSelectDisplay={setSelectDisplay}
                liveChatOpen={liveChatOpen}
                setLiveChatOpen={setLiveChatOpen}
                betData={betData}
                betCashout={betCashout}
                totalAmount={totalAmount}
                crashStatus={crashStatus}
              />
            </div> */}
          </div>
          {/* <div className="hidden h-full w-1/4 flex-col lg:flex">
            <BetBoard
              betData={betData}
              betCashout={betCashout}
              totalAmount={totalAmount}
              crashStatus={crashStatus}
            />
          </div> */}
        </div>
      </div>
    </ScrollArea>
  );
}
