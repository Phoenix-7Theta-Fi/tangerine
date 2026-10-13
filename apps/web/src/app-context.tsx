import { createContext, useContext } from 'react';
import type { Api } from './lib/api';
import type { TangerineSocket } from './lib/socket';
import type { User } from './lib/types';

export interface AppValue {
  api: Api;
  me: User;
  users: User[];
  socket: TangerineSocket;
  connected: boolean;
  toast: (message: string) => void;
  startChatWith: (userId: string) => void;
  openProfile: (userId: string) => void;
}

export const AppContext = createContext<AppValue | null>(null);

export function useApp(): AppValue {
  const value = useContext(AppContext);
  if (!value) throw new Error('useApp must be used inside AppContext');
  return value;
}
