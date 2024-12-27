import getCatalog from '@requests/get-catalog';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

const useGetLatestFames = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['latest-games'],
    placeholderData: keepPreviousData,
    queryFn: () => getCatalog('new-titles_en_US'),
  });

  return { data, isLoading }
}

export default useGetLatestFames