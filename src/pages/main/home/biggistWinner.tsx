import _1st from '@/assets/img/1st.svg';
import _2nd from '@/assets/img/2nd.svg';
import _3rd from '@/assets/img/3rd.svg';
import _4th from '@/assets/img/4th.svg';
import _5th from '@/assets/img/5th.svg';

function BiggistWinnerItem({
  logo,
  name,
  className,
  score
}: {
  logo: string;
  name: string;
  className?: string;
  score: string;
}) {
  return (
    <div
      className={`m-2 inline-flex flex-col items-center bg-[#ffffff10] px-16 py-6 ${className}`}
    >
      <img src={logo} alt="" />
      <h4 className="text-2xl">{name}</h4>
      <h6 className="text-base text-[#14F195]">{score}</h6>
    </div>
  );
}

export default function BiggistWinner() {
  return (
    <div className="font-clash-display container text-white">
      <h3 className="pb-8 text-center text-5xl">Biggest winners so far</h3>
      <div className="mx-auto flex max-w-[750px] justify-center max-sm:flex-col">
        <BiggistWinnerItem logo={_1st} name="abcde" score="$4,689" />
        <BiggistWinnerItem logo={_2nd} name="abcde" score="$4,689" />
        <BiggistWinnerItem logo={_3rd} name="abcde" score="$4,689" />
      </div>
      <div className="mx-auto flex max-w-[750px] justify-center max-sm:flex-col">
        <BiggistWinnerItem logo={_4th} name="abcde" score="$4,689" />
        <BiggistWinnerItem logo={_5th} name="abcde" score="$4,689" />
      </div>
    </div>
  );
}
