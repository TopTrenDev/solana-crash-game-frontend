import {
  INIT_USER_DATA,
  SITE_BALANCE_STATUS,
  USER_DATA
} from '../reducers/user.reducer';

export type TUserData = {
  userData: {
    username: string;
    userEmail: string;
    _id: string;
  };
};

export function userData(data: any) {
  return {
    type: USER_DATA,
    payload: data
  };
}

export function initUserData() {
  return {
    type: INIT_USER_DATA,
    payload: null
  };
}
export function siteBalanceStatus(data: boolean) {
  return {
    type: SITE_BALANCE_STATUS,
    payload: data
  };
}
