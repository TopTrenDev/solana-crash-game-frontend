import { saveUser, removeUser } from '@/store/redux/actions/tempuser.action';
import { IChatUser } from '@/types';
import { useDispatch } from 'react-redux';

export default function useTempuser() {
  const dispatch = useDispatch();
  const save = (user: IChatUser) => dispatch(saveUser(user));
  const remove = () => dispatch(removeUser());
  return { save, remove };
}
