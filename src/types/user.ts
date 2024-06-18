export interface IChatUser {
  _id: string;
  username: string;
  avatar: string;
  hasVerifiedAccount: boolean;
  createdAt: Date;
}
