import { getGameDB } from '@requests/db';
import { keepPreviousData, useQuery } from '@tanstack/react-query'

type GameProps = {
  id: string;
}

const useGetGameDB = ({ id }: GameProps) => {
  return useQuery({
    queryKey: ['game-db', id],
    placeholderData: keepPreviousData,
    queryFn: ({ queryKey }) => getGameDB(queryKey[1]),
  })
}

export default useGetGameDB