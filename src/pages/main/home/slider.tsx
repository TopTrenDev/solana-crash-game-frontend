import { BsRocket } from 'react-icons/bs';
import { FaUsers } from 'react-icons/fa';
import { FaBalanceScale } from 'react-icons/fa';
import { FaRegCreditCard } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import Rocket from '@/assets/img/rocket.svg';
import Jupiter from '@/assets/img/jupiter.svg';
import Mars from '@/assets/img/mars.svg';
import Moon from '@/assets/img/moon.svg';
import { TITLE } from '@/config';

export default function Slider() {
  return (
    <div className="w-fluid font-clash-grotesk bg-[url('/src/assets/img/starry-sky.svg')] ">
      <div className="relative bg-[url('/src/assets/img/bg-slider.svg')] bg-contain bg-bottom bg-no-repeat">
        <div className="text-center">
          <div className="mx-auto inline-block rounded-full bg-[#ffffff10] px-4 py-2">
            <p className="text-2xl text-[#14F195]">
              ✨ The Original Crash Game
            </p>
          </div>
          <h2 className="font-clash-display my-4 text-8xl text-white max-sm:text-6xl">
            Fast for everyone to <br />
            <a className="text-[#14F195]">Win A Prize</a>
          </h2>
          <p className="text-lg leading-7 text-[#BDC9D4] ">
            Crash Game that supports experiences for confinience
            <br /> Bankroll, Wagered, and House edge.
          </p>
        </div>
        <div className="font-clash-display relative mt-14">
          <img
            className="mx-auto"
            src={Rocket}
            alt=""
            style={{
              maskImage:
                'radial-gradient(ellipse, black 50%, rgb(0 0 0 / 0%) 68.6%), linear-gradient(black 70%, transparent 80%)'
            }}
          />
          <div className="absolute top-9 w-full max-md:hidden">
            <div className="md:10/12 mx-auto flex justify-between md:w-10/12 lg:w-7/12">
              <div className="text-center">
                <div className="my-2">
                  <p className="my-2 text-xl text-[#14F195]">1%</p>
                  <p className="my-2 text-lg text-white">House Edge</p>
                </div>
                <div className="py-2">
                  <p className="my-2 text-xl text-[#14F195]">+ ₿2,300,000</p>
                  <p className="my-2 text-lg text-white">Wagered</p>
                </div>
                <div className="my-2">
                  <p className="my-2 text-xl text-[#14F195]">+ ₿800</p>
                  <p className="my-2 text-lg text-white">Bankroll</p>
                </div>
              </div>
              <div className="align-center flex text-right">
                <div className="my-2 flex flex-col justify-around text-lg">
                  <div className="mx-4 my-2 flex items-center justify-end rounded-full text-white">
                    <div className="flex items-center rounded-full bg-[#1C1B35] px-4 py-2">
                      <a className="mx-2 inline text-[#14F195]">
                        <FaUsers size={22} />
                      </a>
                      Social & Real Time
                    </div>
                  </div>
                  <div className="mx-4 my-2 flex items-center justify-end rounded-full text-white">
                    <div className="flex items-center rounded-full bg-[#1C1B35] px-4 py-2">
                      <a className="mx-2 inline text-[#14F195]">
                        <FaBalanceScale size={22} />
                      </a>
                      Provably Fair
                    </div>
                  </div>
                  <div className="mx-4 my-2 flex items-center justify-end rounded-full text-white">
                    <div className="flex items-center rounded-full bg-[#1C1B35] px-4 py-2">
                      <a className="mx-2 inline text-[#14F195]">
                        <FaRegCreditCard size={22} />
                      </a>
                      Be the Bankroll
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute top-3/4 w-full py-4 text-white">
            <BsRocket className="mx-auto" />
            <div className="text-center text-[#BDC9D4]">Scroll to launch</div>
          </div>
        </div>
        {/* <img className="launching-rocket absolute top-0" src={Star} alt="" /> */}
        <img
          className="absolute left-[20%] top-[20%] max-lg:hidden"
          src={Moon}
          alt=""
        />
        <img
          className="absolute top-[37%] max-lg:hidden"
          src={Jupiter}
          alt=""
        />
        <img
          className="absolute right-[10%] top-[30%] max-lg:hidden"
          src={Mars}
          alt=""
        />
        <div className="mx-auto flex max-w-[745px] flex-col items-center text-white max-md:mt-20">
          <h3 className="font-clash-display text-center text-6xl max-sm:text-4xl">
            What's {TITLE}?
          </h3>
          <p className="font-clash-grotesk py-4 text-center text-xl text-[#BDC9D4]">
            {TITLE} is an online multiplayer solana gambling game consisting of
            an increasing curve that can crash anytime. It's fun and thrilling.
            It can also make you millions.
          </p>
          <Button className="mx-auto rounded-[12px] border-b-2 border-t-2 border-b-[#5c4b21] border-t-[#d89fee] bg-[#9945FF] px-[24px] py-[16px] hover:bg-[#b977df]">
            <span className="drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
              Play
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
