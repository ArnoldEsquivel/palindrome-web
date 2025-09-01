import React, { useRef, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Props for SearchBar component
 */
export interface SearchBarProps {
  /** Current search query value */
  value: string;
  /** Callback when search query changes */
  onChange: (value: string) => void;
  /** Whether the search is currently loading */
  isLoading?: boolean;
  /** Callback for manual search submission */
  onSearch?: (value: string) => void;
  /** Callback to clear the search */
  onClear?: () => void;
  /** Custom placeholder text */
  placeholder?: string;
  /** Additional CSS classes */
  className?: string;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Auto focus on mount */
  autoFocus?: boolean;
}

/**
 * SearchBar component with accessibility, debouncing support, and UX features
 * 
 * Features:
 * - WCAG 2.1 AA compliant accessibility
 * - Visual loading state indicator
 * - Clear button when there's content
 * - Manual search with Enter key
 * - Responsive design (mobile-first)
 * - Helper text for user guidance
 * 
 * @example
 * ```tsx
 * const { q, setQ, status } = useSearch();
 * 
 * <SearchBar
 *   value={q}
 *   onChange={setQ}
 *   isLoading={status === 'loading'}
 *   onSearch={search}
 *   onClear={reset}
 * />
 * ```
 */
export default function SearchBar({
  value,
  onChange,
  isLoading = false,
  onSearch,
  onClear,
  placeholder = "Busca productos de tennis...",
  className,
  disabled = false,
  autoFocus = false,
}: SearchBarProps) {
  
  // Ref to maintain focus on input
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Track if user is actively typing to maintain focus
  const isUserTypingRef = useRef(false);
  const lastUserInteractionRef = useRef(Date.now());
  
  // Auto-focus on mount
  useEffect(() => {
    if (autoFocus && inputRef.current && !disabled) {
      inputRef.current.focus();
    }
  }, [autoFocus, disabled]);
  
  // Aggressive focus preservation during loading/search operations
  useEffect(() => {
    if (!inputRef.current || disabled) return;
    
    const checkAndRestoreFocus = () => {
      // Only restore focus if user was recently typing (within last 2 seconds)
      const timeSinceLastInteraction = Date.now() - lastUserInteractionRef.current;
      const shouldMaintainFocus = isUserTypingRef.current && timeSinceLastInteraction < 2000;
      
      if (shouldMaintainFocus && document.activeElement !== inputRef.current) {
        console.log('🎯 [SearchBar] Focus lost during search, restoring...');
        inputRef.current?.focus();
      }
    };
    
    // Check focus every 100ms during loading
    let intervalId: NodeJS.Timeout | null = null;
    if (isLoading) {
      intervalId = setInterval(checkAndRestoreFocus, 100);
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isLoading, disabled]);
  
  /**
   * Handle form submission (Enter key or manual search button)
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && value.trim()) {
      onSearch(value.trim());
    }
  };

  /**
   * Handle input change with validation
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // Mark user as actively typing
    isUserTypingRef.current = true;
    lastUserInteractionRef.current = Date.now();
    
    console.log('🎯 [SearchBar] Input change detected:', {
      oldValue: value,
      newValue,
      length: newValue.length,
      isInputFocused: document.activeElement === inputRef.current,
      activeElement: document.activeElement?.tagName,
      inputReadOnly: inputRef.current?.readOnly,
      inputDisabled: inputRef.current?.disabled,
      eventTarget: e.target === inputRef.current
    });
    
    // Prevent extremely long queries (frontend validation)
    if (newValue.length <= 255) {
      onChange(newValue);
      console.log('🎯 [SearchBar] onChange called, new value set');
    } else {
      console.log('🎯 [SearchBar] Input rejected: too long');
    }
  };

  /**
   * Handle key down events for debugging
   */
  const handleKeyDownDebug = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Mark user as actively typing
    isUserTypingRef.current = true;
    lastUserInteractionRef.current = Date.now();
    
    console.log('🎯 [SearchBar] Key down:', {
      key: e.key,
      isInputFocused: document.activeElement === inputRef.current,
      inputValue: inputRef.current?.value,
      isDefaultPrevented: e.defaultPrevented,
      isPropagationStopped: e.isPropagationStopped()
    });
    
    // Call the original key handler
    handleKeyDown(e);
  };

  /**
   * Handle focus events
   */
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // Mark user as actively engaging with the input
    isUserTypingRef.current = true;
    lastUserInteractionRef.current = Date.now();
    
    console.log('🎯 [SearchBar] Input focused:', {
      activeElement: document.activeElement?.tagName,
      inputValue: e.target.value
    });
  };

  /**
   * Handle blur events
   */
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Stop tracking user typing after blur, but with a small delay
    setTimeout(() => {
      isUserTypingRef.current = false;
    }, 500);
    
    console.log('🎯 [SearchBar] Input blurred:', {
      activeElement: document.activeElement?.tagName,
      inputValue: e.target.value,
      relatedTarget: e.relatedTarget?.tagName
    });
  };

  /**
   * Handle clear button click
   */
  const handleClear = () => {
    onChange('');
    if (onClear) {
      onClear();
    }
  };

  /**
   * Handle key down events for accessibility
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Clear with Escape key
    if (e.key === 'Escape' && value) {
      handleClear();
    }
  };

  // Determine if we should show the clear button
  const showClearButton = value.length > 0 && !disabled;

  // Helper text ID for accessibility
  const helperTextId = 'search-helper-text';

  return (
    <div className={cn("w-full max-w-2xl mx-auto", className)}>
      {/* Enhanced Search Form */}
      <form
        role="search"
        aria-label="Búsqueda de productos de tennis"
        onSubmit={handleSubmit}
        className="relative"
      >
        {/* Visible Label with enhanced styling */}
        <label
          htmlFor="search-input"
          className="block text-sm font-light text-foreground mb-3 tracking-wide"
        >
          Buscar productos
        </label>

        {/* Enhanced Input Container - Now with separated button */}
        <div className="flex items-center gap-3">
          {/* Input Container with Icon */}
          <div className="relative flex-1 group">
            {/* Search Icon with enhanced colors */}
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none z-10">
              <Search 
                className={cn(
                  "h-5 w-5 transition-all duration-200",
                  isLoading 
                    ? "text-primary animate-pulse" 
                    : "text-muted-foreground group-focus-within:text-primary"
                )}
                aria-hidden="true"
              />
            </div>

            {/* Enhanced Search Input */}
            <Input
              ref={inputRef}
              id="search-input"
              data-testid="search-input"
              type="search"
              value={value}
              onChange={handleInputChange}
              onKeyDown={handleKeyDownDebug}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder={placeholder}
              disabled={disabled || isLoading}
              autoFocus={autoFocus}
              autoComplete="off"
              spellCheck="false"
              aria-describedby={helperTextId}
              className={cn(
                "pl-12 pr-12 py-4 text-base",
                "bg-card border-border",
                "focus:border-primary focus:ring-2 focus:ring-primary/20",
                "transition-all duration-200",
                "placeholder:text-muted-foreground/60",
                "hover:border-primary/50",
                isLoading && "cursor-wait"
              )}
            />

            {/* Clear Button (only inside input) */}
            {showClearButton && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  disabled={disabled}
                  aria-label="Limpiar búsqueda"
                  data-testid="clear-button"
                  className="p-0 hover:bg-muted hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Separated Search Button */}
          {onSearch && (
            <Button
              type="submit"
              variant="default"
              size="default"
              disabled={disabled || isLoading || !value.trim()}
              aria-label="Buscar ahora"
              data-testid="search-button"
              className={cn(
                "h-10 px-6 text-base font-medium whitespace-nowrap",
                "bg-primary hover:bg-primary/90 text-primary-foreground",
                "transition-all duration-200",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "shadow-sm hover:shadow-md"
              )}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Buscando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Buscar
                </span>
              )}
            </Button>
          )}
        </div>

        {/* Enhanced Helper Text */}
        <div
          id={helperTextId}
          className="mt-3 text-sm text-muted-foreground font-light"
          aria-live="polite"
        >
          {isLoading ? (
            <span className="flex items-center gap-2 text-primary">
              <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
              Buscando productos...
            </span>
          ) : value.length > 0 ? (
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
              {value.length >= 4 
                ? "Búsqueda automática activa" 
                : "Escribe al menos 4 caracteres para búsqueda automática"
              }
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full" />
              Busca productos de tennis. Usa palíndromos como &quot;abba&quot; para descuentos especiales.
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
