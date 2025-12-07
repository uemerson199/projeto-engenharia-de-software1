import type {
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  Category,
  Department,
  Supplier,
  Product,
  ProductMin,
  StockMovement,
  DashboardData,
  DepartmentConsumption,
  Page,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

class ApiService {
  private getHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
  }

  async register(data: RegisterRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Registration failed');
    return response.json();
  }

  async getCategories(page = 0, size = 20, name = ''): Promise<Page<Category>> {
    const params = new URLSearchParams({ page: page.toString(), size: size.toString() });
    if (name) params.append('name', name);
    const response = await fetch(`${API_BASE_URL}/api/categories?${params}`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  }

  async getActiveCategories(): Promise<Category[]> {
    const response = await fetch(`${API_BASE_URL}/api/categories/active`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch active categories');
    return response.json();
  }

  async getCategoryById(id: number): Promise<Category> {
    const response = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch category');
    return response.json();
  }

  async createCategory(data: Omit<Category, 'id'>): Promise<Category> {
    const response = await fetch(`${API_BASE_URL}/api/categories`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create category');
    return response.json();
  }

  async updateCategory(id: number, data: Omit<Category, 'id'>): Promise<Category> {
    const response = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update category');
    return response.json();
  }

  async deleteCategory(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete category');
  }

  async getDepartments(page = 0, size = 20, name = ''): Promise<Page<Department>> {
    const params = new URLSearchParams({ page: page.toString(), size: size.toString() });
    if (name) params.append('name', name);
    const response = await fetch(`${API_BASE_URL}/api/departments?${params}`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch departments');
    return response.json();
  }

  async getActiveDepartments(): Promise<Department[]> {
    const response = await fetch(`${API_BASE_URL}/api/departments/active`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch active departments');
    return response.json();
  }

  async getDepartmentById(id: number): Promise<Department> {
    const response = await fetch(`${API_BASE_URL}/api/departments/${id}`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch department');
    return response.json();
  }

  async createDepartment(data: Omit<Department, 'id'>): Promise<Department> {
    const response = await fetch(`${API_BASE_URL}/api/departments`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create department');
    return response.json();
  }

  async updateDepartment(id: number, data: Omit<Department, 'id'>): Promise<Department> {
    const response = await fetch(`${API_BASE_URL}/api/departments/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update department');
    return response.json();
  }

  async deleteDepartment(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/departments/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete department');
  }

  async getSuppliers(page = 0, size = 20, name = ''): Promise<Page<Supplier>> {
    const params = new URLSearchParams({ page: page.toString(), size: size.toString() });
    if (name) params.append('name', name);
    const response = await fetch(`${API_BASE_URL}/api/suppliers?${params}`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch suppliers');
    return response.json();
  }

  async getActiveSuppliers(): Promise<Supplier[]> {
    const response = await fetch(`${API_BASE_URL}/api/suppliers/active`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch active suppliers');
    return response.json();
  }

  async getSupplierById(id: number): Promise<Supplier> {
    const response = await fetch(`${API_BASE_URL}/api/suppliers/${id}`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch supplier');
    return response.json();
  }

  async createSupplier(data: Omit<Supplier, 'id'>): Promise<Supplier> {
    const response = await fetch(`${API_BASE_URL}/api/suppliers`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create supplier');
    return response.json();
  }

  async updateSupplier(id: number, data: Omit<Supplier, 'id'>): Promise<Supplier> {
    const response = await fetch(`${API_BASE_URL}/api/suppliers/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update supplier');
    return response.json();
  }

  async deleteSupplier(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/suppliers/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete supplier');
  }

  async getProducts(page = 0, size = 20, filters?: { name?: string; sku?: string; active?: boolean }): Promise<Page<Product>> {
    const params = new URLSearchParams({ page: page.toString(), size: size.toString() });
    if (filters?.name) params.append('name', filters.name);
    if (filters?.sku) params.append('sku', filters.sku);
    if (filters?.active !== undefined) params.append('active', filters.active.toString());
    const response = await fetch(`${API_BASE_URL}/api/products?${params}`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  }

  async getActiveProducts(): Promise<ProductMin[]> {
    const response = await fetch(`${API_BASE_URL}/api/products/all`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch active products');
    return response.json();
  }

  async getProductById(id: number): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch product');
    return response.json();
  }

  async createProduct(data: Omit<Product, 'id'>): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/api/products`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create product');
    return response.json();
  }

  async updateProduct(id: number, data: Omit<Product, 'id'>): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update product');
    return response.json();
  }

  async deleteProduct(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete product');
  }

  async getDashboard(): Promise<DashboardData> {
    const response = await fetch(`${API_BASE_URL}/api/relatorios/dashboard`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch dashboard data');
    return response.json();
  }

  async getConsumptionReport(startDate: string, endDate: string): Promise<DepartmentConsumption[]> {
    const params = new URLSearchParams({ dataInicio: startDate, dataFim: endDate });
    const response = await fetch(`${API_BASE_URL}/api/relatorios/consumo-departamento?${params}`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch consumption report');
    return response.json();
  }

  async getStockMovements(
    page = 0,
    size = 20,
    filters?: {
      productId?: number;
      departmentId?: number;
      type?: 'ENTRADA' | 'SAIDA';
      startDate?: string;
      endDate?: string;
    }
  ): Promise<Page<StockMovement>> {
    const params = new URLSearchParams({ page: page.toString(), size: size.toString() });
    if (filters?.productId) params.append('productId', filters.productId.toString());
    if (filters?.departmentId) params.append('departmentId', filters.departmentId.toString());
    if (filters?.type) params.append('type', filters.type);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    const response = await fetch(`${API_BASE_URL}/api/stock-movements?${params}`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch stock movements');
    return response.json();
  }

  async createStockMovement(data: Omit<StockMovement, 'id' | 'productName' | 'departmentName' | 'userName' | 'dateTime'>): Promise<StockMovement> {
    const response = await fetch(`${API_BASE_URL}/api/stock-movements`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create stock movement');
    return response.json();
  }
}

export const api = new ApiService();
