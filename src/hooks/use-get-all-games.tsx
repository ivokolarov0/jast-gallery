import { useQuery } from '@tanstack/react-query';

import getAllGames from '@requests/get-all-games';

const useGetAllGames = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['my-games'],
    queryFn: () => getAllGames("1", "", 100),
  });

  return { data, isLoading }
}

export default useGetAllGames