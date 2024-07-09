import { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import QRCode from 'react-qr-code';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ModalType } from '@/types/modal';
import useModal from '@/hooks/use-modal';
import { Input } from '@/components/ui/input';
import useToast from '@/hooks/use-toast';
import { finance } from '@/constants/data';
import { useAppSelector } from '@/store/redux';
import LoadingIcon from '../loading-icon';
import { Cross2Icon } from '@radix-ui/react-icons';
import { FaWallet, FaCopy, FaKey } from 'react-icons/fa';
import { axiosPost } from '@/utils/axios';
import { BACKEND_API_ENDPOINT } from '@/utils/constant';

const DepositModal = () => {
  const modal = useModal();
  const userData = useAppSelector((state: any) => state.user.userData);
  const solBalance = (userData.credit / 1100).toFixed(3);
  const modalState = useAppSelector((state: any) => state.modal);
  const isOpen = modalState.open && modalState.type === ModalType.DEPOSIT;
  const toast = useToast();
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [depositAmount, setDepositAmount] = useState<string>('');
  const [selectedFinance, setSelectedFinance] = useState<string>('Deposit');
  const [password, setPassword] = useState<string>('');

  const [loading, setLoading] = useState(false);

  const onCopyText = () => {
    toast.success('Copied');
  };

  const hanndleOpenChange = async () => {
    if (isOpen) {
      modal.close(ModalType.DEPOSIT);
    }
  };

  const handleAddressChange = (event) => {
    const inputValue = event.target.value;
    setWalletAddress(inputValue);
  };

  const handleDepositAmountChange = (event) => {
    const inputValue = event.target.value;
    setDepositAmount(inputValue);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleWithdraw = async () => {
    setLoading(true);
    try {
      const resWithdraw = await axiosPost([
        BACKEND_API_ENDPOINT.deposit.withdraw,
        { data: { walletAddress, amount: Number(depositAmount), password } }
      ]);
      if (resWithdraw.responseObject) {
        console.log('withdraw link', resWithdraw.responseObject.txLink);
        toast.success('Successfully withdrawn');
      }
    } catch (e) {
      toast.error('Withdraw failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={hanndleOpenChange}>
      <DialogContent className="gap-0 rounded-lg border-none bg-[#0D0B32] p-0 text-white sm:max-w-sm md:!max-w-[500px] lg:w-[800px] lg:!max-w-[800px]">
        <DialogHeader className="flex flex-row items-center justify-between rounded-t-[8px] bg-[#463E7A] px-[24px] py-[20px]">
          <DialogTitle className="text-center text-[24px] font-semibold uppercase">
            {finance.map((item, index) => (
              <button
                key={index}
                onClick={() => setSelectedFinance(item)}
                className={`${selectedFinance === item ? ' border-white' : 'border-transparent'} border-b-2 p-2 uppercase text-white transition-all duration-300 ease-out`}
              >
                {item}
              </button>
            ))}
          </DialogTitle>
          <DialogClose className="hover:ropacity-100 !my-0 rounded-sm opacity-70 outline-none ring-offset-background transition-opacity focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:text-muted-foreground">
            <Cross2Icon className="h-7 w-7 text-white" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        {selectedFinance === finance[0] ? (
          <div className="flex w-full flex-col items-center gap-10 rounded-b-[8px] bg-[#2C2852] px-[30px] py-[36px] lg:flex-row">
            <QRCode
              size={120}
              value={userData.wallet || 'No wallet'}
              viewBox={`0 0 120 120`}
              className="block w-full max-w-full lg:hidden"
            />
            <QRCode
              size={256}
              value={userData.wallet || 'No wallet'}
              viewBox={`0 0 256 256`}
              className="hidden w-full max-w-full lg:block"
            />
            <div className="flex w-full flex-col gap-6">
              <div className="flex w-full flex-col items-center justify-between gap-3">
                <span>
                  Send any amount of solana to this address to fund your
                  account:
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs text-white">Wallet address</span>
                <div className="relative">
                  <Input
                    placeholder={userData.wallet}
                    disabled
                    className="border border-none bg-[#463E7A] pl-[3rem] text-white placeholder:text-[#9083e6]"
                  />
                  <div className="absolute left-0 top-0 flex h-full items-center justify-center rounded-l-lg bg-[#463E7A] px-[10px] text-gray500">
                    <FaWallet className="h-6 w-6" />
                  </div>
                  <CopyToClipboard
                    text={userData.wallet}
                    onCopy={onCopyText}
                    className="absolute right-0 top-0 flex h-full items-center justify-center rounded-r-lg bg-[#463E7A] px-2 text-gray500"
                  >
                    <button className="flex gap-2">
                      <FaCopy />
                      Copy
                    </button>
                  </CopyToClipboard>
                </div>
              </div>
              <div className="flex w-full flex-col items-center justify-between gap-2 text-[12px] text-gray-500">
                <span>There is no minimum deposit.</span>
                <span>
                  We only require a single confirmation in order to credit your
                  deposit.
                </span>
                <span>A new deposit address is generated for each deposit</span>
              </div>
              {/* <Button
              className="w-full rounded-[12px] border-b-4 border-t-4 border-b-[#682fad] border-t-[#ba88f8] bg-[#9945FF] py-5 hover:bg-[#ad77f0]"
              onClick={handleDeposit}
              disabled={depositAmount === ''}
            >
              {selectedFinance}
              {loading && <LoadingIcon />}
            </Button> */}
            </div>
          </div>
        ) : (
          <div className="flex w-full items-center gap-10 rounded-b-[8px] bg-[#2C2852] px-[30px] py-[36px]">
            <div className="flex w-full flex-col gap-6">
              <div className="flex w-full items-center justify-center gap-1">
                <span className="text-[12px] text-gray-100">
                  Your balance is
                </span>
                <span className="text-[13px] text-[#5fa369]">
                  {userData?.credit.toFixed(3)}
                </span>
                <span className="text-[12px] text-gray-100">sola = </span>
                <span className="text-[13px] text-[#5fa369]">{solBalance}</span>
                <span className="text-[12px] text-gray-100">Sol</span>
              </div>
              <div className="flex w-full flex-col items-center justify-between gap-3">
                <span className="text-[12px] text-gray-500">
                  Part of your balance may not be withdrawable if you have
                  unconfirmed precredited deposits or are participating in the
                  current game.
                </span>
              </div>
              <div className="flex flex-col">
                <span className="mb-[8px] text-xs text-white">
                  Wallet address
                </span>
                <div className="relative">
                  <Input
                    placeholder={'Input your solana address'}
                    value={walletAddress}
                    onChange={handleAddressChange}
                    className="border border-none bg-[#463E7A] text-white placeholder:text-[#9083e6]"
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="mb-[8px] text-xs text-white">
                  Withdrawal amount
                </span>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder={'0'}
                    min="0.000"
                    max="10"
                    value={depositAmount}
                    className="border border-none bg-[#463E7A] text-white placeholder:text-[#9083e6]"
                    onChange={handleDepositAmountChange}
                    disabled={loading}
                  />
                </div>
                {Number(depositAmount) > Number(solBalance) && (
                  <span className="text-[10px] text-red">
                    You don't have enough balance.
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <div className="relative">
                  <Input
                    placeholder={'Password'}
                    type="password"
                    value={password}
                    className="rounded-l-lg border border-none bg-[#463E7A] pl-[50px] text-white placeholder:text-[#9083e6]"
                    onChange={handlePasswordChange}
                    disabled={loading}
                  />
                  <div className="absolute left-0 top-0 flex h-full items-center rounded-l-lg bg-[#362e68] px-2">
                    <FaKey className="h-5 w-6" />
                  </div>
                </div>
              </div>
              <div className="flex w-full flex-col items-center justify-between gap-2 text-[12px] text-gray-500">
                <span>
                  Important: Your withdrawal will be sent from the hot wallet,
                  do not withdraw to any site that uses the sending address, or
                  returns to sender, because any returns will probably be
                  credited to a different player.
                </span>
              </div>
              <Button
                className="w-full rounded-[12px] border-b-4 border-t-4 border-b-[#682fad] border-t-[#ba88f8] bg-[#9945FF] py-5 hover:bg-[#ad77f0]"
                onClick={handleWithdraw}
                disabled={depositAmount === '' || password === '' || loading}
              >
                {selectedFinance}
                {loading && <LoadingIcon />}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DepositModal;
