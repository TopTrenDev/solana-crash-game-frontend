export interface LeaderboardType {
  coinflip: any;
  crash: any;
}

export enum ELeaderboardSocketEvent {
  GET_LEADERBOARD_HISTORY = 'leaderboard-fetch-all'
}

export interface ILeaderboardClientToServerEvents {}
export interface ILeaderboardServerToClientEvents {
  [ELeaderboardSocketEvent.GET_LEADERBOARD_HISTORY]: (data: {
    message: string;
    leaderboard: LeaderboardType;
  }) => void;
}
