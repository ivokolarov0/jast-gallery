import { createContext, ReactNode, useContext, useState } from "react";

const Context = createContext({})

interface GlobalProviderProps {
  children: ReactNode
};

export const GlobalProvider = ({ children }: GlobalProviderProps) => {
  const [page, setPage] = useState('1');
  const [search, setSearch] = useState('');
  const [isloggedIn, setIsLoggedIn] = useState(false);
  return (
    <Context.Provider value={{
      page,
      setPage,
      search,
      setSearch,
      isloggedIn,
      setIsLoggedIn,
    }}>
      {children}
    </Context.Provider>
  )
}

interface GlobalContext {
  isLoggedIn: boolean;
  setIslLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  page: number | string;
  setPage: React.Dispatch<React.SetStateAction<number | string>>;
  search: number | string;
  setSearch: React.Dispatch<React.SetStateAction<number | string>>;
}

export const useGlobalProvider = (): GlobalContext => {
  const context = useContext(Context);

  if (!context) {
    throw new Error('useGlobalProvider must be used within a GlobalProvider');
  }

  return context as GlobalContext;
}