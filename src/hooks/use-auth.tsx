
import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  isAuthenticated: boolean;
  userEmail: string | null;
  userName: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifiez l'état d'authentification au chargement initial
    const auth = localStorage.getItem("isAuthenticated") === "true";
    const email = localStorage.getItem("userEmail");
    const name = localStorage.getItem("userName");

    setIsAuthenticated(auth);
    setUserEmail(email);
    setUserName(name);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    // Simuler une requête d'authentification
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userEmail", email);
        
        setIsAuthenticated(true);
        setUserEmail(email);
        
        resolve();
      }, 1000);
    });
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    // Simuler une requête d'enregistrement
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userName", name);
        
        setIsAuthenticated(true);
        setUserEmail(email);
        setUserName(name);
        
        resolve();
      }, 1000);
    });
  };

  const logout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    
    setIsAuthenticated(false);
    setUserEmail(null);
    setUserName(null);
    
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userEmail, userName, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === null) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  
  return context;
};
