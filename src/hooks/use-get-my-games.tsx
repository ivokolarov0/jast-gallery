import { useQuery } from '@tanstack/react-query';

import getMyGames from '@requests/get-my-games';

const useGetMyGames = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['my-games'],
    queryFn: () => getMyGames("1", "", 100),
  });

  return { data, isLoading }
}

export default useGetMyGames