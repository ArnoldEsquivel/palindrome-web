/**
 * Configuration for currency formatting
 */
const CURRENCY_CONFIG = {
  locale: 'es-MX',
  currency: 'MXN',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
} as const;

/**
 * Cached formatter instance for performance
 */
let currencyFormatter: Intl.NumberFormat | null = null;

/**
 * Get or create currency formatter instance
 */
function getCurrencyFormatter(): Intl.NumberFormat {
  if (!currencyFormatter) {
    currencyFormatter = new Intl.NumberFormat(CURRENCY_CONFIG.locale, {
      style: 'currency',
      currency: CURRENCY_CONFIG.currency,
      minimumFractionDigits: CURRENCY_CONFIG.minimumFractionDigits,
      maximumFractionDigits: CURRENCY_CONFIG.maximumFractionDigits,
    });
  }
  return currencyFormatter;
}

/**
 * Format a number as Mexican Peso currency
 * 
 * @param amount - The numeric amount to format
 * @returns Formatted currency string (e.g., "$1,234.56")
 * 
 * @example
 * ```typescript
 * formatCurrency(1234.56);      // "$1,234.56"
 * formatCurrency(0);            // "$0.00"
 * formatCurrency(1000);         // "$1,000.00"
 * formatCurrency(null);         // "$0.00"
 * formatCurrency(undefined);    // "$0.00"
 * ```
 */
export function formatCurrency(amount: number | null | undefined): string {
  // Handle null/undefined/NaN cases
  if (amount == null || isNaN(amount)) {
    return getCurrencyFormatter().format(0);
  }

  // Ensure we have a valid number
  const numericAmount = Number(amount);
  if (!isFinite(numericAmount)) {
    return getCurrencyFormatter().format(0);
  }

  return getCurrencyFormatter().format(numericAmount);
}

/**
 * Format a discount percentage
 * 
 * @param percentage - The percentage value (e.g., 50 for 50%)
 * @returns Formatted percentage string (e.g., "50%")
 * 
 * @example
 * ```typescript
 * formatPercentage(50);         // "50%"
 * formatPercentage(25.5);       // "26%" (rounded)
 * formatPercentage(0);          // "0%"
 * formatPercentage(null);       // "0%"
 * ```
 */
export function formatPercentage(percentage: number | null | undefined): string {
  if (percentage == null || isNaN(percentage)) {
    return "0%";
  }

  const numericPercentage = Number(percentage);
  if (!isFinite(numericPercentage)) {
    return "0%";
  }

  // Round to nearest integer for display
  return `${Math.round(numericPercentage)}%`;
}

/**
 * Calculate discount percentage from original and final prices
 * 
 * @param originalPrice - The original price before discount
 * @param finalPrice - The final price after discount
 * @returns Discount percentage (0-100)
 * 
 * @example
 * ```typescript
 * calculateDiscountPercentage(100, 50);    // 50
 * calculateDiscountPercentage(200, 150);   // 25
 * calculateDiscountPercentage(100, 100);   // 0
 * calculateDiscountPercentage(0, 0);       // 0
 * ```
 */
export function calculateDiscountPercentage(
  originalPrice: number | null | undefined,
  finalPrice: number | null | undefined
): number {
  if (
    originalPrice == null || 
    finalPrice == null || 
    isNaN(originalPrice) || 
    isNaN(finalPrice) ||
    originalPrice <= 0
  ) {
    return 0;
  }

  const discount = ((originalPrice - finalPrice) / originalPrice) * 100;
  return Math.max(0, Math.min(100, discount)); // Clamp between 0-100
}

/**
 * Format a product title for display (truncate if too long)
 * 
 * @param title - The product title
 * @param maxLength - Maximum length (default: 60)
 * @returns Truncated title with ellipsis if needed
 * 
 * @example
 * ```typescript
 * formatProductTitle("Short title");                    // "Short title"
 * formatProductTitle("Very long title...", 10);         // "Very long..."
 * ```
 */
export function formatProductTitle(title: string | null | undefined, maxLength: number = 60): string {
  if (!title || typeof title !== 'string') {
    return '';
  }

  const trimmed = title.trim();
  if (trimmed.length <= maxLength) {
    return trimmed;
  }

  return trimmed.substring(0, maxLength - 3) + '...';
}

/**
 * Format a product description for display (truncate if too long)
 * 
 * @param description - The product description
 * @param maxLength - Maximum length (default: 120)
 * @returns Truncated description with ellipsis if needed
 */
export function formatProductDescription(description: string | null | undefined, maxLength: number = 120): string {
  if (!description || typeof description !== 'string') {
    return '';
  }

  const trimmed = description.trim();
  if (trimmed.length <= maxLength) {
    return trimmed;
  }

  // Try to break at word boundary
  const truncated = trimmed.substring(0, maxLength - 3);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > maxLength * 0.8) {
    return truncated.substring(0, lastSpace) + '...';
  }
  
  return truncated + '...';
}

/**
 * Format search query for display in UI
 * 
 * @param query - The search query
 * @returns Formatted query string
 */
export function formatSearchQuery(query: string | null | undefined): string {
  if (!query || typeof query !== 'string') {
    return '';
  }

  return query.trim();
}
