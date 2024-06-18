import { combineReducers, configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './sagas';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

// reducers
import userReducer from './reducers/user.reducer';
import chatReducer from './reducers/chat.reducer';
import leaderboardReducer from './reducers/leaderboard.reducer';
import coinflipReducer from './reducers/coinflip.reducer';
import minesReducer from './reducers/mines.reducer';
import modalReducer from './reducers/modal.reducer';

const sagaMiddleware = createSagaMiddleware();

const userPersistConfig = {
  key: 'user',
  storage: storage,
};

const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, userReducer),
  chat: chatReducer,
  leaderboard: leaderboardReducer,
  coinflip: coinflipReducer,
  mines: minesReducer,
  modal: modalReducer
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/PAUSE', 'persist/PURGE', 'persist/FLUSH', 'persist/REGISTER']
      }
    }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

const persistor = persistStore(store);

export default store;
export { persistor };

type AppDispatch = typeof store.dispatch;
type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;