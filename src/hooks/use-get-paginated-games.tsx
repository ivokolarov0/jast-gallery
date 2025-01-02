import { useQuery } from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';

import getPaginatedGames from '@requests/get-paginated-games';

const useGetPaginatedGames = (from: any) => {
  const { page, search, attributes, taxons, userGameTags } = useSearch({ from }) as {
    page: string;
    search: string;
    attributes: string;
    taxons: string;
    userGameTags: string;
  };
  console.log(userGameTags)
  const { data, isLoading } = useQuery({
    queryKey: ['games', page, search, attributes, taxons, userGameTags],
    queryFn: ({ queryKey }) => getPaginatedGames(queryKey[1], queryKey[2], queryKey[3], queryKey[4], queryKey[5]),
  });

  return { data, isLoading }
}

export default useGetPaginatedGames