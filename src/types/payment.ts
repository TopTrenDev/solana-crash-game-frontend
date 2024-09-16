export enum EPaymentEvents {
  login = 'login',
  loginResponse = 'login-response',
  withdraw = 'withdraw',
  tip = 'tip',
  updateBalance = 'update-balance',
  paymentFailed = 'payment-failed'
}

export type TSocketTipParam = {
  amount: number;
  currency: string;
  address: string;
  txHash: string;
};

export type TSocketWithDrawParam = {
  amount: number;
  address: string;
  password: string;
};

export interface IPaymentClientToServerEvents {
  [EPaymentEvents.login]: (token: string) => void;
  [EPaymentEvents.withdraw]: (data: TSocketWithDrawParam) => void;
  [EPaymentEvents.tip]: (data: TSocketTipParam) => void;
}

export interface IPaymentServerToClientEvents {
  [EPaymentEvents.updateBalance]: (data: number) => void;
}
