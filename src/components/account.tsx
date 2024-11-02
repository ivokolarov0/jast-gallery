import { useQuery } from '@tanstack/react-query';

import { getPaginatedGames } from '../requests';
import LoginForm from "./login-form";
import Dasboard from './dashboard/dashboard';
import { useGlobalProvider } from '../contexts/global';
import Pagination from './pagination';

const Account = () => {
  const { page }: { page: number} = useGlobalProvider() as { page: number, setPage: (page: number) => void };
  const { data, isLoading } = useQuery({
    queryKey: ['games', page, ''],
    queryFn: ({ queryKey }) => getPaginatedGames(queryKey[1] as number, queryKey[2] as string),
  })

  return (
    <div>
      {isLoading && <div>Loading...</div>}
      {!isLoading && !data?.[0] && <LoginForm />}
      {!isLoading && data?.[0] && <Dasboard items={data[0].products} />}
      {!isLoading && data?.[0] && <Pagination pages={data?.[0].pages} />}
    </div>
  )
}

export default Account