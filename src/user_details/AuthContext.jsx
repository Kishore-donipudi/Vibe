import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext();

const API_URL = "https://postgre-api.onrender.com";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("musicapp_user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem("musicapp_user");
      }
    }
    setAuthLoading(false);
  }, []);

  // Persist user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("musicapp_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("musicapp_user");
    }
  }, [user]);

  const signup = useCallback(async (username, email, password) => {
    const res = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Signup failed");
    setUser(data.user);
    return data.user;
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (updates) => {
    if (!user) throw new Error("Not logged in");
    const res = await fetch(`${API_URL}/users/${user.user_id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Update failed");
    setUser(data.user);
    return data.user;
  }, [user]);

  const deleteAccount = useCallback(async () => {
    if (!user) throw new Error("Not logged in");
    const res = await fetch(`${API_URL}/users/${user.user_id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Delete failed");
    setUser(null);
  }, [user]);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    const res = await fetch(`${API_URL}/users/${user.user_id}`);
    const data = await res.json();
    if (res.ok) setUser(data);
  }, [user]);

  return (
    <AuthContext.Provider
      value={{ user, authLoading, signup, login, logout, updateProfile, deleteAccount, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
