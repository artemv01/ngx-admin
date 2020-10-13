export interface Category {
  _id?: string;
  name: string;
  toDelete?: boolean;
  isNew?: boolean;
}

export interface Product {
  _id?: string;
  name: string;
  description: string;
  price: number;
  salePrice: number;
  onSale: boolean;
  rating: number;
  ratingCount: number;
  image: string;
  relatedProducts: string[];
  categories?: Category[];
  allCategories?: Category[];
  category: Category;
}
