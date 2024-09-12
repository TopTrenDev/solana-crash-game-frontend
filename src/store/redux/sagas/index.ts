import { all } from 'redux-saga/effects';

import chatSagas from './chat.saga';
// import leaderboardSagas from './leaderboard.saga';
// import minesSagas from './mines.saga';
import paymentSagas from './payment.saga';
export default function* rootSaga() {
  yield all([
    ...chatSagas,
    ...paymentSagas,
    //  ...leaderboardSagas,
    //   ...minesSagas
  ]);
}
