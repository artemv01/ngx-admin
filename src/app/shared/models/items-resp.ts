

export interface ItemsResp<T> {
  items: T[];
  total: number;
  limit: number;
  page: number;
  pages: number;
}
