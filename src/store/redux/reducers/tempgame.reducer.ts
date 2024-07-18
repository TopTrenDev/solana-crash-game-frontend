import { ICrashHistoryRecord } from "@/types";

export const SAVE_GAME = 'SAVE_GAME';
export const REMOVE_GAME = 'REMOVE_GAME';

interface GameAction {
  type: string;
  payload: ICrashHistoryRecord;
}

export interface TempGameState {
  isGame: boolean;
  game: ICrashHistoryRecord | null;
}

const initialState: TempGameState = { isGame: false, game: null };

const tempGameReducer = (
  state: TempGameState = initialState,
  action: GameAction
): TempGameState => {
  switch (action.type) {
    case SAVE_GAME:
      return { isGame: true, game: action.payload };
    case REMOVE_GAME:
      return { isGame: false, game: null };
    default:
      return state;
  }
};

export default tempGameReducer;
