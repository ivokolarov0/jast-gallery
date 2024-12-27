import DOMPurify from 'dompurify';

import { Product } from '@requests/get-paginated-games';
import BackBtn from '@components/back-btn'
import GameInfo from '@components/game-info/game-info'
import Played from '@components/played';
import GameVideo from './game-video';
import GameImages from './game-images';
import GameSidebar from './game-sidebar';
import GameLoader from './game-loader';
import useGetGame from '@hooks/use-get-game';
import useGetSearchedGames from '@hooks/use-get-searched-games';

type GameProps = {
  page: string;
  search: string;
  id: string;
}

const Game = ({ page, search, id }:GameProps) => {
  const { data } = useGetGame({ id });
  const response = data?.[0];
  const { data: searchedGames, isRefetching } = useGetSearchedGames({ response, from: '/game/$id' });
  const findCurrentGame = searchedGames?.[0]?.products?.find((item: Product) => item.variant.productCode === response?.code);

  if (!response) {
    return <GameLoader />
  }

  const descriptionSanitize = DOMPurify.sanitize(response?.description);

  return (
    <div className="game-entry">
      <div className="game-entry__top">
        <BackBtn />
        
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