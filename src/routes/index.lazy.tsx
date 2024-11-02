import { createLazyFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'

import { getPaginatedGames } from '../requests'
import LoginForm from '../components/login-form'
import Dashboard from '../components/dashboard/dashboard'
import { useGlobalProvider } from '../contexts/global'

export const Route = createLazyFileRoute('/')({
  component: () => {
    const { page }: { page: number } = useGlobalProvider() as {
      page: number
      setPage: (page: number) => void
    }
    const { data, isLoading } = useQuery({
      queryKey: ['games', page, ''],
      queryFn: ({ queryKey }) =>
        getPaginatedGames(queryKey[1] as number, queryKey[2] as string),
    })

    return (
      <div>
        {isLoading && <div>Loading...</div>}
        {!isLoading && !data?.[0] && <LoginForm />}
        {!isLoading && data?.[0] && <Dashboard items={data[0].products} pages={data?.[0].pages} />}
      </div>
    )
  },
})
