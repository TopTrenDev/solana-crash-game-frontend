import { eventChannel } from 'redux-saga';

import {
  put,
  call,
  fork,
  take,
  cancel,
  takeLatest,
  takeEvery,
  delay
} from 'redux-saga/effects';

import { minesActions } from '../actions';
import { getAccessToken } from '@/utils/axios';
import KartelSocket from '@/utils/socket-service';
import { EMinesSocketEvent } from '@/types/mines';
import { EMinesSocketAction } from '../reducers/mines.type';

let socketTask;

function subscribe(socket) {
  return eventChannel((emit) => {

    socket.on(EMinesSocketEvent.MINESGAME_ROLLED, (data: boolean) => {
      emit(minesActions.minesgameRolled(data));
    });

    socket.on(EMinesSocketEvent.GAME_CREATION_ERROR, (data: string) => {
      emit(minesActions.receiveError(data));
    });

    socket.on(EMinesSocketEvent.MINESGAME_ENDED, (data) => {
      emit(minesActions.gameWon(data));
    });

    return () => {
    };
  });
}

function* login(socket) {
  const token = getAccessToken();
  yield call([socket, socket.emit], EMinesSocketEvent.LOGIN, token);
}

function* read(socket) {
  const channel = yield call(subscribe, socket);
  while (true) {
    const action = yield take(channel);
    yield put(action);
  }
}

function* subscribeSaga() {
  try {
    yield fork(read, KartelSocket.mines);
    yield delay(200);
  } catch (error) {
    console.log(error);
  }
}

function* loginChanelSaga() {
  try {
    yield delay(500);
    socketTask = yield fork(login, KartelSocket.mines);
  } catch (e) {
    console.log(e);
  }
}

function* stopChanelSaga() {
  if (KartelSocket.mines) {
    KartelSocket.mines.off();
    KartelSocket.mines.disconnect();
  }
  yield cancel(socketTask);
}

function* cashoutMinesgameSaga(action) {
  yield delay(300);
  KartelSocket.mines.emit(EMinesSocketEvent.MINES_CASHOUT);
}

function* rollingMinesgameSaga(action) {
  yield delay(500);
  KartelSocket.mines.emit(
    EMinesSocketEvent.MINES_ROLLING,
    action.payload
  );
}

function* startMinesgameSaga(action) {
  yield delay(300);
  KartelSocket.mines.emit(EMinesSocketEvent.CREATE_NEW_MINESGAME, action.payload);
}

const sagas = [
  takeLatest(EMinesSocketAction.LOGIN_MINES, loginChanelSaga),
  takeLatest(EMinesSocketAction.DISCONNECT_MINES, stopChanelSaga),
  takeLatest(EMinesSocketAction.SUBSCRIBE_MINES, subscribeSaga),
  takeEvery(EMinesSocketAction.CREATE_NEW_MINESGAME, startMinesgameSaga),
  takeEvery(EMinesSocketAction.MINES_ROLLING, rollingMinesgameSaga),
  takeEvery(EMinesSocketAction.CASHOUT_MINESGAME, cashoutMinesgameSaga)
];

export default sagas;
