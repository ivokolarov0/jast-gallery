import ContentLoader from 'react-content-loader';
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import DOMPurify from 'dompurify';

import getPaginatedGames, { Product } from '@requests/get-paginated-games';
import getGame from '@requests/get-game';
import BackBtn from '@components/back-btn'
import GameInfo from '@components/game-info/game-info'
import Played from '@components/played';
import GameVideo from './game-video';
import GameImages from './game-images';
import GameSidebar from './game-sidebar';
import GameLoader from './game-loader';

type GameProps = {
  page: string;
  search: string;
  id: string;
}

const Game = ({ page, search, id }:GameProps) => {
  const { data } = useQuery({
    queryKey: ['game', id],
    placeholderData: keepPreviousData,
    queryFn: ({ queryKey }) => getGame(queryKey[1]),
    
  });
  const response = data?.[0];
  const { data: searchedGames, isRefetching } = useQuery({
    queryKey: ['searched-games', page, search],
    queryFn: () => getPaginatedGames('1', response?.name),
    placeholderData: keepPreviousData,
    enabled: !!response
  })
  const findCurrentGame = searchedGames?.[0]?.products?.find((item: Product) => item.variant.productCode === response?.code);

  if (!response) {
    return <GameLoader />
  }

  const descriptionSanitize = DOMPurify.sanitize(response?.description);

  return (
    <div className="game-entry">
      <div className="game-entry__top">
        <BackBtn page={page} />
        
        {findCurrentGame && <Played data={findCurrentGame.variant} page={page} search={search} isRefetching={isRefetching} />}
      </div>
      <div className="game-entry__header">
        <h2>{response.name}</h2>
      </div>
      <div className="game-entry__inner">
        <div className="game-entry__col">
          <GameImages data={response} />
          <GameVideo data={response} />
          <div
            className="game-entry__desc"
            dangerouslySetInnerHTML={{ __html: descriptionSanitize }}
          />
          {response?.attributes && <GameInfo attributes={response?.attributes} />}
        </div>
        <GameSidebar data={response} page={page} search={search} />
      </div>
    </div>
  )
}

export default Game