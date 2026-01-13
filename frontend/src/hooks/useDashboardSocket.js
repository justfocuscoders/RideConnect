import { useEffect, useRef } from "react";

export default function useDashboardSocket({ token, onMessage }) {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!token) return;

    const ws = new WebSocket(
      `ws://localhost:8000/ws/dashboard?token=${token}`
    );

    ws.onopen = () => {
      console.log("Driver WebSocket connected");
    };

    ws.onmessage = (event) => {
      const payload = JSON.parse(event.data);
      onMessage(payload);
    };

    ws.onerror = (err) => {
      console.error("WebSocket error", err);
    };

    ws.onclose = () => {
      console.log("Driver WebSocket disconnected");
    };

    socketRef.current = ws;

    return () => {
      ws.close();
    };
  }, [token, onMessage]);
}
