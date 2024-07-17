import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import { ModalType } from '@/types/modal';
import useModal from '@/hooks/use-modal';
import { useAppSelector } from '@/store/redux';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';
import { helpTickets, Ticket } from '@/constants/data';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';


export default function HelpModal() {
  const { open, type } = useAppSelector((state: any) => state.modal);
  const [tickets, setTickets] = useState<Ticket[]>(helpTickets);
  const [selectedTicket, setTicket] = useState<Ticket | null>(null);
  const [keyword, setKeyword] = useState<string>('');

  const isOpen = open && type === ModalType.HELP;
  const modal = useModal();

  const hanndleOpenChange = async () => {
    if (isOpen) {
      modal.close(ModalType.HELP);
      setTicket(null)
    }
  };

  const onSearch = (e: any) => {
    const txt = e.target.value;
    setKeyword(txt);
  }

  useEffect(() => {
    const filtered = helpTickets.filter((ticket: Ticket) => {
      return ticket.name.toUpperCase().indexOf(keyword.toUpperCase()) > -1
    })
    setTickets(filtered)
  }, [keyword])

  return (
    <Dialog open={isOpen} onOpenChange={hanndleOpenChange}>
      <DialogContent className="gap-0 rounded-[8px] border-2 border-none bg-[#0D0B32] p-0 text-white sm:max-w-sm lg:w-[800px] lg:!max-w-[800px]">
        <DialogHeader className="flex flex-row items-center justify-between rounded-t-[8px] bg-[#463E7A] px-[24px] py-[20px]">
          <DialogTitle className="text-center text-[24px] font-semibold uppercase">
            Help
          </DialogTitle>
          <DialogClose className="hover:ropacity-100 !my-0 rounded-sm opacity-70 outline-none ring-offset-background transition-opacity focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:text-muted-foreground">
            <Cross2Icon className="h-7 w-7 text-white" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        <div className="rounded-b-[8px] bg-[#2C2852] py-[36px]">
          {
            !selectedTicket ? <div className="flex max-h-[80vh] overflow-y-auto flex-col items-center gap-10 overflow-scroll px-[25px]">
              <input type="search" placeholder='How can we help?' onChange={onSearch} value={keyword} className='w-full px-3 py-2 rounded-sm text-black' />
              <div className='flex flex-col gap-2 w-full'>
                {
                  tickets.map((ticket: Ticket, index: number) => {
                    return <div key={index} className='flex justify-between items-center uppercase cursor-pointer hover:bg-[#463E7A] p-1 px-2' onClick={() => setTicket(ticket)}>
                      <span>
                        {
                          ticket.name
                        }
                      </span>
                      <FaArrowRight />
                    </div>
                  })
                }
              </div>
            </div> : <div className="flex max-h-[80vh] overflow-y-auto flex-col items-center gap-5 overflow-scroll px-[25px]">
              <div className='uppercase font-bold text-left w-full'>
                {selectedTicket.name}
              </div>
              <p>
                {selectedTicket.content}
              </p>
              <div className='pt-3 w-full '>
                <button onClick={() => setTicket(null)} className='flex items-center gap-2 cursor-pointer bg-[#463E7A] rounded-xl hover:bg-[#a9a5c0] p-2'><FaArrowLeft /> Back to support index</button>
              </div>
            </div>
          }
        </div>
      </DialogContent>
    </Dialog>
  );
}
