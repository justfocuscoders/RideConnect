import { useEffect, useRef } from "react";

const WS_URL = "ws://127.0.0.1:8000/ws/dashboard";

export const useWebSocket = (onMessage) => {
  const socketRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const ws = new WebSocket(`${WS_URL}?token=${token}`);
    socketRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        onMessage?.(payload);
      } catch {
        // ignore bad payloads
      }
    };

    ws.onerror = () => {};
    ws.onclose = () => {};

    return () => ws.close();
  }, [onMessage]);
};
