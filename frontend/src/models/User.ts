export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
}

export interface Role {
  id: number;
  authority: string;
  name: string;
}

export class UserModel {
  static validate(userData: Partial<User>): string[] {
    const errors: string[] = [];
    
    if (!userData.firstName?.trim()) {
      errors.push('Nome é obrigatório');
    }
    
    if (!userData.lastName?.trim()) {
      errors.push('Sobrenome é obrigatório');
    }
    
    if (!userData.email?.trim()) {
      errors.push('Email é obrigatório');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      errors.push('Email deve ter um formato válido');
    }
    
    if (!userData.password && !userData.id) {
      errors.push('Senha é obrigatória para novos usuários');
    }
    
    return errors;
  }

  static formatForDisplay(user: User): string {
    return `${user.firstName} ${user.lastName}`;
  }

  static isActive(user: User): boolean {
    return user.isActive;
  }

  static hasRole(user: User, authority: string): boolean {
    return user.role.authority === authority;
  }
}