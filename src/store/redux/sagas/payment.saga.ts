import { eventChannel } from 'redux-saga';

import {
  put,
  call,
  fork,
  take,
  cancel,
  takeLatest,
  delay
} from 'redux-saga/effects';

import { paymentActions, userActions } from '../actions';
import { getAccessToken } from '@/utils/axios';
import GameSocket from '@/utils/socket-service';
import { EPaymentEvents } from '@/types/payment';
import { EPaymentSocketAction } from '../reducers/payment.type';

let socketTask;

function subscribe(socket) {
  return eventChannel((emit) => {
    socket.on(EPaymentEvents.updateBalance, (data: number) => {
      emit(paymentActions.updateBalancePayment(data));
      emit(userActions.siteBalanceUpdate(data));
    });
    socket.on(EPaymentEvents.loginResponse, (data: any) => {
      emit(userActions.setAesKey(data.aesKey));
      emit(userActions.siteBalanceUpdate(data.balance));
    });
    socket.on(EPaymentEvents.paymentFailed, (data: string) => {
      emit(paymentActions.paymentFailed(data));
    });

    return () => {};
  });
}

function* withdraw(socket, action) {
  yield call([socket, socket.emit], EPaymentEvents.withdraw, action.payload);
}

function* tip(socket, action) {
  yield call([socket, socket.emit], EPaymentEvents.tip, action.payload);
}

function* updateBalance(socket) {
  yield call([socket, socket.emit], EPaymentEvents.updateBalance);
}

function* login(socket) {
  const token = getAccessToken();
  yield call([socket, socket.emit], EPaymentEvents.login, token);
}

function* read(socket) {
  const channel = yield call(subscribe, socket);
  while (true) {
    const action = yield take(channel);
    yield put(action);
  }
}

function* withdrawSaga(action) {
  try {
    yield delay(200);
    yield fork(withdraw, GameSocket.payment, action);
  } catch (error) {
    console.error(error);
  }
}

function* tipSaga(action) {
  try {
    yield delay(200);
    yield fork(tip, GameSocket.payment, action);
  } catch (error) {
    console.error(error);
  }
}

function* updateBalanceSaga() {
  try {
    yield delay(200);
    yield fork(updateBalance, GameSocket.payment);
  } catch (error) {
    console.error(error);
  }
}

function* subscribeSaga() {
  try {
    yield fork(read, GameSocket.payment);
    yield delay(200);
  } catch (error) {
    console.error(error);
  }
}

function* loginChanelSaga() {
  try {
    yield delay(500);
    socketTask = yield fork(login, GameSocket.payment);
  } catch (e) {
    console.error(e);
  }
}

function* stopChanelSaga() {
  if (GameSocket.payment) {
    GameSocket.payment.off();
    GameSocket.payment.disconnect();
  }

  yield cancel(socketTask);
}

const sagas = [
  takeLatest(EPaymentSocketAction.SUBSCRIBE_PAYMENT, subscribeSaga),
  takeLatest(EPaymentSocketAction.WITHDRAW, withdrawSaga),
  takeLatest(EPaymentSocketAction.TIP, tipSaga),
  takeLatest(EPaymentSocketAction.UPDATE_BALANCE, updateBalanceSaga),
  takeLatest(EPaymentSocketAction.LOGIN_PAYMENT, loginChanelSaga),
  takeLatest(EPaymentSocketAction.DISCONNECT_PAYMENT, stopChanelSaga)
];

export default sagas;
