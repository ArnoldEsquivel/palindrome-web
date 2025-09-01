"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { SearchResponse } from "./types";
import { searchProducts, getAllProducts, ApiClientError } from "./api";

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
 * - Initial load of all products
 * 
 * @param debounceMs - Debounce delay in milliseconds (default: 400)
 * @param loadInitial - Whether to load all products on mount (default: true)
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
export function useSearch(debounceMs: number = 400, loadInitial: boolean = true): UseSearchReturn {
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
   * Execute search with given query or load all products if query is empty
   */
  const executeSearch = useCallback(async (query: string) => {
    console.log('🎯 [useSearch] executeSearch started for query:', JSON.stringify(query));
    
    // Save current focused element before search
    const focusedElement = document.activeElement as HTMLElement;
    const shouldRestoreFocus = focusedElement && focusedElement.id === 'search-input';
    console.log('🎯 [useSearch] Focus preservation:', {
      focusedElement: focusedElement?.tagName,
      focusedElementId: focusedElement?.id,
      shouldRestoreFocus
    });
    
    // Cancel previous request
    abortInFlightRequest();

    // Create new controller for this request
    const controller = new AbortController();
    inFlightController.current = controller;

    // Set loading state
    console.log('🎯 [useSearch] Setting status to loading');
    setStatus("loading");
    setError("");

    try {
      let response: SearchResponse;
      
      if (!query || query.trim().length === 0) {
        console.log('🎯 [useSearch] Empty query, calling getAllProducts');
        // Load all products if no query
        response = await getAllProducts(controller.signal);
      } else {
        console.log('🎯 [useSearch] Non-empty query, calling searchProducts');
        // Search with query
        response = await searchProducts(query.trim(), controller.signal);
      }
      
      console.log('🎯 [useSearch] API response received, updating state to success');
      
      // Only update state if this request wasn't cancelled
      if (!controller.signal.aborted) {
        // Use React.startTransition to make these updates non-blocking
        setData(response);
        setStatus("success");
        setError("");
        console.log('🎯 [useSearch] State updated successfully');
        
        // Restore focus after state update
        if (shouldRestoreFocus && focusedElement) {
          requestAnimationFrame(() => {
            if (document.activeElement !== focusedElement) {
              console.log('🎯 [useSearch] Restoring focus to search input');
              focusedElement.focus();
            } else {
              console.log('🎯 [useSearch] Focus already on search input, no restore needed');
            }
          });
        }
      } else {
        console.log('🎯 [useSearch] Request was aborted, not updating state');
      }
    } catch (err) {
      console.log('🎯 [useSearch] Error in executeSearch:', err);
      
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
        console.log('🎯 [useSearch] Error state set:', errorMessage);
        
        // Restore focus even on error
        if (shouldRestoreFocus && focusedElement) {
          requestAnimationFrame(() => {
            if (document.activeElement !== focusedElement) {
              console.log('🎯 [useSearch] Restoring focus to search input after error');
              focusedElement.focus();
            }
          });
        }
      } else {
        console.log('🎯 [useSearch] Error occurred but request was aborted, ignoring');
      }
    }
  }, [abortInFlightRequest]);

  /**
   * Manual search function
   */
  const search = useCallback((query: string) => {
    clearDebounceTimeout();
    executeSearch(query);
  }, [clearDebounceTimeout, executeSearch]);

  /**
   * Effect for initial load of all products
   */
  useEffect(() => {
    if (loadInitial && status === 'idle' && !q) {
      executeSearch('');
    }
  }, [loadInitial, status, q, executeSearch]);

  /**
   * Effect for debounced search when q changes
   */
  useEffect(() => {
    console.log('🎯 [useSearch] Debounce effect triggered for q:', JSON.stringify(q));
    console.log('🎯 [useSearch] Current DOM focus before setup:', {
      activeElement: document.activeElement?.tagName,
      activeElementId: document.activeElement?.id,
      activeElementType: document.activeElement?.getAttribute?.('type')
    });
    
    // Clear previous timeout
    clearDebounceTimeout();

    // Set up debounced search for any query (including empty)
    debounceTimeoutRef.current = setTimeout(() => {
      console.log('🎯 [useSearch] Debounce timeout fired, executing search');
      console.log('🎯 [useSearch] DOM focus before executeSearch:', {
        activeElement: document.activeElement?.tagName,
        activeElementId: document.activeElement?.id,
        activeElementType: document.activeElement?.getAttribute?.('type')
      });
      
      executeSearch(q).then(() => {
        console.log('🎯 [useSearch] executeSearch completed, DOM focus after:', {
          activeElement: document.activeElement?.tagName,
          activeElementId: document.activeElement?.id,
          activeElementType: document.activeElement?.getAttribute?.('type')
        });
      }).catch((err) => {
        console.error('🎯 [useSearch] executeSearch failed:', err);
      });
    }, debounceMs);

    // Cleanup function
    return () => {
      console.log('🎯 [useSearch] Debounce cleanup called');
      clearDebounceTimeout();
    };
  }, [q, debounceMs, executeSearch, clearDebounceTimeout]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      clearDebounceTimeout();
      abortInFlightRequest();
    };
  }, [clearDebounceTimeout, abortInFlightRequest]);

  // Debug effect to track state changes
  useEffect(() => {
    console.log('🎯 [useSearch] State changed:', {
      q,
      status,
      hasData: !!data,
      dataItemsCount: data?.items?.length,
      error
    });
  }, [q, status, data, error]);

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
