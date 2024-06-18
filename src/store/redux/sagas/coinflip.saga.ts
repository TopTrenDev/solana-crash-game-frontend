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

import { coinflipActions } from '../actions';
import { getAccessToken } from '@/utils/axios';
import KartelSocket from '@/utils/socket-service';
import { ECoinflipSocketEvent } from '@/types/coinflip';
import { ECoinflipSocketAction } from '../reducers/coinflip.type';

let socketTask;

function subscribe(socket) {
  return eventChannel((emit) => {
    socket.on(ECoinflipSocketEvent.GAME_CREATION_ERROR, (msg: string) => {
      emit(coinflipActions.receiveMsg(msg));
    });

    socket.on(ECoinflipSocketEvent.COINFLIPGAME_JOIN_SUCCESS, () => {
      emit(coinflipActions.receiveMsg('Game joined successfully'));
    });

    socket.on(ECoinflipSocketEvent.UPDATE_WALLET, (amount) => {
      emit(coinflipActions.updatedWallet(amount));
    });

    socket.on(
      ECoinflipSocketEvent.COINFLIPGAME_ROLLED,
      (gameData: {
        _id: string;
        randomModule: number;
        coinflipResult: boolean[];
        isEarn: boolean;
      }) => {
        emit(coinflipActions.coinflipgameRolled(gameData));
      }
    );

    return () => { };
  });
}

function* login(socket) {
  const token = getAccessToken();
  yield call([socket, socket.emit], ECoinflipSocketEvent.LOGIN, token);
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
    yield fork(read, KartelSocket.coinflip);
    yield delay(200);
  } catch (error) {
    console.log(error);
  }
}

function* loginChanelSaga() {
  try {
    yield delay(500);
    socketTask = yield fork(login, KartelSocket.coinflip);
  } catch (e) {
    console.log(e);
  }
}

function* stopChanelSaga() {
  if (KartelSocket.coinflip) {
    KartelSocket.coinflip.off();
    KartelSocket.coinflip.disconnect();
  }
  yield cancel(socketTask);
}

function* startCoinflipgameSaga(action) {
  yield delay(500);
  KartelSocket.coinflip.emit(
    ECoinflipSocketEvent.CREATE_NEW_COINFLIPGAME,
    action.payload
  );
}

const sagas = [
  takeLatest(ECoinflipSocketAction.SUBSCRIBE_COINFLIP, subscribeSaga),
  takeLatest(ECoinflipSocketAction.LOGIN_COINFLIP, loginChanelSaga),
  takeLatest(ECoinflipSocketAction.DISCONNECT_COINFLIP, stopChanelSaga),
  takeEvery(
    ECoinflipSocketAction.CREATE_NEW_COINFLIPGAME,
    startCoinflipgameSaga
  )
];

export default sagas;
