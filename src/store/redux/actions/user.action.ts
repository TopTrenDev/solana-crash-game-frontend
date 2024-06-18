import { INIT_USER_DATA, USER_DATA } from '../reducers/user.reducer';

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
