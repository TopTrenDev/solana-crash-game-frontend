import { Connection } from '@solana/web3.js';

export const SOLANA_MAINNET_RPC =
  'https://fittest-ancient-moon.solana-mainnet.quiknode.pro/2d7663574bd86140ee3733b1df61ff6c32273116/';

export const SOLANA_CONNECTION = new Connection(SOLANA_MAINNET_RPC);
