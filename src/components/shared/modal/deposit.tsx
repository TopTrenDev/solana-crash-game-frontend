import { useEffect, useState } from 'react';
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
import AESWrapper from '@/lib/encryption/aes-wrapper';
import { finance, tokens } from '@/constants/data';
import { useAppSelector } from '@/store/redux';
import LoadingIcon from '../loading-icon';
import { Cross2Icon } from '@radix-ui/react-icons';
import Logo from '/assets/logo.svg';
import { FaWallet, FaCopy } from 'react-icons/fa';

const DepositModal = () => {
  const modal = useModal();
  const userData = useAppSelector((state: any) => state.user.userData);
  const modalState = useAppSelector((state: any) => state.modal);
  const isOpen = modalState.open && modalState.type === ModalType.DEPOSIT;
  const toast = useToast();
  const [depositAmount, setDepositAmount] = useState('');
  const [creditBalance, setCreditBalance] = useState<number>(0);
  const [solanaBalance, setSolanaBalance] = useState<string>('0.000');
  const [selectedFinance, setSelectedFinance] = useState('Deposit');

  const [loading, setLoading] = useState(false);

  const aesWrapper = AESWrapper.getInstance();

  const onCopyText = () => {
    toast.success('Copied');
  };

  const hanndleOpenChange = async () => {
    if (isOpen) {
      modal.close(ModalType.DEPOSIT);
    }
  };

  const handleBetAmountChange = (event) => {
    const inputValue = event.target.value;
    setDepositAmount(inputValue);
  };

  const handleWithdraw = async () => {
    if (Number(depositAmount) > creditBalance) {
      toast.error(`Insufficient token`);
      return;
    }
    // if (account) {
    //   try {
    //     setLoading(true);
    //     await updateBalance('withdraw');
    //     refreshBalances();
    //   } catch (err) {
    //     console.log(err);
    //     setLoading(false);
    //   } finally {
    //     setLoading(false);
    //   }
    // }
  };

  const updateBalance = async (type: string, txHash?: string) => {
    try {
    } catch (error) {
      console.error('Failed to update balance:', error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      updateBalance('get');
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={hanndleOpenChange}>
      <DialogContent className="!max-w-[800px] gap-0 rounded-lg border-none bg-[#0D0B32] p-0 text-white sm:max-w-sm lg:w-[800px]">
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
          <div className="flex w-full items-center gap-10 rounded-b-[8px] bg-[#2C2852] px-[30px] py-[36px]">
            <div className="flex items-start">
              <QRCode
                size={256}
                style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                value={userData.wallet}
                viewBox={`0 0 256 256`}
              />
            </div>
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
              <div className="flex w-full flex-col items-center justify-between gap-3">
                <span className="text-[12px] text-gray-500">
                  Part of your balance may not be withdrawable if you have
                  unconfirmed precredited deposits or are participating in the
                  current game.
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs text-white">Wallet address</span>
                <div className="relative">
                  <Input
                    placeholder={'4qLQDSpCwGJSig3tDvkfUbgW1TJWgeABpr5BtR3r3vZo'}
                    className="border border-none bg-[#463E7A] pl-[10rem] text-white placeholder:text-[#9083e6]"
                  />
                  <div className="absolute left-0 top-0 flex h-full items-center justify-center rounded-l-lg bg-[#463E7A] px-4 text-gray500">
                    Solana Address
                  </div>
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
              <Button
                className="w-full rounded-[12px] border-b-4 border-t-4 border-b-[#682fad] border-t-[#ba88f8] bg-[#9945FF] py-5 hover:bg-[#ad77f0]"
                // onClick={handleDeposit}
                disabled={depositAmount === ''}
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
