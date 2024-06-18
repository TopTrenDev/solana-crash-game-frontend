import { AccountData, EncodeObject } from '@cosmjs/proto-signing';
import {
  Coin,
  DeliverTxResponse,
  assertIsDeliverTxSuccess
} from '@cosmjs/stargate';
import { ChainInfo } from '@keplr-wallet/types';
import { DelegationResponse } from 'cosmjs-types/cosmos/staking/v1beta1/staking';
import { Any } from 'cosmjs-types/google/protobuf/any';
import { BigNumber } from 'ethers';
import {
  CHAIN_INFO,
  Denom,
  Keplr,
  Leap,
  LeapSnap,
  NETWORK,
  ReadOnly,
  Sonar,
  Station,
  Xfi
} from 'kujira.js';
import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState
} from 'react';
import { PageRequest } from 'cosmjs-types/cosmos/base/query/v1beta1/pagination';
import { WalletI } from 'kujira.js/lib/cjs/wallets/interface';
import { useNetwork } from '../network';
import { usePasskeys } from '../passkey';
import { Passkey } from './passkey-class';
import { useLocalStorage } from '@/hooks';

export enum Adapter {
  Sonar = 'sonar',
  Passkey = 'passkey',
  ReadOnly = 'readOnly',
  Keplr = 'keplr',
  Station = 'station',
  Leap = 'leap',
  LeapSnap = 'leapSnap',
  Xfi = 'xfi',
  DaoDao = 'daodao'
}

export type IWallet = {
  connect: (adapter: Adapter, chain?: NETWORK) => Promise<void>;
  disconnect: () => void;
  account: (AccountData & { label?: string }) | null;
  kujiraAccount: Any | null;
  balances: Coin[];
  getBalance: (denom: Denom, refresh?: boolean) => Promise<BigNumber | null>;
  balance: (denom: Denom) => BigNumber;
  signAndBroadcast: (
    msgs: EncodeObject[],
    memo?: string
  ) => Promise<DeliverTxResponse>;
  delegations: null | DelegationResponse[];
  refreshBalances: () => void;
  refreshDelegations: () => void;
  feeDenom: string;
  setFeeDenom: (denom: string) => void;
  chainInfo: ChainInfo;
  adapter: null | Adapter;
};

const Context = createContext<IWallet>({
  account: null,
  getBalance: async () => BigNumber.from(0),
  balance: () => BigNumber.from(0),
  connect: async () => {},
  disconnect: () => {},
  kujiraAccount: null,
  balances: [],
  signAndBroadcast: async () => {
    throw new Error('Not Implemented');
  },
  delegations: null,
  refreshBalances: () => {},
  refreshDelegations: () => {},
  feeDenom: 'ukuji',
  setFeeDenom: () => {},
  chainInfo: {} as ChainInfo,
  adapter: null
});

const toAdapter = (wallet: any) => {
  return wallet instanceof Keplr
    ? Adapter.Keplr
    : wallet instanceof Leap
      ? Adapter.Leap
      : wallet instanceof LeapSnap
        ? Adapter.LeapSnap
        : wallet instanceof Xfi
          ? Adapter.Xfi
          : wallet instanceof Sonar
            ? Adapter.Sonar
            : wallet instanceof Passkey
              ? Adapter.Passkey
              : wallet instanceof Station
                ? Adapter.Station
                : wallet instanceof ReadOnly
                  ? Adapter.ReadOnly
                  : null;
};

