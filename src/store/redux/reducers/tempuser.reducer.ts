import { IChatUser } from "@/types";

export const SAVE_USER = 'SAVE_USER';
export const REMOVE_USER = 'REMOVE_USER';

interface UserAction {
  type: string;
  payload: IChatUser;
}

export interface TempUserState {
  isUser: boolean;
  user: IChatUser | null;
}

const initialState: TempUserState = { isUser: false, user: null };

const tempUserReducer = (
  state: TempUserState = initialState,
  action: UserAction
): TempUserState => {
  switch (action.type) {
    case SAVE_USER:
      return { isUser: true, user: action.payload };
    case REMOVE_USER:
      return { isUser: false, user: null };
    default:
      return state;
  }
};

export default tempUserReducer;
