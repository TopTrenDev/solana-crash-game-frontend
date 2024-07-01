export const USER_DATA = 'USER_DATA';
export const INIT_USER_DATA = 'INIT_USER_DATA';
export const SITE_BALANCE_STATUS = 'SITE_BALANCE_STATUS';

export interface UserState {
  userData: { username: string; userEmail: string; _id: string };
}

interface UserAction {
  type: string;
  payload: any;
}

const initialState: any = {
  userData: { username: '', userEmail: '', _id: '' },
  siteBalanceStatus: true
};

const userReducer = (state: any = initialState, action: UserAction): any => {
  switch (action.type) {

    case USER_DATA:
      return {
        userData: {
          username: action.payload.username,
          userEmail: action.payload.userEmail,
          _id: action.payload._id
        }
      };

    case INIT_USER_DATA:
      return { userData: { username: '', userEmail: '', _id: '' } };

    case SITE_BALANCE_STATUS:
      return { ...state, siteBalanceStatus: action.payload };

    default:
      return state;
  }
};

export default userReducer;
