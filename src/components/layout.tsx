import { ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';

import Header from '@components/header/header';
import useGetMe from '@hooks/use-get-me';

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const { data, isLoading } = useGetMe();

  if(isLoading) return null;

  return (
    <div className="wrapper">
      <Header logged={!!data?.[0]?.id} />
      <main className="main">
        <div className="shell">
          {children}
        </div>
        <ToastContainer />
      </main>
    </div>
  );
};

export default Layout