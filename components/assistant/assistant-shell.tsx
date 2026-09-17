"use client";

import type { ReactNode } from "react";

import { AssistantPanel } from "@/components/assistant/assistant-panel";
import { AssistantProvider } from "@/components/assistant/assistant-provider";

export function AssistantShell({ children }: { children: ReactNode }) {
  return (
    <AssistantProvider>
      {children}
      <AssistantPanel />
    </AssistantProvider>
  );
}
