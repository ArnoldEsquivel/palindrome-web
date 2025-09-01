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

  // Handle product click (for future implementation)
  const handleProductClick = (product: ProductItem) => {
    console.log('Product clicked:', product);
    // Future: Navigate to product detail page
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setQ(suggestion);
    // Trigger search automatically after setting the query
    setTimeout(() => search(suggestion), 100);
  };

  // Handle retry
  const handleRetry = () => {
    if (q.trim()) {
      search(q);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Za-🦆🦆🦆 Tennis Store
            </h1>
            <p className="text-muted-foreground text-lg">
              Busca productos de tennis con descuentos especiales para palíndromos
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8" role="main">
        {/* Search Section */}
        <section aria-labelledby="search-heading">
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
          />
        </section>

        {/* Results Section */}
        <section aria-labelledby="results-heading">
          <h2 id="results-heading" className="sr-only">
            Resultados de búsqueda
          </h2>
          <ResultList
            data={data}
            status={status}
            error={error}
            onRetry={handleRetry}
            onClearSearch={reset}
            onProductClick={handleProductClick}
            onSuggestionClick={handleSuggestionClick}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>Za-🦆🦆🦆 Tennis Store - Reto Palíndromo</p>
          <p className="mt-1">
            Fase 4: Sistema completo de búsqueda con componentes feedback
          </p>
        </div>
      </footer>
    </div>
  );
}
