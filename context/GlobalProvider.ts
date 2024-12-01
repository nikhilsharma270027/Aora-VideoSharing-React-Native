import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getCurrentUser } from "@/lib/appwrite";

// Define the context type
interface GlobalContextType {
  isLogged: boolean;
  setIsLogged: (value: boolean) => void;
  user: string | null;
  setUser: (value: string | null) => void;
  loading: boolean;
}

// Create the context
const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

// Create a custom hook for consuming the context
export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};

// Create the provider component
interface Props {
  children: ReactNode;
}

const GlobalProvider = ({ children }: Props) => {
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [user, setUser] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getCurrentUser()
      .then((res: any) => {
        if (res) {
          setIsLogged(true);
          setUser(res);
        } else {
          setIsLogged(false);
          setUser(null);
        }
      })
      .catch((error) => {
        console.error("Error fetching current user:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        setIsLogged,
        user,
        setUser,
        loading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
