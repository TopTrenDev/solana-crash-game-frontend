import { ICoinPlayer } from './coinflip';
import {
  FormattedGameHistoryType,
  PendingBetType,
  FormattedPlayerBetType
} from './crashGame';

export interface ServerToClientEvents {
  error: (data: string) => void;
  'user banned': () => void;
  'notify-error': (data: string) => void;
  'game-join-error': (data: string) => void;
  'update-wallet': (data: number) => void;
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

  //conflipgame Events
  'game-creation-error': (message: string) => void;
  'new-coinflip-game': (gameData: any) => void;
  'private-game-created': (inviteLink: string) => void;
  'coinflipgame-join-success': () => void;
  'coinflipgame-joined': (data: {
    _id: string;
    newPlayer: ICoinPlayer;
  }) => void;
  'coinflipgame-rolling': (game_id: string) => void;
  'coinflipgame-rolled': ({
    _id,
    randomModule,
    coinflipResult,
    isEarn
  }: {
    _id: string;
    randomModule: number;
    coinflipResult: boolean[];
    isEarn: boolean;
  }) => void;
  'game-called-bot': (data: { _id: string; playerId: string }) => void;

  //chat
  message: (data: { _id: string; message: string }) => void;
}

export interface ClientToServerEvents {
  hello: () => void;
  //crashgameevents
  auth: (token: string) => void;
  'join-crash-game': (target: number, betAmount: number, denom: string) => void;
  'bet-cashout': () => void;

  //coinflipgameevents
  'create-new-game': (data: {
    betAmount: number;
    betCoinsCount: number;
    betSide: boolean;
    betSideCount: number;
  }) => void;
  'join-coinflip-game': (data: { gameId: string; color: string }) => void;

  //chat
  'join-chat': (_id: string) => void;
  message: (data: { _id: string; message: string }) => void;
}

export interface InterServerEvents {
  ping: () => void;

  //common Events
}

export interface InterCoinflipGameServerEvents { }

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
