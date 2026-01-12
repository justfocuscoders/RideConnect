import { useEffect, useRef } from "react";

const usePolling = (fetchFn, interval = 10000, enabled = true) => {
  const savedCallback = useRef();

  // Store latest fetch function
  useEffect(() => {
    savedCallback.current = fetchFn;
  }, [fetchFn]);

  useEffect(() => {
    if (!enabled) return;

    const tick = async () => {
      try {
        await savedCallback.current?.();
      } catch (err) {
        console.error("Polling error:", err);
      }
    };

    // Initial fetch
    tick();

    const id = setInterval(tick, interval);

    return () => clearInterval(id);
  }, [interval, enabled]);
};

export default usePolling;
