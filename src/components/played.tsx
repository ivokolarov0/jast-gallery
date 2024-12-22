import { useMutation, useQueryClient } from '@tanstack/react-query';
import { markAsPlayed, removeAsPlayed } from '@requests/set-played';
import Loading from '@components/loading';

type Tags = {
  '@id': string,
  '@type': string,
  id: number
  type: string
}

const Played = ({ data, page, search }: any) => {
  const queryClient = useQueryClient();
  const isPlayed = data.userGameTags.find((item: Tags) => item.type === 'finished');

  const invalidateQuery = () => {
    queryClient.invalidateQueries({
      queryKey: ['searched-games', page, search]
    })
  }

  const removeMutation = useMutation({
    mutationFn: ({ gameId, tagId }: { gameId: number; tagId: number }) => removeAsPlayed(gameId, tagId),
    onSuccess: invalidateQuery
  });
  const addMutation = useMutation({
    mutationFn: ({ gameId }: { gameId: number }) => markAsPlayed(gameId),
    onSuccess: invalidateQuery
  });

  const handleClick = async () => {
    if(isPlayed) {
      removeMutation.mutate({
        gameId: data.gameId, 
        tagId: isPlayed.id
      })
    } else {
      addMutation.mutate({
        gameId: data.gameId
      });
    }
  };

  if(removeMutation.isPending || addMutation.isPending) {
    return <Loading />
  }

  if(isPlayed) {
    return (
      <button className="btn btn--red" onClick={handleClick}>Remove as Played</button>
    )
  }

  return (
    <button className="btn btn--green" onClick={handleClick}>Mark as Played</button>
  )
}

export default Played