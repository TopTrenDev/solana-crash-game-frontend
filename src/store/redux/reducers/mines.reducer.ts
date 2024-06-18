import { EMinesSocketAction } from './mines.type';

interface IMinesState {
  loginStatus: boolean;
  gameResult: null | boolean;
  rolling: boolean;
  error: string;
  earned: number;
  mines: number[];
}

const initialState = {
  loginStatus: false,
  gameResult: null,
  rolling: false,
  error: '',
  earned: 0,
  mines: []
};

export default function minesReducer(
  state: IMinesState = initialState,
  action
): IMinesState {
  switch (action.type) {

    case EMinesSocketAction.LOGIN_MINES:
      return { ...state, loginStatus: true };

    case EMinesSocketAction.MINES_ROLLING:
      return { ...state, rolling: true };

    case EMinesSocketAction.MINESGAME_ROLLED:
      return { ...state, gameResult: action.payload };

    case EMinesSocketAction.RECEIVE_ERROR:
      return { ...state, error: action.payload };

    case EMinesSocketAction.GAME_WON:
      return { ...state, earned: action.payload.winAmount, mines: action.payload.mines };

    default:
      return state;
  }
}
