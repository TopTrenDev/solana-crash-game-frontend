import {
  FormattedGameHistoryType,
  FormattedPlayerBetType,
  BetType,
  CrashHistoryData,
  AutoCrashGameData
} from './crashGame';

export enum ECrashSocketEvent {
  GAME_BETS = 'game-bets',
  GAME_STARTING = 'game-starting',
  GAME_START = 'game-start',
  BET_CASHOUT = 'bet-cashout',
  GAME_END = 'game-end',
  GAME_TICK = 'game-tick',
  JOIN_CRASH_GAME = 'join-crash-game',
  CRASHGAME_JOIN_SUCCESS = 'crashgame-join-success',
  AUTO_CRASHGAME_BET = 'auto-crashgame-bet',
  PREVIOUS_CRASHGAME_HISTORY = 'previous-crashgame-history',
  GAME_JOIN_ERROR = 'game-join-error',
  BET_CASHOUT_ERROR = 'bet-cashout-error',
  BET_CASHOUT_SUCCESS = 'bet-cashout-success',
  AUTO_CRASHGAME_JOIN_SUCCESS = 'auto-crashgame-join-success'
}

export interface ICrashServerToClientEvents {
  [ECrashSocketEvent.GAME_BETS]: (bets: FormattedPlayerBetType[]) => void;
  [ECrashSocketEvent.GAME_STARTING]: (data: {
    _id: string | null;
    privateHash: string | null;
    timeUntilStart?: number;
  }) => void;
  [ECrashSocketEvent.GAME_START]: (data: { publicSeed: string }) => void;
  [ECrashSocketEvent.BET_CASHOUT]: (data: {
    userdata: BetType;
    status: number;
    stoppedAt: number | undefined;
    winningAmount: number;
  }) => void;
  [ECrashSocketEvent.GAME_END]: (data: {
    game: FormattedGameHistoryType;
  }) => void;
  [ECrashSocketEvent.GAME_TICK]: (data: number) => void;
  [ECrashSocketEvent.CRASHGAME_JOIN_SUCCESS]: (
    data: FormattedPlayerBetType
  ) => void;
  [ECrashSocketEvent.BET_CASHOUT_ERROR]: (data: string) => void;
  [ECrashSocketEvent.BET_CASHOUT_SUCCESS]: (result: any) => void;
  [ECrashSocketEvent.PREVIOUS_CRASHGAME_HISTORY]: (count: number) => void;
  [ECrashSocketEvent.GAME_JOIN_ERROR]: (data: string) => void;
  [ECrashSocketEvent.JOIN_CRASH_GAME]: (
    target: number,
    betAmount: number,
    denom: string
  ) => void;
  [ECrashSocketEvent.AUTO_CRASHGAME_JOIN_SUCCESS]: (data: string) => void;
}

export interface ICrashClientToServerEvents {
  auth: (token: string) => void;
  [ECrashSocketEvent.JOIN_CRASH_GAME]: (
    target: number,
    betAmount: number
  ) => void;
  [ECrashSocketEvent.BET_CASHOUT]: () => void;
  [ECrashSocketEvent.PREVIOUS_CRASHGAME_HISTORY]: (
    historyData: CrashHistoryData[]
  ) => void;
  [ECrashSocketEvent.AUTO_CRASHGAME_BET]: (data: AutoCrashGameData) => void;
}
