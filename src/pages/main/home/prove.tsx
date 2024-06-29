import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';

import { FaBalanceScale, FaRegCreditCard, FaUsers } from 'react-icons/fa';
// import {
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger
// } from '@radix-ui/react-accordion';

export default function Prove() {
  return (
    <div className="font-clash-display container mx-[-3] grid grid-cols-10 gap-4 py-32 max-lg:grid-cols-1">
      <div className="col-span-4 text-white">
        <h3 className="text-center text-5xl max-sm:text-3xl">
          Prove by the Community
        </h3>
      </div>
      <Accordion
        className="AccordionRoot col-span-6 text-white"
        type="single"
        defaultValue="item-1"
        collapsible
      >
        <AccordionItem
          className="AccordionItem mb-8 bg-[#ffffff10]  p-6"
          value="item-1"
        >
          <AccordionTrigger className="py-0">
            <div className="flex items-center">
              <FaUsers className="text-[#14F195]" size={26} />
              <a className="px-4 text-xl">Social & Real Time</a>
            </div>
          </AccordionTrigger>
          <AccordionContent className="AccordionContent mx-10 py-4">
            <div className="AccordionContentText font-clash-grotesk text-lg text-[#BDC9D4]">
              Be part of our unique community. Watch your fortune rise and play
              with friends in real time.
              <br />
              <br />
              Features such as a friend list and private messages make it easier
              to talk to your friends and make new friends in game.
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem
          className="AccordionItem mb-8 bg-[#ffffff10]  p-6"
          value="item-2"
        >
          <AccordionTrigger className="py-0">
            <div className="flex items-center">
              <FaBalanceScale className="text-[#14F195]" size={26} />
              <a className="px-4 text-xl">Provably Fair</a>
            </div>
          </AccordionTrigger>
          <AccordionContent className="AccordionContent mx-10 py-4">
            <div className="AccordionContentText font-clash-grotesk text-lg text-[#BDC9D4]">
              Be part of our unique community. Watch your fortune rise and play
              with friends in real time.
              <br />
              <br />
              Features such as a friend list and private messages make it easier
              to talk to your friends and make new friends in game.
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem
          className="AccordionItem mb-8 bg-[#ffffff10]  p-6"
          value="item-3"
        >
          <AccordionTrigger className="py-0">
            <div className="flex items-center">
              <FaRegCreditCard className="text-[#14F195]" size={26} />
              <a className="px-4 text-xl">Be the Bankroll</a>
            </div>
          </AccordionTrigger>
          <AccordionContent className="AccordionContent mx-10 py-4">
            <div className="AccordionContentText font-clash-grotesk text-lg text-[#BDC9D4]">
              Be part of our unique community. Watch your fortune rise and play
              with friends in real time.
              <br />
              <br />
              Features such as a friend list and private messages make it easier
              to talk to your friends and make new friends in game.
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
