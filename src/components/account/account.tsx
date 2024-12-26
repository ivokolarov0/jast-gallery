import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';

import getPaginatedGames from '@requests/get-paginated-games';
import Dashboard from '@components/dashboard/dashboard';
import SearchForm from '@components/search-form';
import AccountLoader from './account-loader';

const Account = () => {
  const { page, search } = useSearch({ from: '/account' }) as {
    page: string;
    search: string;
  };
  const { data, isLoading } = useQuery({
    queryKey: ['games', page, search],
    queryFn: ({ queryKey }) => getPaginatedGames(queryKey[1], queryKey[2]),
  });

  const item = data?.[0];

  return (
    <>
      <SearchForm />
      {isLoading ? <AccountLoader /> : item?.['@id'] && <Dashboard items={item.products} pages={item.pages} />}
    </>
  );
};

export default Account;