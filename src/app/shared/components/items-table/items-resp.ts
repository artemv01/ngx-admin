import { Product } from 'src/app/pages/product/models/product';

export interface ItemsResp<T> {
  products: T[];
  total: number;
  limit: number;
  page: number;
  pages: number;
}
