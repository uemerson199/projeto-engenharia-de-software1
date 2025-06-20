export type { User, Role } from '../models/User';
export type { Product } from '../models/Product';
export type { Category } from '../models/Category';
export type { Supplier } from '../models/Supplier';
export type { Sale, SaleItem, CartItem } from '../models/Sale';

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}