export const WalletContext: FC<PropsWithChildren> = ({ children }) => {
  const [stored, setStored] = useLocalStorage('wallet', '');
  const [wallet, setWallet] = useState<WalletI | null>(null);
  const { signer, selectSigner } = usePasskeys();

  const adapter = toAdapter(wallet);

  const [feeDenom, setFeeDenom] = useLocalStorage('feeDenom', 'ukuji');
  const [balances, setBalances] = useState<Record<string, BigNumber>>({});

  const [kujiraBalances, setKujiraBalances] = useState<Coin[]>([]);

  const [{ network, chainInfo, query, rpc }] = useNetwork();

  const [kujiraAccount, setKujiraAccount] = useState<null | Any>(null);

  const [delegations, setDelegations] = useState<null | DelegationResponse[]>(
    null
  );

  useEffect(() => {
    stored && connect(stored, network, true);
  }, []);

  useEffect(() => {
    wallet && connect(stored, network);
  }, [network]);

  const refreshBalances = () => {
    if (!wallet) return;
    query?.bank
      .allBalances(
        wallet.account.address,
        PageRequest.fromPartial({ limit: BigInt(10) })
      )
      .then((x) => {
        x && setKujiraBalances(x);
        x?.map((b) => {
          setBalances((prev) =>
            b.denom
              ? {
                  ...prev,
                  [b.denom]: BigNumber.from(b.amount)
                }
              : prev
          );
        });
      });
  };

  useEffect(() => {
    setKujiraBalances([]);
    setBalances({});
    refreshBalances();
  }, [wallet, query]);

  useEffect(() => {
    if (!wallet) return;
    query?.auth
      .account(wallet.account.address)
      .then((account) => account && setKujiraAccount(account));
  }, [wallet, query]);

  const refreshDelegations = () => {
    if (!wallet) return;
    setDelegations(null);
    query?.staking
      .delegatorDelegations(wallet.account.address)
      .then(
        ({ delegationResponses }) =>
          delegationResponses && setDelegations(delegationResponses)
      );
  };

  useEffect(() => {
    refreshDelegations();
  }, [wallet, query]);

  const balance = (denom: Denom): BigNumber =>
    balances[denom.reference] || BigNumber.from(0);

  const fetchBalance = async (denom: Denom): Promise<BigNumber> => {
    if (!wallet) return BigNumber.from(0);
    if (!query) return BigNumber.from(0);
    return query.bank
      .balance(wallet.account.address, denom.reference)
      .then((resp) => BigNumber.from(resp?.amount || 0))
      .then((balance) => {
        setBalances((prev) => ({
          ...prev,
          [denom.reference]: balance
        }));
        return balance;
      });
  };

  const getBalance = async (denom: Denom, refresh = true) =>
    balances[denom.reference] || refresh
      ? fetchBalance(denom)
      : BigNumber.from(0);

  const signAndBroadcast = async (
    rpc: string,
    msgs: EncodeObject[],
    memo?: string
  ): Promise<DeliverTxResponse> => {
    if (!wallet) throw new Error('No Wallet Connected');
    const res = await wallet.signAndBroadcast(rpc, msgs, feeDenom, memo);
    assertIsDeliverTxSuccess(res);
    return res;
  };

  const sonarRequest = (uri: string) => {
    console.log(uri);
  };

  const connect = async (adapter: Adapter, chain?: NETWORK, auto?: boolean) => {
    const chainInfo: ChainInfo = {
      ...CHAIN_INFO[chain || network]
    };

    let connectedWalletAddress: any = null;

    switch (adapter) {
      case Adapter.Passkey:
        if (!signer) {
          console.error('No Signer Available');
          return;
        }
        Passkey.connect({ ...chainInfo, rpc }, signer)
          .then((passkey) => {
            setStored(adapter);
            setWallet(passkey);
          })
          .catch((err) => {
            setStored('');
            console.error(err.message);
          });
        break;
      case Adapter.Keplr:
        connectedWalletAddress = await Keplr.connect(
          { ...chainInfo, rpc },
          { feeDenom }
        );
        setStored(adapter);
        setWallet(connectedWalletAddress);
        break;

      case Adapter.Leap:
        connectedWalletAddress = await Leap.connect(
          { ...chainInfo, rpc },
          { feeDenom }
        );
        setStored(adapter);
        setWallet(connectedWalletAddress);
        break;

      case Adapter.LeapSnap:
        LeapSnap.connect({ ...chainInfo, rpc }, { feeDenom })
          .then((x) => {
            setStored(adapter);
            setWallet(x);
          })
          .catch((err) => {
            setStored('');
            console.error(err.message);
          });

        break;

      case Adapter.Xfi:
        Xfi.connect({ ...chainInfo, rpc }, { feeDenom })
          .then((x) => {
            setStored(adapter);
            setWallet(x);
          })
          .catch((err) => {
            setStored('');
            console.error(err.message);
          });

        break;

      case Adapter.Sonar:
        Sonar.connect(network, {
          request: sonarRequest,
          auto: !!auto
        }).then((x) => {
          setStored(adapter);
          setWallet(x);
        });
        break;
      case Adapter.Station:
        connectedWalletAddress = await Station.connect(chainInfo);
        setStored(adapter);
        setWallet(connectedWalletAddress);
        break;
      case Adapter.ReadOnly:
        break;
    }
  };

  useEffect(() => {
    wallet && wallet.onChange(setWallet);
  }, [wallet]);

  const disconnect = () => {
    stored === Adapter.Passkey && selectSigner('');
    setStored('');
    setWallet(null);
    wallet?.disconnect();
  };

  const value: IWallet = {
    adapter,
    account: wallet?.account || null,
    delegations,
    connect,
    disconnect,
    kujiraAccount,
    balances: kujiraBalances,
    getBalance,
    balance,
    signAndBroadcast: (msgs, memo) => signAndBroadcast(rpc, msgs, memo),
    refreshBalances,
    refreshDelegations,
    feeDenom,
    setFeeDenom,
    chainInfo
  };

  return (
    <Context.Provider key={network + wallet?.account.address} value={value}>
      {children}
    </Context.Provider>
  );
};

export function useWallet() {
  return useContext(Context);
}
