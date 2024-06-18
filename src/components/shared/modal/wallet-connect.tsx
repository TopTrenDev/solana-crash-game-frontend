import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { ModalType } from '@/types/modal';
import useModal from '@/hooks/use-modal';
import { ChevronRight, Download } from 'lucide-react';
import { Adapter, useWallet } from '@/provider/crypto/wallet';
import { useState } from 'react';
import useToast from '@/hooks/use-toast';
import { useAppSelector } from '@/store/redux';
import LoadingIcon from '../loading-icon';

interface ITokenList {
  name: string;
  image: string;
}

const tokenList: ITokenList[] = [
  {
    name: 'Keplr',
    image: '/assets/tokens/keplr.svg'
  },
  {
    name: 'Leap',
    image: '/assets/tokens/leap.svg'
  },
  {
    name: 'Cosmotation',
    image: '/assets/tokens/cosmostation.svg'
  }
];

const CWalletLink = {
  keplr: 'https://www.keplr.app/download',
  cosmostation: 'https://www.cosmostation.io/products/cosmostation_extension',
  leap: 'https://www.leapwallet.io'
};

const defaultLoading = {
  keplr: false,
  cosmostation: false,
  leap: false
};

const WalletConnectModal = () => {
  const modal = useModal();
  const [loading, setLoading] = useState(defaultLoading);
  const toast = useToast();
  const { open, type } = useAppSelector((state: any) => state.modal);
  const isOpen = open && type === ModalType.WALLETCONNECT;
  const { connect } = useWallet();

  const hanndleOpenChange = async () => {
    if (isOpen) {
      modal.close(ModalType.WALLETCONNECT);
    }
  };

  const handleConnectWalet = async (walletType: string) => {
    try {
      switch (walletType) {
        case 'Keplr':
          if (!window.keplr) {
            window.open(CWalletLink.keplr, '_blank');
            return;
          }
          setLoading((prev) => ({ ...prev, keplr: true }));
          await connect(Adapter.Keplr);
          break;
        case 'Leap':
          if (!window.leap) {
            window.open(CWalletLink.leap, '_blank');
            return;
          }
          setLoading((prev) => ({ ...prev, leap: true }));
          await connect(Adapter.Leap);
          break;
        case 'Cosmotation':
          if (!window.station) {
            window.open(CWalletLink.cosmostation, '_blank');
            return;
          }
          setLoading((prev) => ({ ...prev, cosmostation: true }));
          await connect(Adapter.Station);
          break;
        default:
          break;
      }
      modal.close(ModalType.WALLETCONNECT);
      modal.open(ModalType.DEPOSIT);
      setLoading(defaultLoading);
    } catch (error) {
      toast.error('User rejected');
      setLoading(defaultLoading);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={hanndleOpenChange}>
      <DialogContent className="gap-10 rounded-lg border-2 border-gray-900 bg-[#0D0B32] p-10 sm:max-w-sm">
        <DialogHeader className="flex flex-row text-center">
          <p className="text-center text-2xl text-white">Wallet Connect</p>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {tokenList.map((item, index) => (
            <button
              onClick={() => handleConnectWalet(item.name)}
              className="flex flex-row items-center justify-between gap-2 rounded-lg p-2"
              key={index}
            >
              <div className="flex flex-row items-center gap-5">
                <img src={item.image} className="h-8 w-8" />
                <span className="text-start text-lg text-white">
                  {item.name}
                </span>
              </div>
              {item.name === 'Keplr' &&
                !loading.keplr &&
                (window.keplr ? (
                  <ChevronRight className="h-5 w-5 text-white" />
                ) : (
                  <Download className="h-5 w-5 text-white" />
                ))}
              {item.name === 'Leap' &&
                !loading.leap &&
                (window.leap ? (
                  <ChevronRight className="h-5 w-5 text-white" />
                ) : (
                  <Download className="h-5 w-5 text-white" />
                ))}
              {item.name === 'Cosmotation' &&
                !loading.cosmostation &&
                (window.station ? (
                  <ChevronRight className="h-5 w-5 text-white" />
                ) : (
                  <Download className="h-5 w-5 text-white" />
                ))}
              {item.name === 'Keplr' && loading.keplr && <LoadingIcon />}
              {item.name === 'Leap' && loading.leap && <LoadingIcon />}
              {item.name === 'Cosmotation' && loading.cosmostation && (
                <LoadingIcon />
              )}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WalletConnectModal;
