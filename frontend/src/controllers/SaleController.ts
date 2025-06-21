import api from '../services/api';
import { Sale, CartItem } from '../models/Sale';

export interface CreateSaleRequest {
  items: {
    productId: number;
    quantity: number;
  }[];
  paymentMethod: string;
}

export interface SaleFilters {
  startDate?: string;
  endDate?: string;
  userId?: number;
}

export class SaleController {
  async getAllSales(filters?: SaleFilters): Promise<{ success: boolean; sales?: Sale[]; errors?: string[] }> {
    try {
      let url = '/api/sales';
      const params = new URLSearchParams();
      
      if (filters?.startDate) params.append('start', filters.startDate);
      if (filters?.endDate) params.append('end', filters.endDate);
      if (filters?.userId) params.append('userId', filters.userId.toString());
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await api.get<Sale[]>(url);
      return { success: true, sales: response.data };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao carregar vendas';
      return { success: false, errors: [errorMessage] };
    }
  }

  async getSaleById(id: number): Promise<{ success: boolean; sale?: Sale; errors?: string[] }> {
    try {
      const response = await api.get<Sale>(`/api/sales/${id}`);
      return { success: true, sale: response.data };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Venda não encontrada';
      return { success: false, errors: [errorMessage] };
    }
  }

  async createSale(cartItems: CartItem[], paymentMethod: string): Promise<{ success: boolean; sale?: Sale; errors?: string[] }> {
    try {
      const saleData: CreateSaleRequest = {
        items: cartItems.map(item => ({
          productId: item.product.id,
          quantity: item.quantity
        })),
        paymentMethod
      };

      const response = await api.post<Sale>('/api/sales', saleData);
      return { success: true, sale: response.data };
    } catch (error: any) {
      const errors = this.extractErrors(error);
      return { success: false, errors };
    }
  }

  async updateSaleStatus(id: number, status: Sale['status']): Promise<{ success: boolean; sale?: Sale; errors?: string[] }> {
    try {
      const response = await api.patch<Sale>(`/api/sales/${id}/status`, { status });
      return { success: true, sale: response.data };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao atualizar status da venda';
      return { success: false, errors: [errorMessage] };
    }
  }

  async searchSales(term: string): Promise<{ success: boolean; sales?: Sale[]; errors?: string[] }> {
    try {
      const response = await api.get<Sale[]>(`/api/sales?search=${encodeURIComponent(term)}`);
      return { success: true, sales: response.data };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao buscar vendas';
      return { success: false, errors: [errorMessage] };
    }
  }

  async getSalesByUser(userId: number): Promise<{ success: boolean; sales?: Sale[]; errors?: string[] }> {
    try {
      const response = await api.get<Sale[]>(`/api/sales/user/${userId}`);
      return { success: true, sales: response.data };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao carregar vendas do usuário';
      return { success: false, errors: [errorMessage] };
    }
  }

  async getTotalRevenue(): Promise<{ success: boolean; revenue?: number; errors?: string[] }> {
    try {
      const response = await api.get<{ revenue: number }>('/api/sales/revenue');
      return { success: true, revenue: response.data.revenue };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao calcular receita total';
      return { success: false, errors: [errorMessage] };
    }
  }

  async getSalesCount(): Promise<{ success: boolean; count?: number; errors?: string[] }> {
    try {
      const response = await api.get<{ count: number }>('/api/sales/count');
      return { success: true, count: response.data.count };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao contar vendas';
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