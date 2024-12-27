import { Store } from "@tauri-apps/plugin-store";
import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";

export interface GlobalContextType {
  hasPasswordPage: boolean | null;
  setHasPassword: React.Dispatch<React.SetStateAction<boolean | null>>;
  savedPass: string;
  setSavedPass: React.Dispatch<React.SetStateAction<string>>;
  securityPassed: boolean;
  setSecurityPassed: React.Dispatch<React.SetStateAction<boolean>>;
}

const GlobalContext = createContext<GlobalContextType | null>(null)
export const GlobalProvider = ({ children }: PropsWithChildren) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [securityPassed, setSecurityPassed] = useState<boolean>(false);
  const [hasPasswordPage, setHasPassword] = useState<boolean | null>(null);
  const [savedPass, setSavedPass] = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      const store = new Store('store.bin');
      const pass: any = await store.get<string>('app-password');
      console.log(pass)
      setHasPassword(!!pass);
      setSavedPass(pass);
      setLoading(false);
    })()
  }, [])

  if(loading) return null;
  
  return (
    <GlobalContext.Provider value={{
      hasPasswordPage, 
      setHasPassword,
      savedPass,
      setSavedPass,
      securityPassed,
      setSecurityPassed,
    }}>
      {children}
    </GlobalContext.Provider>
  )
}

export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error('useGlobal must be used within a GlobalProvider');
  }
  return context;
}