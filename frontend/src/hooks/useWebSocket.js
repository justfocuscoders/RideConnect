import { useEffect, useRef, useState } from "react";

const WS_URL = "ws://127.0.0.1:8000/ws/dashboard";

export const useWebSocket = () => {
  const socketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token"); // 🔑 FIXED

    if (!token) {
      console.warn("[WS] No access token found");
      return;
    }

    const connect = () => {
      socketRef.current = new WebSocket(`${WS_URL}?token=${token}`);

      socketRef.current.onopen = () => {
        setIsConnected(true);
        console.log("[WS] Connected");
      };

      socketRef.current.onclose = () => {
        setIsConnected(false);
        console.log("[WS] Disconnected");
        reconnectTimeoutRef.current = setTimeout(connect, 3000);
      };

      socketRef.current.onerror = () => {
        socketRef.current.close();
      };
    };

    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      socketRef.current?.close();
    };
  }, []);

  return { isConnected };
};
