import { LeaderboardType } from '@/types/leader';
import { ELeaderboardSocketAction } from './leaderboard.type';

export interface ILeaderType {
  _id: string;
  username: string;
  rank: number;
  hasVerifiedAccount: boolean;
  createdAt: string;
  leaderboard: LeaderboardType;
}

export interface IStats {
  totalWageredAmount: number;
  totalUsers: number;
  bankroll: number;
}

type TLeaderboardHistory = {
  crash: ILeaderType[];
  coinflip: ILeaderType[];
};

interface ILeaderboardState {
  leaderboardHistory: TLeaderboardHistory;
  stats?: IStats;
}

const initialState: ILeaderboardState = {
  leaderboardHistory: {
    crash: [],
    coinflip: []
  }
};

export default function leaderboardReducer(
  state = initialState,
  action
): ILeaderboardState {
  switch (action.type) {
    case ELeaderboardSocketAction.GET_LEADERBOARD_HISTORY:
      return {
        ...state,
        leaderboardHistory: action.payload as TLeaderboardHistory
      };

    case ELeaderboardSocketAction.GET_STATS:
      return {
        ...state,
        stats: action.payload
      };

    case ELeaderboardSocketAction.DISCONNECT_LEADERBOARD:
      return initialState;

    default:
      return state;
  }
}
