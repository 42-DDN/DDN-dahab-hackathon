import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: string;
  username: string;
  role: 'admin' | 'seller';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<string>;
  logout: () => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      // TODO: Replace with actual API call
      // Simulated API call
      const response = await new Promise<{ user: User }>((resolve) => {
        setTimeout(() => {
          resolve({
            user: {
              id: '1',
              username,
              role: username.includes('admin') ? 'admin' : 'seller',
            },
          });
        }, 1000);
      });

      setUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));

      return response.user.role === 'admin' ? '/admin' : '/seller/home';
    } catch (error) {
      throw new Error('Invalid credentials');
    }
  };
  const API_BASE_URL = 'http://13.48.209.147:5200';
  const logout = async () => {
    setUser(null);
    localStorage.removeItem('user');
    try {
        await axios.post(`${API_BASE_URL}/api/auth/logout`);
    } catch (error) {
        console.error('Error logging out on the server: ', error);
    }
    return '/login';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 