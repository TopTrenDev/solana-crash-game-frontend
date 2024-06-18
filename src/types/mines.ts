export enum EMinesSocketEvent {
  LOGIN = 'auth',
  CREATE_NEW_MINESGAME = 'create-new-minesgame',
  MINESGAME_ROLLED = 'minesgame-rolled',
  MINESGAME_ENDED = 'minesgame-ended',
  MINES_ROLLING = 'mines-rolling',
  GAME_CREATION_ERROR = 'game-creation-error',
  MINES_CASHOUT = 'mines-cashout'
}

export interface IMinesServerToClientEvents {
  [EMinesSocketEvent.LOGIN]: (token: string) => void;
  [EMinesSocketEvent.CREATE_NEW_MINESGAME]: (data: number[]) => void;
  [EMinesSocketEvent.MINESGAME_ROLLED]: (data: boolean) => void;
  [EMinesSocketEvent.MINESGAME_ENDED]: (data: { winAmount: number | null, mines: number[] }) => void;
  [EMinesSocketEvent.GAME_CREATION_ERROR]: (data: string) => void;
  [EMinesSocketEvent.MINES_CASHOUT]: () => void;
}

export interface IMinesClientToServerEvents {
  [EMinesSocketEvent.CREATE_NEW_MINESGAME]: (data: {
    betAmount: number;
    denom: string;
    betMinesCount: number;
  }) => void;
  [EMinesSocketEvent.MINES_ROLLING]: (position: number) => void;
}
