import { Button } from '@/components/ui/button';

const LearnMore = () => {
  return (
    <div className="w-fluid font-clash-display mt-52 bg-bottom pb-32 max-xl:mt-20 max-xl:pb-20">
      <div className="w-full">
        <div className="mb-8  text-center text-white">
          <h3 className="text-6xl">Learn More</h3>
          <p className="py-4 text-xl">
            If you still have questions or simply want to learn more you can
            check our Help Docs or our solanatalk thread.
          </p>
          <div className=" flex-col items-center max-md:flex">
            <Button className="mx-2  min-w-[200px] rounded-[12px] border-b-2 border-t-2 border-b-[#292447] border-t-[#6f62c0] bg-[#463E7A] px-[24px] py-[16px] hover:bg-[#6f62c0] max-md:my-2 max-md:flex">
              <span className="drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
                Help Doc
              </span>
            </Button>
            <Button className="mx-2 min-w-[200px]  rounded-[12px] border-b-2 border-t-2 border-b-[#5c4b21] border-t-[#d89fee] bg-[#9945FF] px-[24px] py-[16px] hover:bg-[#b977df] max-md:my-2 max-md:flex">
              <span className="drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
                SolanaTalk Thread
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnMore;
