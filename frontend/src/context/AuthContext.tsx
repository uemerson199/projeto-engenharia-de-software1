import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthController } from '../controllers/AuthController';
import { User } from '../models/User';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authController] = useState(() => new AuthController());
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const currentUser = authController.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setIsAuthenticated(true);
    }
  }, [authController]);

  const login = async (email: string, password: string): Promise<boolean> => {
    const result = await authController.login(email, password);
    
    if (result.success && result.user) {
      setUser(result.user);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    authController.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};