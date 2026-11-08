"use client";

import { isServer, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { QueryProviderProps } from "../type";

// the settings every query in the app uses
const makeQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // sleep data barely changes, so it stays fresh for 5 min
        refetchOnWindowFocus: false, // don't refetch just because they switched tabs
        retry: false, // a 401 or 429 won't fix itself by trying again
      },
    },
  });

// the browser's cache, made the first time it's needed
let browserQueryClient: QueryClient | undefined = undefined;

const getQueryClient = () => {
  // on the server make a new one every time, so users never share a cache
  if (isServer) {
    return makeQueryClient();
  }

  // in the browser make it once and keep reusing it
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
};

// gives every page access to tanstack query and its cache
const QueryProvider = ({ children }: QueryProviderProps) => {
  const queryClient = getQueryClient();

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

export default QueryProvider;
