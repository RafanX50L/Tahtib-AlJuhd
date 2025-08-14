import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { env } from '@/config/env';

export const useSocket = () => {
  console.log('🔁 useSocket called');
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    console.log('⚡ useEffect running');
    const instance = io(env.PUBLIC_DOMAIN, {
      transports: ['websocket'],
      reconnectionAttempts: 5,
    });
    setSocket(instance);

    instance.on('connect', () => {
      console.log('✅ socket connected');
    });

    instance.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    return () => {
      instance.disconnect();
    };
  }, []);

  return socket;
};