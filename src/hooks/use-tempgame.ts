import { saveGame, removeGame } from '@/store/redux/actions/tempgame.action';
import { useDispatch } from 'react-redux';

export default function useTempGame() {
  const dispatch = useDispatch();
  const save = (gameId: string) => dispatch(saveGame(gameId));
  const remove = () => dispatch(removeGame());
  return { save, remove };
}
