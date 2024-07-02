import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { SOLANA_CONNECTION } from './config';

export const getSolanaBalance = async (walletAddress: PublicKey) => {
  return await SOLANA_CONNECTION.getBalance(walletAddress);
};

export const formatSolanaBalance = (balance: number) => {
  return (balance / LAMPORTS_PER_SOL).toFixed(3);
};

export const shortenAddress = (walletAddress: PublicKey, chars = 4) => {
  const address = walletAddress.toBase58();
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};

export const countDecimals = (amount: number) => {
  if (Math.floor(amount.valueOf()) === amount.valueOf()) return 0;
  return amount.toString().split('.')[1].length || 0;
};
