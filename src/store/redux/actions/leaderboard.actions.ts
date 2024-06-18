import { ILeaderType } from '../reducers/leaderboard.reducer';
import { ELeaderboardSocketAction } from '../reducers/leaderboard.type';

export function getLeaderboardHistory(leaderboardHistory: ILeaderType[]) {
  return {
    type: ELeaderboardSocketAction.GET_LEADERBOARD_HISTORY,
    payload: leaderboardHistory
  };
}

export function subscribeLeaderboardServer() {
  return {
    type: ELeaderboardSocketAction.SUBSCRIBE_LEADERBOARD,
    payload: null
  };
}

export function disconnectLeaderboardServer() {
  return {
    type: ELeaderboardSocketAction.DISCONNECT_LEADERBOARD,
    payload: null
  };
}
