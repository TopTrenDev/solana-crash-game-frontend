import { EUserSocketAction } from './user.type';

export interface UserState {
  userData: { username: string; email: string; _id: string; aesKey: string };
}

interface UserAction {
  type: string;
  payload: any;
}

const initialState: any = {
  userData: { username: '', email: '', wallet: '', credit: 0, _id: '' },
  siteBalanceStatus: true,
  aesKey: ''
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
      return { ...state, siteBalanceStatus: action.payload };

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

    default:
      return state;
  }
};

export default userReducer;
