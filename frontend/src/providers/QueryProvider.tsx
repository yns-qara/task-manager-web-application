/**
 * React Query provider component
 * Sets up the QueryClient and provides it to the entire application
 */
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QUERY_CONFIG } from '../utils/constants';

/**
 * Props for the QueryProvider component
 */
interface QueryProviderProps {
  /**
   * Child components that will have access to React Query
   */
  children: React.ReactNode;
}

/**
 * Create a QueryClient instance with custom configuration
 * Configures default options for queries and mutations
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // How long data stays fresh before being considered stale
      staleTime: QUERY_CONFIG.DEFAULT_STALE_TIME,
      
      // How long unused/inactive cache entries remain in memory
      gcTime: QUERY_CONFIG.DEFAULT_CACHE_TIME,
      
      // Number of retry attempts for failed queries
      retry: QUERY_CONFIG.RETRY_COUNT,
      
      // Retry delay function with exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Refetch on window focus in production for fresh data
      refetchOnWindowFocus: process.env.NODE_ENV === 'production',
      
      // Refetch on reconnect to sync after network issues
      refetchOnReconnect: true,
      
      // Don't refetch on mount if data is still fresh
      refetchOnMount: 'always',
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,
      
      // Shorter retry delay for mutations
      retryDelay: 1000,
    },
  },
});

/**
 * QueryProvider component that wraps the app with React Query context
 * Provides caching, synchronization, and dev tools for the entire application
 * 
 * @param props - Component props
 * @returns JSX element providing React Query context
 */
export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* React Query DevTools - only shows in development */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools 
          initialIsOpen={false}
        />
      )}
    </QueryClientProvider>
  );
}