import { put, call, fork, take, takeLatest, delay } from 'redux-saga/effects';
import KartelSocket from '@/utils/socket-service';
import { ELeaderboardSocketEvent } from '@/types/leader';
import { ELeaderboardSocketAction } from '../reducers/leaderboard.type';
import { eventChannel } from 'redux-saga';
import { ILeaderType } from '../reducers/leaderboard.reducer';
import { leaderboardActions } from '../actions';

function subscribe(socket) {
  return eventChannel((emit) => {
    socket.on(
      ELeaderboardSocketEvent.GET_LEADERBOARD_HISTORY,
      (data: { message: string; leaderboard: ILeaderType[] }) => {
        emit(leaderboardActions.getLeaderboardHistory(data.leaderboard));
      }
    );
    return () => { };
  });
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
    yield delay(300);
    yield fork(read, KartelSocket.leaderboard);
    yield delay(300);
  } catch (error) {
    console.error(error);
  }
}

function* stopChannelSaga() {
  if (KartelSocket.leaderboard) {
    KartelSocket.leaderboard.off();
    KartelSocket.leaderboard.disconnect();
  }
}

const sagas = [
  takeLatest(ELeaderboardSocketAction.SUBSCRIBE_LEADERBOARD, subscribeSaga),
  takeLatest(ELeaderboardSocketAction.DISCONNECT_LEADERBOARD, stopChannelSaga)
];

export default sagas;
