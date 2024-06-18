import { combineReducers } from '@reduxjs/toolkit';

import chatReducer from './chat.reducer';
import leaderboardReducer from './leaderboard.reducer';
import coinflipReducer from './coinflip.reducer';
import modalReducer from './modal.reducer';
import userReducer from './user.reducer';
import minesReducer from './mines.reducer';

export default () => {
  return combineReducers({
    chat: chatReducer,
    leaderboard: leaderboardReducer,
    coinflip: coinflipReducer,
    modal: modalReducer,
    user: userReducer,
    mines: minesReducer
  });
};
