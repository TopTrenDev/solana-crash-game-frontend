import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IToken, autoScripts, betMode, tokens } from '@/constants/data';
import { ECrashStatus } from '@/constants/status';
import { cn } from '@/utils/utils';
import useToast from '@/hooks/use-toast';
import { Socket } from 'socket.io-client';
import {
  QuestionMarkCircledIcon,
  PlusIcon,
  MixerVerticalIcon,
  PlayIcon,
  EyeOpenIcon,
  EraserIcon
} from '@radix-ui/react-icons';
import { useAppDispatch } from '@/store/redux';
import { userActions } from '@/store/redux/actions';
import { useState } from 'react';
import { ITick } from '@/types';

interface BetActionProps {
  selectMode: string;
  setSelectMode: React.Dispatch<React.SetStateAction<string>>;
  autoBet: boolean;
  setAutoBet: React.Dispatch<React.SetStateAction<boolean>>;
  selectedToken: IToken;
  setSelectedToken: React.Dispatch<React.SetStateAction<IToken>>;
  betAmount: number;
  setBetAmount: React.Dispatch<React.SetStateAction<number>>;
  crashStatus: ECrashStatus;
  setCrashStatus: React.Dispatch<React.SetStateAction<ECrashStatus>>;
  avaliableBet: boolean;
  setAvaliableBet: React.Dispatch<React.SetStateAction<boolean>>;
  autoCashoutAmount: number;
  setAutoCashoutAmount: React.Dispatch<React.SetStateAction<number>>;
  avaliableAutoCashout: boolean;
  setAvaliableAutoCashout: React.Dispatch<React.SetStateAction<boolean>>;
  isBetted: boolean;
  setIsBetted: React.Dispatch<React.SetStateAction<boolean>>;
  availableFirstBet: boolean;
  crTick: ITick;
  socket: Socket;
}

