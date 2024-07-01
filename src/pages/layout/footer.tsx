import logo from '@/assets/img/logo.svg';
import { Button } from '@/components/ui/button';
import { TITLE } from '@/config';

const Footer = () => {
  return (
    <footer className="w-fluid font-clash-display">
      <div className="container flex py-4 text-white">
        <div className="flex max-lg:block">
          <div className="mx-12 py-8">
            <div className="via-green-500 flex items-center bg-gradient-to-r from-[#9E00FF] to-[#14F195] bg-clip-text text-[24px] font-semibold text-transparent">
              <img className="mr-[11px]" src={logo} alt="" />
              <p className="font-clash-grotesk text-2xl text-white">{TITLE}</p>
            </div>
            <p className="py-4 text-lg text-[#BDC9D4]">
              {TITLE} is an online multiplayer solana gambling game consisting
              of an increasing curve that can crash anytime. It's fun and
              thrilling. It can also make you millions.
            </p>
            <p className="text-lg">©{TITLE} 2024</p>
          </div>
          <div className="mx-12 py-8 text-sm">
            <p className="pb-4 text-[#BDC9D4]">Menu</p>
            <p className="py-2">Bankroll</p>
            <p className="py-2">Backtesting</p>
            <p className="py-2">Stats</p>
            <p className="py-2">Leaderboard</p>
          </div>
          <div className="mx-12 py-8 text-sm">
            <p className="pb-4 text-[#BDC9D4]">Menu</p>
            <p className="py-2">Bankroll</p>
            <p className="py-2">Backtesting</p>
            <p className="py-2">Stats</p>
            <p className="py-2">Leaderboard</p>
          </div>

          <div className="mx-12 py-8">
            <p className="font-clash-grotesk text-lg text-[#BDC9D4]">
              Crash Game that supports experiences for confinience Bankroll,
              Wagered, and House edge.
            </p>
            <div className="py-2">
              <Button className="my-2 mr-2 rounded-[12px] border-b-2 border-t-2 border-b-[#292447] border-t-[#6f62c0] bg-[#463E7A] px-[24px] py-[16px] hover:bg-[#6f62c0]">
                <span className="drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
                  Login
                </span>
              </Button>
              <Button className=" my-2 rounded-[12px] border-b-2 border-t-2 border-b-[#5c4b21] border-t-[#d89fee] bg-[#9945FF] px-[24px] py-[16px] hover:bg-[#b977df]">
                <span className="drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
                  Register
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
