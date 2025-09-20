import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { env } from '@/config/env';

export const useSocket = () => {
  // useSocket hook called
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Setting up socket connection
    const instance = io(env.PUBLIC_DOMAIN, {
      transports: ['websocket'],
      reconnectionAttempts: 5,
    });
    setSocket(instance);

    instance.on('connect', () => {
      console.log('✅ socket connected'); // Keeping for debugging
    });

    instance.on('connect_error', (error) => {
      console.error('Socket connection error:', error); // Keeping for debugging
    });

    
    return () => {
      instance.disconnect();
    };
  }, []);

  return socket;
};