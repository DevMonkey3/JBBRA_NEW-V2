/**
 * SWR Data Fetching Hooks
 * Centralized data fetching with caching, revalidation, and error handling
 */

import useSWR, { SWRConfiguration } from 'swr';

// Generic fetcher function
const fetcher = async (url: string) => {
  const res = await fetch(url);
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }
  
  return res.json();
};

// Default configuration for better performance
const defaultConfig: SWRConfiguration = {
  revalidateOnFocus: false, // Don't revalidate on window focus
  revalidateOnReconnect: true, // Revalidate when reconnecting
  dedupingInterval: 2000, // Don't duplicate requests within 2s
  errorRetryCount: 3, // Retry failed requests 3 times
  keepPreviousData: true, // Keep previous data while loading new data
};

/**
 * Generic SWR hook for data fetching
 * @param key - The cache key (usually the API endpoint)
 * @param config - Optional SWR configuration
 */
export function useFetch<T = any>(key: string | null, config?: SWRConfiguration) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<T>(
    key,
    fetcher,
    { ...defaultConfig, ...config }
  );

  return {
    data,
    error,
    isLoading,
    isValidating,
    isError: !!error,
    mutate,
  };
}

/**
 * Hook for fetching blog posts with pagination
 */
export function useBlogPosts(page: number = 1, limit: number = 12) {
  const key = page ? `/api/blog?page=${page}&limit=${limit}` : null;
  return useFetch(key);
}

/**
 * Hook for fetching notices with pagination
 */
export function useNotices(page: number = 1, limit: number = 12) {
  const key = page ? `/api/notices?page=${page}&limit=${limit}` : null;
  return useFetch(key);
}

/**
 * Hook for fetching a single blog post by slug
 */
export function useBlogPost(slug: string | null) {
  const key = slug ? `/api/blog/${slug}` : null;
  return useFetch(key);
}

/**
 * Hook for fetching a single notice by slug
 */
export function useNotice(slug: string | null) {
  const key = slug ? `/api/notices/${slug}` : null;
  return useFetch(key);
}

/**
 * Hook for fetching seminars
 */
export function useSeminars(page: number = 1, limit: number = 10) {
  const key = page ? `/api/seminars?page=${page}&limit=${limit}` : null;
  return useFetch(key);
}

/**
 * Hook for fetching announcements
 */
export function useAnnouncements(page: number = 1, limit: number = 10) {
  const key = page ? `/api/announcements?page=${page}&limit=${limit}` : null;
  return useFetch(key);
}
