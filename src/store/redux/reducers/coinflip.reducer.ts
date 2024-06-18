import { ECoinflipSocketAction } from './coinflip.type';

type ICoinflipData = {
  _id: string;
  randomModule: number;
  coinflipResult: boolean[];
  isEarn: boolean;
};

interface ICoinflipState {
  gameData: ICoinflipData;
  winAmount: number;
  loginStatus: boolean;
  msg: string;
  gameStatus: boolean;
}

const initialState = {
  gameData: {
    _id: '',
    randomModule: 0,
    coinflipResult: [true],
    isEarn: false
  },
  winAmount: 0,
  loginStatus: false,
  msg: '',
  gameStatus: false
};

export default function coinflipReducer(
  state = initialState,
  action
): ICoinflipState {
  switch (action.type) {
    case ECoinflipSocketAction.RECEIVE_MSG:
      return { ...state, msg: action.payload };

    case ECoinflipSocketAction.COINFLIPGAME_ROLLED:
      return {
        ...state,
        gameData: { ...state.gameData, ...(action.payload as ICoinflipData) },
        gameStatus: true
      };

    case ECoinflipSocketAction.UPDATE_WALLET:
      return { ...state, winAmount: action.payload };

    case ECoinflipSocketAction.LOGIN_COINFLIP:
      return { ...state, loginStatus: true };

    case ECoinflipSocketAction.COINFLIP_GAME_STATUS:
      return { ...state, gameStatus: false };

    case ECoinflipSocketAction.RESET_GAME_STATE:
      return { ...state, gameStatus: false, gameData: initialState.gameData };

    default:
      return state;
  }
}
