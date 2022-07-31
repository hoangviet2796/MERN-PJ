import React, { createContext, useCallback, useState } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  userId: "",
  token: null,
  login: () => {},
  logout: () => {},
});

function AuthProvider({ children }) {
  const [token, setToken] = useState();
  const [userId, setUserId] = useState();
  const [tokenExpirationDate, setTokenExpirationDate] = useState();

  const login = useCallback((uid, token, expirationDate) => {
    setUserId(uid);
    setToken(token);
    const expiredTokenDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(expiredTokenDate);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uid,
        token,
        expiration: expiredTokenDate.toISOString(),
      })
    );
  }, []);

  const logout = useCallback(() => {
    setUserId(null);
    setTokenExpirationDate(null);
    setToken(null);
    localStorage.removeItem("userData");
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
