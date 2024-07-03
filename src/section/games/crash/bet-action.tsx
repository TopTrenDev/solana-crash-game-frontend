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

interface BetActionProps {
  selectMode: string;
  setSelectMode: React.Dispatch<React.SetStateAction<string>>;
  selectedToken: IToken;
  setSelectedToken: React.Dispatch<React.SetStateAction<IToken>>;
  betAmount: number;
  setBetAmount: React.Dispatch<React.SetStateAction<number>>;
  autoBet: boolean;
  setAutoBet: React.Dispatch<React.SetStateAction<boolean>>;
  crashStatus: ECrashStatus;
  setCrashStatus: React.Dispatch<React.SetStateAction<ECrashStatus>>;
  avaliableBet: boolean;
  setAvaliableBet: React.Dispatch<React.SetStateAction<boolean>>;
  autoCashoutPoint: number;
  setAutoCashoutPoint: React.Dispatch<React.SetStateAction<number>>;
  autoCashoutAmount: number;
  setAutoCashoutAmount: React.Dispatch<React.SetStateAction<number>>;
  avaliableAutoCashout: boolean;
  setAvaliableAutoCashout: React.Dispatch<React.SetStateAction<boolean>>;
  socket: Socket;
}

export default function BetAction({
  selectMode,
  setSelectMode,
  selectedToken,
  setSelectedToken,
  betAmount,
  setBetAmount,
  autoBet,
  setAutoBet,
  crashStatus,
  avaliableBet,
  setAvaliableBet,
  autoCashoutPoint,
  setAutoCashoutPoint,
  autoCashoutAmount,
  setAutoCashoutAmount,
  avaliableAutoCashout,
  setAvaliableAutoCashout,
  socket
}: BetActionProps) {
  const toast = useToast();
  const dispatch = useAppDispatch();

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

  // const handleMultiplierClick = (multiplier) => {
  //   const newValue = betAmount * multiplier;
  //   setBetAmount(newValue);
  // };

  const handleAutoCashoutPointChange = (event) => {
    const inputValue = event.target.value;
    if (inputValue === '') {
      setAutoCashoutPoint(0);
    } else setAutoCashoutPoint(inputValue);
  };

  const handleAutoBet = async () => {
    if (autoBet) {
      if (betAmount > 0) {
        const joinParams = {
          cashoutPoint: Number(autoCashoutPoint).valueOf() * 100,
          betAmount: Number(betAmount).valueOf()
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

  const handleStartBet = async () => {
    if (betAmount > 0 && !avaliableBet) {
      dispatch(userActions.siteBalanceStatus(true));
      const balanceTimeout = setTimeout(() => {
        dispatch(userActions.siteBalanceStatus(false));
      }, 2000);

      const joinParams = {
        target: avaliableAutoCashout
          ? Number(autoCashoutAmount) * 100
          : 1000000,
        betAmount: Number(betAmount).valueOf(),
        denom: selectedToken.name
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
                  disabled={isAutoMode && !autoBet}
                />
                <div className="absolute right-0 top-0 flex h-full items-center justify-center text-gray500">
                  <Tabs className="h-full">
                    <TabsList className="h-full rounded-[6px] bg-[#191939]">
                      {tokens.map((t, index) => (
                        <TabsTrigger
                          key={index}
                          asChild
                          disabled={isAutoMode && !autoBet}
                          value={t.value}
                          onClick={() => setSelectedToken(t)}
                          className={`${selectedToken === t ? 'rounded-[6px] border-b-2 border-t-2 border-b-[#5c4b21] border-t-[#e7c777] bg-[#EEAF0E] text-white hover:bg-[#caab5c]' : 'text-[#9688CC]'} h-full text-[10px]`}
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
                  min={1.05}
                  max={1000}
                  className="h-10 w-full border-none bg-[#463E7A] font-bold text-white placeholder:text-gray-700"
                />
                <span className="absolute right-0 top-0 flex h-full items-center justify-center rounded-r-lg bg-[#605499] px-[14px] text-white">
                  multiplier
                </span>
              </div>
            </div>
            <div className="flex w-full flex-row items-center justify-center">
              <Button
                className="h-12 w-full select-none rounded-[12px] border-b-4 border-t-4 border-b-[#5c4b21] border-t-[#e7c777] bg-[#EEAF0E] px-3 py-3 hover:bg-[#caab5c]"
                disabled={
                  isAutoMode
                    ? false
                    : (crashStatus !== ECrashStatus.PREPARE && !avaliableBet) ||
                      (crashStatus !== ECrashStatus.PROGRESS && avaliableBet)
                }
                onClick={isAutoMode ? handleAutoBet : handleStartBet}
              >
                {isAutoMode
                  ? autoBet
                    ? 'Auto Bet'
                    : 'Cancel'
                  : avaliableBet
                    ? 'Cash Out'
                    : 'Bet'}
              </Button>
            </div>
            <div className="flex h-full w-full flex-col items-center justify-start gap-2 text-[10px] text-[#9688CC]">
              <div className="flex w-full justify-end">Hotkeys: OFF</div>
              <div className="flex w-full items-center justify-between">
                <span>Target Profit:</span>
                <span className="text-white">
                  {betAmount * autoCashoutPoint} sola
                </span>
              </div>
              <div className="flex w-full items-center justify-between">
                <span>Win Chance:</span>
                <span className="text-white">38.5%</span>
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
