export type Role = 'MEMBER' | 'PRACTITIONER' | 'PROVIDER';

export interface User {
  id: string;
  handle: string;
  displayName: string;
  avatarUrl: string | null;
  role: Role;
  headline: string | null;
  region: string | null;
  isCelebrity: boolean;
  online?: boolean;
  isFollowing?: boolean;
}

export interface UserProfile extends User {
  bio: string | null;
  verified: boolean;
  followerCount: number;
  followingCount: number;
  postCount: number;
  isSelf: boolean;
}

export interface Post {
  id: string;
  body: string;
  mediaUrl: string | null;
  createdAt: string;
  author: User;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  liked: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  body: string;
  createdAt: string;
  author: Pick<User, 'id' | 'handle' | 'displayName' | 'avatarUrl'>;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  seq: number;
  type: string;
  createdAt: string;
  clientMsgId: string;
}

export interface Conversation {
  id: string;
  type: 'DIRECT' | 'GROUP';
  title: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
  members: User[];
  lastMessage: { body: string; senderId: string; createdAt: string } | null;
}

export interface Page<T> {
  items: T[];
  nextCursor: string | null;
}
