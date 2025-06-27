import api from '../services/api';
import { Product } from '../models/Product';
import { Category } from '../models/Category';
import { Supplier } from '../models/Supplier';

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  barcode: string;
  categoryId: number;
  supplierId: number;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  stockQuantity?: number;
  barcode?: string;
  categoryId?: number;
  supplierId?: number;
}

export class ProductController {
  async getAllProducts(): Promise<{ success: boolean; products?: Product[]; errors?: string[] }> {
    try {
      const response = await api.get<Product[]>('/api/products');
      return { success: true, products: response.data };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao carregar produtos';
      return { success: false, errors: [errorMessage] };
    }
  }

  async getProductById(id: number): Promise<{ success: boolean; product?: Product; errors?: string[] }> {
    try {
      const response = await api.get<Product>(`/api/products/${id}`);
      return { success: true, product: response.data };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Produto não encontrado';
      return { success: false, errors: [errorMessage] };
    }
  }

  async getProductByBarcode(barcode: string): Promise<{ success: boolean; product?: Product; errors?: string[] }> {
    try {
      const response = await api.get<Product>(`/api/products/barcode/${barcode}`);
      return { success: true, product: response.data };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Produto não encontrado';
      return { success: false, errors: [errorMessage] };
    }
  }

  async createProduct(productData: CreateProductRequest): Promise<{ success: boolean; product?: Product; errors?: string[] }> {
    try {
      const response = await api.post<Product>('/api/products', productData);
      return { success: true, product: response.data };
    } catch (error: any) {
      const errors = this.extractErrors(error);
      return { success: false, errors };
    }
  }

  async updateProduct(id: number, productData: UpdateProductRequest): Promise<{ success: boolean; product?: Product; errors?: string[] }> {
    try {
      const response = await api.put<Product>(`/api/products/${id}`, productData);
      return { success: true, product: response.data };
    } catch (error: any) {
      const errors = this.extractErrors(error);
      return { success: false, errors };
    }
  }

  async deleteProduct(id: number): Promise<{ success: boolean; errors?: string[] }> {
    try {
      await api.delete(`/api/products/${id}`);
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao excluir produto';
      return { success: false, errors: [errorMessage] };
    }
  }

  async adjustStock(id: number, adjustment: number): Promise<{ success: boolean; product?: Product; errors?: string[] }> {
    try {
      const response = await api.patch<Product>(`/api/products/${id}/stock?adjustment=${adjustment}`);
      return { success: true, product: response.data };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao ajustar estoque';
      return { success: false, errors: [errorMessage] };
    }
  }

  async searchProducts(term: string, categoryId?: number): Promise<{ success: boolean; products?: Product[]; errors?: string[] }> {
    try {
      let url = `/api/products?search=${encodeURIComponent(term)}`;
      if (categoryId) {
        url += `&categoryId=${categoryId}`;
      }
      const response = await api.get<Product[]>(url);
      return { success: true, products: response.data };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao buscar produtos';
      return { success: false, errors: [errorMessage] };
    }
  }

  async getLowStockProducts(threshold: number = 10): Promise<{ success: boolean; products?: Product[]; errors?: string[] }> {
    try {
      const response = await api.get<Product[]>(`/api/products?lowStock=true&threshold=${threshold}`);
      return { success: true, products: response.data };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao carregar produtos com estoque baixo';
      return { success: false, errors: [errorMessage] };
    }
  }

  async getCategories(): Promise<{ success: boolean; categories?: Category[]; errors?: string[] }> {
    try {
      const response = await api.get<Category[]>('/api/categories');
      return { success: true, categories: response.data };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao carregar categorias';
      return { success: false, errors: [errorMessage] };
    }
  }

  async getSuppliers(): Promise<{ success: boolean; suppliers?: Supplier[]; errors?: string[] }> {
    try {
      const response = await api.get<Supplier[]>('/api/suppliers');
      return { success: true, suppliers: response.data };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao carregar fornecedores';
      return { success: false, errors: [errorMessage] };
    }
  }

  private extractErrors(error: any): string[] {
    if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
      return error.response.data.errors;
    }
    if (error.response?.data?.message) {
      return [error.response.data.message];
    }
    return ['Erro interno do servidor'];
  }
}