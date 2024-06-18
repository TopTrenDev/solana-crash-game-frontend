import VIPLevelType from './vipLevel';

export interface IToken {
  name: string;
  src: string;
  denom: string;
}
export interface GameStateType {
  _id: string;
  status: number;
  crashPoint: number | null;
  startedAt: Date | null;
  duration: number | null;
  players: { [key: string]: BetType };
  pending: { [key: string]: PendingBetType };
  pendingCount: number;
  pendingBets: PendingBetType[];
  privateSeed: string | null;
  privateHash: string | null;
  publicSeed: string | null;
  createdAt?: Date;
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
    | 'createdAt'
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

export interface AutoCrashGameData {
  betAmount: number;
  denom: string;
  cashoutPoint: number;
  count: number;
}
