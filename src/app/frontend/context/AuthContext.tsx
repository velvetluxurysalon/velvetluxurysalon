import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  onAuthChange, 
  getCurrentCustomer, 
  registerCustomer, 
  loginCustomer, 
  logoutCustomer 
} from '../services/firebaseService';

interface AuthContextType {
  user: any | null;
  customerData: any | null;
  loading: boolean;
  error: string | null;
  signup: (email: string, password: string, name: string, phone: string) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [customerData, setCustomerData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (authUser) => {
      setLoading(true);
      try {
        if (authUser) {
          setUser(authUser);
          const customer = await getCurrentCustomer(authUser.uid);
          setCustomerData(customer || null);
        } else {
          setUser(null);
          setCustomerData(null);
        }
        setError(null);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        console.error('Auth error:', err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const signup = async (email: string, password: string, name: string, phone: string) => {
    try {
      setLoading(true);
      setError(null);
      const user = await registerCustomer(email, password, name, phone);
      return user;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const user = await loginCustomer(email, password);
      return user;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      await logoutCustomer();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    customerData,
    loading,
    error,
    signup,
    login,
    logout,
    isAuthenticated: !!user,
    showLoginModal,
    setShowLoginModal
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
