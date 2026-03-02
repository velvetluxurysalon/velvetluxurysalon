import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  onAuthChange,
  getCurrentCustomer,
  registerCustomer,
  loginWithPhone,
  logoutCustomer,
  loginUser,
  getCurrentUserRole,
  loginWithGoogle,
  completeGoogleProfile,
} from "../services/firebaseService";

interface AuthContextType {
  user: any | null;
  customerData: any | null;
  userRole: string | null;
  loading: boolean;
  error: string | null;
  signup: (
    email: string,
    password: string,
    name: string,
    phone: string,
  ) => Promise<any>;
  login: (phone: string, password: string) => Promise<any>;
  loginStaff: (email: string, password: string) => Promise<any>;
  loginWithGoogle: () => Promise<any>;
  completeGoogleProfile: (
    uid: string,
    phone: string,
    dob: string,
  ) => Promise<any>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isReceptionist: boolean;
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [customerData, setCustomerData] = useState<any | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (authUser) => {
      setLoading(true);
      try {
        if (authUser) {
          setUser(authUser);

          // Try to fetch role from users collection (staff/receptionist)
          const role = await getCurrentUserRole(authUser.uid);
          if (role) {
            setUserRole(role);
            setCustomerData(null); // Staff doesn't use customer data
          } else {
            // Try to fetch as customer
            const customer = await getCurrentCustomer(authUser.uid);
            setCustomerData(customer || null);
            setUserRole("customer");
          }
        } else {
          setUser(null);
          setCustomerData(null);
          setUserRole(null);
        }
        setError(null);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        console.error("Auth error:", err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const signup = async (
    email: string,
    password: string,
    name: string,
    phone: string,
  ) => {
    try {
      setLoading(true);
      setError(null);
      const user = await registerCustomer(email, password, name, phone);
      return user;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (phone: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const user = await loginWithPhone(phone, password);
      return user;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginStaff = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const user = await loginUser(email, password);
      return user;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogleHandler = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await loginWithGoogle();
      return result;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const completeGoogleProfileHandler = async (
    uid: string,
    phone: string,
    dob: string,
  ) => {
    try {
      setLoading(true);
      setError(null);
      const result = await completeGoogleProfile(uid, phone, dob);
      return result;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
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
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    customerData,
    userRole,
    loading,
    error,
    signup,
    login,
    loginStaff,
    loginWithGoogle: loginWithGoogleHandler,
    completeGoogleProfile: completeGoogleProfileHandler,
    logout,
    isAuthenticated: !!user,
    isReceptionist: userRole === "receptionist",
    showLoginModal,
    setShowLoginModal,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
