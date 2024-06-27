import AddGoldModal from './add-gold';
import BacktestingModal from './backtesting';
import BankrollModal from './bankroll';
import DepositModal from './deposit';
import LeaderboardModal from './leaderboard';
import LoginModal from './login';
import RegisterModal from './register';
import StatsModal from './stats';

const Modal = () => {
  return (
    <>
      <LoginModal />
      <RegisterModal />
      <DepositModal />
      <AddGoldModal />
      <BankrollModal />
      <BacktestingModal />
      <StatsModal />
      <LeaderboardModal />
    </>
  );
};

export default Modal;
