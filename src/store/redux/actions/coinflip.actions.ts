import { ECoinflipSocketAction } from './../reducers/coinflip.type';

export function receiveMsg(msg: string) {
  return {
    type: ECoinflipSocketAction.RECEIVE_MSG,
    payload: msg
  };
}

export function loginCoinflipServer() {
  return {
    type: ECoinflipSocketAction.LOGIN_COINFLIP,
    payload: 'success'
  };
}

export function subscribeCoinflipServer() {
  return {
    type: ECoinflipSocketAction.SUBSCRIBE_COINFLIP,
    payload: null
  };
}

export function coinflipgameRolled(gameData: {
  _id: string;
  randomModule: number;
  coinflipResult: boolean[];
  isEarn: boolean;
}) {
  return {
    type: ECoinflipSocketAction.COINFLIPGAME_ROLLED,
    payload: gameData
  };
}

export function updatedWallet(winAmount: number) {
  return {
    type: ECoinflipSocketAction.UPDATE_WALLET,
    payload: winAmount
  };
}

export function updategameState() {
  return {
    type: ECoinflipSocketAction.COINFLIP_GAME_STATUS,
    payload: null
  };
}

export function disconnectCoinflipServer() {
  return {
    type: ECoinflipSocketAction.DISCONNECT_COINFLIP,
    payload: null
  };
}

export function startCoinflipgame(data: {
  betAmount: number;
  denom: string;
  betCoinsCount: number;
  betSideCount: number;
  betSide: boolean;
}) {
  return {
    type: ECoinflipSocketAction.CREATE_NEW_COINFLIPGAME,
    payload: data
  };
}

export function resetGameState() {
  return {
    type: ECoinflipSocketAction.RESET_GAME_STATE,
    payload: null
  };
}
