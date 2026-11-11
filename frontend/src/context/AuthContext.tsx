import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';
import { apiRequest, setAuthToken, removeAuthToken, getAuthToken } from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<User>;
  registerCandidate: (data: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    semester: string;
    stream: string;
    password?: string;
  }) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = getAuthToken();
    const storedUser = localStorage.getItem('aisamrat_user');

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        // Verify with /api/auth/me
        apiRequest<User>('/auth/me')
          .then((verified) => {
            setUser((prev) => (prev ? { ...prev, ...verified } : verified));
            localStorage.setItem('aisamrat_user', JSON.stringify({ ...JSON.parse(storedUser), ...verified }));
          })
          .catch(() => {
            logout();
          })
          .finally(() => setLoading(false));
        return;
      } catch {
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<User> => {
    const response = await apiRequest<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    const userData: User = {
      username: response.username,
      fullName: response.fullName,
      role: response.role as Role,
      userId: response.userId,
      employeeId: response.employeeId,
      employeeCode: response.employeeCode,
      department: response.department,
      designation: response.designation,
      token: response.token,
    };

    setAuthToken(response.token);
    localStorage.setItem('aisamrat_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const registerCandidate = async (data: any): Promise<User> => {
    const response = await apiRequest<any>('/auth/register-candidate', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    const userData: User = {
      username: response.username,
      fullName: response.fullName,
      role: response.role as Role,
      userId: response.userId,
      employeeId: response.employeeId,
      employeeCode: response.employeeCode,
      department: response.department,
      designation: response.designation,
      token: response.token,
    };

    setAuthToken(response.token);
    localStorage.setItem('aisamrat_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    removeAuthToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, registerCandidate, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

