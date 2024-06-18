import AddGoldModal from './add-gold';
import DepositModal from './deposit';
import SignInModal from './signin';
import SignUpModal from './signup';
import WalletDepositModal from './wallet-connect';

const Modal = () => {
  return (
    <>
      <SignInModal />
      <SignUpModal />
      <DepositModal />
      <AddGoldModal />
      <WalletDepositModal />
    </>
  );
};

export default Modal;
