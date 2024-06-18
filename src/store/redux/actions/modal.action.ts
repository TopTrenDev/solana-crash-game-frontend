import { ModalType } from '@/types/modal';

export function openModal(modalType: ModalType) {
  return {
    type: 'OPEN_MODAL',
    payload: modalType
  };
}

export function closeModal(modalType: ModalType) {
  return {
    type: 'CLOSE_MODAL',
    payload: modalType
  };
}
