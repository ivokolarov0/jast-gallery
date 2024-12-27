import getGame from '@requests/get-game'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

type GameProps = {
  id: string;
}

const useGetGame = ({ id }: GameProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ['game', id],
    placeholderData: keepPreviousData,
    queryFn: ({ queryKey }) => getGame(queryKey[1]),
    
  })
  return {data, isLoading}
}

export default useGetGame