import { ReactNode, createContext, useContext, useMemo, useState } from 'react';
import { ICrashHistoryRecord } from '@/types';

export interface IGameContext {
  gameHistories: ICrashHistoryRecord[];
  setGameHistories: React.Dispatch<React.SetStateAction<ICrashHistoryRecord[]>>;
  gameId: number;
  setGameId: React.Dispatch<React.SetStateAction<number>>;
  currentGame: ICrashHistoryRecord | null;
}

export const GameContext = createContext<IGameContext>({
  gameHistories: [],
  setGameHistories: () => {},
  gameId: -1,
  setGameId: () => {},
  currentGame: null
});

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [gameHistories, setGameHistories] = useState<ICrashHistoryRecord[]>([]);
  const [gameId, setGameId] = useState<number>(-1);
  const currentGame = useMemo(() => {
    if (gameId < 0) return null;
    return gameHistories[gameId];
  }, [gameHistories, gameId]);

  console.log('currentGame', currentGame);

  return (
    <GameContext.Provider
      value={{
        gameHistories,
        setGameHistories,
        gameId,
        setGameId,
        currentGame
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): IGameContext => {
  return useContext(GameContext);
};
