import api from '../services/api';
import { User, Role } from '../models/User';

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roleId: number;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  roleId?: number;
}

export class UserController {
  async getAllUsers(): Promise<{ success: boolean; users?: User[]; errors?: string[] }> {
    try {
      const response = await api.get<User[]>('/api/users');
      return { success: true, users: response.data };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao carregar usuários';
      return { success: false, errors: [errorMessage] };
    }
  }

  async getUserById(id: number): Promise<{ success: boolean; user?: User; errors?: string[] }> {
    try {
      const response = await api.get<User>(`/api/users/${id}`);
      return { success: true, user: response.data };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Usuário não encontrado';
      return { success: false, errors: [errorMessage] };
    }
  }

  async createUser(userData: CreateUserRequest): Promise<{ success: boolean; user?: User; errors?: string[] }> {
    try {
      const response = await api.post<User>('/api/users', userData);
      return { success: true, user: response.data };
    } catch (error: any) {
      const errors = this.extractErrors(error);
      return { success: false, errors };
    }
  }

  async updateUser(id: number, userData: UpdateUserRequest): Promise<{ success: boolean; user?: User; errors?: string[] }> {
    try {
      const response = await api.put<User>(`/api/users/${id}`, userData);
      return { success: true, user: response.data };
    } catch (error: any) {
      const errors = this.extractErrors(error);
      return { success: false, errors };
    }
  }

  async deleteUser(id: number): Promise<{ success: boolean; errors?: string[] }> {
    try {
      await api.delete(`/api/users/${id}`);
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao excluir usuário';
      return { success: false, errors: [errorMessage] };
    }
  }

  async toggleUserStatus(id: number): Promise<{ success: boolean; user?: User; errors?: string[] }> {
    try {
      const response = await api.patch<User>(`/api/users/${id}/status`);
      return { success: true, user: response.data };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao atualizar status do usuário';
      return { success: false, errors: [errorMessage] };
    }
  }

  async searchUsers(term: string): Promise<{ success: boolean; users?: User[]; errors?: string[] }> {
    try {
      const response = await api.get<User[]>(`/api/users?search=${encodeURIComponent(term)}`);
      return { success: true, users: response.data };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao buscar usuários';
      return { success: false, errors: [errorMessage] };
    }
  }

  async getRoles(): Promise<{ success: boolean; roles?: Role[]; errors?: string[] }> {
    try {
      const response = await api.get<Role[]>('/api/roles');
      return { success: true, roles: response.data };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao carregar cargos';
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