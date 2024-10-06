import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: localStorage.getItem('access_token') ? true : false,
    token: localStorage.getItem('access_token'),

  });

  useEffect(() => {
    const token = localStorage.getItem('access_token');


    if (token) {
      setAuthState({ isAuthenticated: true, token });
    } else {
      setAuthState({ isAuthenticated: false, token: null });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};
