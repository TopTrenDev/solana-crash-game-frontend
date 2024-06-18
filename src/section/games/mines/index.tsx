import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  defaulMine,
  minesAmountPresets,
  multiplerArray,
  token
} from '@/constants/data';
import { EMinesStatus } from '@/constants/status';
import useToast from '@/hooks/use-toast';
import { useAppDispatch, useAppSelector } from '@/store/redux';
import { minesActions } from '@/store/redux/actions';
import { getAccessToken } from '@/utils/axios';
import { calculateMiningProbabilities } from '@/utils/utils';
import { useEffect, useState } from 'react';

export default function MinesGameSection() {
  const toast = useToast();
  const [betAmount, setBetAmount] = useState(0);
  const [minesAmount, setMinesAmount] = useState(2);
  const [selectedToken, setSelectedToken] = useState(token[0]);
  const [probabilities, setProbabilities] = useState<number[]>([]);
  const [selectedProbability, setSelectedProbability] = useState<number>(0);
  const [minesStatus, setMinesStatus] = useState(defaulMine.map(() => false));
  const [isGameOver, setIsGameOver] = useState(false);
  const [mineStatus, setMineStatus] = useState(EMinesStatus.NONE);
  const dispatch = useAppDispatch();
  const minesState = useAppSelector((state: any) => state.mines);
  const [mineImages, setMineImages] = useState(Array(defaulMine.length).fill('mystery'));
  const [lastClickedIndex, setLastClickedIndex] = useState<number | null>(null);
  const [clickedIndices, setClickedIndices] = useState<Set<number>>(new Set());

  const resetGame = () => {
    setBetAmount(0);
    setMinesAmount(2);
    setSelectedToken(token[0]);
    setSelectedProbability(0);
    setMinesStatus(defaulMine.map(() => false));
    setIsGameOver(false);
    setMineStatus(EMinesStatus.NONE);
    setMineImages(Array(defaulMine.length).fill('mystery'));
    setLastClickedIndex(null);
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

  const handleMultiplierClick = (multiplier) => {
    const newValue = betAmount * multiplier;
    setBetAmount(newValue);
  };

  const handleMinesAmountChange = (event) => {
    const inputValue = event.target.value;
    const reqTest = new RegExp(`^\\d*\\.?\\d{0,2}$`);
    if (reqTest.test(inputValue) && inputValue !== '') {
      const updateValue =
        parseFloat(inputValue) >= 1
          ? inputValue.replace(/^0+/, '')
          : inputValue;
      setMinesAmount(updateValue);
    } else if (inputValue === '') {
      setMinesAmount(0);
    }
  };

  const handleMinePresetsAmount = (item) => {
    setMinesAmount(item);
  };

  const handleMinesClick = async (index) => {
    if (mineStatus === EMinesStatus.NONE) {
      toast.error('Click "Start Bet"');
      return;
    }
    if (isGameOver) return;
    setLastClickedIndex(index);
    setMineStatus(EMinesStatus.CLICKED);
    setClickedIndices(prev => new Set(prev.add(index)));
    await dispatch(minesActions.rollingMinesgame(index));
    const propability = setTimeout(() => {
      setSelectedProbability(prev => prev + 1);
    }, 1800);
    return () => clearTimeout(propability);
  };

  const handleMinesGame = () => {
    if (mineStatus === EMinesStatus.NONE) {
      if (betAmount > 0 && betAmount <= 100 && minesAmount > 0 && minesAmount < 25) {
        setMineStatus(EMinesStatus.START);
        dispatch(
          minesActions.startMinesgame({
            betAmount: Number(betAmount),
            denom: selectedToken.name,
            betMinesCount: minesAmount,
          })
        );
      } else {
        toast.error('Invalid Token Amount');
      }
    }
    else {
      setMineStatus(EMinesStatus.NONE);
      dispatch(minesActions.cashoutgame());
      const gameover = setTimeout(() => {
        setIsGameOver(true);
        setTimeout(() => {
          resetGame();
        }, 3000);
      }, 1000);
      return () => clearTimeout(gameover);
    }
  }

  useEffect(() => {
    const result = calculateMiningProbabilities(minesAmount, 25) as number[];
    setProbabilities(result);
  }, [minesAmount]);

  useEffect(() => {
    dispatch(minesActions.loginMinesServer());
  }, [getAccessToken()]);

  useEffect(() => {
    dispatch(minesActions.subscribeMinesServer());
    setMineStatus(EMinesStatus.NONE);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (minesState.gameResult !== null && lastClickedIndex !== null) {
        const newMineImages = [...mineImages];
        if (minesState.gameResult) {
          newMineImages[lastClickedIndex] = 'star';
        } else {
          newMineImages[lastClickedIndex] = 'bomb';
          setLastClickedIndex(null);
          setIsGameOver(true);
        }
        setClickedIndices(prev => {
          const newSet = new Set(prev);
          newSet.delete(lastClickedIndex);
          return newSet;
        });
        dispatch(minesActions.minesgameRolled(null));
        setMineImages(newMineImages);
        if (!minesState.gameResult) {
          const gameOverTimer = setTimeout(() => {
            resetGame();
          }, 2000);
          return () => clearTimeout(gameOverTimer);
        }
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [minesState.gameResult, lastClickedIndex, mineImages]);

  useEffect(() => {
    if (minesState.error !== '')
      toast.error(minesState.error);
    resetGame();
  }, [minesState.error]);

  return (
    <ScrollArea className="h-[calc(100vh-64px)] flex">
      <div className='w-full flex flex-col gap-3'>
        <div className='flex justify-center items-center'>
          <div className="flex flex-row scroll-smooth w-[35vw] gap-1.5 overflow-hidden p-1 bg-darkBlue2 rounded-lg mt-5">
            {probabilities.map((item, index) => (
              <div key={index}
                ref={el => {
                  if (selectedProbability === index + 1 && el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                  }
                }}
                className={`text-xs py-1 px-2.5 rounded-lg border border-[#1D1776] bg-dark-blue font-semibold text-gray500 hover:bg-dark-blue ${selectedProbability === index + 1 ? 'bg-purple text-white' : ''}`}
              >
                x{item > 1000 ? `${(item / 1000).toFixed(2)}k` : item}
              </div>
            ))
            }
          </div>
        </div>
        <div className="flex items-center justify-center">
          {isGameOver &&
            <span className="absolute top-16 text-center text-xl font-bold uppercase text-[#df8002]">
              {(minesState.earned === null ? ("Game over"
              ) : `WON ${minesState.earned}`)}
            </span>
          }
        </div>
        <div className="flex flex-col gap-12 mt-12">
          <div className="relative flex flex-row justify-around">
            <div className='w-6/12'>
              {Array.from({ length: 5 }, (_, rowIndex) => (
                <div className="flex justify-center gap-5" key={rowIndex}>
                  {defaulMine.slice(rowIndex * 5, (rowIndex + 1) * 5).map((mine, index) => (
                    <button
                      className={`group flex items-center justify-center ${minesStatus[rowIndex * 5 + index] ? 'pointer-events-none' : ''} ${mineStatus === EMinesStatus.START ? 'some-start-class' : ''} ${clickedIndices.has(rowIndex * 5 + index) ? 'ripple-animation' : ''}`}
                      key={index}
                      onClick={() => {
                        if (!minesStatus[rowIndex * 5 + index]) {
                          handleMinesClick(rowIndex * 5 + index);
                        }
                      }}
                      aria-label={`Mine at position ${index + 1}`}
                    >
                      <img
                        src={`/assets/games/mines/${mineImages[rowIndex * 5 + index]}.svg`}
                        alt={`Mine ${mineImages[rowIndex * 5 + index]}`}
                        className="group h-20 w-20 hover:transition-all"
                      />
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-10">
            <div className="flex justify-center gap-6">
              <div className="flex flex-col gap-4">
                <p className="w-6/12 text-sm uppercase text-[#556987]">
                  bet amount
                </p>
                <div className="relative">
                  <Input
                    type="number"
                    value={betAmount}
                    onChange={handleBetAmountChange}
                    disabled={mineStatus !== EMinesStatus.NONE}
                    className="border border-purple-0.5 text-white placeholder:text-gray-700"
                  />
                  <span className="absolute right-4 top-0 flex h-full items-center justify-center text-gray500">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <div className="flex cursor-pointer items-center gap-2 uppercase">
                          <img src={selectedToken.src} className="h-4 w-4" />
                          {selectedToken.name}
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-12 border-purple-0.5 bg-[#0D0B32CC]">
                        <DropdownMenuRadioGroup
                          value={selectedToken.name}
                          onValueChange={(value) => {
                            const newToken = token.find((t) => t.name === value);
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
                <div className="grid grid-cols-4 gap-5">
                  {multiplerArray.map((item, index) => (
                    <Button
                      disabled={mineStatus !== EMinesStatus.NONE}
                      className="rounded-lg border border-[#1D1776] bg-dark-blue font-semibold uppercase text-gray500 hover:bg-dark-blue hover:text-white"
                      key={index}
                      onClick={() => handleMultiplierClick(item)}
                    >
                      {item + 'x'}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex">
                <div className="flex w-full flex-col gap-4">
                  <p className="w-6/12 text-sm uppercase text-[#556987]">
                    mines amount
                  </p>
                  <div className="relative">
                    <Input
                      type="number"
                      value={minesAmount}
                      min={2}
                      max={24}
                      disabled={mineStatus !== EMinesStatus.NONE}
                      onChange={handleMinesAmountChange}
                      className="border border-purple-0.5 text-white placeholder:text-gray-700"
                    />
                    <div className="absolute right-4 top-0 flex h-full items-center justify-center text-gray500">
                      <img
                        src="/assets/games/mines/bomb.svg"
                        className="h-5 w-5"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-5 gap-5">
                    {minesAmountPresets.map((item, index) => (
                      <Button
                        disabled={mineStatus !== EMinesStatus.NONE}
                        className={`rounded-lg border border-[#1D1776] bg-dark-blue font-semibold uppercase text-gray500 hover:bg-dark-blue hover:text-white`}
                        key={index}
                        onClick={() => handleMinePresetsAmount(item)}
                      >
                        {item}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <Button
              className="w-72 bg-purple py-7 hover:bg-purple flex flex-col"
              onClick={handleMinesGame}
              disabled={mineStatus !== EMinesStatus.NONE && lastClickedIndex === null}
            >
              {mineStatus === EMinesStatus.NONE ? 'Start Bet' : 'Cash Out'}
              <span className='text-sm'>
                {selectedProbability === 0 ? "" : `$${(probabilities[selectedProbability - 1] * betAmount).toFixed(2)}`}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
