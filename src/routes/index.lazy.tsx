import { createLazyFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'

import { useGlobalProvider } from '../contexts/global'
import { getPaginatedGames } from '../requests'
import LoginForm from '../components/login-form'
import Dashboard from '../components/dashboard/dashboard'
import SearchForm from '../components/search-form';


type GlobalType = {
  page: string
  search: string,
}

export const Route = createLazyFileRoute('/')({
  component: () => {
    const { page, search }: GlobalType = useGlobalProvider() as GlobalType;
    const { data, isLoading } = useQuery({
      queryKey: ['games', page, search],
      queryFn: ({ queryKey }) =>
        getPaginatedGames(queryKey[1] as string, queryKey[2] as string),
    })

    return (
      <div>
        <SearchForm />
        {isLoading && <div>Loading...</div>}
        {!isLoading && !data?.[0] && <LoginForm />}
        {!isLoading && data?.[0] && <Dashboard items={data[0].products} pages={data?.[0].pages} />}
      </div>
    )
  },
})
