export function saveGame(gameId: string) {
  return {
    type: 'SAVE_GAME',
    payload: gameId
  };
}

export function removeGame() {
  return {
    type: 'REMOVE_GAME',
  };
}
