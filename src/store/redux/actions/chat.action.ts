import { IChat } from '@/types';
import { EChatSocketAction } from '../reducers/chat.type';

export function receiveChatHistory(chatHistory: IChat[]) {
  return {
    type: EChatSocketAction.RECEIVE_CHAT_HISTORY,
    payload: chatHistory
  };
}

export function receiveMsg(msg: IChat) {
  return {
    type: EChatSocketAction.RECEIVE_MSG,
    payload: msg
  };
}

export function receiveError(error: string) {
  return {
    type: EChatSocketAction.ERROR,
    payload: error
  };
}

export function sendMsg(msg: string) {
  return {
    type: EChatSocketAction.SEND_MSG,
    payload: msg
  };
}

export function loginChatServer() {
  return {
    type: EChatSocketAction.LOGIN_CHAT,
    payload: 'success'
  };
}

export function subscribeChatServer() {
  return {
    type: EChatSocketAction.SUBSCRIBE_CHAT,
    payload: null
  };
}

export function disconnectChatServer() {
  return {
    type: EChatSocketAction.DISCONNECT_CHAT,
    payload: null
  };
}

export function getChatHistory(sendAt) {
  return {
    type: EChatSocketAction.GET_CHAT_HISTORY,
    payload: sendAt
  };
}
