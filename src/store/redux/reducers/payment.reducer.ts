import { EPaymentSocketAction } from './payment.type';

export interface IPaymentState {
  txProgress: boolean;
  loginStatus: boolean;
  error: string;
}

const initialState: IPaymentState = {
  loginStatus: false,
  txProgress: false,
  error: ''
};

export default function paymentReducer(
  state = initialState,
  action
): IPaymentState {
  switch (action.type) {
    case EPaymentSocketAction.WITHDRAW:
      return {
        ...state,
        txProgress: true
      };

    case EPaymentSocketAction.PAYMENT_FAILED:
      return {
        ...state,
        error: action.payload,
        txProgress: false
      };

    case EPaymentSocketAction.TIP:
      return {
        ...state,
        txProgress: true
      };

    case EPaymentSocketAction.SET_TXPROGRESS:
      return {
        ...state,
        txProgress: action.payload
      };

    case EPaymentSocketAction.UPDATE_BALANCE:
      return {
        ...state,
        txProgress: false
      };

    case EPaymentSocketAction.LOGIN_PAYMENT:
      return { ...state, loginStatus: true };

    default:
      return state;
  }
}
