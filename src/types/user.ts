export interface IChatUser {
  _id: string;
  username: string;
  avatar: string;
  hasVerifiedAccount: boolean;
  createdAt: Date;
  stats: {
    played: number;
    profit: {
      high: number;
      low: number;
      total: number;
    }
    wager: number;
  }
}

export enum EUserSocketEvent {
  CREDIT_BALANCE = 'credit-balance'
}

export interface IUserServerToClientEvents {
  [EUserSocketEvent.CREDIT_BALANCE]: (data: {
    username: string;
    credit: number;
  }) => void;
}

export interface IUserClientToServerEvents {
  auth: (token: string) => void;
  [EUserSocketEvent.CREDIT_BALANCE]: (userId: string) => void;
}
