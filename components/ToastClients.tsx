"use client";

import { Toaster as RadixToaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

export function ToastClients() {
  return (
    <>
      <RadixToaster />
      <SonnerToaster />
    </>
  );
}
