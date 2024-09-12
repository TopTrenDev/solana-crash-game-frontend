import { combineReducers } from '@reduxjs/toolkit';

import chatReducer from './chat.reducer';
import leaderboardReducer from './leaderboard.reducer';
import modalReducer from './modal.reducer';
import userReducer from './user.reducer';
import tempUserReducer from './tempuser.reducer';
import paymentReducer from './payment.reducer';

export default () => {
  return combineReducers({
    chat: chatReducer,
    leaderboard: leaderboardReducer,
    modal: modalReducer,
    user: userReducer,
    tempuser: tempUserReducer,
    payment: paymentReducer
  });
};
