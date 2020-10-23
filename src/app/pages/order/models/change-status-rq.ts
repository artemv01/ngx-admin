import { OrderStatus } from './order-status';

export interface ChangeStatusRQ {
  status: OrderStatus;
  orders: string[];
}
