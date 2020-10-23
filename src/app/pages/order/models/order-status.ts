export const OrderStatuses = {
  completed: 'Completed',
  on_hold: 'On Hold',
  pending: 'Pending',
};
export type OrderStatus = keyof typeof OrderStatuses;
