import { NavItem } from '../nav-item/nav-item';

export const routes: NavItem[] = [
  {
    path: '/dashboard/products',
    icon: 'store',
    name: 'Products',
  },
  {
    path: '/dashboard/orders',
    icon: 'shopping_cart',
    name: 'Orders',
  },
  {
    path: '/dashboard/reviews',
    icon: 'comment',
    name: 'Reviews',
  },
  {
    path: '/dashboard/categories',
    icon: 'label',
    name: 'Categories',
  },
  {
    path: '/dashboard/reports',
    icon: 'insights',
    name: 'Reports',
  },
];
