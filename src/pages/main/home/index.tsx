import { Link } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Home() {
  return (
    <ScrollArea className="h-[calc(100vh-64px)]">
      <div className="flex h-full flex-col items-center gap-8 p-12">
        <div className="my-[100px] flex flex-col items-center justify-center gap-6">
          <span className="my-[20px] text-center text-xl font-semibold uppercase text-gray300">
            THE ORIGINAL CRASH GAME
          </span>
          <div className="flex h-full w-full flex-col items-center justify-between gap-8 text-white">
            <h1 className="my-[10px] text-[65px] font-semibold text-[#e58929]">
              solcrash
            </h1>
            <h3 className="my-[10px] ">SOLANA GAMBLING SINCE 2024</h3>
            <Link
              to={'/play'}
              className="my-[10px] w-[40vw] cursor-pointer border-none bg-[#c36f18] px-[50px] py-[15px] text-center text-white shadow-md hover:bg-[#c0996e]"
            >
              Play Now
            </Link>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
