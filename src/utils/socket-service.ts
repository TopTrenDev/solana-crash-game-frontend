import {
  IChatClientToServerEvents,
  IChatServerToClientEvents,
  IUserClientToServerEvents,
  IUserServerToClientEvents
} from '@/types';
import {
  ILeaderboardClientToServerEvents,
  ILeaderboardServerToClientEvents
} from '@/types/leader';
import { IPaymentClientToServerEvents, IPaymentServerToClientEvents } from '@/types/payment';
import { Socket, io } from 'socket.io-client';
// import customParser from 'socket.io-msgpack-parser'

const SERVER_URL = import.meta.env.VITE_SERVER_URL;
const createSocket = <ServerEvents, ClientEvents>(
  namespace: string
): Socket<any, any> => {
  return io(
    `${SERVER_URL}/${namespace}`
    //  { parser: customParser }
  );
};

const chatSocket = createSocket<
  IChatServerToClientEvents,
  IChatClientToServerEvents
>('chat');

const paymentSocket = createSocket<
  IPaymentServerToClientEvents,
  IPaymentClientToServerEvents
>('payment');

// const leaderboardSocket = createSocket<
//   ILeaderboardServerToClientEvents,
//   ILeaderboardClientToServerEvents
// >('leaderboard');

const userSocket = createSocket<
  IUserServerToClientEvents,
  IUserClientToServerEvents
>('user');

const SolacrashSocket = {
  chat: chatSocket,
  user: userSocket,
  payment: paymentSocket
  // coinflip: coinflipSocket,
  // leaderboard: leaderboardSocket,
  // mines: minesSocket
};

export default SolacrashSocket;
