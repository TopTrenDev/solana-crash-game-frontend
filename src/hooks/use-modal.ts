import { ModalType } from './../types/modal';
import { closeModal, openModal } from '@/store/redux/actions/modal.action';
import { useDispatch } from 'react-redux';

export default function useModal() {
  const dispatch = useDispatch();
  const open = (type: ModalType) => dispatch(openModal(type));
  const close = (type: ModalType) => dispatch(closeModal(type));
  return { open, close };
}
