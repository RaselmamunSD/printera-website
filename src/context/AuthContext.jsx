"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

const readStoredUser = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const rawUser = localStorage.getItem("user");
  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch {
    return rawUser;
  }
};

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setAccessToken(localStorage.getItem("access_token"));
    setUser(readStoredUser());
    setLoading(false);
  }, []);

  useEffect(() => {
    const handleStorage = () => {
      setAccessToken(localStorage.getItem("access_token"));
      setUser(readStoredUser());
    };

    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const login = ({ access, refresh, user: nextUser } = {}) => {
    if (access) {
      localStorage.setItem("access_token", access);
      setAccessToken(access);
    }

    if (refresh) {
      localStorage.setItem("refresh_token", refresh);
    }

    if (nextUser !== undefined) {
      const storedUser = typeof nextUser === "string" ? nextUser : JSON.stringify(nextUser);
      localStorage.setItem("user", storedUser);
      setUser(nextUser);
    } else {
      setUser(readStoredUser());
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setAccessToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      accessToken,
      user,
      isAuthenticated: Boolean(accessToken),
      loading,
      login,
      logout,
    }),
    [accessToken, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }
  return context;
}
