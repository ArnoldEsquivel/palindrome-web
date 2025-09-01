import { SearchResponse, ApiError } from './types';

/**
 * Configuration for API client
 */
const API_CONFIG = {
  timeout: 10000, // 10 seconds
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
} as const;

/**
 * Development mode mock data
 */
const MOCK_PRODUCTS = [
  {
    id: 1,
    title: "Raqueta de Tennis Wilson Pro",
    brand: "Wilson",
    description: "Raqueta profesional de alta calidad para jugadores avanzados",
    originalPrice: 3000,
    finalPrice: 1500,
    discountPercentage: 50
  },
  {
    id: 2,
    title: "Zapatillas Nike Air Court",
    brand: "Nike",
    description: "Zapatillas de tennis con máximo confort y durabilidad",
    originalPrice: 2500,
    finalPrice: 1250,
    discountPercentage: 50
  },
  {
    id: 3,
    title: "Pelota de Tennis Head Championship",
    brand: "Head",
    description: "Set de 3 pelotas oficiales para competencia",
    originalPrice: 500,
    finalPrice: 250,
    discountPercentage: 50
  }
];

/**
 * Check if a string is a palindrome
 */
function isPalindrome(str: string): boolean {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === cleaned.split('').reverse().join('');
}

/**
 * Generate mock response based on query
 */
function generateMockResponse(query: string): SearchResponse {
  const isQueryPalindrome = isPalindrome(query);
  
  return {
    query,
    isPalindrome: isQueryPalindrome,
    items: query.includes('nothing') || query.includes('nonexistent') ? [] : MOCK_PRODUCTS,
    totalItems: query.includes('nothing') || query.includes('nonexistent') ? 0 : MOCK_PRODUCTS.length
  };
}

/**
 * Custom error class for API errors
 */
export class ApiClientError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public error?: string
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

/**
 * Search products using the Palindrome API
 * 
 * @param query - Search term (1-255 characters)
 * @param signal - AbortSignal for request cancellation
 * @returns Promise<SearchResponse> - Search results with palindrome detection
 * 
 * @throws {ApiClientError} When API returns error or request fails
 * 
 * @example
 * ```typescript
 * const controller = new AbortController();
 * try {
 *   const results = await searchProducts('abba', controller.signal);
 *   console.log(results.isPalindrome); // true
 *   console.log(results.items); // Products with 50% discount
 * } catch (error) {
 *   if (error instanceof ApiClientError) {
 *     console.error('API Error:', error.message);
 *   }
 * }
 * ```
 */
export async function searchProducts(
  query: string,
  signal?: AbortSignal
): Promise<SearchResponse> {
  // Input validation
  if (!query || query.trim().length === 0) {
    throw new ApiClientError('Query parameter is required', 400, 'Bad Request');
  }

  if (query.length > 255) {
    throw new ApiClientError('Query parameter too long (max 255 characters)', 400, 'Bad Request');
  }

  // Get base URL from environment
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) {
    throw new ApiClientError('API base URL not configured', 500, 'Configuration Error');
  }

  // Build request URL
  const url = new URL('/api/products/search', baseUrl);
  url.searchParams.set('q', encodeURIComponent(query.trim()));

  // Create timeout controller
  const timeoutController = new AbortController();
  const timeoutId = setTimeout(() => {
    timeoutController.abort();
  }, API_CONFIG.timeout);

  // Combine user signal with timeout signal
  const combinedSignal = signal || timeoutController.signal;

  try {
    // Make HTTP request
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: API_CONFIG.headers,
      cache: 'no-store',
      signal: combinedSignal,
    });

    // Clear timeout if request completes
    clearTimeout(timeoutId);

    // Handle HTTP errors
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      let apiError: ApiError | null = null;

      // Try to parse error response
      try {
        const contentType = response.headers.get('content-type');
        if (contentType?.includes('application/json')) {
          apiError = await response.json() as ApiError;
          errorMessage = apiError.message || errorMessage;
        }
      } catch {
        // Fallback to status text if JSON parsing fails
        errorMessage = response.statusText || errorMessage;
      }

      throw new ApiClientError(
        errorMessage,
        response.status,
        apiError?.error || 'HTTP Error'
      );
    }

    // Parse successful response
    const data = await response.json();

    // Validate response structure
    if (!isValidSearchResponse(data)) {
      throw new ApiClientError(
        'Invalid response format from API',
        500,
        'Parse Error'
      );
    }

    return data as SearchResponse;

  } catch (error) {
    // Clear timeout on any error
    clearTimeout(timeoutId);

    // Handle different error types
    if (error instanceof ApiClientError) {
      throw error;
    }

    if (error instanceof Error) {
      // Handle network errors
      if (error.name === 'AbortError') {
        throw new ApiClientError(
          'Request was cancelled',
          0,
          'Request Cancelled'
        );
      }

      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new ApiClientError(
          'Network error - unable to connect to API',
          0,
          'Network Error'
        );
      }

      throw new ApiClientError(
        error.message,
        0,
        'Request Error'
      );
    }

    // Fallback for unknown errors
    throw new ApiClientError(
      'An unexpected error occurred',
      500,
      'Unknown Error'
    );
  }
}

/**
 * Type guard to validate SearchResponse structure
 */
function isValidSearchResponse(data: unknown): data is SearchResponse {
  if (!data || typeof data !== 'object') return false;
  
  const response = data as Record<string, unknown>;
  
  return (
    typeof response.query === 'string' &&
    typeof response.isPalindrome === 'boolean' &&
    Array.isArray(response.items) &&
    typeof response.totalItems === 'number' &&
    response.items.every((item: unknown) => {
      if (!item || typeof item !== 'object') return false;
      const productItem = item as Record<string, unknown>;
      return (
        typeof productItem.id === 'number' &&
        typeof productItem.title === 'string' &&
        typeof productItem.brand === 'string' &&
        typeof productItem.description === 'string' &&
        typeof productItem.originalPrice === 'number' &&
        typeof productItem.finalPrice === 'number' &&
        (productItem.discountPercentage === undefined || typeof productItem.discountPercentage === 'number')
      );
    })
  );
}
