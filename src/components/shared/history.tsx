import { EmojiClickData } from 'emoji-picker-react';
import { useEffect, useRef, useState } from 'react';
import useToast from '@/hooks/use-toast';
import { chatActions } from '@/store/redux/actions';
import { useAppDispatch, useAppSelector } from '@/store/redux';
import { getAccessToken } from '@/utils/axios';
import { useInView } from 'react-intersection-observer';
import axios from 'axios';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Table, TableBody, TableCell, TableRow } from '../ui/table';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';

export type HistoryItemProps = {
  name: string;
  time: string;
  message: string;
  avatar: string;
};

const History = () => {
  const [inputStr, setInputStr] = useState('');
  const [emojiIsOpened, setEmojiIsOpened] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);
  const [histories, setHistories] = useState<any[]>([]);

  useEffect(() => {
    const getHistory = async () => {
      try {
        const response = await axios
          .get(`${import.meta.env.VITE_SERVER_URL}/crash/`)
          .then((res) => res.data);

        console.log('>>>>>', response);
        const newHistories = await response.reverse();
        setHistories(newHistories.slice(10));
      } catch (e) {
        console.log(e);
      }
    };

    getHistory();
  }, []);
  const userData = useAppSelector((store: any) => store.user.userData);
  const { ref: lastMessageRef, inView } = useInView({
    threshold: 0,
    triggerOnce: false
  });
  const chatState = useAppSelector((state: any) => state.chat);
  const firstChatSentAt =
    chatState?.chatHistory?.length > 0 ? chatState.chatHistory[0].sentAt : null;
  const dispatch = useAppDispatch();

  const [getMoreChat, setGetMoreChat] = useState(false);

  useEffect(() => {
    dispatch(chatActions.loginChatServer());
  }, [getAccessToken()]);

  useEffect(() => {
    dispatch(chatActions.subscribeChatServer());
  }, []);

  useEffect(() => {
    if (getMoreChat) {
      setGetMoreChat(false);
    } else {
      if (
        chatState?.chatHistory &&
        Array.isArray(chatState?.chatHistory) &&
        chatState?.chatHistory.length > 0
      ) {
        setTimeout(() => {
          ref.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'end'
          });
        }, 200);
      }
    }
  }, [chatState?.chatHistory]);

  useEffect(() => {
    if (inView) {
      dispatch(chatActions.getChatHistory(firstChatSentAt));
      setGetMoreChat(true);
    }
  }, [inView]);

  return (
    <Card className="m-2 w-full rounded-lg border-none bg-[#463E7A] text-white shadow-none">
      <CardHeader className="flex flex-row items-center justify-between rounded-t-lg bg-[#191939] p-0 py-[12px] text-base font-semibold">
        <Table className="w-full table-fixed">
          <TableBody>
            <TableRow className="!bg-transparent">
              <TableCell className="w-1/5 p-0 text-center">Bust</TableCell>
              <TableCell className="w-1/5 p-0 text-center">@</TableCell>
              <TableCell className="w-1/5 p-0 text-center">Bet</TableCell>
              <TableCell className="w-1/5 p-0 text-center">Profit</TableCell>
              <TableCell className="w-1/5 p-0 text-center">Hash</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardHeader>
      <CardContent className="bg-[#2C2852] px-2 py-0">
        <ScrollArea className="p-0 lg:h-[295px]">
          <Table className="relative table-fixed border-separate border-spacing-y-3 overflow-y-hidden ">
            <TableBody>
              {histories.map((history, index) => (
                <TableRow key={index} className="text-[#fff]">
                  <TableCell
                    className={`w-1/5 text-center ${history.crashPoint > 170 ? 'text-[#14F195]' : 'text-[#E83035]'}`}
                  >
                    {history.crashPoint / 100}x
                  </TableCell>
                  <TableCell className="w-1/5 text-center">-</TableCell>
                  <TableCell className="w-1/5 text-center">-</TableCell>
                  <TableCell className="w-1/5 text-center">-</TableCell>
                  <TableCell className="w-1/5 text-center">
                    {history.privateHash}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default History;
