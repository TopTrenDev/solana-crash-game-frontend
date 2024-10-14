import EmojiPicker, {
  Theme,
  EmojiClickData,
  EmojiStyle
} from 'emoji-picker-react';
import { Smile, SendHorizonal } from 'lucide-react';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import React, { useEffect, useRef, useState } from 'react';
import useToast from '@/hooks/use-toast';
import { Input } from '../ui/input';
import { chatActions, userActions } from '@/store/redux/actions';
import { useAppDispatch, useAppSelector } from '@/store/redux';
import { getAccessToken } from '@/utils/axios';
import { useInView } from 'react-intersection-observer';
import useModal from '@/hooks/use-modal';

import { ModalType } from '@/types/modal';
import { IChatUser } from '@/types';
import { useDispatch } from 'react-redux';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';

export type HistoryItemProps = {
  name: string;
  time: string;
  message: string;
  avatar: string;
  user: IChatUser;
};

const HistoryItem = ({
  name,
  message,
  avatar,
  time,
  user
}: HistoryItemProps) => {
  const dispatch = useDispatch();
  const modal = useModal();
  const openModal = () => {
    modal.open(ModalType.USERINFO);
    dispatch(userActions.saveSelectedUser(user));
  };

  return (
    <div className="flex items-center gap-1 px-3 py-1">
      <div className="flex items-center justify-start gap-2">
        <span className="text-[12px] font-medium text-gray500"> {time}</span>
        <span
          className="cursor-pointer text-[12px] font-medium text-[#7f7fd1] hover:text-gray500"
          onClick={() => openModal()}
        >
          {name ?? 'User'}:
        </span>
        <span className="text-[14px] text-white">{message}</span>
      </div>
    </div>
  );
};

interface LiveChatProps {
  className?: string;
}

const LiveChat = ({ className }: LiveChatProps) => {
  const [inputStr, setInputStr] = useState('');
  const [emojiIsOpened, setEmojiIsOpened] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);
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
    <Card className="m-2 w-full rounded-lg border-none bg-[#463E7A] text-white shadow-none">
      <CardContent className="rounded-t-lg bg-[#2C2852] px-2 py-0">
        <ScrollArea className="max-h-60 min-h-10 overflow-scroll p-0">
          <div className="flex w-full flex-col">
            <div ref={lastMessageRef}></div>
            {chatState?.chatHistory &&
              Array.isArray(chatState?.chatHistory) &&
              chatState?.chatHistory?.map((chat, key) => (
                <React.Fragment key={key}>
                  <HistoryItem
                    name={chat.user?.username}
                    avatar={chat.user?.avatar}
                    time={formatTime(chat.sentAt.toString())}
                    message={chat.message}
                    user={chat.user}
                  />
                  <div ref={ref}></div>
                </React.Fragment>
              ))}
          </div>

          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex w-full flex-row items-center justify-between gap-4 rounded-b-lg bg-[#191939] p-0 px-2 text-base font-semibold">
        <Smile
          className={`cursor-pointer ${emojiIsOpened ? 'text-yellow' : ''}`}
          onClick={() => {
            toggleIsOpened(emojiIsOpened);
          }}
        />
        <Input
          className="!focus:ring-0 !focus:ring-offset-0 !focus:ring w-full resize-none overflow-hidden rounded-none !border-none !bg-transparent p-0 text-gray-400 !outline-none !ring-0 !ring-offset-0"
          value={inputStr}
          onChange={(e) => {
            setInputStr(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              sendMessage();
              e.preventDefault();
            }
          }}
        />
        <SendHorizonal
          className="hover: cursor-pointer text-blue2"
          onClick={sendMessage}
        />
      </CardFooter>
      {/* <div className="flex h-[73%] max-h-[180px] min-h-10 flex-1 flex-col items-stretch gap-4 bg-[#2C2852] lg:max-h-[185px] lg:min-h-[150px]">
          <ScrollArea
            className={`py-1 ${emojiIsOpened ? ' max-h-[calc(80vh-300px)]' : ' max-h-[calc(80vh)]'}`}
          >
          </ScrollArea>
        </div> */}
    </Card>
  );
};

export default LiveChat;
