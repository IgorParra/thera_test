"use client";

import { useEffect, useState, type ReactNode } from "react";

async function enableMocking() {
  const { worker } = await import("./browser");
  await worker.start({ onUnhandledRequest: "bypass" });
}

export function MSWProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(process.env.NODE_ENV !== "development");

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    enableMocking().then(() => setReady(true));
  }, []);

  if (!ready) return null;

  return <>{children}</>;
}
