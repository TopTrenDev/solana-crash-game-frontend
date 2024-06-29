import { ReactNode } from 'react';
import { BsBank } from 'react-icons/bs';
import { LuRefreshCcw } from 'react-icons/lu';
import { IoSunnySharp } from 'react-icons/io5';
import { FaLock } from 'react-icons/fa';

const FeatureItem = ({
  children,
  className,
  icon,
  color,
  title
}: {
  children: ReactNode;
  icon: ReactNode;
  className?: string;
  color: string;
  title: string;
}) => {
  return (
    <div className={`feature-item p-6 ${className}`}>
      <div
        className="feature-icon"
        style={{
          backgroundColor: `${color}10`,
          border: `1px solid ${color}20`,
          color: color
        }}
      >
        {icon}
      </div>
      <h4 className="text-xl" style={{ borderLeft: `3px solid ${color}` }}>
        {title}
      </h4>
      {children}
    </div>
  );
};


export default function Feature () {
  return (
    <div className="font-clash-display container grid grid-cols-3 gap-4 text-white max-lg:grid-cols-1">
      <h3 className="text-center text-5xl">Features</h3>
      <div>
        <FeatureItem
          className="mb-4 bg-[#ffffff10]"
          icon={<BsBank size={24} />}
          color={'#00ffff'}
          title={'Be the Bankroll'}
        >
          <p className="font-clash-grotesk text-lg text-[#BDC9D4]">
            You can increase your fortune not just by playing, but also being
            part of the bankroll and gaining (or losing) with bustabit's profits
            and losses.
          </p>
        </FeatureItem>
        <FeatureItem
          className="mb-4 bg-[#ffffff10]"
          icon={<LuRefreshCcw size={24} />}
          color={'#9945FF'}
          title={'Advanced Autobet'}
        >
          <p className="font-clash-grotesk text-lg text-[#BDC9D4]">
            Create and share scripts for your preferred autobet strategy using a
            sandbox.
          </p>
        </FeatureItem>
      </div>
      <div>
        <FeatureItem
          className="mb-4 bg-[#ffffff10]"
          icon={<IoSunnySharp size={24} />}
          color={'#FFD512'}
          title={'Performance Overhaul'}
        >
          <p className="font-clash-grotesk text-lg text-[#BDC9D4]">
            bustabit has been rewritten for the most efficient performance and
            the ultimate user experience.
          </p>
        </FeatureItem>
        <FeatureItem
          className="mb-4 bg-[#ffffff10]"
          icon={<FaLock size={24} />}
          color={'#14F195'}
          title={'Enhanced Privacy'}
        >
          <p className="font-clash-grotesk text-lg text-[#BDC9D4]">
            We use a sophisticated coin selection algorithm tailored to bustabit
            when handling payments in order to offer our players and investors
            industry-leading privacy.
          </p>
        </FeatureItem>
      </div>
    </div>
  );
};
