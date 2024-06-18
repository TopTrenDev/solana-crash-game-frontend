import MovingBackgroundVideo from '../../../../public/assets/games/crash/moving_background.mp4';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { cn, formatMillisecondsShort } from '@/utils/utils';
import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Socket, io } from 'socket.io-client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { BetType, CrashHistoryData, FormattedPlayerBetType } from '@/types';
import {
  ECrashSocketEvent,
  ICrashClientToServerEvents,
  ICrashServerToClientEvents
} from '@/types/crash';
import { ECrashStatus } from '@/constants/status';
import { getAccessToken } from '@/utils/axios';
import useToast from '@/hooks/use-toast';
import BetBoard from './bet-board';
import { multiplerArray, betMode, roundArray, token } from '@/constants/data';
import { Checkbox } from '@/components/ui/checkbox';
import { useSpring, animated } from '@react-spring/web';
import Header from '@/components/shared/header';
import LiveChat from '@/components/shared/live-chat';
import MobileLivechat from '@/components/shared/mobile-livechat';
import { MessageSquareText } from 'lucide-react';
import { useOpen } from '@/provider/chat-provider';

const GrowingNumber = ({ start, end }) => {
  const { number: numberValue } = useSpring({
    from: { number: start },
    number: end,
    config: { duration: 0.1 }
  });

  return (
    <animated.span>{numberValue.to((n: number) => n.toFixed(2))}</animated.span>
  );
};

