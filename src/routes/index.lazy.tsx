import { createLazyFileRoute } from '@tanstack/react-router'
import { useQuery, keepPreviousData } from '@tanstack/react-query'

import { useGlobalProvider } from '../contexts/global'
import { getPaginatedGames } from '../requests'
import LoginForm from '../components/login-form'
import Dashboard from '../components/dashboard/dashboard'
import SearchForm from '../components/search-form';
import Loading from '../components/loading'

export const Route = createLazyFileRoute('/')({
  component: () => {
    const { page, search } = useGlobalProvider();
    const { data, isLoading, refetch } = useQuery({
      queryKey: ['games', page, search],
      placeholderData: keepPreviousData,
      queryFn: ({ queryKey }) => getPaginatedGames(queryKey[1] as string, queryKey[2] as string),
    });
    const loading = isLoading;

    if(data?.[0]?.code === 401) {
      return (
        <LoginForm refetch={refetch} />
      );
    }

    return (
      <div>
        {data?.[0] && <SearchForm />}
        {loading && <Loading />}
        {!loading && !data?.[0] && <LoginForm refetch={refetch} />}
        {data?.[0]?.['@id'] && <Dashboard items={data[0].products} pages={data?.[0].pages} />}
      </div>
    )
  },
})
