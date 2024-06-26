import AddGoldModal from './add-gold';
import BacktestingModal from './backtesting';
import BankrollModal from './bankroll';
import DepositModal from './deposit';
import LeaderboardModal from './leaderboard';
import SignInModal from './signin';
import SignUpModal from './signup';
import StatsModal from './stats';

const Modal = () => {
  return (
    <>
      <SignInModal />
      <SignUpModal />
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
