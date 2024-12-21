import { ReactNode } from 'react';
import Header from '@components/header/header';

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="wrapper">
      <Header />
      <main className="main">
        <div className="shell">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout