import { EUserSocketAction } from '../reducers/user.type';

export type TUserData = {
  userData: {
    username: string;
    userEmail: string;
    _id: string;
  };
};

export function userData(data: any) {
  return {
    type: EUserSocketAction.USER_DATA,
    payload: data
  };
}

export function initUserData() {
  return {
    type: EUserSocketAction.INIT_USER_DATA,
    payload: null
  };
}

export function rememberMe(remember: boolean) {
  return {
    type: EUserSocketAction.REMEMBERME,
    payload: remember
  };
}

export function setCredential(credentials: {
  username: string;
  password: string;
}) {
  return {
    type: EUserSocketAction.SET_CREDENTIALS,
    payload: credentials
  };
}

export function removeCredential() {
  return {
    type: EUserSocketAction.REMOVE_CREDENTIALS,
    payload: null
  };
}

export function siteBalanceUpdate(value: number) {
  return {
    type: EUserSocketAction.SITE_BALANCE_UPDATE,
    payload: value
  };
}

export function setAesKey(value: string) {
  return {
    type: EUserSocketAction.AES_KEY,
    payload: value
  };
}

export function disconnectUserServer() {
  return {
    type: EUserSocketAction.DISCONNECT_USER,
    payload: null
  };
}
