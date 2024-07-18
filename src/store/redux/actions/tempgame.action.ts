import { ICrashHistoryRecord } from "@/types";

export function saveGame(game: ICrashHistoryRecord) {
  return {
    type: 'SAVE_GAME',
    payload: game
  };
}

export function removeGame() {
  return {
    type: 'REMOVE_GAME',
  };
}
