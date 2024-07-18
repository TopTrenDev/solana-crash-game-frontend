import { IChatUser } from "@/types";

export function saveUser(user: IChatUser) {
  return {
    type: 'SAVE_USER',
    payload: user
  };
}

export function removeUser() {
  return {
    type: 'REMOVE_USER',
  };
}
