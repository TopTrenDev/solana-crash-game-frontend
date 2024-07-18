import { saveGame, removeGame } from '@/store/redux/actions/tempgame.action';
import { ICrashHistoryRecord } from '@/types';
import { useDispatch } from 'react-redux';

export default function useTempGame() {
  const dispatch = useDispatch();
  const save = (game: ICrashHistoryRecord) => dispatch(saveGame(game));
  const remove = () => dispatch(removeGame());
  return { save, remove };
}
