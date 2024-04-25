import { createContext, useContext, useEffect, useState } from "react";
import { logout, onUserStateChanged } from '../api/firebase';

const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onUserStateChanged(newUser => {
      setUser(newUser);
    });
    
    return () => unsubscribe(); // 클린업 함수에서 리스너 해제
  }, []); // 의존성 배열 비워짐

  return (
    <AuthContext.Provider value={{ user, logout }}>
      { children }
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const auth = useContext(AuthContext);
  return auth;
}
