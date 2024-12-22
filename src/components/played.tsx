import { useMutation, useQueryClient } from '@tanstack/react-query';
import { markAsPlayed, removeAsPlayed } from '@requests/set-played';
import type { ProductVariant } from '@requests/get-paginated-games';
import ContentLoader from 'react-content-loader';

type Tags = {
  '@id': string,
  '@type': string,
  id: number
  type: string
}

type PropsType = {
  data: ProductVariant,
  page: string,
  search: string,
  isRefetching: boolean
}

const Loader = () => (
  <ContentLoader
    viewBox="0 0 199 53"
    width={199}
    height={53}
    speed={1}
    backgroundColor={'var(--c-border)'}
    foregroundColor={'var(--c-blue)'}
  >
    <rect x="0" y="0" rx="5" ry="5" width="199" height="53" />
  </ContentLoader>
)

const Played = ({ data, page, search, isRefetching }: PropsType) => {
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

  if(removeMutation.isPending || addMutation.isPending || isRefetching) {
    return <Loader />
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