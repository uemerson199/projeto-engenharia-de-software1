import api from '../services/api';
import { User } from '../models/User';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export class AuthController {
  private currentUser: User | null = null;

  async login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    // Credenciais fixas para testes
    const testEmail = 'admin@teste.com';
    const testPassword = '123456';

    if (email === testEmail && password === testPassword) {
      const mockUser: User = {
        id: 1,
        firstName: 'Admin',
        lastName: 'Local', // Mudei para "Local" para ficar claro que é o usuário de teste
        email: testEmail,
        isActive: true,
        createdAt: new Date().toISOString(),
        role: {
          id: 1,
          authority: 'GERENTE', // CORREÇÃO: Alterado de ROLE_ADMIN para GERENTE
          name: 'Gerente'       // CORREÇÃO: Alterado para corresponder à role
        }
      };

      const mockToken = 'fake-jwt-token';

      localStorage.setItem('authToken', mockToken);
      localStorage.setItem('currentUser', JSON.stringify(mockUser));
      this.currentUser = mockUser;

      return { success: true, user: mockUser };
    }

    // Caso não seja o usuário fixo, tenta fazer login normalmente via API
    try {
      const response = await api.post<LoginResponse>('/api/auth/login', {
        email,
        password
      });

      const { token, user } = response.data;

      localStorage.setItem('authToken', token);
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUser = user;

      return { success: true, user };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Email ou senha inválidos';
      return { success: false, error: errorMessage };
    }
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): User | null {
    if (!this.currentUser) {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        try {
          this.currentUser = JSON.parse(savedUser);
        } catch (error) {
          localStorage.removeItem('currentUser');
        }
      }
    }
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null && localStorage.getItem('authToken') !== null;
  }

  hasRole(authority: string): boolean {
    const user = this.getCurrentUser();
    return user ? user.role.authority === authority : false;
  }

  hasAnyRole(authorities: string[]): boolean {
    const user = this.getCurrentUser();
    return user ? authorities.includes(user.role.authority) : false;
  }
}