import getPaginatedGames from '@requests/get-paginated-games'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useSearch } from '@tanstack/react-router'

type PropType = {
  response: any;
  from: any;
}

const useGetSearchedGames = ({ response, from }: PropType) => {
  const { page, search, userGameTags, attributes, taxons } = useSearch({ from }) as {
    page: string;
    search: string;
    userGameTags: string;
    attributes: string;
    taxons: string;
  };
  const { data, isRefetching } = useQuery({
    queryKey: ['searched-games', page, search, userGameTags, attributes, taxons],
    queryFn: () => getPaginatedGames({ page: '1', search: response?.name, userGameTags, attributes, taxons }),
    placeholderData: keepPreviousData,
    enabled: !!response
  })

  return { data, isRefetching }
}

export default useGetSearchedGames