import getPaginatedGames from '@requests/get-paginated-games'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useSearch } from '@tanstack/react-router'

type PropType = {
  response: any;
  from: any;
}

const useGetSearchedGames = ({ response, from }: PropType) => {
  const { page, search } = useSearch({ from }) as {
    page: string;
    search: string;
  };
  const { data, isRefetching } = useQuery({
    queryKey: ['searched-games', page, search],
    queryFn: () => getPaginatedGames('1', response?.name),
    placeholderData: keepPreviousData,
    enabled: !!response
  })

  return { data, isRefetching }
}

export default useGetSearchedGames