export type ProductItem = {
  id: number;
  title: string;
  brand: string;
  description: string;
  originalPrice: number;
  finalPrice: number;
  discountPercentage?: number;
};

export type SearchResponse = {
  query: string;
  isPalindrome: boolean;
  items: ProductItem[];
  totalItems: number;
};

export type ApiError = {
  message: string;
  error: string;
  statusCode: number;
};
