import { Product } from '@app/pages/product/models/product';
import { Address } from './address';
import { CartItem } from './cart-item';
import { OrderStatus } from './order-status';

export interface Order {
  _id: string;

  shippingAddress: Address;

  billingAddress: Address;

  cart: CartItem[];

  notes: string;

  status: OrderStatus;

  total: number;

  cartUpdateRQ: Record<Product['_id'], number>;
}
