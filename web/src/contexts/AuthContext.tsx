"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "@/src/api/auth";
import type { AuthUser, AuthSession, AuthContextType } from "@/src/types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  // Set up token refresh timer
  useEffect(() => {
    if (!session) return;

    const timeUntilExpiry = session.expires_at * 1000 - Date.now();
    const refreshTime = timeUntilExpiry - 5 * 60 * 1000; // Refresh 5 minutes before expiry

    if (refreshTime > 0) {
      const timer = setTimeout(() => {
        refreshSession();
      }, refreshTime);

      return () => clearTimeout(timer);
    }
  }, [session]);

  const initializeAuth = async () => {
    try {
      // Check if user is authenticated
      if (authApi.isAuthenticated()) {
        const profile = await authApi.getProfile();
        setUser(profile);

        // Reconstruct session from localStorage
        const accessToken = authApi.getAccessToken();
        const refreshToken = authApi.getRefreshToken();
        const expiresAt = localStorage.getItem("expires_at");

        if (accessToken && refreshToken && expiresAt) {
          setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
            expires_in: 3600,
            expires_at: parseInt(expiresAt),
          });
        }
      }
    } catch (error) {
      console.error("Failed to initialize auth:", error);
      // Clear invalid session
      authApi.getAccessToken() && (await logout());
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });
      setUser(response.user);
      setSession(response.session);
    } catch (error) {
      throw error;
    }
  };

  const signup = async (email: string, password: string, fullName?: string) => {
    try {
      const response = await authApi.signup({ email, password, fullName });
      setUser(response.user);
      setSession(response.session);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
      setSession(null);
    }
  };

  const resetPassword = async (email: string) => {
    await authApi.resetPassword({ email });
  };

  const refreshSession = async () => {
    try {
      const newSession = await authApi.refreshSession();
      setSession(newSession);
    } catch (error) {
      console.error("Failed to refresh session:", error);
      await logout();
    }
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    login,
    signup,
    logout,
    resetPassword,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

