import { io, type Socket } from 'socket.io-client';
import { API_BASE } from './api';

export type TangerineSocket = Socket;

export function createSocket(userId: string): TangerineSocket {
  return io(API_BASE, {
    auth: { userId },
    transports: ['websocket', 'polling'],
  });
}
