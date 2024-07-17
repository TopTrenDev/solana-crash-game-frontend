export const SAVE_GAME = 'SAVE_GAME';
export const REMOVE_GAME = 'REMOVE_GAME';

interface GameAction {
  type: string;
  payload: string;
}

export interface TempGameState {
  isGame: boolean;
  gameId: string;
}

const initialState: TempGameState = { isGame: false, gameId: '' };

const tempGameReducer = (
  state: TempGameState = initialState,
  action: GameAction
): TempGameState => {
  switch (action.type) {
    case SAVE_GAME:
      return { isGame: true, gameId: action.payload };
    case REMOVE_GAME:
      return { isGame: false, gameId: '' };
    default:
      return state;
  }
};

export default tempGameReducer;
