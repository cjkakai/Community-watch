import React, { createContext, useState, useEffect } from "react";
import { policeOfficers } from "../data/mockData";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (from localStorage)
    const savedUser = localStorage.getItem("communityWatchUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Mock authentication - in real app, this would call the API
    const officer = policeOfficers.find(o => o.email === email);
    
    if (officer && password === "password123") {
      const userData = {
        id: officer.id,
        name: officer.name,
        email: officer.email,
        role: officer.role,
        badge_number: officer.badge_number,
        rank: officer.rank
      };
      
      setUser(userData);
      localStorage.setItem("communityWatchUser", JSON.stringify(userData));
      return { success: true, user: userData };
    }
    
    return { success: false, error: "Invalid email or password" };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("communityWatchUser");
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
