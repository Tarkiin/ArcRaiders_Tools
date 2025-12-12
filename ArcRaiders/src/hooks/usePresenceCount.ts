import { useEffect, useRef, useState } from "react";

const CHANNEL = "arc_presence_v1";
const HEARTBEAT_MS = 5000;
const STALE_MS = 15000;

type PresenceMessage =
  | { type: "hello"; id: string; ts: number }
  | { type: "ping"; id: string; ts: number }
  | { type: "bye"; id: string; ts: number };

export function usePresenceCount() {
  const [count, setCount] = useState(1);
  const idRef = useRef<string>(crypto.randomUUID());
  const seenRef = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    const id = idRef.current;
    const now = Date.now();
    seenRef.current.set(id, now);

    const bc = "BroadcastChannel" in window ? new BroadcastChannel(CHANNEL) : null;
    const post = (msg: PresenceMessage) => {
      if (bc) bc.postMessage(msg);
    };

    const recompute = () => {
      const t = Date.now();
      for (const [k, last] of seenRef.current.entries()) {
        if (t - last > STALE_MS) seenRef.current.delete(k);
      }
      setCount(seenRef.current.size || 1);
    };

    const onMessage = (raw: MessageEvent) => {
      const msg = raw.data as PresenceMessage | undefined;
      if (!msg || typeof msg !== "object") return;
      if (!("id" in msg) || typeof (msg as any).id !== "string") return;
      if (!("ts" in msg) || typeof (msg as any).ts !== "number") return;
      if ((msg as any).type === "bye") {
        seenRef.current.delete((msg as any).id);
        recompute();
        return;
      }
      seenRef.current.set((msg as any).id, (msg as any).ts);
      if ((msg as any).type === "hello") {
        post({ type: "hello", id, ts: Date.now() });
      }
      recompute();
    };

    if (bc) bc.addEventListener("message", onMessage);

    post({ type: "hello", id, ts: Date.now() });
    recompute();

    const interval = window.setInterval(() => {
      post({ type: "ping", id, ts: Date.now() });
      recompute();
    }, HEARTBEAT_MS);

    const onBeforeUnload = () => post({ type: "bye", id, ts: Date.now() });
    window.addEventListener("beforeunload", onBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      window.clearInterval(interval);
      post({ type: "bye", id, ts: Date.now() });
      if (bc) {
        bc.removeEventListener("message", onMessage);
        bc.close();
      }
    };
  }, []);

  return count;
}

