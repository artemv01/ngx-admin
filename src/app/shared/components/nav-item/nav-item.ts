export interface NavItem {
  path: string;
  icon: string;
  name: string;
  children?: NavItem[];
}
