import { IChatUser } from './user';

export interface IChat {
  _id: string;
  user: IChatUser;
  message: string;
  sentAt: Date;
}

export enum EChatSocketEvent {
  LOGIN = 'auth',
  JOIN_CHAT = 'join_chat',
  SEND_MSG = 'message',
  RECEIVE_MSG = 'message',
  DISCONNECT_CHAT = 'disconnect',
  RECEIVE_CHAT_HISTORY = 'send-chat-history',
  GET_CHAT_HISTORY = 'get-chat-history',
  NOTIFY_ERROR = 'notify-error'
}

export interface IChatClientToServerEvents {
  [EChatSocketEvent.LOGIN]: (token: string) => void;
  [EChatSocketEvent.JOIN_CHAT]: (_id: string) => void;
  [EChatSocketEvent.SEND_MSG]: (message: string) => void;
  [EChatSocketEvent.GET_CHAT_HISTORY]: (sendAt: Date) => void;
}

export interface IChatServerToClientEvents {
  [EChatSocketEvent.RECEIVE_MSG]: (data: IChat) => void;
  [EChatSocketEvent.NOTIFY_ERROR]: (data: string) => void;
  [EChatSocketEvent.RECEIVE_CHAT_HISTORY]: (data: {
    message: string;
    chatHistories: IChat[];
  }) => void;
}
