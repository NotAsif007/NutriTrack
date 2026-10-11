import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api, getApiErrorMessage } from "../services/api";
import { IUser, ApiResponse } from "../types";

interface AuthContextType {
  user: IUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = useCallback(async () => {
    try {
      const res = await api.get<ApiResponse<{ user: IUser }>>("/auth/me");
      if (res.data.success && res.data.data.user) {
        setUser(res.data.data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post<ApiResponse<{ user: IUser }>>("/auth/login", { email, password });
      if (res.data.success) {
        setUser(res.data.data.user);
      }
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await api.post<ApiResponse<{ user: IUser }>>("/auth/register", { name, email, password });
      if (res.data.success) {
        setUser(res.data.data.user);
      }
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
