import { IChatUser } from '@/types';
import { EUserSocketAction } from './user.type';

export interface UserState {
  userData: {
    _id: string;
    username: string;
    email: string;
    wallet: string;
    credit: number;
  };
  aesKey: string;
  selectedUser: IChatUser | null;
}

interface UserAction {
  type: string;
  payload: any;
}

const initialState: UserState = {
  userData: { username: '', email: '', wallet: '', credit: 0, _id: '' },
  aesKey: '',
  selectedUser: null
};

const userReducer = (state: any = initialState, action: UserAction): any => {
  switch (action.type) {
    case EUserSocketAction.USER_DATA:
      return {
        userData: {
          username: action.payload.username,
          email: action.payload.email,
          wallet: action.payload.wallet,
          credit: action.payload.credit,
          _id: action.payload._id,
          aesKey: action.payload.aesKey
        }
      };

    case EUserSocketAction.AES_KEY:
      return {
        ...state,
        aesKey: action.payload
      };

    case EUserSocketAction.INIT_USER_DATA:
      return { userData: { username: '', email: '', _id: '', aesKey: '' } };

    case EUserSocketAction.SITE_BALANCE_UPDATE:
      return {
        ...state,
        userData: { ...state.userData, credit: action.payload }
      };

    case EUserSocketAction.REMEMBERME:
      return {
        ...state,
        remember: action.payload
      };

    case EUserSocketAction.SET_CREDENTIALS:
      return {
        ...state,
        credentials: action.payload
      };

    case EUserSocketAction.REMOVE_CREDENTIALS:
      return {
        ...state,
        credentials: { username: '', password: '' }
      };

    case EUserSocketAction.SAVE_USER:
      return {
        ...state,
        selectedUser: action.payload
      };

    case EUserSocketAction.REMOVE_USER:
      return {
        ...state,
        selectedUser: null
      };

    default:
      return state;
  }
};

export default userReducer;
