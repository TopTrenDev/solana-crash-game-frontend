import { EPaymentSocketAction } from '../reducers/payment.type';

export function withDraw(data: string) {
  return {
    type: EPaymentSocketAction.WITHDRAW,
    payload: data
  };
}

export function tip(data: string) {
  return {
    type: EPaymentSocketAction.TIP,
    payload: data
  };
}

export function setTxProgress(status: boolean) {
  return {
    type: EPaymentSocketAction.SET_TXPROGRESS,
    payload: status
  };
}

export function paymentFailed(msg: string) {
  return {
    type: EPaymentSocketAction.PAYMENT_FAILED,
    payload: msg
  };
}

export function loginPaymentServer() {
  return {
    type: EPaymentSocketAction.LOGIN_PAYMENT,
    payload: 'success'
  };
}

export function subscribePaymentServer() {
  return {
    type: EPaymentSocketAction.SUBSCRIBE_PAYMENT,
    payload: null
  };
}

export function disconnectPaymentServer() {
  return {
    type: EPaymentSocketAction.DISCONNECT_PAYMENT,
    payload: null
  };
}

export function updateBalancePayment(data: number) {
  return {
    type: EPaymentSocketAction.UPDATE_BALANCE,
    payload: data
  };
}
