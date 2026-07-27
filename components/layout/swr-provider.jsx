"use client";

import { SWRConfig } from "swr";
import { fetcher } from "@/lib/utils/api-client";

export function SwrProvider({ children }) {
  return (
    <SWRConfig value={{ fetcher, revalidateOnFocus: false }}>{children}</SWRConfig>
  );
}
