import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/auth.service';
import type { User } from '../types/models';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si un token d'authentification est stocké dans le localStorage
    const token = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('currentUser');

    if (token && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        authService.setAuthToken(token);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await authService.login({ email, password });

      // Créer un objet User à partir de la réponse
      const userData: User = {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        password: '',
        role: response.user.role as 'admin' | 'user',
        status: response.user.status as 'active' | 'inactive',
        createdAt: response.user.createdAt,
        updatedAt: response.user.updatedAt,
      };

      // Enregistrer le token et les informations utilisateur dans le localStorage
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('currentUser', JSON.stringify(userData));

      // Configurer le token de l'authentification pour les futures requêtes
      authService.setAuthToken(response.token);

      setUser(userData);
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.error || 'Erreur de connexion');
    }
  };

  const register = async (name: string, email: string, password: string, role: string): Promise<void> => {
    try {
      await authService.register({ name, email, password, role });
    } catch (error: any) {
      console.error('Register error:', error);
      throw new Error(error.response?.data?.error || 'Erreur d\'inscription');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    authService.removeAuthToken();
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};
