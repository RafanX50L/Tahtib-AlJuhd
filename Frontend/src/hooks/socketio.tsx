import { env } from "@/config/env";
import { useEffect, useState } from "react";
import {io, Socket } from 'socket.io-client'
export const useSocket = () => {
  console.log("🔁 useSocket called"); // should print always
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    console.log("⚡ useEffect running"); // check if this logs
    const instens = io(env.PUBLIC_DOMAIN);
    setSocket(instens);

    instens.on("connect", () => {
      console.log("✅ socket connected");
    });

    return () => {
      instens.disconnect();
    };
  }, []);

  return socket;
};
