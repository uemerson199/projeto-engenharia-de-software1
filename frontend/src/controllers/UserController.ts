import { User, UserModel } from '../models/User';
import { mockUsers, mockRoles } from '../data/mockData';

export class UserController {
  private users: User[] = [...mockUsers];

  getAllUsers(): User[] {
    return this.users;
  }

  getUserById(id: number): User | null {
    return this.users.find(user => user.id === id) || null;
  }

  createUser(userData: Omit<User, 'id' | 'createdAt'>): { success: boolean; user?: User; errors?: string[] } {
    const errors = UserModel.validate(userData);
    
    if (errors.length > 0) {
      return { success: false, errors };
    }

    if (this.users.some(user => user.email === userData.email)) {
      return { success: false, errors: ['Email já está em uso'] };
    }

    const newUser: User = {
      ...userData,
      id: Math.max(...this.users.map(u => u.id)) + 1,
      createdAt: new Date().toISOString().split('T')[0]
    };

    this.users.push(newUser);
    return { success: true, user: newUser };
  }

  updateUser(id: number, userData: Partial<User>): { success: boolean; user?: User; errors?: string[] } {
    const userIndex = this.users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      return { success: false, errors: ['Usuário não encontrado'] };
    }

    const errors = UserModel.validate({ ...this.users[userIndex], ...userData });
    
    if (errors.length > 0) {
      return { success: false, errors };
    }

    if (userData.email && this.users.some(user => user.email === userData.email && user.id !== id)) {
      return { success: false, errors: ['Email já está em uso'] };
    }

    this.users[userIndex] = { ...this.users[userIndex], ...userData };
    return { success: true, user: this.users[userIndex] };
  }

  deleteUser(id: number): { success: boolean; errors?: string[] } {
    const userIndex = this.users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      return { success: false, errors: ['Usuário não encontrado'] };
    }

    this.users.splice(userIndex, 1);
    return { success: true };
  }

  toggleUserStatus(id: number): { success: boolean; user?: User; errors?: string[] } {
    const userIndex = this.users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      return { success: false, errors: ['Usuário não encontrado'] };
    }

    this.users[userIndex].isActive = !this.users[userIndex].isActive;
    return { success: true, user: this.users[userIndex] };
  }

  searchUsers(term: string): User[] {
    const searchTerm = term.toLowerCase();
    return this.users.filter(user =>
      user.firstName.toLowerCase().includes(searchTerm) ||
      user.lastName.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm)
    );
  }

  getRoles() {
    return mockRoles;
  }
}