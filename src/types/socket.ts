import {
  FormattedGameHistoryType,
  FormattedPlayerBetType,
  PendingBetType
} from './crash';

export interface ServerToClientEvents {
  error: (data: string) => void;
  'user banned': () => void;
  'notify-error': (data: string) => void;
  'game-join-error': (data: string) => void;
  'update-credit': (data: number) => void;
  'bet-cashout-error': (data: string) => void;
  'bet-cashout-success': (result: any) => void;
  'game-call-bot-error': (error: string) => void;
  'game-call-bot-success': () => void;

  //crashgame Events
  'game-bets': (bets: PendingBetType[]) => void;
  'game-starting': (data: {
    _id: string | null;
    privateHash: string | null;
    timeUntilStart?: number;
  }) => void;
  'game-start': (data: { publicSeed: string }) => void;
  'bet-cashout': (data: {
    playerID: string;
    status: number;
    stoppedAt: number | undefined;
    winningAmount: number;
  }) => void;
  'game-end': (data: { game: FormattedGameHistoryType }) => void;
  'game-tick': (data: number) => void;
  'crashgame-join-success': (data: FormattedPlayerBetType) => void;
  'previous-crashgame-history': (count: number) => void;
  connection_kicked: () => void;

  //chat
  message: (data: { _id: string; message: string }) => void;
}

export interface ClientToServerEvents {
  hello: () => void;
  //crashgame events
  auth: (token: string) => void;
  'join-crash-game': (target: number, betAmount: number, denom: string) => void;
  'bet-cashout': () => void;

  //chat
  'join-chat': (_id: string) => void;
  message: (data: { _id: string; message: string }) => void;
}

export interface InterServerEvents {
  ping: () => void;

  //common Events
}

export interface InterCoinflipGameServerEvents {}

export interface SocketData {
  lastAccess?: number;
  markedForDisconnect?: boolean;
}

export type ServerType = {
  clientToServerEvents: ClientToServerEvents;
  serverToClientEvents: ServerToClientEvents;
  interServerEvents: InterServerEvents;
  socketData: SocketData;
};
