import api from '../services/api';
import { Supplier } from '../models/Supplier';

export interface CreateSupplierRequest {
  name: string;
  contactName: string;
  phone: string;
  email: string;
  cnpj: string;
}

export interface UpdateSupplierRequest {
  name?: string;
  contactName?: string;
  phone?: string;
  email?: string;
  cnpj?: string;
}

export class SupplierController {
  async getAllSuppliers(): Promise<{ success: boolean; suppliers?: Supplier[]; errors?: string[] }> {
    try {
      const response = await api.get<Supplier[]>('/api/suppliers');
      return { success: true, suppliers: response.data };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao carregar fornecedores';
      return { success: false, errors: [errorMessage] };
    }
  }

  async getSupplierById(id: number): Promise<{ success: boolean; supplier?: Supplier; errors?: string[] }> {
    try {
      const response = await api.get<Supplier>(`/api/suppliers/${id}`);
      return { success: true, supplier: response.data };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Fornecedor não encontrado';
      return { success: false, errors: [errorMessage] };
    }
  }

  async createSupplier(supplierData: CreateSupplierRequest): Promise<{ success: boolean; supplier?: Supplier; errors?: string[] }> {
    try {
      const response = await api.post<Supplier>('/api/suppliers', supplierData);
      return { success: true, supplier: response.data };
    } catch (error: any) {
      const errors = this.extractErrors(error);
      return { success: false, errors };
    }
  }

  async updateSupplier(id: number, supplierData: UpdateSupplierRequest): Promise<{ success: boolean; supplier?: Supplier; errors?: string[] }> {
    try {
      const response = await api.put<Supplier>(`/api/suppliers/${id}`, supplierData);
      return { success: true, supplier: response.data };
    } catch (error: any) {
      const errors = this.extractErrors(error);
      return { success: false, errors };
    }
  }

  async deleteSupplier(id: number): Promise<{ success: boolean; errors?: string[] }> {
    try {
      await api.delete(`/api/suppliers/${id}`);
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao excluir fornecedor';
      return { success: false, errors: [errorMessage] };
    }
  }

  async searchSuppliers(term: string): Promise<{ success: boolean; suppliers?: Supplier[]; errors?: string[] }> {
    try {
      const response = await api.get<Supplier[]>(`/api/suppliers?search=${encodeURIComponent(term)}`);
      return { success: true, suppliers: response.data };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao buscar fornecedores';
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