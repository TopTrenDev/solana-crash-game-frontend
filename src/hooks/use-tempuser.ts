import { saveUser, removeUser } from '@/store/redux/actions/tempuser.action';
import { useDispatch } from 'react-redux';

export default function useTempuser() {
  const dispatch = useDispatch();
  const save = (userId: string) => dispatch(saveUser(userId));
  const remove = () => dispatch(removeUser());
  return { save, remove };
}
