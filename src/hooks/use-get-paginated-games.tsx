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

  const { data, isLoading } = useQuery({
    queryKey: ['games', page, search, attributes, taxons, userGameTags],
    queryFn: ({ queryKey }) => getPaginatedGames({
      page: queryKey[1],
      search: queryKey[2],
      attributes: queryKey[3],
      taxons: queryKey[4],
      userGameTags: queryKey[5]
    }),
  });

  return { data, isLoading }
}

export default useGetPaginatedGames