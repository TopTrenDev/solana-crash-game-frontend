import { ModalType } from '@/types/modal';

export const OPEN_MODAL = 'OPEN_MODAL';
export const CLOSE_MODAL = 'CLOSE_MODAL';

interface ModalAction {
  type: string;
  payload: ModalType;
}

export interface ModalState {
  open: boolean;
  type: ModalType;
}

const initialState: ModalState = { open: false, type: ModalType.LOGIN };

const modalReducer = (
  state: ModalState = initialState,
  action: ModalAction
): ModalState => {
  switch (action.type) {
    case OPEN_MODAL:
      return { open: true, type: action.payload };
    case CLOSE_MODAL:
      return { open: false, type: state.type };
    default:
      return state;
  }
};

export default modalReducer;
