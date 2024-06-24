import AddGoldModal from './add-gold';
import DepositModal from './deposit';
import SignInModal from './signin';
import SignUpModal from './signup';

const Modal = () => {
  return (
    <>
      <SignInModal />
      <SignUpModal />
      <DepositModal />
      <AddGoldModal />
    </>
  );
};

export default Modal;
