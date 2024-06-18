import VIPLevelType from './vipLevel';

export interface ICoinPlayer {
  _id: string;
  username: string;
  avatar: string;
  color: string;
  level: VIPLevelType;
  isBot?: boolean;
}

export enum ECoinflipSocketEvent {
  LOGIN = 'auth',
  CREATE_NEW_COINFLIPGAME = 'create-new-coinflipgame',
  JOIN_COINFLIPGAME = 'join-coinflipgame',
  COINFLIPGAME_JOIN_SUCCESS = 'coinflipgame-join-success',
  COINFLIPGAME_JOINED = 'coinflipgame-joined',
  COINFLIPGAME_ROLLING = 'coinflipgame-rolling',
  COINFLIPGAME_ROLLED = 'coinflipgame-rolled',
  UPDATE_WALLET = 'update-wallet',
  GAME_CREATION_ERROR = 'game-creation-error'
}

export interface ICoinflipServerToClientEvents {
  [ECoinflipSocketEvent.LOGIN]: (token: string) => void;
  [ECoinflipSocketEvent.COINFLIPGAME_JOIN_SUCCESS]: () => void;
  [ECoinflipSocketEvent.COINFLIPGAME_JOINED]: (data: {
    _id: string;
    newPlayer: ICoinPlayer;
  }) => void;
  [ECoinflipSocketEvent.COINFLIPGAME_ROLLING]: (data: {
    game_id: string;
    animation_time: number;
  }) => void;
  [ECoinflipSocketEvent.COINFLIPGAME_ROLLED]: ({
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
  [ECoinflipSocketEvent.UPDATE_WALLET]: (amount: number) => void;
  [ECoinflipSocketEvent.GAME_CREATION_ERROR]: (message: string) => void;
}

export interface ICoinflipClientToServerEvents {
  auth: (token: string) => void;
  [ECoinflipSocketEvent.CREATE_NEW_COINFLIPGAME]: (data: {
    betAmount: number;
    denom: string;
    betCoinsCount: number;
    betSideCount: number;
    betSide: boolean;
  }) => void;
}
