export interface User {
  id: number;
  name: string;
  login: string;
  role: string;
}

export interface LoginRequest {
  login: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  login: string;
  password: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  id: number;
  name: string;
  role: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  active: boolean;
}

export interface Department {
  id: number;
  name: string;
  description: string;
  active: boolean;
}

export interface Supplier {
  id: number;
  name: string;
  cnpj: string;
  phone: string;
  email: string;
  address: string;
  active: boolean;
}

export interface Product {
  id: number;
  sku: string;
  name: string;
  description: string;
  costPrice: number;
  salePrice: number;
  quantityInStock: number;
  minStock: number;
  maxStock: number;
  active: boolean;
  categoryId: number;
  supplierId: number;
  categoryName?: string;
  supplierName?: string;
}

export interface ProductMin {
  id: number;
  name: string;
  sku: string;
}

export interface StockMovement {
  id: number;
  productId: number;
  productName: string;
  departmentId: number;
  departmentName: string;
  type: 'ENTRADA' | 'SAIDA';
  quantity: number;
  dateTime: string;
  observation: string;
  userId: number;
  userName: string;
}

export interface DashboardData {
  totalProducts: number;
  totalStockValue: number;
  lowStockCount: number;
  recentMovements: Array<{
    id: number;
    productName: string;
    type: string;
    quantity: number;
    dateTime: string;
  }>;
  lowStockItems: Array<{
    id: number;
    sku: string;
    name: string;
    quantityInStock: number;
    minStock: number;
  }>;
}

export interface DepartmentConsumption {
  departmentId: number;
  departmentName: string;
  totalValue: number;
  totalQuantity: number;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
