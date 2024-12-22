import { ReactNode } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

import getMe from '@requests/get-me';
import Header from '@components/header/header';

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ['me'],
    placeholderData: keepPreviousData,
    queryFn: () => getMe(),
  });

  if(isLoading) return null;

  return (
    <div className="wrapper">
      <Header logged={data?.[0]?.id} />
      <main className="main">
        <div className="shell">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout