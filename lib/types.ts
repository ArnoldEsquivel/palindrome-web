export type ProductItem = {
  id: number;
  title: string;
  brand: string;
  description: string;
  originalPrice: number;
  finalPrice: number;
  discountPercentage?: number;
  imageUrl?: string; // 🆕 Nueva propiedad para imágenes (opcional hasta que el backend la implemente)
};

export type SearchResponse = {
  query: string;
  isPalindrome: boolean;
  items: ProductItem[];
  totalItems: number;
};

// 🆕 Tipos para el nuevo endpoint /api/products
export type Product = {
  id: number;
  title: string;
  brand: string;
  description: string;
  price: string;
  imageUrl?: string; // Opcional hasta que el backend lo implemente
  createdAt: string;
  updatedAt: string;
};

export type ProductsResponse = {
  products: Product[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

// 🆕 Parámetros de paginación
export type PaginationParams = {
  limit?: number;
  offset?: number;
  page?: number;
};

export type ApiError = {
  message: string;
  error: string;
  statusCode: number;
};
