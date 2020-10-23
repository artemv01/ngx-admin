interface ProductInCart {
  name: string;
  description: String;
  price: Number;
  onSale: Boolean;
  image: String;
  originalId: string;
}
export interface CartItem {
  quantity: number;
  product: ProductInCart;
}
