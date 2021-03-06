import { Timestamp } from 'firebase/firestore';

export type Chat = {
  lastUpdated: Timestamp;
  messages: Message[];
  participants: (Participant & { left?: string })[];
  chatId: string;
};

export type Comment = {
  comment: string;
  profileImg: string;
  username: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type Message = {
  message: string;
  timestamp: Timestamp;
  uid: string;
};

export type NewUser = {
  username: string;
  fullName: string;
  email: string;
  password: string;
};

export type Notification = {
  type: NotificationType;
  senderUsername: string;
  senderProfileImg: string;
  targetUserId: string;
  postId: string;
  timestamp: Timestamp;
  docId: string;
};

export type NotificationType = 'like' | 'comment' | 'follow' | 'newChat' | 'leftChat';

export type Participant = {
  username: string;
  profileImg: string;
  fullName: string;
  uid: string;
};

export type Post = {
  caption: string;
  comments: Comment[];
  image: string;
  likes: string[];
  profileImg: string[];
  timestamp: Timestamp;
  uid: string;
  username: string;
  docId: string;
};

export type PostAction = 'add' | 'remove';

export type StorageDirectory = 'avatars' | 'posts';

export type SuggestedUser = {
  profileImg: string;
  uid: string;
  username: string;
  fullName: string;
};

export type User = SuggestedUser & {
  email: string;
  followers: string[];
  following: string[];
  posts: string[];
  timestamp: Timestamp;
  saved: string[];
  bio?: string;
  phoneNumber?: string;
  website?: string;
};
