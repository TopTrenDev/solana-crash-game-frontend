import { useEffect, useState } from 'react';
import axios from 'axios';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import useToast from '@/hooks/use-toast';
import AESWrapper from '@/lib/encryption/aes-wrapper';
import { finance, tokens } from '@/constants/data';
import { useAppSelector } from '@/store/redux';
import LoadingIcon from '../loading-icon';
import {
  formatSolanaBalance,
  getSolanaBalance,
  shortenAddress
} from '@/lib/solana/utils';
import { Cross2Icon } from '@radix-ui/react-icons';

const DepositModal = () => {
  const modal = useModal();
  const userData = useAppSelector((state: any) => state.user.userData);
  const modalState = useAppSelector((state: any) => state.modal);
  const isOpen = modalState.open && modalState.type === ModalType.DEPOSIT;
  const toast = useToast();
  const { setVisible } = useWalletModal();
  const { publicKey: solanaAddress, disconnect: solDisconnect } = useWallet();
  const [depositAmount, setDepositAmount] = useState('');
  const [creditBalance, setCreditBalance] = useState<number>(0);
  const [solanaBalance, setSolanaBalance] = useState<string>('0.000');
  const [selectedFinance, setSelectedFinance] = useState('Deposit');

  const [loading, setLoading] = useState(false);

  const aesWrapper = AESWrapper.getInstance();

  // const { signAndBroadcast, account, balances, refreshBalances } = useWallet();

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

  const handleDeposit = async () => {
    if (Number(depositAmount) > Number(solanaBalance)) {
      toast.error(`Insufficient token in wallet`);
      return;
    }
    // if (account) {
    //   try {
    //     setLoading(true);
    //     const kujiraBalance = balances.filter(item => item.denom === denoms.kuji)?.[0]?.amount ?? 0;
    //     if (Number(toHuman(BigNumber.from(kujiraBalance), 6)).valueOf() < 0.00055) {
    //       toast.error(`Insufficient Kujira balance for Fee`);
    //       return;
    //     }
    //     const hashTx = await signAndBroadcast(
    //       [
    //         msg.bank.msgSend({
    //           fromAddress: account?.address,
    //           toAddress: walletAddress,
    //           amount: [
    //             {
    //               denom: selectedToken.denom,
    //               amount: fromHumanString(depositAmount, 6).toString()
    //             }
    //           ]
    //         })
    //       ],
    //       'Deposit to Kartel'
    //     );
    //     await updateBalance('deposit', hashTx.transactionHash);
    //     refreshBalances();
    //   } catch (err) {
    //     console.warn("txerror", err);
    //     setLoading(false);
    //   } finally {
    //     setLoading(false);
    //   }
    // }
  };

  const handleWalletConnect = () => {
    setVisible(true);
    modal.close(ModalType.DEPOSIT);
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

  useEffect(() => {
    if (solanaAddress) {
      const fetchSolanaBalance = async () => {
        const newBalance = await getSolanaBalance(solanaAddress);
        setSolanaBalance(formatSolanaBalance(newBalance));
      };
      fetchSolanaBalance();
    }
  }, [solanaAddress]);

  return (
    <Dialog open={isOpen} onOpenChange={hanndleOpenChange}>
      <DialogContent className="w-[500px] !max-w-[500px] gap-0 rounded-lg border-none bg-[#0D0B32] p-0 text-white sm:max-w-sm">
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
        <div className="flex w-full flex-col items-center gap-10 rounded-b-[8px] bg-[#2C2852] px-[30px] py-[36px]">
          {solanaAddress ? (
            <div className="flex w-full flex-col gap-6">
              <div className="flex w-full flex-col justify-between gap-3">
                <div className="flex w-full flex-col items-start justify-between">
                  <div className="flex w-full justify-between text-xs text-gray-500">
                    <span>Site Balance:</span>
                    <span>{creditBalance} sola</span>
                  </div>
                  <div className="flex w-full justify-between text-xs text-gray-500">
                    <span>Wallet Balance:</span>
                    <span>{solanaBalance} Sol</span>
                  </div>
                  <div className="flex w-full justify-between text-xs text-gray-500">
                    <span>Wallet Address:</span>
                    <a
                      href={`https://solscan.io/account/${solanaAddress.toBase58()}`}
                      target="_blank"
                      className="text-[#0D0B32] underline"
                    >
                      {shortenAddress(solanaAddress)}
                    </a>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs text-white">Token Amount</span>
                <div className="relative">
                  <Input
                    placeholder="1"
                    value={depositAmount}
                    onChange={handleBetAmountChange}
                    type="number"
                    className="border border-none bg-[#463E7A] text-white placeholder:text-[#9083e6]"
                  />
                  <span className="absolute right-4 top-0 flex h-full items-center justify-center text-gray500">
                    <div className="flex cursor-pointer items-center gap-2 uppercase">
                      {'SOL'}
                    </div>
                  </span>
                </div>
                {/* {selectedFinance === 'Withdraw' && (
                <div className="mt-2 flex flex-col gap-1">
                  <span className="text-xs text-white">Wallet Address</span>
                  <Input
                    value={''}
                    type="text"
                    onChange={() => {}}
                    placeholder="e.g. solana158m5u3na7d6ksr07a6yctphjjrhdcuxu0wmy2h"
                    className="border border-purple-0.5 text-white placeholder:text-gray-700"
                  />
                </div>
              )} */}
              </div>
              <Button
                className="w-full rounded-[12px] border-b-4 border-t-4 border-b-[#682fad] border-t-[#ba88f8] bg-[#9945FF] py-5 hover:bg-[#ad77f0]"
                onClick={handleDeposit}
                disabled={depositAmount === ''}
              >
                {selectedFinance}
                {loading && <LoadingIcon />}
              </Button>
              <Button
                className="w-full rounded-[12px] border-b-4 border-t-4 border-b-[#a73075] border-t-[#f36dbb] bg-[#ff149d] py-5 hover:bg-[#f749ae]"
                onClick={() => solDisconnect()}
              >
                Disconnect
              </Button>
            </div>
          ) : (
            <Button
              className="w-full rounded-[12px] border-b-4 border-t-4 border-b-[#682fad] border-t-[#ba88f8] bg-[#9945FF] py-5 hover:bg-[#ad77f0]"
              onClick={handleWalletConnect}
            >
              Connect
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DepositModal;
