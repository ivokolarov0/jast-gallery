import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useSearch } from '@tanstack/react-router';

import { Product } from '@requests/get-paginated-games';
import { removeGameTag, setGameTag } from '@requests/set-user-game-tags';

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
  const { id } = useParams({ from: '/game/$id' });
  const { page, search, userGameTags, attributes, taxons } = useSearch({ from: '/game/$id' }) as {
    page: string;
    search: string;
    userGameTags: string;
    attributes: string;
    taxons: string;
  };
  const currentTag = game?.variant?.userGameTags.find((tag) => tag.type === item.value);
  const [tag, setTag] = useState<any>(currentTag);

  const invalidateQuery = () => {
    queryClient.invalidateQueries({
      queryKey: ['searched-games', page, search, userGameTags, attributes, taxons]
    });
    queryClient.invalidateQueries({
      queryKey: ['game', id]
    });
  }

  const removeMutation = useMutation({
    mutationFn: ({ gameId, tagId }: { gameId: number; tagId: number }) => removeGameTag(gameId, tagId),
    onSuccess: invalidateQuery,
    onError: (error) => {
      console.log(error)
    }
  });
  const addMutation = useMutation({
    mutationFn: ({ gameId, type }: { gameId: number, type: TypeProp }) => setGameTag(gameId, type),
    onSuccess: (data) => {
      invalidateQuery();
      if(data?.[0]) {
        setTag(data[0]);
      }
    },
    onError: (error) => {
      console.log(error)
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    invalidateQuery();

    if(!game || tag === null) {
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
        tagId: tag?.id
      })
    }
  }

  const isDisable = addMutation.status === 'pending' || removeMutation.status === 'pending';

  return (
    <div className="custom-checkbox">
      <label>
        <input
          type="checkbox"
          name="status"
          value={item.value}
          onChange={handleChange}
          disabled={isDisable}
          defaultChecked={currentTag}
        />
        <span />
        {item.title}
      </label>
    </div>
  )
}

export default StatusTagsItem