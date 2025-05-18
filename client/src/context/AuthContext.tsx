import { createContext, useContext, useEffect, useState } from "react";
import { AuthReturn } from "../types";

const AuthContext = createContext({});

function parseJwt(token: string) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
}

export const AuthProvider = ({ children }: any) => {
  const [authToken, setAuthToken] = useState(
    localStorage.getItem("jwt") || null
  );
  const [username, setUsername] = useState<string>();
  const [isRegister, setIsRegister] = useState(true);

  useEffect(() => {
    if (isTokenExpired()) {
      removeToken();
    }
  }, []);

  const saveToken = (data: AuthReturn) => {
    console.log("data", data);
    setAuthToken(data.token);
    setUsername(data.username);
    localStorage.setItem("jwt", data.token);

    // Decode JWT to get expiry
    const payload = parseJwt(data.token);
    if (payload && payload.exp) {
      console.log("payload", payload);
      localStorage.setItem("jwt_exp", payload.exp.toString());
    }
  };

  const initUsername = () => {
    if(authToken){
        const payload = parseJwt(authToken)
        setUsername(payload.username)
    }
  }

  const isTokenExpired = () => {
    const exp = localStorage.getItem("jwt_exp");
    if (!exp) return true;
    const now = Math.floor(Date.now() / 1000); // current time in seconds
    return now > parseInt(exp, 10);
  };

  const removeToken = () => {
    setAuthToken(null);
    localStorage.removeItem("jwt");
    localStorage.removeItem("jwt_exp");
  };

  return (
    <AuthContext.Provider
      value={{
        authToken,
        saveToken,
        isRegister,
        setIsRegister,
        username,
        isTokenExpired,
        removeToken,
        initUsername
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
