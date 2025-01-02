import { Product } from '@requests/get-paginated-games';
import { removeGameTag, setGameTag } from '@requests/set-user-game-tags';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';

type PropsType = {
  game: Product | undefined,
  item: {
    value: string,
    title: string
  }
}

type TypeProp = 'finished' | 'love_it' | 'next_to_play' | 'recommended'

const StatusTagsItem = ({ item, game }: PropsType) => {
  const queryClient = useQueryClient();
  const { page, search } = useSearch({ from: '/game/$id' }) as {
    page: string;
    search: string;
  };
  const currentTag = game?.variant?.userGameTags.find((tag) => tag.type === item.value);
  const invalidateQuery = () => {
    queryClient.invalidateQueries({
      queryKey: ['searched-games', page, search]
    });
  }

  const removeMutation = useMutation({
    mutationFn: ({ gameId, tagId }: { gameId: number; tagId: number }) => removeGameTag(gameId, tagId),
    onSuccess: invalidateQuery
  });
  const addMutation = useMutation({
    mutationFn: ({ gameId, type }: { gameId: number, type: TypeProp }) => setGameTag(gameId, type),
    onSuccess: invalidateQuery
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    invalidateQuery();

    if(!game) {
      return;
    }

    const gameId = game?.variant.gameId;

    if(e.target.checked) {
      addMutation.mutate({
        gameId,
        type: item.value as TypeProp
      });
    } else {
      removeMutation.mutate({
        gameId, 
        tagId: currentTag.id
      })
    }
  }

  

  return (
    <div className="custom-checkbox">
      <label>
        <input
          type="checkbox"
          name="status"
          value={item.value}
          onChange={handleChange}
          defaultChecked={currentTag}
        />
        <span></span>
        {item.title}
      </label>
    </div>
  )
}

export default StatusTagsItem