export default function BetAction({
  selectMode,
  setSelectMode,
  autoBet,
  setAutoBet,
  selectedToken,
  setSelectedToken,
  betAmount,
  setBetAmount,
  crashStatus,
  avaliableBet,
  setAvaliableBet,
  autoCashoutAmount,
  setAutoCashoutAmount,
  avaliableAutoCashout,
  setAvaliableAutoCashout,
  isBetted,
  setIsBetted,
  availableFirstBet,
  crTick,
  socket
}: BetActionProps) {
  const toast = useToast();
  const dispatch = useAppDispatch();
  const [autoCashoutPoint, setAutoCashoutPoint] = useState<number>(2);
  const [multiplierError, setMultiplierError] = useState<string>('');

  const isAutoMode = selectMode === 'auto';

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
    console.log('>>>>>', inputValue[0]);
    if (inputValue === '') {
      setAutoCashoutPoint(0);
      setMultiplierError('No payout');
    } else if (inputValue[0] === '0') {
      setAutoCashoutPoint(inputValue);
      setMultiplierError('Payout is not a valid multiplier.');
    } else if (
      inputValue.indexOf('.') > 0 &&
      inputValue.split('.')[1].length > 2
    ) {
      setAutoCashoutPoint(inputValue);
      setMultiplierError('Payout is not a valid multiplier.');
    } else {
      setAutoCashoutPoint(inputValue);
      setMultiplierError('');
    }
  };

  const handleStartBet = async () => {
    if (betAmount > 0 && !avaliableBet) {
      dispatch(userActions.siteBalanceStatus(true));
      const balanceTimeout = setTimeout(() => {
        dispatch(userActions.siteBalanceStatus(false));
      }, 2000);

      const joinParams = {
        target: autoCashoutPoint ? Number(autoCashoutPoint) * 100 : 1000000,
        betAmount:
          selectedToken === tokens[0]
            ? Number(betAmount).valueOf()
            : Number(betAmount * 1000).valueOf()
      };
      socket?.emit('join-crash-game', joinParams);
      return () => clearTimeout(balanceTimeout);
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
        dispatch(userActions.siteBalanceStatus(true));
        const balanceTimeout = setTimeout(() => {
          dispatch(userActions.siteBalanceStatus(false));
        }, 2000);
        const joinParams = {
          cashoutPoint: Number(autoCashoutPoint).valueOf() * 100,
          betAmount: Number(betAmount).valueOf()
        };
        socket?.emit('auto-crashgame-bet', joinParams);
        return () => clearTimeout(balanceTimeout);
      } else {
        setAutoBet(false);
      }
    } else {
      setAutoBet(true);
      socket?.emit('cancel-auto-bet');
    }
  };

  return (
    <>
      <div className="flex w-full flex-row items-center justify-between">
        <div className="flex w-full flex-row items-center">
          {betMode.map((item, index) => (
            <Button
              className={cn(
                'min-h-full w-1/2 rounded-tr-lg border-none bg-[#191939] p-5 font-semibold text-[#9688CC] shadow-none hover:bg-[#191939] hover:text-white',
                selectMode === item &&
                  'rounded-lg border-none bg-[#463E7A] text-white hover:bg-[#463E7A]'
              )}
              key={index}
              onClick={() => setSelectMode(item)}
            >
              {item}
            </Button>
          ))}
        </div>
      </div>
      {selectMode === betMode[0] ? (
        <Card className="m-2 rounded-lg border-none bg-[#2C2852] bg-opacity-80 p-3 text-[#9688CC] shadow-none">
          <div className="flex h-full w-full flex-col gap-4">
            <div className="flex flex-col">
              <p className="w-6/12 text-sm">Bet</p>
              <div className="relative">
                <Input
                  type="number"
                  value={betAmount}
                  onChange={handleBetAmountChange}
                  className="h-10 border-none bg-[#463E7A] font-bold text-white placeholder:text-gray-700"
                  disabled={isAutoMode || isBetted}
                />
                <div className="absolute right-0 top-0 flex h-full items-center justify-center text-gray500">
                  <Tabs className="h-full">
                    <TabsList className="h-full gap-2 rounded-[6px] bg-[#191939]">
                      {tokens.map((t, index) => (
                        <TabsTrigger
                          key={index}
                          asChild
                          disabled={isAutoMode || isBetted}
                          value={t.value}
                          onClick={() => setSelectedToken(t)}
                          className={`h-full rounded-[6px] ${selectedToken === t ? 'border-b-2 border-t-2 border-b-[#5c4b21] border-t-[#e7c777] bg-[#EEAF0E] hover:bg-[#caab5c]' : ''} text-[10px] text-white`}
                        >
                          <div className="flex cursor-pointer items-center">
                            {t.name}
                          </div>
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            </div>
            <div className="flex w-full flex-col">
              <p className="w-6/12 text-sm">Payout</p>
              <div className="relative w-full">
                <Input
                  type="number"
                  value={autoCashoutPoint}
                  onChange={handleAutoCashoutPointChange}
                  disabled={isBetted}
                  placeholder="1.05"
                  min={1.05}
                  max={1000}
                  step={0.01}
                  className="h-10 w-full border-none bg-[#463E7A] font-bold text-white placeholder:text-gray-700"
                />
                <span className="absolute right-0 top-0 flex h-full items-center justify-center rounded-r-lg bg-[#605499] px-[14px] text-white">
                  x
                </span>
              </div>
              <span className="text-[12px] text-red">{multiplierError}</span>
            </div>
            <div className="flex w-full flex-row items-center justify-center">
              <Button
                className={`h-12 w-full select-none rounded-[12px] border-b-4 border-t-4 border-b-[#5c4b21] border-t-[#e7c777] bg-[#EEAF0E] px-3 py-3 hover:bg-[#caab5c] ${avaliableBet ? 'border-b-[#5c3921] border-t-[#e79a77] bg-[#ee4d0e] hover:bg-[#ca7f5c]' : ''}`}
                disabled={multiplierError !== ''}
                onClick={handleStartBet}
              >
                {isBetted
                  ? 'Betting(Cancel)'
                  : avaliableBet
                    ? (betAmount * crTick.cur).toFixed(3) + 'SOLA'
                    : availableFirstBet
                      ? 'Cashouting'
                      : 'Place Bet'}
              </Button>
            </div>
            <div className="flex h-full w-full flex-col items-center justify-start gap-2 text-[10px] text-[#9688CC]">
              <div className="flex w-full justify-end">Hotkeys: OFF</div>
              <div className="flex w-full items-center justify-between">
                <span>Target Profit:</span>
                <span className="text-white">
                  {multiplierError
                    ? '???'
                    : (betAmount * (autoCashoutPoint - 1)).toFixed(3) + 'sola'}
                </span>
              </div>
              <div className="flex w-full items-center justify-between">
                <span>Win Chance:</span>
                <span className="text-white">
                  {multiplierError
                    ? '???'
                    : (99 / autoCashoutPoint).toFixed(2) + '%'}
                </span>
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="m-2 overflow-hidden rounded-lg border-none bg-[#2C2852] bg-opacity-80 p-[24px] text-[#9688CC] shadow-none">
          <div className="flex h-full w-full flex-col gap-4">
            <div className="flex w-full">
              <div className="flex w-1/2 items-center justify-start">
                <span className="w-6/12 text-[10px] font-semibold text-[#fff] lg:text-[16px]">
                  My Scripts
                </span>
                <QuestionMarkCircledIcon
                  color="#EEAF0E"
                  width={18}
                  height={18}
                />
              </div>
              <div className="flex w-1/2 items-center justify-end gap-3">
                <Button
                  className="h-full rounded-[6px] border-b-2 border-t-2 border-b-[#5c4b21] border-t-[#e7c777] bg-[#EEAF0E] px-3 py-1 hover:bg-[#caab5c]"
                  onClick={() => {}}
                >
                  <PlusIcon className="drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]" />
                  <span className="drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
                    New
                  </span>
                </Button>
                <Button className="h-full rounded-[6px] border-b-2 border-t-2 border-b-[#292447] border-t-[#6f62c0] bg-[#463E7A] p-1 hover:bg-[#6f62c0]">
                  <MixerVerticalIcon color="#fff" width={18} height={18} />
                </Button>
              </div>
            </div>
            <div className="flex w-full flex-col gap-2">
              {autoScripts.map((script) => (
                <div
                  key={script}
                  className="flex w-full items-center justify-between rounded-[8px] bg-[#463E7A] p-1 text-[8px] font-semibold text-[#fff] lg:text-[12px]"
                >
                  <p className="ml-2 w-1/2">{script}</p>
                  <div className="flex w-1/2 justify-end gap-2">
                    <Button className="h-full rounded-[6px] border-b-2 border-t-2 border-b-[#1b6345] border-t-[#39d896] bg-[#14F195] p-1 hover:bg-[#39d896]">
                      <PlayIcon
                        color="#fff"
                        className="h-3 w-3 lg:h-5 lg:w-5"
                      />
                    </Button>
                    <Button className="h-full rounded-[6px] border-b-2 border-t-2 border-b-[#1e4e6e] border-t-[#73c3f8] bg-[#3498DB] p-1 hover:bg-[#73c3f8]">
                      <EyeOpenIcon
                        color="#fff"
                        className="h-3 w-3 lg:h-5 lg:w-5"
                      />
                    </Button>
                    <Button className="h-full rounded-[6px] border-b-2 border-t-2 border-b-[#742023] border-t-[#ff767b] bg-[#E83035] p-1 hover:bg-[#ff767b]">
                      <EraserIcon
                        color="#fff"
                        className="h-3 w-3 lg:h-5 lg:w-5"
                      />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </>
  );
}
