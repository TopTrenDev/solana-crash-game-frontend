import { NavItemGroup } from '@/types';

export const navItems: NavItemGroup[] = [
  {
    title: 'Casino',
    items: [
      {
        title: 'Crash',
        href: '/crash',
        icon: '/assets/icons/crash.svg',
        label: 'Crash'
      },
      {
        title: 'Coin Flip',
        href: '/coin-flip',
        icon: '/assets/icons/coins.svg',
        label: 'coin flip'
      },
      {
        title: 'Mines',
        href: '/mines',
        icon: '/assets/icons/mines.svg',
        label: 'mines'
      }
    ]
  },
  {
    title: 'Mini games',
    items: [
      {
        title: 'Slots',
        href: '/slots',
        icon: '/assets/icons/slots.svg',
        label: 'slots'
      },
      {
        title: 'Black Jack',
        href: '/black-jack',
        icon: '/assets/icons/blackjack.svg',
        label: 'black jack'
      },
      {
        title: 'Roulette',
        href: '/roulette',
        icon: '/assets/icons/roulette.svg',
        label: 'roulette'
      },
      {
        title: 'Horse Racing Game',
        href: '/horse-racing',
        icon: '/assets/icons/horserace.svg',
        label: 'horse racing game'
      }
    ]
  },
  {
    title: 'Others',
    items: [
      {
        title: 'Settings',
        href: '/settings',
        icon: '/assets/icons/setting.svg',
        label: 'settings'
      },
      {
        title: 'Help & Support',
        href: '/help-support',
        icon: '/assets/icons/support.svg',
        label: 'Help & Support'
      }
    ]
  }
];

export const tabItems = [
  { name: 'home', path: '/' },
  { name: 'leaderboard', path: '/leader-board' },
  { name: 'dashboard', path: '/dashboard' }
];

export type Employee = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  longitude?: number;
  latitude?: number;
  job: string;
  profile_picture?: string | null;
};

export const betMode = ['manual', 'auto'];

export const multiplerArray = [1 / 2, 2, 4, 8];

export const roundArray = [5, 10, 15, 20, 10000];

export const minesAmountPresets = [2, 3, 5, 10, 24];

export const minesImageSrc = ['mystery', 'star', 'bomb'];

export const defaulMine = [
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true
];

export const coinSide = [false, true];

export const coinFlipPresets = [
  { value: '1:0', label: 'custom', multiplier: '' },
  { value: '10:5', label: '10:5 (x1.57)', multiplier: 'x1.57' },
  { value: '1:1', label: '1:1 (x1.96)', multiplier: 'x1.96' },
  { value: '4:3', label: '4:3 (x3.14)', multiplier: 'x3.14' },
  { value: '6:5', label: '6:5 (x8.96)', multiplier: 'x8.96' },
  { value: '9:8', label: '9:8 (x50.18)', multiplier: 'x50.18' },
  { value: '10:10', label: '10:10 (x1003.52)', multiplier: 'x1003.52' }
];

export interface IToken {
  name: string;
  src: string;
  denom: string;
}

export const token: Array<IToken> = [
  {
    name: 'usk',
    src: '/assets/tokens/usk.png',
    denom: 'factory/kujira1sr9xfmzc8yy5gz00epspscxl0zu7ny02gv94rx/kartelUSk'
  },
  { name: 'kuji', src: '/assets/tokens/kuji.png', denom: 'ukuji' },
  {
    name: 'kart',
    src: '/assets/tokens/kart.png',
    denom: 'factory/kujira1sr9xfmzc8yy5gz00epspscxl0zu7ny02gv94rx/kartel'
  }
];

export type TokenBalances = {
  usk: number;
  kuji: number;
  kart: number;
};

export const initialBalance = { usk: 0, kuji: 0, kart: 0 };

export const finance = ['Deposit', 'Withdraw'];

export const denoms = {
  kuji: 'ukuji',
  usk: 'factory/kujira1sr9xfmzc8yy5gz00epspscxl0zu7ny02gv94rx/kartelUSk',
  kart: 'factory/kujira1sr9xfmzc8yy5gz00epspscxl0zu7ny02gv94rx/kartel'
};