export default function CrashGameSection() {
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  const crashBgVideoPlayer = useRef<HTMLVideoElement>(null);
  const canvasNode = useRef<HTMLCanvasElement>(null);

  const toast = useToast();
  const [selectedToken, setSelectedToken] = useState(token[0]);
  const [betData, setBetData] = useState<BetType[]>([]);
  const [betAmount, setBetAmount] = useState(0);
  const [autoCashoutPoint, setAutoCashoutPoint] = useState(1.05);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [betCashout, setBetCashout] = useState<BetType[]>([]);
  const [avaliableBet, setAvaliableBet] = useState(false);
  const [autoBet, setAutoBet] = useState(true);
  const [autoCashoutAmount, setAutoCashoutAmount] = useState(1);
  const [totalAmount, setTotalAmount] = useState<any>();
  const [round, setRound] = useState(roundArray[0]);
  const [selectMode, setSelectMode] = useState(betMode[0]);
  const [avaliableAutoCashout, setAvaliableAutoCashout] =
    useState<boolean>(false);
  const isAutoMode = selectMode === 'auto';
  const [crTick, setCrTick] = useState({ prev: 1, cur: 1 });
  const [prepareTime, setPrepareTime] = useState(0);
  const [crashStatus, setCrashStatus] = useState<ECrashStatus>(
    ECrashStatus.NONE
  );
  const [downIntervalId, setDownIntervalId] = useState(0);
  const [crashHistoryData, setCrashHistoryData] = useState<CrashHistoryData[]>(
    []
  );

  const updatePrepareCountDown = () => {
    setPrepareTime((prev) => prev - 100);
  };

  const playCrashBgVideo = () => {
    crashBgVideoPlayer?.current?.play();
  };

  const stopCrashBgVideo = () => {
    crashBgVideoPlayer?.current?.pause();
  };

  const handleBetAmountChange = (event) => {
    const inputValue = event.target.value;
    const reqTest = new RegExp(`^\\d*\\.?\\d{0,2}$`);
    if (reqTest.test(inputValue) && inputValue !== '') {
      const updateValue =
        parseFloat(inputValue) >= 1
          ? inputValue.replace(/^0+/, '')
          : inputValue;
      setBetAmount(updateValue);
    } else if (inputValue === '') {
      setBetAmount(0);
    }
  };

  const handleAutoCashoutPointChange = (event) => {
    const inputValue = event.target.value;
    if (inputValue === '') {
      setAutoCashoutPoint(0);
    } else setAutoCashoutPoint(inputValue);
  };

  const handleMultiplierClick = (multiplier) => {
    const newValue = betAmount * multiplier;
    setBetAmount(newValue);
  };

  const handleStartBet = async () => {
    if (betAmount > 0 && !avaliableBet) {
      const joinParams = {
        target: avaliableAutoCashout
          ? Number(autoCashoutAmount) * 100
          : 1000000,
        betAmount: Number(betAmount).valueOf(),
        denom: selectedToken.name
      };
      socket?.emit('join-crash-game', joinParams);
    }
    if (!(betAmount > 0)) {
      toast.error('Bet amount must be greater than 0');
      return;
    }
    if (avaliableBet) {
      setAvaliableBet(false);
      socket?.emit('bet-cashout');
    }
  };

  const handleAutoBet = async () => {
    if (autoBet) {
      if (betAmount > 0) {
        const joinParams = {
          cashoutPoint: Number(autoCashoutPoint).valueOf() * 100,
          count: Number(round).valueOf(),
          betAmount: Number(betAmount).valueOf(),
          denom: selectedToken.name
        };
        socket?.emit('auto-crashgame-bet', joinParams);
      } else {
        setAutoBet(false);
      }
    } else {
      setAutoBet(true);
      socket?.emit('cancel-auto-bet');
    }
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

    crashSocket.emit(ECrashSocketEvent.PREVIOUS_CRASHGAME_HISTORY, 5 as any);

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
      setTotalAmount({
        usk: 0,
        kuji: 0
      });
    });

    crashSocket.on(ECrashSocketEvent.GAME_START, (data) => {
      setCrashStatus(ECrashStatus.PROGRESS);
      setCrTick({ prev: 1, cur: 1 });
      playCrashBgVideo();
    });

    crashSocket.on(
      ECrashSocketEvent.PREVIOUS_CRASHGAME_HISTORY,
      (historyData: any) => {
        setCrashHistoryData(historyData);
      }
    );

    crashSocket.on(ECrashSocketEvent.GAME_END, (data) => {
      setCrashStatus(ECrashStatus.END);
      stopCrashBgVideo();
      setAvaliableBet(false);
      crashSocket.emit(ECrashSocketEvent.PREVIOUS_CRASHGAME_HISTORY, 10 as any);
    });

    crashSocket.on(
      ECrashSocketEvent.GAME_BETS,
      (bets: FormattedPlayerBetType[]) => {
        setBetData((prev: BetType[]) => [...bets, ...prev]);
        const totalUsk = bets
          .filter((bet) => bet.denom === 'usk')
          .reduce((acc, item) => acc + item.betAmount, 0);

        const totalKuji = bets
          .filter((bet) => bet.denom === 'kuji')
          .reduce((acc, item) => acc + item.betAmount, 0);

        setTotalAmount((prevAmounts) => ({
          usk: (prevAmounts?.usk || 0) + totalUsk,
          kuji: (prevAmounts?.kuji || 0) + totalKuji
        }));
      }
    );

    crashSocket.on(ECrashSocketEvent.GAME_JOIN_ERROR, (data) => {
      toast.error(data);
      setAutoBet(true);
    });

    crashSocket.on(ECrashSocketEvent.CRASHGAME_JOIN_SUCCESS, (data) => {
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

  const [liveChatOpen, setLiveChatOpen] = useState<boolean>(false);
  const { open } = useOpen();

  useEffect(() => {
    const canvas = canvasNode.current;
    if (canvas) {
      const canvasCtx = canvas.getContext('2d');
      if (canvasCtx) {
        console.log('crTick.cur', crTick.cur);
        if (crashStatus === ECrashStatus.START) {
        } else if (crashStatus === ECrashStatus.END) {
          return canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
        } else if (crashStatus === ECrashStatus.PROGRESS) {
        }
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
        canvasCtx.beginPath();
        canvasCtx.moveTo(0, canvas.height);
        const lastX = (canvas.width * crTick.cur) / 5;
        console.log({ lastX });
        const lastY = canvas.height - (crTick.cur - 1) * 20;
        console.log({ lastY });
        canvasCtx.lineTo(lastX, lastY);
        canvasCtx.strokeStyle = '#000';
        canvasCtx.lineWidth = 2;
        canvasCtx.stroke();

        // let lastX = 0;
        // let lastY = 0;
        // for (let x = 0; x <= (canvas.width * crTick.cur) / 5; x++) {
        //   let y = 0;
        //   // Stop vertical movement of rocket at a threshold
        //   if (crTick.cur <= 5.0) {
        //     y = canvas.height - (crTick.cur - 1) * 40;
        //   } else {
        //     y = canvas.height * 0.2;
        //   }

        //   canvasCtx.lineTo(x - crTick.cur * 1, y);
        //   canvasCtx.strokeStyle = '#000';
        //   canvasCtx.lineWidth = 2;
        //   canvasCtx.stroke();
        //   lastX = x - crTick.cur * 1;
        //   lastY = y;
        // }

        // canvasCtx.fillText('🚀', lastX - 15, lastY - 15);

        // // Draw dynamic y-axis numbers
        // if (crTick.cur > 5.0) {
        //   for (let i = 0; i < 10; i++) {
        //     ctx!.font = '10px Arial';
        //     ctx!.fillText(
        //       (5 + i * 0.5).toFixed(1) + 'x',
        //       10,
        //       canvasNode.current!.height * 0.2 + i * 20 - crTick.cur * 1
        //     );
        //   }
        // }
      }
    }

    return () => {};
  }, [canvasNode, crTick, crashStatus]);

  return (
    <ScrollArea className="h-full">
      <div className="flex h-screen flex-col items-stretch">
        <div className="relative z-10 flex h-16 flex-shrink-0 shadow">
          {/* <button
            className="h-full bg-dark bg-opacity-30 px-4 text-gray-300 bg-blend-multiply focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 xl:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <MenuIcon className="h-6 w-6" aria-hidden="true" />
          </button> */}
          <Header />
        </div>
        <div className="flex h-full w-full">
          <div className="flex h-full w-2/3 flex-col justify-between gap-6">
            <div className="flex h-2/5 w-full">
              <div className="relative m-[5px] h-full w-1/2 rounded-md">
                {/* <video
                  className="crash-moving-bg-video rounded-xl object-fill"
                  autoPlay
                  muted
                  ref={crashBgVideoPlayer}
                  loop
                  controls={false}
                  id="crash-moving-bg"
                >
                  <source src={MovingBackgroundVideo} type="video/mp4" />
                </video> */}
                <canvas
                  ref={canvasNode}
                  className="crash-moving-bg-video rounded-xl object-fill"
                />
                {(crashStatus === ECrashStatus.PROGRESS ||
                  crashStatus === ECrashStatus.END) && (
                  <div className="crash-status-shadow absolute left-10 top-32 flex flex-col gap-2">
                    <div
                      className={cn(
                        'text-6xl font-extrabold text-white',
                        crashStatus === ECrashStatus.END && 'crashed-value'
                      )}
                    >
                      X<GrowingNumber start={crTick.prev} end={crTick.cur} />
                    </div>
                    <div className="font-semibold text-[#f5b95a]">
                      {crashStatus === ECrashStatus.PROGRESS
                        ? 'CURRENT PAYOUT'
                        : 'ROUND OVER'}
                    </div>
                  </div>
                )}
                {crashStatus === ECrashStatus.PREPARE && prepareTime > 0 && (
                  <div className="crash-status-shadow absolute left-[20%] top-[40%] flex flex-col items-center justify-center gap-5">
                    <div className="text-xl font-semibold uppercase text-white">
                      preparing round
                    </div>
                    <div className="text-6xl font-extrabold uppercase text-[#f5b95a] delay-100">
                      starting in {formatMillisecondsShort(prepareTime)}
                    </div>
                  </div>
                )}
                {/* {(crashStatus === ECrashStatus.PROGRESS ||
                  crashStatus === ECrashStatus.END) && (
                  <div className="crash-car car-moving absolute bottom-16">
                    <img
                      src={
                        crashStatus === ECrashStatus.PROGRESS
                          ? '/assets/games/crash/moving_car.gif'
                          : '/assets/games/crash/explosion.gif'
                      }
                      className="w-64"
                      alt="crash-car"
                    />
                  </div>
                )} */}
                {crashStatus === ECrashStatus.NONE && (
                  <div className="crash-status-shadow absolute left-[30%] top-[40%] flex flex-col items-center justify-center gap-5">
                    <div className=" text-6xl font-extrabold uppercase text-[#f5b95a] delay-100">
                      Starting...
                    </div>
                  </div>
                )}
                <div className="absolute left-0 top-0 flex flex-row items-center justify-around gap-6 py-5">
                  <div className="flex flex-row items-center justify-center gap-2">
                    <span className="ms-2 inline-flex h-3 w-3 items-center justify-center rounded-full bg-[#0BA544] text-xs font-semibold text-blue-800" />
                    <p className="text-sm text-gray-300">Network status</p>
                  </div>
                  <div className="flex gap-2">
                    {[...crashHistoryData].reverse()?.map((item, index) => (
                      <span
                        key={index}
                        className={cn(
                          'rounded-lg border border-[#1D1776] bg-dark-blue px-2 py-1 text-center text-xs text-gray-300'
                        )}
                      >
                        x{(item.crashPoint / 100).toFixed(2)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="m-[5px] flex h-full w-1/2 flex-col justify-between">
                <div className="flex flex-row items-center justify-between">
                  <span className="text-lg uppercase text-gray-400">
                    bet mode
                  </span>
                  <div className="flex flex-row items-center gap-3">
                    {betMode.map((item, index) => (
                      <Button
                        className={cn(
                          'min-h-full rounded-lg border border-[#1D1776] bg-dark-blue px-6 py-5 font-semibold uppercase text-gray500 hover:bg-dark-blue hover:text-white',
                          selectMode === item &&
                            'border-purple bg-purple text-white hover:bg-purple'
                        )}
                        key={index}
                        onClick={() => setSelectMode(item)}
                      >
                        {item}
                      </Button>
                    ))}
                  </div>
                </div>
                <Card className=" border-purple-0.15  bg-dark bg-opacity-80 shadow-purple-0.5 drop-shadow-sm">
                  <div className="flex h-full w-full flex-col gap-2 rounded-lg bg-[#0D0B32CC] px-8 py-5">
                    <div className="flex flex-row items-center justify-end">
                      <Button
                        className="h-12 w-6/12 bg-purple px-3 py-3 uppercase hover:bg-purple"
                        disabled={
                          isAutoMode
                            ? false
                            : (crashStatus !== ECrashStatus.PREPARE &&
                                !avaliableBet) ||
                              (crashStatus !== ECrashStatus.PROGRESS &&
                                avaliableBet)
                        }
                        onClick={isAutoMode ? handleAutoBet : handleStartBet}
                      >
                        {isAutoMode
                          ? autoBet
                            ? 'Auto Bet'
                            : 'Cancel'
                          : avaliableBet
                            ? 'Cash Out'
                            : 'Place Bet'}
                      </Button>
                    </div>
                    <div
                      className={`flex flex-col ${isAutoMode ? 'gap-4' : 'gap-5'}`}
                    >
                      <p className="w-6/12 text-sm uppercase text-[#556987]">
                        bet amount
                      </p>
                      <div className="relative">
                        <Input
                          type="number"
                          value={betAmount}
                          onChange={handleBetAmountChange}
                          className="border border-purple-0.5 text-white placeholder:text-gray-700"
                          disabled={isAutoMode && !autoBet}
                        />
                        <span className="absolute right-4 top-0 flex h-full items-center justify-center text-gray500">
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              asChild
                              disabled={isAutoMode && !autoBet}
                            >
                              <div className="flex cursor-pointer items-center gap-2 uppercase">
                                <img
                                  src={selectedToken.src}
                                  className="h-4 w-4"
                                />
                                {selectedToken.name}
                              </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-12 border-purple-0.5 bg-[#0D0B32CC]">
                              <DropdownMenuRadioGroup
                                value={selectedToken.name}
                                onValueChange={(value) => {
                                  const newToken = token.find(
                                    (t) => t.name === value
                                  );
                                  if (newToken) {
                                    setSelectedToken(newToken);
                                  }
                                }}
                              >
                                {token.map((t, index) => (
                                  <DropdownMenuRadioItem
                                    key={index}
                                    value={t.name}
                                    className="gap-5 uppercase text-white hover:bg-transparent"
                                  >
                                    <img src={t.src} className="h-4 w-4" />
                                    {t.name}
                                  </DropdownMenuRadioItem>
                                ))}
                              </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </span>
                      </div>
                      <div className="grid grid-cols-4 space-x-3">
                        {multiplerArray.map((item, index) => (
                          <Button
                            disabled={isAutoMode && !autoBet}
                            className="rounded-lg border border-[#1D1776] bg-dark-blue font-semibold uppercase text-gray500 hover:bg-dark-blue hover:text-white"
                            key={index}
                            onClick={() => handleMultiplierClick(item)}
                          >
                            {item + 'x'}
                          </Button>
                        ))}
                      </div>
                      {!isAutoMode && (
                        <div className="flex flex-col justify-between gap-3">
                          <div className="flex flex-row items-center justify-start gap-2">
                            <Checkbox
                              id="terms"
                              className="text-[#049DD9]"
                              checked={avaliableAutoCashout}
                              onClick={() =>
                                setAvaliableAutoCashout(!avaliableAutoCashout)
                              }
                            />
                            <span className="text-white">Auto Cashout</span>
                          </div>
                          <div className="flex w-full items-center justify-center gap-1">
                            <div className="relative w-full">
                              <Input
                                type="number"
                                value={autoCashoutAmount}
                                disabled={!avaliableAutoCashout}
                                onChange={(e) =>
                                  setAutoCashoutAmount(Number(e.target.value))
                                }
                                className="placeholder:text-gray-7000 border border-purple-0.5 text-white"
                                max={100}
                                min={1}
                              />
                              <span className="absolute right-4 top-0 flex h-full items-center justify-center text-gray500">
                                Cashout
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                      {isAutoMode && (
                        <>
                          <div className="flex w-full">
                            <div className="relative w-full">
                              <Input
                                disabled={isAutoMode && !autoBet}
                                type="number"
                                value={autoCashoutPoint}
                                onChange={handleAutoCashoutPointChange}
                                min={1.05}
                                max={1000}
                                className="w-full border border-purple-0.5 text-white placeholder:text-gray-700"
                              />
                              <span className="absolute right-4 top-0 flex h-full items-center justify-center text-gray500">
                                Cashout
                              </span>
                            </div>
                          </div>
                          <div className="grid grid-cols-5 space-x-3">
                            {roundArray.map((item, index) => (
                              <Button
                                disabled={isAutoMode && !autoBet}
                                className={`rounded-lg border border-[#1D1776] bg-dark-blue font-semibold uppercase text-gray500 hover:bg-dark-blue hover:text-white ${round === item ? 'bg-purple text-white' : ''}`}
                                key={index}
                                onClick={() => setRound(item)}
                              >
                                {item === 10000 ? '∞' : item}
                              </Button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            </div>
            <MobileLivechat
              livechatOpen={liveChatOpen}
              setLivechatOpen={setLiveChatOpen}
            />
            <div
              className={`hidden h-full transform shadow-lg shadow-purple-0.15 transition-all duration-300 ease-in-out lg:flex ${open ? 'w-full translate-x-0 opacity-100' : 'w-0 translate-x-full opacity-0'}`}
            >
              <LiveChat />
            </div>
            <MessageSquareText
              className="fixed bottom-8 right-8 z-50 block h-14 w-14 cursor-pointer rounded-full bg-gray50 bg-opacity-15 p-3 text-lg text-gray50 bg-blend-multiply shadow-lg lg:hidden "
              onClick={() => setLiveChatOpen(true)}
            />
          </div>
          <div className="flex h-full w-1/3 flex-col p-[5px]">
            <BetBoard
              betData={betData}
              betCashout={betCashout}
              totalAmount={totalAmount}
            />
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
