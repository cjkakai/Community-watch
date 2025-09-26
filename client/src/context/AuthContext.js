import React, { createContext, useState, useEffect } from "react";

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

  const login = async (email, password) => {
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        // Fetch user details after successful login
        const userResponse = await fetch('/officers');
        const officers = await userResponse.json();
        const currentUser = officers.find(officer => officer.email === email);

        if (currentUser) {
          const userData = {
            id: currentUser.id,
            name: currentUser.name,
            email: currentUser.email,
            role: currentUser.role,
            badge_number: currentUser.badge_number,
            rank: currentUser.rank
          };
          
          setUser(userData);
          localStorage.setItem("communityWatchUser", JSON.stringify(userData));
          return { success: true, user: userData };
        }
      }
      
      return { success: false, error: data.error || "Login failed" };
    } catch (error) {
      return { success: false, error: "Network error occurred" };
    }
  };

  const logout = async () => {
    try {
      await fetch('/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem("communityWatchUser");
    }
  };

  const signup = async (userData) => {
    try {
      const response = await fetch('/officers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, user: data };
      }
      
      return { success: false, error: data.error || "Signup failed" };
    } catch (error) {
      return { success: false, error: "Network error occurred" };
    }
  };

  const value = {
    user,
    login,
    logout,
    signup,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
