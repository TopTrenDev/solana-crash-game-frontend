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
    };
    wager: number;
  };
  histories: any[];
}

export enum EUserSocketEvent {
  USER_AUTH = 'auth',
  USER_JOIN_ERROR = 'user-join-error',

  CREDIT_BALANCE = 'credit-balance',
  CREDIT_TIP = 'credit-tip',
  CREDIT_TIP_SUCCESS = 'credit-tip-success',
  CREDIT_TIP_ERROR = 'credit-tip-error'
}

export interface IUserServerToClientEvents {
  [EUserSocketEvent.USER_JOIN_ERROR]: (data: string) => void;
  [EUserSocketEvent.CREDIT_BALANCE]: (data: { credit: number }) => void;
  [EUserSocketEvent.CREDIT_TIP_SUCCESS]: () => void;
  [EUserSocketEvent.CREDIT_TIP_ERROR]: (data: string) => void;
}

export interface IUserClientToServerEvents {
  auth: (token: string) => void;
  [EUserSocketEvent.CREDIT_BALANCE]: (userId: string) => void;
  [EUserSocketEvent.CREDIT_TIP]: (data: {
    username: string;
    tipsAmount: number;
    password: string;
  }) => void;
}
