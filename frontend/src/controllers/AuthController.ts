import { User } from '../models/User';
import { mockUsers } from '../data/mockData';

export class AuthController {
  private currentUser: User | null = null;

  async login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    const user = mockUsers.find(u => u.email === email && u.password === password && u.isActive);
    
    if (user) {
      const userWithoutPassword = { ...user };
      delete userWithoutPassword.password;
      
      this.currentUser = userWithoutPassword;
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      
      return { success: true, user: userWithoutPassword };
    }
    
    return { success: false, error: 'Email ou senha inválidos' };
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): User | null {
    if (!this.currentUser) {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        this.currentUser = JSON.parse(savedUser);
      }
    }
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
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