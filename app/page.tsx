"use client";

import React from 'react';
import SearchBar from '@/components/search/SearchBar';
import ResultList from '@/components/results/ResultList';
import { useSearch } from '@/lib/useSearch';
import type { ProductItem } from '@/lib/types';

/**
 * Main page component - Product Search for Za-🦆🦆🦆 Tennis Store
 * 
 * Full integration of SearchBar and ResultList components
 * with all feedback states and accessibility features.
 */
export default function HomePage() {
  // Initialize search hook
  const { q, setQ, data, status, error, search, reset } = useSearch();

  console.log('🎯 [HomePage] Component rendered with:', {
    q,
    status,
    hasData: !!data,
    dataItemsCount: data?.items?.length
  });

  // Handle product click (for future implementation)
  const handleProductClick = (product: ProductItem) => {
    console.log('Product clicked:', product);
    // Future: Navigate to product detail page
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    console.log('🎯 [HomePage] Suggestion clicked:', suggestion);
    setQ(suggestion);
    // Trigger search automatically after setting the query
    setTimeout(() => search(suggestion), 100);
  };

  // Handle retry
  const handleRetry = () => {
    console.log('🎯 [HomePage] Retry clicked');
    if (q.trim()) {
      search(q);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Minimalist Header */}
      <header className="relative border-b border-border/50 bg-card/80 backdrop-blur-md">
        {/* Subtle gradient accent */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/3 via-transparent to-accent/3" />
        
        <div className="relative container mx-auto px-6 py-8">
          <div className="text-center space-y-3">
            {/* Clean title with better typography */}
            <h1 className="text-3xl lg:text-4xl font-extralight text-foreground tracking-wider">
              Za-🦆🦆🦆 Tennis Store
            </h1>
            
            {/* Minimalist accent line */}
            <div className="w-20 h-px bg-gradient-to-r from-primary to-accent mx-auto opacity-60" />
            
            {/* Simplified description */}
            <p className="text-muted-foreground text-base lg:text-lg font-light max-w-xl mx-auto">
              Descuentos especiales para palíndromos
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-10 space-y-10 max-w-5xl" role="main">
        {/* Search Section */}
        <section aria-labelledby="search-heading" className="space-y-2">
          <h2 id="search-heading" className="sr-only">
            Búsqueda de productos
          </h2>
          <SearchBar
            value={q}
            onChange={setQ}
            isLoading={status === 'loading'}
            onSearch={search}
            onClear={reset}
            autoFocus
            className="mx-auto"
          />
        </section>

        {/* Enhanced Results Section */}
        <section aria-labelledby="results-heading" className="space-y-6">
          <h2 id="results-heading" className="sr-only">
            Resultados de búsqueda
          </h2>
          
          
          <ResultList
            data={data}
            status={status}
            error={error}
            onProductClick={handleProductClick}
            onSuggestionClick={handleSuggestionClick}
            onRetry={handleRetry}
            className="w-full"
          />
        </section>
      </main>

      {/* Enhanced Footer */}
      <footer className="border-t border-border bg-card/30 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-6 h-0.5 bg-gradient-to-r from-transparent to-primary" />
              <span className="text-lg font-light text-foreground">Za-🦆🦆🦆 Tennis Store</span>
              <div className="w-6 h-0.5 bg-gradient-to-r from-accent to-transparent" />
            </div>
            <p className="text-sm text-muted-foreground font-light">
              Reto Palíndromo - Encuentra productos únicos con descuentos especiales
            </p>
            <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground/60">
              <span>Powered by Next.js</span>
              <div className="w-1 h-1 bg-muted-foreground/40 rounded-full" />
              <span>Acueducto</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
