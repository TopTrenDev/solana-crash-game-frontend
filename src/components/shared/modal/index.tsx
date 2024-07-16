import AddGoldModal from './add-gold';
import BacktestingModal from './backtesting';
import BankrollModal from './bankroll';
import CashierModal from './cashier';
import LeaderboardModal from './leaderboard';
import LoginModal from './login';
import RegisterModal from './register';
import StatsModal from './stats';
import UserInfoModal from './userinfo';

const Modal = () => {
  return (
    <>
      <LoginModal />
      <RegisterModal />
      <CashierModal />
      <AddGoldModal />
      <BankrollModal />
      <BacktestingModal />
      <StatsModal />
      <LeaderboardModal />
      <UserInfoModal />
    </>
  );
};

export default Modal;
