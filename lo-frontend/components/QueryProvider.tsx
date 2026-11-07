"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { QueryProviderProps } from "../type";

// gives every page access to tanstack query and its cache
const QueryProvider = ({ children }: QueryProviderProps) => {
  // useState so the client is only made once, not again on every render
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // sleep data barely changes, so it stays fresh for 5 min
            refetchOnWindowFocus: false, // don't refetch just because they switched tabs
            retry: false, // a 401 or 429 won't fix itself by trying again
          },
        },
      })
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

export default QueryProvider;
