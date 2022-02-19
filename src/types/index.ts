import { Timestamp } from 'firebase/firestore';

export type Participant = {
  username: string;
  profileImg: string;
  fullName: string;
  uid: string;
};

export type Message = {
  message: string;
  timestamp: Timestamp;
  uid: string;
};

export type Chat = {
  lastUpdated: Timestamp;
  messages: Message[];
  participants: (Participant & { left?: string })[];
  chatId: string;
};

export type User = {
  email: string;
  followers: string[];
  following: string[];
  fullName: string;
  posts: string[];
  profileImg: string;
  timestamp: Timestamp;
  uid: string;
  username: string;
  saved: string[];
};
