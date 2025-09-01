import { SearchResponse, ApiError, ProductsResponse, PaginationParams, Product, ProductItem } from './types';

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
const MOCK_PRODUCTS: ProductItem[] = [
  {
    id: 1,
    title: "Raqueta de Tennis Wilson Pro",
    brand: "Wilson",
    description: "Raqueta profesional de alta calidad para jugadores avanzados",
    originalPrice: 3000,
    finalPrice: 1500,
    discountPercentage: 50,
    imageUrl: "https://picsum.photos/400/300?random=1"
  },
  {
    id: 2,
    title: "Zapatillas Nike Air Court",
    brand: "Nike",
    description: "Zapatillas de tennis con máximo confort y durabilidad",
    originalPrice: 2500,
    finalPrice: 1250,
    discountPercentage: 50,
    imageUrl: "https://picsum.photos/400/300?random=2"
  },
  {
    id: 3,
    title: "Pelota de Tennis Head Championship",
    brand: "Head",
    description: "Set de 3 pelotas oficiales para competencia",
    originalPrice: 500,
    finalPrice: 250,
    discountPercentage: 50,
    imageUrl: "https://picsum.photos/400/300?random=3"
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
// Utility function to generate mock response for development
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
 * Get all products using the new products endpoint
 * Falls back to search endpoint if new endpoint is unavailable
 * 
 * @param signal - AbortSignal for request cancellation
 * @returns Promise<SearchResponse> - All products with metadata
 */
export async function getAllProducts(signal?: AbortSignal): Promise<SearchResponse> {
  try {
    // Try the new products endpoint first
    const productsResponse = await fetchProducts({ limit: 50 }, signal);
    
    // Convert to SearchResponse format
    const items: ProductItem[] = productsResponse.products.map(product => convertProductToProductItem(product, false));
    
    return {
      query: "",
      isPalindrome: false,
      items,
      totalItems: productsResponse.totalItems
    };
  } catch (error) {
    // Fallback to search endpoint with generic term
    console.warn('New products endpoint unavailable, falling back to search:', error);
    
    // Get base URL from environment
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) {
      // Development fallback with mock data
      if (process.env.NODE_ENV === 'development') {
        return {
          items: MOCK_PRODUCTS,
          totalItems: MOCK_PRODUCTS.length,
          isPalindrome: false,
          query: "product",
        };
      }
      throw new ApiClientError('API base URL not configured', 500, 'Configuration Error');
    }

    // Build request URL for all products using search endpoint
    const url = new URL('/api/products/search', baseUrl);
    // Use a generic term that should match many products (>3 chars for content search)
    url.searchParams.set('q', 'product');

    // Create timeout controller
    const timeoutController = new AbortController();
    const timeoutId = setTimeout(() => {
      timeoutController.abort();
    }, API_CONFIG.timeout);

    // Combine user signal with timeout signal
    const combinedSignal = signal || timeoutController.signal;

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: API_CONFIG.headers,
        signal: combinedSignal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new ApiClientError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          response.statusText
        );
      }

      const data: SearchResponse = await response.json();
      return data;

    } catch (fetchError) {
      clearTimeout(timeoutId);

      if (fetchError instanceof ApiClientError) {
        throw fetchError;
      }

      if (signal?.aborted || timeoutController.signal.aborted) {
        throw new ApiClientError('Request cancelled', 0, 'Request Cancelled');
      }

      if (fetchError instanceof Error) {
        if (fetchError.name === 'AbortError') {
          throw new ApiClientError('Request timeout', 0, 'Request Timeout');
        }
        if (fetchError.name === 'TypeError' && fetchError.message.includes('fetch')) {
          throw new ApiClientError('Network error', 0, 'Network Error');
        }
        throw new ApiClientError(fetchError.message, 0, 'Unknown Error');
      }

      throw new ApiClientError('Unknown error occurred', 0, 'Unknown Error');
    }
  }
}

