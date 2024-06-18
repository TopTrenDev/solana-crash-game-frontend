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

type TLeaderboardHistory = {
  crash: ILeaderType[];
  coinflip: ILeaderType[];
};

interface ILeaderboardState {
  leaderboardHistory: TLeaderboardHistory;
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

    case ELeaderboardSocketAction.DISCONNECT_LEADERBOARD:
      return initialState;

    default:
      return state;
  }
}
