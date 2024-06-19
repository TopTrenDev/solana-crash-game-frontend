import EmojiPicker, {
  Theme,
  EmojiClickData,
  EmojiStyle
} from 'emoji-picker-react';
import { Separator } from '../ui/separator';
import { Smile, SendHorizonal } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import React, { useEffect, useRef, useState } from 'react';
import useToast from '@/hooks/use-toast';
import { Input } from '../ui/input';
import { chatActions } from '@/store/redux/actions';
import { useAppDispatch, useAppSelector } from '@/store/redux';
import { getAccessToken } from '@/utils/axios';
import { useInView } from 'react-intersection-observer';
import axios from 'axios';

export type HistoryItemProps = {
  name: string;
  time: string;
  message: string;
  avatar: string;
};

const HistoryItem = ({ name, message, avatar, time }: HistoryItemProps) => {
  return (
    <div className="flex items-center gap-1 px-3 py-1">
      <div className="relative"></div>
      <div className="flex flex-1 flex-col justify-between rounded-lg bg-[#4a278d4f] px-2 py-1">
        <div>
          <span className="text-sm font-medium text-gray300">
            {name ?? 'User:'}
          </span>
          <span className="text-xs font-medium text-gray500"> {time}</span>
        </div>
        <div className="max-w-[234px] rounded-sm text-[12px] font-medium text-gray200">
          {message}
        </div>
      </div>
    </div>
  );
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
  const toast = useToast();
  const chatState = useAppSelector((state: any) => state.chat);
  const firstChatSentAt =
    chatState?.chatHistory?.length > 0 ? chatState.chatHistory[0].sentAt : null;
  const dispatch = useAppDispatch();
  const toggleIsOpened = (isOpened: boolean) => {
    setEmojiIsOpened(!isOpened);
  };
  const [getMoreChat, setGetMoreChat] = useState(false);

  const onEmojiClick = (emojiObject: EmojiClickData) => {
    setInputStr((prevInput) => prevInput + emojiObject.emoji);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const sendMessage = () => {
    if (!inputStr) return;
    if (userData.username === '') {
      toast.error('Please login to chat');
      return;
    }

    const message = inputStr;
    try {
      dispatch(chatActions.sendMsg(message));
      setInputStr('');
    } catch (error) {
      console.log(error);
    }
  };

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
    <div className="flex h-[450px] w-full flex-col overflow-scroll bg-dark bg-opacity-80">
      <table className="text-sm text-gray-400">
        <thead className="bg-inherit text-xs font-medium uppercase">
          <tr>
            <th scope="col" className="px-6 py-3 text-left tracking-wider">
              Bust
            </th>
            <th scope="col" className="px-6 py-3 text-left tracking-wider">
              @
            </th>
            <th scope="col" className="px-6 py-3 text-left tracking-wider">
              Bet
            </th>
            <th scope="col" className="px-6 py-3 text-left tracking-wider">
              Profit
            </th>
            <th scope="col" className="px-6 py-3 text-left tracking-wider">
              Hash
            </th>
          </tr>
        </thead>
        <tbody className="bg-[#271b5c]">
          {histories.map((h, i) => (
            <tr
              key={i}
              className={`${i % 2 ? 'bg-[#4b34a7] bg-opacity-20' : ''}`}
            >
              <td className="whitespace-nowrap px-6 py-4 font-medium">
                {h.crashPoint / 100}
              </td>
              <td className="whitespace-nowrap px-6 py-4">—</td>
              <td className="whitespace-nowrap px-6 py-4">—</td>
              <td className="whitespace-nowrap px-6 py-4">—</td>
              <td className="whitespace-nowrap px-6 py-4">{h.privateHash}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default History;