/**
 * Search for products with optional query parameter
 * If no query is provided, returns all products
 * 
 * @param query - Search query (optional)
 * @param signal - AbortSignal for request cancellation
 * @returns Promise<SearchResponse> - Search results with metadata
 */
export async function searchProducts(query: string = "", signal?: AbortSignal): Promise<SearchResponse> {
  // If no query provided, get all products
  if (!query || query.trim().length === 0) {
    return getAllProducts(signal);
  }

  if (query.length > 255) {
    throw new ApiClientError('Query parameter too long (max 255 characters)', 400, 'Bad Request');
  }

  // Get base URL from environment
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  
  if (!baseUrl) {
    // Development fallback with mock data filtering
    if (process.env.NODE_ENV === 'development') {
      const queryLower = query.trim().toLowerCase();
      const filteredItems = MOCK_PRODUCTS.filter(item => 
        item.title.toLowerCase().includes(queryLower) ||
        item.brand.toLowerCase().includes(queryLower) ||
        item.description.toLowerCase().includes(queryLower)
      );
      
      const mockResponse = {
        query,
        isPalindrome: isPalindrome(query),
        items: filteredItems,
        totalItems: filteredItems.length
      };
      
      return applyPalindromeProcessing(mockResponse);
    }
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

    // Apply palindrome processing if needed
    const processedData = applyPalindromeProcessing(data as SearchResponse);
    return processedData;

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
        // Network error - provide fallback in development
        if (process.env.NODE_ENV === 'development') {
          const queryLower = query.trim().toLowerCase();
          const filteredItems = MOCK_PRODUCTS.filter(item => 
            item.title.toLowerCase().includes(queryLower) ||
            item.brand.toLowerCase().includes(queryLower) ||
            item.description.toLowerCase().includes(queryLower)
          );
          
          const mockResponse = {
            query,
            isPalindrome: isPalindrome(query),
            items: filteredItems,
            totalItems: filteredItems.length
          };
          
          return applyPalindromeProcessing(mockResponse);
        }
        
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

    // Fallback for unknown errors with mock data in development
    if (process.env.NODE_ENV === 'development') {
      const queryLower = query.trim().toLowerCase();
      const filteredItems = MOCK_PRODUCTS.filter(item => 
        item.title.toLowerCase().includes(queryLower) ||
        item.brand.toLowerCase().includes(queryLower) ||
        item.description.toLowerCase().includes(queryLower)
      );
      
      const mockResponse = {
        query,
        isPalindrome: isPalindrome(query),
        items: filteredItems,
        totalItems: filteredItems.length
      };
      
      return applyPalindromeProcessing(mockResponse);
    }

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
  
  // Check basic structure
  if (!(typeof response.query === 'string' &&
        typeof response.isPalindrome === 'boolean' &&
        Array.isArray(response.items) &&
        typeof response.totalItems === 'number')) {
    return false;
  }
  
  // Check items structure
  const items = response.items as unknown[];
  
  return items.every((item: unknown) => {
    if (!item || typeof item !== 'object') return false;
    
    const productItem = item as Record<string, unknown>;
    return (
      typeof productItem.id === 'number' &&
      typeof productItem.title === 'string' &&
      typeof productItem.brand === 'string' &&
      typeof productItem.description === 'string' &&
      typeof productItem.originalPrice === 'number' &&
      typeof productItem.finalPrice === 'number' &&
      (productItem.discountPercentage === undefined || typeof productItem.discountPercentage === 'number') &&
      (productItem.imageUrl === undefined || typeof productItem.imageUrl === 'string')
    );
  });
}

/**
 * Fetch all products with pagination (NEW ENDPOINT)
 * 
 * @param params - Pagination parameters
 * @param signal - AbortSignal for request cancellation
 * @returns Promise<ProductsResponse> - Products with pagination metadata
 */
export async function fetchProducts(
  params: PaginationParams = {},
  signal?: AbortSignal
): Promise<ProductsResponse> {
  const { limit = 20, offset = 0 } = params;
  
  // Get base URL from environment
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) {
    // Development fallback with mock data
    if (process.env.NODE_ENV === 'development') {
      const totalItems = MOCK_PRODUCTS.length;
      const startIndex = offset;
      const endIndex = Math.min(offset + limit, totalItems);
      const paginatedProducts = MOCK_PRODUCTS.slice(startIndex, endIndex);
      
      // Convert ProductItem to Product format for consistency
      const products: Product[] = paginatedProducts.map(item => ({
        id: item.id,
        title: item.title,
        brand: item.brand,
        description: item.description,
        price: item.originalPrice.toString(),
        imageUrl: item.imageUrl,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));
      
      return {
        products,
        totalItems,
        currentPage: Math.floor(offset / limit) + 1,
        totalPages: Math.ceil(totalItems / limit),
        hasNext: endIndex < totalItems,
        hasPrevious: offset > 0
      };
    }
    throw new ApiClientError('API base URL not configured', 500, 'Configuration Error');
  }

  // Build request URL
  const url = new URL('/api/products', baseUrl);
  if (limit !== 20) url.searchParams.set('limit', limit.toString());
  if (offset > 0) url.searchParams.set('offset', offset.toString());

  // Create timeout controller
  const timeoutController = new AbortController();
  const timeoutId = setTimeout(() => {
    timeoutController.abort();
  }, API_CONFIG.timeout);

  // Combine user signal with timeout signal
  const combinedSignal = signal || timeoutController.signal;

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: API_CONFIG.headers,
      signal: combinedSignal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new ApiClientError(
        `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        response.statusText
      );
    }

    const data: ProductsResponse = await response.json();
    return data;

  } catch (error) {
    clearTimeout(timeoutId);

    // Handle different error types
    if (error instanceof ApiClientError) {
      throw error;
    }

    if (error instanceof Error) {
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

    throw new ApiClientError(
      'An unexpected error occurred',
      500,
      'Unknown Error'
    );
  }
}

/**
 * Apply palindrome processing to search response
 * Ensures proper discounts and images for palindrome searches
 */
function applyPalindromeProcessing(response: SearchResponse): SearchResponse {
  if (!response.isPalindrome) {
    // For non-palindrome searches, just ensure all items have images
    return {
      ...response,
      items: response.items.map(item => ({
        ...item,
        imageUrl: item.imageUrl || `https://picsum.photos/400/300?random=${item.id}`
      }))
    };
  }

  // For palindrome searches, apply discounts and ensure images
  return {
    ...response,
    items: response.items.map(item => {
      const hasDiscount = item.discountPercentage !== undefined && item.finalPrice < item.originalPrice;
      
      if (!hasDiscount) {
        // Apply 50% discount if not already applied by backend
        return {
          ...item,
          finalPrice: item.originalPrice * 0.5,
          discountPercentage: 50,
          imageUrl: item.imageUrl || `https://picsum.photos/400/300?random=${item.id}`
        };
      }
      
      // Just ensure image is present
      return {
        ...item,
        imageUrl: item.imageUrl || `https://picsum.photos/400/300?random=${item.id}`
      };
    })
  };
}
export function convertProductToProductItem(product: Product, isPalindrome: boolean = false): ProductItem {
  // Generate a fallback image if no imageUrl is provided
  const fallbackImageUrl = `https://picsum.photos/400/300?random=${product.id}`;
  
  const originalPrice = parseFloat(product.price);
  const finalPrice = isPalindrome ? originalPrice * 0.5 : originalPrice; // 50% discount for palindromes
  const discountPercentage = isPalindrome ? 50 : undefined;
  
  return {
    id: product.id,
    title: product.title,
    brand: product.brand,
    description: product.description,
    originalPrice,
    finalPrice,
    ...(discountPercentage && { discountPercentage }),
    imageUrl: product.imageUrl || fallbackImageUrl // Siempre asegurar que haya una imagen
  };
}
