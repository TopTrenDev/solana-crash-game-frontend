import VIPLevelType from './vipLevel';

export interface IToken {
  name: string;
  src: string;
  denom: string;
}

export interface ITick {
  prev: number;
  cur: number;
}

export interface GameStateType {
  _id: string;
  status: number;
  crashPoint: number;
  startedAt: Date | null;
  duration: number | null;
  players: { [key: string]: BetType };
  pending: { [key: string]: PendingBetType };
  pendingCount: number;
  pendingBets: PendingBetType[];
  privateSeed: string | null;
  privateHash: string;
  publicSeed: string | null;
  created: Date;
}

export interface BetType {
  playerID: string;
  username: string;
  avatar?: string;
  betAmount: number;
  status: number;
  level: VIPLevelType;
  stoppedAt?: number;
  autoCashOut?: number;
  winningAmount?: number;
  forcedCashout?: boolean;
  createdAt?: Date;
  denom: string;
}

export interface PendingBetType {
  betAmount: number;
  autoCashOut?: number;
  username: string;
  denom: string;
}

export type FormattedPlayerBetType = Pick<
  BetType,
  | 'playerID'
  | 'username'
  | 'avatar'
  | 'betAmount'
  | 'status'
  | 'level'
  | 'stoppedAt'
  | 'winningAmount'
  | 'denom'
>;

export interface FormattedGameHistoryType
  extends Pick<
    GameStateType,
    | '_id'
    | 'privateHash'
    | 'privateSeed'
    | 'publicSeed'
    | 'crashPoint'
    | 'players'
    | 'created'
  > {}

interface LevelInfo {
  name: string;
  wagerNeeded: number;
  rakebackPercentage: number;
  levelName: string;
  levelColor: string;
}

interface PlayerInfo {
  autoCashOut: number;
  betAmount: number;
  createdAt: string;
  playerID: string;
  username: string;
  avatar: string;
  level: LevelInfo;
  status: number;
  forcedCashout: boolean;
  stoppedAt?: number;
  winningAmount?: number;
}

export interface CrashHistoryData {
  _id: string;
  players: { [key: string]: PlayerInfo };
  crashPoint: number;
}

export interface ICrashHistoryRecord {
  privateHash: string;
  crashPoint: number;
  players: object;
  _id: string;
  created: Date;
}

export interface AutoCrashGameData {
  betAmount: number;
  denom: string;
  cashoutPoint: number;
  count: number;
}

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
  AUTO_CRASHGAME_JOIN_SUCCESS = 'auto-crashgame-join-success',
  GAME_STATUS = 'game-status',
  UPDATE_BALANCE = 'update-wallet',
  NEXT_ROUND_JOIN_SUCCESS = 'next-round-join-success',
  NEXT_ROUND_JOIN_CANCEL = 'next-round-join-cancel'
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
  [ECrashSocketEvent.GAME_TICK]: (data: { e: number; p: number }) => void;
  [ECrashSocketEvent.CRASHGAME_JOIN_SUCCESS]: (
    data: FormattedPlayerBetType
  ) => void;
  [ECrashSocketEvent.BET_CASHOUT_ERROR]: (data: string) => void;
  [ECrashSocketEvent.BET_CASHOUT_SUCCESS]: (result: any) => void;
  [ECrashSocketEvent.PREVIOUS_CRASHGAME_HISTORY]: (histories: any[]) => void;
  [ECrashSocketEvent.GAME_JOIN_ERROR]: (data: string) => void;
  [ECrashSocketEvent.JOIN_CRASH_GAME]: (
    target: number,
    betAmount: number,
    denom: string
  ) => void;
  [ECrashSocketEvent.AUTO_CRASHGAME_JOIN_SUCCESS]: (data: string) => void;
  [ECrashSocketEvent.GAME_STATUS]: (data: {
    players: FormattedPlayerBetType[];
    game_status: number;
  }) => void;
  [ECrashSocketEvent.UPDATE_BALANCE]: (data: number) => void;
  [ECrashSocketEvent.NEXT_ROUND_JOIN_SUCCESS]: () => void;
  [ECrashSocketEvent.NEXT_ROUND_JOIN_CANCEL]: () => void;
}

export interface ICrashClientToServerEvents {
  auth: (token: string) => void;
  [ECrashSocketEvent.JOIN_CRASH_GAME]: (
    target: number,
    betAmount: number
  ) => void;
  [ECrashSocketEvent.BET_CASHOUT]: () => void;
  [ECrashSocketEvent.PREVIOUS_CRASHGAME_HISTORY]: (limit: number) => void;
  [ECrashSocketEvent.AUTO_CRASHGAME_BET]: (data: AutoCrashGameData) => void;
}
