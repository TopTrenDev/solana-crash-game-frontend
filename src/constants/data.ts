import { NavItemGroup } from '@/types';
import { ModalType } from '@/types/modal';

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
  { name: 'bankroll', modal: ModalType.BANKROLL },
  // { name: 'backtesting', modal: ModalType.BACKTESTING },
  { name: 'stats', modal: ModalType.STATS },
  { name: 'leaderboard', modal: ModalType.LEADERBOARD },
  { name: 'help', modal: ModalType.HELP }
];


export interface Ticket {
  id: number,
  name: string,
  content: string
}

export const helpTickets: Ticket[] = [
  {
    id: 0, name: "I forgot my password.", content: "If you provided a recovery email address for your account you can request a reset email here. Unfortunately it is not possible to reset an account's password if you did not provide a recovery email address for it."
  },
  {
    id: 1, name: "MY DEPOSIT HASN’T BEEN CREDITED.", content: "We credit a pending deposit transaction to your account after one confirmation (i.e. appears in one block). The speed at which transactions get confirmed depends on your transaction fee and the amount of other unconfirmed transactions on the Bitcoin network."
  },
  {
    id: 2, name: "MY WITHDRAWAL HASN’T ARRIVED.", content: "We process your immediate withdrawals and have them broadcast on the blockchain as soon as possible. However, we are unable to guarantee instant confirmation. The speed at which transactions get confirmed depends on the transaction fee and the amount of other unconfirmed transactions on the Bitcoin network."
  }
]

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

export const betMode = ['Manual'];

export const autoScripts = [
  'Flat Bet',
  'Sniper',
  'Martingale',
  'Payout Martingale',
  'Narrator',
  'Rebel',
  'Terminator'
];

export const multiplerArray = [1 / 2, 2, 4, 8];

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
  value: string;
}

export const tokens: Array<IToken> = [
  {
    name: 'sola',
    value: '1'
  },
  {
    name: 'SOL',
    value: '2'
  }
];

export const finance = ['Deposit', 'Withdraw', 'Tips'];
