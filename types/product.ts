
export interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  imageUrl: string;
  url: string;
  site: string;
  availability: 'in-stock' | 'out-of-stock' | 'limited';
}
