"use client";

import React from 'react';
import { Search, X } from 'lucide-react';
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
    
    // Prevent extremely long queries (frontend validation)
    if (newValue.length <= 255) {
      onChange(newValue);
    }
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
      {/* Search Form */}
      <form
        role="search"
        aria-label="Búsqueda de productos de tennis"
        onSubmit={handleSubmit}
        className="relative"
      >
        {/* Visible Label */}
        <label
          htmlFor="search-input"
          className="block text-sm font-medium text-foreground mb-2"
        >
          Buscar productos
        </label>

        {/* Input Container */}
        <div className="relative flex items-center">
          {/* Search Icon */}
          <div className="absolute left-3 flex items-center pointer-events-none">
            <Search 
              className={cn(
                "h-4 w-4 transition-colors",
                isLoading ? "text-muted-foreground animate-pulse" : "text-muted-foreground"
              )}
              aria-hidden="true"
            />
          </div>

          {/* Search Input */}
          <Input
            id="search-input"
            data-testid="search-input"
            type="search"
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || isLoading}
            autoFocus={autoFocus}
            autoComplete="off"
            spellCheck="false"
            aria-describedby={helperTextId}
            aria-expanded="false"
            aria-haspopup="false"
            className={cn(
              "pl-10 pr-20 h-12 text-base",
              "focus:ring-2 focus:ring-primary focus:ring-offset-2",
              "transition-all duration-200",
              showClearButton && "pr-20",
              className
            )}
          />

          {/* Action Buttons Container */}
          <div className="absolute right-2 flex items-center gap-1">
            {/* Clear Button */}
            {showClearButton && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClear}
                disabled={disabled}
                aria-label="Limpiar búsqueda"
                data-testid="clear-button"
                className="h-8 w-8 p-0 hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </Button>
            )}

            {/* Manual Search Button (optional) */}
            {onSearch && (
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                disabled={disabled || isLoading || !value.trim()}
                aria-label="Buscar ahora"
                data-testid="search-button"
                className="h-8 px-3 text-xs font-medium"
              >
                {isLoading ? "..." : "Buscar"}
              </Button>
            )}
          </div>
        </div>

        {/* Helper Text */}
        <div
          id={helperTextId}
          className="mt-2 text-xs text-muted-foreground"
          aria-live="polite"
        >
          {isLoading ? (
            <span className="flex items-center gap-1">
              <span className="animate-pulse">●</span>
              Buscando productos...
            </span>
          ) : value.length > 0 ? (
            <span>
              {value.length >= 4 
                ? "Búsqueda automática activa" 
                : "Escribe al menos 4 caracteres para búsqueda automática"
              }
            </span>
          ) : (
            <span>
              Busca productos de tennis. Usa palíndromos como &quot;abba&quot; para descuentos especiales.
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
