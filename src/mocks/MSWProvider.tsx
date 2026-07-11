"use client";

import { useEffect, type ReactNode } from "react";

async function enableMocking() {
  const { worker } = await import("./browser");
  await worker.start({ onUnhandledRequest: "bypass" });
}

export function MSWProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    enableMocking();
  }, []);

  return <>{children}</>;
}
