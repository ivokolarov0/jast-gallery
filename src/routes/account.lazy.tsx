import { createLazyFileRoute } from '@tanstack/react-router';
import { useQuery, keepPreviousData } from '@tanstack/react-query';

import { useGlobalProvider } from '@contexts/global';
import getPaginatedGames from '@requests/get-paginated-games';
import Dashboard from '@components/dashboard/dashboard';
import SearchForm from '@components/search-form';
import Loading from '@components/loading';

export const Route = createLazyFileRoute('/account')({
  component: () => {
    const { page, search } = useGlobalProvider();
    const { data, isLoading } = useQuery({
      queryKey: ['games', page, search],
      placeholderData: keepPreviousData,
      queryFn: ({ queryKey }) => getPaginatedGames(queryKey[1] as string, queryKey[2] as string),
    });

    return (
      <>
        {data?.[0] && <SearchForm />}
        {isLoading && <Loading />}
        {data?.[0]?.['@id'] && <Dashboard items={data[0].products} pages={data?.[0].pages} />}
      </>
    )
  },
})
