import { useQuery } from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';

import getPaginatedGames from '@requests/get-paginated-games';

const useGetPaginatedGames = (from: any) => {
  const { page, search } = useSearch({ from }) as {
    page: string;
    search: string;
  };
  const { data, isLoading } = useQuery({
    queryKey: ['games', page, search],
    queryFn: ({ queryKey }) => getPaginatedGames(queryKey[1], queryKey[2]),
  });

  return { data, isLoading }
}

export default useGetPaginatedGames