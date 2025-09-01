"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { SearchResponse } from "./types";
import { searchProducts, ApiClientError } from "./api";

/**
 * Status of the search operation
 */
export type SearchStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * Return type of useSearch hook
 */
export interface UseSearchReturn {
  /** Current query string */
  q: string;
  /** Set query string */
  setQ: (query: string) => void;
  /** Search data (null when no data) */
  data: SearchResponse | null;
  /** Current status of search */
  status: SearchStatus;
  /** Error message (empty string when no error) */
  error: string;
  /** Manually trigger search */
  search: (query: string) => void;
  /** Clear search results and reset to idle */
  reset: () => void;
}

/**
 * Custom hook for product search with debouncing and cancellation
 * 
 * Features:
 * - Automatic debouncing (400ms default)
 * - Request cancellation on new searches
 * - Error handling with user-friendly messages
 * - Status management for UI states
 * - Manual search triggering
 * 
 * @param debounceMs - Debounce delay in milliseconds (default: 400)
 * @returns UseSearchReturn - Search state and controls
 * 
 * @example
 * ```typescript
 * function SearchComponent() {
 *   const { q, setQ, data, status, error } = useSearch();
 *   
 *   return (
 *     <div>
 *       <input value={q} onChange={(e) => setQ(e.target.value)} />
 *       {status === 'loading' && <div>Loading...</div>}
 *       {status === 'error' && <div>Error: {error}</div>}
 *       {status === 'success' && data?.items.map(item => ...)}
 *     </div>
 *   );
 * }
 * ```
 */
export function useSearch(debounceMs: number = 400): UseSearchReturn {
  // State management
  const [q, setQ] = useState<string>("");
  const [data, setData] = useState<SearchResponse | null>(null);
  const [status, setStatus] = useState<SearchStatus>("idle");
  const [error, setError] = useState<string>("");

  // Refs for cleanup and cancellation
  const inFlightController = useRef<AbortController | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Clear any pending timeout
   */
  const clearDebounceTimeout = useCallback(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
      debounceTimeoutRef.current = null;
    }
  }, []);

  /**
   * Abort any in-flight request
   */
  const abortInFlightRequest = useCallback(() => {
    if (inFlightController.current) {
      inFlightController.current.abort();
      inFlightController.current = null;
    }
  }, []);

  /**
   * Reset search state to idle
   */
  const reset = useCallback(() => {
    clearDebounceTimeout();
    abortInFlightRequest();
    setData(null);
    setStatus("idle");
    setError("");
  }, [clearDebounceTimeout, abortInFlightRequest]);

  /**
   * Execute search with given query
   */
  const executeSearch = useCallback(async (query: string) => {
    // Don't search empty queries
    if (!query || query.trim().length === 0) {
      reset();
      return;
    }

    // Cancel previous request
    abortInFlightRequest();

    // Create new controller for this request
    const controller = new AbortController();
    inFlightController.current = controller;

    // Set loading state
    setStatus("loading");
    setError("");

    try {
      const response = await searchProducts(query.trim(), controller.signal);
      
      // Only update state if this request wasn't cancelled
      if (!controller.signal.aborted) {
        setData(response);
        setStatus("success");
        setError("");
      }
    } catch (err) {
      // Only handle error if request wasn't cancelled
      if (!controller.signal.aborted) {
        let errorMessage = "No se pudo completar la búsqueda.";
        
        if (err instanceof ApiClientError) {
          switch (err.statusCode) {
            case 400:
              errorMessage = "Parámetro de búsqueda inválido.";
              break;
            case 404:
              errorMessage = "Servicio no encontrado.";
              break;
            case 500:
              errorMessage = "Error interno del servidor.";
              break;
            case 0:
              if (err.error === 'Network Error') {
                errorMessage = "Error de conexión. Verifica tu conexión a internet.";
              } else if (err.error === 'Request Cancelled') {
                // Don't show error for cancelled requests
                return;
              } else {
                errorMessage = "Error de conexión.";
              }
              break;
            default:
              errorMessage = err.message || errorMessage;
          }
        } else if (err instanceof Error) {
          // Handle other types of errors
          if (err.name === 'AbortError') {
            // Request was cancelled, don't show error
            return;
          }
          errorMessage = err.message || errorMessage;
        }

        setError(errorMessage);
        setStatus("error");
        setData(null);
      }
    }
  }, [abortInFlightRequest, reset]);

  /**
   * Manual search function
   */
  const search = useCallback((query: string) => {
    clearDebounceTimeout();
    executeSearch(query);
  }, [clearDebounceTimeout, executeSearch]);

  /**
   * Effect for debounced search when q changes
   */
  useEffect(() => {
    // Clear previous timeout
    clearDebounceTimeout();

    // Handle empty query
    if (!q || q.trim().length === 0) {
      reset();
      return;
    }

    // Set up debounced search
    debounceTimeoutRef.current = setTimeout(() => {
      executeSearch(q);
    }, debounceMs);

    // Cleanup function
    return () => {
      clearDebounceTimeout();
    };
  }, [q, debounceMs, executeSearch, clearDebounceTimeout, reset]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      clearDebounceTimeout();
      abortInFlightRequest();
    };
  }, [clearDebounceTimeout, abortInFlightRequest]);

  return {
    q,
    setQ,
    data,
    status,
    error,
    search,
    reset,
  };
}
