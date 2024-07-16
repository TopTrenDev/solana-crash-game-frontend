export const SAVE_USER = 'SAVE_USER';
export const REMOVE_USER = 'REMOVE_USER';

interface UserAction {
  type: string;
  payload: string;
}

export interface TempUserState {
  isUser: boolean;
  userId: string;
}

const initialState: TempUserState = { isUser: false, userId: '' };

const tempUserReducer = (
  state: TempUserState = initialState,
  action: UserAction
): TempUserState => {
  switch (action.type) {
    case SAVE_USER:
      return { isUser: true, userId: action.payload };
    case REMOVE_USER:
      return { isUser: false, userId: '' };
    default:
      return state;
  }
};

export default tempUserReducer;
