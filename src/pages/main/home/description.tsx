import { Alert } from '@/components/ui/alert';
import { BsInfoCircleFill } from 'react-icons/bs';

export default () => {
  return (
    <div className="container">
      <div className="mx-auto max-w-[750px]">
        <div className="flex flex-col items-center justify-center py-32 text-white">
          <h3 className="font-clash-display text-center text-4xl">
            How does it work?
          </h3>
          <div className="how-does-work relative flex w-full">
            <div className="absolute">
              <div>
                <div></div>
                <div></div>
              </div>
            </div>
            <div className="item px-4 py-8">
              <div className="mx-auto mb-4">1</div>
              <p className="font-clash-grotesk text-[#BDC9D4]">Place a bet</p>
            </div>
            <div className="item px-4 py-8">
              <div className="mx-auto mb-4">2</div>
              <p className="font-clash-grotesk text-[#BDC9D4]">
                Watch the multipiler increase from 1x upwards!{' '}
              </p>
            </div>
            <div className="item px-4 py-8">
              <div className="mx-auto mb-4">3</div>
              <p className="font-clash-grotesk text-[#BDC9D4]">
                Cash out any time to get your bet multiplied by that multiplier
              </p>
            </div>
          </div>
          <Alert className="inline-block w-auto rounded-[16px] border-[#FF574B30] bg-[#FF574B15] text-[#FF574B]">
            <p>
              <BsInfoCircleFill
                className="inline-block text-[#FF574B]"
                size={20}
              />
              <a className="font-clash-grotesk mx-2">
                Be careful because the game can bust at any time, and you'll get
                nothing!
              </a>
            </p>
          </Alert>
        </div>
      </div>
    </div>
  );
};
