import api from '../services/api';
import { Category } from '../models/Category';

export interface CreateCategoryRequest {
  name: string;
  description?: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
}

export class CategoryController {
  async getAllCategories(): Promise<{ success: boolean; categories?: Category[]; errors?: string[] }> {
    try {
      const response = await api.get<Category[]>('/api/categories');
      return { success: true, categories: response.data };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao carregar categorias';
      return { success: false, errors: [errorMessage] };
    }
  }

  async getCategoryById(id: number): Promise<{ success: boolean; category?: Category; errors?: string[] }> {
    try {
      const response = await api.get<Category>(`/api/categories/${id}`);
      return { success: true, category: response.data };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Categoria não encontrada';
      return { success: false, errors: [errorMessage] };
    }
  }

  async createCategory(categoryData: CreateCategoryRequest): Promise<{ success: boolean; category?: Category; errors?: string[] }> {
    try {
      const response = await api.post<Category>('/api/categories', categoryData);
      return { success: true, category: response.data };
    } catch (error: any) {
      const errors = this.extractErrors(error);
      return { success: false, errors };
    }
  }

  async updateCategory(id: number, categoryData: UpdateCategoryRequest): Promise<{ success: boolean; category?: Category; errors?: string[] }> {
    try {
      const response = await api.put<Category>(`/api/categories/${id}`, categoryData);
      return { success: true, category: response.data };
    } catch (error: any) {
      const errors = this.extractErrors(error);
      return { success: false, errors };
    }
  }

  async deleteCategory(id: number): Promise<{ success: boolean; errors?: string[] }> {
    try {
      await api.delete(`/api/categories/${id}`);
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao excluir categoria';
      return { success: false, errors: [errorMessage] };
    }
  }

  async searchCategories(term: string): Promise<{ success: boolean; categories?: Category[]; errors?: string[] }> {
    try {
      const response = await api.get<Category[]>(`/api/categories?search=${encodeURIComponent(term)}`);
      return { success: true, categories: response.data };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao buscar categorias';
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